import HumanAnatomyViewer from "@/components/HumanAnatomyViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ANATOMY_ID,
  LABEL_DEFS,
  type RenderStyle,
  STRUCTURES,
  STYLE_COLORS,
  type Structure,
  getCategoryRoute,
  getStructureFacts,
} from "@/data/structures";
import {
  ArrowLeft,
  Calendar,
  FlaskConical,
  Layers,
  Loader2,
  Tag,
  Weight,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface StructureDetailPageProps {
  pdbId: string;
  isSmartBoard: boolean;
  onNavigate: (path: string) => void;
}

export default function StructureDetailPage({
  pdbId,
  isSmartBoard,
  onNavigate,
}: StructureDetailPageProps) {
  const structure: Structure | undefined = STRUCTURES.find(
    (s) => s.pdbId === pdbId,
  );
  const facts = getStructureFacts(pdbId);
  const isAnatomy = pdbId === ANATOMY_ID;

  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(!isAnatomy);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [renderStyle, setRenderStyle] = useState<RenderStyle>("cartoon");
  const [showLabels, setShowLabels] = useState(false);

  const applyStyle = useCallback((v: any, style: RenderStyle) => {
    if (!v) return;
    v.setStyle({}, {});
    switch (style) {
      case "cartoon":
        v.setStyle({}, { cartoon: { color: "spectrum" } });
        break;
      case "stick":
        v.setStyle({}, { stick: { colorscheme: "greenCarbon" } });
        break;
      case "sphere":
        v.setStyle({}, { sphere: { colorscheme: "yellowCarbon", scale: 0.4 } });
        break;
      case "surface":
        v.setStyle({}, { cartoon: { color: "spectrum", opacity: 0.3 } });
        v.addSurface((window as any).$3Dmol.SurfaceType.MS, {
          opacity: 0.65,
          colorscheme: "whiteCarbon",
        });
        break;
    }
    v.render();
  }, []);

  const addLabelsToViewer = useCallback(
    (v: any, model: any, category: string) => {
      if (!v || !model) return;
      const defs = LABEL_DEFS[category] ?? LABEL_DEFS.Proteins;
      for (const def of defs) {
        try {
          const atoms: any[] = model.selectedAtoms(def.selector);
          if (!atoms || atoms.length === 0) continue;
          const atom = atoms[Math.floor(atoms.length / 2)];
          v.addLabel(def.text, {
            position: { x: atom.x, y: atom.y, z: atom.z },
            backgroundColor: def.color,
            backgroundOpacity: 0.85,
            fontColor: "white",
            fontSize: isSmartBoard ? 14 : 11,
            showLine: true,
            lineColor: def.color,
            lineWidth: 1.5,
            lineOpacity: 0.8,
            inFront: false,
          });
        } catch (_) {}
      }
      v.render();
    },
    [isSmartBoard],
  );

  // Load PDB on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only re-runs on pdbId change
  useEffect(() => {
    if (isAnatomy || !viewerContainerRef.current) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    const load = async () => {
      try {
        const url = `https://files.rcsb.org/view/${pdbId}.pdb`;
        const data = await fetch(url).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.text();
        });
        if (cancelled || !viewerContainerRef.current) return;

        if (viewerInstanceRef.current) {
          try {
            viewerInstanceRef.current.clear();
          } catch (_) {}
        }
        viewerContainerRef.current.innerHTML = "";

        const $3Dmol = (window as any).$3Dmol;
        const v = $3Dmol.createViewer(viewerContainerRef.current, {
          backgroundColor: "#080d1a",
        });
        v.addModel(data, "pdb");
        applyStyle(v, renderStyle);
        v.zoomTo();
        v.render();
        viewerInstanceRef.current = v;

        if (showLabels) {
          const model = v.getModel();
          if (model)
            addLabelsToViewer(v, model, structure?.category ?? "Proteins");
        }
      } catch (err: any) {
        if (!cancelled) setLoadError(`Failed to load ${pdbId}: ${err.message}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [pdbId]);

  // Style change
  const handleStyleChange = useCallback(
    (style: RenderStyle) => {
      setRenderStyle(style);
      if (viewerInstanceRef.current)
        applyStyle(viewerInstanceRef.current, style);
    },
    [applyStyle],
  );

  // Labels toggle
  useEffect(() => {
    if (!viewerInstanceRef.current || isAnatomy) return;
    if (showLabels) {
      const model = viewerInstanceRef.current.getModel();
      if (model)
        addLabelsToViewer(
          viewerInstanceRef.current,
          model,
          structure?.category ?? "Proteins",
        );
    } else {
      try {
        viewerInstanceRef.current.removeAllLabels();
      } catch (_) {}
      viewerInstanceRef.current.render();
    }
  }, [showLabels, structure, addLabelsToViewer, isAnatomy]);

  const backRoute = getCategoryRoute(structure?.category ?? "Anatomy");
  const labelDefs =
    LABEL_DEFS[structure?.category ?? ""] ?? LABEL_DEFS.Proteins;

  const viewerHeight = isSmartBoard ? "65vh" : "min(60vh, 520px)";
  const fontSize = isSmartBoard ? "text-base" : "text-sm";
  const btnHeight = isSmartBoard ? "h-10" : "h-7";

  return (
    <div
      className="flex-1 overflow-auto"
      style={{ background: "oklch(0.12 0.032 145)" }}
      data-ocid="structure_detail.page"
    >
      {/* Header bar */}
      <div
        className="sticky top-0 z-20 border-b border-border px-4 py-2 flex items-center gap-3"
        style={{ background: "oklch(var(--nav))" }}
      >
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 ${btnHeight} text-muted-foreground hover:text-foreground`}
          onClick={() => onNavigate(backRoute)}
          data-ocid="structure_detail.back.button"
        >
          <ArrowLeft className={isSmartBoard ? "w-5 h-5" : "w-3.5 h-3.5"} />
          Back
        </Button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FlaskConical
            className={`${isSmartBoard ? "w-5 h-5" : "w-4 h-4"} text-primary shrink-0`}
          />
          <h1
            className={`font-bold truncate ${isSmartBoard ? "text-xl" : "text-base"}`}
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "oklch(0.93 0.018 145)",
            }}
          >
            {structure?.name ?? pdbId}
          </h1>
          {structure?.category && (
            <Badge
              variant="outline"
              className="shrink-0 border-border text-muted-foreground"
            >
              {structure.category}
            </Badge>
          )}
          {!isAnatomy && (
            <Badge className="font-mono text-xs shrink-0">{pdbId}</Badge>
          )}
        </div>
      </div>

      {/* 3D Viewer */}
      <div
        className="relative w-full smartboard-viewer"
        style={{
          height: viewerHeight,
          background: "#080d1a",
          minHeight: "400px",
        }}
      >
        {isAnatomy ? (
          <HumanAnatomyViewer />
        ) : (
          <>
            <div
              ref={viewerContainerRef}
              style={{ width: "100%", height: "100%" }}
              data-ocid="structure_detail.canvas_target"
            />
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
                  style={{ background: "rgba(8,13,26,0.85)" }}
                  data-ocid="structure_detail.loading_state"
                >
                  <Loader2
                    className={`${isSmartBoard ? "w-14 h-14" : "w-10 h-10"} text-primary animate-spin`}
                  />
                  <p
                    className={`${isSmartBoard ? "text-lg" : "text-sm"} font-semibold text-foreground`}
                  >
                    Loading {pdbId}…
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {loadError && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-destructive/20 border border-destructive/40 text-destructive-foreground text-xs px-4 py-2 rounded-lg"
                  data-ocid="structure_detail.error_state"
                >
                  {loadError}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Controls bar */}
      {!isAnatomy && (
        <div
          className="border-b border-border px-4 py-2 flex items-center gap-2 flex-wrap"
          style={{ background: "oklch(var(--nav))" }}
        >
          <span
            className={`text-[10px] text-muted-foreground uppercase tracking-wider mr-1 ${isSmartBoard ? "text-xs" : ""}`}
          >
            Style:
          </span>
          {(["cartoon", "stick", "sphere", "surface"] as RenderStyle[]).map(
            (style) => (
              <Button
                key={style}
                size="sm"
                variant={renderStyle === style ? "default" : "outline"}
                className={`${btnHeight} px-3 ${fontSize} capitalize`}
                style={
                  renderStyle === style
                    ? { backgroundColor: STYLE_COLORS[style] }
                    : {}
                }
                onClick={() => handleStyleChange(style)}
                data-ocid={`structure_detail.style_${style}.button`}
              >
                {style}
              </Button>
            ),
          )}
          <span className="text-border mx-1 select-none">|</span>
          <Button
            size="sm"
            variant={showLabels ? "default" : "outline"}
            className={`${btnHeight} px-3 ${fontSize} gap-1.5 ${
              showLabels
                ? "bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30"
                : ""
            }`}
            onClick={() => setShowLabels((v) => !v)}
            data-ocid="structure_detail.labels.toggle"
          >
            <Tag className={isSmartBoard ? "w-4 h-4" : "w-3 h-3"} />
            Labels
            {showLabels && (
              <Badge className="ml-0.5 h-4 px-1 text-[9px] bg-green-500/30 text-green-300 border-green-500/40">
                {labelDefs.length}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Detail panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-6 max-w-4xl mx-auto"
      >
        {/* Description */}
        <div className="mb-6">
          <p
            className={`${isSmartBoard ? "text-lg" : "text-sm"} leading-relaxed`}
            style={{ color: "oklch(0.75 0.04 145)" }}
          >
            {structure?.description}. {facts.function}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Calendar, label: "Discovered", value: facts.year },
            { icon: Weight, label: "Molecular Weight", value: facts.weight },
            {
              icon: Layers,
              label: "Category",
              value: structure?.category ?? "Unknown",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl border p-4"
              style={{
                background: "oklch(0.155 0.028 145)",
                borderColor: "oklch(0.24 0.024 145)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className={`${isSmartBoard ? "w-5 h-5" : "w-3.5 h-3.5"} text-primary`}
                />
                <span
                  className={`${isSmartBoard ? "text-sm" : "text-[10px]"} text-muted-foreground uppercase tracking-wider`}
                >
                  {label}
                </span>
              </div>
              <p
                className={`${isSmartBoard ? "text-base" : "text-sm"} font-semibold text-foreground`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Key facts */}
        <div
          className="rounded-xl border p-5"
          style={{
            background: "oklch(0.155 0.028 145)",
            borderColor: "oklch(0.24 0.024 145)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap
              className={`${isSmartBoard ? "w-5 h-5" : "w-4 h-4"} text-primary`}
            />
            <h2
              className={`font-bold ${isSmartBoard ? "text-lg" : "text-sm"}`}
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: "oklch(0.93 0.018 145)",
              }}
            >
              Key Scientific Facts
            </h2>
          </div>
          <ul className="flex flex-col gap-3">
            {facts.facts.map((fact, i) => (
              <li
                key={fact.slice(0, 30)}
                className={`flex items-start gap-3 ${isSmartBoard ? "text-base" : "text-sm"}`}
                style={{ color: "oklch(0.75 0.04 145)" }}
              >
                <span
                  className={`${isSmartBoard ? "w-6 h-6 text-sm" : "w-5 h-5 text-xs"} rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 mt-0.5`}
                >
                  {i + 1}
                </span>
                {fact}
              </li>
            ))}
          </ul>
        </div>

        {/* Label definitions (when applicable) */}
        {!isAnatomy && (
          <div
            className="rounded-xl border p-5 mt-4"
            style={{
              background: "oklch(0.155 0.028 145)",
              borderColor: "oklch(0.24 0.024 145)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag
                className={`${isSmartBoard ? "w-5 h-5" : "w-4 h-4"} text-green-400`}
              />
              <h2
                className={`font-bold ${isSmartBoard ? "text-lg" : "text-sm"}`}
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: "oklch(0.93 0.018 145)",
                }}
              >
                Structural Components
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {labelDefs.map((def) => (
                <span
                  key={def.text}
                  className={`${isSmartBoard ? "text-sm px-3 py-1" : "text-xs px-2 py-0.5"} rounded-full font-medium`}
                  style={{
                    background: `${def.color}20`,
                    color: def.color,
                    border: `1px solid ${def.color}40`,
                  }}
                >
                  {def.text}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer attribution */}
        <footer className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
