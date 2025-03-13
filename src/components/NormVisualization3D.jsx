import { useRef, useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, useHelper } from '@react-three/drei'
import * as THREE from 'three'

// Helper component to generate points on the Lk-norm boundary
const LkNormSurface = ({ k }) => {
  const meshRef = useRef()
  
  // Calculate Lk-norm for a point (x, y, z)
  const calculateLkNorm = (x, y, z, k) => {
    return Math.pow(
      Math.pow(Math.abs(x), k) + 
      Math.pow(Math.abs(y), k) + 
      Math.pow(Math.abs(z), k), 
      1/k
    )
  }
  
  // Generate the surface geometry
  const { positions, indices } = useMemo(() => {
    // Parameters for surface generation
    const segments = 48
    const positions = []
    const indices = []
    
    // Generate vertices in a spherical grid
    for (let i = 0; i <= segments; i++) {
      const phi = (i / segments) * Math.PI
      const sinPhi = Math.sin(phi)
      const cosPhi = Math.cos(phi)
      
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * 2 * Math.PI
        const sinTheta = Math.sin(theta)
        const cosTheta = Math.cos(theta)
        
        // Start with a point on the unit sphere
        let x = sinPhi * cosTheta
        let y = sinPhi * sinTheta
        let z = cosPhi
        
        // Scale to the Lk-norm boundary
        const normValue = calculateLkNorm(x, y, z, k)
        const scaleFactor = 1 / normValue
        
        x *= scaleFactor
        y *= scaleFactor
        z *= scaleFactor
        
        // Add the vertex
        positions.push(x, y, z)
      }
    }
    
    // Create faces
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j
        const b = i * (segments + 1) + j + 1
        const c = (i + 1) * (segments + 1) + j + 1
        const d = (i + 1) * (segments + 1) + j
        
        // Create two triangular faces for each grid cell
        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }
    
    return { positions, indices }
  }, [k])
  
  // Update the geometry when k changes
  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry
      const positionAttribute = geometry.getAttribute('position')
      
      // Update all vertices to match the new k value
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positions[i * 3]
        const y = positions[i * 3 + 1]
        const z = positions[i * 3 + 2]
        
        positionAttribute.setXYZ(i, x, y, z)
      }
      
      positionAttribute.needsUpdate = true
      geometry.computeVertexNormals()
    }
  }, [positions, k])
  
  return (
    <mesh ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={new Float32Array(positions)}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          array={new Uint16Array(indices)}
          itemSize={1}
        />
      </bufferGeometry>
      <meshStandardMaterial 
        color="#646cff" 
        side={THREE.DoubleSide} 
        transparent
        opacity={0.8}
        wireframe={false}
      />
    </mesh>
  )
}

// Axes helper component
const Axes = () => {
  const axesRef = useRef()
  useHelper(axesRef, THREE.AxesHelper, 1.5)
  
  return (
    <group ref={axesRef}>
      <Text position={[1.7, 0, 0]} fontSize={0.15} color="red">
        X
      </Text>
      <Text position={[0, 1.7, 0]} fontSize={0.15} color="green">
        Y
      </Text>
      <Text position={[0, 0, 1.7]} fontSize={0.15} color="blue">
        Z
      </Text>
    </group>
  )
}

// Main 3D visualization component
const NormVisualization3D = ({ k }) => {
  return (
    <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <LkNormSurface k={k} />
      <Axes />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <gridHelper args={[2, 10, '#888888', '#444444']} />
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.15}
        color="black"
        anchorX="center"
        anchorY="top"
      >
        {`L${k.toFixed(1)}-norm boundary`}
      </Text>
    </Canvas>
  )
}

export default NormVisualization3D