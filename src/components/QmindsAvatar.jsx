import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
 * QMINDS — 3D avatar and motion skills for the floating assistant widget.
 * Loaded lazily by Qminds.jsx so three.js stays out of the main bundle.
 *
 * The model ships three clips (Running, Walking, _360_Power_Spin_Jump). Everything
 * else is procedural: gestures aim the arm/head bones toward model-space directions
 * after the mixer has posed the skeleton each frame.
 *
 * Props
 *   move      { name, id }  — bump id to perform MOVES[name]
 *   walking   bool          — walk cycle facing screen-left (used for the walk-in)
 *   talking   bool          — speaking gestures
 *   thinking  bool          — thinking pose while an answer is on its way
 *   pointer   ref {x, y}    — cursor offset from the avatar in [-1, 1]; the head follows it
 *   onReady   fn            — called once the model is on screen
 */

export const QMINDS_MODEL_URL = '/models/qminds.glb';
const SPIN = '_360_Power_Spin_Jump';
const WALK = 'Walking';
const RUN = 'Running';
const STANCE = 'Stance'; // first frame of Walking, held: upright, arms relaxed
const FACING = -0.35; // radians; turned slightly toward the briefing panel
const WALK_FACING = -Math.PI / 2; // facing screen-left

// Clip steps are [clip, seconds | 'once']; poses are procedural gestures.
export const MOVES = {
  wave: { pose: 'wave', seconds: 2.4 },
  point: { pose: 'point', seconds: 2.4 },
  guard: { pose: 'guard', seconds: 2.6 },
  scan: { pose: 'scan', seconds: 3 },
  nod: { pose: 'nod', seconds: 1.4 },
  levitate: { pose: 'levitate', seconds: 3.4 },
  spin: { clips: [[SPIN, 'once']] },
  run: { clips: [[RUN, 1.8]] },
  strike: { clips: [[RUN, 1.1], [SPIN, 'once']] },
};

const UP = new THREE.Vector3(0, 1, 0);
const SIDE = new THREE.Vector3(1, 0, 0);
const FORWARD = new THREE.Vector3(0, 0, 1);
const _p = new THREE.Vector3();
const _c = new THREE.Vector3();
const _d = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _qa = new THREE.Quaternion();
const _qb = new THREE.Quaternion();
const _qc = new THREE.Quaternion();
const _qm = new THREE.Quaternion();

const dir = (x, y, z) => _dir.set(x, y, z);
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const approach = (value, target, rate, dt) => value + (target - value) * (1 - Math.exp(-rate * dt));

// Rotate `bone` so the bone→child segment points along `dirModel`, blended by w.
function aim(bone, child, dirModel, modelQuat, w) {
  if (w < 0.001) return;
  bone.getWorldPosition(_p);
  child.getWorldPosition(_c);
  _c.sub(_p).normalize();
  _d.copy(dirModel).normalize().applyQuaternion(modelQuat);
  _qa.setFromUnitVectors(_c, _d);
  bone.getWorldQuaternion(_qb).premultiply(_qa);
  bone.parent.getWorldQuaternion(_qc).invert();
  bone.quaternion.slerp(_qb.premultiply(_qc), w);
  bone.updateMatrixWorld(true);
}

// Rotate `bone` about a model-space axis.
function turn(bone, axisModel, angle, modelQuat) {
  if (Math.abs(angle) < 1e-4) return;
  _d.copy(axisModel).applyQuaternion(modelQuat);
  _qa.setFromAxisAngle(_d, angle);
  bone.getWorldQuaternion(_qb).premultiply(_qa);
  bone.parent.getWorldQuaternion(_qc).invert();
  bone.quaternion.copy(_qb.premultiply(_qc));
  bone.updateMatrixWorld(true);
}

