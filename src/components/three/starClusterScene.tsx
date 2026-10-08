"use client";

import { Bounds, Html, OrbitControls, useProgress } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import StarClusterModel from "./starClusterModel";

const STAR_CLUSTER_CAMERA = {
  position: [0, 5, 5] as [number, number, number],
  fov: 100,
};

// Retain the original permissive DPR/zoom bounds for visual and interaction parity.
const STAR_CLUSTER_DPR: [number, number] = [0, 2];
const STAR_CLUSTER_BOUNDS_MARGIN = 1;

const STAR_CLUSTER_ORBIT_CONTROLS = {
  enableZoom: true,
  maxDistance: 1.5,
  minDistance: 0,
};

function SceneLoadingProgress() {
  const { progress } = useProgress();
  const gl = useThree((state) => state.gl);
  // Keep Html's DOM root stable when Fiber connects its event target during loading.
  // Recreating that root races React 19's asynchronous unmount of the previous root.
  const portal = useMemo(
    () => ({ current: gl.domElement.parentElement! }),
    [gl],
  );
  return (
    <Html center portal={portal}>
      {progress.toFixed(1)}%
    </Html>
  );
}

export default function StarClusterScene() {
  return (
    <Canvas
      // Honor the hero's landscape pointer-events rule instead of Fiber's inline auto.
      style={{ pointerEvents: "inherit" }}
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
