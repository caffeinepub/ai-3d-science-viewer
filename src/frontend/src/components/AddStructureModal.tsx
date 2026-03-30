import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

export interface MyStructure {
  id: string;
  name: string;
  pdbId: string;
  imageDataUrl?: string;
  addedAt: string;
}

interface RCSBResult {
  identifier: string;
  title: string;
}

async function searchRCSB(query: string): Promise<RCSBResult[]> {
  const res = await fetch("https://search.rcsb.org/rcsbsearch/v2/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: {
        type: "terminal",
        service: "full_text",
        parameters: { value: query },
      },
      return_type: "entry",
      request_options: { paginate: { start: 0, rows: 8 } },
    }),
  });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const json = await res.json();
  const ids: string[] = (json.result_set ?? []).map(
    (r: any) => r.identifier as string,
  );

  // fetch titles in parallel
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const infoRes = await fetch(
          `https://data.rcsb.org/rest/v1/core/entry/${id}`,
        );
        if (infoRes.ok) {
          const info = await infoRes.json();
          const title = info?.struct?.title ?? info?.entry?.id ?? id;
          return { identifier: id, title } as RCSBResult;
        }
      } catch (_) {}
      return { identifier: id, title: id } as RCSBResult;
    }),
  );
  return results;
}

const STORAGE_KEY = "myStructures";

