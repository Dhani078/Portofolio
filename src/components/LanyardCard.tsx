'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from '@react-three/drei';
import {
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  CuboidCollider,
  BallCollider,
  RapierRigidBody,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

useGLTF.preload('/assets/kartu.glb');
useTexture.preload('/assets/bandd.png');

interface BandProps {
  isMobile?: boolean;
  maxSpeed?: number;
  minSpeed?: number;
}

function Band({ isMobile = false, maxSpeed = 50, minSpeed = 10 }: BandProps) {
  const band = useRef<any>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF('/assets/kartu.glb') as any;
  const texture = useTexture('/assets/bandd.png');
  const { width, height } = useThree((state) => state.size);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  // Rope joints for string physics
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      
      let targetY = vec.y - dragged.y;
      if (state.pointer.y < -0.2) {
        targetY = card.current.translation().y;
      }
      
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: targetY,
        z: vec.z - dragged.z,
      });
    }

    if (
      fixed.current &&
      j1.current &&
      j2.current &&
      j3.current &&
      card.current
    ) {
      [j1, j2].forEach((ref) => {
        if (!(ref.current as any).lerped) {
          (ref.current as any).lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        }
        const cloned = (ref.current as any).lerped;
        const dist = Math.max(
          0.1,
          Math.min(1, cloned.distanceTo(ref.current.translation()))
        );
        cloned.lerp(
          ref.current.translation(),
          delta * (minSpeed + dist * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy((j2.current as any).lerped || j2.current.translation());
      curve.points[2].copy((j1.current as any).lerped || j1.current.translation());
      curve.points[3].copy(fixed.current.translation());

      band.current?.geometry?.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
        true
      );
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  // Adaptive positioning: on mobile hang slightly center-right, on desktop hang top-right [3, 4, 0]
  const anchorPos: [number, number, number] = isMobile ? [1.2, 4.2, 0] : [3, 4, 0];
  const cardScale = isMobile ? 1.7 : 2.25;

  return (
    <>
      <group position={anchorPos}>
        {/* Fixed Anchor */}
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        {/* Chain Joints */}
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Dynamic Card */}
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={cardScale}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={(e) => {
              (e.target as HTMLElement)?.releasePointerCapture(e.pointerId);
              setDragged(false);
            }}
            onPointerDown={(e) => {
              (e.target as HTMLElement)?.setPointerCapture(e.pointerId);
              setDragged(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                {...materials.base}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh
              geometry={nodes.clamp.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
          </group>
        </RigidBody>
      </group>

      {/* Dynamic Lanyard Ribbon MeshLine */}
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          transparent
          opacity={1.0}
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap={true}
          map={texture}
          repeat={[-4, 1]}
          lineWidth={isMobile ? 0.75 : 1.0}
        />
      </mesh>
    </>
  );
}

export default function LanyardCard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="responsive-wrapper"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 20,
        overflow: 'visible',
      }}
    >
      <React.Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, isMobile ? 15 : 13], fov: 25 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          style={{
            background: 'transparent',
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
          }}
        >
          <ambientLight intensity={Math.PI} />
          <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
            <Band isMobile={isMobile} />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Canvas>
      </React.Suspense>
    </div>
  );
}
