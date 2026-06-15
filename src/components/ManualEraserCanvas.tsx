import React, { useEffect, useRef } from 'react';

interface ManualEraserCanvasProps {
  removedBgURL: string;
  activeTool: 'select' | 'eraser' | 'restore';
  brushSize: number;
  brushSoftness: number;
  brushOpacity: number;
  zoom: number;
  workingCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  originalCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  setOrigWidth: (w: number) => void;
  setOrigHeight: (h: number) => void;
  saveToUndoStack: () => void;
  updateEditedCanvasSnapshot: () => void;
  showCursor: boolean;
  setShowCursor: (show: boolean) => void;
  cursorPos: { x: number; y: number };
  setCursorPos: (pos: { x: number; y: number }) => void;
  brightness: number;
  contrast: number;
  dropShadow: boolean;
  isSpacePressed: boolean;
  onCanvasUpdate?: (x: number, y: number) => void;
}

export const ManualEraserCanvas: React.FC<ManualEraserCanvasProps> = ({
  removedBgURL,
  activeTool,
  brushSize,
  brushSoftness,
  brushOpacity,
  zoom,
  workingCanvasRef,
  originalCanvasRef,
  setOrigWidth,
  setOrigHeight,
  saveToUndoStack,
  updateEditedCanvasSnapshot,
  showCursor,
  setShowCursor,
  cursorPos,
  setCursorPos,
  brightness,
  contrast,
  dropShadow,
  isSpacePressed,
  onCanvasUpdate,
}) => {
  // Drawing states
  const isDrawing = useRef<boolean>(false);
  const prevX = useRef<number | null>(null);
  const prevY = useRef<number | null>(null);

  // Synchronization refs for direct event listener isolation to avoid staleness
  const brushSizeRef = useRef<number>(brushSize);
  const brushOpacityRef = useRef<number>(brushOpacity);
  const brushSoftnessRef = useRef<number>(brushSoftness);
  const zoomRef = useRef<number>(zoom);
  const activeToolRef = useRef<'select' | 'eraser' | 'restore'>(activeTool);
  const isEraserActive = useRef<boolean>(activeTool === 'eraser');
  const isSpacePressedRef = useRef<boolean>(isSpacePressed);
  const onCanvasUpdateRef = useRef<((x: number, y: number) => void) | undefined>(onCanvasUpdate);

  // Sync state values to refs on each render in real-time
  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  useEffect(() => {
    brushOpacityRef.current = brushOpacity;
  }, [brushOpacity]);

  useEffect(() => {
    brushSoftnessRef.current = brushSoftness;
  }, [brushSoftness]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    activeToolRef.current = activeTool;
    isEraserActive.current = (activeTool === 'eraser');
  }, [activeTool]);

  useEffect(() => {
    isSpacePressedRef.current = isSpacePressed;
  }, [isSpacePressed]);

  useEffect(() => {
    onCanvasUpdateRef.current = onCanvasUpdate;
  }, [onCanvasUpdate]);

  // Circular Soft Brush Mask Generator using ctx.shadowBlur
  const createBrushMask = (size: number, softness: number, opacity: number) => {
    const brushCanvas = document.createElement('canvas');
    // Blur amount proportional to brush size and softness percentage
    const blurVal = (softness / 100) * (size / 2);
    
    // Add safety margin for the blur shadow
    const margin = Math.ceil(blurVal * 2);
    const canvasSize = size + margin * 2;
    brushCanvas.width = canvasSize;
    brushCanvas.height = canvasSize;
    
    const ctx = brushCanvas.getContext('2d');
    if (!ctx) return brushCanvas;
    
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;
    const radius = size / 2;
    
    if (softness <= 0) {
      // Crisp hard circle
      ctx.beginPath();
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity / 100})`;
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Soft brush using shadowBlur trick: draw circle offset, project shadow back
      ctx.shadowBlur = blurVal;
      ctx.shadowColor = `rgba(0, 0, 0, ${opacity / 100})`;
      ctx.shadowOffsetX = canvasSize;
      ctx.shadowOffsetY = 0;
      
      ctx.beginPath();
      // Draw outer circle so its shadow is centered perfectly on canvas (cx, cy)
      ctx.arc(cx - canvasSize, cy, radius - blurVal / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
      ctx.fill();
    }
    return brushCanvas;
  };

  // Direct canvas lifecycle setup - runs exactly once on mount when target loaded
  useEffect(() => {
    const canvas = workingCanvasRef.current;
    if (!canvas) return;

    // 1. Draw the background-removed image exactly once when mount loads
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = img.naturalWidth || img.width || 1200;
      const h = img.naturalHeight || img.height || 900;
      setOrigWidth(w);
      setOrigHeight(h);

      // Setup original cutout reference in memory
      if (originalCanvasRef.current) {
        const origCanvas = originalCanvasRef.current;
        origCanvas.width = w;
        origCanvas.height = h;
        const origCtx = origCanvas.getContext('2d');
        if (origCtx) {
          origCtx.clearRect(0, 0, w, h);
          origCtx.drawImage(img, 0, 0);
        }
      }

      // Setup the visible canvas
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0);
      }

      // Save initial state to snapshot preview URL
      updateEditedCanvasSnapshot();
    };
    img.src = removedBgURL;

    // 2. Coordinate conversion: screen to canvas space
    const getCoords = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return { x: 0, y: 0 };
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    // 3. Core Drawing Stroke Interpolator
    const drawStrokeSegment = (x: number, y: number) => {
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const size = brushSizeRef.current;
      const softness = brushSoftnessRef.current;
      const opacity = brushOpacityRef.current;
      const tool = activeToolRef.current;

      if (tool === 'select') return;

      // Ensure appropriate compositing
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      const blurVal = (softness / 100) * (size / 2);
      const margin = Math.ceil(blurVal * 2);
      const canvasSize = size + margin * 2;
      const halfSize = canvasSize / 2;

      // Draw the beautiful brush tip mask
      const mask = createBrushMask(size, softness, opacity);

      // Stagger points for smooth contiguous lines without dotted artifacts
      const points: { x: number; y: number }[] = [];
      if (prevX.current !== null && prevY.current !== null) {
        const dx = x - prevX.current;
        const dy = y - prevY.current;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const step = Math.max(1, size / 8);
        const steps = Math.ceil(distance / step);
        for (let i = 1; i <= steps; i++) {
          const ratio = i / steps;
          points.push({
            x: prevX.current + dx * ratio,
            y: prevY.current + dy * ratio
          });
        }
      } else {
        points.push({ x, y });
      }

      points.forEach(pt => {
        if (tool === 'eraser') {
          // Erase using destination-out composite draw
          ctx.drawImage(mask, pt.x - halfSize, pt.y - halfSize);
        } else if (tool === 'restore' && originalCanvasRef.current) {
          // Paint back original pixels
          const stampCanvas = document.createElement('canvas');
          stampCanvas.width = canvasSize;
          stampCanvas.height = canvasSize;
          const stampCtx = stampCanvas.getContext('2d');
          if (stampCtx) {
            stampCtx.drawImage(mask, 0, 0);
            stampCtx.globalCompositeOperation = 'source-in';
            stampCtx.drawImage(
              originalCanvasRef.current,
              pt.x - halfSize, pt.y - halfSize, canvasSize, canvasSize,
              0, 0, canvasSize, canvasSize
            );
            ctx.drawImage(stampCanvas, pt.x - halfSize, pt.y - halfSize);
          }
        }
      });

      // Restore composite flag
      ctx.globalCompositeOperation = 'source-over';
    };

    // 4. Mouse Event Handlers
    const onMouseDown = (e: MouseEvent) => {
      if (activeToolRef.current === 'select' || isSpacePressedRef.current) return;

      saveToUndoStack();
      isDrawing.current = true;

      const { x, y } = getCoords(e.clientX, e.clientY);
      prevX.current = x;
      prevY.current = y;

      drawStrokeSegment(x, y);

      if (onCanvasUpdateRef.current) {
        onCanvasUpdateRef.current(x, y);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setShowCursor(true);

      const { x, y } = getCoords(e.clientX, e.clientY);

      if (activeToolRef.current !== 'select' && onCanvasUpdateRef.current) {
        onCanvasUpdateRef.current(x, y);
      }

      if (!isDrawing.current || activeToolRef.current === 'select' || isSpacePressedRef.current) return;

      drawStrokeSegment(x, y);

      prevX.current = x;
      prevY.current = y;
    };

    const onMouseUp = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        prevX.current = null;
        prevY.current = null;
        updateEditedCanvasSnapshot();
      }
    };

    const onMouseLeave = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        prevX.current = null;
        prevY.current = null;
        updateEditedCanvasSnapshot();
      }
      setShowCursor(false);
    };

    // 5. Mobile Touch Event Handlers
    const onTouchStart = (e: TouchEvent) => {
      if (activeToolRef.current === 'select' || isSpacePressedRef.current || !e.touches[0]) return;
      e.preventDefault();

      saveToUndoStack();
      isDrawing.current = true;

      const touch = e.touches[0];
      const { x, y } = getCoords(touch.clientX, touch.clientY);
      prevX.current = x;
      prevY.current = y;

      drawStrokeSegment(x, y);

      if (onCanvasUpdateRef.current) {
        onCanvasUpdateRef.current(x, y);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      setCursorPos({ x: touch.clientX, y: touch.clientY });
      setShowCursor(true);

      const { x, y } = getCoords(touch.clientX, touch.clientY);

      if (activeToolRef.current !== 'select' && onCanvasUpdateRef.current) {
        onCanvasUpdateRef.current(x, y);
      }

      if (!isDrawing.current || activeToolRef.current === 'select' || isSpacePressedRef.current) return;
      e.preventDefault();

      drawStrokeSegment(x, y);

      prevX.current = x;
      prevY.current = y;
    };

    const onTouchEnd = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        prevX.current = null;
        prevY.current = null;
        updateEditedCanvasSnapshot();
      }
      setShowCursor(false);
    };

    // Attach raw event listeners directly to the HTML5 canvas
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchEnd);

    // Clean up event listeners on unmount
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  return (
    <canvas 
      ref={workingCanvasRef}
      className="w-full h-full object-contain pointer-events-auto transition-all"
      style={{ 
        background: 'transparent',
        filter: `brightness(${brightness}%) contrast(${contrast}%) ${dropShadow ? "drop-shadow(0px 20px 30px rgba(0,0,0,0.60))" : ""}`,
        cursor: activeTool === 'eraser' ? 'crosshair' : 'default'
      }}
      id="manual_eraser_canvas"
    />
  );
};
