import Anatome3DViewer from "@/components/Anatome3DViewer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Anatomy Data ────────────────────────────────────────────────────────────
interface AnatomyItem {
  id: string;
  name: string;
  system: "organ" | "skeletal" | "muscular" | "cellular";
  pdbId: string;
  description: string;
  function: string;
  svgX: number; // % position on body SVG
  svgY: number;
  color: string;
}

const ANATOMY_ITEMS: AnatomyItem[] = [
  // Organs
  {
    id: "brain",
    name: "Brain",
    system: "organ",
    pdbId: "1IBR",
    description: "Control center of the nervous system",
    function: "Controls all body functions, cognition, memory, emotion",
    svgX: 50,
    svgY: 8,
    color: "#f59e0b",
  },
  {
    id: "heart",
    name: "Heart",
    system: "organ",
    pdbId: "1AIK",
    description: "Cardiac muscle pumping blood",
    function: "Pumps oxygenated blood to all organs; ~100,000 beats/day",
    svgX: 46,
    svgY: 32,
    color: "#ef4444",
  },
  {
    id: "lungs",
    name: "Lungs",
    system: "organ",
    pdbId: "1HHO",
    description: "Gas exchange organs",
    function: "Oxygenate blood and expel CO₂; 370M alveoli",
    svgX: 55,
    svgY: 31,
    color: "#3b82f6",
  },
  {
    id: "liver",
    name: "Liver",
    system: "organ",
    pdbId: "1AO6",
    description: "Largest internal organ (1.4 kg)",
    function:
      "Detoxification, bile production, protein synthesis, glucose storage",
    svgX: 44,
    svgY: 38,
    color: "#a16207",
  },
  {
    id: "stomach",
    name: "Stomach",
    system: "organ",
    pdbId: "1PPC",
    description: "Digestive muscular organ",
    function: "Acid digestion of food; pepsin breaks proteins",
    svgX: 50,
    svgY: 40,
    color: "#65a30d",
  },
  {
    id: "kidney-l",
    name: "Left Kidney",
    system: "organ",
    pdbId: "2LYZ",
    description: "Blood filtering organ",
    function:
      "Filters 200L blood/day; regulates electrolytes and blood pressure",
    svgX: 42,
    svgY: 43,
    color: "#7c3aed",
  },
  {
    id: "kidney-r",
    name: "Right Kidney",
    system: "organ",
    pdbId: "2LYZ",
    description: "Blood filtering organ",
    function:
      "Filters 200L blood/day; regulates electrolytes and blood pressure",
    svgX: 58,
    svgY: 43,
    color: "#7c3aed",
  },
  {
    id: "pancreas",
    name: "Pancreas",
    system: "organ",
    pdbId: "1MSO",
    description: "Endocrine & exocrine gland",
    function: "Produces insulin/glucagon; secretes digestive enzymes",
    svgX: 53,
    svgY: 41,
    color: "#ec4899",
  },
  {
    id: "spleen",
    name: "Spleen",
    system: "organ",
    pdbId: "1GFL",
    description: "Immune organ",
    function: "Filters old red blood cells; immune surveillance",
    svgX: 56,
    svgY: 38,
    color: "#8b5cf6",
  },
  {
    id: "small-int",
    name: "Small Intestine",
    system: "organ",
    pdbId: "1TIM",
    description: "6–7 m absorption organ",
    function: "Absorbs nutrients from digested food over 6-7 meters",
    svgX: 50,
    svgY: 50,
    color: "#06b6d4",
  },
  {
    id: "large-int",
    name: "Large Intestine",
    system: "organ",
    pdbId: "1CDW",
    description: "1.5 m water absorption organ",
    function: "Absorbs water; houses gut microbiome; forms stool",
    svgX: 50,
    svgY: 55,
    color: "#10b981",
  },
  {
    id: "bladder",
    name: "Bladder",
    system: "organ",
    pdbId: "1UBQ",
    description: "Urine storage organ",
    function: "Stores up to 500ml urine before micturition",
    svgX: 50,
    svgY: 62,
    color: "#f97316",
  },
  {
    id: "thyroid",
    name: "Thyroid",
    system: "organ",
    pdbId: "1CDW",
    description: "Endocrine gland (neck)",
    function: "Produces T3/T4 hormones regulating metabolism and growth",
    svgX: 50,
    svgY: 18,
    color: "#14b8a6",
  },
  {
    id: "adrenal",
    name: "Adrenal Glands",
    system: "organ",
    pdbId: "4INS",
    description: "Stress hormone glands",
    function: "Produce adrenaline, cortisol; regulate stress response",
    svgX: 55,
    svgY: 40,
    color: "#d97706",
  },

  // Skeletal
  {
    id: "skull",
    name: "Skull",
    system: "skeletal",
    pdbId: "1Y0F",
    description: "Cranial & facial bones (22)",
    function: "Protects brain; houses sensory organs; forms facial structure",
    svgX: 50,
    svgY: 7,
    color: "#94a3b8",
  },
  {
    id: "cervical",
    name: "Cervical Vertebrae",
    system: "skeletal",
    pdbId: "1Y0F",
    description: "C1–C7 neck vertebrae",
    function: "Support head (avg 5 kg); enable neck rotation and flexion",
    svgX: 50,
    svgY: 16,
    color: "#cbd5e1",
  },
  {
    id: "thoracic",
    name: "Thoracic Vertebrae",
    system: "skeletal",
    pdbId: "1CAG",
    description: "T1–T12 mid-spine",
    function: "Anchor ribs; protect spinal cord; thoracic stability",
    svgX: 50,
    svgY: 28,
    color: "#cbd5e1",
  },
  {
    id: "lumbar",
    name: "Lumbar Vertebrae",
    system: "skeletal",
    pdbId: "1CAG",
    description: "L1–L5 lower back",
    function: "Bear upper body weight; enable trunk flexion and extension",
    svgX: 50,
    svgY: 47,
    color: "#cbd5e1",
  },
  {
    id: "sternum",
    name: "Sternum",
    system: "skeletal",
    pdbId: "1Y0F",
    description: "Breastbone",
    function: "Protects heart and lungs; attachment for ribs and clavicles",
    svgX: 50,
    svgY: 28,
    color: "#94a3b8",
  },
  {
    id: "ribs",
    name: "Ribs (12 pairs)",
    system: "skeletal",
    pdbId: "1CAG",
    description: "Thoracic cage bones",
    function: "Protect thoracic organs; assist breathing via expansion",
    svgX: 50,
    svgY: 33,
    color: "#94a3b8",
  },
  {
    id: "clavicle",
    name: "Clavicle",
    system: "skeletal",
    pdbId: "1Y0F",
    description: "Collarbone",
    function: "Transmits forces from arm to trunk; stabilises shoulder girdle",
    svgX: 42,
    svgY: 22,
    color: "#94a3b8",
  },
  {
    id: "scapula",
    name: "Scapula",
    system: "skeletal",
    pdbId: "1Y0F",
    description: "Shoulder blade",
    function: "Connects humerus and clavicle; anchor for shoulder muscles",
    svgX: 38,
    svgY: 27,
    color: "#94a3b8",
  },
  {
    id: "humerus",
    name: "Humerus",
    system: "skeletal",
    pdbId: "1CAG",
    description: "Upper arm bone",
    function: "Upper arm structure; articulates at shoulder and elbow joints",
    svgX: 34,
    svgY: 34,
    color: "#94a3b8",
  },
  {
    id: "radius",
    name: "Radius",
    system: "skeletal",
    pdbId: "1CAG",
    description: "Lateral forearm bone",
    function: "Thumb-side forearm bone; enables pronation/supination",
    svgX: 30,
    svgY: 43,
    color: "#94a3b8",
  },
  {
    id: "ulna",
    name: "Ulna",
    system: "skeletal",
    pdbId: "1CAG",
    description: "Medial forearm bone",
    function: "Pinky-side forearm; forms elbow joint with humerus",
    svgX: 32,
    svgY: 44,
    color: "#94a3b8",
  },
  {
    id: "pelvis",
    name: "Pelvis",
    system: "skeletal",
    pdbId: "1Y0F",
    description: "Hip bones (ilium, ischium, pubis)",
    function:
      "Supports spine; transmits weight to legs; protects pelvic organs",
    svgX: 50,
    svgY: 57,
    color: "#94a3b8",
  },
  {
    id: "femur",
    name: "Femur",
    system: "skeletal",
    pdbId: "1CAG",
    description: "Thigh bone — longest bone",
    function: "Longest/strongest bone; transmits body weight to knee",
    svgX: 44,
    svgY: 66,
    color: "#94a3b8",
  },
  {
    id: "patella",
    name: "Patella",
    system: "skeletal",
    pdbId: "1Y0F",
    description: "Kneecap",
    function: "Protects knee joint; increases leverage of quadriceps",
    svgX: 44,
    svgY: 74,
    color: "#94a3b8",
  },
  {
    id: "tibia",
    name: "Tibia",
    system: "skeletal",
    pdbId: "1CAG",
    description: "Shin bone",
    function: "Supports body weight through leg; forms ankle joint",
    svgX: 44,
    svgY: 81,
    color: "#94a3b8",
  },
  {
    id: "fibula",
    name: "Fibula",
    system: "skeletal",
    pdbId: "1CAG",
    description: "Lateral leg bone",
    function: "Lateral stability; muscle attachment; ankle joint",
    svgX: 46,
    svgY: 82,
    color: "#94a3b8",
  },

  // Muscular
  {
    id: "cardiac-m",
    name: "Cardiac Muscle",
    system: "muscular",
    pdbId: "2MYS",
    description: "Involuntary striated heart muscle",
    function: "Contracts rhythmically; involuntary; fatigue-resistant",
    svgX: 46,
    svgY: 33,
    color: "#ef4444",
  },
  {
    id: "diaphragm",
    name: "Diaphragm",
    system: "muscular",
    pdbId: "2MYS",
    description: "Primary breathing muscle",
    function: "Contracts to expand lungs; primary respiratory muscle",
    svgX: 50,
    svgY: 36,
    color: "#f97316",
  },
  {
    id: "bicep",
    name: "Biceps Brachii",
    system: "muscular",
    pdbId: "1ATN",
    description: "Upper arm flexor",
    function: "Flexes elbow; supinates forearm; shoulder stabiliser",
    svgX: 34,
    svgY: 37,
    color: "#f59e0b",
  },
  {
    id: "quad",
    name: "Quadriceps",
    system: "muscular",
    pdbId: "1ATN",
    description: "Anterior thigh muscle group",
    function: "Extends knee; essential for walking, running, jumping",
    svgX: 44,
    svgY: 68,
    color: "#f59e0b",
  },
  {
    id: "gastro",
    name: "Gastrocnemius",
    system: "muscular",
    pdbId: "2MYS",
    description: "Calf muscle",
    function: "Plantar flexion; pushes off in walking; raises heel",
    svgX: 44,
    svgY: 85,
    color: "#f59e0b",
  },
  {
    id: "actin-s",
    name: "Actin (Skeletal)",
    system: "muscular",
    pdbId: "1ATN",
    description: "Thin filament of sarcomere",
    function: "Slides against myosin during contraction to shorten muscle",
    svgX: 38,
    svgY: 50,
    color: "#ec4899",
  },

  // Cellular
  {
    id: "hemoglobin",
    name: "Hemoglobin",
    system: "cellular",
    pdbId: "1GZX",
    description: "O₂ carrying protein in RBCs",
    function: "Carries 4 O₂ molecules; heme iron binds/releases O₂",
    svgX: 50,
    svgY: 30,
    color: "#ef4444",
  },
  {
    id: "myosin-c",
    name: "Myosin",
    system: "cellular",
    pdbId: "2MYS",
    description: "Motor protein for movement",
    function: "Uses ATP to walk along actin filaments; produces force",
    svgX: 40,
    svgY: 55,
    color: "#f97316",
  },
  {
    id: "collagen-c",
    name: "Collagen",
    system: "cellular",
    pdbId: "1CAG",
    description: "Most abundant structural protein",
    function: "Triple helix providing tensile strength to bones, skin, tendons",
    svgX: 60,
    svgY: 55,
    color: "#94a3b8",
  },
  {
    id: "insulin-c",
    name: "Insulin",
    system: "cellular",
    pdbId: "1MSO",
    description: "Pancreatic hormone",
    function:
      "Signals cells to take up glucose; 2-chain structure linked by disulfide bonds",
    svgX: 54,
    svgY: 42,
    color: "#ec4899",
  },
  {
    id: "albumin-c",
    name: "Albumin",
    system: "cellular",
    pdbId: "1AO6",
    description: "Most abundant blood plasma protein",
    function:
      "Transports fatty acids, hormones, drugs; maintains osmotic pressure",
    svgX: 46,
    svgY: 40,
    color: "#06b6d4",
  },
  {
    id: "lysozyme-c",
    name: "Lysozyme",
    system: "cellular",
    pdbId: "2LYZ",
    description: "Antimicrobial enzyme",
    function: "Cleaves bacterial peptidoglycan; first line of immune defense",
    svgX: 50,
    svgY: 20,
    color: "#10b981",
  },
  {
    id: "dna-c",
    name: "DNA Double Helix",
    system: "cellular",
    pdbId: "1BNA",
    description: "Genetic material",
    function:
      "Encodes all hereditary information; 3 billion base pairs in human genome",
    svgX: 50,
    svgY: 45,
    color: "#3b82f6",
  },
  {
    id: "ribosome-c",
    name: "Ribosome",
    system: "cellular",
    pdbId: "4V9D",
    description: "Protein synthesis machine",
    function: "Translates mRNA to proteins; 2 subunits (~80S in eukaryotes)",
    svgX: 50,
    svgY: 48,
    color: "#8b5cf6",
  },
];