export function loadMyStructures(): MyStructure[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveMyStructures(list: MyStructure[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

type Step = "input" | "results" | "confirm";

interface Props {
  onAdd: (structure: MyStructure) => void;
}

export function AddStructureModal({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [query, setQuery] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [imageFile, setImageFile] = useState<string | undefined>();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<RCSBResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<RCSBResult | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep("input");
    setQuery("");
    setImageDataUrl(undefined);
    setImageFile(undefined);
    setSearchResults([]);
    setSelectedResult(null);
    setError(null);
    setIsSearching(false);
    setIsAdding(false);
  };

  const handleClose = (val: boolean) => {
    setOpen(val);
    if (!val) reset();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImageDataUrl(result);
      setImageFile(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setError(null);

    // Direct PDB ID (4 chars alphanumeric)
    if (/^[A-Za-z0-9]{4}$/.test(q)) {
      setSelectedResult({
        identifier: q.toUpperCase(),
        title: q.toUpperCase(),
      });
      setStep("confirm");
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchRCSB(q);
      if (results.length === 0) {
        setError("No structures found. Try a different name or PDB ID.");
      } else {
        setSearchResults(results);
        setStep("results");
      }
    } catch (err: any) {
      setError(`Search failed: ${err.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (result: RCSBResult) => {
    setSelectedResult(result);
    setStep("confirm");
  };

  const handleAdd = async () => {
    if (!selectedResult) return;
    setIsAdding(true);
    setError(null);
    try {
      const url = `https://files.rcsb.org/view/${selectedResult.identifier}.pdb`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`PDB not found (${res.status})`);

      const newEntry: MyStructure = {
        id: `${selectedResult.identifier}-${Date.now()}`,
        name: selectedResult.title,
        pdbId: selectedResult.identifier,
        imageDataUrl,
        addedAt: new Date().toISOString(),
      };

      const existing = loadMyStructures();
      saveMyStructures([newEntry, ...existing]);
      onAdd(newEntry);
      setOpen(false);
      reset();
    } catch (err: any) {
      setError(`Failed to add: ${err.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-1.5 h-7 px-2 text-xs bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 hover:text-primary"
          data-ocid="nav.add_structure.open_modal_button"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Structure</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-lg"
        data-ocid="add_structure.dialog"
        style={{
          background: "oklch(var(--card))",
          border: "1px solid oklch(var(--border))",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "oklch(0.73 0.18 192 / 0.15)" }}
            >
              <Search
                className="w-3.5 h-3.5"
                style={{ color: "oklch(0.73 0.18 192)" }}
              />
            </div>
            Search & Add Structure
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {step === "input" &&
              "Upload a reference image and search the RCSB PDB database."}
            {step === "results" &&
              "Select a structure from the search results."}
            {step === "confirm" &&
              "Confirm to add this structure to your collection."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            {(["input", "results", "confirm"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors"
                  style={{
                    background:
                      step === s
                        ? "oklch(0.73 0.18 192)"
                        : s === "confirm" && step === "confirm"
                          ? "oklch(0.73 0.18 192)"
                          : "oklch(0.25 0.03 145)",
                    color:
                      step === s
                        ? "oklch(0.1 0.01 145)"
                        : "oklch(0.6 0.04 145)",
                  }}
                >
                  {i + 1}
                </div>
                <span
                  className="text-[10px]"
                  style={{
                    color:
                      step === s
                        ? "oklch(0.73 0.18 192)"
                        : "oklch(0.5 0.04 145)",
                  }}
                >
                  {s === "input"
                    ? "Search"
                    : s === "results"
                      ? "Results"
                      : "Confirm"}
                </span>
                {i < 2 && <div className="w-4 h-px bg-border" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ─── Step 1: Input ─── */}
            {step === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Image upload */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                    Reference Image{" "}
                    <span className="text-[10px]">(optional)</span>
                  </Label>
                  <button
                    type="button"
                    className="relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors hover:border-primary/50"
                    style={{
                      borderColor: imageDataUrl
                        ? "oklch(0.73 0.18 192 / 0.5)"
                        : undefined,
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    data-ocid="add_structure.dropzone"
                  >
                    {imageDataUrl ? (
                      <div className="relative">
                        <img
                          src={imageDataUrl}
                          alt="Reference"
                          className="h-20 w-auto rounded-lg object-contain"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageDataUrl(undefined);
                            setImageFile(undefined);
                          }}
                          data-ocid="add_structure.clear_image.button"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: "oklch(0.73 0.18 192 / 0.1)" }}
                        >
                          <ImagePlus
                            className="w-5 h-5"
                            style={{ color: "oklch(0.73 0.18 192)" }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Click to upload a reference image
                        </p>
                        <p className="text-[10px] text-muted-foreground/60">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                    {imageFile && !imageDataUrl && (
                      <p className="text-xs text-muted-foreground truncate max-w-full">
                        {imageFile}
                      </p>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    data-ocid="add_structure.upload_button"
                  />
                </div>

                {/* Query input */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                    Molecule / Protein Name or PDB ID
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      className="h-9 text-xs bg-secondary border-border flex-1"
                      placeholder='e.g. "insulin", "hemoglobin", "1BNA"'
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      data-ocid="add_structure.search.input"
                    />
                    <Button
                      size="sm"
                      className="h-9 px-3 text-xs shrink-0"
                      onClick={handleSearch}
                      disabled={!query.trim() || isSearching}
                      data-ocid="add_structure.search.button"
                    >
                      {isSearching ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="add_structure.error_state"
                  >
                    {error}
                  </p>
                )}
              </motion.div>
            )}

            {/* ─── Step 2: Results ─── */}
            {step === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {searchResults.length} results for &ldquo;{query}&rdquo;
                  </p>
                  <button
                    type="button"
                    className="text-[10px] underline text-muted-foreground hover:text-foreground"
                    onClick={() => setStep("input")}
                  >
                    ← Back
                  </button>
                </div>
                <ScrollArea className="h-64">
                  <div className="space-y-1.5 pr-2">
                    {searchResults.map((result, i) => (
                      <motion.button
                        key={result.identifier}
                        type="button"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.2 }}
                        className="w-full text-left rounded-lg border border-border px-3 py-2.5 flex items-center justify-between gap-3 transition-colors hover:border-primary/40 hover:bg-primary/5 group"
                        onClick={() => handleSelect(result)}
                        data-ocid={`add_structure.result.item.${i + 1}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs font-mono font-bold"
                            style={{ color: "oklch(0.73 0.18 192)" }}
                          >
                            {result.identifier}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                            {result.title}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-[10px] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity border-primary/30 text-primary"
                        >
                          Select
                        </Button>
                      </motion.button>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}

            {/* ─── Step 3: Confirm ─── */}
            {step === "confirm" && selectedResult && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <button
                  type="button"
                  className="text-[10px] underline text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setStep(searchResults.length > 0 ? "results" : "input")
                  }
                >
                  ← Back
                </button>

                <div
                  className="rounded-xl border border-border p-4 flex gap-4 items-start"
                  style={{ background: "oklch(0.15 0.02 145)" }}
                >
                  {/* Reference thumbnail */}
                  {imageDataUrl ? (
                    <img
                      src={imageDataUrl}
                      alt="Reference"
                      className="w-16 h-16 rounded-lg object-contain shrink-0 border border-border"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 border border-border"
                      style={{ background: "oklch(0.73 0.18 192 / 0.1)" }}
                    >
                      <Search
                        className="w-6 h-6"
                        style={{ color: "oklch(0.73 0.18 192 / 0.5)" }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-lg font-mono font-bold"
                      style={{ color: "oklch(0.73 0.18 192)" }}
                    >
                      {selectedResult.identifier}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {selectedResult.title}
                    </p>
                    {imageDataUrl && (
                      <p
                        className="text-[10px] mt-1.5"
                        style={{ color: "oklch(0.65 0.1 145)" }}
                      >
                        ✓ Reference image uploaded
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="add_structure.confirm.error_state"
                  >
                    {error}
                  </p>
                )}

                <Button
                  className="w-full h-9 text-xs gap-2"
                  onClick={handleAdd}
                  disabled={isAdding}
                  data-ocid="add_structure.confirm.primary_button"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Verifying & Adding...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Add to My Structures
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
