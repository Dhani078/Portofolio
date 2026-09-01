'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
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
  RapierRigidBody,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

// Create procedural lanyard tape texture
function useLanyardTexture() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const text = 'MRR.DEV  ///  FULL-STACK ENGINEER  ///  BANJARMASIN, ID  ///  ';
      const textWidth = ctx.measureText(text).width;
      const repeats = Math.ceil(canvas.width / textWidth) + 1;

      for (let i = 0; i < repeats; i++) {
        ctx.fillText(text, i * textWidth + textWidth / 2, canvas.height / 2);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 1);
      setTexture(tex);
    }
  }, []);

  return texture;
}

// Procedural Card Back Texture
function useCardBackTexture() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border outline
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 12;
      ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

      // Technical Grid Lines
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2;
      for (let y = 60; y < canvas.height - 60; y += 40) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(canvas.width - 30, y);
        ctx.stroke();
      }

      // Large Monogram
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 110px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MRR', canvas.width / 2, canvas.height / 2 - 40);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '600 20px "JetBrains Mono", monospace';
      ctx.fillText('FULL-STACK ENGINEER', canvas.width / 2, canvas.height / 2 + 50);

      ctx.font = '500 16px "JetBrains Mono", monospace';
      ctx.fillStyle = '#71717a';
      ctx.fillText('NEXT.JS 16 • REACT 19 • SUPABASE', canvas.width / 2, canvas.height / 2 + 85);
      ctx.fillText('UNISKA BANJARMASIN', canvas.width / 2, canvas.height / 2 + 115);

      // Barcode lines at bottom
      ctx.fillStyle = '#ffffff';
      for (let x = 60; x < canvas.width - 60; x += 8) {
        if (Math.random() > 0.3) {
          ctx.fillRect(x, canvas.height - 110, 4, 40);
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      setTexture(tex);
    }
  }, []);

  return texture;
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
}

function Band({ maxSpeed = 50, minSpeed = 10 }: BandProps) {
  const tapeTexture = useLanyardTexture();
  const cardBackTexture = useCardBackTexture();
  const photoTexture = useTexture('/mrr.jpg');

  // Rigid body references
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const lineRef = useRef<any>(null!);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]));

  // Physics joints setup
  useSphericalJoint(fixed, j1, [[0, 0, 0], [0, 1, 0]]);
  useSphericalJoint(j1, j2, [[0, 0, 0], [0, 1, 0]]);
  useSphericalJoint(j2, j3, [[0, 0, 0], [0, 1, 0]]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  // Drag interaction state
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current && lineRef.current) {
      // Fix CatmullRom Curve from Physics Bodies
      const p0 = fixed.current.translation();
      const p1 = j1.current.translation();
      const p2 = j2.current.translation();
      const p3 = j3.current.translation();
      const p4 = card.current.translation();

      curve.points[0].set(p0.x, p0.y, p0.z);
      curve.points[1].set(p1.x, p1.y, p1.z);
      curve.points[2].set(p2.x, p2.y, p2.z);
      curve.points[3].set(p3.x, p3.y + 0.3, p3.z);

      lineRef.current.geometry.setPoints(curve.getPoints(32));

      // Tilt / rotation dampening when flying
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  return (
    <>
      {/* Top Anchor Fixed Body */}
      <RigidBody ref={fixed} type="fixed" position={[0, 4.2, 0]} />

      {/* Chain link physics bodies */}
      <RigidBody position={[0.2, 3.2, 0]} ref={j1} linearDamping={2} angularDamping={2}>
        <mesh visible={false}><sphereGeometry args={[0.05]} /></mesh>
      </RigidBody>
      <RigidBody position={[0.4, 2.2, 0]} ref={j2} linearDamping={2} angularDamping={2}>
        <mesh visible={false}><sphereGeometry args={[0.05]} /></mesh>
      </RigidBody>
      <RigidBody position={[0.2, 1.2, 0]} ref={j3} linearDamping={2} angularDamping={2}>
        <mesh visible={false}><sphereGeometry args={[0.05]} /></mesh>
      </RigidBody>

      {/* The Dynamic Card */}
      <RigidBody
        position={[0, 0, 0]}
        ref={card}
        type={dragged ? 'kinematicPosition' : 'dynamic'}
        linearDamping={1.5}
        angularDamping={1.5}
      >
        <group
          scale={1.8}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={(e) => {
            e.stopPropagation();
            (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
            setDragged(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
            setDragged(false);
          }}
        >
          {/* Clip / Clasp at top */}
          <mesh position={[0, 1.48, 0]}>
            <boxGeometry args={[0.25, 0.12, 0.08]} />
            <meshStandardMaterial color="#27272a" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.12]} />
            <meshStandardMaterial color="#52525b" roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Card Holder Outer Frame (Brutalist White/Zinc Border) */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.54, 2.14, 0.04]} />
            <meshStandardMaterial
              color="#09090b"
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>

          {/* Card Border Line */}
          <mesh position={[0, 0.5, 0.021]}>
            <planeGeometry args={[1.44, 2.04]} />
            <meshBasicMaterial color="#ffffff" wireframe />
          </mesh>

          {/* Front Face: Portrait Photo */}
          <mesh position={[0, 0.5, 0.023]}>
            <planeGeometry args={[1.4, 2.0]} />
            <meshStandardMaterial
              map={photoTexture}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>

          {/* Back Face: Engineer Credentials */}
          <mesh position={[0, 0.5, -0.023]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.4, 2.0]} />
            <meshStandardMaterial
              map={cardBackTexture || undefined}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        </group>
      </RigidBody>

      {/* The Flexible Tape MeshLine */}
      <mesh ref={lineRef}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="#ffffff"
          depthTest={false}
          resolution={new THREE.Vector2(1920, 1080)}
          useMap={tapeTexture ? 1 : 0}
          map={tapeTexture || undefined}
          repeat={new THREE.Vector2(1, 1)}
          lineWidth={0.15}
        />
      </mesh>
    </>
  );
}

export default function LanyardCard() {
  return (
    <div className="w-full h-[520px] lg:h-[620px] relative select-none cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 13], fov: 25 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={1.0} color="#71717a" />
        <pointLight position={[0, -2, 4]} intensity={1.5} color="#ffffff" />

        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} interpolate>
          <Band />
        </Physics>
      </Canvas>
    </div>
  );
}
