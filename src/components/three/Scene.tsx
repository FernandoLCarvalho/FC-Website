"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Model from "./Model";
import { Bounds, Html, OrbitControls, useProgress } from "@react-three/drei";

function Loader() {
  const { progress } = useProgress();
  return <Html center> {progress.toFixed(1)}</Html>;
}

export default function Scene() {
  return (
    <Canvas
      gl={{ antialias: true }}
      dpr={[0, 2]}
      resize={{ scroll: true, offsetSize: true }}
      camera={{
        position: [0, 5, 5],
        fov: 100,
      }}
    >
      <Suspense fallback={<Loader />}>
        <Bounds clip={false} observe margin={1}>
          <Model />
        </Bounds>

        <OrbitControls enableZoom={true} maxDistance={1.5} minDistance={0} />
      </Suspense>
    </Canvas>
  );
}
