import React, { useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls, Text, Billboard } from "@react-three/drei"; // Billboard still used by Axes

const canvasStyle = {
  width: "100%",
  height: "100%",
};

function Cone({ position, rotation, color }) {
  return (
    <mesh position={position} rotation={rotation}>
      <coneGeometry args={[0.03, 0.08, 50]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Sphere() {
  return (
    <group>
      {/* Outer Wireframe Sphere */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#2d2dd4" wireframe={true} opacity={0.65} transparent={true} />
      </mesh>
      {/* Subtle translucent core for depth */}
      <mesh>
        <sphereGeometry args={[0.995, 32, 32]} />
        <meshStandardMaterial
          color="#0d1b3e"
          transparent={true}
          opacity={0.25}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

// Arrow representing the Qubit state vector pointing from origin (0, 0, 0)
function QubitArrow({ dir = [0, 0, 1], color = "#ffd700" }) {
  const { quaternion } = useMemo(() => {
    const v = new THREE.Vector3(...dir).normalize();
    // In Three.js, a default cylinder / cone is oriented along the Y axis (0, 1, 0)
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      v
    );
    return { quaternion: q };
  }, [dir]);

  return (
    <group>
      {/* Arrow oriented in direction dir */}
      <group quaternion={quaternion}>
        {/* Origin base sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.04, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Arrow shaft (cylinder) */}
        <mesh position={[0, 0.41, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.82, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>

        {/* Arrow head (cone pointing towards radius 1.0) */}
        <mesh position={[0, 0.91, 0]}>
          <coneGeometry args={[0.048, 0.18, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            metalness={0.6}
            roughness={0.1}
          />
        </mesh>
      </group>

    </group>
  );
}

function Axes() {
  const labelProps = {
    fontSize: 0.07,
    color: "white",
    anchorX: "center",
    anchorY: "middle",
  };

  return (
    <>
      {/* X axis — red */}
      <Line points={[[-1, 0, 0], [1, 0, 0]]} color="red" lineWidth={3} />
      <Billboard position={[1.2, 0, 0]}>
        <Text {...labelProps}>X|+⟩</Text>
      </Billboard>
      <Billboard position={[-1.2, 0, 0]}>
        <Text {...labelProps}>|-⟩</Text>
      </Billboard>

      {/* Y axis — green */}
      <Line points={[[0, -1, 0], [0, 1, 0]]} color="green" lineWidth={3} />
      <Billboard position={[0, 1.2, 0]}>
        <Text {...labelProps}>Y|+i⟩</Text>
      </Billboard>
      <Billboard position={[0, -1.2, 0]}>
        <Text {...labelProps}>|-i⟩</Text>
      </Billboard>

      {/* Z axis — blue/white */}
      <Line points={[[0, 0, -1], [0, 0, 1]]} color="white" lineWidth={3} />
      <Billboard position={[0, 0, 1.25]}>
        <Text {...labelProps}>Z|0⟩</Text>
      </Billboard>
      <Billboard position={[0, 0, -1.25]}>
        <Text {...labelProps}>|1⟩</Text>
      </Billboard>
    </>
  );
}

function BlochSphere({ stateVector = [0, 0, 1] }) {
  return (
    <div style={canvasStyle}>
      <Canvas camera={{ position: [2.5, 2.5, -2.5], fov: 48 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />

        <Sphere />

        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Axes />
          {/* Qubit state vector arrow pointing to current state */}
          <QubitArrow dir={stateVector} />
        </group>

        <OrbitControls enableZoom={true} minDistance={3.2} maxDistance={4.5} />
      </Canvas>
    </div>
  );
}

export default BlochSphere;