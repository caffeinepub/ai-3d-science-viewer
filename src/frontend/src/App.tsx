import HumanAnatomyViewer from "@/components/HumanAnatomyViewer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Atom,
  Bot,
  Dna,
  FlaskConical,
  Home,
  Layers,
  Leaf,
  Loader2,
  LogOut,
  Maximize2,
  Microscope,
  Monitor,
  Search,
  Send,
  Shield,
  Sigma,
  Tag,
  User,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import LoginPage from "./LoginPage";
import {
  ANATOMY_ID,
  CATEGORIES,
  CATEGORY_ICONS,
  type Category,
  LABEL_DEFS,
  type RenderStyle,
  STRUCTURES,
  STYLE_COLORS,
  type Structure,
} from "./data/structures";
import { useAuth } from "./hooks/useAuth";
import { useSmartBoard } from "./hooks/useSmartBoard";
import AnatomyPage from "./pages/AnatomyPage";
import BacteriaPage from "./pages/BacteriaPage";
import HomePage from "./pages/HomePage";
import MolecularPage from "./pages/MolecularPage";
import PlantsPage from "./pages/PlantsPage";
import StructureDetailPage from "./pages/StructureDetailPage";

// ─── Local types ────────────────────────────────────────────────────────────────────
type StructureDetails = Structure;
type ChatMessage = { id: number; role: "user" | "assistant"; text: string };

