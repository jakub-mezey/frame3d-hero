/* eslint no-use-before-define: 0 */
'use client'
import React from 'react';
import { Canvas, extend, Object3DNode, MaterialNode } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { ArFrameProps, ArtFrame } from './frame.component';

extend({ MeshLineGeometry, MeshLineMaterial })


declare module '@react-three/fiber' {
    interface ThreeElements {
        meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>
        meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>
    }
}

const ArtFrameCanvas: React.FC<ArFrameProps> = (props) => {
    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 25 }}>
            <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                <ArtFrame {...props} />
            </Physics>
        </Canvas>
    );
};

export default ArtFrameCanvas;

