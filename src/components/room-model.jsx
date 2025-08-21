// ObjRoomViewer.jsx
"use client";

import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Billboard,
} from "@react-three/drei";

/* ============ GLB ============ */
function RoomModel({ url = "/3dModel/4.glb", onReady }) {
  const { scene } = useGLTF(url);
  const group = useRef();
  useEffect(() => {
    if (!group.current) return;
    group.current.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (m?.map) m.map.encoding = THREE.sRGBEncoding;
          if (m?.emissiveMap) m.emissiveMap.encoding = THREE.sRGBEncoding;
        });
      }
    });
    onReady?.(group.current);
  }, [onReady]);
  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}
useGLTF.preload("/3dModel/4.glb");

/* ============ AutoCamera（會覆蓋 Canvas camera） ============ */
function AutoCamera({ targetObj, controlsRef, view = {} }) {
  const { camera, gl } = useThree();
  const localControls = useRef();
  useEffect(() => {
    if (!targetObj || !localControls.current) return;
    controlsRef.current = localControls.current;

    const box = new THREE.Box3().setFromObject(targetObj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const fov = view.fov ?? 30;
    const margin = view.margin ?? 1.1;
    const eyeH = size.y * (view.eyeHRate ?? 0.4);
    const yawDeg = view.yawDeg ?? 8; // ← 往左一點就改小或改負值
    const shiftX = size.x * (view.shiftXMul ?? 0.01);

    camera.fov = fov;
    camera.near = 0.01;
    camera.far = Math.max(500, size.length() * 10);
    camera.updateProjectionMatrix();

    const dist =
      (size.y * 0.5 * margin) / Math.tan(THREE.MathUtils.degToRad(fov / 2));
    const radius = dist + size.z * 0.35;
    const yaw = THREE.MathUtils.degToRad(yawDeg);

    camera.position.set(
      center.x + Math.sin(yaw) * radius,
      box.min.y + eyeH,
      center.z + Math.cos(yaw) * radius
    );

    localControls.current.target.set(
      center.x + shiftX,
      box.min.y + size.y * 0.42,
      center.z
    );
    localControls.current.update();

    localControls.current.enableZoom = false;
    localControls.current.enablePan = false;
    localControls.current.minPolarAngle = Math.PI * 0.18;
    localControls.current.maxPolarAngle = Math.PI * 0.48;
  }, [targetObj, camera, view]);

  return (
    <OrbitControls
      ref={localControls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      args={[camera, gl.domElement]}
    />
  );
}

/* ============ 工具 ============ */
const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
function findNodeByNames(root, names = []) {
  if (!root) return null;
  const wants = names.map(norm);
  let hit = null;
  root.traverse((n) => {
    if (hit) return;
    const nn = norm(n.name);
    if (wants.some((w) => nn.includes(w))) hit = n;
  });
  return hit;
}
function centerOf(node, fallbackY = 0) {
  const box = new THREE.Box3().setFromObject(node);
  const c = new THREE.Vector3();
  box.getCenter(c);
  if (!isFinite(c.y)) c.y = fallbackY;
  return { c, box };
}

/* ============ 日/夜 燈光 ============ */
function DayLights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[7, 14, 6]} intensity={1.3} castShadow />
      <Environment preset="apartment" />
    </>
  );
}
function NightLights({ targetObj }) {
  const memo = useMemo(() => {
    if (!targetObj) return null;
    const box = new THREE.Box3().setFromObject(targetObj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    return { box, size, center };
  }, [targetObj]);

  const lamp = useMemo(() => {
    if (!targetObj || !memo) return { pos: [0, 1.2, 0] };
    const cand = [
      "lamp",
      "light",
      "gyhzt610114",
      "obj_52354047",
      "obj_52354048",
      "arc014",
      "mesh.144",
    ];
    let node = null;
    targetObj.traverse((n) => {
      if (node) return;
      const nn = norm(n.name);
      if (cand.some((w) => nn.includes(w))) node = n;
    });
    if (node) {
      const b = new THREE.Box3().setFromObject(node);
      const c = new THREE.Vector3();
      b.getCenter(c);
      const s = new THREE.Vector3();
      b.getSize(s);
      c.y = b.max.y + s.y * 0.02;
      return { pos: [c.x, c.y, c.z] };
    }
    const { box, size, center } = memo;
    return {
      pos: [center.x + size.x * 0.25, box.min.y + size.y * 0.85, center.z],
    };
  }, [targetObj, memo]);

  const spotPower = 4200;
  const pointPower = 1600;
  const distance = memo ? Math.max(6, memo.size.length() * 0.55) : 8;

  return (
    <>
      <ambientLight intensity={0.03} color="#4f5d78" />
      <Environment
        preset="night"
        background={false}
        environmentIntensity={0.08}
      />
      <hemisphereLight intensity={0.05} groundColor="#1a1f29" color="#3b4260" />
      <spotLight
        position={[lamp.pos[0], lamp.pos[1] + 0.05, lamp.pos[2] - 0.12]}
        angle={0.5}
        penumbra={0.95}
        distance={distance}
        intensity={1}
        castShadow
        color="#ffc486"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0002}
        onUpdate={(l) => {
          l.power = spotPower;
        }}
      />
      <pointLight
        position={lamp.pos}
        distance={Math.max(4.5, distance * 0.55)}
        decay={2}
        intensity={1}
        color="#ffcf9a"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
        onUpdate={(l) => {
          l.power = pointPower;
        }}
      />
    </>
  );
}
function UseExposure({ mode }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMappingExposure = mode === "night" ? 0.9 : 1.0;
  }, [gl, mode]);
  return null;
}