const SYSTEM_TABS = [
  { value: "organ", label: "Organs", emoji: "❤️" },
  { value: "skeletal", label: "Skeletal", emoji: "🦴" },
  { value: "muscular", label: "Muscular", emoji: "💪" },
  { value: "cellular", label: "Cellular", emoji: "🔬" },
  { value: "anatome3d", label: "Full Body 3D", emoji: "🧬" },
];

const ORGAN_LABELS: Record<string, { bonds: string[]; components: string[] }> =
  {
    "1AIK": {
      bonds: [
        "Peptide bonds (N-C backbone)",
        "Disulfide bridges (Cys-Cys)",
        "Hydrogen bonds (helix stabilization)",
        "Ionic bonds (Ca2+ coordination)",
      ],
      components: [
        "Actin-binding domain",
        "Myosin light chain",
        "EF-hand calcium binding",
        "Regulatory domain",
      ],
    },
    "1HHO": {
      bonds: [
        "Fe-O₂ coordination bond",
        "Heme-His proximal bond",
        "Salt bridges (T/R state)",
        "Hydrogen bonds (αβ interface)",
      ],
      components: [
        "Heme group (iron-porphyrin)",
        "α subunit (2 copies)",
        "β subunit (2 copies)",
        "2,3-BPG binding pocket",
      ],
    },
    "1AO6": {
      bonds: [
        "17 disulfide bonds",
        "Hydrophobic packing",
        "Hydrogen bonds (617 residues)",
        "Van der Waals interactions",
      ],
      components: [
        "Domain I (fatty acid binding)",
        "Domain II (drug transport)",
        "Domain III (metal coordination)",
        "N-terminal signal peptide",
      ],
    },
    "1MSO": {
      bonds: [
        "A-chain/B-chain disulfide bonds",
        "C-peptide cleavage site",
        "Zinc hexamer coordination",
        "Receptor binding hydrophobics",
      ],
      components: [
        "A chain (21 residues)",
        "B chain (30 residues)",
        "Zinc coordination (His B10)",
        "Receptor binding site",
      ],
    },
    "2LYZ": {
      bonds: [
        "4 disulfide bonds (Cys-Cys)",
        "Catalytic Asp-Glu bond",
        "Substrate hydrogen bonds",
        "Electrostatic cleft bonds",
      ],
      components: [
        "Active site cleft",
        "N-acetylmuramic acid binding",
        "α domain (helices)",
        "β domain (sheet)",
      ],
    },
    "1Y0F": {
      bonds: [
        "Hydroxyproline cross-links",
        "Lysine-derived cross-links",
        "Glycosidic bonds",
        "Triple helix H-bonds",
      ],
      components: [
        "Collagen alpha-1 chain",
        "Hydroxyproline residues",
        "Mineral nucleation sites",
        "Fibril-forming domains",
      ],
    },
    "1CAG": {
      bonds: [
        "Glycine H-bond (every 3rd)",
        "Proline ring constraints",
        "Hydroxyproline O-H bonds",
        "Inter-chain ladder H-bonds",
      ],
      components: [
        "Gly-Pro-Hyp repeats",
        "Triple helix (3 chains)",
        "N-terminal propeptide",
        "C-terminal telopeptide",
      ],
    },
    "1ATN": {
      bonds: [
        "ATP hydrolysis at P-loop",
        "Actin-actin longitudinal bonds",
        "Actin-myosin interface bonds",
        "Mg2+-ATP chelation",
      ],
      components: [
        "G-actin monomer",
        "F-actin filament",
        "ATP/ADP binding cleft",
        "Myosin binding site",
      ],
    },
    "2MYS": {
      bonds: [
        "Lever arm swing (ATP cycle)",
        "Actin-myosin crossbridge",
        "Mg2+-ATP coordination",
        "Switch I/II hydrogen bonds",
      ],
      components: [
        "S1 head domain",
        "Actin-binding cleft",
        "ATP hydrolysis site",
        "Regulatory light chain",
      ],
    },
  };

