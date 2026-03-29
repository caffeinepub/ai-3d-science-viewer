import {
  Activity,
  Atom,
  Dna,
  FlaskConical,
  Layers,
  Leaf,
  Microscope,
  Shield,
  Sigma,
  User,
  Zap,
} from "lucide-react";
import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type RenderStyle = "cartoon" | "stick" | "sphere" | "surface";
export type Category =
  | "All"
  | "DNA & RNA"
  | "Proteins"
  | "Viruses"
  | "Enzymes"
  | "Signaling"
  | "Membrane"
  | "Ribosomes"
  | "Antibodies"
  | "Structural"
  | "Hormones"
  | "Anatomy";

export interface Structure {
  pdbId: string;
  name: string;
  description: string;
  category: Category;
}

export const ANATOMY_ID = "HUMAN_ANATOMY";

// ─── Label Definitions ────────────────────────────────────────────────────────
export const LABEL_DEFS: Record<
  string,
  Array<{ text: string; selector: object; color: string }>
> = {
  "DNA & RNA": [
    {
      text: "Hydrogen Bond (N-H···N)",
      selector: {
        atom: "N",
        resn: ["DA", "DT", "DG", "DC", "A", "T", "G", "C", "U"],
      },
      color: "#3b82f6",
    },
    {
      text: "Phosphate Backbone (P)",
      selector: { atom: "P" },
      color: "#f59e0b",
    },
    {
      text: "Deoxyribose Sugar (C3')",
      selector: { atom: "C3'" },
      color: "#10b981",
    },
    { text: "Base Pair (O6)", selector: { atom: "O6" }, color: "#8b5cf6" },
    { text: "Base Stack (C8)", selector: { atom: "C8" }, color: "#ec4899" },
  ],
  Proteins: [
    {
      text: "Alpha Helix (Cα)",
      selector: { atom: "CA", ss: "h" },
      color: "#3b82f6",
    },
    {
      text: "Beta Sheet (Cα)",
      selector: { atom: "CA", ss: "s" },
      color: "#10b981",
    },
    {
      text: "Peptide Bond (N)",
      selector: { atom: "N", bonds: 3 },
      color: "#f59e0b",
    },
    {
      text: "Hydrophobic Core (CB)",
      selector: { atom: "CB", resn: ["LEU", "ILE", "VAL", "PHE"] },
      color: "#ec4899",
    },
    {
      text: "Disulfide Bond (Sγ)",
      selector: { atom: "SG", resn: "CYS" },
      color: "#f97316",
    },
  ],
  Viruses: [
    {
      text: "Spike Glycoprotein (CA)",
      selector: { atom: "CA", resi: [1, 50] },
      color: "#ef4444",
    },
    {
      text: "N-Glycosylation (ND2)",
      selector: { atom: "ND2", resn: "ASN" },
      color: "#3b82f6",
    },
    {
      text: "Disulfide Bond (Sγ)",
      selector: { atom: "SG", resn: "CYS" },
      color: "#f97316",
    },
    {
      text: "Receptor Binding (CB)",
      selector: { atom: "CB", resn: ["TYR", "PHE", "TRP"] },
      color: "#8b5cf6",
    },
    {
      text: "Viral Backbone (N)",
      selector: { atom: "N", resi: [100, 150] },
      color: "#10b981",
    },
  ],
  Enzymes: [
    {
      text: "Catalytic HIS (Nε2)",
      selector: { atom: "NE2", resn: "HIS" },
      color: "#ef4444",
    },
    {
      text: "Active Site SER (Oγ)",
      selector: { atom: "OG", resn: "SER" },
      color: "#3b82f6",
    },
    {
      text: "Substrate Binding ASP (Oδ)",
      selector: { atom: "OD1", resn: "ASP" },
      color: "#f59e0b",
    },
    {
      text: "Peptide Bond (C)",
      selector: { atom: "C", resn: ["GLY", "ALA"] },
      color: "#10b981",
    },
    {
      text: "Cofactor Pocket (CB)",
      selector: { atom: "CB", resn: ["LYS", "ARG"] },
      color: "#8b5cf6",
    },
  ],
  Signaling: [
    {
      text: "Binding Domain (CA)",
      selector: { atom: "CA", resi: [1, 20] },
      color: "#3b82f6",
    },
    {
      text: "Phosphorylation Site (Oγ)",
      selector: { atom: "OG", resn: ["SER", "THR"] },
      color: "#ef4444",
    },
    {
      text: "Signal Loop (N)",
      selector: { atom: "N", ss: "c" },
      color: "#f59e0b",
    },
    {
      text: "Hydrophobic Interface (CB)",
      selector: { atom: "CB", resn: ["LEU", "ILE", "PHE"] },
      color: "#10b981",
    },
    {
      text: "Calcium Binding (OE1)",
      selector: { atom: "OE1", resn: "GLU" },
      color: "#8b5cf6",
    },
  ],
  Membrane: [
    {
      text: "Transmembrane Helix (CA)",
      selector: { atom: "CA", ss: "h", resi: [1, 40] },
      color: "#3b82f6",
    },
    {
      text: "Hydrophobic Belt (CB)",
      selector: { atom: "CB", resn: ["PHE", "ILE", "LEU", "VAL"] },
      color: "#f59e0b",
    },
    {
      text: "Ion Pore (NZ)",
      selector: { atom: "NZ", resn: "LYS" },
      color: "#ef4444",
    },
    {
      text: "Lipid Interface (CA)",
      selector: { atom: "CA", resi: [80, 120] },
      color: "#10b981",
    },
    {
      text: "Helix-Helix Contact (CB)",
      selector: { atom: "CB", resi: [40, 60] },
      color: "#8b5cf6",
    },
  ],
  Ribosomes: [
    { text: "rRNA Core (P)", selector: { atom: "P" }, color: "#3b82f6" },
    {
      text: "Peptidyl Transfer (O2')",
      selector: { atom: "O2'" },
      color: "#ef4444",
    },
    {
      text: "A-Site (N3)",
      selector: { atom: "N3", resn: ["A", "G"] },
      color: "#f59e0b",
    },
    {
      text: "Ribosomal Protein (CA)",
      selector: { atom: "CA", resi: [1, 10] },
      color: "#10b981",
    },
    {
      text: "Base Pair Bridge (N1)",
      selector: { atom: "N1", resn: ["A", "G", "C", "U"] },
      color: "#8b5cf6",
    },
  ],
  Antibodies: [
    {
      text: "Variable Domain (CA)",
      selector: { atom: "CA", resi: [1, 30] },
      color: "#3b82f6",
    },
    {
      text: "CDR Loop (CA)",
      selector: { atom: "CA", resi: [50, 70] },
      color: "#ef4444",
    },
    {
      text: "Constant Domain (CA)",
      selector: { atom: "CA", resi: [120, 150] },
      color: "#10b981",
    },
    {
      text: "Antigen Binding Site (CB)",
      selector: { atom: "CB", resn: ["TYR", "TRP", "PHE"] },
      color: "#f59e0b",
    },
    {
      text: "Disulfide Bond (Sγ)",
      selector: { atom: "SG", resn: "CYS" },
      color: "#8b5cf6",
    },
  ],
  Structural: [
    {
      text: "Triple Helix (CA)",
      selector: { atom: "CA", resi: [1, 30] },
      color: "#3b82f6",
    },
    {
      text: "Glycine Gly-X-Y (Cα)",
      selector: { atom: "CA", resn: "GLY" },
      color: "#f59e0b",
    },
    {
      text: "Proline Kink (Cγ)",
      selector: { atom: "CG", resn: "PRO" },
      color: "#10b981",
    },
    {
      text: "Hydroxyproline (Oδ)",
      selector: { atom: "OD1", resn: "HYP" },
      color: "#ec4899",
    },
    {
      text: "Cross-link (NZ)",
      selector: { atom: "NZ", resn: "LYS" },
      color: "#8b5cf6",
    },
  ],
  Hormones: [
    {
      text: "Receptor Binding (CA)",
      selector: { atom: "CA", resi: [1, 20] },
      color: "#3b82f6",
    },
    {
      text: "Disulfide Bridge (Sγ)",
      selector: { atom: "SG", resn: "CYS" },
      color: "#f97316",
    },
    {
      text: "Amphipathic Helix (CA)",
      selector: { atom: "CA", ss: "h" },
      color: "#10b981",
    },
    {
      text: "Signal Peptide (N)",
      selector: { atom: "N", resi: [1, 10] },
      color: "#ef4444",
    },
    {
      text: "Hydrophobic Face (CB)",
      selector: { atom: "CB", resn: ["LEU", "ILE", "PHE", "VAL"] },
      color: "#8b5cf6",
    },
  ],
};

