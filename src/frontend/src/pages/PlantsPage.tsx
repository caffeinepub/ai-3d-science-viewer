import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlaskConical, Leaf } from "lucide-react";
import { motion } from "motion/react";

interface PlantsPageProps {
  onNavigate: (path: string) => void;
}

const PLANT_STRUCTURES = [
  {
    pdbId: "1CRN",
    name: "Crambin",
    description:
      "Small plant seed storage protein from cabbage — one of the most refined protein structures.",
    part: "Seed",
    emoji: "🌱",
  },
  {
    pdbId: "1RBO",
    name: "RuBisCO (Large)",
    description:
      "The world's most abundant enzyme — fixes CO₂ in the Calvin cycle of photosynthesis.",
    part: "Chloroplast",
    emoji: "🍃",
  },
  {
    pdbId: "2POR",
    name: "Porin Channel",
    description:
      "Plant cell wall pore protein allowing selective transport across outer membranes.",
    part: "Cell Wall",
    emoji: "🔬",
  },
  {
    pdbId: "1ATN",
    name: "Actin (Cytoskeleton)",
    description:
      "Structural filament protein — forms the scaffold that maintains plant cell shape.",
    part: "Cytoskeleton",
    emoji: "🕸️",
  },
  {
    pdbId: "1CGD",
    name: "Collagen-like Peptide",
    description:
      "Plant structural protein forming rigid fibrous networks in cell walls.",
    part: "Cell Wall",
    emoji: "🦴",
  },
  {
    pdbId: "2LYZ",
    name: "Plant Lysozyme",
    description:
      "Defense enzyme that degrades bacterial cell walls — part of plant innate immunity.",
    part: "Defense",
    emoji: "🛡️",
  },
  {
    pdbId: "1GFL",
    name: "GFP (Fluorescent)",
    description:
      "Green fluorescent protein used as a plant biology research tool.",
    part: "Research",
    emoji: "💚",
  },
  {
    pdbId: "1CDW",
    name: "Calmodulin",
    description:
      "Calcium signal transducer present in all plant cells — triggers stress responses.",
    part: "Signaling",
    emoji: "📡",
  },
];

const PART_COLORS: Record<string, string> = {
  Seed: "oklch(0.74 0.14 80)",
  Chloroplast: "oklch(0.65 0.18 145)",
  "Cell Wall": "oklch(0.68 0.20 110)",
  Cytoskeleton: "oklch(0.73 0.18 192)",
  Defense: "oklch(0.62 0.22 25)",
  Research: "oklch(0.60 0.22 165)",
  Signaling: "oklch(0.72 0.17 320)",
};

export default function PlantsPage({ onNavigate }: PlantsPageProps) {
  return (
    <div
      className="flex-1 overflow-auto"
      style={{ background: "oklch(0.12 0.032 145)" }}
    >
      {/* Hero */}
      <div
        className="px-8 py-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.04 145) 0%, oklch(0.12 0.032 145) 100%)",
          borderBottom: "1px solid oklch(0.22 0.024 145)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 70% 30%, oklch(0.65 0.18 145 / 0.1) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "oklch(0.65 0.18 145 / 0.15)",
                border: "1px solid oklch(0.65 0.18 145 / 0.3)",
              }}
            >
              <Leaf
                className="w-6 h-6"
                style={{ color: "oklch(0.65 0.18 145)" }}
              />
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: "oklch(0.93 0.018 145)",
                }}
              >
                Plant Biology
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: "oklch(0.6 0.05 145)" }}
              >
                Photosynthesis proteins, cell wall structures, and plant defense
                molecules
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-4">
            {["Chloroplast", "Cell Wall", "Defense", "Signaling", "Seed"].map(
              (cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: `${PART_COLORS[cat] ?? "oklch(0.65 0.18 145)"}60`,
                    color: PART_COLORS[cat] ?? "oklch(0.65 0.18 145)",
                  }}
                >
                  {cat}
                </Badge>
              ),
            )}
          </div>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PLANT_STRUCTURES.map((s, i) => {
            const color = PART_COLORS[s.part] ?? "oklch(0.65 0.18 145)";
            return (
              <motion.div
                key={s.pdbId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="rounded-xl border p-4 flex flex-col gap-3"
                style={{
                  background: "oklch(0.155 0.028 145)",
                  borderColor: "oklch(0.24 0.024 145)",
                }}
                data-ocid={`plants.item.${i + 1}`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${color}18` }}
                  >
                    {s.emoji}
                  </div>
                  <Badge
                    className="text-[10px] font-mono"
                    style={{
                      background: `${color}20`,
                      color,
                      borderColor: `${color}40`,
                    }}
                    variant="outline"
                  >
                    {s.pdbId}
                  </Badge>
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "oklch(0.93 0.018 145)" }}
                  >
                    {s.name}
                  </p>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: "oklch(0.6 0.05 145)" }}
                  >
                    {s.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-1">
                  <Badge
                    variant="outline"
                    className="text-[10px]"
                    style={{ borderColor: `${color}40`, color }}
                  >
                    {s.part}
                  </Badge>
                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs"
                    style={{
                      background: `${color}20`,
                      color,
                      border: `1px solid ${color}40`,
                    }}
                    onClick={() => onNavigate(`#/structure/${s.pdbId}`)}
                    data-ocid={`plants.view_button.${i + 1}`}
                  >
                    <FlaskConical className="w-3 h-3 mr-1" />
                    View 3D
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