export default function HumanAnatomyViewer() {
  const [activeSystem, setActiveSystem] = useState<string>("organ");
  const [selectedItem, setSelectedItem] = useState<AnatomyItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const [showLabels, setShowLabels] = useState(true);

  const systemItems = ANATOMY_ITEMS.filter((a) => a.system === activeSystem);

  const loadPDB = useCallback(
    async (item: AnatomyItem) => {
      if (!viewerRef.current) return;
      setIsLoading(true);
      setLoadError(null);
      setSelectedItem(item);

      try {
        const url = `https://files.rcsb.org/view/${item.pdbId}.pdb`;
        const data = await fetch(url).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.text();
        });

        if (viewerInstanceRef.current) {
          try {
            viewerInstanceRef.current.clear();
          } catch (_) {}
          viewerInstanceRef.current = null;
        }
        viewerRef.current.innerHTML = "";

        const $3Dmol = (window as any).$3Dmol;
        const v = $3Dmol.createViewer(viewerRef.current, {
          backgroundColor: "#0a150a",
        });
        v.addModel(data, "pdb");
        v.setStyle({}, { cartoon: { color: item.color || "spectrum" } });
        v.zoomTo();
        v.render();
        viewerInstanceRef.current = v;

        // Add labels if enabled
        if (showLabels) {
          const model = v.getModel();
          const labelData = ORGAN_LABELS[item.pdbId];
          if (model && labelData) {
            const labelColors = [
              "#ef4444",
              "#3b82f6",
              "#f59e0b",
              "#10b981",
              "#8b5cf6",
              "#ec4899",
            ];
            const selectors = [
              { atom: "CA", resi: [1, 5] },
              { atom: "N", resi: [10, 15] },
              { atom: "O", resi: [20, 25] },
              { atom: "CB", resi: [30, 35] },
            ];
            [...labelData.bonds, ...labelData.components].forEach(
              (text, idx) => {
                try {
                  const sel = selectors[idx % selectors.length];
                  const atoms: any[] = model.selectedAtoms(sel);
                  if (!atoms || atoms.length === 0) return;
                  const atom = atoms[0];
                  v.addLabel(text, {
                    position: { x: atom.x, y: atom.y, z: atom.z },
                    backgroundColor: labelColors[idx % labelColors.length],
                    backgroundOpacity: 0.82,
                    fontColor: "white",
                    fontSize: 10,
                    showLine: true,
                    lineColor: labelColors[idx % labelColors.length],
                    lineWidth: 1.2,
                    inFront: false,
                  });
                } catch (_) {}
              },
            );
            v.render();
          }
        }
      } catch (err: any) {
        setLoadError(`Could not load structure: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showLabels],
  );

  // Load default structure on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    const defaultItem = ANATOMY_ITEMS.find((a) => a.id === "heart");
    if (defaultItem) loadPDB(defaultItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex-1 flex overflow-hidden"
      style={{ background: "oklch(0.12 0.032 145)" }}
    >
      {/* Left: Body map + item list */}
      <div
        className="w-80 shrink-0 border-r flex flex-col"
        style={{
          borderColor: "oklch(0.24 0.024 145)",
          background: "oklch(0.14 0.028 145)",
        }}
      >
        {/* System tabs */}
        <div
          className="p-3 border-b"
          style={{ borderColor: "oklch(0.24 0.024 145)" }}
        >
          <Tabs value={activeSystem} onValueChange={setActiveSystem}>
            <TabsList className="w-full bg-transparent gap-1 h-auto flex flex-wrap p-0">
              {SYSTEM_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 h-8 text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-ocid={`anatomy.${tab.value}.tab`}
                >
                  {tab.emoji} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* SVG Body outline */}
        <div className="relative mx-auto" style={{ width: 160, height: 300 }}>
          <svg
            viewBox="0 0 100 200"
            width="160"
            height="300"
            className="absolute inset-0"
            aria-label="Human body anatomy diagram"
            role="img"
          >
            <title>Human body anatomy diagram</title>
            {/* Body silhouette */}
            <ellipse
              cx="50"
              cy="12"
              rx="9"
              ry="11"
              fill="none"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="1.2"
            />
            <rect
              x="41"
              y="22"
              width="18"
              height="4"
              rx="2"
              fill="none"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="1"
            />
            <rect
              x="36"
              y="26"
              width="28"
              height="36"
              rx="4"
              fill="none"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="1.2"
            />
            <rect
              x="36"
              y="62"
              width="28"
              height="28"
              rx="3"
              fill="none"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="1.2"
            />
            {/* Arms */}
            <line
              x1="36"
              y1="28"
              x2="25"
              y2="50"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="25"
              y1="50"
              x2="20"
              y2="70"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line
              x1="64"
              y1="28"
              x2="75"
              y2="50"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="75"
              y1="50"
              x2="80"
              y2="70"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Legs */}
            <line
              x1="44"
              y1="90"
              x2="42"
              y2="140"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <line
              x1="42"
              y1="140"
              x2="41"
              y2="175"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="56"
              y1="90"
              x2="58"
              y2="140"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <line
              x1="58"
              y1="140"
              x2="59"
              y2="175"
              stroke="oklch(0.35 0.03 145)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Dot markers for system items */}
            {systemItems.map((item) => (
              <g
                key={item.id}
                onClick={() => loadPDB(item)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") loadPDB(item);
                }}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={item.svgX}
                  cy={item.svgY * 1.95}
                  r={selectedItem?.id === item.id ? 4.5 : 3.5}
                  fill={item.color}
                  opacity={selectedItem?.id === item.id ? 1 : 0.7}
                  stroke={selectedItem?.id === item.id ? "white" : "none"}
                  strokeWidth="1"
                />
                {selectedItem?.id === item.id && (
                  <circle
                    cx={item.svgX}
                    cy={item.svgY * 1.95}
                    r="8"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="1"
                    opacity="0.5"
                  />
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-auto p-2">
          <div className="flex flex-col gap-1">
            {systemItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className="w-full text-left rounded-lg px-3 py-2 transition-all text-xs"
                style={{
                  background:
                    selectedItem?.id === item.id
                      ? `${item.color}20`
                      : "transparent",
                  border: `1px solid ${selectedItem?.id === item.id ? `${item.color}50` : "transparent"}`,
                  color:
                    selectedItem?.id === item.id
                      ? "oklch(0.93 0.018 145)"
                      : "oklch(0.7 0.04 145)",
                }}
                onClick={() => loadPDB(item)}
                data-ocid={`anatomy.list.item.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="font-medium truncate">{item.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: 3D Viewer */}
      {activeSystem === "anatome3d" ? (
        <div className="flex-1 overflow-hidden">
          <Anatome3DViewer />
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          {selectedItem && (
            <div
              className="shrink-0 px-4 py-2.5 border-b flex items-center justify-between"
              style={{
                borderColor: "oklch(0.24 0.024 145)",
                background: "oklch(0.13 0.03 145)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: selectedItem.color }}
                />
                <span
                  className="font-semibold text-sm"
                  style={{ color: "oklch(0.93 0.018 145)" }}
                >
                  {selectedItem.name}
                </span>
                <Badge
                  className="text-[10px] font-mono"
                  style={{
                    background: `${selectedItem.color}20`,
                    color: selectedItem.color,
                    borderColor: `${selectedItem.color}40`,
                  }}
                  variant="outline"
                >
                  PDB: {selectedItem.pdbId}
                </Badge>
              </div>
              <button
                type="button"
                className="text-xs px-3 py-1 rounded-lg transition-colors"
                style={{
                  background: showLabels
                    ? "oklch(0.73 0.18 192 / 0.2)"
                    : "oklch(0.18 0.02 145)",
                  color: showLabels
                    ? "oklch(0.73 0.18 192)"
                    : "oklch(0.6 0.04 145)",
                  border: `1px solid ${showLabels ? "oklch(0.73 0.18 192 / 0.4)" : "oklch(0.24 0.024 145)"}`,
                }}
                onClick={() => {
                  const next = !showLabels;
                  setShowLabels(next);
                  if (selectedItem) loadPDB(selectedItem);
                }}
                data-ocid="anatomy.labels.toggle"
              >
                🏷️ {showLabels ? "Labels ON" : "Labels OFF"}
              </button>
            </div>
          )}

          {/* 3D Viewer canvas */}
          <div className="flex-1 relative" style={{ background: "#0a150a" }}>
            <div
              ref={viewerRef}
              style={{ width: "100%", height: "100%" }}
              data-ocid="anatomy.viewer.canvas_target"
            />

            {/* Loading */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
                  style={{ background: "rgba(10,21,10,0.85)" }}
                  data-ocid="anatomy.viewer.loading_state"
                >
                  <Loader2
                    className="w-10 h-10 animate-spin"
                    style={{ color: "oklch(0.73 0.18 192)" }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.93 0.018 145)" }}
                  >
                    Loading {selectedItem?.name}…
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.6 0.05 145)" }}
                  >
                    PDB: {selectedItem?.pdbId}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {loadError && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-4 py-2 rounded-lg"
                  style={{
                    background: "oklch(0.577 0.245 27.325 / 0.2)",
                    border: "1px solid oklch(0.577 0.245 27.325 / 0.4)",
                    color: "oklch(0.93 0.018 145)",
                  }}
                  data-ocid="anatomy.viewer.error_state"
                >
                  {loadError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info overlay (when structure loaded) */}
            {selectedItem && !isLoading && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-3 right-3 w-64 rounded-xl border overflow-hidden z-10"
                style={{
                  background: "rgba(10,21,10,0.9)",
                  borderColor: "oklch(0.24 0.024 145)",
                }}
              >
                <div
                  className="px-3 py-2 border-b"
                  style={{
                    borderColor: "oklch(0.24 0.024 145)",
                    background: `${selectedItem.color}18`,
                  }}
                >
                  <p
                    className="text-[10px] uppercase tracking-widest font-bold"
                    style={{ color: selectedItem.color }}
                  >
                    {selectedItem.name}
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: "oklch(0.7 0.04 145)" }}
                  >
                    {selectedItem.description}
                  </p>
                </div>
                <div className="px-3 py-2">
                  <p
                    className="text-[10px] uppercase tracking-wider mb-1"
                    style={{ color: "oklch(0.55 0.04 145)" }}
                  >
                    Function
                  </p>
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: "oklch(0.82 0.018 145)" }}
                  >
                    {selectedItem.function}
                  </p>
                </div>

                {ORGAN_LABELS[selectedItem.pdbId] && (
                  <>
                    <div className="px-3 pb-1 pt-0">
                      <p
                        className="text-[10px] uppercase tracking-wider mb-1.5"
                        style={{ color: "oklch(0.55 0.04 145)" }}
                      >
                        Molecular Bonds
                      </p>
                      <div className="flex flex-col gap-1">
                        {ORGAN_LABELS[selectedItem.pdbId].bonds.map((b) => (
                          <div key={b} className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: selectedItem.color }}
                            />
                            <span
                              className="text-[10px]"
                              style={{ color: "oklch(0.75 0.02 145)" }}
                            >
                              {b}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-3 pb-2">
                      <p
                        className="text-[10px] uppercase tracking-wider mb-1.5 mt-1"
                        style={{ color: "oklch(0.55 0.04 145)" }}
                      >
                        Key Components
                      </p>
                      <div className="flex flex-col gap-1">
                        {ORGAN_LABELS[selectedItem.pdbId].components.map(
                          (c) => (
                            <div key={c} className="flex items-center gap-1.5">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: "oklch(0.73 0.18 192)" }}
                              />
                              <span
                                className="text-[10px]"
                                style={{ color: "oklch(0.75 0.02 145)" }}
                              >
                                {c}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