// Gestures. `s` is +1/-1: the model-space x direction of the robot's right side.
const POSES = {
  wave(b, t, w, s, q) {
    aim(b.rArm, b.rFore, dir(s * 0.6, 0.78, 0.18), q, w);
    aim(b.rFore, b.rHand, dir(s * (0.12 + 0.32 * Math.sin(t * 9)), 1, 0.12), q, w);
    turn(b.head, UP, s * 0.18 * w, q);
  },
  point(b, t, w, s, q) {
    aim(b.rArm, b.rFore, dir(s, 0.2, 0.5), q, w);
    aim(b.rFore, b.rHand, dir(s, 0.25, 0.5), q, w);
    turn(b.head, UP, s * 0.45 * w, q);
  },
  guard(b, t, w, s, q) {
    [[b.rArm, b.rFore, b.rHand, s], [b.lArm, b.lFore, b.lHand, -s]].forEach(([arm, fore, hand, side]) => {
      aim(arm, fore, dir(side * 0.4, -0.6, 0.7), q, w);
      aim(fore, hand, dir(-side * 0.85, 0.35, 0.4), q, w);
    });
    turn(b.spine, SIDE, 0.08 * w, q);
  },
  levitate(b, t, w, s, q) {
    [[b.rArm, b.rFore, b.rHand, s], [b.lArm, b.lFore, b.lHand, -s]].forEach(([arm, fore, hand, side]) => {
      aim(arm, fore, dir(side * 0.9, -0.3, 0.15), q, w);
      aim(fore, hand, dir(side * 0.9, -0.15, 0.2), q, w);
    });
    turn(b.head, SIDE, -0.25 * w, q);
  },
  scan(b, t, w, s, q) {
    turn(b.spine, UP, Math.sin(t * 2.1) * 0.25 * w, q);
    turn(b.head, UP, Math.sin(t * 2.1) * 0.7 * w, q);
    aim(b.rArm, b.rFore, dir(s * 0.35, 0.35, 0.85), q, w);
    aim(b.rFore, b.rHand, dir(-s * 0.75, 0.6, 0.25), q, w);
  },
  nod(b, t, w, s, q) {
    turn(b.head, SIDE, Math.abs(Math.sin(t * 9)) * 0.3 * w, q);
  },
  talk(b, t, w, s, q) {
    turn(b.head, SIDE, Math.sin(t * 7) * 0.06 * w, q);
    aim(b.rArm, b.rFore, dir(s * 0.3, -0.8, 0.45), q, w);
    aim(b.rFore, b.rHand, dir(s * 0.25, 0.25 + Math.sin(t * 5.5) * 0.25, 0.95), q, w);
  },
  think(b, t, w, s, q) {
    turn(b.head, FORWARD, -s * 0.16 * w, q);
    turn(b.head, SIDE, -0.14 * w, q);
    aim(b.rArm, b.rFore, dir(s * 0.2, -0.55, 0.8), q, w);
    aim(b.rFore, b.rHand, dir(-s * 0.45, 0.85, 0.25), q, w);
  },
};

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

