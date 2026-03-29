import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dna, FlaskConical } from "lucide-react";
import { motion } from "motion/react";

interface MolecularPageProps {
  onNavigate: (path: string) => void;
}

const MOLECULAR_STRUCTURES = [
  {
    pdbId: "1BNA",
    name: "B-DNA Dodecamer",
    description:
      "Classic B-form double helix — the iconic Watson-Crick structure with 12 base pairs.",
    category: "DNA & RNA",
    emoji: "🧬",
  },
  {
    pdbId: "6TNA",
    name: "Transfer RNA",
    description:
      "Phenylalanine tRNA — the adapter molecule linking codons to amino acids.",
    category: "DNA & RNA",
    emoji: "🔬",
  },
  {
    pdbId: "1GZX",
    name: "Hemoglobin",
    description:
      "Oxygen transport protein — 4 subunits each carrying an iron-containing heme group.",
    category: "Proteins",
    emoji: "🩸",
  },
  {
    pdbId: "4INS",
    name: "Insulin",
    description:
      "Glucose metabolism hormone — a small peptide that unlocks cells for sugar uptake.",
    category: "Hormones",
    emoji: "💉",
  },
  {
    pdbId: "1LYZ",
    name: "Lysozyme",
    description:
      "Antibacterial enzyme found in tears and saliva — destroys bacterial cell walls.",
    category: "Proteins",
    emoji: "🦠",
  },
  {
    pdbId: "6VXX",
    name: "SARS-CoV-2 Spike",
    description:
      "COVID-19 spike glycoprotein — the protein that binds to human ACE2 receptors.",
    category: "Viruses",
    emoji: "🦠",
  },
  {
    pdbId: "4V9D",
    name: "70S Ribosome",
    description:
      "Complete ribosome — the cell's protein manufacturing machine with 50S and 30S subunits.",
    category: "Ribosomes",
    emoji: "⚙️",
  },
  {
    pdbId: "1IGT",
    name: "IgG Antibody",
    description:
      "Full immunoglobulin G — Y-shaped immune protein that recognizes foreign antigens.",
    category: "Antibodies",
    emoji: "🛡️",
  },
  {
    pdbId: "1ATP",
    name: "Protein Kinase",
    description:
      "cAMP-dependent kinase — transfers phosphate groups to regulate cell signaling.",
    category: "Enzymes",
    emoji: "⚡",
  },
  {
    pdbId: "1KPK",
    name: "Aquaporin",
    description:
      "Water channel protein — allows rapid water transport across cell membranes.",
    category: "Membrane",
    emoji: "💧",
  },
  {
    pdbId: "1CAG",
    name: "Collagen Triple Helix",
    description:
      "Structural collagen — the most abundant protein in the human body, forming connective tissue.",
    category: "Structural",
    emoji: "🦴",
  },
  {
    pdbId: "1UBQ",
    name: "Ubiquitin",
    description:
      "Protein degradation tag — marks damaged proteins for destruction by the proteasome.",
    category: "Signaling",
    emoji: "🏷️",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "DNA & RNA": "oklch(0.73 0.18 192)",
  Proteins: "oklch(0.65 0.18 145)",
  Hormones: "oklch(0.74 0.14 80)",
  Viruses: "oklch(0.62 0.22 25)",
  Ribosomes: "oklch(0.68 0.20 110)",
  Antibodies: "oklch(0.60 0.22 165)",
  Enzymes: "oklch(0.70 0.16 55)",
  Membrane: "oklch(0.65 0.19 280)",
  Structural: "oklch(0.67 0.15 210)",
  Signaling: "oklch(0.72 0.17 320)",
};

export default function MolecularPage({ onNavigate }: MolecularPageProps) {
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
            "linear-gradient(135deg, oklch(0.15 0.04 165) 0%, oklch(0.12 0.032 145) 100%)",
          borderBottom: "1px solid oklch(0.22 0.024 145)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 80% 50%, oklch(0.73 0.18 192 / 0.08) 0%, transparent 70%)",
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
                background: "oklch(0.73 0.18 192 / 0.15)",
                border: "1px solid oklch(0.73 0.18 192 / 0.3)",
              }}
            >
              <Dna
                className="w-6 h-6"
                style={{ color: "oklch(0.73 0.18 192)" }}
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
                Molecular Structures
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: "oklch(0.6 0.05 145)" }}
              >
                DNA, proteins, enzymes, viruses &amp; more — all rendered in
                real-time 3D
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-4">
            {[
              "DNA & RNA",
              "Proteins",
              "Enzymes",
              "Viruses",
              "Ribosomes",
              "Antibodies",
            ].map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: `${CATEGORY_COLORS[cat] ?? "oklch(0.73 0.18 192)"}60`,
                  color: CATEGORY_COLORS[cat] ?? "oklch(0.73 0.18 192)",
                }}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOLECULAR_STRUCTURES.map((s, i) => {
            const color = CATEGORY_COLORS[s.category] ?? "oklch(0.73 0.18 192)";
            return (
              <motion.div
                key={s.pdbId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="rounded-xl border p-4 flex flex-col gap-3 group cursor-pointer hover:border-opacity-60 transition-all"
                style={{
                  background: "oklch(0.155 0.028 145)",
                  borderColor: "oklch(0.24 0.024 145)",
                }}
                data-ocid={`molecular.item.${i + 1}`}
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
                    {s.category}
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
                    data-ocid={`molecular.view_button.${i + 1}`}
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