/* ============ Hotspot（閃爍可點） ============ */
function Hotspot({ position, onClick, color = "#ffd27a" }) {
  const ref = useRef();
  const ring = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * 2.6) * 0.2;
    if (ref.current) ref.current.scale.setScalar(s);
    if (ring.current) {
      const k = (Math.sin(t * 3.2) + 1) * 0.5; // 0~1
      ring.current.material.opacity = 0.35 + k * 0.45;
      ring.current.scale.setScalar(1.4 + k * 0.6);
    }
  });
  return (
    <Billboard position={position} follow>
      {/* 亮點 */}
      <mesh ref={ref} onClick={onClick}>
        <circleGeometry args={[0.08, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      {/* 外圈脈動 */}
      <mesh ref={ring} onClick={onClick}>
        <ringGeometry args={[0.11, 0.16, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </Billboard>
  );
}

/* ============ 視角平滑切換管理 ============ */
function useSmoothFocus(controlsRef) {
  const { camera } = useThree();
  const startPose = useRef({
    pos: camera.position.clone(),
    tar: new THREE.Vector3(0, 0, 0),
  });
  const animRef = useRef(null);

  const goTo = (targetPos, lookAt, distMul = 0.65, dur = 0.9) => {
    if (!controlsRef.current) return;
    // 存起原位以便回來
    startPose.current = {
      pos: camera.position.clone(),
      tar: controlsRef.current.target.clone(),
    };

    // 目標相機位置（從 lookAt 往我們位置方向退 distMul）
    const dir = new THREE.Vector3().subVectors(targetPos, lookAt).normalize();
    const wantPos = new THREE.Vector3()
      .copy(lookAt)
      .add(dir.multiplyScalar(distMul * targetPos.distanceTo(lookAt)));

    const t0 = performance.now();
    const t1 = t0 + dur * 1000;
    const fromPos = camera.position.clone();
    const fromTar = controlsRef.current.target.clone();
    const toPos = wantPos;
    const toTar = lookAt.clone();

    controlsRef.current.enabled = false;
    cancelAnimationFrame(animRef.current);
    const step = () => {
      const now = performance.now();
      const k = Math.min(1, (now - t0) / (t1 - t0));
      const ease = k < 0.5 ? 2 * k * k : -1 + (4 - 2 * k) * k; // easeInOutQuad
      camera.position.lerpVectors(fromPos, toPos, ease);
      controlsRef.current.target.lerpVectors(fromTar, toTar, ease);
      controlsRef.current.update();
      if (k < 1) animRef.current = requestAnimationFrame(step);
      else controlsRef.current.enabled = true;
    };
    animRef.current = requestAnimationFrame(step);
  };

  const back = (dur = 0.9) => {
    if (!controlsRef.current) return;
    const fromPos = camera.position.clone();
    const fromTar = controlsRef.current.target.clone();
    const toPos = startPose.current.pos.clone();
    const toTar = startPose.current.tar.clone();

    const t0 = performance.now();
    const t1 = t0 + dur * 1000;
    controlsRef.current.enabled = false;
    cancelAnimationFrame(animRef.current);
    const step = () => {
      const now = performance.now();
      const k = Math.min(1, (now - t0) / (t1 - t0));
      const ease = k < 0.5 ? 2 * k * k : -1 + (4 - 2 * k) * k;
      camera.position.lerpVectors(fromPos, toPos, ease);
      controlsRef.current.target.lerpVectors(fromTar, toTar, ease);
      controlsRef.current.update();
      if (k < 1) animRef.current = requestAnimationFrame(step);
      else controlsRef.current.enabled = true;
    };
    animRef.current = requestAnimationFrame(step);
  };

  return { goTo, back };
}

/* ============ 主元件 ============ */
export default function ObjRoomViewer({ glbUrl = "/3dModel/4.glb" }) {
  const [targetObj, setTargetObj] = useState(null);
  const [mode, setMode] = useState("day");
  const [panel, setPanel] = useState(null); // {title, body}
  const controlsRef = useRef(null);

  const Background = () =>
    mode === "night" ? (
      <color attach="background" args={["#0a0d14"]} />
    ) : (
      <color attach="background" args={["#f7f7f7"]} />
    );

  // L 快捷鍵
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "l")
        setMode((m) => (m === "day" ? "night" : "day"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 熱點定位（容錯：名稱很多組合，抓到一個就用其包圍盒中心）
  const spots = useMemo(() => {
    if (!targetObj) return [];
    const out = [];
    const addByNames = (names, title, body) => {
      const node = findNodeByNames(targetObj, names);
      if (!node) return;
      const { c, box } = centerOf(node, 1.0);
      // 稍微往上避免被遮
      c.y = box.max.y + box.getSize(new THREE.Vector3()).y * 0.06;
      out.push({ pos: c.toArray(), title, body, node });
    };

    // 床
    addByNames(
      ["bed", "mattress", "pillow", "blanket"],
      "床 / Bed",
      "雙人床、布面與枕頭組。"
    );
    // 床頭櫃（依你貼的名字，外加常見關鍵字）
    addByNames(
      [
        "obj_52354047",
        "obj_52354048",
        "nightstand",
        "drawer",
        "cabinet",
        "desk",
      ],
      "床頭櫃 / Nightstand",
      "收納抽屜，檯面可擺設小夜燈/香氛。"
    );
    // 窗戶（你貼過：ChenZc..., window, blind）
    addByNames(
      ["window", "blind", "chenzc", "gyhzt610114"],
      "窗戶 / Window",
      "百葉窗與落地窗，採光面。"
    );
    return out;
  }, [targetObj]);

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] relative">
      <div className="absolute z-50 left-[20%] top-[10%] ">
        {" "}
        <h1 className="text-[70px]">THE HOUSE</h1>
      </div>
      {/* 模式切換 */}
      <button
        onClick={() => setMode((m) => (m === "day" ? "night" : "day"))}
        className="absolute top-4 right-4 z-[9999] bg-white/85 backdrop-blur text-black px-4 py-2 rounded-lg shadow hover:bg-white"
        title="快捷鍵：L"
      >
        {mode === "day" ? "切到夜晚" : "切到日間"}
      </button>

      {/* 資訊欄（popup） */}
      <div
        className={`pointer-events-auto absolute top-0 right-0 h-full z-[9998] transition-transform duration-500 ${
          panel ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: 360 }}
      >
        <div className="h-full bg-white/95 backdrop-blur shadow-xl border-l border-black/10 flex flex-col">
          <div className="p-4 border-b border-black/10 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{panel?.title ?? ""}</h3>
            <button
              onClick={() => {
                setPanel(null); // 關閉由 Canvas 內觸發回位（看下方 FocusButton onClose）
                // 交由 Canvas 那邊的 onClose 回位
                window.dispatchEvent(new CustomEvent("HOTSPOT_CLOSE"));
              }}
              className="px-2 py-1 rounded bg-black text-white hover:opacity-80"
            >
              關閉
            </button>
          </div>
          <div className="p-4 text-sm leading-6">{panel?.body ?? ""}</div>
        </div>
      </div>

      <Canvas
        shadows
        camera={{ position: [4, 5, 12], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          physicallyCorrectLights: true,
        }}
      >
        <UseExposure mode={mode} />
        <Suspense fallback={null}>
          <Background />
          {mode === "day" ? (
            <DayLights />
          ) : (
            <NightLights targetObj={targetObj} />
          )}

          {/* 模型 */}
          <RoomModel url={glbUrl} onReady={setTargetObj} />

          {/* 相機控制（初始視角） */}
          <AutoCamera
            targetObj={targetObj}
            controlsRef={controlsRef}
            view={{ yawDeg: 8, shiftXMul: 0.01 }}
          />

          {/* ---- 熱點（床／床頭櫃／窗戶） ---- */}
          <SceneHotspots
            spots={spots}
            controlsRef={controlsRef}
            onOpen={(p) => setPanel(p)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ============ 熱點 + 聚焦/回復邏輯（在 Canvas 內） ============ */
function SceneHotspots({ spots, controlsRef, onOpen }) {
  const { goTo, back } = useSmoothFocus(controlsRef);

  useEffect(() => {
    const backHandler = () => back(0.9);
    window.addEventListener("HOTSPOT_CLOSE", backHandler);
    return () => window.removeEventListener("HOTSPOT_CLOSE", backHandler);
  }, [back]);

  if (!spots || spots.length === 0) return null;

  return (
    <>
      {spots.map((s, i) => (
        <Hotspot
          key={i}
          position={s.pos}
          onClick={() => {
            // 目標看向點：用該節點中心略降
            const look = new THREE.Vector3(...s.pos);
            look.y -= 0.25;
            const camPos = new THREE.Vector3(...s.pos);
            camPos.z += 0.001; // 向前一點，goTo 會自動拉距
            goTo(camPos, look, 0.6, 0.9);
            onOpen?.({ title: s.title, body: s.body });
          }}
        />
      ))}
    </>
  );
}