function findBones(scene) {
  const get = name => scene.getObjectByName(`mixamorig${name}`);
  const bones = {
    hips: get('Hips'), spine: get('Spine2'), head: get('Head'),
    rArm: get('RightArm'), rFore: get('RightForeArm'), rHand: get('RightHand'),
    lArm: get('LeftArm'), lFore: get('LeftForeArm'), lHand: get('LeftHand'),
  };
  return Object.values(bones).every(Boolean) ? bones : null;
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

function Robot({ move, walking, talking, thinking, pointer, reducedMotion, onReady, ringRef }) {
  const group = useRef();
  const getState = useThree(state => state.get);
  const { scene, animations } = useGLTF(QMINDS_MODEL_URL, false, false);

  const clips = useMemo(() => {
    animations.filter(c => c.name === SPIN).forEach(pinRootMotion);
    const walk = animations.find(c => c.name === WALK);
    const stance = walk.clone();
    stance.name = STANCE;
    return [...animations, stance];
  }, [animations]);
  const { actions, mixer } = useAnimations(clips, group);
  const bones = useMemo(() => findBones(scene), [scene]);

  const ctl = useRef({ current: null, queue: [], waitFor: null, timer: 0, busy: false });
  const live = useRef({ walking, talking, thinking, reducedMotion });
  live.current = { walking, talking, thinking, reducedMotion };
  const anim = useRef({ yaw: FACING, talkW: 0, thinkW: 0, freeW: 1, walkW: 0, lookX: 0, lookY: 0, side: 0, pose: null });

  // Clip controller: crossfade between stance, walk, run and spin.
  useEffect(() => {
    const c = ctl.current;
    const stance = actions[STANCE];
    if (!stance) return undefined;
    stance.timeScale = 0;

    const fadeTo = (action, seconds = 0.25) => {
      if (c.current === action) {
        action.reset().play();
        return;
      }
      action.reset().setEffectiveWeight(1).play();
      if (c.current) action.crossFadeFrom(c.current, seconds, false);
      c.current = action;
    };
    const settle = () => fadeTo(live.current.walking ? actions[WALK] : stance, 0.3);
    const next = () => {
      clearTimeout(c.timer);
      const step = c.queue.shift();
      if (!step) {
        c.busy = false;
        c.waitFor = null;
        settle();
        return;
      }
      const [name, mode] = step;
      const action = actions[name];
      if (mode === 'once') {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        c.waitFor = action;
        fadeTo(action, 0.2);
      } else {
        action.setLoop(THREE.LoopRepeat, Infinity);
        c.waitFor = null;
        fadeTo(action, 0.2);
        c.timer = setTimeout(next, mode * 1000);
      }
    };
    c.run = steps => {
      c.queue = steps.slice();
      c.busy = true;
      next();
    };
    c.settle = () => {
      if (!c.busy) settle();
    };
    c.cancel = () => {
      clearTimeout(c.timer);
      c.queue = [];
      c.waitFor = null;
      if (c.busy) {
        c.busy = false;
        settle();
      }
    };

    const onFinished = event => {
      if (event.action === c.waitFor) next();
    };
    mixer.addEventListener('finished', onFinished);
    fadeTo(stance, 0);
    return () => {
      clearTimeout(c.timer);
      mixer.removeEventListener('finished', onFinished);
      mixer.stopAllAction();
      c.current = null;
      c.busy = false;
    };
  }, [actions, mixer]);

  // Perform a move when its id changes (not on mount, so a remount doesn't replay the last one).
  const handledMove = useRef(move && move.id);
  useEffect(() => {
    if (!move || move.id === handledMove.current) return;
    handledMove.current = move.id;
    const def = MOVES[move.name];
    if (!def || live.current.reducedMotion) return;
    // A new move replaces whatever is playing, so quick clicks always show the latest one.
    if (def.clips) {
      anim.current.pose = null;
      ctl.current.run(def.clips);
    }
    if (def.pose) {
      ctl.current.cancel();
      anim.current.pose = { name: def.pose, start: getState().clock.elapsedTime, seconds: def.seconds };
    }
  }, [move, getState]);

  useEffect(() => {
    if (ctl.current.settle) ctl.current.settle();
  }, [walking]);

  // The mixer skips writing a bone whose animated value hasn't changed (e.g. the held stance),
  // so gesture offsets would pile up frame after frame. Keep the mixer's clean pose and put it
  // back before the mixer runs (priority -1 runs before useAnimations' update).
  const cleanPose = useMemo(
    () => (bones ? new Map(['head', 'spine', 'rArm', 'rFore', 'lArm', 'lFore'].map(k => [bones[k], new THREE.Quaternion()])) : null),
    [bones]
  );
  const cleanSaved = useRef(false);
  useFrame(() => {
    if (cleanPose && cleanSaved.current) cleanPose.forEach((q, bone) => bone.quaternion.copy(q));
  }, -1);

  const readyRef = useRef(onReady);
  readyRef.current = onReady;
  useEffect(() => {
    if (readyRef.current) readyRef.current();
  }, []);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const dt = Math.min(delta, 0.1);
    const a = anim.current;
    const now = live.current;

    if (now.reducedMotion) {
      g.rotation.y = FACING;
      g.position.y = 0;
      return;
    }

    // Active gesture envelope.
    let poseW = 0;
    let progress = 0;
    if (a.pose) {
      const elapsed = t - a.pose.start;
      progress = elapsed / a.pose.seconds;
      if (progress >= 1) a.pose = null;
      else poseW = smooth(0, 0.3, elapsed) * (1 - smooth(a.pose.seconds - 0.4, a.pose.seconds, elapsed));
    }
    const levitating = a.pose && a.pose.name === 'levitate';
    const lev = levitating ? poseW : 0;

    a.walkW = approach(a.walkW, now.walking ? 1 : 0, 5, dt);
    a.freeW = approach(a.freeW, now.walking || ctl.current.busy ? 0 : 1, 8, dt);
    a.talkW = approach(a.talkW, now.talking ? 1 : 0, 6, dt);
    a.thinkW = approach(a.thinkW, now.thinking ? 1 : 0, 5, dt);
    a.yaw = approach(a.yaw, now.walking ? WALK_FACING : FACING, 5, dt);

    // Body: hover, sway, levitation turn.
    const still = 1 - a.walkW;
    const levTurn = levitating ? smooth(0.1, 0.9, progress) * Math.PI * 2 : 0;
    g.rotation.y = a.yaw + levTurn + Math.sin(t * 0.5) * 0.12 * still * (1 - lev);
    g.position.y = Math.sin(t * 1.4) * 0.03 * still + lev * 0.25;
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + lev * 0.3);
      ringRef.current.children.forEach((mesh, i) => {
        mesh.material.opacity = (i === 0 ? 0.1 : 0.7) + lev * 0.3;
      });
    }

    if (!bones) return;
    cleanPose.forEach((q, bone) => q.copy(bone.quaternion));
    cleanSaved.current = true;
    g.updateMatrixWorld(true);
    const q = scene.getWorldQuaternion(_qm);
    if (!a.side) {
      const right = scene.worldToLocal(bones.rArm.getWorldPosition(new THREE.Vector3())).x;
      a.side = right < 0 ? -1 : 1;
    }
    const s = a.side;
    const free = a.freeW;

    // Head follows the cursor.
    const p = (pointer && pointer.current) || { x: 0, y: 0 };
    a.lookX = approach(a.lookX, Math.max(-1, Math.min(1, p.x)), 4, dt);
    a.lookY = approach(a.lookY, Math.max(-1, Math.min(1, p.y)), 4, dt);
    const lookW = free * (1 - poseW * 0.8);
    turn(bones.head, UP, a.lookX * 0.55 * lookW, q);
    turn(bones.head, SIDE, a.lookY * 0.3 * lookW, q);

    POSES.think(bones, t, a.thinkW * free * (1 - poseW), s, q);
    POSES.talk(bones, t, a.talkW * free * (1 - poseW) * (1 - a.thinkW), s, q);
    if (a.pose) POSES[a.pose.name](bones, t, poseW * free, s, q);
  });

  return (
    <group ref={group} rotation={[0, FACING, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function BaseRing({ ringRef }) {
  return (
    <group ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
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

export default function QmindsAvatar({ width, height, ...robotProps }) {
  const ringRef = useRef();
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
      <BaseRing ringRef={ringRef} />
      <Suspense fallback={null}>
        <Robot {...robotProps} ringRef={ringRef} />
      </Suspense>
    </Canvas>
  );
}
