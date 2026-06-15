import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Upload, Sparkles, Download, Sliders, Image as ImageIcon, 
  Loader2, Share2, Trash2, LogOut, Lock, Mail, User, Eye, EyeOff, 
  Check, CheckCircle2, ArrowLeft, ArrowRight, ChevronRight, Plus, 
  RefreshCw, Sun, Contrast, Folder, Layers, Grid, AlertCircle, Scissors,
  Search
} from "lucide-react";
// @ts-ignore
import { removeBackground } from "https://esm.sh/@imgly/background-removal@1.4.5";
import { ManualEraserCanvas } from "./components/ManualEraserCanvas";

// Mock templates and Unsplash assets
const BACKGROUND_TEMPLATES = [
  // NATURE (5 templates)
  { id: "nature-1", name: "Green Forest", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=95", category: "nature" as const },
  { id: "nature-2", name: "Misty Forest", url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&q=95", category: "nature" as const },
  { id: "nature-3", name: "Tropical", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=95", category: "nature" as const },
  { id: "nature-4", name: "Autumn Forest", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=95", category: "nature" as const },
  { id: "nature-5", name: "Flower Field", url: "https://images.unsplash.com/photo-1490750967868-88df5691cc9e?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1490750967868-88df5691cc9e?w=1920&q=95", category: "nature" as const },

  // CITY / STREET (4 templates)
  { id: "city-1", name: "City Nights", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=95", category: "city" as const },
  { id: "city-2", name: "Urban Street", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=95", category: "city" as const },
  { id: "city-3", name: "City Skyline", url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=95", category: "city" as const },
  { id: "city-4", name: "Rainy Night", url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1920&q=95", category: "city" as const },

  // SUNSET / SKY (4 templates)
  { id: "sunset-1", name: "Golden Sunset", url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1920&q=95", category: "sunset" as const },
  { id: "sunset-2", name: "Orange Sunset", url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=95", category: "sunset" as const },
  { id: "sunset-3", name: "Galaxy", url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=95", category: "sunset" as const },
  { id: "sunset-4", name: "Blue Sky", url: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=1920&q=95", category: "sunset" as const },

  // BEACH / OCEAN (3 templates)
  { id: "beach-1", name: "Tropical Beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=95", category: "beach" as const },
  { id: "beach-2", name: "Ocean Waves", url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=95", category: "beach" as const },
  { id: "beach-3", name: "Beach Sunset", url: "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=1920&q=95", category: "beach" as const },

  // STUDIO / WALL (4 templates)
  { id: "studio-1", name: "White Studio", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=95", category: "studio" as const },
  { id: "studio-2", name: "Grey Studio", url: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=1920&q=95", category: "studio" as const },
  { id: "studio-3", name: "Brick Wall", url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&q=95", category: "studio" as const },
  { id: "studio-4", name: "Bokeh Indoor", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", fullUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=95", category: "studio" as const }
];

const PREMIUM_SOLIDS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Navy", hex: "#0A0F2E" },
  { name: "Forest", hex: "#1B4332" },
  { name: "Burgundy", hex: "#6B0F1A" },
  { name: "Gold", hex: "#D4A017" },
  { name: "Soft Pink", hex: "#FFD6E0" },
  { name: "Sky Blue", hex: "#AEE2FF" }
];

const NATURE_BG = [BACKGROUND_TEMPLATES[0].fullUrl];
const WALL_BG = [BACKGROUND_TEMPLATES[16].fullUrl];
const STREET_BG = [BACKGROUND_TEMPLATES[5].fullUrl];
const SOLID_BG = ["#ffffff", "#000000"];
const RECOMMENDED_BG = [BACKGROUND_TEMPLATES[0].fullUrl];

const TEMPLATES = [
  { id: "ecommerce", title: "E-Commerce Clean", bg: "#ffffff", desc: "Solid pure white backdrop for professional product items." },
  { id: "cyberpunk", title: "Neon Cyberpunk", bg: BACKGROUND_TEMPLATES[5].fullUrl, desc: "Vibrant city night vibes with futuristic neon highlights." },
  { id: "linkedin", title: "LinkedIn Corporate", bg: "#AEE2FF", desc: "Studio soft sky blue background for a polished virtual look." },
  { id: "nature_travel", title: "Nature Sunrise", bg: BACKGROUND_TEMPLATES[0].fullUrl, desc: "Splendid natural lighting tailored for exterior portraits." }
];

interface SavedImage {
  id: string;
  name: string;
  originalUrl: string;
  resultUrl: string;
  date: string;
  dimensions: string;
}

export default function App() {
  // Navigation & User State
  const [currentPage, setCurrentPage] = useState<"login" | "register" | "forgot" | "dashboard">("login");
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar: string } | null>(null);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState<"editor" | "myimages" | "templates">("editor");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [originalImageURL, setOriginalImageURL] = useState<string | null>(null);
  const [removedBgBlob, setRemovedBgBlob] = useState<Blob | null>(null);
  const [removedBgURL, setRemovedBgURL] = useState<string | null>(null);
  const [selectedBg, setSelectedBg] = useState<string | null>(null);
  const [compositedURL, setCompositedURL] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState("");
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [bgCategory, setBgCategory] = useState<"all" | "nature" | "city" | "sunset" | "beach" | "studio" | "solid">("all");
  const [bgSearchTerm, setBgSearchTerm] = useState<string>("");
  const [exportQuality, setExportQuality] = useState<'original' | '2k' | '3k' | '4k'>('original');
  const [enableAISharpen, setEnableAISharpen] = useState<boolean>(true);
  const [sharpenIntensity, setSharpenIntensity] = useState<number>(0.25);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [dropShadow, setDropShadow] = useState<boolean>(false);
  const [customBgHex, setCustomBgHex] = useState<string>("#FF00FF");
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  
  // Custom background state variables & preloading status
  const [isApplyingBg, setIsApplyingBg] = useState<boolean>(false);
  const [compositedPreviewURL, setCompositedPreviewURL] = useState<string | null>(null);
  const [failedBgURLs, setFailedBgURLs] = useState<Record<string, boolean>>({});
  const [customBackgrounds, setCustomBackgrounds] = useState<{ id: string; name: string; url: string; category: "custom" }[]>([]);
  const [isThumbnailsLoading, setIsThumbnailsLoading] = useState<boolean>(false);
  
  // Manual Eraser / Restore Brush State variables
  const [activeTool, setActiveTool] = useState<'select' | 'eraser' | 'restore'>('select');
  const [brushSize, setBrushSize] = useState<number>(20);
  const [brushSoftness, setBrushSoftness] = useState<number>(0);
  const brushHardness = 100 - brushSoftness;
  const [brushOpacity, setBrushOpacity] = useState<number>(100);
  const isDrawing = useRef<boolean>(false);
  const prevX = useRef<number | null>(null);
  const prevY = useRef<number | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const workingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState<boolean>(false);
  const [editedCanvasURL, setEditedCanvasURL] = useState<string | null>(null);

  // Precision Magnifier Mirror View State and Logic
  const [showMirror, setShowMirror] = useState<boolean>(true);
  const [mirrorMag, setMirrorMag] = useState<number>(4);
  const mirrorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastCanvasCoordsRef = useRef<{ x: number; y: number } | null>(null);

  const getCanvasCoordsFromScreen = useCallback((clientX: number, clientY: number) => {
    const canvas = workingCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const drawMirror = useCallback((canvasX: number, canvasY: number) => {
    const mainCanvas = workingCanvasRef.current;
    const mirrorCanvas = mirrorCanvasRef.current;
    if (!mainCanvas || !mirrorCanvas) return;

    const mCtx = mirrorCanvas.getContext('2d');
    if (!mCtx) return;

    const mSize = 160;
    mirrorCanvas.width = mSize;
    mirrorCanvas.height = mSize;

    const mag = mirrorMag;
    const srcSize = mSize / mag;
    const srcX = canvasX - srcSize / 2;
    const srcY = canvasY - srcSize / 2;

    mCtx.clearRect(0, 0, mSize, mSize);
    
    // Pixelated imaging for precise pixel borders
    mCtx.imageSmoothingEnabled = false;
    mCtx.drawImage(
      mainCanvas,
      srcX, srcY, srcSize, srcSize,
      0, 0, mSize, mSize
    );

    // Draw target visual crosshairs
    const half = mSize / 2;
    mCtx.strokeStyle = '#00FFB2';
    mCtx.lineWidth = 1.5;
    mCtx.beginPath();
    mCtx.moveTo(half - 12, half);
    mCtx.lineTo(half + 12, half);
    mCtx.moveTo(half, half - 12);
    mCtx.lineTo(half, half + 12);
    mCtx.stroke();

    // Draw circular brush preview scaled inside the magnifier view
    const visualRadius = (brushSize / srcSize) * (mSize / 2);
    mCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    mCtx.lineWidth = 1.5;
    mCtx.beginPath();
    mCtx.arc(half, half, Math.max(2, visualRadius), 0, Math.PI * 2);
    mCtx.stroke();
  }, [mirrorMag, brushSize]);

  const handleCanvasUpdate = useCallback((x: number, y: number) => {
    lastCanvasCoordsRef.current = { x, y };
    drawMirror(x, y);
  }, [drawMirror]);

  // Redraw mirror whenever magnification or brush size config shifts
  useEffect(() => {
    if (lastCanvasCoordsRef.current) {
      drawMirror(lastCanvasCoordsRef.current.x, lastCanvasCoordsRef.current.y);
    }
  }, [mirrorMag, brushSize, drawMirror]);

  // Zoom / Pan coordinate offsets for manual editing
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStartX, setPanStartX] = useState<number>(0);
  const [panStartY, setPanStartY] = useState<number>(0);
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);

  // Refs and synchronization hooks for event listener isolation
  const isEraserActive = useRef<boolean>(false);
  const activeToolRef = useRef<'select' | 'eraser' | 'restore'>('select');
  const brushSizeRef = useRef<number>(20);
  const brushOpacityRef = useRef<number>(100);
  const brushSoftnessRef = useRef<number>(0);
  const zoomRef = useRef<number>(100);
  const isSpacePressedRef = useRef<boolean>(false);

  useEffect(() => {
    activeToolRef.current = activeTool;
    isEraserActive.current = (activeTool === 'eraser');
  }, [activeTool]);

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
    isSpacePressedRef.current = isSpacePressed;
  }, [isSpacePressed]);

  // Subject positioning & resizing states
  const [subjectX, setSubjectX] = useState<number>(0);
  const [subjectY, setSubjectY] = useState<number>(0);
  const [subjectWidth, setSubjectWidth] = useState<number>(0);
  const [subjectHeight, setSubjectHeight] = useState<number>(0);
  const [baseSubjectWidth, setBaseSubjectWidth] = useState<number>(0);
  const [baseSubjectHeight, setBaseSubjectHeight] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [isPositionMode, setIsPositionMode] = useState<boolean>(true);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);
  const [origWidth, setOrigWidth] = useState<number>(1920);
  const [origHeight, setOrigHeight] = useState<number>(1080);
  
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const interactiveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const subjectImageRef = useRef<HTMLImageElement | null>(null);
  
  // UI states
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [customBgFile, setCustomBgFile] = useState<File | null>(null);
  const [customBgURL, setCustomBgURL] = useState<string | null>(null);
  
  // Form input states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Metadata tags
  const [fileDetails, setFileDetails] = useState({ name: "", dimensions: "1920 × 1080 px", size: "0 MB" });

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  // Flash toast function
  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  }, []);

  // Clear toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Resend email countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // Comparison slider logic
  const handleSliderMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleSliderMove(e.clientX);
    }
  }, [handleSliderMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  }, [handleSliderMove]);

  // HD Edge Refinement Canvas Pipeline
  const refineBlobEdges = (blob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          // Rule 5: NEVER DOWNSCALE THE IMAGE
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;

          // Rule 4: CANVAS QUALITY SETTINGS (apply every time)
          const ctx = canvas.getContext('2d', { 
            alpha: true, 
            willReadFrequently: true 
          });
          if (!ctx) {
            URL.revokeObjectURL(url);
            resolve(blob); // fallback
            return;
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const w = canvas.width;
          const h = canvas.height;

          // Make a fast copy of original colors to use in decontamination searches
          const origData = new Uint8ClampedArray(data);

          // We will create an alpha buffer to run subpixel antialias smoothing
          const alphaBuffer = new Uint8Array(w * h);
          for (let i = 0; i < data.length; i += 4) {
            alphaBuffer[i / 4] = data[i + 3];
          }

          // Step 1: Detect and remove stray floating background remnants / speckles (isolated points of noise)
          // To preserve delicate hairs, we only clean up extremely isolated points that have zero connection to major opaque blocks
          for (let y = 2; y < h - 2; y++) {
            for (let x = 2; x < w - 2; x++) {
              const i = y * w + x;
              if (alphaBuffer[i] > 0 && alphaBuffer[i] < 120) {
                // Look in a 5x5 block around this pixel.
                let maxNeighborAlpha = 0;
                for (let dy = -2; dy <= 2; dy++) {
                  for (let dx = -2; dx <= 2; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const neighborAlpha = alphaBuffer[(y + dy) * w + (x + dx)];
                    if (neighborAlpha > maxNeighborAlpha) {
                      maxNeighborAlpha = neighborAlpha;
                    }
                  }
                }
                // If the strongest neighbor is almost fully transparent, this is an isolated speckle
                if (maxNeighborAlpha < 15) {
                  alphaBuffer[i] = 0; // eliminate remnant noise
                }
              }
            }
          }

          // Step 2: High-Quality Alpha Matting & Subpixel Anti-Blur Smoothing
          // Run a lightweight box/bilateral hybrid smooth on the alpha channel around the transition boundaries (0 < alpha < 255)
          const smoothedAlpha = new Uint8Array(w * h);
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = y * w + x;
              const a = alphaBuffer[idx];
              if (a === 0) {
                smoothedAlpha[idx] = 0;
              } else if (a === 255) {
                smoothedAlpha[idx] = 255;
              } else {
                // transition fringe edge - apply smooth kernel
                if (x > 0 && x < w - 1 && y > 0 && y < h - 1) {
                  let sum = a * 4;
                  sum += alphaBuffer[idx - 1] * 1.5;
                  sum += alphaBuffer[idx + 1] * 1.5;
                  sum += alphaBuffer[idx - w] * 1.5;
                  sum += alphaBuffer[idx + w] * 1.5;
                  sum += alphaBuffer[idx - w - 1] * 0.5;
                  sum += alphaBuffer[idx - w + 1] * 0.5;
                  sum += alphaBuffer[idx + w - 1] * 0.5;
                  sum += alphaBuffer[idx + w + 1] * 0.5;
                  
                  const computed = Math.round(sum / 12);
                  // Apply a light sigmoid/smoothstep transition to enhance edge quality without causing jagged aliased borders
                  const t = computed / 255;
                  const factor = t * t * (3 - 2 * t);
                  smoothedAlpha[idx] = Math.round(factor * 255);
                } else {
                  smoothedAlpha[idx] = a;
                }
              }
            }
          }

          // Update the original data array with smoothed alpha values
          for (let i = 0; i < data.length; i += 4) {
            data[i + 3] = smoothedAlpha[i / 4];
          }

          // Step 3: High-Fidelity Color Spill Decontamination (Anti-Halo & Spill Suppression)
          // For transition pixels, look in a cross-pattern to find the nearest clean opaque foreground pixel.
          // This prevents background halos (white/green/gray fringes) while perfectly preserving original colors, hair, and clothing details.
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const idx = (y * w + x) * 4;
              const alpha = data[idx + 3];
              
              if (alpha > 5 && alpha < 240) {
                // Find a nearby solid opaque foreground pixel (alpha > 250)'s color to decontaminate
                let refR = 0, refG = 0, refB = 0;
                let foundOpaque = false;
                let minDist = 999;
                
                // Search in expanding rings up to radius 5 for a clean opaque pixel
                for (let r = 1; r <= 5; r++) {
                  const searchDirs = [
                    { dx: 0, dy: -r }, { dx: 0, dy: r },
                    { dx: -r, dy: 0 }, { dx: r, dy: 0 },
                    { dx: -r, dy: -r }, { dx: -r, dy: r },
                    { dx: r, dy: -r }, { dx: r, dy: r }
                  ];
                  
                  for (const dir of searchDirs) {
                    const sx = x + dir.dx;
                    const sy = y + dir.dy;
                    if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
                      const sIdx = (sy * w + sx) * 4;
                      // Check if it is a robust opaque foreground pixel
                      if (origData[sIdx + 3] >= 253) {
                        const dist = Math.abs(dir.dx) + Math.abs(dir.dy);
                        if (dist < minDist) {
                          minDist = dist;
                          refR = origData[sIdx];
                          refG = origData[sIdx + 1];
                          refB = origData[sIdx + 2];
                          foundOpaque = true;
                        }
                      }
                    }
                  }
                  if (foundOpaque) break; // prioritizes closer rings
                }

                if (foundOpaque) {
                  // Adaptive decontamination factor: stronger on highly transparent edge pixels
                  const decontamStrength = (1 - (alpha / 255)) * 0.75;
                  data[idx] = Math.round(data[idx] * (1 - decontamStrength) + refR * decontamStrength);
                  data[idx + 1] = Math.round(data[idx + 1] * (1 - decontamStrength) + refG * decontamStrength);
                  data[idx + 2] = Math.round(data[idx + 2] * (1 - decontamStrength) + refB * decontamStrength);
                }
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);

          canvas.toBlob((refinedBlob) => {
            URL.revokeObjectURL(url);
            if (refinedBlob) {
              resolve(refinedBlob);
            } else {
              resolve(blob);
            }
          }, "image/png", 1.0);
        } catch (e) {
          console.error("Error during edge refinement:", e);
          URL.revokeObjectURL(url);
          resolve(blob);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(blob);
      };
      img.src = url;
    });
  };

  // Snapshot helper to keep client previews in-sync on mouseUp or touchEnd
  const updateEditedCanvasSnapshot = () => {
    const canvas = workingCanvasRef.current;
    if (canvas) {
      setEditedCanvasURL(canvas.toDataURL('image/png'));
    }
  };

  // EXACT HD COMPOSITING FUNCTION
  const applyBackground = async (backgroundURL: string, subjectBlobURL: string): Promise<string> => {
    // Create canvas at FULL original image resolution
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return subjectBlobURL;
    
    // Load subject image first to get original dimensions
    const subjectImg = new Image();
    await new Promise((resolve) => {
      subjectImg.onload = resolve;
      subjectImg.src = subjectBlobURL;
    });
    
    // Set canvas to exact original dimensions — NEVER smaller
    canvas.width = subjectImg.naturalWidth;
    canvas.height = subjectImg.naturalHeight;
    
    // Enable maximum quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (backgroundURL === 'transparent') {
      // No background — just draw subject
      ctx.drawImage(subjectImg, 0, 0, canvas.width, canvas.height);
      
    } else if (backgroundURL.startsWith('#')) {
      // Solid color background
      ctx.fillStyle = backgroundURL;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(subjectImg, 0, 0, canvas.width, canvas.height);
      
    } else {
      // Image background — load fully before drawing
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve) => {
        bgImg.onload = () => resolve();
        bgImg.onerror = () => {
          // If background fails to load use white fallback
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          resolve();
        };
        bgImg.src = backgroundURL;
      });
      
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        // Draw background COVER style (fill entire canvas, no stretch distortion)
        const bgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, drawX, drawY;
        
        if (bgRatio > canvasRatio) {
          drawHeight = canvas.height;
          drawWidth = bgImg.naturalWidth * (canvas.height / bgImg.naturalHeight);
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = bgImg.naturalHeight * (canvas.width / bgImg.naturalWidth);
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        }
        
        ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
      }
      
      // Draw subject on top at full resolution
      ctx.drawImage(subjectImg, 0, 0, canvas.width, canvas.height);
    }
    
    // Return composited result as high quality PNG blob URL
    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          resolve(subjectBlobURL);
        }
      }, 'image/png', 1.0);
    });
  };

  const handleSelectBg = async (bgUrl: string) => {
    setIsApplyingBg(true);
    setSelectedBg(bgUrl);
    if (bgUrl && bgUrl !== 'transparent') {
      initializeSubjectPosition(origWidth, origHeight, origWidth, origHeight);
    }
    try {
      const subjectURL = editedCanvasURL || removedBgURL;
      if (subjectURL) {
        const compositedUrl = await applyBackground(bgUrl, subjectURL);
        setCompositedPreviewURL(compositedUrl);
        showToast("Background applied ✓", "success");
      }
    } catch (err) {
      console.error(err);
      setFailedBgURLs(prev => ({ ...prev, [bgUrl]: true }));
      showToast("Failed to load background, try another", "error");
    } finally {
      setIsApplyingBg(false);
    }
  };

  // Automated background recomposition effect
  useEffect(() => {
    if (selectedBg && (editedCanvasURL || removedBgURL)) {
      const recomposite = async () => {
        try {
          const url = await applyBackground(selectedBg, editedCanvasURL || removedBgURL!);
          setCompositedPreviewURL(url);
        } catch (e) {
          console.error("Recompositing error:", e);
        }
      };
      recomposite();
    } else {
      setCompositedPreviewURL(null);
    }
  }, [selectedBg, editedCanvasURL, removedBgURL]);

  // Thumbnail skeleton shimmer effects on category switch
  useEffect(() => {
    setIsThumbnailsLoading(true);
    const timer = setTimeout(() => {
      setIsThumbnailsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [bgCategory]);

  // Drawing coordinate and stroke segment logic is defined inside the direct canvas event binding useEffect below.
  const getWrapperStyle = (): React.CSSProperties => {
    const hasCustomBg = selectedBg && selectedBg !== 'transparent';
    const isColor = hasCustomBg && selectedBg!.startsWith('#');
    
    let bgStyle: React.CSSProperties = {};
    if (hasCustomBg) {
      if (isColor) {
        bgStyle = {
          backgroundColor: selectedBg!,
          backgroundImage: 'none',
        };
      } else {
        bgStyle = {
          backgroundImage: `url(${selectedBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      }
    } else {
      bgStyle = {
        backgroundImage: `
          linear-gradient(45deg, #b0b0b0 25%, transparent 25%),
          linear-gradient(-45deg, #b0b0b0 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #b0b0b0 75%),
          linear-gradient(-45deg, transparent 75%, #b0b0b0 75%)
        `,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
        backgroundColor: '#ffffff',
      };
    }

    return {
      ...bgStyle,
      position: 'relative' as const,
      aspectRatio: origWidth && origHeight ? `${origWidth} / ${origHeight}` : '1 / 1',
      maxWidth: '90%',
      maxHeight: '90%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `translate(${panX}px, ${panY}px) scale(${zoom / 100})`,
      transformOrigin: 'center center',
    };
  };

  // Undo / Redo stacks saving using ImageData for pixel precision and robustness
  const saveToUndoStack = () => {
    const canvas = workingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack(prev => [...prev.slice(-29), imgData]);
      setRedoStack([]);
    } catch (e) {
      console.error("Failed to save to undo stack:", e);
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const canvas = workingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    try {
      const currentImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setRedoStack(prev => [...prev.slice(-29), currentImgData]);
      
      const lastSnapshot = undoStack[undoStack.length - 1];
      setUndoStack(prev => prev.slice(0, -1));
      
      ctx.putImageData(lastSnapshot, 0, 0);
      updateEditedCanvasSnapshot();
    } catch (e) {
      console.error("Failed to undo:", e);
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const canvas = workingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    try {
      const currentImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack(prev => [...prev.slice(-29), currentImgData]);
      
      const nextSnapshot = redoStack[redoStack.length - 1];
      setRedoStack(prev => prev.slice(0, -1));
      
      ctx.putImageData(nextSnapshot, 0, 0);
      updateEditedCanvasSnapshot();
    } catch (e) {
      console.error("Failed to redo:", e);
    }
  };

  // Reload the original background-removed cutout back onto the canvas completely
  const handleRestoreCanvas = () => {
    const canvas = workingCanvasRef.current;
    if (!canvas || !removedBgURL) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    saveToUndoStack();
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      updateEditedCanvasSnapshot();
      showToast("Canvas restored to original cutout ✓", "success");
    };
    img.src = removedBgURL;
  };

  // Keyboard zoom controls helper
  const handleZoomIn = () => setZoom(prev => Math.min(400, prev + 25));
  const handleZoomOut = () => setZoom(prev => Math.max(25, prev - 25));
  const handleZoomReset = () => {
    setZoom(100);
    setPanX(0);
    setPanY(0);
  };

  // Panning helper events for Workspace Container
  const handleWorkspaceMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const isMiddleClick = e.button === 1;
    if (isSpacePressed || isMiddleClick) {
      e.preventDefault();
      setIsPanning(true);
      setPanStartX(e.clientX - panX);
      setPanStartY(e.clientY - panY);
    }
  };

  const handleWorkspaceMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      setPanX(e.clientX - panStartX);
      setPanY(e.clientY - panStartY);
    }
  };

  const handleWorkspaceMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
  };

  const handleWorkspaceTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
    } else if (e.touches.length === 1 && (isSpacePressed || activeTool === 'select')) {
      setIsPanning(true);
      setPanStartX(e.touches[0].clientX - panX);
      setPanStartY(e.touches[0].clientY - panY);
    }
  };

  const handleWorkspaceTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchStartDist !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - touchStartDist;
      if (Math.abs(delta) > 5) {
        setZoom(prev => {
          const factor = delta > 0 ? 5 : -5;
          return Math.max(25, Math.min(400, prev + factor));
        });
        setTouchStartDist(dist);
      }
    } else if (e.touches.length === 1 && isPanning) {
      setPanX(e.touches[0].clientX - panStartX);
      setPanY(e.touches[0].clientY - panStartY);
    }
  };

  const handleWorkspaceTouchEnd = () => {
    setTouchStartDist(null);
    setIsPanning(false);
  };

  const handleWorkspaceWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomStep = 10;
    if (e.deltaY < 0) {
      setZoom(prev => Math.min(400, prev + zoomStep));
    } else {
      setZoom(prev => Math.max(25, prev - zoomStep));
    }
  };

  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);

  // Keyboard space key observer for panning and standard hotkeys
  useEffect(() => {
    const handleSpaceKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    
    const handleSpaceKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    
    window.addEventListener('keydown', handleSpaceKeyDown);
    window.addEventListener('keyup', handleSpaceKeyUp);
    return () => {
      window.removeEventListener('keydown', handleSpaceKeyDown);
      window.removeEventListener('keyup', handleSpaceKeyUp);
    };
  }, []);

  // Keyboard shortcut registry listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      const isShift = e.shiftKey;
      const isCtrl = e.ctrlKey || e.metaKey;
      
      if (isCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (isCtrl && (e.key.toLowerCase() === 'y' || (isShift && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        handleRedo();
      } else if (e.key.toLowerCase() === 'e') {
        setActiveTool('eraser');
        showToast("Eraser tool active — click & drag to erase pixels", "info");
      } else if (e.key.toLowerCase() === 's') {
        setActiveTool('select');
        showToast("Select & compare tool active", "info");
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRestoreCanvas();
      } else if (e.key === '[') {
        setBrushSize(prev => Math.max(5, prev - 5));
      } else if (e.key === ']') {
        setBrushSize(prev => Math.min(100, prev + 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, activeTool, brushSize]);

  // Handle setting canvas state upon background removal loads
  useEffect(() => {
    if (!removedBgURL) {
      setEditedCanvasURL(null);
    } else {
      setEditedCanvasURL(removedBgURL);
      setUndoStack([]);
      setRedoStack([]);
    }
  }, [removedBgURL]);

  // Initialize the subject to center 70% of canvas height
  const initializeSubjectPosition = (
    canvasWidth: number, canvasHeight: number,
    subjectNaturalWidth: number, subjectNaturalHeight: number
  ) => {
    const targetHeight = canvasHeight * 0.70;
    const aspectRatio = subjectNaturalWidth / subjectNaturalHeight;
    const targetWidth = targetHeight * aspectRatio;

    const startX = (canvasWidth - targetWidth) / 2;
    const startY = (canvasHeight - targetHeight) / 2;

    setSubjectX(startX);
    setSubjectY(startY);
    setSubjectWidth(targetWidth);
    setSubjectHeight(targetHeight);
    setBaseSubjectWidth(targetWidth);
    setBaseSubjectHeight(targetHeight);
    setScale(1.0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  // Pre-load subject image to ref for buttery dragging
  useEffect(() => {
    const url = editedCanvasURL || removedBgURL;
    if (url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        subjectImageRef.current = img;
        renderInteractiveCanvas();
      };
      img.src = url;
    }
  }, [editedCanvasURL, removedBgURL]);

  const drawBackgroundOnCanvas = (canvas: HTMLCanvasElement, bgUrl: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (bgUrl.startsWith('#')) {
      ctx.fillStyle = bgUrl;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgUrl !== 'transparent') {
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.onload = () => {
        // Draw background COVER style
        const bgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, drawX, drawY;
        
        if (bgRatio > canvasRatio) {
          drawHeight = canvas.height;
          drawWidth = bgImg.naturalWidth * (canvas.height / bgImg.naturalHeight);
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = bgImg.naturalHeight * (canvas.width / bgImg.naturalWidth);
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        }
        ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
      };
      bgImg.src = bgUrl;
    }
  };

  // Trigger drawing the background canvas
  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (canvas && selectedBg && isPositionMode) {
      canvas.width = origWidth;
      canvas.height = origHeight;
      drawBackgroundOnCanvas(canvas, selectedBg);
    }
  }, [selectedBg, origWidth, origHeight, isPositionMode]);

  // Set up interactive canvas sizes and render
  useEffect(() => {
    const canvas = interactiveCanvasRef.current;
    if (canvas && isPositionMode) {
      canvas.width = origWidth;
      canvas.height = origHeight;
      renderInteractiveCanvas();
    }
  }, [origWidth, origHeight, isPositionMode]);

  // Re-render interactive canvas whenever position inputs update
  useEffect(() => {
    renderInteractiveCanvas();
  }, [
    subjectX,
    subjectY,
    subjectWidth,
    subjectHeight,
    flipHorizontal,
    flipVertical,
    brightness,
    contrast,
    dropShadow,
    isPositionMode
  ]);

  const getHandlePositions = () => {
    const x = subjectX;
    const y = subjectY;
    const w = subjectWidth;
    const h = subjectHeight;
    return [
      { id: 'tl', x: x,       y: y       },  // top-left
      { id: 'tc', x: x+w/2,   y: y       },  // top-center
      { id: 'tr', x: x+w,     y: y       },  // top-right
      { id: 'ml', x: x,       y: y+h/2   },  // middle-left
      { id: 'mr', x: x+w,     y: y+h/2   },  // middle-right
      { id: 'bl', x: x,       y: y+h     },  // bottom-left
      { id: 'bc', x: x+w/2,   y: y+h     },  // bottom-center
      { id: 'br', x: x+w,     y: y+h     },  // bottom-right
    ];
  };

  const drawSelectionHandles = (ctx: CanvasRenderingContext2D) => {
    const rect = interactiveCanvasRef.current?.getBoundingClientRect();
    const scaleFactor = rect ? (interactiveCanvasRef.current!.width / rect.width) : 1;
    const strokeW = Math.max(2, 2 * scaleFactor);
    const handleRadius = Math.max(6, 6 * scaleFactor);
    
    // Draw dashed selection border
    ctx.strokeStyle = '#00FFB2';
    ctx.lineWidth = strokeW;
    ctx.setLineDash([Math.max(6, 6 * scaleFactor), Math.max(3, 3 * scaleFactor)]);
    ctx.strokeRect(
      subjectX - 4 * scaleFactor,
      subjectY - 4 * scaleFactor,
      subjectWidth + 8 * scaleFactor,
      subjectHeight + 8 * scaleFactor
    );
    ctx.setLineDash([]);

    // Draw 8 resize handles
    const handles = getHandlePositions();
    handles.forEach(handle => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#00FFB2';
      ctx.lineWidth = strokeW;
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, handleRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  };

  const renderInteractiveCanvas = () => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const subjectImg = subjectImageRef.current;
    if (!subjectImg) return;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.save();
    
    // Apply filters directly
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${dropShadow ? "drop-shadow(0px 20px 30px rgba(0,0,0,0.6))" : ""}`;
    
    // Set up flip transform
    if (flipHorizontal || flipVertical) {
      const centerX = subjectX + subjectWidth / 2;
      const centerY = subjectY + subjectHeight / 2;
      ctx.translate(centerX, centerY);
      ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
      ctx.translate(-centerX, -centerY);
    }
    
    ctx.drawImage(
      subjectImg,
      subjectX,
      subjectY,
      subjectWidth,
      subjectHeight
    );
    
    ctx.restore();
    
    drawSelectionHandles(ctx);
  };

  const getCanvasPosition = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX = 0;
    let clientY = 0;
    
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const isInsideSubject = (x: number, y: number) => {
    return (
      x >= subjectX &&
      x <= subjectX + subjectWidth &&
      y >= subjectY &&
      y <= subjectY + subjectHeight
    );
  };

  const getClickedHandle = (x: number, y: number) => {
    const handles = getHandlePositions();
    for (const handle of handles) {
      const dist = Math.sqrt(
        Math.pow(x - handle.x, 2) + 
        Math.pow(y - handle.y, 2)
      );
      const rect = interactiveCanvasRef.current?.getBoundingClientRect();
      const toleranceFactor = rect ? (interactiveCanvasRef.current!.width / rect.width) : 1;
      if (dist <= 12 * toleranceFactor) return handle.id;
    }
    return null;
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;
    const pos = getCanvasPosition(e, canvas);
    const clickedHandle = getClickedHandle(pos.x, pos.y);

    if (clickedHandle) {
      setIsResizing(true);
      setResizeHandle(clickedHandle);
      setDragStartX(pos.x);
      setDragStartY(pos.y);
    } else if (isInsideSubject(pos.x, pos.y)) {
      setIsDragging(true);
      setDragOffsetX(pos.x - subjectX);
      setDragOffsetY(pos.y - subjectY);
      canvas.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;
    const pos = getCanvasPosition(e, canvas);

    if (isDragging) {
      const newX = pos.x - dragOffsetX;
      const newY = pos.y - dragOffsetY;
      setSubjectX(newX);
      setSubjectY(newY);
    } else if (isResizing) {
      handleResize(pos.x, pos.y);
    } else {
      const handle = getClickedHandle(pos.x, pos.y);
      if (handle) {
         const cursors: Record<string, string> = {
          tl: 'nw-resize', tr: 'ne-resize',
          bl: 'sw-resize', br: 'se-resize',
          tc: 'n-resize',  bc: 's-resize',
          ml: 'w-resize',  mr: 'e-resize'
        };
        canvas.style.cursor = cursors[handle];
      } else if (isInsideSubject(pos.x, pos.y)) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    if (baseSubjectWidth > 0) {
      setScale(subjectWidth / baseSubjectWidth);
    }
    if (interactiveCanvasRef.current) {
      interactiveCanvasRef.current.style.cursor = 'grab';
    }
  };

  const handleResize = (mouseX: number, mouseY: number) => {
    const dx = mouseX - dragStartX;
    const dy = mouseY - dragStartY;
    
    let newX = subjectX;
    let newY = subjectY;
    let newW = subjectWidth;
    let newH = subjectHeight;

    switch (resizeHandle) {
      case 'br':
        newW = Math.max(50, subjectWidth + dx);
        newH = Math.max(50, subjectHeight + dy);
        break;
      case 'bl':
        newX = subjectX + dx;
        newW = Math.max(50, subjectWidth - dx);
        newH = Math.max(50, subjectHeight + dy);
        break;
      case 'tr':
        newY = subjectY + dy;
        newW = Math.max(50, subjectWidth + dx);
        newH = Math.max(50, subjectHeight - dy);
        break;
      case 'tl':
        newX = subjectX + dx;
        newY = subjectY + dy;
        newW = Math.max(50, subjectWidth - dx);
        newH = Math.max(50, subjectHeight - dy);
        break;
      case 'tc':
        newY = subjectY + dy;
        newH = Math.max(50, subjectHeight - dy);
        break;
      case 'bc':
        newH = Math.max(50, subjectHeight + dy);
        break;
      case 'ml':
        newX = subjectX + dx;
        newW = Math.max(50, subjectWidth - dx);
        break;
      case 'mr':
        newW = Math.max(50, subjectWidth + dx);
        break;
    }

    setSubjectX(newX);
    setSubjectY(newY);
    setSubjectWidth(newW);
    setSubjectHeight(newH);
    setDragStartX(mouseX);
    setDragStartY(mouseY);
  };

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    if (baseSubjectWidth <= 0 || baseSubjectHeight <= 0) return;
    const newW = baseSubjectWidth * newScale;
    const newH = baseSubjectHeight * newScale;
    
    const centerX = subjectX + subjectWidth / 2;
    const centerY = subjectY + subjectHeight / 2;
    
    setSubjectX(centerX - newW / 2);
    setSubjectY(centerY - newH / 2);
    setSubjectWidth(newW);
    setSubjectHeight(newH);
  };

  const alignSubject = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    switch (alignment) {
      case 'center':
        setSubjectX((origWidth - subjectWidth) / 2);
        break;
      case 'middle':
        setSubjectY((origHeight - subjectHeight) / 2);
        break;
      case 'left':
        setSubjectX(0);
        break;
      case 'right':
        setSubjectX(origWidth - subjectWidth);
        break;
      case 'top':
        setSubjectY(0);
        break;
      case 'bottom':
        setSubjectY(origHeight - subjectHeight);
        break;
    }
  };

  // Keyboard listeners for dragging, resizing and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!removedBgURL || !isPositionMode || activeTool !== 'select') return;
      
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.hasAttribute('contenteditable'))) {
        return;
      }
      
      const nudge = e.shiftKey ? 1 : 10;
      let handled = false;
      
      switch (e.key) {
        case "ArrowUp":
          setSubjectY(prev => prev - nudge);
          handled = true;
          break;
        case "ArrowDown":
          setSubjectY(prev => prev + nudge);
          handled = true;
          break;
        case "ArrowLeft":
          setSubjectX(prev => prev - nudge);
          handled = true;
          break;
        case "ArrowRight":
          setSubjectX(prev => prev + nudge);
          handled = true;
          break;
        case "+":
        case "=":
          if (baseSubjectWidth > 0) {
            const nextScale = Math.min(2.0, scale + 0.05);
            handleScaleChange(nextScale);
          }
          handled = true;
          break;
        case "-":
        case "_":
          if (baseSubjectWidth > 0) {
            const nextScale = Math.max(0.1, scale - 0.05);
            handleScaleChange(nextScale);
          }
          handled = true;
          break;
        case "c":
        case "C":
          alignSubject('center');
          alignSubject('middle');
          showToast("Centered subject C ✓", "info");
          handled = true;
          break;
        case "h":
        case "H":
          setFlipHorizontal(prev => !prev);
          showToast("Flipped Horizontal ✓", "info");
          handled = true;
          break;
        default:
          break;
      }
      
      if (handled) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [removedBgURL, isPositionMode, activeTool, scale, baseSubjectWidth, baseSubjectHeight, subjectX, subjectY, subjectWidth, subjectHeight]);

  // Simulated & Real background process pipeline
  const processImageBackground = async (file: File) => {
    setIsProcessing(true);
    setProcessStep("🔍 Analyzing image...");

    // Steps countdown (for fallback visual progress)
    const steps = [
      { text: "🔍 Analyzing image...", delay: 800 },
      { text: "✂️ Detecting subject edges...", delay: 1600 },
      { text: "🧠 AI removing background...", delay: 2400 },
      { text: "✨ Enhancing HD quality...", delay: 3200 },
      { text: "✅ Done!", delay: 4000 }
    ];

    const timers: NodeJS.Timeout[] = [];
    steps.forEach((step) => {
      const t = setTimeout(() => {
        setProcessStep(step.text);
      }, step.delay);
      timers.push(t);
    });

    try {
      // Call @imgly AI background remover with exact config in instructions
      const resultBlob = await removeBackground(file, {
        output: {
          format: 'image/png',
          quality: 1,
          type: 'foreground'
        },
        model: 'medium',
        postProcessMask: true,
        progress: (key, current, total) => {
          const percent = Math.round((current / total) * 100) || 0;
          setProcessStep(`🧠 ${key}: ${percent}% (${current}/${total})`);
          console.log(`${key}: ${current} of ${total}`);
        }
      });

      // Clear the visual countdown timers
      timers.forEach(t => clearTimeout(t));

      setProcessStep("✨ Refining and sharpening edges...");
      const refinedBlob = await refineBlobEdges(resultBlob);
      const url = URL.createObjectURL(refinedBlob);

      setRemovedBgBlob(refinedBlob);
      setRemovedBgURL(url);
      setIsProcessing(false);
      showToast("Background cleanly isolated with AI!", "success");

      // Save history entry
      const record: SavedImage = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        originalUrl: URL.createObjectURL(file), // temporary
        resultUrl: url,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        dimensions: fileDetails.dimensions
      };
      setSavedImages(prev => [record, ...prev]);

    } catch (err) {
      console.warn("AI WASM block failed/detected, proceeding with High-Fidelity Edge Cutout backup simulator...", err);
      // Clear the visual countdown timers
      timers.forEach(t => clearTimeout(t));
      
      // Fallback: Custom canvas filter background-removal simulation
      setTimeout(async () => {
        try {
          const img = new Image();
          const reader = new FileReader();

          await new Promise((resolve) => {
            reader.onload = (e) => {
              img.src = e.target?.result as string;
              img.onload = resolve;
            };
            reader.readAsDataURL(file);
          });

          const canvas = document.createElement("canvas");
          // Rule 5: NEVER DOWNSCALE THE IMAGE
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;

          // Rule 4: Apply canvas quality settings
          const ctx = canvas.getContext("2d", {
            alpha: true,
            willReadFrequently: true
          });
          
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            // Smart color keying based on adaptive corner samples to safely remove background without cropping the subject
            const corners = [
              { x: 2, y: 2 },
              { x: canvas.width - 3, y: 2 },
              { x: 2, y: canvas.height - 3 },
              { x: canvas.width - 3, y: canvas.height - 3 }
            ];
            
            interface RGB { r: number; g: number; b: number; }
            const sampleBGColors: RGB[] = corners.map(c => {
              const baseIdx = (c.y * canvas.width + c.x) * 4;
              return { r: data[baseIdx], g: data[baseIdx+1], b: data[baseIdx+2] };
            });

            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                const idx = (y * canvas.width + x) * 4;
                const r = data[idx];
                const g = data[idx+1];
                const b = data[idx+2];

                // Check 1: Is green screen/chroma-key?
                const isGreen = g > r * 1.18 && g > b * 1.18 && g > 45;
                
                // Check 2: Is solid white/light background?
                const isVeryBright = r > 245 && g > 245 && b > 245;

                // Check 3: Is color extremely similar to sampled corner background colors? (With safe threshold)
                let matchesCorner = false;
                for (const col of sampleBGColors) {
                  const rDiff = Math.abs(r - col.r);
                  const gDiff = Math.abs(g - col.g);
                  const bDiff = Math.abs(b - col.b);
                  // Narrow threshold to safely keep subject foreground elements
                  if (rDiff < 20 && gDiff < 20 && bDiff < 20) {
                    matchesCorner = true;
                    break;
                  }
                }

                // If pixel is background, remove it; otherwise, guarantee 100% preservation (no dist-based crop)
                if (isGreen || isVeryBright || matchesCorner) {
                  // Do not remove subject pixels (soft fade at corners is avoided to keep 100% detail)
                  data[idx + 3] = 0;
                }
              }
            }
            ctx.putImageData(imgData, 0, 0);
          }

          canvas.toBlob(async (blob) => {
            if (blob) {
              setProcessStep("✨ Refining and sharpening edges...");
              const refinedBlob = await refineBlobEdges(blob);
              const url = URL.createObjectURL(refinedBlob);
              setRemovedBgBlob(refinedBlob);
              setRemovedBgURL(url);
              
              const record: SavedImage = {
                id: Date.now().toString(),
                name: file.name.replace(/\.[^/.]+$/, ""),
                originalUrl: URL.createObjectURL(file),
                resultUrl: url,
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                dimensions: `${img.width} × ${img.height} px`
              };
              setSavedImages(prev => [record, ...prev]);
            }
            setIsProcessing(false);
            showToast("Background extracted using HD edge engine!", "info");
          }, "image/png");
        } catch (simErr) {
          console.error("Simulation failed:", simErr);
          setIsProcessing(false);
          showToast("Failed to process background removal.", "error");
        }
      }, 1000);
    }
  };

  // Run File Selection & Dimensions reading
  const handleFileChange = (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      showToast("File size exceeds 20MB limit.", "error");
      return;
    }
    setUploadedFile(file);
    const orgUrl = URL.createObjectURL(file);
    setOriginalImageURL(orgUrl);
    setRemovedBgBlob(null);
    setRemovedBgURL(null);
    setSelectedBg(null);
    setCompositedURL(null);
    setBrightness(100);
    setContrast(100);
    setDropShadow(false);

    // Read details
    const imgObj = new Image();
    imgObj.onload = () => {
      const w = imgObj.naturalWidth || 1920;
      const h = imgObj.naturalHeight || 1080;
      setOrigWidth(w);
      setOrigHeight(h);
      setFileDetails({
        name: file.name,
        dimensions: `${w} × ${h} px`,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
    };
    imgObj.src = orgUrl;
  };

  // Sample templates triggers
  const loadSampleImage = async (url: string, name: string) => {
    try {
      setIsProcessing(true);
      setProcessStep("📥 Fetching high-quality sample...");
      const response = await fetch(url);
      const blobObj = await response.blob();
      const mockFile = new File([blobObj], name, { type: "image/jpeg" });
      setIsProcessing(false);
      handleFileChange(mockFile);
      showToast("Sample image loaded successfully!", "info");
    } catch {
      setIsProcessing(false);
      showToast("Error loading sample image. Please upload instead.", "error");
    }
  };

  // Custom Background Upload
  const handleCustomBgChange = (file: File) => {
    setCustomBgFile(file);
    const customUrl = URL.createObjectURL(file);
    setCustomBgURL(customUrl);
    
    // Add to customBackgrounds list
    const newBg = {
      id: `custom-${Date.now()}`,
      name: file.name || "Custom Backdrop",
      url: customUrl,
      category: "custom" as const
    };
    setCustomBackgrounds(prev => [...prev, newBg]);
    
    // Auto select it and apply background
    handleSelectBg(customUrl);
  };

  // Helper to compute dimensions for selected download quality
  const getResolutionForQuality = useCallback((quality: 'original' | '2k' | '3k' | '4k') => {
    if (quality === 'original') {
      return { w: origWidth, h: origHeight };
    }
    let maxDim = 2048; // 2K Resolution (2048px) explicitly matched
    if (quality === '3k') maxDim = 3072; // 3K Resolution (3072px) explicitly matched
    if (quality === '4k') maxDim = 4096; // 4K Resolution (4096px) explicitly matched

    const srcMax = Math.max(origWidth, origHeight);
    if (!srcMax) return { w: maxDim, h: maxDim };
    const ratio = maxDim / srcMax;
    const targetW = Math.round(origWidth * ratio);
    const targetH = Math.round(origHeight * ratio);
    return { w: targetW, h: targetH };
  }, [origWidth, origHeight]);

  // AI-inspired pixel sharpness & detail restoration filter (high performance convolution kernel)
  const applyDetailSharpening = (canvas: HTMLCanvasElement, intensity: number) => {
    if (intensity <= 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const w = canvas.width;
      const h = canvas.height;
      const imgData = ctx.getImageData(0, 0, w, h);
      if (!imgData) return;
      
      const data = imgData.data;
      const src = new Uint8ClampedArray(data);
      const mix = intensity;

      for (let y = 1; y < h - 1; y++) {
        const rowOffset = y * w * 4;
        const prevRowOffset = (y - 1) * w * 4;
        const nextRowOffset = (y + 1) * w * 4;

        for (let x = 1; x < w - 1; x++) {
          const idx = rowOffset + x * 4;
          
          for (let c = 0; c < 3; c++) {
            const current = src[idx + c];
            const left = src[idx - 4 + c];
            const right = src[idx + 4 + c];
            const top = src[prevRowOffset + x * 4 + c];
            const bottom = src[nextRowOffset + x * 4 + c];

            // Subtle high-pass laplacian-based detail boost
            const sharp = current * 5 - (left + right + top + bottom);
            const blended = current + (sharp - current) * mix;
            
            data[idx + c] = blended < 0 ? 0 : blended > 255 ? 255 : blended;
          }
          // Preserve alpha opacity channels perfectly
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch (err) {
      console.warn("AI detail sharpening filter skipped:", err);
    }
  };

  // Composite high-definition drawing and download
  // Composite high-definition drawing and download
  const exportImage = async (format: 'png' | 'jpg') => {
    if (!removedBgURL) return;
    setIsApplyingBg(true);
    try {
      const { w: targetW, h: targetH } = getResolutionForQuality(exportQuality);

      // Create export canvas at selected resolution
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = targetW;
      exportCanvas.height = targetH;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      // Enable extra high-resolution anti-blur smoothing filters
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Draw backdrop if selected and not transparent
      if (selectedBg && selectedBg !== 'transparent') {
        if (selectedBg.startsWith("#")) {
          ctx.fillStyle = selectedBg;
          ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        } else {
          const bgImg = new Image();
          bgImg.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            bgImg.onload = resolve;
            bgImg.onerror = reject;
            bgImg.src = selectedBg;
          });
          
          // Draw background with COVER style
          const bgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
          const canvasRatio = exportCanvas.width / exportCanvas.height;
          let drawWidth, drawHeight, drawX, drawY;
          
          if (bgRatio > canvasRatio) {
            drawHeight = exportCanvas.height;
            drawWidth = bgImg.naturalWidth * (exportCanvas.height / bgImg.naturalHeight);
            drawX = (exportCanvas.width - drawWidth) / 2;
            drawY = 0;
          } else {
            drawWidth = exportCanvas.width;
            drawHeight = bgImg.naturalHeight * (exportCanvas.width / bgImg.naturalWidth);
            drawX = 0;
            drawY = (exportCanvas.height - drawHeight) / 2;
          }
          ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
        }
      }

      // 2. Draw subject
      const subjectImg = new Image();
      subjectImg.crossOrigin = "anonymous";
      const subjectURL = editedCanvasURL || removedBgURL;
      await new Promise((resolve, reject) => {
        subjectImg.onload = resolve;
        subjectImg.onerror = reject;
        subjectImg.src = subjectURL;
      });

      ctx.save();
      
      // Applying Brightness and Contrast adjustments on Canvas direct manipulation
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${dropShadow ? "drop-shadow(0px 20px 30px rgba(0,0,0,0.6))" : ""}`;

      // Set up flip transform from center point if needed, ensuring perfect scaling coordinates
      if (isPositionMode && selectedBg && selectedBg !== 'transparent') {
        const scaleFactor = exportCanvas.width / origWidth;
        const sX = subjectX * scaleFactor;
        const sY = subjectY * scaleFactor;
        const sW = subjectWidth * scaleFactor;
        const sH = subjectHeight * scaleFactor;

        if (flipHorizontal || flipVertical) {
          const centerX = sX + sW / 2;
          const centerY = sY + sH / 2;
          ctx.translate(centerX, centerY);
          ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
          ctx.translate(-centerX, -centerY);
        }
        
        ctx.drawImage(
          subjectImg,
          sX,
          sY,
          sW,
          sH
        );
      } else {
        if (flipHorizontal || flipVertical) {
          const centerX = exportCanvas.width / 2;
          const centerY = exportCanvas.height / 2;
          ctx.translate(centerX, centerY);
          ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
          ctx.translate(-centerX, -centerY);
        }
        ctx.drawImage(subjectImg, 0, 0, exportCanvas.width, exportCanvas.height);
      }

      ctx.restore();

      // Apply the Custom AI micro-detail enhancement filters to restore high sharpness at high resolutions
      if (enableAISharpen) {
        applyDetailSharpening(exportCanvas, sharpenIntensity);
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const filename = `bgremover_${exportQuality}_${timestamp}.${format}`;
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'png' ? 1.0 : 0.95;

      exportCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Ultra-HD (${exportQuality === "original" ? "Original" : exportQuality.toUpperCase()}) ${format.toUpperCase()} downloaded successfully!`, "success");
      }, mimeType, quality);

    } catch (err) {
      console.error(err);
      showToast("Compositing pipeline error during output production.", "error");
    } finally {
      setIsApplyingBg(false);
    }
  };

  // Auth simulators
  const handleGoogleSignIn = () => {
    const fUser = { 
      name: "Google User", 
      email: "user@gmail.com", 
      avatar: "https://ui-avatars.com/api/?name=Google+User&background=00FFB2&color=05080F" 
    };
    setCurrentUser(fUser);
    setCurrentPage("dashboard");
    showToast("Signed in via Google successfully!", "success");
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }
    const fUser = {
      name: loginEmail.split("@")[0].toUpperCase(),
      email: loginEmail,
      avatar: `https://ui-avatars.com/api/?name=${loginEmail.charAt(0)}&background=5B6EFF&color=FFFFFF`
    };
    setCurrentUser(fUser);
    setCurrentPage("dashboard");
    showToast(`Welcome back, ${fUser.name}!`, "success");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    const fUser = {
      name: registerName,
      email: registerEmail,
      avatar: `https://ui-avatars.com/api/?name=${registerName.replace(" ", "+")}&background=00FFB2&color=05080F`
    };
    setCurrentUser(fUser);
    setCurrentPage("dashboard");
    showToast("Account created successfully!", "success");
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast("Please provide a valid email address.", "error");
      return;
    }
    setForgotSubmitted(true);
    setResendTimer(5);
    showToast("Reset link dispatched to inbox!", "success");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUploadedFile(null);
    setOriginalImageURL(null);
    setRemovedBgBlob(null);
    setRemovedBgURL(null);
    setSelectedBg(null);
    setCompositedURL(null);
    setCurrentPage("login");
    showToast("Logged out successfully.", "info");
  };

  return (
    <div className="min-h-screen bg-[#05080F] text-[#EAEAEA] font-sans antialiased overflow-x-hidden selection:bg-[#00FFB2] selection:text-[#05080F]">
      
      {/* Toast Notification */}
      {toast && (
        <div id="toast-notif" className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-x-0 scale-100 ${
          toast.type === "success" ? "bg-[#0D1117]/90 border-[#00FFB2]/50 text-[#00FFB2]" :
          toast.type === "error" ? "bg-[#0D1117]/90 border-red-500/50 text-red-400" :
          "bg-[#0D1117]/90 border-[#5B6EFF]/50 text-blue-400"
        }`}>
          {toast.type === "success" && <Check className="w-5 h-5 flex-shrink-0 animate-bounce" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === "info" && <Sparkles className="w-5 h-5 flex-shrink-0" />}
          <span className="font-medium text-sm text-[#EAEAEA]">{toast.message}</span>
        </div>
      )}

      {/* Pages Router */}
      {currentPage === "login" && (
        <div id="login-page" className="relative flex min-h-screen flex-col lg:flex-row items-center justify-center p-4 lg:p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,178,0.05),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(91,110,255,0.06),transparent_50%)]" />
          
          {/* Left Hero Panel (Desktop Only) */}
          <div className="hidden lg:flex flex-col w-1/2 min-h-screen justify-between p-16 relative z-10 select-none bg-[radial-gradient(ellipse_at_top_left,rgba(13,17,23,0.7),transparent)] border-r border-[#1C2333]/20">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#00FFB2]/10 rounded-xl border border-[#00FFB2]/20">
                <Scissors className="w-6 h-6 text-[#00FFB2]" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-[#EAEAEA]">BgRemover <span className="text-[#00FFB2]">Pro</span></span>
            </div>

            <div className="space-y-6 max-w-lg my-12">
              <div className="inline-block px-3 py-1 bg-[#00FFB2]/10 border border-[#00FFB2]/20 rounded-full text-xs font-semibold text-[#00FFB2] tracking-wide">
                ✦ GENERATIVE AI 2.0
              </div>
              <h1 className="text-5xl font-extrabold font-display leading-[1.1] tracking-tight bg-gradient-to-r from-[#EAEAEA] via-[#FFFFFF] to-[#9CA3AF] bg-clip-text text-transparent">
                Remove Backgrounds. Instantly. <span className="bg-gradient-to-r from-[#00FFB2] to-[#5B6EFF] bg-clip-text">In HD.</span>
              </h1>
              <p className="text-base text-gray-400 font-medium leading-relaxed">
                Upload any photograph. Our serverless AI meticulously separates the subject with clean edges in seconds. Fully responsive workspace included.
              </p>

              {/* Floating Cards Mockup */}
              <div className="relative h-64 w-full mt-10">
                {/* Float Card 1 */}
                <div className="absolute top-4 left-0 w-44 bg-[#0D1117] border border-[#1C2333] p-3 rounded-2xl shadow-2xl animate-float-1">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-checkerboard mb-2">
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80" alt="Sneaker Before" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-[#FF4D6D] px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold text-white">Before</div>
                  </div>
                  <div className="h-2 w-2/3 bg-[#1C2333] rounded mb-1" />
                  <div className="h-1.5 w-1/3 bg-[#1C2333]/60 rounded" />
                </div>

                {/* Float Card 2 */}
                <div className="absolute top-12 left-48 w-44 bg-[#0D1117] border border-[#00FFB2]/30 p-3 rounded-2xl shadow-lg animate-float-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-checkerboard mb-2">
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80" alt="Sneaker After" className="w-full h-full object-cover grayscale brightness-125" style={{ filter: "drop-shadow(0px 8px 16px rgba(0,255,178,0.25))" }} />
                    <div className="absolute top-2 left-2 bg-[#00FFB2]/20 border border-[#00FFB2]/40 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold text-[#00FFB2]">After</div>
                  </div>
                  <div className="h-2 w-1/2 bg-[#1C2333] rounded mb-1" />
                  <div className="h-1.5 w-1/4 bg-[#1C2333]/60 rounded" />
                </div>

                {/* Float Card 3 */}
                <div className="absolute top-6 left-[23rem] w-40 bg-[#0D1117] border border-[#1C2333] p-3 rounded-2xl shadow-2xl animate-float-3">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-checkerboard mb-2">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" alt="Portrait" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] tracking-wide font-extrabold text-white">AI Cutout Ready</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {["✦ HD Quality", "✦ AI Powered", "✦ Instant Download"].map((pill) => (
                <div key={pill} className="px-4 py-2 bg-[#0D1117] border border-[#1C2333] rounded-full text-xs font-semibold text-gray-300">
                  {pill}
                </div>
              ))}
            </div>
          </div>

          {/* Right Form Card */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
            <div className="w-full max-w-md bg-[#0D1117] border border-[#1C2333] rounded-2xl p-8 shadow-2xl relative">
              <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-[#00FFB2]/50 to-transparent" />
              
              <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                <Scissors className="w-6 h-6 text-[#00FFB2]" />
                <span className="text-xl font-bold font-display tracking-tight text-[#EAEAEA]">BgRemover <span className="text-[#00FFB2]">Pro</span></span>
              </div>

              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-2xl font-bold font-display text-[#EAEAEA]">Welcome back</h2>
                <p className="text-sm text-gray-400 mt-1">Sign in to continue removing backgrounds</p>
              </div>

              {/* Google Sign In Button */}
              <button 
                id="google-signin-btn"
                type="button" 
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-[#FFFFFF] hover:bg-gray-100 text-[#05080F] font-semibold rounded-xl py-3 px-4 transition-all duration-300 scale-100 hover:scale-[1.02] shadow-lg shadow-white/5 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-[#1C2333]" />
                <span className="px-3 text-xs text-gray-500 uppercase tracking-widest font-semibold">— or sign in with email —</span>
                <div className="flex-1 h-px bg-[#1C2333]" />
              </div>

              {/* Login Email Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      id="login-email-input"
                      type="email" 
                      placeholder="you@domain.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#1C2333] focus:border-[#00FFB2] rounded-xl px-4 py-3 pl-12 text-[#EAEAEA] outline-none text-sm transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Password</label>
                    <button 
                      type="button"
                      onClick={() => setCurrentPage("forgot")}
                      className="text-xs font-semibold text-[#00FFB2] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      id="login-pass-input"
                      type={showLoginPassword ? "text" : "password"} 
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#1C2333] focus:border-[#00FFB2] rounded-xl px-4 py-3 pl-12 pr-12 text-[#EAEAEA] outline-none text-sm transition-all duration-300"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="w-5 h-5 text-gray-500 hover:text-gray-300 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  id="login-submit-btn"
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#00FFB2] to-[#5B6EFF] hover:brightness-110 text-slate-950 font-bold rounded-xl py-3 px-4 transition-all duration-300 transform scale-100 hover:scale-[1.02] shadow-lg shadow-[#00FFB2]/10 cursor-pointer text-center"
                >
                  Sign In to Account
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6 font-medium">
                Don't have an account?{" "}
                <button 
                  onClick={() => setCurrentPage("register")} 
                  className="text-[#00FFB2] hover:underline font-semibold cursor-pointer"
                >
                  Create one
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {currentPage === "register" && (
        <div id="register-page" className="relative flex min-h-screen flex-col lg:flex-row items-center justify-center p-4 lg:p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,178,0.05),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(91,110,255,0.06),transparent_50%)]" />

          {/* Left Panel */}
          <div className="hidden lg:flex flex-col w-1/2 min-h-screen justify-between p-16 relative z-10 select-none bg-[radial-gradient(ellipse_at_top_left,rgba(13,17,23,0.7),transparent)] border-r border-[#1C2333]/20">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#00FFB2]/10 rounded-xl border border-[#00FFB2]/20">
                <Scissors className="w-6 h-6 text-[#00FFB2]" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-[#EAEAEA]">BgRemover <span className="text-[#00FFB2]">Pro</span></span>
            </div>

            <div className="space-y-6 max-w-lg my-12">
              <div className="inline-block px-3 py-1 bg-[#5B6EFF]/10 border border-[#5B6EFF]/20 rounded-full text-xs font-semibold text-[#5B6EFF] tracking-wide">
                ✦ FREE ACCESS PASS
              </div>
              <h1 className="text-5xl font-extrabold font-display leading-[1.1] tracking-tight bg-gradient-to-r from-[#EAEAEA] via-[#FFFFFF] to-[#9CA3AF] bg-clip-text text-transparent">
                Create Free <span className="bg-gradient-to-r from-[#00FFB2] to-[#5B6EFF] bg-clip-text">Professional Studio</span> Account
              </h1>
              <p className="text-base text-gray-400 font-medium leading-relaxed">
                Unlock instant image downloads, custom backdrops, adjustment configurations, and historical template tracking.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {["✦ HD Quality", "✦ AI Powered", "✦ Instant Download"].map((pill) => (
                <div key={pill} className="px-4 py-2 bg-[#0D1117] border border-[#1C2333] rounded-full text-xs font-semibold text-gray-300">
                  {pill}
                </div>
              ))}
            </div>
          </div>

          {/* Register Card */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
            <div className="w-full max-w-md bg-[#0D1117] border border-[#1C2333] rounded-2xl p-8 shadow-2xl relative">
              <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-[#5B6EFF]/50 to-transparent" />

              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-2xl font-bold font-display text-[#EAEAEA]">Create your account</h2>
                <p className="text-sm text-gray-400 mt-1">Free 10 HD credits instantly loaded on setup</p>
              </div>

              {/* Google Sign In Button */}
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-[#FFFFFF] hover:bg-gray-100 text-[#05080F] font-semibold rounded-xl py-3 px-4 transition-all duration-300 scale-100 hover:scale-[1.02] shadow-lg shadow-white/5 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
              </button>

              <div className="flex items-center my-5">
                <div className="flex-1 h-px bg-[#1C2333]" />
                <span className="px-3 text-xs text-gray-500 uppercase tracking-widest font-semibold">— or use email —</span>
                <div className="flex-1 h-px bg-[#1C2333]" />
              </div>

              {/* Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Jane Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#1C2333] focus:border-[#00FFB2] rounded-xl px-4 py-3 pl-12 text-[#EAEAEA] outline-none text-sm transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" 
                      placeholder="jane@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#1C2333] focus:border-[#00FFB2] rounded-xl px-4 py-3 pl-12 text-[#EAEAEA] outline-none text-sm transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type={showRegisterPassword ? "text" : "password"} 
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full bg-[#0D1117] border border-[#1C2333] focus:border-[#00FFB2] rounded-xl px-4 py-3 pl-12 text-[#EAEAEA] outline-none text-sm transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Confirm</label>
                    <div className="relative">
                      <input 
                        type={showRegisterPassword ? "text" : "password"} 
                        placeholder="••••••••"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className="w-full bg-[#0D1117] border border-[#1C2333] focus:border-[#00FFB2] rounded-xl px-4 py-3 text-[#EAEAEA] outline-none text-sm transition-all duration-300"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="w-5 h-5 text-gray-500 hover:text-gray-300 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#00FFB2] to-[#5B6EFF] hover:brightness-110 text-slate-950 font-bold rounded-xl py-3 px-4 transition-all duration-300 transform scale-100 hover:scale-[1.02] shadow-lg shadow-[#00FFB2]/15 cursor-pointer text-center"
                >
                  Create Studio Account
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6 font-medium">
                Already have an account?{" "}
                <button 
                  onClick={() => setCurrentPage("login")} 
                  className="text-[#00FFB2] hover:underline font-semibold cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {currentPage === "forgot" && (
        <div id="forgot-page" className="relative flex min-h-screen items-center justify-center p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,178,0.05),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(91,110,255,0.06),transparent_50%)]" />

          <div className="w-full max-w-[420px] bg-[#0D1117] border border-[#1C2333] rounded-2xl p-8 shadow-2xl relative z-10 text-center">
            <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-[#00FFB2]/40 to-transparent" />

            {!forgotSubmitted ? (
              <>
                <div className="mx-auto w-16 h-16 bg-[#00FFB2]/10 rounded-2xl border border-[#00FFB2]/20 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-[#00FFB2] rounded-2xl filter blur-md opacity-30 animate-pulse" />
                  <Lock className="w-8 h-8 text-[#00FFB2]" />
                </div>

                <h2 className="text-2xl font-bold font-display text-[#EAEAEA]">Reset Your Password</h2>
                <p className="text-sm text-gray-400 mt-2">Enter your email and we'll send you a recovery reset link</p>

                <form onSubmit={handleForgotSubmit} className="space-y-4 mt-6 text-left">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Email Address</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="email" 
                        required
                        placeholder="you@domain.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-[#0D1117] border border-[#1C2333] focus:border-[#00FFB2] rounded-xl px-4 py-3 pl-12 text-[#EAEAEA] outline-none text-sm transition-all duration-300"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#00FFB2] to-[#5B6EFF] hover:brightness-110 text-slate-950 font-bold rounded-xl py-3 px-4 transition-all duration-300 cursor-pointer text-center"
                  >
                    Send Reset Link
                  </button>
                </form>
              </>
            ) : (
              <div className="space-y-6">
                <div className="scale-in-bounce mx-auto w-16 h-16 bg-[#00FFB2]/20 rounded-2xl border border-[#00FFB2] flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[#00FFB2]" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold font-display text-[#00FFB2]">Reset link sent!</h2>
                  <p className="text-[#EAEAEA] text-sm font-semibold mt-2">Check your inbox: {forgotEmail}</p>
                  <p className="text-xs text-gray-500 mt-1">Didn't receive it? Check spam or try again.</p>
                </div>

                <button 
                  onClick={() => {
                    setResendTimer(5);
                    showToast("New password link resent!", "success");
                  }}
                  disabled={resendTimer > 0}
                  className={`w-full py-3 px-4 font-semibold rounded-xl border border-[#1C2333] transition-all duration-300 text-sm flex items-center justify-center gap-2 cursor-pointer ${
                    resendTimer > 0 
                      ? "bg-[#0D1117] text-gray-500 cursor-not-allowed" 
                      : "bg-[#1C2333] hover:bg-[#1C2333]/80 text-[#EAEAEA]"
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${resendTimer > 0 ? "animate-spin" : ""}`} />
                  {resendTimer > 0 ? `Resend Email (${resendTimer}s)` : "Resend Email"}
                </button>
              </div>
            )}

            <button 
              onClick={() => {
                setForgotSubmitted(false);
                setCurrentPage("login");
              }}
              className="mt-6 text-sm font-semibold text-gray-400 hover:text-white flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          </div>
        </div>
      )}

      {currentPage === "dashboard" && (
        <div id="dashboard" className="min-h-screen flex flex-col">
          {/* Top Navbar */}
          <header className="fixed top-0 inset-x-0 h-16 bg-[#0D1117]/80 backdrop-blur-md border-b border-[#1C2333] flex items-center justify-between px-6 z-40">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-[#00FFB2]" />
              <span className="text-lg font-bold font-display tracking-tight text-[#EAEAEA]">BgRemover <span className="text-[#00FFB2]">Pro</span></span>
            </div>

            {/* Middle Nav Custom Tabs */}
            <nav className="flex space-x-1 bg-[#05080F] border border-[#1C2333] p-1 rounded-xl">
              {(["editor", "myimages", "templates"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold tracking-wide uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                    activeTab === tab 
                      ? "bg-[#00FFB2] text-slate-950 font-extrabold shadow-sm" 
                      : "text-gray-400 hover:text-gray-200 hover:bg-[#1C2333]/50"
                  }`}
                >
                  {tab === "editor" ? "Editor" : tab === "myimages" ? "My Images" : "Templates"}
                </button>
              ))}
            </nav>

            {/* Right details */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center justify-center px-3 py-1 bg-[#00FFB2]/10 border border-[#00FFB2]/20 rounded-full text-xs font-bold text-[#00FFB2]">
                ✦ 10 Credits
              </div>
              <div className="flex items-center gap-2.5">
                <img 
                  src={currentUser?.avatar || "https://ui-avatars.com/api/?name=User&background=00FFB2"} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-[#1C2333]"
                />
                <span className="hidden md:inline text-xs font-bold text-gray-300">{currentUser?.name || "Guest"}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 border border-[#1C2333] hover:border-red-500 hover:bg-red-500/10 rounded-xl transition-all text-gray-400 hover:text-red-400 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Main Dashboard Panel inside workspace padding */}
          <main className="flex-1 pt-24 px-6 pb-8 overflow-y-auto">
            
            {activeTab === "editor" && (
              <div className="h-full flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
                
                {/* Left panel layout 60% */}
                <div className="w-full lg:w-[60%] flex flex-col bg-[#0D1117] border border-[#1C2333] rounded-2xl p-6 shadow-xl min-h-[480px] justify-between">
                  
                  {/* Upload Stage */}
                  {!uploadedFile ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
                      
                      {/* Interactive Drag Zone Area */}
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleFileChange(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full max-w-md border-2 border-dashed border-[#1C2333] hover:border-[#00FFB2]/50 bg-[#05080F] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 transform scale-100 hover:scale-[1.01] hover:shadow-2xl hover:shadow-[#00FFB2]/5 group animate-pulse-border"
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileChange(e.target.files[0]);
                            }
                          }}
                          accept="image/*"
                          className="hidden" 
                        />
                        <div className="w-14 h-14 bg-[#00FFB2]/5 group-hover:bg-[#00FFB2]/10 border border-[#1C2333] group-hover:border-[#00FFB2]/30 rounded-2xl flex items-center justify-center mb-6 transition-all">
                          <Upload className="w-6 h-6 text-[#00FFB2]" />
                        </div>
                        <h3 className="font-semibold text-[#EAEAEA] text-lg font-display tracking-wide">Drag & drop your image here</h3>
                        <p className="text-gray-500 text-xs mt-1 font-medium">Supports JPG, PNG, WEBP — Max 20MB</p>
                        
                        <button className="mt-5 px-5 py-2.5 bg-[#00FFB2]/10 text-[#00FFB2] hover:bg-[#00FFB2] hover:text-slate-950 font-bold text-xs rounded-xl border border-[#00FFB2]/20 transition-all font-display uppercase tracking-wide cursor-pointer">
                          Browse Files
                        </button>
                      </div>

                      {/* Sample Test Options */}
                      <div className="mt-10 text-center w-full max-w-md">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-4">— or test with standard sample —</span>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { name: "Model Portrait", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" },
                            { name: "Neon Sneaker", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
                            { name: "Potted Nature", url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=80" }
                          ].map((samp) => (
                            <button 
                              key={samp.name}
                              onClick={() => loadSampleImage(samp.url, `${samp.name}.jpg`)}
                              className="bg-[#05080F] border border-[#1C2333] hover:border-[#00FFB2] p-2 rounded-xl transition-all flex flex-col items-center gap-1.5 cursor-pointer group text-[10px]"
                            >
                              <img src={samp.url} alt={samp.name} className="w-full aspect-square object-cover rounded-lg group-hover:scale-102 transition-all" />
                              <span className="font-bold text-gray-400 group-hover:text-white truncate max-w-[80px]">{samp.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Rendering Display Preview or Comparison Split Sliders
                    <div className="flex-1 flex flex-col justify-between h-full">
                      
                      {/* Display original preview metadata bar */}
                      <div className="flex items-center justify-between border-b border-[#1C2333]/50 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                          <div className="truncate max-w-[150px] sm:max-w-xs">
                            <span className="text-sm font-semibold text-[#EAEAEA] block truncate">{fileDetails.name}</span>
                            <span className="text-xs text-gray-500 block truncate">{fileDetails.dimensions} • {fileDetails.size}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setUploadedFile(null);
                              setRemovedBgURL(null);
                              setEditedCanvasURL(null);
                              setActiveTool('select');
                            }}
                            className="px-3 py-1 text-xs border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Clear
                          </button>
                        </div>
                      </div>

                      {/* EDIT TOOLBAR Above Image Preview */}
                      {removedBgURL && (
                        <div className="w-full flex flex-col gap-3 bg-[#0D1117] border border-[#1C2333]/70 p-3.5 rounded-2xl mb-4 transition-all">
                          {/* Main Row: Desktop horizontal / Mobile stacked */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            
                            {/* Toolbar Buttons (horizontal pill) */}
                            <div className="flex flex-wrap items-center gap-1.5 bg-[#1C2333] rounded-2xl px-3 py-1.5 w-full sm:w-auto justify-center sm:justify-start">
                              <button
                                onClick={() => {
                                  setActiveTool('select');
                                  showToast("Select / comparison view active", "info");
                                }}
                                className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                  activeTool === 'select'
                                    ? 'bg-[#00FFB2] text-slate-950 font-extrabold shadow-sm shadow-[#00FFB2]/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                title="Default Select Tools / Comparison Slider (S)"
                              >
                                <span className="rotate-0 inline-block">🖱️</span> Select
                              </button>
                              
                              <button
                                onClick={() => {
                                  setActiveTool('eraser');
                                  showToast("Eraser active — Click and draw on image components to delete", "info");
                                }}
                                className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                  activeTool === 'eraser'
                                    ? 'bg-[#00FFB2] text-slate-950 font-extrabold shadow-sm shadow-[#00FFB2]/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                title="Eraser tool - Draw transparency on cutout layer (E)"
                              >
                                <span>🧹</span> Eraser
                              </button>

                              <button
                                onClick={handleRestoreCanvas}
                                className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                                title="Restore original background-removed cutout completely, clearing all manual erase strokes (R)"
                              >
                                <span>🔄</span> Restore
                              </button>

                              <div className="w-px h-4 bg-slate-700/50 mx-1 hidden min-[360px]:block" />

                              <button
                                onClick={handleUndo}
                                disabled={undoStack.length === 0}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                                title="Undo last segment adjustment (Ctrl+Z)"
                              >
                                <span>↩</span> Undo
                              </button>

                              <button
                                onClick={handleRedo}
                                disabled={redoStack.length === 0}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                                title="Redo segmented adjustment (Ctrl+Y)"
                              >
                                <span>↪</span> Redo
                              </button>
                            </div>

                            {/* Zoom controls for pixel-precision */}
                            <div className="flex items-center gap-1 bg-[#1C2333] rounded-2xl px-3 py-1.5 w-full sm:w-auto justify-center sm:justify-start">
                              <span className="text-xs font-mono font-bold text-[#00FFB2] px-1.5 mr-auto sm:mr-0">Zoom: {zoom}%</span>
                              <button
                                onClick={handleZoomOut}
                                className="p-1 px-2 text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 rounded-lg hover:text-white transition-all cursor-pointer font-bold flex items-center gap-1"
                                title="Zoom Out image display size (🔎)"
                              >
                                <span>🔎</span> Zoom Out
                              </button>
                              <button
                                onClick={handleZoomIn}
                                className="p-1 px-2 text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 rounded-lg hover:text-white transition-all cursor-pointer font-bold flex items-center gap-1"
                                title="Zoom In display size (🔍)"
                              >
                                <span>🔍</span> Zoom In
                              </button>
                              <button
                                onClick={handleZoomReset}
                                className="p-1 px-2 text-[10px] bg-[#05080F] border border-[#1C2333] text-gray-400 rounded-lg hover:border-[#00FFB2] hover:text-[#00FFB2] transition-all cursor-pointer font-bold flex items-center gap-1"
                                title="Fit elements back to workspace bounds"
                              >
                                <span>⊡</span> Fit Screen
                              </button>
                            </div>

                          </div>

                          {/* Brush options controls nested under active brush states */}
                          {(activeTool === 'eraser' || activeTool === 'restore') && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#05080F]/45 p-3 rounded-xl border border-[#1C2333]/60 transition-all">
                                {/* Brush size */}
                                <div className="space-y-0.5">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                                    <span>Brush Size</span>
                                    <span className="text-[#00FFB2] font-mono">Brush Size: {brushSize}px</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(Number(e.target.value))}
                                    className="w-full h-1 bg-[#1C2333] accent-[#00FFB2] rounded-lg cursor-pointer"
                                  />
                                </div>

                                {/* Softness */}
                                <div className="space-y-0.5">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                                    <span>Brush Softness</span>
                                    <span className="text-[#00FFB2] font-mono">Softness: {brushSoftness}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={brushSoftness}
                                    onChange={(e) => setBrushSoftness(Number(e.target.value))}
                                    className="w-full h-1 bg-[#1C2333] accent-[#00FFB2] rounded-lg cursor-pointer"
                                  />
                                </div>

                                {/* Opacity */}
                                <div className="space-y-0.5">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                                    <span>Brush Opacity</span>
                                    <span className="text-[#00FFB2] font-mono">Opacity: {brushOpacity}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={brushOpacity}
                                    onChange={(e) => setBrushOpacity(Number(e.target.value))}
                                    className="w-full h-1 bg-[#1C2333] accent-[#00FFB2] rounded-lg cursor-pointer"
                                  />
                                </div>
                              </div>

                              {/* Fine Detail Magnified Mirror Settings Row */}
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#05080F]/60 p-3 rounded-xl border border-[#1C2333]/50">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-[#EAEAED] tracking-wider uppercase">🔍 Precision Magnifier Mirror:</span>
                                  <button
                                    onClick={() => setShowMirror(!showMirror)}
                                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                                      showMirror 
                                        ? 'bg-[#00FFB2]/10 text-[#00FFB2] border-[#00FFB2]/30 shadow' 
                                        : 'bg-slate-900 text-gray-400 border-[#1C2333]/80'
                                    }`}
                                  >
                                    {showMirror ? '🟢 Enabled' : '🔴 Disabled'}
                                  </button>
                                </div>

                                {showMirror && (
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mirror Zoom:</span>
                                    <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-[#1C2333]">
                                      {[2, 4, 8].map((factor) => (
                                        <button
                                          key={factor}
                                          onClick={() => setMirrorMag(factor)}
                                          className={`text-[9px] font-black px-2.5 py-1 rounded transition-all cursor-pointer ${
                                            mirrorMag === factor 
                                              ? 'bg-[#00FFB2] text-slate-950 shadow font-black' 
                                              : 'text-gray-400 hover:text-white hover:bg-[#1C2333]/40'
                                          }`}
                                        >
                                          {factor}X
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Middle Live Area image viewport frame */}
                      <div className="flex-1 flex items-center justify-center bg-[#05080F] rounded-xl border border-[#1C2333] relative overflow-hidden min-h-[300px]">
                        
                        {/* Overlay Spinner block while loading */}
                        {isProcessing && (
                          <div className="absolute inset-0 bg-[#05080F]/90 flex flex-col items-center justify-center p-6 z-30 select-none text-center animate-fade-in">
                            <div className="relative mb-5">
                              <div className="absolute inset-0 bg-[#00FFB2] rounded-full filter blur-xl opacity-30 animate-pulse" />
                              <Loader2 className="w-12 h-12 text-[#00FFB2] animate-spin relative" />
                            </div>
                            <h3 className="text-lg font-bold font-display text-white tracking-wide">{processStep}</h3>
                            <p className="text-xs text-gray-500 mt-1 max-w-[280px]">Generating precise alpha-mask mappings. Do not close this browser.</p>
                            
                            {/* Thin slider meter */}
                            <div className="w-full max-w-[220px] h-1 bg-[#1C2333] rounded-full mt-6 overflow-hidden relative">
                              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00FFB2] to-[#5B6EFF] animate-ping-move w-full rounded-full" style={{ animation: "scan 4s infinite linear" }} />
                            </div>
                          </div>
                        )}

                        {/* Background Applying Spinner overlay */}
                        {isApplyingBg && (
                          <div className="absolute inset-0 bg-[#05080F]/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 select-none text-center animate-fade-in" id="bg-applying-spinner-overlay">
                            <div className="relative mb-3">
                              <div className="absolute inset-0 bg-[#00FFB2] rounded-full filter blur-md opacity-25 animate-pulse" />
                              <Loader2 className="w-10 h-10 text-[#00FFB2] animate-spin relative" />
                            </div>
                            <span className="text-[#00FFB2] text-xs font-bold font-mono tracking-widest uppercase animate-pulse">Applying Background...</span>
                          </div>
                        )}

                        {/* If Background processed, show slider workspace or active manual brush edits */}
                        {removedBgURL ? (
                          <>
                            {/* VIEW/COMPARE WORKSPACE (Visible only when select mode is active) */}
                            <div className={`absolute inset-0 w-full h-full ${activeTool !== 'select' ? 'hidden' : ''}`}>
                              {selectedBg && selectedBg !== 'transparent' && isPositionMode ? (
                                <div 
                                  className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-checkerboard relative select-none animate-fade-in"
                                  id="sticker-position-workspace"
                                >
                                  <div 
                                    className="relative flex items-center justify-center transition-all duration-150"
                                    style={{
                                      width: '90%',
                                      height: '90%',
                                      transform: `scale(${zoom / 100})`,
                                      transformOrigin: 'center center'
                                    }}
                                  >
                                    {/* Layer 1: Background Canvas */}
                                    <canvas 
                                      ref={backgroundCanvasRef}
                                      className="absolute max-h-full max-w-full object-contain pointer-events-none shadow-2xl"
                                      style={{ zIndex: 1 }}
                                    />
                                    
                                    {/* Layer 2: Interactive Canvas */}
                                    <canvas 
                                      ref={interactiveCanvasRef}
                                      onMouseDown={handlePointerDown}
                                      onMouseMove={handlePointerMove}
                                      onMouseUp={handlePointerUp}
                                      onMouseLeave={handlePointerUp}
                                      onTouchStart={handlePointerDown}
                                      onTouchMove={handlePointerMove}
                                      onTouchEnd={handlePointerUp}
                                      className="absolute max-h-full max-w-full object-contain shadow-2xl cursor-grab active:cursor-grabbing transition-shadow duration-150"
                                      style={{ zIndex: 2, background: 'transparent' }}
                                    />
                                  </div>

                                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#05080F]/95 border border-[#00FFB2]/30 text-[#00FFB2] text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full shadow-2xl z-20 flex items-center gap-1.5 backdrop-blur-md">
                                    <span className="w-1.5 h-1.5 bg-[#00FFB2] rounded-full animate-pulse" />
                                    Drag subject • Resize handles • Arrow keys nudging
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  ref={containerRef}
                                  onMouseMove={handleMouseMove}
                                  onTouchMove={handleTouchMove}
                                  className="absolute inset-0 w-full h-full select-none cursor-ew-resize bg-[#010409] relative overflow-hidden animate-fade-in"
                                  style={{
                                    background: selectedBg ? (selectedBg.startsWith("#") ? selectedBg : `url(${selectedBg}) center/cover no-repeat`) : undefined
                                  }}
                                >
                                  {/* Backdrop shadow view container matching user adjustments */}
                                  <div 
                                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                                    style={{
                                      filter: `brightness(${brightness}%) contrast(${contrast}%) ${dropShadow ? "drop-shadow(0px 20px 30px rgba(0,0,0,0.60))" : ""}`
                                    }}
                                  >
                                    {/* Left Layer: Original Object representation */}
                                    <div 
                                      className="absolute inset-y-0 left-0 overflow-hidden" 
                                      style={{ width: `${sliderPos}%` }}
                                    >
                                      <div className="absolute inset-0 w-full h-full flex items-center justify-center" style={{ width: containerRef.current?.getBoundingClientRect().width }}>
                                        <img 
                                          src={originalImageURL || ""} 
                                          alt="Original" 
                                          className="max-h-full max-w-full object-contain pointer-events-none" 
                                        />
                                      </div>
                                    </div>

                                    {/* Right Layer: Processed Layer */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      <img 
                                        src={editedCanvasURL || removedBgURL} 
                                        alt="Cutout Subject" 
                                        className="max-h-full max-w-full object-contain pointer-events-none" 
                                      />
                                    </div>
                                  </div>

                                  {/* Split slider handle indicator bar */}
                                  <div 
                                    className="absolute inset-y-0 w-1 bg-white flex items-center justify-center z-20 pointer-events-none"
                                    style={{ left: `${sliderPos}%` }}
                                  >
                                    <div className="w-8 h-8 rounded-full bg-white text-slate-900 border-2 border-white flex items-center justify-center shadow-2xl pointer-events-auto cursor-ew-resize">
                                      <span className="text-[10px] font-extrabold select-none">↔</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* MANUAL ERASER / DRAWING WORKSPACE (Visible only when select mode is inactive) */}
                            <div 
                              onMouseDown={handleWorkspaceMouseDown}
                              onMouseMove={handleWorkspaceMouseMove}
                              onMouseUp={handleWorkspaceMouseUp}
                              onTouchStart={handleWorkspaceTouchStart}
                              onTouchMove={handleWorkspaceTouchMove}
                              onTouchEnd={handleWorkspaceTouchEnd}
                              onWheel={handleWorkspaceWheel}
                              className={`absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center p-6 select-none ${
                                activeTool === 'select' ? 'hidden' : 'cursor-none'
                              }`}
                              style={{
                                background: selectedBg && selectedBg !== 'transparent' ? (selectedBg.startsWith("#") ? selectedBg : `url(${selectedBg}) center/cover no-repeat`) : undefined
                              }}
                            >
                              <div 
                                className="canvas-container shadow-2xl"
                                style={getWrapperStyle()}
                              >
                                <ManualEraserCanvas
                                  key={removedBgURL}
                                  removedBgURL={removedBgURL}
                                  activeTool={activeTool}
                                  brushSize={brushSize}
                                  brushSoftness={brushSoftness}
                                  brushOpacity={brushOpacity}
                                  zoom={zoom}
                                  workingCanvasRef={workingCanvasRef}
                                  originalCanvasRef={originalCanvasRef}
                                  setOrigWidth={setOrigWidth}
                                  setOrigHeight={setOrigHeight}
                                  saveToUndoStack={saveToUndoStack}
                                  updateEditedCanvasSnapshot={updateEditedCanvasSnapshot}
                                  showCursor={showCursor}
                                  setShowCursor={setShowCursor}
                                  cursorPos={cursorPos}
                                  setCursorPos={setCursorPos}
                                  brightness={brightness}
                                  contrast={contrast}
                                  dropShadow={dropShadow}
                                  isSpacePressed={isSpacePressed}
                                  onCanvasUpdate={handleCanvasUpdate}
                                />
                              </div>

                              {/* Floating Precision Magnifier Mirror View overlay */}
                              {showMirror && showCursor && (activeTool === 'eraser' || activeTool === 'restore') && (
                                <div 
                                  className="absolute top-4 right-4 bg-[#05080F]/95 border text-slate-200 border-[#00FFB2]/40 rounded-2xl p-3 shadow-2xl z-30 backdrop-blur-md w-[190px] flex flex-col items-center gap-2 animate-fade-in pointer-events-auto"
                                >
                                  {/* Header */}
                                  <div className="flex items-center justify-between w-full border-b border-[#1C2333]/80 pb-1.5 px-0.5">
                                    <span className="text-[9px] font-black tracking-widest text-[#00FFB2] uppercase">🔍 Mirror ({mirrorMag}X Zoom)</span>
                                    <span className="text-[9px] font-mono font-black text-[#00FFB2]/70 bg-[#00FFB2]/10 px-1.5 py-0.5 rounded">Live</span>
                                  </div>

                                  {/* Canvas with checkerboard pattern */}
                                  <div 
                                    className="relative w-[160px] h-[160px] rounded-xl overflow-hidden border border-[#1C2333]/80 bg-slate-950 flex items-center justify-center shadow-inner"
                                    style={{
                                      backgroundImage: `
                                        linear-gradient(45deg, #181f2f 25%, transparent 25%),
                                        linear-gradient(-45deg, #181f2f 25%, transparent 25%),
                                        linear-gradient(45deg, transparent 75%, #181f2f 75%),
                                        linear-gradient(-45deg, transparent 75%, #181f2f 75%)
                                      `,
                                      backgroundSize: '12px 12px',
                                      backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
                                      backgroundColor: '#0a0d14',
                                    }}
                                  >
                                    <canvas 
                                      ref={mirrorCanvasRef}
                                      className="w-full h-full block"
                                      style={{ imageRendering: 'pixelated' }}
                                    />
                                    {/* Crosshair visual helper overlay lines for double precision */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                      <div className="w-[18px] h-[1px] bg-[#00FFB2]/60 absolute" />
                                      <div className="h-[18px] w-[1px] bg-[#00FFB2]/60 absolute" />
                                    </div>
                                  </div>

                                  {/* Real-time Magnification Select Grid */}
                                  <div className="flex items-center gap-1.5 w-full justify-between pt-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Magnify:</span>
                                    <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-[#1C2333]">
                                      {[2, 4, 8].map((factor) => (
                                        <button
                                          key={factor}
                                          onClick={() => setMirrorMag(factor)}
                                          className={`text-[9px] font-extrabold px-2 py-1 rounded transition-all cursor-pointer ${
                                            mirrorMag === factor 
                                              ? 'bg-[#00FFB2] text-slate-950 shadow-md font-black' 
                                              : 'text-gray-400 hover:text-white hover:bg-[#1C2333]/40'
                                          }`}
                                        >
                                          {factor}x
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Floating status bar info display */}
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#05080F]/90 border border-[#00FFB2]/30 text-[#00FFB2] text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full shadow-2xl z-20 flex items-center gap-1.5 backdrop-blur-md">
                                <span className="w-1.5 h-1.5 bg-[#00FFB2] rounded-full animate-pulse" />
                                {activeTool === 'eraser' ? '🧹 Eraser ON — drag over background to erase' : '🔁 Restore ON — drag to bring back erased areas'}
                              </div>
                            </div>
                          </>
                        ) : (
                          // Default original view before processed triggers
                          <div className="p-4 flex items-center justify-center h-full max-h-[400px]">
                            <img src={originalImageURL || ""} alt="Raw Upload" className="max-h-[380px] object-contain rounded-lg shadow-xl" />
                          </div>
                        )}

                        {/* Custom Dynamic Brush Outline Floating Cursor */}
                        {showCursor && (activeTool === 'eraser' || activeTool === 'restore') && (
                          <div 
                            className="fixed pointer-events-none rounded-full border border-white z-50 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-normal shadow-md"
                            style={{
                              left: cursorPos.x,
                              top: cursorPos.y,
                              width: `${brushSize * (zoom / 100)}px`,
                              height: `${brushSize * (zoom / 100)}px`,
                              backgroundColor: activeTool === 'eraser' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(34, 197, 94, 0.25)',
                            }}
                          >
                            <div className={`w-1 h-1 rounded-full ${activeTool === 'eraser' ? 'bg-red-500' : 'bg-green-500'}`} />
                          </div>
                        )}

                      </div>

                      {/* Display tip helper instruction */}
                      <p className="text-center text-[10px] text-gray-500 mt-3 font-semibold tracking-wider uppercase bg-[#05080F] py-2 rounded-lg border border-[#1C2333]/50">
                        {removedBgURL ? "⚡ TIP: HOLD & DRAG TO COMPARE SUBJECT MASK" : "✦ CLICK \"REMOVE BACKGROUND\" IN THE CONTROLS TO BEGIN"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right controls panel layout 40% */}
                <div className="w-full lg:w-[40%] flex flex-col gap-5">
                  
                  {/* Primary Trigger card */}
                  <div className="bg-[#0D1117] border border-[#1C2333] rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-[#00FFB2] to-transparent" />
                    
                    {!removedBgURL ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#00FFB2]" />
                          <h3 className="font-bold text-[#EAEAEA] font-display">AI Processing Pipeline</h3>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Click the button below to process the image and completely isolate the foreground with our server-side neural edge networks.</p>
                        
                        <button 
                          onClick={() => {
                            if (uploadedFile) processImageBackground(uploadedFile);
                          }}
                          disabled={!uploadedFile || isProcessing}
                          className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 transform scale-100 uppercase text-xs tracking-wider font-display cursor-pointer bg-gradient-to-r from-[#00FFB2] to-[#5B6EFF] hover:brightness-110 text-slate-950 hover:scale-[1.02] shadow-lg shadow-[#00FFB2]/5 ${
                            !uploadedFile ? "opacity-50 cursor-not-allowed filter grayscale" : ""
                          }`}
                        >
                          <Sparkles className="w-4 h-4" /> Remove Background
                        </button>
                      </div>
                    ) : (
                      // Adjustment customizers panels
                      <div className="space-y-5">
                        
                        {/* Section A: Background Customizer */}
                        <div>
                          <div className="flex items-center justify-between mb-3 border-b border-[#1C2333]/30 pb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block font-display">Backdrop Customizer</span>
                            <span className="text-[10px] text-[#00FFB2] uppercase font-bold tracking-wider relative">Canvas Live HD</span>
                          </div>

                           {/* Category Tabs Scrollable Horizontal Row */}
                          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 mb-3 max-w-full">
                            {(["all", "nature", "city", "sunset", "beach", "studio", "solid"] as const).map((cat) => (
                              <button
                                key={cat}
                                onClick={() => {
                                  setBgCategory(cat);
                                  // Clear search term when clicking solid to avoid confusing empty states
                                  if (cat === "solid" && bgSearchTerm !== "") setBgSearchTerm("");
                                }}
                                className={`text-[10px] uppercase tracking-wider font-extrabold whitespace-nowrap px-3.5 py-1.5 rounded-full transition-all duration-250 cursor-pointer ${
                                  bgCategory === cat 
                                    ? "bg-[#00FFB2] text-slate-950 shadow-sm shadow-[#00FFB2]/20 scale-102"
                                    : "bg-[#161D2B] text-gray-400 hover:text-white hover:bg-[#1C2333]"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>

                          {/* Search Input Bar */}
                          <div className="relative mb-3 bg-slate-950 rounded-xl border border-[#1C2333] transition-all focus-within:border-[#00FFB2]/50">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <Search className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              value={bgSearchTerm}
                              onChange={(e) => setBgSearchTerm(e.target.value)}
                              placeholder="Search backdrops (e.g., Forest, Neon, Brick, Gold)..."
                              className="w-full bg-transparent pl-9 pr-14 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-0 font-medium"
                            />
                            {bgSearchTerm && (
                              <button
                                type="button"
                                onClick={() => setBgSearchTerm("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-[9px] font-black uppercase tracking-wider bg-[#1C2333] px-2 py-1 rounded transition-all cursor-pointer"
                              >
                                Clear
                              </button>
                            )}
                          </div>

                          {/* Render Category List thumbnails */}
                          <div className="min-h-[145px] max-h-[290px] overflow-y-auto mb-1 pr-1">
                            {isThumbnailsLoading ? (
                              <div className="grid grid-cols-4 gap-2 animate-fade-in unique-bg-templates-shimmer-grid">
                                {Array.from({ length: 8 }).map((_, index) => (
                                  <div key={index} className="flex flex-col gap-1 p-1 bg-[#101622]/40 border border-[#161D2B] rounded-xl overflow-hidden">
                                    <div className="w-full aspect-[4/3] rounded-lg bg-[#1C2333]/70 animate-pulse" />
                                    <div className="h-1.5 w-1/2 bg-[#1C2333]/75 rounded mt-1.5 mx-auto animate-pulse" />
                                  </div>
                                ))}
                              </div>
                            ) : bgCategory === "solid" ? (
                              <div className="space-y-3.5 animate-fade-in pr-0.5">
                                <div className="grid grid-cols-4 gap-2">
                                  {PREMIUM_SOLIDS.filter(color => 
                                    bgSearchTerm === "" || color.name.toLowerCase().includes(bgSearchTerm.toLowerCase())
                                  ).map((color) => (
                                    <button
                                      key={color.hex}
                                      onClick={() => handleSelectBg(color.hex)}
                                      className={`group flex flex-col items-center gap-1 p-0.5 rounded-xl border transition-all cursor-pointer ${
                                        selectedBg === color.hex
                                          ? "border-[#00FFB2] ring-2 ring-[#00FFB2]/30 bg-[#0C121F]"
                                          : "border-[#1C2333] hover:scale-105 hover:bg-[#101726]/30 bg-[#0A0F1D]/45"
                                      }`}
                                    >
                                      <div
                                        className="w-full aspect-[4/3] rounded-lg border border-white/5 shadow-inner"
                                        style={{ backgroundColor: color.hex }}
                                      />
                                      <span className="text-[9px] text-gray-500 group-hover:text-gray-300 mt-0.5 font-semibold truncate max-w-full text-center px-0.5">
                                        {color.name}
                                      </span>
                                    </button>
                                  ))}
                                  {PREMIUM_SOLIDS.filter(color => 
                                    bgSearchTerm === "" || color.name.toLowerCase().includes(bgSearchTerm.toLowerCase())
                                  ).length === 0 && (
                                    <div className="col-span-4 text-center py-8 text-gray-500 text-xs">
                                      No solid backdrops match "{bgSearchTerm}"
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between gap-3 bg-[#090F1B] p-2.5 rounded-xl border border-[#1C2333]">
                                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Custom Picker:</span>
                                  <div className="flex items-center gap-2 flex-1 justify-end">
                                    <input
                                      type="color"
                                      value={customBgHex}
                                      onChange={(e) => {
                                        setCustomBgHex(e.target.value);
                                        handleSelectBg(e.target.value);
                                      }}
                                      className="w-10 h-6 bg-transparent cursor-pointer rounded border border-[#1C2333]"
                                    />
                                    <span className="text-xs font-mono text-[#00FFB2] font-black uppercase tracking-wider">{customBgHex}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-4 gap-2 animate-fade-in pr-0.5">
                                {/* Transparent option */}
                                <button
                                  onClick={() => handleSelectBg('transparent')}
                                  className={`group relative flex flex-col items-center gap-1 p-0.5 rounded-xl border transition-all cursor-pointer ${
                                    selectedBg === 'transparent' || selectedBg === null
                                      ? "border-[#00FFB2] ring-2 ring-[#00FFB2]/30 bg-[#0C121F]"
                                      : "border-[#1C2333] hover:scale-105 bg-[#0A0F1D]/45"
                                  }`}
                                >
                                  <div className="w-full aspect-[4/3] rounded-lg bg-checkerboard flex items-center justify-center border border-white/5">
                                    <span className="text-[10px] text-white font-extrabold uppercase tracking-wide">None</span>
                                  </div>
                                  <span className="text-[9px] text-gray-500 group-hover:text-gray-300 font-bold truncate max-w-full text-center">
                                    Transparent
                                  </span>
                                </button>

                                {/* List backgrounds (templates + custom uploads + dynamic searches) */}
                                {(() => {
                                  const filteredBackgrounds = [
                                    ...customBackgrounds.filter(bg => 
                                      bgSearchTerm === "" || bg.name.toLowerCase().includes(bgSearchTerm.toLowerCase())
                                    ),
                                    ...BACKGROUND_TEMPLATES.filter(tmpl => {
                                      const categoryMatches = bgCategory === "all" || tmpl.category === bgCategory;
                                      const searchMatches = bgSearchTerm === "" || 
                                        tmpl.name.toLowerCase().includes(bgSearchTerm.toLowerCase()) || 
                                        tmpl.category.toLowerCase().includes(bgSearchTerm.toLowerCase());
                                      return categoryMatches && searchMatches;
                                    })
                                  ];

                                  // If search term is entered, offer a dynamic high-quality Unsplash Source query card in the grid!
                                  if (bgSearchTerm.trim() !== "") {
                                    filteredBackgrounds.push({
                                      id: "dynamic-unsplash-search-query",
                                      name: `Dynamic "${bgSearchTerm}"`,
                                      url: `https://images.unsplash.com/featured/400x300/?${encodeURIComponent(bgSearchTerm)}`,
                                      fullUrl: `https://images.unsplash.com/featured/1920x1080/?${encodeURIComponent(bgSearchTerm)}`,
                                      category: "all" as const
                                    });
                                  }

                                  if (filteredBackgrounds.length === 0) {
                                    return (
                                      <div className="col-span-3 text-center py-8 text-gray-500 text-xs bg-slate-950/20 border border-dashed border-[#1C2333]/80 rounded-xl">
                                        No assets found for "{bgSearchTerm}"
                                      </div>
                                    );
                                  }

                                  return filteredBackgrounds.map((tmpl) => {
                                    const isSelected = selectedBg === tmpl.url || selectedBg === tmpl.fullUrl;
                                    const isFailed = failedBgURLs[tmpl.url] || failedBgURLs[tmpl.fullUrl];
                                    return (
                                      <button
                                        key={tmpl.id}
                                        onClick={() => handleSelectBg(tmpl.fullUrl || tmpl.url)}
                                        className={`group relative flex flex-col items-center gap-1 p-0.5 rounded-xl border transition-all cursor-pointer overflow-hidden ${
                                          isSelected
                                            ? "border-[#00FFB2] ring-2 ring-[#00FFB2]/30 bg-[#0C121F]"
                                            : isFailed
                                            ? "border-red-500 ring-2 ring-red-500/20 bg-red-950/10"
                                            : "border-[#1C2333] hover:scale-105 bg-[#0A0F1D]/45"
                                        }`}
                                      >
                                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-900/45">
                                          <img
                                            src={tmpl.url}
                                            alt={tmpl.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                            onError={() => {
                                              setFailedBgURLs(prev => ({ ...prev, [tmpl.url]: true }));
                                              showToast(`Failed to load backdrop: ${tmpl.name}`, "error");
                                            }}
                                          />
                                          
                                          {/* Hover Tooltip Overlay */}
                                          <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none p-1">
                                            <span className="text-[9px] text-[#00FFB2] font-extrabold uppercase tracking-wider">{tmpl.name}</span>
                                          </div>
                                        </div>
                                        
                                        <span className="text-[9px] text-gray-500 group-hover:text-gray-300 font-semibold truncate max-w-full text-center px-0.5">
                                          {tmpl.category === "custom" ? "Custom" : tmpl.name}
                                        </span>
                                      </button>
                                    );
                                  });
                                })()}
                              </div>
                            )}
                          </div>

                          {/* Upload Your Own Background trigger bar */}
                          <div className="mt-4 pt-1.5">
                            <button
                              onClick={() => customBgInputRef.current?.click()}
                              className="w-full py-2.5 border-2 border-dashed border-[#1C2333]/80 hover:border-[#00FFB2] rounded-xl flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 hover:text-[#00FFB2] bg-[#05080F]/40 hover:bg-[#00FFB2]/5 transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4 text-[#00FFB2]" />
                              <span>+ Upload Your Own Background</span>
                            </button>
                            <input
                              type="file"
                              ref={customBgInputRef}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleCustomBgChange(e.target.files[0]);
                                }
                              }}
                              accept="image/*"
                              className="hidden"
                            />
                          </div>

                        </div>

                        {/* Section B: Adjustment controls */}
                        <div className="space-y-3.5 border-t border-[#1C2333]/30 pt-3">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block font-display">Contrast & Shadow</span>
                          
                          {/* Brightness slider */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                              <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5" /> Brightness</span>
                              <span className="text-[#00FFB2] font-mono">{brightness}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="50" 
                              max="150" 
                              value={brightness}
                              onChange={(e) => setBrightness(Number(e.target.value))}
                              className="w-full accent-[#00FFB2] h-[5px] bg-[#05080F] rounded-lg cursor-pointer appearance-none"
                            />
                          </div>

                          {/* Contrast slider */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                              <span className="flex items-center gap-1"><Contrast className="w-3.5 h-3.5" /> Contrast</span>
                              <span className="text-[#00FFB2] font-mono">{contrast}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="50" 
                              max="150" 
                              value={contrast}
                              onChange={(e) => setContrast(Number(e.target.value))}
                              className="w-full accent-[#00FFB2] h-[5px] bg-[#05080F] rounded-lg cursor-pointer appearance-none"
                            />
                          </div>

                          {/* Drop shadow Toggle button */}
                          <div className="flex items-center justify-between py-2 border-t border-[#1C2333]/10">
                            <span className="text-xs text-gray-300 font-bold">Cast Subject Drop Shadow</span>
                            <button 
                              onClick={() => setDropShadow(!dropShadow)}
                              className={`w-11 h-6 rounded-full p-0.5 transition-all outline-none cursor-pointer ${
                                dropShadow ? "bg-[#00FFB2]" : "bg-[#1C2333]"
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all ${
                                dropShadow ? "translate-x-5" : "translate-x-0"
                              }`} />
                            </button>
                          </div>
                        </div>

                        {/* Section B.2: Position Adjustments (Only visible when background is selected) */}
                        {selectedBg && selectedBg !== 'transparent' && (
                          <div className="space-y-3 pt-3 border-t border-[#1C2333]/30">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block font-display">Sticker Layer Controls</span>
                              <button
                                onClick={() => {
                                  setIsPositionMode(!isPositionMode);
                                  showToast(isPositionMode ? "Position Mode Off" : "Position Mode Active!", "info");
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider transition-all duration-150 ${
                                  isPositionMode
                                    ? "bg-[#00FFB2] text-slate-950 shadow-sm"
                                    : "bg-[#1C2333] text-gray-400 hover:text-white"
                                }`}
                              >
                                {isPositionMode ? "Active" : "Disabled"}
                              </button>
                            </div>
                            
                            {isPositionMode ? (
                              <div className="space-y-3 animate-fade-in text-xs text-gray-400 bg-[#05080F]/45 p-3 rounded-xl border border-[#161D2B]">
                                
                                {/* Positioning coordinates information */}
                                <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                                  <div className="bg-[#05080F]/80 p-1.5 rounded border border-[#161D2B] text-center">
                                    <span className="text-gray-500 uppercase font-bold text-[8px] block">Position X</span>
                                    <span className="text-white font-black">{Math.round(subjectX)}px</span>
                                  </div>
                                  <div className="bg-[#05080F]/80 p-1.5 rounded border border-[#161D2B] text-center">
                                    <span className="text-gray-500 uppercase font-bold text-[8px] block">Position Y</span>
                                    <span className="text-white font-black">{Math.round(subjectY)}px</span>
                                  </div>
                                  <div className="bg-[#05080F]/80 p-1.5 rounded border border-[#161D2B] text-center col-span-2">
                                    <span className="text-gray-500 uppercase font-bold text-[8px] block">Layout Bounds</span>
                                    <span className="text-white font-black">{Math.round(subjectWidth)}w × {Math.round(subjectHeight)}h px</span>
                                  </div>
                                </div>

                                {/* Precision directional movement pad */}
                                <div className="space-y-1.5">
                                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Precision Nudges</div>
                                  <div className="flex justify-center gap-1.5">
                                    <button
                                      title="Nudge Up (ArrowUp; hold Shift for 1px shifts)"
                                      onClick={() => setSubjectY(p => p - 10)}
                                      className="w-8 h-8 rounded bg-slate-900 border border-slate-800 text-white hover:border-[#00FFB2] flex items-center justify-center font-bold text-xs cursor-pointer transition-all active:scale-95"
                                    >
                                      ▲
                                    </button>
                                  </div>
                                  <div className="flex justify-center gap-1.5">
                                    <button
                                      title="Nudge Left (ArrowLeft)"
                                      onClick={() => setSubjectX(p => p - 10)}
                                      className="w-8 h-8 rounded bg-slate-900 border border-slate-800 text-white hover:border-[#00FFB2] flex items-center justify-center font-bold text-xs cursor-pointer transition-all active:scale-95"
                                    >
                                      ◀
                                    </button>
                                    <button
                                      title="Center (C)"
                                      onClick={() => {
                                        alignSubject('center');
                                        alignSubject('middle');
                                        showToast("Centered subject", "success");
                                      }}
                                      className="w-8 h-8 rounded bg-slate-900 border border-[#00FFB2]/30 text-[#00FFB2] hover:border-[#00FFB2] flex items-center justify-center font-extrabold text-[10px] cursor-pointer transition-all active:scale-95"
                                    >
                                      ◎
                                    </button>
                                    <button
                                      title="Nudge Right (ArrowRight)"
                                      onClick={() => setSubjectX(p => p + 10)}
                                      className="w-8 h-8 rounded bg-slate-900 border border-slate-800 text-white hover:border-[#00FFB2] flex items-center justify-center font-bold text-xs cursor-pointer transition-all active:scale-95"
                                    >
                                      ▶
                                    </button>
                                  </div>
                                  <div className="flex justify-center gap-1.5">
                                    <button
                                      title="Nudge Down (ArrowDown)"
                                      onClick={() => setSubjectY(p => p + 10)}
                                      className="w-8 h-8 rounded bg-slate-900 border border-slate-800 text-white hover:border-[#00FFB2] flex items-center justify-center font-bold text-xs cursor-pointer transition-all active:scale-95"
                                    >
                                      ▼
                                    </button>
                                  </div>
                                </div>

                                {/* Alignments */}
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-center">Quick Alignment</span>
                                  <div className="grid grid-cols-3 gap-1">
                                    <button
                                      onClick={() => alignSubject('left')}
                                      className="py-1 px-1 bg-slate-900 border border-slate-800 hover:border-[#00FFB2] rounded text-[10px] font-semibold text-center cursor-pointer transition-all"
                                    >
                                      Left
                                    </button>
                                    <button
                                      onClick={() => alignSubject('center')}
                                      className="py-1 px-1 bg-slate-900 border border-slate-800 hover:border-[#00FFB2] rounded text-[10px] font-semibold text-center cursor-pointer transition-all"
                                    >
                                      Center X
                                    </button>
                                    <button
                                      onClick={() => alignSubject('right')}
                                      className="py-1 px-1 bg-slate-900 border border-slate-800 hover:border-[#00FFB2] rounded text-[10px] font-semibold text-center cursor-pointer transition-all"
                                    >
                                      Right
                                    </button>
                                    <button
                                      onClick={() => alignSubject('top')}
                                      className="py-1 px-1 bg-slate-900 border border-slate-800 hover:border-[#00FFB2] rounded text-[10px] font-semibold text-center cursor-pointer transition-all"
                                    >
                                      Top
                                    </button>
                                    <button
                                      onClick={() => alignSubject('middle')}
                                      className="py-1 px-1 bg-slate-900 border border-slate-800 hover:border-[#00FFB2] rounded text-[10px] font-semibold text-center cursor-pointer transition-all"
                                    >
                                      Middle Y
                                    </button>
                                    <button
                                      onClick={() => alignSubject('bottom')}
                                      className="py-1 px-1 bg-slate-900 border border-slate-800 hover:border-[#00FFB2] rounded text-[10px] font-semibold text-center cursor-pointer transition-all"
                                    >
                                      Bottom
                                    </button>
                                  </div>
                                </div>

                                {/* Layer Scale Slider */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span>Subject Scale</span>
                                    <span className="text-[#00FFB2]">{Math.round(scale * 100)}%</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0.1" 
                                    max="2.0" 
                                    step="0.01"
                                    value={scale}
                                    onChange={(e) => handleScaleChange(Number(e.target.value))}
                                    className="w-full accent-[#00FFB2] h-[5px] bg-[#05080F] rounded-lg cursor-pointer appearance-none"
                                  />
                                  <div className="flex items-center justify-between gap-1 mt-1 text-[9px] text-gray-500 font-bold">
                                    <button onClick={() => handleScaleChange(0.5)} className="hover:text-white px-1">0.5x</button>
                                    <button onClick={() => handleScaleChange(1.0)} className="hover:text-[#00FFB2] px-1 bg-slate-900 border border-slate-800 rounded">1.0x (Fit)</button>
                                    <button onClick={() => handleScaleChange(1.5)} className="hover:text-white px-1">1.5x</button>
                                  </div>
                                </div>

                                {/* Flip Options */}
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-center">Flipping Transforms</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <button
                                      onClick={() => setFlipHorizontal(p => !p)}
                                      className={`py-1.5 px-2 font-mono text-[9px] font-black tracking-widest border rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                        flipHorizontal
                                          ? "bg-[#00FFB2]/10 border-[#00FFB2] text-[#00FFB2]"
                                          : "bg-slate-900/60 border-[#1C2333] hover:border-slate-700 text-gray-400"
                                      }`}
                                    >
                                      <span>↔</span> FLIP H
                                    </button>
                                    <button
                                      onClick={() => setFlipVertical(p => !p)}
                                      className={`py-1.5 px-2 font-mono text-[9px] font-black tracking-widest border rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                        flipVertical
                                          ? "bg-[#00FFB2]/10 border-[#00FFB2] text-[#00FFB2]"
                                          : "bg-slate-900/60 border-[#1C2333] hover:border-slate-700 text-gray-400"
                                      }`}
                                    >
                                      <span>↕</span> FLIP V
                                    </button>
                                  </div>
                                </div>

                              </div>
                            ) : (
                              <div className="text-[10px] text-center text-gray-500 italic py-1">Positioning layer adjustment controls is disabled. Turn active to interact.</div>
                            )}

                          </div>
                        )}

                        {/* Section C: Reset background button */}
                        <div className="border-t border-[#1C2333]/30 pt-3">
                          <button 
                            onClick={() => {
                              setSelectedBg(null);
                              showToast("Background backdrop reset!", "info");
                            }}
                            className="w-full py-2 border border-[#1C2333] hover:border-red-500/20 hover:bg-[#1C2333]/30 text-xs font-semibold text-gray-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove Set Backdrop
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Section D: Persistent Download action bar (after processed) */}
                  {removedBgURL && (
                    <div className="bg-[#0D1117] border border-[#1C2333] rounded-2xl p-6 shadow-xl space-y-4">
                      
                      {/* Resolution Quality Custom Selection */}
                      <div className="space-y-2.5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block font-display">
                            Output Resolution Quality:
                          </span>
                          <span className="text-[10px] bg-[#00FFB2]/10 border border-[#00FFB2]/30 px-2 py-0.5 rounded text-[#00FFB2] font-black uppercase tracking-wider">
                            Ultra Crisp Mode
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(['original', '2k', '3k', '4k'] as const).map((q) => {
                            const { w, h } = getResolutionForQuality(q);
                            const label = q === 'original' ? 'Original' : q.toUpperCase();
                            const isSelected = exportQuality === q;
                            return (
                              <button
                                key={q}
                                type="button"
                                onClick={() => setExportQuality(q)}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[#00FFB2]/10 border-[#00FFB2] text-white shadow-md' 
                                    : 'bg-[#101524]/50 border-[#1C2333] text-gray-400 hover:text-white hover:bg-[#161D2F]'
                                }`}
                              >
                                <span className={`text-[11px] font-black tracking-wide uppercase ${isSelected ? 'text-[#00FFB2]' : ''}`}>
                                  {label}
                                </span>
                                <span className="text-[9px] font-mono text-gray-500 font-bold mt-0.5">
                                  {w} × {h} px
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Interactive Use-Case Suitability Preview Notification */}
                        <div className="mt-2 p-2.5 bg-[#0A0F1D]/60 rounded-xl border border-[#1C2333] text-[11px] text-gray-400 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-gray-300 font-bold">Preview Target: </span>
                            {exportQuality === 'original' && <span className="text-[#00E5FF]">Original source match ({getResolutionForQuality('original').w} × {getResolutionForQuality('original').h}px)</span>}
                            {exportQuality === '2k' && <span className="text-[#00FFB2]">2K (2048px max dim) — Ideal for Social Media & Web Use</span>}
                            {exportQuality === '3k' && <span className="text-pink-400">3K (3072px max dim) — Perfect for Premium E-commerce Stores</span>}
                            {exportQuality === '4k' && <span className="text-violet-400">4K Ultra HD (4096px max dim) — Print-Ready & Studio Quality</span>}
                          </div>
                          {!selectedBg || selectedBg === 'transparent' ? (
                            <span className="text-[9px] text-[#00FFB2] bg-[#00FFB2]/10 border border-[#00FFB2]/20 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                              Transparent PNG Ok
                            </span>
                          ) : (
                            <span className="text-[9px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                              Composite Render
                            </span>
                          )}
                        </div>
                      </div>

                      {/* AI Super-Resolution Sharpness & Detail Upscale Tuner */}
                      <div className="bg-[#101524]/40 border border-[#1C2333]/70 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enableAISharpen}
                              onChange={(e) => setEnableAISharpen(e.target.checked)}
                              className="accent-[#00FFB2] rounded border-gray-700 bg-slate-900"
                            />
                            <span className="text-xs font-bold text-gray-200 uppercase tracking-wide">
                              Enable AI Super-Resolution Sharpening
                            </span>
                          </label>
                          <span className="text-[9px] bg-sky-500/10 text-sky-400 font-extrabold uppercase px-2 py-0.5 rounded font-mono border border-sky-500/20">
                            Anti-Blur Engine
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                          Preserves original textures, micro-details, colors, and sharpness during resolution upscaling, avoiding compression loss and pixelation.
                        </p>
                        
                        {enableAISharpen && (
                          <div className="space-y-1 pt-1.5 border-t border-[#1C2333]/50">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-gray-400">Enhancement Intensity Balance:</span>
                              <span className="text-[#00FFB2]">{Math.round(sharpenIntensity * 100)}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0.05"
                                max="0.5"
                                step="0.05"
                                value={sharpenIntensity}
                                onChange={(e) => setSharpenIntensity(parseFloat(e.target.value))}
                                className="w-full accent-[#00FFB2] cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-gray-500 font-black uppercase">
                              <span>Natural Detail</span>
                              <span>Balanced Crisp</span>
                              <span>Maximum Studio Sharp</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => exportImage('png')}
                          className="py-3 px-4 bg-gradient-to-r from-[#00FFB2] to-[#00E5FF] hover:brightness-110 rounded-xl font-bold font-display uppercase tracking-wider text-xs transition-all text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer transform hover:scale-[1.02] shadow-sm shadow-[#00FFB2]/10"
                        >
                          <Download className="w-4 h-4" /> Download HD PNG
                        </button>
                        
                        <button 
                          onClick={() => exportImage('jpg')}
                          className="py-3 px-4 bg-[#1C2333] hover:bg-[#1C2333]/80 rounded-xl font-bold font-display uppercase tracking-wider text-xs transition-all text-white flex items-center justify-center gap-1.5 cursor-pointer transform hover:scale-[1.02]"
                        >
                          <Download className="w-4 h-4" /> Download JPG
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-[#1C2333]/30 pt-3.5 text-[11px] text-gray-400 font-bold tracking-wider gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <span>Target Quality: <span className="text-[#00FFB2] font-mono uppercase font-black">{exportQuality === 'original' ? 'Original size' : exportQuality.toUpperCase()}</span></span>
                          <span>Dimensions: <span className="text-gray-300 font-mono">{getResolutionForQuality(exportQuality).w} × {getResolutionForQuality(exportQuality).h} px</span></span>
                          <span>Format: <span className="text-gray-300">PNG / JPG</span></span>
                        </div>
                        <span className="text-[#00FFB2] font-black uppercase tracking-widest flex items-center gap-1">
                          ✓ Anti-Blur Resampling
                        </span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* My Images History Tab */}
            {activeTab === "myimages" && (
              <div id="my-images-tab" className="max-w-7xl mx-auto">
                <div className="mb-6 flex items-center justify-between border-b border-[#1C2333]/30 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-white">My Processed Images</h2>
                    <p className="text-xs text-gray-400 mt-1">A real-time storage history of isolated subjects created in this dashboard sesión.</p>
                  </div>
                  {savedImages.length > 0 && (
                    <button 
                      onClick={() => {
                        setSavedImages([]);
                        showToast("History gallery cleared!", "info");
                      }}
                      className="px-3 py-1.5 border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear History
                    </button>
                  )}
                </div>

                {savedImages.length === 0 ? (
                  <div className="bg-[#0D1117] border border-[#1C2333] rounded-2xl p-16 text-center select-none max-w-xl mx-auto mt-12">
                    <div className="w-16 h-16 bg-[#1C2333] border border-[#1C2333] rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Folder className="w-7 h-7 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold font-display text-[#EAEAEA]">No images yet</h3>
                    <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">Start by uploading an image into the Background AI processing editor section to produce high definition cutouts.</p>
                    <button 
                      onClick={() => setActiveTab("editor")}
                      className="mt-6 px-6 py-2.5 bg-[#00FFB2] text-slate-950 font-bold rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      Navigate to Editor
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {savedImages.map((img) => (
                      <div key={img.id} className="bg-[#0D1117] border border-[#1C2333] rounded-2xl p-4 shadow-xl flex flex-col justify-between group">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-checkerboard mb-4">
                          <img src={img.resultUrl} alt={img.name} className="w-full h-full object-contain p-2" />
                        </div>
                        <div className="space-y-2 mb-4 text-left">
                          <h4 className="text-sm font-semibold truncate text-[#EAEAEA]">{img.name}</h4>
                          <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                            <span>{img.date}</span>
                            <span>{img.dimensions}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => {
                              // Reload to Editor workspace
                              setOriginalImageURL(img.originalUrl);
                              setRemovedBgURL(img.resultUrl);
                              setUploadedFile(new File([], `${img.name}.png`));
                              setFileDetails({ name: img.name, dimensions: img.dimensions, size: "Compressed Copy" });
                              setActiveTab("editor");
                              showToast("Loaded back in Editor workspace!", "info");
                            }}
                            className="py-2 bg-[#1C2333] hover:bg-[#1C2333]/80 text-white font-bold text-xs rounded-xl transition-all uppercase text-center cursor-pointer"
                          >
                            Open in Editor
                          </button>
                          <a 
                            href={img.resultUrl} 
                            download={`${img.name}_bgremover.png`}
                            className="py-2 bg-gradient-to-r from-[#00FFB2] to-[#5B6EFF] hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl transition-all uppercase text-center cursor-pointer"
                          >
                            Get PNG
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Templates Workspace tab */}
            {activeTab === "templates" && (
              <div id="templates-tab" className="max-w-7xl mx-auto">
                <div className="mb-8 border-b border-[#1C2333]/30 pb-4">
                  <h2 className="text-2xl font-bold font-display text-white">High Impact Backdrop Presets</h2>
                  <p className="text-xs text-gray-400 mt-1">Enhance branding, e-commerce products, or social media pages with configured backdrops instantly.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {TEMPLATES.map((tmpl) => (
                    <div key={tmpl.id} className="bg-[#0D1117] border border-[#1C2333] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-5 items-center justify-between hover:border-[#00FFB2]/50 transition-all duration-300 transform scale-100 hover:scale-[1.01]">
                      
                      <div className="w-24 h-24 rounded-2xl flex-shrink-0 overflow-hidden border border-[#1C2333] flex items-center justify-center bg-checkerboard" style={{
                        background: tmpl.bg.startsWith("#") ? tmpl.bg : `url(${tmpl.bg}) center/cover`
                      }}>
                        <div className="bg-slate-950/20 backdrop-blur-sm p-2 rounded-full border border-white/20">
                          <Scissors className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      <div className="text-center md:text-left flex-1">
                        <h3 className="font-bold font-display text-base text-white">{tmpl.title}</h3>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1 max-w-sm">{tmpl.desc}</p>
                      </div>

                      <button 
                        onClick={() => {
                          setSelectedBg(tmpl.bg);
                          setActiveTab("editor");
                          showToast(`Applied ${tmpl.title} template style!`, "success");
                        }}
                        className="px-5 py-2.5 bg-[#00FFB2]/10 hover:bg-[#00FFB2] text-[#00FFB2] hover:text-slate-950 font-bold text-xs rounded-xl transition-all border border-[#00FFB2]/20 uppercase tracking-widest font-display cursor-pointer"
                      >
                        Apply Style
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>
      )}

    </div>
  );
}
