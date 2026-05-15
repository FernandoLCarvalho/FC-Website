"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";

const STAR_CLUSTER_MODEL_PATH = "/glb/star_cluster_-_15k_stars_model.glb";
const STAR_CLUSTER_ROTATION_ANIMATION = "Global Rotation";

useGLTF.preload(STAR_CLUSTER_MODEL_PATH);

export default function StarClusterModel() {
  const starCluster = useGLTF(STAR_CLUSTER_MODEL_PATH);
  const { actions } = useAnimations(
    starCluster.animations,
    starCluster.scene,
  );

  useEffect(() => {
    actions[STAR_CLUSTER_ROTATION_ANIMATION]?.play();
  }, [actions]);

  return <primitive object={starCluster.scene} />;
}
