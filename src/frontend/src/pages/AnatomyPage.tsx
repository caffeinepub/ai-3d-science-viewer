import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { motion } from "motion/react";

interface AnatomyPageProps {
  onNavigate: (path: string) => void;
}

const ANATOMY_HIGHLIGHTS = [
  {
    emoji: "🧠",
    name: "Brain",
    desc: "100 billion neurons, 86 billion non-neural cells. Consumes 20% of body energy.",
    system: "Nervous",
  },
  {
    emoji: "❤️",
    name: "Heart",
    desc: "Beats ~100,000 times/day. Pumps 5–6 liters of blood per minute at rest.",
    system: "Circulatory",
  },
  {
    emoji: "🫁",
    name: "Lungs",
    desc: "370 million alveoli with total surface area of ~70 m². Inhale 500 mL per breath.",
    system: "Respiratory",
  },
  {
    emoji: "🫀",
    name: "Liver",
    desc: "Over 500 functions including detox, bile production, and protein synthesis.",
    system: "Digestive",
  },
  {
    emoji: "🦷",
    name: "Skeletal System",
    desc: "206 bones providing structure, protection, and mineral storage. Marrow produces blood cells.",
    system: "Skeletal",
  },
  {
    emoji: "💪",
    name: "Muscles",
    desc: "~640 named muscles making up 40% of body weight. Enable all voluntary movement.",
    system: "Muscular",
  },
  {
    emoji: "🩺",
    name: "Kidneys",
    desc: "Filter 200 liters of blood daily, producing 1–2 liters of urine. Balance electrolytes.",
    system: "Urinary",
  },
  {
    emoji: "🛡️",
    name: "Immune System",
    desc: "T cells, B cells, NK cells, and antibodies defending against pathogens and cancer.",
    system: "Immune",
  },
];

const SYSTEM_COLORS: Record<string, string> = {
  Nervous: "oklch(0.73 0.18 192)",
  Circulatory: "oklch(0.62 0.22 25)",
  Respiratory: "oklch(0.65 0.18 145)",
  Digestive: "oklch(0.74 0.14 80)",
  Skeletal: "oklch(0.67 0.15 210)",
  Muscular: "oklch(0.68 0.20 110)",
  Urinary: "oklch(0.60 0.22 165)",
  Immune: "oklch(0.65 0.19 280)",
};

export default function AnatomyPage({ onNavigate }: AnatomyPageProps) {
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
            "linear-gradient(135deg, oklch(0.14 0.04 155) 0%, oklch(0.12 0.032 145) 100%)",
          borderBottom: "1px solid oklch(0.22 0.024 145)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 20% 50%, oklch(0.62 0.22 25 / 0.08) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: "oklch(0.62 0.22 25 / 0.15)",
                border: "1px solid oklch(0.62 0.22 25 / 0.3)",
              }}
            >
              🦴
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: "oklch(0.93 0.018 145)",
                }}
              >
                Human Anatomy
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: "oklch(0.6 0.05 145)" }}
              >
                Interactive 3D exploration of bones, organs &amp; organ systems
              </p>
            </div>
          </div>

          <Button
            className="gap-2 px-6 py-3 text-sm font-semibold rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.73 0.18 192) 0%, oklch(0.65 0.18 165) 100%)",
              color: "oklch(0.08 0.01 145)",
              boxShadow: "0 0 24px oklch(0.73 0.18 192 / 0.3)",
            }}
            onClick={() => onNavigate("#/structure/HUMAN_ANATOMY")}
            data-ocid="anatomy.open_viewer.button"
          >
            <Activity className="w-4 h-4" />
            Open 3D Anatomy Viewer
          </Button>
        </motion.div>
      </div>

      {/* Organ system grid */}
      <div className="p-8">
        <h2
          className="text-xl font-bold mb-6"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            color: "oklch(0.93 0.018 145)",
          }}
        >
          Organ Systems Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ANATOMY_HIGHLIGHTS.map((item, i) => {
            const color = SYSTEM_COLORS[item.system] ?? "oklch(0.73 0.18 192)";
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="rounded-xl border p-4 flex flex-col gap-3 cursor-pointer transition-all hover:scale-[1.02]"
                style={{
                  background: "oklch(0.155 0.028 145)",
                  borderColor: "oklch(0.24 0.024 145)",
                }}
                onClick={() => onNavigate("#/structure/HUMAN_ANATOMY")}
                data-ocid={`anatomy.item.${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${color}18` }}
                  >
                    {item.emoji}
                  </div>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: `${color}20`, color }}
                  >
                    {item.system}
                  </span>
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "oklch(0.93 0.018 145)" }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: "oklch(0.6 0.05 145)" }}
                  >
                    {item.desc}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full rounded-lg py-1.5 text-xs font-medium transition-colors"
                  style={{
                    background: `${color}15`,
                    color,
                    border: `1px solid ${color}30`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("#/structure/HUMAN_ANATOMY");
                  }}
                  data-ocid={`anatomy.view_button.${i + 1}`}
                >
                  View in 3D →
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