// ─── Catalog ──────────────────────────────────────────────────────────────────
export const STRUCTURES: Structure[] = [
  // Anatomy
  {
    pdbId: ANATOMY_ID,
    name: "Human Body",
    description: "Full skeletal & organ map with labels",
    category: "Anatomy",
  },
  // DNA & RNA
  {
    pdbId: "1BNA",
    name: "B-DNA Dodecamer",
    description: "Classic B-form double helix",
    category: "DNA & RNA",
  },
  {
    pdbId: "1D8G",
    name: "A-DNA",
    description: "A-form double helix structure",
    category: "DNA & RNA",
  },
  {
    pdbId: "2LWI",
    name: "RNA Aptamer",
    description: "Functional RNA aptamer",
    category: "DNA & RNA",
  },
  {
    pdbId: "6TNA",
    name: "tRNA (Yeast)",
    description: "Transfer RNA phenylalanine",
    category: "DNA & RNA",
  },
  {
    pdbId: "4TNA",
    name: "Transfer RNA",
    description: "tRNA tertiary structure",
    category: "DNA & RNA",
  },
  // Proteins
  {
    pdbId: "1GZX",
    name: "Hemoglobin",
    description: "Oxygen transport protein",
    category: "Proteins",
  },
  {
    pdbId: "4INS",
    name: "Insulin",
    description: "Glucose metabolism hormone",
    category: "Proteins",
  },
  {
    pdbId: "1MBO",
    name: "Myoglobin",
    description: "Muscle oxygen storage",
    category: "Proteins",
  },
  {
    pdbId: "1LYZ",
    name: "Lysozyme",
    description: "Antibacterial enzyme",
    category: "Proteins",
  },
  {
    pdbId: "1TIM",
    name: "Triosephosphate Isomerase",
    description: "Glycolysis catalyst (TIM)",
    category: "Proteins",
  },
  {
    pdbId: "1HHO",
    name: "Oxyhemoglobin",
    description: "Hemoglobin + O₂ complex",
    category: "Proteins",
  },
  {
    pdbId: "1AKE",
    name: "Adenylate Kinase",
    description: "Energy transfer enzyme",
    category: "Proteins",
  },
  {
    pdbId: "2YPI",
    name: "Yeast TIM",
    description: "Yeast triosephosphate isomerase",
    category: "Proteins",
  },
  // Viruses
  {
    pdbId: "6VXX",
    name: "SARS-CoV-2 Spike",
    description: "COVID-19 spike glycoprotein",
    category: "Viruses",
  },
  {
    pdbId: "1HIV",
    name: "HIV Protease",
    description: "HIV-1 protease viral enzyme",
    category: "Viruses",
  },
  {
    pdbId: "4HHB",
    name: "Hemoglobin T-state",
    description: "Deoxyhemoglobin T-form",
    category: "Viruses",
  },
  {
    pdbId: "2IEM",
    name: "Influenza Hemagglutinin",
    description: "Flu virus surface protein",
    category: "Viruses",
  },
  {
    pdbId: "1TI1",
    name: "TMV Coat Protein",
    description: "Tobacco mosaic virus coat",
    category: "Viruses",
  },
  // Enzymes
  {
    pdbId: "1ATP",
    name: "Protein Kinase",
    description: "cAMP-dependent kinase",
    category: "Enzymes",
  },
  {
    pdbId: "1CSE",
    name: "Subtilisin Carlsberg",
    description: "Serine protease enzyme",
    category: "Enzymes",
  },
  {
    pdbId: "2LZM",
    name: "T4 Lysozyme",
    description: "Bacteriophage lytic enzyme",
    category: "Enzymes",
  },
  {
    pdbId: "3TIM",
    name: "Chicken TIM",
    description: "Chicken triosephosphate isomerase",
    category: "Enzymes",
  },
  {
    pdbId: "1PPC",
    name: "Trypsin",
    description: "Digestive serine protease",
    category: "Enzymes",
  },
  // Signaling
  {
    pdbId: "1CRN",
    name: "Crambin",
    description: "Plant seed storage protein",
    category: "Signaling",
  },
  {
    pdbId: "1UBQ",
    name: "Ubiquitin",
    description: "Protein degradation tag",
    category: "Signaling",
  },
  {
    pdbId: "2GBL",
    name: "G Protein β-γ",
    description: "Heterodimeric G-protein",
    category: "Signaling",
  },
  {
    pdbId: "1GFL",
    name: "GFP",
    description: "Green fluorescent protein",
    category: "Signaling",
  },
  {
    pdbId: "1CDW",
    name: "Calmodulin",
    description: "Calcium signaling protein",
    category: "Signaling",
  },
  // Membrane
  {
    pdbId: "1KPK",
    name: "Aquaporin",
    description: "Water channel protein",
    category: "Membrane",
  },
  {
    pdbId: "2OAU",
    name: "Bacteriorhodopsin",
    description: "Light-driven proton pump",
    category: "Membrane",
  },
  {
    pdbId: "1ORQ",
    name: "K⁺ Channel",
    description: "Potassium ion channel",
    category: "Membrane",
  },
  {
    pdbId: "1BL8",
    name: "Cytochrome bc1",
    description: "Mitochondrial complex III",
    category: "Membrane",
  },
  // Ribosomes
  {
    pdbId: "4V9D",
    name: "Ribosome (Complete)",
    description: "Full 70S ribosomal complex",
    category: "Ribosomes",
  },
  {
    pdbId: "1FFK",
    name: "50S Ribosomal Subunit",
    description: "Large ribosomal subunit",
    category: "Ribosomes",
  },
  {
    pdbId: "1IBM",
    name: "30S Ribosomal Subunit",
    description: "Small ribosomal subunit",
    category: "Ribosomes",
  },
  // Antibodies
  {
    pdbId: "1IGT",
    name: "IgG Antibody",
    description: "Full immunoglobulin G",
    category: "Antibodies",
  },
  {
    pdbId: "1YY9",
    name: "Fab Fragment",
    description: "Antigen-binding fragment",
    category: "Antibodies",
  },
  {
    pdbId: "3HFL",
    name: "Full IgG1",
    description: "Complete IgG1 antibody",
    category: "Antibodies",
  },
  // Structural
  {
    pdbId: "1CAG",
    name: "Collagen Triple Helix",
    description: "Structural collagen model",
    category: "Structural",
  },
  {
    pdbId: "1K1D",
    name: "Collagen Model",
    description: "Collagen peptide structure",
    category: "Structural",
  },
  {
    pdbId: "2V53",
    name: "Fibrin",
    description: "Blood clot scaffold protein",
    category: "Structural",
  },
  // Hormones
  {
    pdbId: "1B6C",
    name: "Glucagon",
    description: "Blood sugar raising hormone",
    category: "Hormones",
  },
  {
    pdbId: "1BX0",
    name: "Leptin",
    description: "Satiety signaling hormone",
    category: "Hormones",
  },
  {
    pdbId: "1F0R",
    name: "Erythropoietin",
    description: "Red blood cell stimulator",
    category: "Hormones",
  },
];

