/**
 * Utility functions for exporting visualizations
 */
import type * as THREE from "three";
import type { WebGLRenderer } from "three";

/**
 * Exports a canvas element as a PNG image
 * @param canvas The canvas element to export
 * @param filename The filename for the downloaded image
 */
export const exportToPng = (canvas: HTMLCanvasElement, filename = "visualization"): void => {
  // Convert canvas to data URL
  const dataUrl = canvas.toDataURL("image/png");

  // Create a download link
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = dataUrl;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Creates an SVG representation of a 2D norm visualization
 * @param points Array of [x, y] coordinates of points on the boundary
 * @param width Width of the SVG
 * @param height Height of the SVG
 * @param k The k value of the norm
 * @returns SVG string
 */
export const createSvgFromPoints = (
  points: [number, number][],
  width: number,
  height: number,
  k: number
): string => {
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min(width, height) / 2.5;

  // Create path data string
  let pathData = "";
  points.forEach((point, index) => {
    const [x, y] = point;
    const svgX = centerX + x * scale;
    const svgY = centerY - y * scale;

    if (index === 0) {
      pathData += `M ${svgX} ${svgY}`;
    } else {
      pathData += ` L ${svgX} ${svgY}`;
    }
  });
  pathData += " Z"; // Close the path

  // Create SVG string
  const svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
  
  <!-- Axes -->
  <line x1="0" y1="${centerY}" x2="${width}" y2="${centerY}" stroke="#ccc" stroke-width="1"/>
  <line x1="${centerX}" y1="0" x2="${centerX}" y2="${height}" stroke="#ccc" stroke-width="1"/>
  
  <!-- Unit marks on x-axis -->
  ${[-1, -0.5, 0.5, 1]
    .map((i) => {
      const x = centerX + i * scale;
      return `
  <line x1="${x}" y1="${centerY - 5}" x2="${x}" y2="${centerY + 5}" stroke="#888" stroke-width="1"/>
  <text x="${x}" y="${centerY + 20}" text-anchor="middle" fill="#888">${i}</text>`;
    })
    .join("")}
  
  <!-- Unit marks on y-axis -->
  ${[-1, -0.5, 0.5, 1]
    .map((i) => {
      const y = centerY - i * scale;
      return `
  <line x1="${centerX - 5}" y1="${y}" x2="${centerX + 5}" y2="${y}" stroke="#888" stroke-width="1"/>
  <text x="${centerX - 20}" y="${y}" text-anchor="middle" fill="#888">${i}</text>`;
    })
    .join("")}
  
  <!-- Lk-norm boundary -->
  <path d="${pathData}" fill="none" stroke="#646cff" stroke-width="2"/>
  
  <!-- Title -->
  <text x="10" y="20" font-family="Arial" font-size="16" fill="#000">L${k.toFixed(1)}-norm boundary</text>
</svg>`;

  return svgString;
};

/**
 * Exports an SVG string as a file
 * @param svgString The SVG content as a string
 * @param filename The filename for the downloaded SVG
 */
export const exportToSvg = (svgString: string, filename = "visualization"): void => {
  // Create a blob from the SVG string
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  // Create a download link
  const link = document.createElement("a");
  link.download = `${filename}.svg`;
  link.href = url;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
};

/**
 * Exports a Three.js scene as a PNG image
 * @param renderer The WebGL renderer
 * @param scene The scene to render
 * @param camera The camera to use for rendering
 * @param filename The filename for the downloaded image
 */
export const exportThreeSceneToPng = (
  renderer: WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  filename = "visualization_3d"
): void => {
  // Render the scene
  renderer.render(scene, camera);

  // Get the canvas from the renderer
  const canvas = renderer.domElement;

  // Export to PNG
  exportToPng(canvas, filename);
};
