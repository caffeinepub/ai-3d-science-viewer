import { Badge } from "@/components/ui/badge";
import { Html, OrbitControls, Sphere, Torus } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type React from "react";
import { Suspense, useCallback, useRef, useState } from "react";
import type * as THREE from "three";

// ─── Organelle Data ───────────────────────────────────────────────────────────
interface Organelle {
  id: string;
  name: string;
  description: string;
  function: string;
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  shape: "sphere" | "ellipsoid" | "torus" | "disc";
}

const ORGANELLES: Organelle[] = [
  {
    id: "nucleus",
    name: "Nucleus",
    description: "Control center of the cell containing DNA",
    function:
      "Stores genetic information (DNA), controls gene expression and cell division",
    color: "#9b59b6",
    position: [0.6, 0.4, 0],
    scale: [1.4, 1.4, 1.4],
    shape: "sphere",
  },
  {
    id: "nucleolus",
    name: "Nucleolus",
    description: "Dense region inside nucleus",
    function: "Produces ribosomal RNA (rRNA) and assembles ribosome subunits",
    color: "#6c3483",
    position: [0.6, 0.55, 0.2],
    scale: [0.55, 0.55, 0.55],
    shape: "sphere",
  },
  {
    id: "chloroplast1",
    name: "Chloroplast",
    description: "Photosynthesis organelle unique to plant cells",
    function:
      "Converts sunlight, CO₂ and water into glucose via photosynthesis; contains chlorophyll",
    color: "#27ae60",
    position: [-1.8, 1.2, 0.5],
    scale: [0.7, 0.4, 0.4],
    shape: "ellipsoid",
  },
  {
    id: "chloroplast2",
    name: "Chloroplast",
    description: "Photosynthesis organelle unique to plant cells",
    function:
      "Converts sunlight, CO₂ and water into glucose via photosynthesis; contains chlorophyll",
    color: "#27ae60",
    position: [1.9, 1.5, -0.6],
    scale: [0.7, 0.4, 0.4],
    shape: "ellipsoid",
  },
  {
    id: "chloroplast3",
    name: "Chloroplast",
    description: "Photosynthesis organelle unique to plant cells",
    function:
      "Converts sunlight, CO₂ and water into glucose via photosynthesis",
    color: "#2ecc71",
    position: [0.3, 1.9, 0.9],
    scale: [0.65, 0.38, 0.38],
    shape: "ellipsoid",
  },
  {
    id: "mitochondria1",
    name: "Mitochondria",
    description: "Powerhouse of the cell — produces ATP",
    function:
      "Cellular respiration: converts glucose + O₂ into ATP energy for all cell processes",
    color: "#16a085",
    position: [-1.6, -0.5, 1.0],
    scale: [0.6, 0.32, 0.32],
    shape: "ellipsoid",
  },
  {
    id: "mitochondria2",
    name: "Mitochondria",
    description: "Powerhouse of the cell — produces ATP",
    function:
      "Cellular respiration: converts glucose + O₂ into ATP energy for all cell processes",
    color: "#1abc9c",
    position: [1.5, -1.4, 0.3],
    scale: [0.55, 0.3, 0.3],
    shape: "ellipsoid",
  },
  {
    id: "rough_er",
    name: "Rough ER",
    description: "Endoplasmic reticulum studded with ribosomes",
    function:
      "Folds and processes proteins; ribosomes on its surface translate mRNA into proteins",
    color: "#d4a017",
    position: [-0.5, 0.2, 0],
    scale: [1.0, 0.55, 0.3],
    shape: "disc",
  },
  {
    id: "golgi",
    name: "Golgi Apparatus",
    description: "Post-office of the cell",
    function:
      "Packages, modifies and ships proteins and lipids to their correct destinations inside or outside the cell",
    color: "#c8a832",
    position: [-0.8, -1.0, 0.2],
    scale: [0.9, 0.5, 0.3],
    shape: "disc",
  },
  {
    id: "vacuole",
    name: "Central Vacuole",
    description: "Large water-filled storage organelle",
    function:
      "Stores water, waste, and nutrients; maintains turgor pressure to keep plant cells rigid",
    color: "#5dade2",
    position: [0, -0.8, 0],
    scale: [1.1, 1.1, 1.1],
    shape: "sphere",
  },
  {
    id: "ribosome1",
    name: "Ribosome",
    description: "Protein synthesis machinery",
    function:
      "Translates mRNA into protein chains using amino acids; found free in cytoplasm or on Rough ER",
    color: "#e74c3c",
    position: [-1.2, 0.8, 0.6],
    scale: [0.25, 0.25, 0.25],
    shape: "sphere",
  },
  {
    id: "ribosome2",
    name: "Ribosome",
    description: "Protein synthesis machinery",
    function: "Translates mRNA into protein chains",
    color: "#e74c3c",
    position: [1.3, -0.5, 1.1],
    scale: [0.25, 0.25, 0.25],
    shape: "sphere",
  },
  {
    id: "ribosome3",
    name: "Ribosome",
    description: "Protein synthesis machinery",
    function: "Translates mRNA into protein chains",
    color: "#e74c3c",
    position: [-0.3, 1.3, -1.2],
    scale: [0.25, 0.25, 0.25],
    shape: "sphere",
  },
];

