'use client'
import React from 'react';
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame, Object3DNode, MaterialNode } from '@react-three/fiber'
import { CuboidCollider, Physics, RapierRigidBody, RigidBody, useRopeJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { ThreeEvent } from '@react-three/fiber';

export interface ArFrameProps {
    maxWidth: number;
    widthMargin: number;
    heightMargin: number
}

export const ArtFrame: React.FC<ArFrameProps> = ({
    maxWidth,
    widthMargin,
    heightMargin
}) => {

    const isDarkMode = true;

    const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
    const band_2 = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
    const fixed_point_left = useRef<RapierRigidBody>(null); // Refers to the underlying RapierRigidBody instance
    const frame = useRef<RapierRigidBody>(null);
    const fixed_point_right = useRef<RapierRigidBody>(null); // Refers to the underlying RapierRigidBody instance

    const points: THREE.Vector3[] = [];
    const points_2: THREE.Vector3[] = [];
    const points_3: THREE.Vector3[] = [];
    const points_4: THREE.Vector3[] = [];


    const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore
    const bandEndRight = new THREE.Vector3();
    const bandEndLeft = new THREE.Vector3();
    const { width, height } = useThree((state) => state.size)
    const [dragged, drag] = useState<THREE.Vector3 | Boolean>(false);
    const [linearDamping] = useState(2);
    const { viewport } = useThree();

    const [fixed_point_position_left] = useState(new THREE.Vector3(-4, 6, 0.0));
    const [fixed_point_position_right] = useState(new THREE.Vector3(4, 6, 0.0));

    const [leftLine] = useState(new THREE.LineCurve3())
    const [rightLine] = useState(new THREE.LineCurve3())

    let vpwidth = viewport.width;
    let vpheight = viewport.height;


    if (vpwidth > maxWidth) {
        vpwidth = maxWidth;
    }

    console.log(vpwidth, vpheight);

    const frameDepth: number = 0.2;
    const frameWidth = 0.4;
    const frameHeight = 0.4;

    const totalWidth = vpwidth - widthMargin - (frameWidth);
    const totalheight = vpheight - heightMargin - (frameHeight);


    const innerWidth = totalWidth - frameWidth;
    const innerHeight = totalheight - frameHeight;

    const frameJoint_left = useRopeJoint(fixed_point_left, frame, [[0, 0, 0], [0, 0, 0], 4.13]) // prettier-ignore
    const frameJoint_right = useRopeJoint(fixed_point_right, frame, [[0, 0, 0], [0, 0, 0], 4.13]) // prettier-ignore

    useFrame((state, delta) => {
        if (dragged) {
            let dragged1 = dragged as THREE.Vector3;
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
            dir.copy(vec).sub(state.camera.position).normalize()
            vec.add(dir.multiplyScalar(state.camera.position.length()))
                ;[frame, fixed_point_left].forEach((ref) => ref.current?.wakeUp())
            frame.current?.setNextKinematicTranslation({ x: vec.x - dragged1.x, y: vec.y - dragged1.y, z: vec.z - dragged1.z })
        }
        if (fixed_point_left.current && frameJoint_left.current && frameJoint_right.current && fixed_point_right.current) {

            bandEndLeft.copy(frameJoint_left.current.anchor2() as any);
            bandEndLeft.add(frameJoint_left.current.body2().translation() as any);
            leftLine.v1.copy(fixed_point_left.current.translation() as any);
            leftLine.v2.copy(bandEndLeft);
            band.current!.geometry.setPoints(leftLine.getPoints(12));

            bandEndRight.copy(frameJoint_right.current.anchor2() as any);
            bandEndRight.add(frameJoint_right.current.body2().translation() as any);
            rightLine.v1.copy(fixed_point_right.current.translation() as any);
            rightLine.v2.copy(bandEndRight);
            band_2.current!.geometry.setPoints(rightLine.getPoints(16));


            // Tilt it back towards the screen
            ang.copy(frame.current!.angvel() as any)
            rot.copy(frame.current!.rotation() as any)
            frame.current!.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.1, z: ang.z }, true)

            if (frameJoint_left.current && frameJoint_right.current) {
                frameJoint_left.current.setAnchor2({ x: -(totalWidth / 2 - 1), y: (totalheight / 2), z: 0 })
                frameJoint_right.current.setAnchor2({ x: (totalWidth / 2 - 1), y: (totalheight / 2), z: 0 })

                let frameAnchorLeft = frameJoint_left.current.anchor2() as THREE.Vector3;
                fixed_point_position_left.x = frameAnchorLeft.x;
                fixed_point_left.current.setTranslation(fixed_point_position_left, false);

                let frameAnchorRight = frameJoint_right.current.anchor2() as THREE.Vector3;
                fixed_point_position_right.x = frameAnchorRight.x;
                fixed_point_right.current.setTranslation(fixed_point_position_right, false);
            }
        }
    })


    points.push(new THREE.Vector3(-innerWidth / 2, -innerHeight / 2, 0));
    points.push(new THREE.Vector3(-totalWidth / 2, -totalheight / 2, frameDepth))
    points.push(new THREE.Vector3(totalWidth / 2, -totalheight / 2, frameDepth))
    points.push(new THREE.Vector3(innerWidth / 2, -innerHeight / 2, 0));
    points.push(new THREE.Vector3(-innerWidth / 2, -innerHeight / 2, 0));
    points.push(new THREE.Vector3(-innerWidth / 2, innerHeight / 2, 0));
    points.push(new THREE.Vector3(-totalWidth / 2, totalheight / 2, frameDepth))
    points.push(new THREE.Vector3(-totalWidth / 2, -totalheight / 2, frameDepth))

    points_2.push(new THREE.Vector3(-totalWidth / 2, totalheight / 2, frameDepth))
    points_2.push(new THREE.Vector3(totalWidth / 2, totalheight / 2, frameDepth))
    points_2.push(new THREE.Vector3(innerWidth / 2, innerHeight / 2, 0));
    points_2.push(new THREE.Vector3(-innerWidth / 2, innerHeight / 2, 0));

    points_3.push(new THREE.Vector3(totalWidth / 2, totalheight / 2, frameDepth))
    points_3.push(new THREE.Vector3(totalWidth / 2, -totalheight / 2, frameDepth));

    points_4.push(new THREE.Vector3(innerWidth / 2, innerHeight / 2, 0))
    points_4.push(new THREE.Vector3(innerWidth / 2, -innerHeight / 2, 0));


    const spline = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.0001);
    const samples = spline.getPoints(points.length * 10);
    const geometrySpline = new THREE.BufferGeometry().setFromPoints(samples);

    const spline2 = new THREE.CatmullRomCurve3(points_2, false, 'catmullrom', 0.0001);
    const samples2 = spline2.getPoints(points_2.length * 10);
    const geometrySpline2 = new THREE.BufferGeometry().setFromPoints(samples2);

    const spline3 = new THREE.CatmullRomCurve3(points_3, false, 'catmullrom', 0.0001);
    const samples3 = spline3.getPoints(points_3.length * 10);
    const geometrySpline3 = new THREE.BufferGeometry().setFromPoints(samples3);

    const spline4 = new THREE.CatmullRomCurve3(points_4, false, 'catmullrom', 0.0001);
    const samples4 = spline4.getPoints(points_4.length * 10);
    const geometrySpline4 = new THREE.BufferGeometry().setFromPoints(samples4);


    let lineDashedMaterial1 = new THREE.LineDashedMaterial();
    lineDashedMaterial1.color = new THREE.Color(isDarkMode ? 'white' : 'black');
    lineDashedMaterial1.opacity = .4;
    lineDashedMaterial1.dashSize = 0.08;
    lineDashedMaterial1.gapSize = 0.04;

    const line = new THREE.Line(geometrySpline, lineDashedMaterial1);
    const line2 = new THREE.Line(geometrySpline2, lineDashedMaterial1);
    const line3 = new THREE.Line(geometrySpline3, lineDashedMaterial1);
    const line4 = new THREE.Line(geometrySpline4, lineDashedMaterial1);
    line.computeLineDistances();
    line2.computeLineDistances();
    line3.computeLineDistances();
    line4.computeLineDistances();

    // Define your event handler function with the specific event type
    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        const target = e.target as HTMLElement; // Type assertion
        target.setPointerCapture(e.pointerId);
        drag(new THREE.Vector3().copy(e.point).sub(vec.copy(frame.current!.translation() as any)));
    };

    // Define the onPointerUp event handler
    const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
        const target = e.target as HTMLElement; // Type assertion
        target.releasePointerCapture(e.pointerId);
        drag(false);
    };

    return (
        <>
            <RigidBody position={fixed_point_position_right} ref={fixed_point_right} angularDamping={2} linearDamping={linearDamping} type="fixed" >
            </RigidBody>
            <RigidBody position={fixed_point_position_left} ref={fixed_point_left} angularDamping={2} linearDamping={linearDamping} type="fixed" >
            </RigidBody>

            <mesh ref={band_2}>
                <meshLineGeometry />
                <meshLineMaterial transparent opacity={0.3} color="grey" depthTest={true} resolution={new THREE.Vector2(width, height)} lineWidth={0.05} />
            </mesh>
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial transparent opacity={0.3} color="grey" depthTest={true} resolution={new THREE.Vector2(width, height)} lineWidth={0.05} />
            </mesh>

            <RigidBody key={'Frame'} position={[0, 4, -4]} type={dragged ? 'kinematicPosition' : 'dynamic'} angularDamping={15} linearDamping={2} ref={frame} >
                <primitive object={line} />
                <primitive object={line2} />
                <primitive object={line3} />
                <primitive object={line4} >
                </primitive>
                <CuboidCollider key={'1'} args={[totalWidth / 2, totalheight / 2, frameDepth]} >

                </CuboidCollider>

                <mesh position={[0, 0, 0]} onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}>
                    <planeGeometry args={[innerWidth - 0.1, innerHeight - 0.1, 5, 5]} />
                    <meshBasicMaterial opacity={0.15} transparent color="grey" side={THREE.DoubleSide} />
                </mesh>
            </RigidBody>
        </>
    )
}