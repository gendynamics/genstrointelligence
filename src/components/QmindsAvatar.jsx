import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
 * QMINDS — 3D avatar for the floating assistant widget.
 * Loaded lazily by Qminds.jsx so three.js stays out of the main bundle.
 *
 * The model has three clips (Running, Walking, _360_Power_Spin_Jump) and no idle,
 * so the resting stance is a held frame of Walking. The spin jump plays whenever
 * `spinKey` changes, then blends back to the stance.
 */

export const QMINDS_MODEL_URL = '/models/qminds.glb';
const SPIN_CLIP = '_360_Power_Spin_Jump';
const STANCE_CLIP = 'Walking';
const STANCE_TIME = 0; // first frame of Walking: upright, arms relaxed
const FACING = -0.35; // radians; turned slightly toward the briefing panel

// The spin jump carries the robot ~1.8 units forward; keep it on its spot.
function pinRootMotion(clip) {
  clip.tracks.forEach(track => {
    if (!/Hips\.position$/.test(track.name)) return;
    const v = track.values;
    for (let i = 0; i < v.length; i += 3) {
      v[i] = v[0];
      v[i + 2] = v[2];
    }
  });
}

function RoomLighting() {
  const { gl, scene } = useThree();
  useEffect(() => {
    // Procedural environment map: metallic surfaces need reflections, and this needs no network fetch.
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(gl), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Robot({ spinKey, reducedMotion }) {
  const group = useRef();
  const { scene, animations } = useGLTF(QMINDS_MODEL_URL, false, false);
  useMemo(() => animations.filter(c => c.name === SPIN_CLIP).forEach(pinRootMotion), [animations]);
  const { actions, mixer } = useAnimations(animations, group);

  // Hold the resting stance.
  useEffect(() => {
    const stance = actions[STANCE_CLIP];
    if (!stance) return undefined;
    stance.timeScale = 0;
    stance.reset().play();
    stance.time = STANCE_TIME;
    return () => stance.stop();
  }, [actions]);

  // Spin jump, then blend back into the stance.
  useEffect(() => {
    const spin = actions[SPIN_CLIP];
    const stance = actions[STANCE_CLIP];
    if (reducedMotion || !spin || !stance) return undefined;

    spin.reset();
    spin.setLoop(THREE.LoopOnce, 1);
    spin.clampWhenFinished = true;
    spin.play();
    spin.crossFadeFrom(stance, 0.2, false);

    const onFinished = event => {
      if (event.action !== spin) return;
      stance.reset().play();
      stance.time = STANCE_TIME;
      spin.crossFadeTo(stance, 0.4, false);
    };
    mixer.addEventListener('finished', onFinished);
    return () => mixer.removeEventListener('finished', onFinished);
  }, [spinKey, reducedMotion, actions, mixer]);

  // Gentle hover and sway while resting.
  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;
    const t = clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 1.4) * 0.03;
    group.current.rotation.y = FACING + Math.sin(t * 0.5) * 0.12;
  });

  return (
    <group ref={group} rotation={[0, FACING, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function BaseRing() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
      <mesh>
        <circleGeometry args={[0.42, 48]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.4, 0.43, 64]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.7} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function QmindsAvatar({ width, height, spinKey, reducedMotion }) {
  return (
    <Canvas
      style={{ width, height, pointerEvents: 'none' }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      camera={{ fov: 28, position: [0, 1.05, 5], near: 0.1, far: 50 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.95, 0)}
    >
      <RoomLighting />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 4, 3]} intensity={1.6} />
      <pointLight position={[-1.5, 1.6, -1.5]} color="#67e8f9" intensity={6} distance={6} />
      <BaseRing />
      <Suspense fallback={null}>
        <Robot spinKey={spinKey} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
