import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const PART_DATA: Record<string, string> = {
  // Skull / Head
  "Frontal Bone":
    "The bone forming the forehead and upper part of the eye sockets. It protects the frontal lobe of the brain.",
  "Parietal Bone":
    "One of two bones forming the sides and roof of the skull. It protects the parietal lobe of the brain.",
  "Occipital Bone":
    "The bone at the back and base of the skull. It contains the foramen magnum through which the spinal cord passes.",
  Mandible:
    "The lower jaw bone, the only movable bone of the skull. It holds the lower teeth and is involved in chewing and speech.",
  "Cervical Vertebrae":
    "The seven vertebrae of the neck (C1–C7). They support the skull and allow head rotation and nodding.",
  // Thorax
  Clavicle:
    "The collarbone, connecting the sternum to the shoulder blade. It acts as a strut supporting the shoulder.",
  Scapula:
    "The shoulder blade, a triangular bone at the back of the shoulder connecting the humerus and clavicle.",
  Sternum:
    "The breastbone, a flat bone in the center of the chest that connects the ribs via cartilage.",
  "True Ribs":
    "The first 7 pairs of ribs that attach directly to the sternum via costal cartilage.",
  "False Ribs":
    "Ribs 8–10 that attach to the sternum indirectly via the cartilage of the rib above.",
  "Floating Ribs":
    "The last 2 pairs of ribs (11–12) that do not attach to the sternum at all.",
  "Rib Cage":
    "The bony cage formed by the ribs, sternum, and vertebrae that protects the heart and lungs.",
  // Arm
  Humerus:
    "The bone of the upper arm, forming joints at the shoulder and elbow.",
  Radius:
    "One of the two forearm bones; the shorter one on the thumb side, rotating around the ulna.",
  Ulna: "One of the two forearm bones; the longer one on the pinky side, forming the point of the elbow.",
  Carpals:
    "Eight small bones of the wrist arranged in two rows, providing flexibility and movement.",
  Metacarpals:
    "Five bones in the palm of the hand connecting the wrist to the fingers.",
  Scaphoid:
    "A small wrist bone on the thumb side. It is the most commonly fractured carpal bone.",
  Lunate:
    "A moon-shaped carpal bone in the wrist, prone to dislocation from falls.",
  Phalanges:
    "The bones of the fingers and toes. Each digit has 3 phalanges (proximal, middle, distal) except the thumb and big toe.",
  // Spine
  "Vertebral Column":
    "The spine consisting of 33 vertebrae stacked to encase and protect the spinal cord.",
  Lumbar:
    "The five large vertebrae of the lower back (L1–L5), bearing most of the body's weight.",
  // Pelvis
  Ilium:
    "The large, wing-shaped upper part of the hip bone. It supports the spine and transmits weight to the legs.",
  Pubis:
    "The anterior (front) lower portion of the hip bone, meeting its counterpart at the pubic symphysis.",
  Sacrum:
    "A triangular bone at the base of the spine formed from fused vertebrae, connecting the spine to the pelvis.",
  Coccyx:
    "The tailbone, consisting of fused vertebrae at the very base of the spine.",
  Ischium: "The lower and back part of the hip bone; the part you sit on.",
  // Leg
  Femur:
    "The thigh bone, the longest and strongest bone in the body, articulating at the hip and knee.",
  Patella:
    "The kneecap, a small triangular bone embedded in the quadriceps tendon protecting the knee joint.",
  Tibia:
    "The shin bone, the larger of the two lower leg bones, bearing most of the body's weight.",
  Fibula:
    "The slender bone alongside the tibia in the lower leg, primarily for muscle attachment.",
  // Foot
  Tarsals:
    "Seven bones forming the ankle and back of the foot, including the talus and calcaneus.",
  Calcaneus:
    "The heel bone, the largest tarsal bone, forming the foundation of the rear of the foot.",
  Talus:
    "The ankle bone that sits between the tibia and fibula above and the calcaneus below, transmitting body weight.",
  Metatarsals:
    "Five long bones in the foot connecting the tarsals to the toe phalanges.",
  // Organs
  Brain:
    "The central organ of the nervous system controlling thought, memory, emotion, motor function and sensation.",
  Heart:
    "The muscular pump that circulates blood through the vessels of the circulatory system.",
  Lungs:
    "A pair of elastic sacs with branching passages that exchange oxygen and carbon dioxide with the blood.",
  Liver:
    "The largest internal organ, involved in detoxification, protein synthesis, and bile production.",
  Stomach:
    "The muscular sac where the major part of food digestion occurs via acid and enzymes.",
  Intestines:
    "The long tube extending from the stomach to the anus where nutrient absorption and waste formation occur.",
  "Outer Body":
    "The skin and silhouette providing protection and structure to the internal anatomy.",
};