export const CATEGORIES: Category[] = [
  "All",
  "Anatomy",
  "DNA & RNA",
  "Proteins",
  "Viruses",
  "Enzymes",
  "Signaling",
  "Membrane",
  "Ribosomes",
  "Antibodies",
  "Structural",
  "Hormones",
];

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: React.createElement(Layers, { className: "w-3.5 h-3.5" }),
  Anatomy: React.createElement(User, { className: "w-3.5 h-3.5" }),
  "DNA & RNA": React.createElement(Dna, { className: "w-3.5 h-3.5" }),
  Proteins: React.createElement(Atom, { className: "w-3.5 h-3.5" }),
  Viruses: React.createElement(Shield, { className: "w-3.5 h-3.5" }),
  Enzymes: React.createElement(FlaskConical, { className: "w-3.5 h-3.5" }),
  Signaling: React.createElement(Zap, { className: "w-3.5 h-3.5" }),
  Membrane: React.createElement(Sigma, { className: "w-3.5 h-3.5" }),
  Ribosomes: React.createElement(Microscope, { className: "w-3.5 h-3.5" }),
  Antibodies: React.createElement(Shield, { className: "w-3.5 h-3.5" }),
  Structural: React.createElement(Layers, { className: "w-3.5 h-3.5" }),
  Hormones: React.createElement(Zap, { className: "w-3.5 h-3.5" }),
  Plants: React.createElement(Leaf, { className: "w-3.5 h-3.5" }),
  Bacteria: React.createElement(Activity, { className: "w-3.5 h-3.5" }),
};

