import React from "react";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls, Text, Billboard } from "@react-three/drei";

const canvasStyle = {
  width: "700px",
  height: "700px",
};

function Cone( { position, rotation, color} ) {
  return (
    <mesh position={position} rotation={rotation}>
      <coneGeometry args={[0.03, 0.08, 50]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Sphere () {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#2d2dd4" wireframe={true} />
    </mesh>
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
      {/*<Cone position={[1.2, 0, 0]}  rotation={[0, 0, -Math.PI / 2]} color="red" />
      <Cone position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}  color="red" />*/}

      <Billboard position={[1.2, 0, 0]}>
        <Text {...labelProps}>X|+⟩</Text>
      </Billboard>
      <Billboard position={[-1.2, 0, 0]}>
        <Text {...labelProps}>|-⟩</Text>
      </Billboard>

      {/* Y axis — green */}
      <Line points={[[0, -1, 0], [0, 1, 0]]} color="green" lineWidth={3} />
      {/*<Cone position={[0, 1.2, 0]}  rotation={[0, 0, 0]}         color="green" />
      <Cone position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}   color="green" />*/}

      <Billboard position={[0, 1.2, 0]}>
        <Text {...labelProps}>Y|+i⟩</Text>
      </Billboard>
      <Billboard position={[0, -1.2, 0]}>
        <Text {...labelProps}>|-i⟩</Text>
      </Billboard>

      {/* Z axis — blue */}
      <Line points={[[0, 0, -1], [0, 0, 1]]} color="white" lineWidth={3} />
      {/*<Cone position={[0, 0, 1.2]}  rotation={[Math.PI / 2, 0, 0]}  color="white" />
      <Cone position={[0, 0, -1.2]} rotation={[-Math.PI / 2, 0, 0]} color="white" />*/}

      <Billboard position={[0, 0, 1.2]}>
        <Text {...labelProps}>Z|0⟩</Text>
      </Billboard>
      <Billboard position={[0, 0, -1.2]}>
        <Text {...labelProps}>|1⟩</Text>
      </Billboard>

    </>
  );
}

function BlochSphere() {
  return (
    <div style={canvasStyle}>
      <Canvas camera={{ position: [2, 2, 2], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        <Sphere />

        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Axes />
        </group>


        <OrbitControls enableZoom={true} minDistance={2.5} maxDistance={3} />
      </Canvas>
    </div>
  );
}

export default BlochSphere;