// ─── AI fuzzy match ─────────────────────────────────────────────────────────────────────
function findStructureByQuery(query: string): Structure | null {
  const q = query.toLowerCase();
  const byId = STRUCTURES.find((s) => s.pdbId.toLowerCase() === q);
  if (byId) return byId;
  return (
    STRUCTURES.find(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.pdbId.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    ) ?? null
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const { user, login, logout } = useAuth();
  const { isSmartBoard, toggleSmartBoard } = useSmartBoard();
  const [route, setRoute] = useState(window.location.hash || "#/");

  // Navigate helper that also updates hash
  const navigate = useCallback((path: string) => {
    window.location.hash = path;
    setRoute(path);
  }, []);

  // Swipe between categories
  const CATEGORY_ROUTES = [
    "#/molecular",
    "#/anatomy",
    "#/plants",
    "#/bacteria",
  ];
  const swipeTouchStart = useRef<number | null>(null);
  const handleSwipeTouchStart = useCallback((e: React.TouchEvent) => {
    swipeTouchStart.current = e.touches[0].clientX;
  }, []);
  const handleSwipeTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (swipeTouchStart.current === null) return;
      const dx = e.changedTouches[0].clientX - swipeTouchStart.current;
      swipeTouchStart.current = null;
      if (Math.abs(dx) < 50) return;
      const idx = CATEGORY_ROUTES.indexOf(route);
      if (idx === -1) return;
      if (dx < 0 && idx < CATEGORY_ROUTES.length - 1)
        navigate(CATEGORY_ROUTES[idx + 1]);
      else if (dx > 0 && idx > 0) navigate(CATEGORY_ROUTES[idx - 1]);
    },
    [route, navigate],
  );

  // Sync route with browser hash
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const activeLabelsRef = useRef<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [renderStyle, setRenderStyle] = useState<RenderStyle>("cartoon");
  const [selectedStructure, setSelectedStructure] =
    useState<StructureDetails | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  // Is the human anatomy diagram active?
  const isAnatomyMode = selectedStructure?.pdbId === ANATOMY_ID;

  // ── Chat state ───────────────────────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: "assistant",
      text: 'Hi! Ask me to show any structure, e.g. "show hemoglobin" or "load DNA" or "human anatomy".',
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // ── Filter catalog ──────────────────────────────────────────────────────────────────
  const filteredStructures = STRUCTURES.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.pdbId.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // ── Label helpers ──────────────────────────────────────────────────────────────────
  const addLabelsToViewer = useCallback(
    (v: any, model: any, category: string) => {
      if (!v || !model) return;
      const defs = LABEL_DEFS[category] ?? LABEL_DEFS.Proteins;
      const newLabels: any[] = [];
      for (const def of defs) {
        try {
          const atoms: any[] = model.selectedAtoms(def.selector);
          if (!atoms || atoms.length === 0) continue;
          const atom = atoms[Math.floor(atoms.length / 2)];
          const label = v.addLabel(def.text, {
            position: { x: atom.x, y: atom.y, z: atom.z },
            backgroundColor: def.color,
            backgroundOpacity: 0.85,
            fontColor: "white",
            fontSize: 11,
            showLine: true,
            lineColor: def.color,
            lineWidth: 1.5,
            lineOpacity: 0.8,
            inFront: false,
          });
          if (label) newLabels.push(label);
        } catch (_) {
          // skip atoms not found in this structure
        }
      }
      activeLabelsRef.current = newLabels;
      v.render();
    },
    [],
  );

  const clearLabels = useCallback((v: any) => {
    if (!v) return;
    try {
      v.removeAllLabels();
    } catch (_) {}
    activeLabelsRef.current = [];
    v.render();
  }, []);

  // ── Apply render style to existing viewer ──────────────────────────────────────────────
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

  // ── Load PDB ──────────────────────────────────────────────────────────────────────────
  const loadStructure = useCallback(
    async (structure: Structure) => {
      // Anatomy mode – just set state, no PDB fetch
      if (structure.pdbId === ANATOMY_ID) {
        setSelectedStructure(structure);
        setLoadError(null);
        // clear any existing 3Dmol viewer
        if (viewerInstanceRef.current) {
          try {
            viewerInstanceRef.current.clear();
          } catch (_) {}
          viewerInstanceRef.current = null;
        }
        if (viewerContainerRef.current)
          viewerContainerRef.current.innerHTML = "";
        activeLabelsRef.current = [];
        return;
      }

      if (!viewerContainerRef.current) return;
      setIsLoading(true);
      setLoadError(null);
      setSelectedStructure(structure);

      try {
        const url = `https://files.rcsb.org/view/${structure.pdbId}.pdb`;
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
        viewerContainerRef.current.innerHTML = "";
        activeLabelsRef.current = [];

        const $3Dmol = (window as any).$3Dmol;
        const v = $3Dmol.createViewer(viewerContainerRef.current, {
          backgroundColor: "#080d1a",
        });
        v.addModel(data, "pdb");
        applyStyle(v, renderStyle);
        v.zoomTo();
        v.render();
        viewerInstanceRef.current = v;

        // Add labels if enabled
        if (showLabels) {
          const model = v.getModel();
          if (model) addLabelsToViewer(v, model, structure.category);
        }
      } catch (err: any) {
        setLoadError(`Failed to load ${structure.pdbId}: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [renderStyle, applyStyle, showLabels, addLabelsToViewer],
  );

  // ── Style change ────────────────────────────────────────────────────────────────────
  const handleStyleChange = useCallback(
    (style: RenderStyle) => {
      setRenderStyle(style);
      if (viewerInstanceRef.current) {
        applyStyle(viewerInstanceRef.current, style);
      }
    },
    [applyStyle],
  );

  // ── Default load ────────────────────────────────────────────────────────────────────
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    // Start with DNA (index 1 now, since anatomy is index 0)
    loadStructure(STRUCTURES[1]);
  }, [loadStructure]);

  // ── Labels toggle effect ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!viewerInstanceRef.current) return;
    if (
      showLabels &&
      selectedStructure &&
      selectedStructure.pdbId !== ANATOMY_ID
    ) {
      const model = viewerInstanceRef.current.getModel();
      if (model)
        addLabelsToViewer(
          viewerInstanceRef.current,
          model,
          selectedStructure.category,
        );
    } else {
      clearLabels(viewerInstanceRef.current);
    }
  }, [showLabels, selectedStructure, addLabelsToViewer, clearLabels]);

  // ── Scroll chat to bottom ─────────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Presentation mode ───────────────────────────────────────────────────────────────────
  const handlePresentation = () => {
    document.documentElement.requestFullscreen().catch(() => {});
  };

  // ── Chat send ───────────────────────────────────────────────────────────────────────────
  const handleChatSend = useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput("");

    const nextId = Date.now();
    const userMsg: ChatMessage = { id: nextId, role: "user", text };
    const match = findStructureByQuery(text);

    let assistantReply: string;
    if (match) {
      loadStructure(match);
      assistantReply =
        match.pdbId === ANATOMY_ID
          ? "Opening the **Human Anatomy** diagram — hover over any label to see bone and organ details!"
          : `Loading **${match.name}** (${match.pdbId}) — ${match.description}. You can see it in the viewer now!`;
    } else {
      assistantReply =
        "I couldn't find that structure. Try categories like DNA & RNA, Proteins, Viruses, Enzymes, Signaling, Membrane, Ribosomes, Antibodies, Structural, Hormones, or 'human anatomy'.";
    }

    setChatMessages((prev) => [
      ...prev,
      userMsg,
      { id: nextId + 1, role: "assistant", text: assistantReply },
    ]);
  }, [chatInput, loadStructure]);

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleChatSend();
  };

  const labelCount = selectedStructure
    ? (LABEL_DEFS[selectedStructure.category] ?? LABEL_DEFS.Proteins).length
    : 5;

  // Show login if not authenticated
  if (!user) {
    const handleLogin = (u: import("./hooks/useAuth").BioUser) => {
      login(u);
      window.location.hash = "#/";
      setRoute("#/");
    };
    return <LoginPage onLogin={handleLogin} />;
  }

  // Category page routing
  // Structure detail routing
  const structureDetailMatch = route.startsWith("#/structure/");
  const structureDetailPdbId = structureDetailMatch
    ? route.replace("#/structure/", "")
    : null;

  const isHomeRoute =
    !structureDetailMatch && (route === "#/" || route === "" || route === "#");
  const isViewerRoute = !structureDetailMatch && route === "#/viewer";

  if (isHomeRoute) {
    return (
      <>
        <HomePage
          user={user}
          onNavigate={navigate}
          onLogout={logout}
          onSearch={(query) => {
            const match = findStructureByQuery(query);
            navigate("#/viewer");
            if (match) setTimeout(() => loadStructure(match), 100);
          }}
        />
        {/* Floating AI Chat */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
          <AnimatePresence>
            {chatOpen && (
              <motion.div
                key="chat-panel-home"
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 16 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="w-[320px] h-[400px] rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden"
                style={{ background: "oklch(var(--card))" }}
                data-ocid="chat.panel"
              >
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0"
                  style={{ background: "oklch(var(--nav))" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      AI Structure Assistant
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setChatOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors rounded p-0.5"
                    data-ocid="chat.close_button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <ScrollArea className="flex-1 px-3 py-2">
                  <div className="flex flex-col gap-2">
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[82%] rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>
                <div className="shrink-0 border-t border-border px-3 py-2 flex gap-2 items-center">
                  <Input
                    className="flex-1 h-8 text-xs bg-secondary border-border"
                    placeholder="Ask about a structure…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    data-ocid="chat.input"
                  />
                  <Button
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={handleChatSend}
                    disabled={!chatInput.trim()}
                    data-ocid="chat.submit_button"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setChatOpen((o) => !o)}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-colors hover:bg-primary/90"
            data-ocid="chat.open_modal_button"
            aria-label="Toggle AI assistant"
          >
            <AnimatePresence mode="wait">
              {chatOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="bot"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Bot className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </>
    );
  }

  if (structureDetailPdbId) {
    return (
      <div
        className="h-screen flex flex-col bg-background text-foreground overflow-hidden"
        data-smartboard={isSmartBoard ? "true" : undefined}
      >
        <header
          className="shrink-0 border-b border-border px-4 h-12 flex items-center gap-4"
          style={{ background: "oklch(var(--nav))" }}
        >
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Atom className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-foreground tracking-tight text-sm font-display">
              BioViewer 3D
            </span>
          </div>
          <div className="flex-1" />
          <Button
            variant={isSmartBoard ? "default" : "ghost"}
            size="sm"
            className={`gap-1.5 h-7 px-2 text-xs relative ${isSmartBoard ? "bg-primary/20 border border-primary/40 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            onClick={toggleSmartBoard}
            title={
              isSmartBoard
                ? "Smart Board Mode Active"
                : "Activate Smart Board Mode"
            }
            data-ocid="nav.smartboard.toggle"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isSmartBoard ? "Smart Board" : ""}
            </span>
            {isSmartBoard && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400" />
            )}
          </Button>
        </header>
        <div className="flex-1 overflow-hidden flex flex-col">
          <StructureDetailPage
            pdbId={structureDetailPdbId}
            isSmartBoard={isSmartBoard}
            onNavigate={navigate}
          />
        </div>
      </div>
    );
  }

  const NAV_LINKS = [
    { href: "#/", label: "Home", icon: <Home className="w-3.5 h-3.5" /> },
    {
      href: "#/molecular",
      label: "Molecular",
      icon: <Dna className="w-3.5 h-3.5" />,
    },
    {
      href: "#/anatomy",
      label: "Anatomy",
      icon: <Activity className="w-3.5 h-3.5" />,
    },
    {
      href: "#/plants",
      label: "Plants",
      icon: <Leaf className="w-3.5 h-3.5" />,
    },
    {
      href: "#/bacteria",
      label: "Bacteria",
      icon: <Microscope className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      className="h-screen flex flex-col bg-background text-foreground overflow-hidden"
      data-smartboard={isSmartBoard ? "true" : undefined}
    >
      {/* ── Top Navigation ── */}
      <header
        className="shrink-0 border-b border-border px-4 h-12 flex items-center justify-between gap-4"
        style={{ background: "oklch(var(--nav))" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Atom className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-foreground tracking-tight text-sm font-display">
            BioViewer 3D
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-1" data-ocid="nav.links">
          {NAV_LINKS.map((link) => {
            const isActive =
              route === link.href ||
              (link.href === "#/" && isHomeRoute) ||
              (link.href === "#/" && isViewerRoute);
            return (
              <button
                key={link.href}
                type="button"
                className="flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-colors"
                style={{
                  background: isActive
                    ? "oklch(0.73 0.18 192 / 0.15)"
                    : "transparent",
                  color: isActive
                    ? "oklch(0.73 0.18 192)"
                    : "oklch(0.65 0.04 145)",
                  border: isActive
                    ? "1px solid oklch(0.73 0.18 192 / 0.35)"
                    : "1px solid transparent",
                }}
                onClick={() => navigate(link.href)}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
              >
                {link.icon}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: user + controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isViewerRoute && (
            <>
              <Badge
                variant="outline"
                className="text-xs border-primary/30 text-primary font-mono hidden sm:flex"
              >
                {filteredStructures.length} shown
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-border text-muted-foreground hover:text-foreground hover:bg-secondary h-7 px-2 text-xs"
                onClick={handlePresentation}
                data-ocid="nav.presentation_mode.button"
              >
                <Maximize2 className="w-3 h-3" />
                Fullscreen
              </Button>
            </>
          )}
          {/* Smart Board toggle */}
          <Button
            variant={isSmartBoard ? "default" : "ghost"}
            size="sm"
            className={`gap-1.5 h-7 px-2 text-xs relative ${isSmartBoard ? "bg-primary/20 border border-primary/40 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            onClick={toggleSmartBoard}
            title={
              isSmartBoard
                ? "Smart Board Mode Active"
                : "Activate Smart Board Mode"
            }
            data-ocid="nav.smartboard.toggle"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isSmartBoard ? "Smart Board" : ""}
            </span>
            {isSmartBoard && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400" />
            )}
          </Button>
          {/* User avatar */}
          <Avatar className="w-7 h-7">
            {user.picture ? <AvatarImage src={user.picture} /> : null}
            <AvatarFallback
              className="text-[10px] font-bold"
              style={{
                background: "oklch(0.73 0.18 192 / 0.2)",
                color: "oklch(0.73 0.18 192)",
              }}
            >
              {user.isGuest ? "G" : user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span
            className="text-xs hidden md:block"
            style={{ color: "oklch(0.7 0.04 145)" }}
          >
            {user.isGuest ? "Guest" : user.name.split(" ")[0]}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={logout}
            title="Log out"
            data-ocid="nav.logout.button"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>
      {/* ── Category Pages ── */}
      {!isViewerRoute && !isHomeRoute && (
        <div
          className="flex-1 overflow-hidden flex flex-col"
          onTouchStart={handleSwipeTouchStart}
          onTouchEnd={handleSwipeTouchEnd}
        >
          {route === "#/molecular" && <MolecularPage onNavigate={navigate} />}
          {route === "#/anatomy" && <AnatomyPage onNavigate={navigate} />}
          {route === "#/plants" && <PlantsPage onNavigate={navigate} />}
          {route === "#/bacteria" && <BacteriaPage onNavigate={navigate} />}
        </div>
      )}
      {/* ── Main Viewer (only shown on home route) ── */}
      {isViewerRoute && (
        <>
          {/* ── Body ── */}
          <div className="flex-1 flex overflow-hidden">
            {/* ── Sidebar ── */}
            <aside
              className="w-72 shrink-0 border-r border-border flex flex-col"
              style={{ background: "oklch(var(--card))" }}
            >
              {/* Search */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    className="pl-8 h-8 text-xs bg-secondary border-border"
                    placeholder="Search by name or PDB ID…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-ocid="search.input"
                  />
                </div>
              </div>

              {/* Category tabs */}
              <div className="p-2 border-b border-border">
                <Tabs
                  value={activeCategory}
                  onValueChange={(v) => setActiveCategory(v as Category)}
                >
                  <TabsList
                    className="flex flex-wrap h-auto gap-1 bg-transparent p-0"
                    data-ocid="category.tab"
                  >
                    {CATEGORIES.map((cat) => (
                      <TabsTrigger
                        key={cat}
                        value={cat}
                        className="h-6 text-[10px] px-2 gap-1 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        {CATEGORY_ICONS[cat]}
                        {cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Structure list */}
              <ScrollArea className="flex-1">
                <div className="p-2 flex flex-col gap-1">
                  {filteredStructures.length === 0 ? (
                    <div
                      className="text-center py-8 text-xs text-muted-foreground"
                      data-ocid="sidebar.empty_state"
                    >
                      No structures match your search.
                    </div>
                  ) : (
                    filteredStructures.map((s, i) => (
                      <motion.button
                        key={s.pdbId}
                        type="button"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.015, duration: 0.2 }}
                        className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors group ${
                          selectedStructure?.pdbId === s.pdbId
                            ? "bg-primary/15 border border-primary/30"
                            : "hover:bg-secondary border border-transparent"
                        }`}
                        onClick={() => loadStructure(s)}
                        data-ocid={`sidebar.item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {s.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                              {s.description}
                            </p>
                          </div>
                          {s.pdbId !== ANATOMY_ID && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] font-mono shrink-0 px-1 py-0 h-4"
                            >
                              {s.pdbId}
                            </Badge>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className="mt-1 text-[9px] px-1 py-0 h-3.5 border-border text-muted-foreground"
                        >
                          {s.category}
                        </Badge>
                      </motion.button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </aside>

            {/* ── Main viewer ── */}
            <main className="flex-1 flex flex-col overflow-hidden">
              {/* Controls bar */}
              <div
                className="shrink-0 border-b border-border px-4 py-2 flex items-center justify-between gap-4"
                style={{ background: "oklch(var(--nav))" }}
              >
                {/* Structure title */}
                <div className="flex items-center gap-2 min-w-0">
                  <FlaskConical className="w-4 h-4 text-primary shrink-0" />
                  {selectedStructure ? (
                    <>
                      <span className="text-sm font-semibold truncate">
                        {selectedStructure.name}
                      </span>
                      {selectedStructure.pdbId !== ANATOMY_ID && (
                        <Badge className="font-mono text-xs shrink-0">
                          {selectedStructure.pdbId}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="text-xs shrink-0 border-border text-muted-foreground"
                      >
                        {selectedStructure.category}
                      </Badge>
                      {isAnatomyMode && (
                        <Badge
                          className="text-xs shrink-0 bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          variant="outline"
                        >
                          31 bones · 16 organs
                        </Badge>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Select a structure
                    </span>
                  )}
                </div>

                {/* Style + Labels controls – hidden in anatomy mode */}
                {!isAnatomyMode && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">
                      Style:
                    </span>
                    {(
                      ["cartoon", "stick", "sphere", "surface"] as RenderStyle[]
                    ).map((style) => (
                      <Button
                        key={style}
                        size="sm"
                        variant={renderStyle === style ? "default" : "outline"}
                        className="h-7 px-3 text-xs capitalize"
                        style={
                          renderStyle === style
                            ? { backgroundColor: STYLE_COLORS[style] }
                            : {}
                        }
                        onClick={() => handleStyleChange(style)}
                        data-ocid={`style.${style}.button`}
                      >
                        {style}
                      </Button>
                    ))}

                    {/* Divider */}
                    <span className="text-border mx-1 select-none">|</span>

                    {/* Labels toggle */}
                    <Button
                      size="sm"
                      variant={showLabels ? "default" : "outline"}
                      className={`h-7 px-3 text-xs gap-1.5 ${
                        showLabels
                          ? "bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30"
                          : ""
                      }`}
                      onClick={() => setShowLabels((v) => !v)}
                      data-ocid="labels.toggle"
                    >
                      <Tag className="w-3 h-3" />
                      Labels
                      {showLabels && (
                        <Badge className="ml-0.5 h-4 px-1 text-[9px] bg-green-500/30 text-green-300 border-green-500/40">
                          {labelCount}
                        </Badge>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* 3D viewer area – or anatomy diagram */}
              {isAnatomyMode ? (
                <HumanAnatomyViewer />
              ) : (
                <div className="flex-1 flex overflow-hidden">
                  {/* Canvas */}
                  <div
                    className="flex-1 relative"
                    style={{ background: "#080d1a" }}
                  >
                    <div
                      ref={viewerContainerRef}
                      style={{ width: "100%", height: "100%" }}
                      data-ocid="viewer.canvas_target"
                    />

                    {/* Loading overlay */}
                    <AnimatePresence>
                      {isLoading && (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
                          style={{ background: "rgba(8,13,26,0.85)" }}
                          data-ocid="viewer.loading_state"
                        >
                          <Loader2 className="w-10 h-10 text-primary animate-spin" />
                          <p className="text-sm font-semibold text-foreground">
                            Loading
                            {selectedStructure
                              ? ` ${selectedStructure.pdbId}`
                              : ""}
                            …
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error state */}
                    <AnimatePresence>
                      {loadError && !isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-destructive/20 border border-destructive/40 text-destructive-foreground text-xs px-4 py-2 rounded-lg"
                          data-ocid="viewer.error_state"
                        >
                          {loadError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Labels legend overlay */}
                    <AnimatePresence>
                      {showLabels && selectedStructure && (
                        <motion.div
                          key="labels-legend"
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-3 right-3 z-10 rounded-lg border border-border/60 overflow-hidden"
                          style={{ background: "rgba(8,13,26,0.88)" }}
                          data-ocid="labels.panel"
                        >
                          <div className="px-3 py-1.5 border-b border-border/40">
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                              Bond / Component Labels
                            </p>
                          </div>
                          <div className="px-3 py-2 flex flex-col gap-1.5">
                            {(
                              LABEL_DEFS[selectedStructure.category] ??
                              LABEL_DEFS.Proteins
                            ).map((def) => (
                              <div
                                key={def.text}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: def.color }}
                                />
                                <span className="text-[10px] text-foreground/80 leading-tight">
                                  {def.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Details panel */}
                  <aside
                    className="w-56 shrink-0 border-l border-border flex flex-col"
                    style={{ background: "oklch(var(--card))" }}
                  >
                    <div className="p-3 border-b border-border">
                      <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                        Structure Details
                      </p>
                    </div>
                    {selectedStructure ? (
                      <div className="p-3 flex flex-col gap-4">
                        {(
                          [
                            ["Name", selectedStructure.name],
                            ["PDB ID", selectedStructure.pdbId],
                            ["Category", selectedStructure.category],
                            ["Description", selectedStructure.description],
                          ] as [string, string][]
                        ).map(([k, v]) => (
                          <div key={k}>
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">
                              {k}
                            </p>
                            <p className="text-xs font-medium text-foreground leading-relaxed">
                              {v}
                            </p>
                          </div>
                        ))}

                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
                            Render Style
                          </p>
                          <Badge
                            className="text-xs font-mono capitalize"
                            style={{
                              backgroundColor: `${STYLE_COLORS[renderStyle]}40`,
                              color: STYLE_COLORS[renderStyle],
                              borderColor: `${STYLE_COLORS[renderStyle]}60`,
                            }}
                            variant="outline"
                          >
                            {renderStyle}
                          </Badge>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
                            Data Source
                          </p>
                          <a
                            href={`https://www.rcsb.org/structure/${selectedStructure.pdbId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline font-mono"
                          >
                            RCSB PDB ↗
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex-1 flex items-center justify-center text-xs text-muted-foreground px-4 text-center"
                        data-ocid="details.empty_state"
                      >
                        Select a structure from the sidebar to view details
                      </div>
                    )}
                  </aside>
                </div>
              )}
            </main>
          </div>

          {/* ── Footer ── */}
          <footer
            className="shrink-0 border-t border-border py-2 text-center text-[10px] text-muted-foreground"
            style={{ background: "oklch(var(--nav))" }}
          >
            © {new Date().getFullYear()} · Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
            {" · "}
            {STRUCTURES.length} structures from RCSB PDB
          </footer>
        </>
      )}{" "}
      {/* end isViewerRoute */}
      {/* ── Floating AI Chat ── */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {/* Chat panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-[340px] h-[420px] rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden"
              style={{ background: "oklch(var(--card))" }}
              data-ocid="chat.panel"
            >
              {/* Chat header */}
              <div
                className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0"
                style={{ background: "oklch(var(--nav))" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    AI Structure Assistant
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors rounded p-0.5"
                  data-ocid="chat.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-3 py-2">
                <div className="flex flex-col gap-2">
                  {chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[82%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-secondary text-foreground rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="shrink-0 border-t border-border px-3 py-2 flex gap-2 items-center">
                <Input
                  className="flex-1 h-8 text-xs bg-secondary border-border"
                  placeholder="Ask about a structure…"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  data-ocid="chat.input"
                />
                <Button
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleChatSend}
                  disabled={!chatInput.trim()}
                  data-ocid="chat.submit_button"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setChatOpen((o) => !o)}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-colors hover:bg-primary/90"
          data-ocid="chat.open_modal_button"
          aria-label="Toggle AI assistant"
        >
          <AnimatePresence mode="wait">
            {chatOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="bot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Bot className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
