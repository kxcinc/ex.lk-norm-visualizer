/// <reference types="vite/client" />

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '@react-three/drei' {
  export const Text: React.ComponentType<any>;
  export const OrbitControls: React.ComponentType<any>;
  export const useHelper: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    'float32BufferAttribute': any;
    'line': any;
    'bufferGeometry': any;
    'lineBasicMaterial': any;
    'mesh': any;
    'meshStandardMaterial': any;
    'group': any;
    'gridHelper': any;
    'color': any;
    'directionalLight': any;
    'ambientLight': any;
  }
}