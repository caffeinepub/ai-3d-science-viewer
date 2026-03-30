import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Atom,
  Dna,
  FlaskConical,
  Grid2x2,
  Leaf,
  LogOut,
  Microscope,
  Search,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type UserType = {
  name: string;
  picture?: string;
  isGuest?: boolean;
};

interface HomePageProps {
  user: UserType;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

const CATEGORIES = [
  {
    emoji: "🧬",
    label: "Molecular",
    tagline: "DNA, proteins, enzymes",
    href: "#/molecular",
    icon: <Dna className="w-5 h-5" />,
    color: "oklch(0.73 0.18 192)",
    bg: "oklch(0.73 0.18 192 / 0.12)",
    border: "oklch(0.73 0.18 192 / 0.3)",
  },
  {
    emoji: "🫀",
    label: "Anatomy",
    tagline: "Human body, bones, organs",
    href: "#/anatomy",
    icon: <Activity className="w-5 h-5" />,
    color: "oklch(0.72 0.2 25)",
    bg: "oklch(0.72 0.2 25 / 0.12)",
    border: "oklch(0.72 0.2 25 / 0.3)",
  },
  {
    emoji: "🌿",
    label: "Plants",
    tagline: "Chloroplasts, cell structures",
    href: "#/plants",
    icon: <Leaf className="w-5 h-5" />,
    color: "oklch(0.72 0.2 145)",
    bg: "oklch(0.72 0.2 145 / 0.12)",
    border: "oklch(0.72 0.2 145 / 0.3)",
  },
  {
    emoji: "🦠",
    label: "Bacteria",
    tagline: "Microbial biology",
    href: "#/bacteria",
    icon: <Microscope className="w-5 h-5" />,
    color: "oklch(0.74 0.14 80)",
    bg: "oklch(0.74 0.14 80 / 0.12)",
    border: "oklch(0.74 0.14 80 / 0.3)",
  },
];

export default function HomePage({
  user,
  onNavigate,
  onLogout,
  onSearch,
}: HomePageProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const q = query.trim();
    if (q) onSearch(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background text-foreground"
      style={{ overflowX: "hidden" }}
    >
      {/* ── Sticky top bar ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b border-border shrink-0"
        style={{ background: "oklch(var(--nav))" }}
      >
        {/* Left: Categories dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8 px-3 text-xs border-border text-muted-foreground hover:text-foreground"
              data-ocid="home.categories.button"
            >
              <Grid2x2 className="w-3.5 h-3.5" />
              Categories
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {CATEGORIES.map((cat) => (
              <DropdownMenuItem
                key={cat.href}
                onClick={() => onNavigate(cat.href)}
                className="gap-2 text-sm cursor-pointer"
                data-ocid={`home.category.${cat.label.toLowerCase()}.link`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Center: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
            <Atom className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-bold text-sm font-display tracking-tight text-foreground">
            BioViewer 3D
          </span>
        </div>

        {/* Right: User profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full p-0.5 pr-2 border border-border/50 hover:border-border transition-colors"
              data-ocid="home.user.button"
              style={{ background: "oklch(var(--secondary))" }}
            >
              <Avatar className="w-6 h-6">
                {user.picture ? <AvatarImage src={user.picture} /> : null}
                <AvatarFallback
                  className="text-[9px] font-bold"
                  style={{
                    background: "oklch(0.73 0.18 192 / 0.2)",
                    color: "oklch(0.73 0.18 192)",
                  }}
                >
                  {user.isGuest ? "G" : user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-[11px] text-muted-foreground max-w-[60px] truncate">
                {user.isGuest ? "Guest" : user.name.split(" ")[0]}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 text-sm cursor-default opacity-60">
              <User className="w-3.5 h-3.5" />
              {user.isGuest ? "Guest User" : user.name}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onLogout}
              className="gap-2 text-sm cursor-pointer text-destructive focus:text-destructive"
              data-ocid="home.logout.button"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* ── Content (scrollable) ── */}
      <main className="flex-1 flex flex-col items-center px-4 py-5 gap-5 w-full max-w-[430px] mx-auto">
        {/* ── Search bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-10 pr-16 h-11 text-sm rounded-full border-border bg-secondary focus-visible:ring-primary/50"
              placeholder="Search structures, proteins, DNA…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              data-ocid="home.search.input"
            />
            <Button
              size="sm"
              onClick={handleSearch}
              disabled={!query.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 text-xs rounded-full"
              data-ocid="home.search.button"
            >
              Go
            </Button>
          </div>
        </motion.div>

        {/* ── Welcome slogan ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="w-full text-center"
        >
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.73 0.18 192), oklch(0.65 0.2 145))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Welcome
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore biology in 3D
          </p>
        </motion.div>

        {/* ── Welcome note card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="w-full rounded-2xl border border-border/60 overflow-hidden"
          style={{ background: "oklch(var(--card))" }}
        >
          {/* Card header accent */}
          <div
            className="px-4 pt-4 pb-3 flex items-start gap-3"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.73 0.18 192 / 0.08), oklch(0.65 0.18 145 / 0.06))",
              borderBottom: "1px solid oklch(var(--border))",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{
                background: "oklch(0.73 0.18 192 / 0.15)",
                border: "1px solid oklch(0.73 0.18 192 / 0.3)",
              }}
            >
              <span className="text-xl">🧬</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                Developer's Note
              </p>
              <Badge
                variant="outline"
                className="mt-1 text-[10px] border-primary/30 text-primary px-2 py-0"
              >
                Manipur College · Biochemistry
              </Badge>
            </div>
          </div>

          <div className="px-4 py-3">
            <p className="text-sm text-foreground/90 leading-relaxed">
              Hi! I'm a student at{" "}
              <span className="text-primary font-medium">Manipur College</span>,
              graduating from the{" "}
              <span className="text-primary font-medium">
                Biochemistry Department
              </span>
              .
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              I built this app to make biological structures more accessible and
              interactive — so anyone can explore DNA, proteins, human anatomy,
              and more right from their phone.
            </p>
          </div>
        </motion.div>

        {/* ── App info section ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="w-full rounded-2xl border border-border/60 px-4 py-4"
          style={{ background: "oklch(var(--card))" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-4 h-4 text-accent" />
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              About This App
            </p>
          </div>
          <p className="text-sm text-foreground/85 leading-relaxed">
            <span className="font-semibold text-foreground">
              AI 3D Science Viewer
            </span>{" "}
            lets you explore{" "}
            <span className="text-primary font-medium">
              42+ molecular and biological structures
            </span>{" "}
            in 3D — from DNA double helices and protein complexes to full human
            anatomy.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Use the AI assistant to search and discover structures, browse by
            category, and toggle labels to learn bond names, organ names, and
            more.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {[
              "42+ Structures",
              "3D Viewer",
              "AI Assistant",
              "Labels",
              "Human Anatomy",
            ].map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[11px] px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* ── Category cards 2x2 ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Browse by Category
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.href}
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.34 + i * 0.06, duration: 0.25 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate(cat.href)}
                className="flex flex-col items-start gap-2 rounded-2xl p-4 border text-left transition-colors"
                style={{
                  background: cat.bg,
                  borderColor: cat.border,
                }}
                data-ocid={`home.category.${cat.label.toLowerCase()}.card`}
              >
                <span className="text-2xl leading-none">{cat.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {cat.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                    {cat.tagline}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="shrink-0 text-center py-4 px-4">
        <p className="text-[11px] text-muted-foreground">
          Made with ❤️ for Biochemistry · Manipur College
        </p>
        <p
          className="text-[10px] mt-1"
          style={{ color: "oklch(0.45 0.03 145)" }}
        >
          © {new Date().getFullYear()} · Built with{" "}
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
    </div>
  );
}