export const STYLE_COLORS: Record<RenderStyle, string> = {
  cartoon: "hsl(262 80% 60%)",
  stick: "hsl(160 70% 45%)",
  sphere: "hsl(35 90% 55%)",
  surface: "hsl(300 60% 55%)",
};

// ─── Category → route mapping ─────────────────────────────────────────────────
export function getCategoryRoute(category: Category | string): string {
  if (category === "Anatomy") return "#/anatomy";
  if (category === "Plants") return "#/plants";
  if (category === "Bacteria") return "#/bacteria";
  return "#/molecular";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getStructureByPdbId(pdbId: string): Structure | undefined {
  return STRUCTURES.find((s) => s.pdbId === pdbId);
}

export function getStructuresByCategory(category: string): Structure[] {
  if (category === "All") return STRUCTURES;
  return STRUCTURES.filter((s) => s.category === category);
}

// ─── Science facts per structure ──────────────────────────────────────────────
export const STRUCTURE_FACTS: Record<
  string,
  { year: string; weight: string; function: string; facts: string[] }
> = {
  "1BNA": {
    year: "1980",
    weight: "7,421 Da",
    function:
      "Encodes genetic information in the classic Watson-Crick double helix.",
    facts: [
      "Contains 12 base pairs in the canonical B-form conformation.",
      "Helical repeat of 10 bp/turn with a rise of 3.4 Å per base pair.",
      "First high-resolution crystal structure of B-form DNA.",
    ],
  },
  "1GZX": {
    year: "1960",
    weight: "64,500 Da",
    function:
      "Transports oxygen from lungs to tissues via four heme-containing subunits.",
    facts: [
      "Tetrameric protein with α2β2 quaternary structure.",
      "Cooperative oxygen binding follows a sigmoidal binding curve.",
      "Bohr effect links pH and CO₂ to oxygen affinity.",
    ],
  },
  "4INS": {
    year: "1969",
    weight: "5,808 Da",
    function:
      "Regulates blood glucose by facilitating cellular glucose uptake.",
    facts: [
      "First protein to be chemically synthesized (1963) and sequenced (1951).",
      "Contains two chains (A and B) linked by disulfide bonds.",
      "Stored as zinc hexamers in pancreatic β-cells.",
    ],
  },
  "6VXX": {
    year: "2020",
    weight: "~140,000 Da",
    function:
      "Binds ACE2 receptors on human cells to initiate SARS-CoV-2 infection.",
    facts: [
      "Homotrimeric fusion protein with prefusion conformation.",
      "Heavily glycosylated surface shields from immune detection.",
      "Primary target of COVID-19 vaccines and neutralizing antibodies.",
    ],
  },
  "1HIV": {
    year: "1989",
    weight: "21,561 Da",
    function:
      "Cleaves viral polyprotein to produce mature infectious HIV-1 particles.",
    facts: [
      "Homodimeric aspartyl protease essential for viral replication.",
      "Target of HIV protease inhibitors used in antiretroviral therapy.",
      "Flap regions open to allow substrate binding then close for catalysis.",
    ],
  },
  "4V9D": {
    year: "2011",
    weight: "~2,500,000 Da",
    function:
      "Translates messenger RNA into protein sequences in all living cells.",
    facts: [
      "Complete 70S ribosome composed of 50S and 30S subunits.",
      "Contains >50 proteins and multiple ribosomal RNA molecules.",
      "Decodes mRNA codons via anticodon of transfer RNA.",
    ],
  },
  "1IGT": {
    year: "1997",
    weight: "~150,000 Da",
    function:
      "Neutralizes pathogens and marks them for destruction by the immune system.",
    facts: [
      "Y-shaped glycoprotein with two antigen-binding Fab arms.",
      "Most abundant antibody in serum, constituting ~75% of all Ig.",
      "Four subclasses (IgG1-4) with distinct effector functions.",
    ],
  },
  "1ATP": {
    year: "1991",
    weight: "40,600 Da",
    function:
      "Phosphorylates serine/threonine residues in response to cAMP signaling.",
    facts: [
      "Prototypical kinase with conserved bilobal fold.",
      "Activated by cAMP-induced release of regulatory subunits.",
      "Template for understanding kinase inhibitor drug design.",
    ],
  },
  "1LYZ": {
    year: "1965",
    weight: "14,313 Da",
    function:
      "Destroys bacterial cell walls by cleaving the peptidoglycan sugar backbone.",
    facts: [
      "First enzyme structure solved by X-ray crystallography.",
      "Found in tears, saliva, and breast milk as part of innate immunity.",
      "Catalytic mechanism involves Asp52 and Glu35 residues.",
    ],
  },
  HUMAN_ANATOMY: {
    year: "N/A",
    weight: "N/A",
    function:
      "Interactive atlas of human skeletal and organ systems for educational exploration.",
    facts: [
      "206 bones in the adult human skeleton forming the structural framework.",
      "78 organs performing specialized physiological functions.",
      "11 organ systems working in coordinated harmony to sustain life.",
    ],
  },
};

export function getStructureFacts(pdbId: string) {
  return (
    STRUCTURE_FACTS[pdbId] ?? {
      year: "Unknown",
      weight: "Unknown",
      function:
        "A scientifically significant molecular structure with important biological roles.",
      facts: [
        "Characterized by X-ray crystallography or cryo-electron microscopy.",
        "Deposited in the RCSB Protein Data Bank for open scientific access.",
        "Used in research to understand biological function and drug design.",
      ],
    }
  );
}
