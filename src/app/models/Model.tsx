import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";

// Preloads the .glb model file for optimization purposes, so it loads faster when rendered.
useGLTF.preload("/glb/star_cluster_-_15k_stars_model.glb");

export default function Model() {
  const group = useRef<Group>(null);

  const {
    // nodes, materials,
    animations,
    scene,
  } = useGLTF("/glb/star_cluster_-_15k_stars_model.glb");

  const {
    actions,
    // clips
  } = useAnimations(animations, scene);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Plays the "Global Rotation" animation clip but pauses it immediately (it won’t run until unpaused).
    // console.log(actions) //This is interesting to get the actions name, which could be just one or many. In this case it was just one called "Global Rotation"
    if (actions["Global Rotation"]) {
      actions["Global Rotation"].play();
      // actions["Global Rotation"].paused = true;
    }
  }, []);

  return (
    // Renders the 3D model within a <group> element, applying the reference to `group`.
    // The <group> element is a class from the three library that lets you group multiple objects (like models, lights, or other groups) into a single container.
    <group
      ref={group}
      scale={[1, 1, 1]} // Sets the scale of the model in 3D space (1 = default size).
    >
      <primitive object={scene} />{" "}
      {/* Directly adds the model’s scene to the group */}
    </group>
  );
}
