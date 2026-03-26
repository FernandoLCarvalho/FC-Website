"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";

useGLTF.preload("/glb/star_cluster_-_15k_stars_model.glb");

export default function Model() {
  const group = useRef<Group>(null);

  const { animations, scene } = useGLTF(
    "/glb/star_cluster_-_15k_stars_model.glb",
  );

  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions["Global Rotation"]) {
      actions["Global Rotation"].play();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount

  return (
    <group ref={group} scale={[1, 1, 1]}>
      <primitive object={scene} />
    </group>
  );
}
