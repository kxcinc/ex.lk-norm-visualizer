import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { exportThreeSceneToPng } from "../utils/exportUtils";
import { calculateLkNorm } from "../utils/mathUtils";

interface LkNormSurfaceProps {
  k: number;
  fixedRotation?: { x?: number; y?: number; z?: number };
}

// Component to handle screenshot export
const SceneExporter: React.FC<{ k: number }> = ({ k }) => {
  const { gl, scene, camera } = useThree();

  // Function to export the current view as PNG
  const exportScene = useCallback(() => {
    exportThreeSceneToPng(gl, scene, camera, `lk_norm_${k.toFixed(1)}_visualization_3d`);
  }, [gl, scene, camera, k]);

  // Register in parent window to be called from outside the Canvas
  // @ts-ignore
  window.exportThreeScene = exportScene;

  return null;
};

// Helper component to generate the Lk-norm boundary in 3D
const LkNormSurface: React.FC<LkNormSurfaceProps> = ({ k, fixedRotation }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate the surface geometry
  const geometry = useMemo(() => {
    // Parameters for surface generation
    const resolution = 40;
    const geometry = new THREE.IcosahedronGeometry(1, resolution);

    // Modify each vertex to be on the Lk-norm boundary
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i] as number;
      const y = positions[i + 1] as number;
      const z = positions[i + 2] as number;

      // Calculate the current norm value
      const normValue = calculateLkNorm([x, y, z], k);

      // Scale to be on the boundary where ||x||^k_k = 1
      const scaleFactor = 1 / normValue;

      positions[i] = x * scaleFactor;
      positions[i + 1] = y * scaleFactor;
      positions[i + 2] = z * scaleFactor;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, [k]);

  // Effect to set fixed rotation once when it changes
  useEffect(() => {
    if (meshRef.current && fixedRotation) {
      // Set fixed rotation values
      if (fixedRotation.x !== undefined) meshRef.current.rotation.x = fixedRotation.x;
      if (fixedRotation.y !== undefined) meshRef.current.rotation.y = fixedRotation.y;
      if (fixedRotation.z !== undefined) meshRef.current.rotation.z = fixedRotation.z;
    }
  }, [fixedRotation]);

  // Apply rotation only if not fixed
  useFrame(() => {
    if (meshRef.current && !fixedRotation) {
      // Only auto-rotate when rotation is not fixed
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#646cff" side={THREE.DoubleSide} transparent opacity={0.8} />
    </mesh>
  );
};

// Axis component
const Axes: React.FC = () => {
  return (
    <group>
      {/* X-axis */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            args={[[-1.5, 0, 0, 1.5, 0, 0], 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="red" />
      </line>
      <Text position={[1.7, 0, 0]} fontSize={0.15} color="red">
        X
      </Text>

      {/* Y-axis */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            args={[[0, -1.5, 0, 0, 1.5, 0], 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="green" />
      </line>
      <Text position={[0, 1.7, 0]} fontSize={0.15} color="green">
        Y
      </Text>

      {/* Z-axis */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            args={[[0, 0, -1.5, 0, 0, 1.5], 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="blue" />
      </line>
      <Text position={[0, 0, 1.7]} fontSize={0.15} color="blue">
        Z
      </Text>
    </group>
  );
};

interface NormVisualization3DProps {
  k: number;
  fixedRotation?: { x?: number; y?: number; z?: number };
}

// Main 3D visualization component
const NormVisualization3D: React.FC<NormVisualization3DProps> = ({ k, fixedRotation }) => {
  const handleExportPng = () => {
    // @ts-ignore
    if (typeof window.exportThreeScene === "function") {
      // @ts-ignore
      window.exportThreeScene();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "block", // Ensure consistent display
        overflow: "hidden", // Prevent scrollbars during resize
      }}
    >
      <Canvas
        camera={{ position: [2, 2, 2], fov: 50 }}
        style={{ width: "100%", height: "100%" }} // Ensure canvas fills container
        resize={{ debounce: 200 }} // Add debounce to resize for smoother transitions
        frameloop={fixedRotation ? "demand" : "always"} // Only render when needed if rotation is fixed
      >
        <color attach="background" args={["#f8f8f8"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <LkNormSurface k={k} fixedRotation={fixedRotation} />
        <Axes />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={fixedRotation === undefined} // Disable rotation controls if fixedRotation is provided
        />
        <gridHelper args={[2, 10, "#888888", "#444444"]} position={[0, -1.25, 0]} />
        <Text position={[0, 1.6, 0]} fontSize={0.15} color="black" anchorX="center" anchorY="top">
          {`L${k.toFixed(1)}-norm boundary in R³`}
        </Text>
        <SceneExporter k={k} />
      </Canvas>
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <button
          type="button"
          onClick={handleExportPng}
          style={{
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
      </div>
    </div>
  );
};

export default NormVisualization3D;