type SystemKey = "skeletal" | "organs" | "nervous" | "outer";

export default function Anatome3DViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [partName, setPartName] = useState("Anatomy Guide");
  const [partDesc, setPartDesc] = useState(
    "Rotate the model and hover over parts to explore the complex systems of the human body.",
  );
  const [visibility, setVisibility] = useState<Record<SystemKey, boolean>>({
    skeletal: true,
    organs: true,
    nervous: true,
    outer: true,
  });

  const systemGroupsRef = useRef<Record<SystemKey, THREE.Group> | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.08);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.0, 0);
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const spotlight = new THREE.SpotLight(0xffffff, 1.2);
    spotlight.position.set(5, 10, 5);
    scene.add(spotlight);
    const rimLight = new THREE.PointLight(0x4ade80, 0.8);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
    frontLight.position.set(0, 2, 5);
    scene.add(frontLight);

    const boneMat = new THREE.MeshPhongMaterial({
      color: 0xe8e0d0,
      shininess: 60,
    });
    const organMat = (color: number) =>
      new THREE.MeshPhongMaterial({
        color,
        transparent: true,
        opacity: 0.9,
        shininess: 100,
      });
    const nerveMat = new THREE.MeshBasicMaterial({ color: 0xffee00 });
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });

    const groups: Record<SystemKey, THREE.Group> = {
      skeletal: new THREE.Group(),
      organs: new THREE.Group(),
      nervous: new THREE.Group(),
      outer: new THREE.Group(),
    };
    systemGroupsRef.current = groups;

    // ── Outer body silhouette ────────────────────────────────
    const addOuter = (
      geom: THREE.BufferGeometry,
      pos: [number, number, number],
    ) => {
      const m = new THREE.Mesh(geom, bodyMat);
      m.position.set(...pos);
      groups.outer.add(m);
    };
    addOuter(new THREE.CapsuleGeometry(0.32, 0.85, 10, 20), [0, 1.15, 0]);
    addOuter(new THREE.SphereGeometry(0.2, 16, 16), [0, 2.0, 0]);
    addOuter(new THREE.CapsuleGeometry(0.11, 0.85, 4, 10), [-0.18, 0.35, 0]);
    addOuter(new THREE.CapsuleGeometry(0.11, 0.85, 4, 10), [0.18, 0.35, 0]);
    addOuter(new THREE.CapsuleGeometry(0.07, 0.55, 4, 8), [-0.42, 1.5, 0]);
    addOuter(new THREE.CapsuleGeometry(0.07, 0.55, 4, 8), [0.42, 1.5, 0]);

    // Helper to add a named bone
    const bone = (
      name: string,
      geom: THREE.BufferGeometry,
      pos: [number, number, number],
      rot?: [number, number, number],
      scale?: [number, number, number],
    ) => {
      const m = new THREE.Mesh(geom, boneMat);
      m.position.set(...pos);
      if (rot) m.rotation.set(...rot);
      if (scale) m.scale.set(...scale);
      m.name = name;
      groups.skeletal.add(m);
      return m;
    };

    // ── HEAD ────────────────────────────────────────────────
    // Skull (cranium) - split into named parts
    bone(
      "Frontal Bone",
      new THREE.SphereGeometry(0.14, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      [0, 2.06, 0.04],
    );
    bone(
      "Parietal Bone",
      new THREE.SphereGeometry(
        0.15,
        12,
        8,
        0,
        Math.PI * 2,
        Math.PI / 4,
        Math.PI / 2,
      ),
      [0, 2.05, -0.01],
    );
    bone(
      "Occipital Bone",
      new THREE.SphereGeometry(
        0.13,
        12,
        8,
        0,
        Math.PI * 2,
        Math.PI / 2,
        Math.PI / 2,
      ),
      [0, 1.96, -0.08],
    );
    bone(
      "Mandible",
      new THREE.BoxGeometry(0.14, 0.05, 0.1),
      [0, 1.82, 0.07],
      [0.2, 0, 0],
    );

    // ── CERVICAL VERTEBRAE (neck) ────────────────────────────
    for (let i = 0; i < 7; i++) {
      bone("Cervical Vertebrae", new THREE.BoxGeometry(0.065, 0.025, 0.045), [
        0,
        1.78 - i * 0.035,
        0,
      ]);
    }

    // ── CLAVICLE ─────────────────────────────────────────────
    bone(
      "Clavicle",
      new THREE.CapsuleGeometry(0.012, 0.22, 4, 8),
      [-0.22, 1.68, 0],
      [0, 0, Math.PI / 2 - 0.3],
    );
    bone(
      "Clavicle",
      new THREE.CapsuleGeometry(0.012, 0.22, 4, 8),
      [0.22, 1.68, 0],
      [0, 0, -(Math.PI / 2 - 0.3)],
    );

    // ── SCAPULA ──────────────────────────────────────────────
    bone(
      "Scapula",
      new THREE.BoxGeometry(0.12, 0.1, 0.02),
      [-0.36, 1.58, -0.04],
    );
    bone(
      "Scapula",
      new THREE.BoxGeometry(0.12, 0.1, 0.02),
      [0.36, 1.58, -0.04],
    );

    // ── STERNUM ──────────────────────────────────────────────
    bone("Sternum", new THREE.BoxGeometry(0.045, 0.28, 0.025), [0, 1.52, 0.1]);

    // ── VERTEBRAL COLUMN (thoracic + lumbar) ─────────────────
    for (let i = 0; i < 12; i++) {
      bone("Vertebral Column", new THREE.BoxGeometry(0.075, 0.028, 0.05), [
        0,
        1.62 - i * 0.055,
        -0.04,
      ]);
    }
    // Lumbar
    for (let i = 0; i < 5; i++) {
      bone("Lumbar", new THREE.BoxGeometry(0.09, 0.032, 0.06), [
        0,
        0.96 - i * 0.06,
        -0.04,
      ]);
    }

    // ── RIBS ─────────────────────────────────────────────────
    for (let i = 0; i < 7; i++) {
      const name = "True Ribs";
      const r = 0.16 + i * 0.008;
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.009, 8, 22, Math.PI),
        boneMat.clone(),
      );
      rib.rotation.x = Math.PI / 2;
      rib.rotation.y = Math.PI;
      rib.position.set(0, 1.58 - i * 0.06, 0.04);
      rib.name = name;
      groups.skeletal.add(rib);
    }
    for (let i = 0; i < 3; i++) {
      const name = i < 2 ? "False Ribs" : "Floating Ribs";
      const r = 0.19 + i * 0.006;
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.008, 8, 22, Math.PI * 0.75),
        boneMat.clone(),
      );
      rib.rotation.x = Math.PI / 2;
      rib.rotation.y = Math.PI;
      rib.position.set(0, 1.16 - i * 0.055, 0);
      rib.name = name;
      groups.skeletal.add(rib);
    }

    // ── HUMERUS ──────────────────────────────────────────────
    bone(
      "Humerus",
      new THREE.CapsuleGeometry(0.028, 0.38, 4, 8),
      [-0.44, 1.46, 0],
      [0, 0, -0.18],
    );
    bone(
      "Humerus",
      new THREE.CapsuleGeometry(0.028, 0.38, 4, 8),
      [0.44, 1.46, 0],
      [0, 0, 0.18],
    );

    // ── RADIUS ───────────────────────────────────────────────
    bone(
      "Radius",
      new THREE.CapsuleGeometry(0.018, 0.32, 4, 8),
      [-0.5, 1.08, 0.02],
      [0.1, 0, -0.1],
    );
    bone(
      "Radius",
      new THREE.CapsuleGeometry(0.018, 0.32, 4, 8),
      [0.5, 1.08, 0.02],
      [0.1, 0, 0.1],
    );

    // ── ULNA ─────────────────────────────────────────────────
    bone(
      "Ulna",
      new THREE.CapsuleGeometry(0.015, 0.34, 4, 8),
      [-0.52, 1.06, -0.02],
      [0.1, 0, -0.12],
    );
    bone(
      "Ulna",
      new THREE.CapsuleGeometry(0.015, 0.34, 4, 8),
      [0.52, 1.06, -0.02],
      [0.1, 0, 0.12],
    );

    // ── CARPALS & WRIST ───────────────────────────────────────
    const wristBones = ["Scaphoid", "Lunate", "Carpals", "Carpals"];
    for (let side = -1; side <= 1; side += 2) {
      wristBones.forEach((bname, i) => {
        bone(bname, new THREE.BoxGeometry(0.025, 0.022, 0.02), [
          side * (0.53 + (i - 1.5) * 0.025),
          0.8,
          0,
        ]);
      });
      // Metacarpals
      for (let i = 0; i < 5; i++) {
        bone("Metacarpals", new THREE.CapsuleGeometry(0.009, 0.065, 4, 6), [
          side * (0.51 + (i - 2) * 0.022),
          0.73,
          0,
        ]);
      }
      // Phalanges (fingers)
      for (let i = 0; i < 5; i++) {
        bone("Phalanges", new THREE.CapsuleGeometry(0.007, 0.05, 4, 6), [
          side * (0.51 + (i - 2) * 0.022),
          0.65,
          0,
        ]);
        bone("Phalanges", new THREE.CapsuleGeometry(0.006, 0.04, 4, 6), [
          side * (0.51 + (i - 2) * 0.022),
          0.59,
          0,
        ]);
      }
    }

    // ── PELVIS (Ilium, Pubis, Sacrum, Coccyx, Ischium) ────────
    bone(
      "Ilium",
      new THREE.TorusGeometry(0.15, 0.04, 8, 16, Math.PI),
      [0, 0.82, 0],
      [Math.PI / 2, 0, 0],
    );
    bone("Ilium", new THREE.BoxGeometry(0.13, 0.08, 0.04), [-0.15, 0.82, 0]);
    bone("Ilium", new THREE.BoxGeometry(0.13, 0.08, 0.04), [0.15, 0.82, 0]);
    bone(
      "Pubis",
      new THREE.CapsuleGeometry(0.022, 0.12, 4, 8),
      [0, 0.68, 0.06],
      [0, 0, Math.PI / 2],
    );
    bone("Sacrum", new THREE.BoxGeometry(0.09, 0.12, 0.04), [0, 0.72, -0.04]);
    bone("Coccyx", new THREE.BoxGeometry(0.04, 0.05, 0.03), [0, 0.62, -0.02]);
    bone("Ischium", new THREE.BoxGeometry(0.07, 0.06, 0.04), [-0.12, 0.65, 0]);
    bone("Ischium", new THREE.BoxGeometry(0.07, 0.06, 0.04), [0.12, 0.65, 0]);

    // ── FEMUR ────────────────────────────────────────────────
    bone(
      "Femur",
      new THREE.CapsuleGeometry(0.038, 0.62, 4, 10),
      [-0.18, 0.28, 0],
    );
    bone(
      "Femur",
      new THREE.CapsuleGeometry(0.038, 0.62, 4, 10),
      [0.18, 0.28, 0],
    );

    // ── PATELLA ──────────────────────────────────────────────
    bone("Patella", new THREE.SphereGeometry(0.028, 8, 8), [-0.18, -0.1, 0.04]);
    bone("Patella", new THREE.SphereGeometry(0.028, 8, 8), [0.18, -0.1, 0.04]);

    // ── TIBIA ────────────────────────────────────────────────
    bone(
      "Tibia",
      new THREE.CapsuleGeometry(0.028, 0.52, 4, 8),
      [-0.17, -0.46, 0],
    );
    bone(
      "Tibia",
      new THREE.CapsuleGeometry(0.028, 0.52, 4, 8),
      [0.17, -0.46, 0],
    );

    // ── FIBULA ───────────────────────────────────────────────
    bone(
      "Fibula",
      new THREE.CapsuleGeometry(0.014, 0.5, 4, 8),
      [-0.22, -0.46, 0],
    );
    bone(
      "Fibula",
      new THREE.CapsuleGeometry(0.014, 0.5, 4, 8),
      [0.22, -0.46, 0],
    );

    // ── TARSALS / ANKLE ──────────────────────────────────────
    bone(
      "Talus",
      new THREE.BoxGeometry(0.065, 0.04, 0.055),
      [-0.18, -0.78, 0.01],
    );
    bone(
      "Talus",
      new THREE.BoxGeometry(0.065, 0.04, 0.055),
      [0.18, -0.78, 0.01],
    );
    bone(
      "Calcaneus",
      new THREE.BoxGeometry(0.07, 0.05, 0.1),
      [-0.18, -0.83, -0.03],
    );
    bone(
      "Calcaneus",
      new THREE.BoxGeometry(0.07, 0.05, 0.1),
      [0.18, -0.83, -0.03],
    );
    for (let i = 0; i < 3; i++) {
      bone("Tarsals", new THREE.BoxGeometry(0.025, 0.035, 0.04), [
        -0.19 + (i - 1) * 0.026,
        -0.79,
        0.06,
      ]);
      bone("Tarsals", new THREE.BoxGeometry(0.025, 0.035, 0.04), [
        0.19 + (i - 1) * 0.026,
        -0.79,
        0.06,
      ]);
    }

    // ── METATARSALS ──────────────────────────────────────────
    for (let i = 0; i < 5; i++) {
      bone(
        "Metatarsals",
        new THREE.CapsuleGeometry(0.009, 0.07, 4, 6),
        [-0.2 + (i - 2) * 0.022, -0.83, 0.1],
        [Math.PI / 2, 0, 0],
      );
      bone(
        "Metatarsals",
        new THREE.CapsuleGeometry(0.009, 0.07, 4, 6),
        [0.2 + (i - 2) * 0.022, -0.83, 0.1],
        [Math.PI / 2, 0, 0],
      );
    }

    // ── TOE PHALANGES ────────────────────────────────────────
    for (let i = 0; i < 5; i++) {
      bone(
        "Phalanges",
        new THREE.CapsuleGeometry(0.007, 0.03, 4, 6),
        [-0.2 + (i - 2) * 0.022, -0.84, 0.15],
        [Math.PI / 2, 0, 0],
      );
      bone(
        "Phalanges",
        new THREE.CapsuleGeometry(0.007, 0.03, 4, 6),
        [0.2 + (i - 2) * 0.022, -0.84, 0.15],
        [Math.PI / 2, 0, 0],
      );
    }

    // ── ORGANS ───────────────────────────────────────────────
    const brain = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      organMat(0xffb6c1),
    );
    brain.position.y = 2.02;
    brain.name = "Brain";
    groups.organs.add(brain);

    const heart = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      organMat(0xdc143c),
    );
    heart.position.set(0.02, 1.42, 0.06);
    heart.name = "Heart";
    groups.organs.add(heart);

    const lungGeom = new THREE.CapsuleGeometry(0.075, 0.16, 8, 8);
    const lungL2 = new THREE.Mesh(lungGeom, organMat(0xff9999));
    lungL2.position.set(-0.12, 1.4, 0);
    lungL2.rotation.z = 0.1;
    lungL2.name = "Lungs";
    groups.organs.add(lungL2);
    const lungR2 = lungL2.clone();
    lungR2.position.x = 0.12;
    lungR2.rotation.z = -0.1;
    groups.organs.add(lungR2);

    const liver = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.09, 1),
      organMat(0x6b2121),
    );
    liver.position.set(0.1, 1.22, 0.03);
    liver.scale.set(1.4, 0.8, 1);
    liver.name = "Liver";
    groups.organs.add(liver);

    const stomach = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      organMat(0xfac0c0),
    );
    stomach.position.set(-0.08, 1.18, 0.06);
    stomach.name = "Stomach";
    groups.organs.add(stomach);

    const intestines = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.065, 10, 20),
      organMat(0xcc8e5e),
    );
    intestines.position.set(0, 0.95, 0.06);
    intestines.rotation.x = Math.PI / 2;
    intestines.name = "Intestines";
    groups.organs.add(intestines);

    // ── NERVOUS SYSTEM ───────────────────────────────────────
    const centralNerve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.002, 1.6),
      nerveMat,
    );
    centralNerve.position.y = 1.2;
    centralNerve.name = "Vertebral Column";
    groups.nervous.add(centralNerve);
    for (let i = 0; i < 12; i++) {
      const branch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.001, 0.38),
        nerveMat,
      );
      branch.position.y = 1.6 - i * 0.12;
      branch.rotation.z = Math.PI / 2;
      groups.nervous.add(branch);
    }

    for (const g of Object.values(groups)) scene.add(g);

    // ── Raycaster ────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${e.clientX - rect.left + 20}px`;
        tooltipRef.current.style.top = `${e.clientY - rect.top - 20}px`;
      }

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      if (
        hits.length > 0 &&
        hits[0].object.name &&
        hits[0].object.name !== "Outer Body"
      ) {
        const name = hits[0].object.name;
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "block";
          tooltipRef.current.textContent = name;
        }
        setPartName(name);
        setPartDesc(
          PART_DATA[name] ??
            "Detailed component of the biological system being explored.",
        );
      } else {
        if (tooltipRef.current) tooltipRef.current.style.display = "none";
      }
    };

    container.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const groups = systemGroupsRef.current;
    if (!groups) return;
    for (const key of Object.keys(visibility) as SystemKey[])
      groups[key].visible = visibility[key];
  }, [visibility]);

  const toggleSystem = (key: SystemKey) =>
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));

  const resetCamera = () => {
    cameraRef.current?.position.set(0, 1, 5);
    controlsRef.current?.target.set(0, 1.0, 0);
  };

  const SYSTEM_LABELS: { key: SystemKey; label: string }[] = [
    { key: "skeletal", label: "Skeleton" },
    { key: "organs", label: "Organs" },
    { key: "nervous", label: "Nervous" },
    { key: "outer", label: "Skin/X-Ray" },
  ];

  return (
    <div className="relative w-full h-full" style={{ background: "#020617" }}>
      <div ref={mountRef} className="w-full h-full" />

      <div
        ref={tooltipRef}
        className="absolute pointer-events-none hidden z-20 px-3 py-1.5 rounded-lg text-xs font-semibold"
        style={{
          background: "rgba(15,23,42,0.95)",
          color: "#4ade80",
          border: "1px solid rgba(74,222,128,0.5)",
          boxShadow: "0 0 15px rgba(74,222,128,0.2)",
        }}
      />

      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h2 className="text-white text-xl font-bold tracking-tight">
          ANATOME<span style={{ color: "#4ade80" }}>3D</span>
        </h2>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#10b981" }}
          />
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">
            Full Body Bio-Scan v2.5
          </p>
        </div>
      </div>

      <div
        className="absolute top-4 right-4 z-10 p-4 rounded-2xl w-64"
        style={{
          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-base" style={{ color: "#4ade80" }}>
            {partName}
          </h3>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded"
            style={{ background: "rgba(30,41,59,1)", color: "#94a3b8" }}
          >
            INTERACTIVE
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#cbd5e1" }}>
          {partDesc}
        </p>
        <div
          className="mt-3 pt-3 flex gap-3 text-[9px] font-mono"
          style={{
            borderTop: "1px solid rgba(100,116,139,0.3)",
            color: "#64748b",
          }}
        >
          <span>SKELETAL</span>
          <span>ORGANS</span>
          <span>NERVOUS</span>
        </div>
      </div>

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2.5 rounded-3xl"
        style={{
          background: "rgba(15,23,42,0.8)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span
          className="px-2 text-[9px] font-bold uppercase tracking-tight"
          style={{ color: "#64748b" }}
        >
          Systems
        </span>
        {SYSTEM_LABELS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggleSystem(key)}
            className="px-4 py-2 rounded-2xl text-white text-xs font-semibold transition-all"
            style={{
              background: visibility[key] ? "#10b981" : "rgba(30,41,59,1)",
              boxShadow: visibility[key]
                ? "0 0 15px rgba(16,185,129,0.4)"
                : "none",
            }}
            data-ocid={`anatome3d.toggle.${key}`}
          >
            {label}
          </button>
        ))}
        <div
          className="w-px h-5 mx-1"
          style={{ background: "rgba(100,116,139,0.3)" }}
        />
        <button
          type="button"
          onClick={resetCamera}
          className="p-2 rounded-2xl transition-colors"
          style={{ background: "rgba(30,41,59,1)", color: "#94a3b8" }}
          title="Reset View"
          data-ocid="anatome3d.reset_camera"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Reset camera view"
            role="img"
          >
            <title>Reset camera view</title>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
