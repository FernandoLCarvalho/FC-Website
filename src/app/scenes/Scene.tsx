"use client"

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react';
import Model from '../models/Model';
import { Bounds, Html, OrbitControls, useProgress } from '@react-three/drei';

function Loader() {
    // Hook to get the loading progress
    const { progress } = useProgress();
    // Displays the loading progress as a percentage
    return <Html center> {progress.toFixed(1)}</Html>
}

export default function Scene() {
    return (
        <Canvas 
            gl={{ antialias: true }} // Enables antialiasing for smoother edges
            dpr={[0, 2]} // Sets device pixel ratio for improved resolution on high-DPI screens
            resize={{ scroll: true, offsetSize: true }} // Makes the canvas responsive to page scrolls and container resizing
            camera={{
                position: [0, 5, 5], // Sets the initial camera position in 3D space [X, Y, Z]
                fov: 100 // Defines the field of view (how wide the camera sees)
            }}
        >

            {/* Lighting setup, currently commented out as I may not need it at the end */}
            {/* <ambientLight position={[20, 20, 20]} intensity={5000} />
            <directionalLight position={[0, 10, -5]} intensity={200} /> */}
            
            <Suspense fallback={<Loader />}>
                {/* Wraps the model to handle loading states, with a fallback display */}
                
                <Bounds 
                    clip={false} // Prevents clipping, allowing objects to be rendered beyond the visible frame
                    observe // Enables automatic resizing of the scene based on its contents
                    margin={1} // Adds a margin to the bounds to avoid clipping the model tightly
                >
                    <Model /> {/* The 3D model you want to display */}
                </Bounds>
                
                {/* Allows camera controls for user interaction, like rotation and zoom */}
                <OrbitControls 
                    enableZoom={true} // Allows zooming in and out
                    maxDistance={1.5} // Sets the maximum distance the camera can zoom out
                    minDistance={0} // Sets the minimum distance the camera can zoom in
                />
                
            </Suspense>

        </Canvas>
    )
}
