import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlaskConical, Microscope } from "lucide-react";
import { motion } from "motion/react";

interface BacteriaPageProps {
  onNavigate: (path: string) => void;
}

const BACTERIA_STRUCTURES = [
  {
    pdbId: "1LYZ",
    name: "Lysozyme Target",
    description:
      "The enzyme that destroys bacterial cell walls — key to understanding antibiotics.",
    class: "Cell Wall",
    emoji: "🧫",
  },
  {
    pdbId: "1HIV",
    name: "HIV Protease",
    description:
      "Retroviral protease that cleaves proteins — critical drug target for antiretrovirals.",
    class: "Viral",
    emoji: "🦠",
  },
  {
    pdbId: "1IBM",
    name: "30S Ribosomal Subunit",
    description:
      "Bacterial ribosome target for aminoglycoside and tetracycline antibiotics.",
    class: "Ribosome",
    emoji: "⚙️",
  },
  {
    pdbId: "1FFK",
    name: "50S Ribosomal Subunit",
    description:
      "Large ribosomal subunit — target for macrolide and chloramphenicol antibiotics.",
    class: "Ribosome",
    emoji: "⚙️",
  },
  {
    pdbId: "2OAU",
    name: "Bacteriorhodopsin",
    description:
      "Light-driven proton pump in Halobacterium — converts light to chemical energy.",
    class: "Membrane",
    emoji: "🔆",
  },
  {
    pdbId: "1CSE",
    name: "Subtilisin (Serine Protease)",
    description:
      "Bacterial serine protease widely studied as model enzyme and industrial catalyst.",
    class: "Enzyme",
    emoji: "⚡",
  },
  {
    pdbId: "1TIM",
    name: "Triosephosphate Isomerase",
    description:
      "Glycolytic enzyme found in nearly all living organisms including E. coli.",
    class: "Metabolism",
    emoji: "🔄",
  },
  {
    pdbId: "1UBQ",
    name: "Ubiquitin-like Protein",
    description: "Small protein modifiers found across bacteria and archaea.",
    class: "Signaling",
    emoji: "🏷️",
  },
];

const CLASS_COLORS: Record<string, string> = {
  "Cell Wall": "oklch(0.65 0.18 145)",
  Viral: "oklch(0.62 0.22 25)",
  Ribosome: "oklch(0.73 0.18 192)",
  Membrane: "oklch(0.65 0.19 280)",
  Enzyme: "oklch(0.70 0.16 55)",
  Metabolism: "oklch(0.68 0.20 110)",
  Signaling: "oklch(0.72 0.17 320)",
};

export default function BacteriaPage({ onNavigate }: BacteriaPageProps) {
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
            "linear-gradient(135deg, oklch(0.13 0.035 160) 0%, oklch(0.12 0.032 145) 100%)",
          borderBottom: "1px solid oklch(0.22 0.024 145)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 80% 70%, oklch(0.62 0.22 25 / 0.08) 0%, transparent 70%)",
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
                background: "oklch(0.62 0.22 25 / 0.15)",
                border: "1px solid oklch(0.62 0.22 25 / 0.3)",
              }}
            >
              <Microscope
                className="w-6 h-6"
                style={{ color: "oklch(0.62 0.22 25)" }}
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
                Bacteria & Microbes
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: "oklch(0.6 0.05 145)" }}
              >
                Bacterial proteins, ribosomes, membrane channels &amp;
                antibiotic targets
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-4">
            {["Cell Wall", "Ribosome", "Enzyme", "Membrane", "Viral"].map(
              (cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: `${CLASS_COLORS[cat] ?? "oklch(0.73 0.18 192)"}60`,
                    color: CLASS_COLORS[cat] ?? "oklch(0.73 0.18 192)",
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
          {BACTERIA_STRUCTURES.map((s, i) => {
            const color = CLASS_COLORS[s.class] ?? "oklch(0.73 0.18 192)";
            return (
              <motion.div
                key={`${s.pdbId}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="rounded-xl border p-4 flex flex-col gap-3"
                style={{
                  background: "oklch(0.155 0.028 145)",
                  borderColor: "oklch(0.24 0.024 145)",
                }}
                data-ocid={`bacteria.item.${i + 1}`}
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
                    {s.class}
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
                    data-ocid={`bacteria.view_button.${i + 1}`}
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