// ─── Single Organelle Mesh ────────────────────────────────────────────────────
function OrganelleMesh({
  organelle,
  onClick,
  selected,
}: {
  organelle: Organelle;
  onClick: (o: Organelle) => void;
  selected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && selected) {
      meshRef.current.rotation.y += delta * 1.2;
    }
  });

  const color = selected ? "#ffffff" : organelle.color;
  const emissive = selected ? organelle.color : "#000000";

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js mesh elements do not support keyboard events
    <mesh
      ref={meshRef}
      position={organelle.position}
      scale={organelle.scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick(organelle);
      }}
    >
      {organelle.shape === "disc" ? (
        <torusGeometry args={[0.7, 0.22, 8, 24]} />
      ) : (
        <sphereGeometry args={[1, 32, 32]} />
      )}
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={selected ? 0.4 : 0}
        roughness={0.4}
        metalness={0.05}
        transparent
        opacity={organelle.id === "vacuole" ? 0.45 : 0.88}
      />
      {selected && (
        <Html center distanceFactor={6}>
          <div
            className="pointer-events-none text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap"
            style={{
              background: organelle.color,
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            {organelle.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ─── Cell Wall ────────────────────────────────────────────────────────────────
function CellWall() {
  return (
    <>
      {/* Outer cell wall */}
      <mesh>
        <sphereGeometry args={[3.0, 48, 48]} />
        <meshStandardMaterial
          color="#2d6a1e"
          roughness={0.85}
          wireframe={false}
          transparent
          opacity={0.35}
        />
      </mesh>
      {/* Cell membrane */}
      <mesh>
        <sphereGeometry args={[2.75, 48, 48]} />
        <meshStandardMaterial
          color="#5cb85c"
          roughness={0.7}
          transparent
          opacity={0.18}
        />
      </mesh>
      {/* Cytoplasm fill */}
      <mesh>
        <sphereGeometry args={[2.65, 48, 48]} />
        <meshStandardMaterial
          color="#a8e6a8"
          roughness={0.9}
          transparent
          opacity={0.1}
        />
      </mesh>
    </>
  );
}

// ─── Nuclear Envelope ─────────────────────────────────────────────────────────
function NuclearEnvelope() {
  return (
    <mesh position={[0.6, 0.4, 0]}>
      <sphereGeometry args={[1.55, 32, 32]} />
      <meshStandardMaterial
        color="#7d3c98"
        roughness={0.6}
        transparent
        opacity={0.3}
        wireframe={false}
      />
    </mesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function CellScene({
  selected,
  onSelect,
}: {
  selected: Organelle | null;
  onSelect: (o: Organelle) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight
        position={[-5, -5, -3]}
        intensity={0.4}
        color="#a0e0ff"
      />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#c8ffc8" />

      <CellWall />
      <NuclearEnvelope />

      {ORGANELLES.map((o) => (
        <OrganelleMesh
          key={o.id}
          organelle={o}
          onClick={onSelect}
          selected={selected?.id === o.id}
        />
      ))}

      <OrbitControls enablePan={false} minDistance={4} maxDistance={10} />
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function PlantCellViewer() {
  const [selected, setSelected] = useState<Organelle | null>(null);

  const handleSelect = useCallback((o: Organelle) => {
    setSelected((prev) => (prev?.id === o.id ? null : o));
  }, []);

  // Deduplicate organelles for legend (by name)
  const uniqueOrganelles = ORGANELLES.filter(
    (o, i, arr) => arr.findIndex((x) => x.name === o.name) === i,
  );

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{ background: "#080d0a" }}
    >
      {/* 3D Viewer */}
      <div className="flex-1 relative" style={{ minHeight: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 50 }}
          style={{ width: "100%", height: "100%", background: "#080d0a" }}
        >
          <Suspense fallback={null}>
            <CellScene selected={selected} onSelect={handleSelect} />
          </Suspense>
        </Canvas>

        {/* Hint */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full"
          style={{
            background: "rgba(0,0,0,0.6)",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Click organelle to learn more • Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Info panel */}
      {selected && (
        <div
          className="p-4 border-t"
          style={{
            background: "rgba(0,0,0,0.8)",
            borderColor: selected.color,
            borderTopWidth: 2,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full inline-block flex-shrink-0"
              style={{ background: selected.color }}
            />
            <span className="font-semibold text-white text-sm">
              {selected.name}
            </span>
          </div>
          <p
            className="text-xs mb-1"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {selected.description}
          </p>
          <p className="text-xs" style={{ color: selected.color }}>
            <span className="font-semibold">Function: </span>
            {selected.function}
          </p>
        </div>
      )}

      {/* Organelle legend */}
      <div
        className="p-3 border-t flex flex-wrap gap-2"
        style={{
          background: "rgba(0,0,0,0.7)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        {uniqueOrganelles.map((o) => (
          <button
            type="button"
            key={o.id}
            onClick={() => handleSelect(o)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all"
            style={{
              background:
                selected?.name === o.name ? o.color : "rgba(255,255,255,0.07)",
              color:
                selected?.name === o.name ? "white" : "rgba(255,255,255,0.7)",
              border: `1px solid ${o.color}55`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: o.color }}
            />
            {o.name}
          </button>
        ))}
      </div>
    </div>
  );
}
