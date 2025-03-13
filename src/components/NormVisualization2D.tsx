import { useCallback, useEffect, useRef, useState } from "react";
import { createSvgFromPoints, exportToPng, exportToSvg } from "../utils/exportUtils";
import { calculateLkNorm } from "../utils/mathUtils";

interface NormVisualization2DProps {
  k: number;
}

const NormVisualization2D: React.FC<NormVisualization2DProps> = ({ k }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [boundaryPoints, setBoundaryPoints] = useState<[number, number][]>([]);

  // Setup canvas and resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = (): void => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      setWidth(rect.width);
      setHeight(rect.height);
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Draw the visualization
  const draw = useCallback(() => {
    if (!width || !height || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Setup coordinate system with (0,0) at center
    const scale = Math.min(width, height) / 2.5;
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;

    // x-axis
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);

    // y-axis
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);

    ctx.stroke();

    // Draw unit marks on axes
    ctx.fillStyle = "#888";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // x-axis marks
    for (let i = -1; i <= 1; i += 0.5) {
      if (i === 0) continue;
      const x = centerX + i * scale;
      ctx.fillText(i.toString(), x, centerY + 15);

      ctx.beginPath();
      ctx.moveTo(x, centerY - 5);
      ctx.lineTo(x, centerY + 5);
      ctx.stroke();
    }

    // y-axis marks
    for (let i = -1; i <= 1; i += 0.5) {
      if (i === 0) continue;
      const y = centerY - i * scale;
      ctx.fillText(i.toString(), centerX - 15, y);

      ctx.beginPath();
      ctx.moveTo(centerX - 5, y);
      ctx.lineTo(centerX + 5, y);
      ctx.stroke();
    }

    // Calculate points for the Lk-norm boundary
    const numPoints = 360;
    const points: [number, number][] = [];

    for (let angle = 0; angle <= 2 * Math.PI; angle += (2 * Math.PI) / numPoints) {
      // Start with a point on the unit circle
      let x = Math.cos(angle);
      let y = Math.sin(angle);

      // Calculate the scaling factor to make ||x||_k = 1
      const currNorm = calculateLkNorm([x, y], k);
      const scaleFactor = 1 / currNorm;

      // Scale the point to be on the Lk norm boundary
      x *= scaleFactor;
      y *= scaleFactor;

      // Store the normalized point
      points.push([x, y]);
    }

    // Store points for SVG export
    setBoundaryPoints(points);

    // Draw the boundary
    ctx.beginPath();
    ctx.strokeStyle = "#646cff";
    ctx.lineWidth = 2;

    let first = true;
    for (const [x, y] of points) {
      // Convert to canvas coordinates
      const canvasX = centerX + x * scale;
      const canvasY = centerY - y * scale;

      if (first) {
        ctx.moveTo(canvasX, canvasY);
        first = false;
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }

    ctx.closePath();
    ctx.stroke();

    // Add k value label
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`L${k.toFixed(1)}-norm boundary`, 10, 10);
  }, [width, height, k]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Export functions
  const handleExportPng = (): void => {
    if (!canvasRef.current) return;
    exportToPng(canvasRef.current, `lk_norm_${k.toFixed(1)}_visualization`);
  };

  const handleExportSvg = (): void => {
    if (boundaryPoints.length === 0) return;
    const svgString = createSvgFromPoints(boundaryPoints, width, height, k);
    exportToSvg(svgString, `lk_norm_${k.toFixed(1)}_visualization`);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <button
          type="button"
          onClick={handleExportPng}
          style={{
            marginRight: "10px",
            padding: "8px 12px",
            background: "#646cff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Export PNG
        </button>
        <button
          type="button"
          onClick={handleExportSvg}
          style={{
            padding: "8px 12px",
            background: "#646cff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Export SVG
        </button>
      </div>
    </div>
  );
};

export default NormVisualization2D;
