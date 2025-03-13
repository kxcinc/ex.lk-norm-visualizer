/// <reference types="vite/client" />

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '@react-three/drei' {
  export const Text: React.ComponentType<React.PropsWithChildren<unknown>>;
  export const OrbitControls: React.ComponentType<unknown>;
  export const useHelper: unknown;
}

// Three.js JSX elements
declare namespace JSX {
  interface IntrinsicElements {
    'float32BufferAttribute': unknown;
    'line': unknown;
    'bufferGeometry': unknown;
    'lineBasicMaterial': unknown;
    'mesh': unknown;
    'meshStandardMaterial': unknown;
    'group': unknown;
    'gridHelper': unknown;
    'color': unknown;
    'directionalLight': unknown;
    'ambientLight': unknown;
  }
}