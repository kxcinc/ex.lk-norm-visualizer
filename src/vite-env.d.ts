/// <reference types="vite/client" />

declare module "*.svg" {
  import type * as React from "react";
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "@react-three/drei" {
  interface TextProps {
    children: React.ReactNode;
    position?: [number, number, number];
    fontSize?: number;
    color?: string;
    anchorX?: string;
    anchorY?: string;
  }

  interface OrbitControlsProps {
    enablePan?: boolean;
    enableZoom?: boolean;
    enableRotate?: boolean;
  }

  export const Text: React.ComponentType<TextProps>;
  export const OrbitControls: React.ComponentType<OrbitControlsProps>;
  export const useHelper: unknown;
}

// Three.js JSX elements
declare namespace JSX {
  interface IntrinsicElements {
    float32BufferAttribute: unknown;
    line: unknown;
    bufferGeometry: unknown;
    lineBasicMaterial: unknown;
    mesh: unknown;
    meshStandardMaterial: unknown;
    group: unknown;
    gridHelper: { args?: [number, number, string, string]; position?: [number, number, number] };
    color: { attach?: string; args?: [string] };
    directionalLight: { position?: [number, number, number]; intensity?: number };
    ambientLight: { intensity?: number };
  }
}
