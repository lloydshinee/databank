"use client";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";

interface ChoicesCircleProps {
  isDisabled: boolean;
  isSelected: boolean;
  choice_index: string;
  onComplete: () => void;
  isAnswer?: boolean;
  onErase?: () => void;
}

const ChoicesCircle = forwardRef(
  (
    {
      isDisabled,
      isSelected,
      choice_index,
      onComplete,
      isAnswer = false,
      onErase,
    }: ChoicesCircleProps,
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawing, setHasDrawing] = useState(false);

    // Force redraw the empty circle
    const forceRedraw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Completely reset the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isAnswer) {
        fillCircle();
      } else {
        drawCircle();
      }
      
      setHasDrawing(false);
    }, [isAnswer]);

    // Expose functions to parent component
    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        forceRedraw();
      },
      hasDrawing: () => hasDrawing,
      forceRedraw: forceRedraw
    }));

    const fillCircle = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 2 - 2;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#152259";
      ctx.fill();

      ctx.strokeStyle = isSelected ? "#00981C" : "#720000";
      ctx.lineWidth = 4;
      ctx.stroke();
    }, [isSelected]);

    const drawCircle = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.setLineDash([10, 5]);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 2 - 2;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? "#00981C" : "#720000";
      ctx.lineWidth = 4;
      ctx.stroke();
    }, [isSelected]);

    useEffect(() => {
      if (isAnswer) {
        fillCircle();
      } else if (!isSelected) {
        drawCircle();
      }
    }, [isSelected, isAnswer, drawCircle, fillCircle]);

    const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
      if (isDisabled || isAnswer) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e as React.TouchEvent).touches
        ? (e as React.TouchEvent).touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left;
      const y = (e as React.TouchEvent).touches
        ? (e as React.TouchEvent).touches[0].clientY - rect.top
        : (e as React.MouseEvent).clientY - rect.top;

      setIsDrawing(true);
      setHasDrawing(true); // Mark that we have drawing activity
      disableScrolling();

      ctx.strokeStyle = "#152259";
      ctx.lineWidth = 10;
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDrawing || isDisabled || isAnswer) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e as React.TouchEvent).touches
        ? (e as React.TouchEvent).touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left;
      const y = (e as React.TouchEvent).touches
        ? (e as React.TouchEvent).touches[0].clientY - rect.top
        : (e as React.MouseEvent).clientY - rect.top;

      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      enableScrolling();
      checkFillPercentage();
    };

    const checkFillPercentage = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const totalPixels = pixels.length / 4;
      let filledPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] > 0) filledPixels++;
      }

      const fillPercentage = (filledPixels / totalPixels) * 100;
      if (fillPercentage >= 40) {
        onComplete();
      }
    };

    const clearCanvas = () => {
      forceRedraw();
      if (onErase) onErase();
    };

    const disableScrolling = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScrolling = () => {
      document.body.style.overflow = "auto";
    };

    // Add a double-tap handler to erase
    const lastTap = useRef<number>(0);
    const handleDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300; // ms
      
      if (now - lastTap.current < DOUBLE_TAP_DELAY) {
        // Double tap detected
        e.preventDefault();
        if (hasDrawing && !isSelected && !isDisabled) {
          clearCanvas();
        }
      }
      
      lastTap.current = now;
    };

    useEffect(() => {
      if (isAnswer) {
        fillCircle();
        onComplete();  // Automatically trigger onComplete if it's the correct answer
      } else if (!isSelected) {
        drawCircle();
      }
    }, []);

    return (
      <div className="relative w-fit">
        <div className="flex items-center justify-center relative z-10">
          <canvas
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              borderStyle: isSelected ? "solid" : "dashed",
              borderWidth: "2px",
              borderSpacing: "4px",
              display: "block",
            }}
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={(e) => {
              handleDoubleTap(e);
              startDrawing(e);
            }}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onClick={handleDoubleTap}
          />
        </div>
        <p className="absolute top-[38%] left-[44%] -z-0">{choice_index}</p>
      </div>
    );
  }
);

ChoicesCircle.displayName = "ChoicesCircle";
export default ChoicesCircle;