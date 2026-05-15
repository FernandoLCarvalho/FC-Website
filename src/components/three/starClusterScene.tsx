"use client";

import { Bounds, Html, OrbitControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import StarClusterModel from "./starClusterModel";

const STAR_CLUSTER_CAMERA = {
  position: [0, 5, 5] as [number, number, number],
  fov: 100,
};

const STAR_CLUSTER_DPR: [number, number] = [0, 2];
const STAR_CLUSTER_BOUNDS_MARGIN = 1;

const STAR_CLUSTER_ORBIT_CONTROLS = {
  enableZoom: true,
  maxDistance: 1.5,
  minDistance: 0,
};

function SceneLoadingProgress() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(1)}%</Html>;
}

export default function StarClusterScene() {
  return (
    <Canvas
      gl={{ antialias: true }}
      dpr={STAR_CLUSTER_DPR}
      resize={{ scroll: true, offsetSize: true }}
      camera={STAR_CLUSTER_CAMERA}
    >
      <Suspense fallback={<SceneLoadingProgress />}>
        <Bounds clip={false} observe margin={STAR_CLUSTER_BOUNDS_MARGIN}>
          <StarClusterModel />
        </Bounds>

        <OrbitControls {...STAR_CLUSTER_ORBIT_CONTROLS} />
      </Suspense>
    </Canvas>
  );
}
