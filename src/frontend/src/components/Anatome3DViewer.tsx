import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const PART_DATA: Record<string, string> = {
  "Frontal Bone":
    "Forms the forehead and upper eye sockets, protecting the frontal lobe of the brain.",
  "Left Parietal Bone":
    "Left bone forming the upper-left side and roof of the skull, protecting the parietal lobe.",
  "Right Parietal Bone":
    "Right bone forming the upper-right side and roof of the skull, protecting the parietal lobe.",
  "Left Temporal Bone":
    "Left skull bone containing the ear canal and housing the organs of hearing and balance.",
  "Right Temporal Bone":
    "Right skull bone containing the ear canal and housing the organs of hearing and balance.",
  "Occipital Bone":
    "Posterior skull bone containing the foramen magnum through which the spinal cord passes.",
  "Sphenoid Bone":
    "Butterfly-shaped central skull bone forming part of the eye sockets and skull base.",
  "Ethmoid Bone":
    "Lightweight bone forming part of the nasal cavity and the medial wall of the orbits.",
  "Left Nasal Bone":
    "Small flat bone forming the bridge of the nose on the left side.",
  "Right Nasal Bone":
    "Small flat bone forming the bridge of the nose on the right side.",
  "Left Maxilla":
    "Upper jaw bone on the left, bearing the upper teeth and forming part of the palate.",
  "Right Maxilla":
    "Upper jaw bone on the right, bearing the upper teeth and forming part of the palate.",
  "Left Zygomatic Bone":
    "Left cheekbone forming the prominence of the cheek and part of the orbit.",
  "Right Zygomatic Bone":
    "Right cheekbone forming the prominence of the cheek and part of the orbit.",
  "Left Lacrimal Bone":
    "Smallest and most fragile facial bone, on the left, forming part of the inner eye socket.",
  "Right Lacrimal Bone":
    "Smallest and most fragile facial bone, on the right, forming part of the inner eye socket.",
  "Left Palatine Bone":
    "L-shaped bone forming part of the hard palate and floor of the orbit on the left.",
  "Right Palatine Bone":
    "L-shaped bone forming part of the hard palate and floor of the orbit on the right.",
  "Left Inferior Nasal Concha":
    "Left scroll-shaped bone projecting from the lateral nasal wall, filtering air.",
  "Right Inferior Nasal Concha":
    "Right scroll-shaped bone projecting from the lateral nasal wall, filtering air.",
  Vomer: "Thin flat bone forming the posterior and inferior nasal septum.",
  Mandible:
    "The only movable skull bone — the lower jaw that holds the lower teeth.",
  "Left Malleus":
    "Hammer-shaped ossicle in the left middle ear, attached to the eardrum.",
  "Right Malleus":
    "Hammer-shaped ossicle in the right middle ear, attached to the eardrum.",
  "Left Incus":
    "Anvil-shaped ossicle in the left middle ear, connecting the malleus and stapes.",
  "Right Incus":
    "Anvil-shaped ossicle in the right middle ear, connecting the malleus and stapes.",
  "Left Stapes":
    "Stirrup-shaped ossicle in the left middle ear — the smallest bone in the human body.",
  "Right Stapes":
    "Stirrup-shaped ossicle in the right middle ear — the smallest bone in the human body.",
  "Hyoid Bone":
    "U-shaped bone in the neck supporting the tongue and larynx, the only bone with no joints.",
  "C1 (Atlas)":
    "First cervical vertebra supporting the skull and allowing head nodding.",
  "C2 (Axis)":
    "Second cervical vertebra with a peg (dens) allowing head rotation.",
  "C3 Vertebra": "Third cervical vertebra of the neck column.",
  "C4 Vertebra": "Fourth cervical vertebra of the neck column.",
  "C5 Vertebra": "Fifth cervical vertebra; injuries here can affect breathing.",
  "C6 Vertebra": "Sixth cervical vertebra with prominent spinous process.",
  "C7 Vertebra":
    "Seventh cervical vertebra — the 'vertebra prominens', visible at neck base.",
  "T1 Vertebra": "First thoracic vertebra articulating with the first rib.",
  "T2 Vertebra": "Second thoracic vertebra of the upper back.",
  "T3 Vertebra": "Third thoracic vertebra of the upper back.",
  "T4 Vertebra":
    "Fourth thoracic vertebra, approximately level with the sternal angle.",
  "T5 Vertebra": "Fifth thoracic vertebra of the mid-upper back.",
  "T6 Vertebra": "Sixth thoracic vertebra of the mid-back.",
  "T7 Vertebra": "Seventh thoracic vertebra of the mid-back.",
  "T8 Vertebra": "Eighth thoracic vertebra of the mid-back.",
  "T9 Vertebra": "Ninth thoracic vertebra of the lower-mid back.",
  "T10 Vertebra": "Tenth thoracic vertebra near the lower back.",
  "T11 Vertebra":
    "Eleventh thoracic vertebra articulating with the floating ribs.",
  "T12 Vertebra":
    "Twelfth thoracic vertebra, the last to articulate with ribs.",
  "L1 Vertebra": "First lumbar vertebra — the start of the lower back region.",
  "L2 Vertebra": "Second lumbar vertebra of the lower back.",
  "L3 Vertebra": "Third lumbar vertebra at the center of the lumbar curve.",
  "L4 Vertebra":
    "Fourth lumbar vertebra, commonly affected by disc herniation.",
  "L5 Vertebra":
    "Fifth lumbar vertebra bearing the most axial load of the spine.",
  Sacrum:
    "Triangular bone at the base of the spine formed from 5 fused vertebrae.",
  Coccyx:
    "The tailbone, 3–5 fused rudimentary vertebrae at the very base of the spine.",
  Sternum:
    "Breastbone — flat bone in the chest center connecting ribs via cartilage.",
  "Left Rib 1":
    "First (true) rib on the left, the most curved rib, protecting subclavian vessels.",
  "Right Rib 1": "First (true) rib on the right, the most curved rib.",
  "Left Rib 2": "Second true rib on the left side.",
  "Right Rib 2": "Second true rib on the right side.",
  "Left Rib 3": "Third true rib on the left.",
  "Right Rib 3": "Third true rib on the right.",
  "Left Rib 4": "Fourth true rib on the left.",
  "Right Rib 4": "Fourth true rib on the right.",
  "Left Rib 5": "Fifth true rib on the left.",
  "Right Rib 5": "Fifth true rib on the right.",
  "Left Rib 6": "Sixth true rib on the left.",
  "Right Rib 6": "Sixth true rib on the right.",
  "Left Rib 7":
    "Seventh true rib on the left, the last to attach directly to the sternum.",
  "Right Rib 7":
    "Seventh true rib on the right, the last to attach directly to the sternum.",
  "Left Rib 8":
    "Eighth (false) rib on the left, attaching via costal cartilage of rib 7.",
  "Right Rib 8": "Eighth (false) rib on the right.",
  "Left Rib 9": "Ninth (false) rib on the left.",
  "Right Rib 9": "Ninth (false) rib on the right.",
  "Left Rib 10": "Tenth (false) rib on the left.",
  "Right Rib 10": "Tenth (false) rib on the right.",
  "Left Rib 11":
    "Eleventh (floating) rib on the left — no attachment to sternum.",
  "Right Rib 11": "Eleventh (floating) rib on the right.",
  "Left Rib 12": "Twelfth (floating) rib on the left, the shortest rib.",
  "Right Rib 12": "Twelfth (floating) rib on the right.",
  "Left Clavicle":
    "Left collarbone acting as a strut holding the shoulder away from the chest.",
  "Right Clavicle":
    "Right collarbone acting as a strut holding the shoulder away from the chest.",
  "Left Scapula":
    "Left shoulder blade — triangular bone anchoring arm muscles to the thorax.",
  "Right Scapula":
    "Right shoulder blade — triangular bone anchoring arm muscles to the thorax.",
  "Left Humerus":
    "Left upper arm bone forming joints at the shoulder and elbow.",
  "Right Humerus":
    "Right upper arm bone forming joints at the shoulder and elbow.",
  "Left Radius":
    "Left forearm bone on the thumb side, rotating around the ulna.",
  "Right Radius": "Right forearm bone on the thumb side.",
  "Left Ulna": "Left forearm bone forming the point of the elbow.",
  "Right Ulna": "Right forearm bone forming the point of the elbow.",
  "Left Scaphoid":
    "Most frequently fractured carpal bone in the left wrist, on the thumb side.",
  "Right Scaphoid": "Most frequently fractured carpal bone in the right wrist.",
  "Left Lunate":
    "Moon-shaped wrist bone in the left hand, prone to dislocation.",
  "Right Lunate": "Moon-shaped wrist bone in the right hand.",
  "Left Triquetrum":
    "Three-cornered wrist bone on the pinky side of the left wrist.",
  "Right Triquetrum":
    "Three-cornered wrist bone on the pinky side of the right wrist.",
  "Left Pisiform":
    "Pea-shaped sesamoid bone in the left wrist, smallest carpal bone.",
  "Right Pisiform": "Pea-shaped sesamoid bone in the right wrist.",
  "Left Trapezium": "Left wrist bone at the base of the thumb.",
  "Right Trapezium": "Right wrist bone at the base of the thumb.",
  "Left Trapezoid": "Smallest bone in the distal row of left carpals.",
  "Right Trapezoid": "Smallest bone in the distal row of right carpals.",
  "Left Capitate":
    "Largest wrist bone in the left hand, located centrally in the wrist.",
  "Right Capitate": "Largest wrist bone in the right hand.",
  "Left Hamate":
    "Left wrist bone with a hook process, articulating with the ring and little fingers.",
  "Right Hamate": "Right wrist bone with a hook process.",
  "Left Metacarpal 1": "Thumb metacarpal of the left hand.",
  "Left Metacarpal 2": "Index finger metacarpal of the left hand.",
  "Left Metacarpal 3": "Middle finger metacarpal of the left hand.",
  "Left Metacarpal 4": "Ring finger metacarpal of the left hand.",
  "Left Metacarpal 5": "Little finger metacarpal of the left hand.",
  "Right Metacarpal 1": "Thumb metacarpal of the right hand.",
  "Right Metacarpal 2": "Index finger metacarpal of the right hand.",
  "Right Metacarpal 3": "Middle finger metacarpal of the right hand.",
  "Right Metacarpal 4": "Ring finger metacarpal of the right hand.",
  "Right Metacarpal 5": "Little finger metacarpal of the right hand.",
  "Left Thumb Proximal Phalanx": "First phalanx of the left thumb.",
  "Left Thumb Distal Phalanx": "Tip bone of the left thumb.",
  "Left Index Proximal Phalanx": "Base phalanx of the left index finger.",
  "Left Index Middle Phalanx": "Middle phalanx of the left index finger.",
  "Left Index Distal Phalanx": "Tip phalanx of the left index finger.",
  "Left Middle Proximal Phalanx": "Base phalanx of the left middle finger.",
  "Left Middle Middle Phalanx": "Middle phalanx of the left middle finger.",
  "Left Middle Distal Phalanx": "Tip phalanx of the left middle finger.",
  "Left Ring Proximal Phalanx": "Base phalanx of the left ring finger.",
  "Left Ring Middle Phalanx": "Middle phalanx of the left ring finger.",
  "Left Ring Distal Phalanx": "Tip phalanx of the left ring finger.",
  "Left Little Proximal Phalanx": "Base phalanx of the left little finger.",
  "Left Little Middle Phalanx": "Middle phalanx of the left little finger.",
  "Left Little Distal Phalanx": "Tip phalanx of the left little finger.",
  "Right Thumb Proximal Phalanx": "First phalanx of the right thumb.",
  "Right Thumb Distal Phalanx": "Tip bone of the right thumb.",
  "Right Index Proximal Phalanx": "Base phalanx of the right index finger.",
  "Right Index Middle Phalanx": "Middle phalanx of the right index finger.",
  "Right Index Distal Phalanx": "Tip phalanx of the right index finger.",
  "Right Middle Proximal Phalanx": "Base phalanx of the right middle finger.",
  "Right Middle Middle Phalanx": "Middle phalanx of the right middle finger.",
  "Right Middle Distal Phalanx": "Tip phalanx of the right middle finger.",
  "Right Ring Proximal Phalanx": "Base phalanx of the right ring finger.",
  "Right Ring Middle Phalanx": "Middle phalanx of the right ring finger.",
  "Right Ring Distal Phalanx": "Tip phalanx of the right ring finger.",
  "Right Little Proximal Phalanx": "Base phalanx of the right little finger.",
  "Right Little Middle Phalanx": "Middle phalanx of the right little finger.",
  "Right Little Distal Phalanx": "Tip phalanx of the right little finger.",
  "Left Hip Bone (Os Coxa)":
    "Left hip bone comprising fused ilium, ischium, and pubis.",
  "Right Hip Bone (Os Coxa)":
    "Right hip bone comprising fused ilium, ischium, and pubis.",
  "Left Femur": "Left thigh bone — the longest and strongest bone in the body.",
  "Right Femur":
    "Right thigh bone — the longest and strongest bone in the body.",
  "Left Patella":
    "Left kneecap embedded in the quadriceps tendon, protecting the knee joint.",
  "Right Patella": "Right kneecap protecting the knee joint.",
  "Left Tibia":
    "Left shin bone — the larger weight-bearing bone of the lower leg.",
  "Right Tibia":
    "Right shin bone — the larger weight-bearing bone of the lower leg.",
  "Left Fibula":
    "Slender left lower leg bone alongside the tibia, mainly for muscle attachment.",
  "Right Fibula": "Slender right lower leg bone alongside the tibia.",
  "Left Talus": "Left ankle bone transmitting body weight from leg to foot.",
  "Right Talus": "Right ankle bone transmitting body weight from leg to foot.",
  "Left Calcaneus": "Left heel bone — the largest tarsal bone.",
  "Right Calcaneus": "Right heel bone — the largest tarsal bone.",
  "Left Navicular":
    "Boat-shaped left ankle bone on the medial side of the foot.",
  "Right Navicular": "Boat-shaped right ankle bone.",
  "Left Medial Cuneiform":
    "Left medial cuneiform articulating with the first metatarsal.",
  "Right Medial Cuneiform":
    "Right medial cuneiform articulating with the first metatarsal.",
  "Left Intermediate Cuneiform":
    "Left intermediate cuneiform, the smallest of the cuneiforms.",
  "Right Intermediate Cuneiform": "Right intermediate cuneiform.",
  "Left Lateral Cuneiform":
    "Left lateral cuneiform articulating with the second and third metatarsals.",
  "Right Lateral Cuneiform": "Right lateral cuneiform.",
  "Left Cuboid":
    "Left cuboid bone on the outer foot, articulating with the fourth and fifth metatarsals.",
  "Right Cuboid": "Right cuboid bone on the outer foot.",
  "Left Metatarsal 1": "Left first metatarsal connecting to the big toe.",
  "Left Metatarsal 2": "Left second metatarsal, the longest metatarsal.",
  "Left Metatarsal 3": "Left third metatarsal.",
  "Left Metatarsal 4": "Left fourth metatarsal.",
  "Left Metatarsal 5":
    "Left fifth metatarsal with prominent base on the outer foot.",
  "Right Metatarsal 1": "Right first metatarsal connecting to the big toe.",
  "Right Metatarsal 2": "Right second metatarsal.",
  "Right Metatarsal 3": "Right third metatarsal.",
  "Right Metatarsal 4": "Right fourth metatarsal.",
  "Right Metatarsal 5":
    "Right fifth metatarsal with prominent base on the outer foot.",
  "Left Big Toe Proximal Phalanx": "First phalanx of the left big toe.",
  "Left Big Toe Distal Phalanx": "Tip bone of the left big toe.",
  "Left 2nd Toe Proximal Phalanx": "Base phalanx of the left second toe.",
  "Left 2nd Toe Middle Phalanx": "Middle phalanx of the left second toe.",
  "Left 2nd Toe Distal Phalanx": "Tip phalanx of the left second toe.",
  "Left 3rd Toe Proximal Phalanx": "Base phalanx of the left third toe.",
  "Left 3rd Toe Middle Phalanx": "Middle phalanx of the left third toe.",
  "Left 3rd Toe Distal Phalanx": "Tip phalanx of the left third toe.",
  "Left 4th Toe Proximal Phalanx": "Base phalanx of the left fourth toe.",
  "Left 4th Toe Middle Phalanx": "Middle phalanx of the left fourth toe.",
  "Left 4th Toe Distal Phalanx": "Tip phalanx of the left fourth toe.",
  "Left 5th Toe Proximal Phalanx": "Base phalanx of the left little toe.",
  "Left 5th Toe Middle Phalanx": "Middle phalanx of the left little toe.",
  "Left 5th Toe Distal Phalanx": "Tip phalanx of the left little toe.",
  "Right Big Toe Proximal Phalanx": "First phalanx of the right big toe.",
  "Right Big Toe Distal Phalanx": "Tip bone of the right big toe.",
  "Right 2nd Toe Proximal Phalanx": "Base phalanx of the right second toe.",
  "Right 2nd Toe Middle Phalanx": "Middle phalanx of the right second toe.",
  "Right 2nd Toe Distal Phalanx": "Tip phalanx of the right second toe.",
  "Right 3rd Toe Proximal Phalanx": "Base phalanx of the right third toe.",
  "Right 3rd Toe Middle Phalanx": "Middle phalanx of the right third toe.",
  "Right 3rd Toe Distal Phalanx": "Tip phalanx of the right third toe.",
  "Right 4th Toe Proximal Phalanx": "Base phalanx of the right fourth toe.",
  "Right 4th Toe Middle Phalanx": "Middle phalanx of the right fourth toe.",
  "Right 4th Toe Distal Phalanx": "Tip phalanx of the right fourth toe.",
  "Right 5th Toe Proximal Phalanx": "Base phalanx of the right little toe.",
  "Right 5th Toe Middle Phalanx": "Middle phalanx of the right little toe.",
  "Right 5th Toe Distal Phalanx": "Tip phalanx of the right little toe.",
  // Legacy keys for hover on geometry
  Clavicle: "Collarbone connecting the sternum to the shoulder blade.",
  Scapula: "Shoulder blade anchoring arm muscles to the thorax.",
  "True Ribs":
    "Ribs 1–7 attaching directly to the sternum via costal cartilage.",
  "False Ribs": "Ribs 8–10 attaching indirectly to the sternum.",
  "Floating Ribs": "Ribs 11–12 with no sternal attachment.",
  Humerus: "Upper arm bone forming joints at the shoulder and elbow.",
  Radius: "Forearm bone on the thumb side, rotating around the ulna.",
  Ulna: "Forearm bone forming the point of the elbow.",
  Carpals: "Eight small wrist bones providing flexibility and movement.",
  Scaphoid: "The most commonly fractured carpal bone, on the thumb side.",
  Lunate: "Moon-shaped carpal bone in the wrist, prone to dislocation.",
  Metacarpals: "Five palm bones connecting wrist to fingers.",
  Phalanges: "Bones of the fingers and toes.",
  Ilium: "Large upper wing of the hip bone transmitting weight to the legs.",
  Pubis: "Anterior lower portion of the hip bone.",
  Ischium: "Lower and back part of the hip bone — the part you sit on.",
  Femur: "The longest and strongest bone in the body — the thigh bone.",
  Patella: "The kneecap, protecting the knee joint.",
  Tibia: "The shin bone, the larger weight-bearing bone of the lower leg.",
  Fibula: "Slender lower leg bone alongside the tibia.",
  Tarsals: "Seven ankle and rear foot bones.",
  Calcaneus: "The heel bone — largest tarsal bone.",
  Talus: "Ankle bone transmitting body weight from leg to foot.",
  Metatarsals: "Five long foot bones connecting ankle to toes.",
  "Vertebral Column": "The spine — 33 vertebrae protecting the spinal cord.",
  Lumbar: "Five large lower-back vertebrae bearing most body weight.",
  "Cervical Vertebrae": "The seven neck vertebrae supporting the skull.",
  Brain: "Central organ of the nervous system.",
  Heart: "Muscular pump circulating blood throughout the body.",
  Lungs: "Paired elastic organs exchanging oxygen and carbon dioxide.",
  Liver: "Largest internal organ involved in metabolism and detoxification.",
  Stomach: "Muscular sac where major food digestion occurs.",
  Intestines: "Long tube where nutrient absorption and waste formation occur.",
  "Outer Body": "The skin and silhouette providing protection and structure.",
};

interface BoneMarker {
  name: string;
  pos: [number, number, number];
  desc?: string;
}

// All 206 bones with anatomical positions in the Three.js model space
// Coordinate system: head ~y=2.1, feet ~y=-0.9, center x=0, front z+
const BONES_206: BoneMarker[] = [
  // ── SKULL CRANIUM (8 bones) ───────────────────────────────
  { name: "Frontal Bone", pos: [0, 2.1, 0.12] },
  { name: "Left Parietal Bone", pos: [-0.09, 2.14, -0.02] },
  { name: "Right Parietal Bone", pos: [0.09, 2.14, -0.02] },
  { name: "Left Temporal Bone", pos: [-0.16, 2.02, 0.02] },
  { name: "Right Temporal Bone", pos: [0.16, 2.02, 0.02] },
  { name: "Occipital Bone", pos: [0, 1.97, -0.14] },
  { name: "Sphenoid Bone", pos: [0, 1.97, 0.06] },
  { name: "Ethmoid Bone", pos: [0, 1.98, 0.1] },
  // ── SKULL FACE (14 bones) ────────────────────────────────
  { name: "Left Nasal Bone", pos: [-0.03, 1.97, 0.14] },
  { name: "Right Nasal Bone", pos: [0.03, 1.97, 0.14] },
  { name: "Left Maxilla", pos: [-0.05, 1.89, 0.12] },
  { name: "Right Maxilla", pos: [0.05, 1.89, 0.12] },
  { name: "Left Zygomatic Bone", pos: [-0.13, 1.93, 0.1] },
  { name: "Right Zygomatic Bone", pos: [0.13, 1.93, 0.1] },
  { name: "Left Lacrimal Bone", pos: [-0.05, 1.98, 0.12] },
  { name: "Right Lacrimal Bone", pos: [0.05, 1.98, 0.12] },
  { name: "Left Palatine Bone", pos: [-0.04, 1.89, 0.08] },
  { name: "Right Palatine Bone", pos: [0.04, 1.89, 0.08] },
  { name: "Left Inferior Nasal Concha", pos: [-0.04, 1.92, 0.1] },
  { name: "Right Inferior Nasal Concha", pos: [0.04, 1.92, 0.1] },
  { name: "Vomer", pos: [0, 1.91, 0.09] },
  { name: "Mandible", pos: [0, 1.82, 0.1] },
  // ── EAR OSSICLES (6 bones) ──────────────────────────────
  { name: "Left Malleus", pos: [-0.17, 2.03, 0.01] },
  { name: "Right Malleus", pos: [0.17, 2.03, 0.01] },
  { name: "Left Incus", pos: [-0.17, 2.02, -0.01] },
  { name: "Right Incus", pos: [0.17, 2.02, -0.01] },
  { name: "Left Stapes", pos: [-0.17, 2.01, 0.0] },
  { name: "Right Stapes", pos: [0.17, 2.01, 0.0] },
  // ── HYOID (1 bone) ───────────────────────────────────────
  { name: "Hyoid Bone", pos: [0, 1.76, 0.1] },
  // ── CERVICAL VERTEBRAE (7 bones) ────────────────────────
  { name: "C1 (Atlas)", pos: [0.12, 1.78, -0.01] },
  { name: "C2 (Axis)", pos: [0.12, 1.745, -0.01] },
  { name: "C3 Vertebra", pos: [0.12, 1.71, -0.01] },
  { name: "C4 Vertebra", pos: [0.12, 1.675, -0.01] },
  { name: "C5 Vertebra", pos: [0.12, 1.64, -0.01] },
  { name: "C6 Vertebra", pos: [0.12, 1.605, -0.01] },
  { name: "C7 Vertebra", pos: [0.12, 1.57, -0.01] },
  // ── THORACIC VERTEBRAE (12 bones) ───────────────────────
  { name: "T1 Vertebra", pos: [0.12, 1.535, -0.04] },
  { name: "T2 Vertebra", pos: [0.12, 1.48, -0.04] },
  { name: "T3 Vertebra", pos: [0.12, 1.425, -0.04] },
  { name: "T4 Vertebra", pos: [0.12, 1.37, -0.04] },
  { name: "T5 Vertebra", pos: [0.12, 1.315, -0.04] },
  { name: "T6 Vertebra", pos: [0.12, 1.26, -0.04] },
  { name: "T7 Vertebra", pos: [0.12, 1.205, -0.04] },
  { name: "T8 Vertebra", pos: [0.12, 1.15, -0.04] },
  { name: "T9 Vertebra", pos: [0.12, 1.095, -0.04] },
  { name: "T10 Vertebra", pos: [0.12, 1.04, -0.04] },
  { name: "T11 Vertebra", pos: [0.12, 0.985, -0.04] },
  { name: "T12 Vertebra", pos: [0.12, 0.93, -0.04] },
  // ── LUMBAR VERTEBRAE (5 bones) ───────────────────────────
  { name: "L1 Vertebra", pos: [0.12, 0.96, -0.04] },
  { name: "L2 Vertebra", pos: [0.12, 0.9, -0.04] },
  { name: "L3 Vertebra", pos: [0.12, 0.84, -0.04] },
  { name: "L4 Vertebra", pos: [0.12, 0.78, -0.04] },
  { name: "L5 Vertebra", pos: [0.12, 0.72, -0.04] },
  // ── SACRUM & COCCYX ──────────────────────────────────────
  { name: "Sacrum", pos: [0.12, 0.65, -0.04] },
  { name: "Coccyx", pos: [0.12, 0.56, -0.02] },
  // ── THORAX ─────────────────────────────────────────────
  { name: "Sternum", pos: [-0.12, 1.52, 0.12] },
  { name: "Left Rib 1", pos: [-0.12, 1.57, 0.0] },
  { name: "Right Rib 1", pos: [0.12, 1.57, 0.0] },
  { name: "Left Rib 2", pos: [-0.15, 1.52, 0.0] },
  { name: "Right Rib 2", pos: [0.15, 1.52, 0.0] },
  { name: "Left Rib 3", pos: [-0.17, 1.47, 0.0] },
  { name: "Right Rib 3", pos: [0.17, 1.47, 0.0] },
  { name: "Left Rib 4", pos: [-0.19, 1.42, 0.0] },
  { name: "Right Rib 4", pos: [0.19, 1.42, 0.0] },
  { name: "Left Rib 5", pos: [-0.2, 1.37, 0.0] },
  { name: "Right Rib 5", pos: [0.2, 1.37, 0.0] },
  { name: "Left Rib 6", pos: [-0.21, 1.32, 0.0] },
  { name: "Right Rib 6", pos: [0.21, 1.32, 0.0] },
  { name: "Left Rib 7", pos: [-0.21, 1.27, 0.0] },
  { name: "Right Rib 7", pos: [0.21, 1.27, 0.0] },
  { name: "Left Rib 8", pos: [-0.22, 1.22, 0.0] },
  { name: "Right Rib 8", pos: [0.22, 1.22, 0.0] },
  { name: "Left Rib 9", pos: [-0.22, 1.17, 0.0] },
  { name: "Right Rib 9", pos: [0.22, 1.17, 0.0] },
  { name: "Left Rib 10", pos: [-0.22, 1.12, 0.0] },
  { name: "Right Rib 10", pos: [0.22, 1.12, 0.0] },
  { name: "Left Rib 11", pos: [-0.21, 1.07, -0.02] },
  { name: "Right Rib 11", pos: [0.21, 1.07, -0.02] },
  { name: "Left Rib 12", pos: [-0.2, 1.01, -0.03] },
  { name: "Right Rib 12", pos: [0.2, 1.01, -0.03] },
  // ── SHOULDER GIRDLE ─────────────────────────────────────
  { name: "Left Clavicle", pos: [-0.22, 1.68, 0.04] },
  { name: "Right Clavicle", pos: [0.22, 1.68, 0.04] },
  { name: "Left Scapula", pos: [-0.36, 1.58, -0.06] },
  { name: "Right Scapula", pos: [0.36, 1.58, -0.06] },
  // ── UPPER ARM ───────────────────────────────────────────
  { name: "Left Humerus", pos: [-0.44, 1.44, 0.0] },
  { name: "Right Humerus", pos: [0.44, 1.44, 0.0] },
  // ── FOREARM ─────────────────────────────────────────────
  { name: "Left Radius", pos: [-0.49, 1.07, 0.02] },
  { name: "Right Radius", pos: [0.49, 1.07, 0.02] },
  { name: "Left Ulna", pos: [-0.51, 1.07, -0.02] },
  { name: "Right Ulna", pos: [0.51, 1.07, -0.02] },
  // ── LEFT CARPALS (8 bones) ───────────────────────────────
  { name: "Left Scaphoid", pos: [-0.54, 0.82, 0.02] },
  { name: "Left Lunate", pos: [-0.52, 0.82, 0.0] },
  { name: "Left Triquetrum", pos: [-0.5, 0.82, -0.02] },
  { name: "Left Pisiform", pos: [-0.49, 0.81, -0.02] },
  { name: "Left Trapezium", pos: [-0.54, 0.79, 0.02] },
  { name: "Left Trapezoid", pos: [-0.52, 0.79, 0.01] },
  { name: "Left Capitate", pos: [-0.51, 0.79, 0.0] },
  { name: "Left Hamate", pos: [-0.49, 0.79, -0.02] },
  // ── LEFT METACARPALS (5 bones) ───────────────────────────
  { name: "Left Metacarpal 1", pos: [-0.55, 0.74, 0.02] },
  { name: "Left Metacarpal 2", pos: [-0.53, 0.74, 0.01] },
  { name: "Left Metacarpal 3", pos: [-0.51, 0.74, 0.0] },
  { name: "Left Metacarpal 4", pos: [-0.49, 0.74, -0.01] },
  { name: "Left Metacarpal 5", pos: [-0.47, 0.74, -0.02] },
  // ── LEFT PHALANGES (14 bones) ────────────────────────────
  { name: "Left Thumb Proximal Phalanx", pos: [-0.56, 0.68, 0.02] },
  { name: "Left Thumb Distal Phalanx", pos: [-0.57, 0.63, 0.02] },
  { name: "Left Index Proximal Phalanx", pos: [-0.53, 0.67, 0.01] },
  { name: "Left Index Middle Phalanx", pos: [-0.53, 0.62, 0.01] },
  { name: "Left Index Distal Phalanx", pos: [-0.53, 0.58, 0.01] },
  { name: "Left Middle Proximal Phalanx", pos: [-0.51, 0.67, 0.0] },
  { name: "Left Middle Middle Phalanx", pos: [-0.51, 0.62, 0.0] },
  { name: "Left Middle Distal Phalanx", pos: [-0.51, 0.57, 0.0] },
  { name: "Left Ring Proximal Phalanx", pos: [-0.49, 0.67, -0.01] },
  { name: "Left Ring Middle Phalanx", pos: [-0.49, 0.62, -0.01] },
  { name: "Left Ring Distal Phalanx", pos: [-0.49, 0.58, -0.01] },
  { name: "Left Little Proximal Phalanx", pos: [-0.47, 0.67, -0.02] },
  { name: "Left Little Middle Phalanx", pos: [-0.47, 0.62, -0.02] },
  { name: "Left Little Distal Phalanx", pos: [-0.47, 0.59, -0.02] },
  // ── RIGHT CARPALS (8 bones) ──────────────────────────────
  { name: "Right Scaphoid", pos: [0.54, 0.82, 0.02] },
  { name: "Right Lunate", pos: [0.52, 0.82, 0.0] },
  { name: "Right Triquetrum", pos: [0.5, 0.82, -0.02] },
  { name: "Right Pisiform", pos: [0.49, 0.81, -0.02] },
  { name: "Right Trapezium", pos: [0.54, 0.79, 0.02] },
  { name: "Right Trapezoid", pos: [0.52, 0.79, 0.01] },
  { name: "Right Capitate", pos: [0.51, 0.79, 0.0] },
  { name: "Right Hamate", pos: [0.49, 0.79, -0.02] },
  // ── RIGHT METACARPALS (5 bones) ──────────────────────────
  { name: "Right Metacarpal 1", pos: [0.55, 0.74, 0.02] },
  { name: "Right Metacarpal 2", pos: [0.53, 0.74, 0.01] },
  { name: "Right Metacarpal 3", pos: [0.51, 0.74, 0.0] },
  { name: "Right Metacarpal 4", pos: [0.49, 0.74, -0.01] },
  { name: "Right Metacarpal 5", pos: [0.47, 0.74, -0.02] },
  // ── RIGHT PHALANGES (14 bones) ───────────────────────────
  { name: "Right Thumb Proximal Phalanx", pos: [0.56, 0.68, 0.02] },
  { name: "Right Thumb Distal Phalanx", pos: [0.57, 0.63, 0.02] },
  { name: "Right Index Proximal Phalanx", pos: [0.53, 0.67, 0.01] },
  { name: "Right Index Middle Phalanx", pos: [0.53, 0.62, 0.01] },
  { name: "Right Index Distal Phalanx", pos: [0.53, 0.58, 0.01] },
  { name: "Right Middle Proximal Phalanx", pos: [0.51, 0.67, 0.0] },
  { name: "Right Middle Middle Phalanx", pos: [0.51, 0.62, 0.0] },
  { name: "Right Middle Distal Phalanx", pos: [0.51, 0.57, 0.0] },
  { name: "Right Ring Proximal Phalanx", pos: [0.49, 0.67, -0.01] },
  { name: "Right Ring Middle Phalanx", pos: [0.49, 0.62, -0.01] },
  { name: "Right Ring Distal Phalanx", pos: [0.49, 0.58, -0.01] },
  { name: "Right Little Proximal Phalanx", pos: [0.47, 0.67, -0.02] },
  { name: "Right Little Middle Phalanx", pos: [0.47, 0.62, -0.02] },
  { name: "Right Little Distal Phalanx", pos: [0.47, 0.59, -0.02] },
  // ── PELVIS / HIP (2 bones) ──────────────────────────────
  { name: "Left Hip Bone (Os Coxa)", pos: [-0.15, 0.82, 0.0] },
  { name: "Right Hip Bone (Os Coxa)", pos: [0.15, 0.82, 0.0] },
  // ── THIGH ───────────────────────────────────────────────
  { name: "Left Femur", pos: [-0.18, 0.28, 0.0] },
  { name: "Right Femur", pos: [0.18, 0.28, 0.0] },
  // ── PATELLA ─────────────────────────────────────────────
  { name: "Left Patella", pos: [-0.18, -0.12, 0.06] },
  { name: "Right Patella", pos: [0.18, -0.12, 0.06] },
  // ── LOWER LEG ───────────────────────────────────────────
  { name: "Left Tibia", pos: [-0.16, -0.38, 0.04] },
  { name: "Right Tibia", pos: [0.16, -0.38, 0.04] },
  { name: "Left Fibula", pos: [-0.21, -0.38, 0.0] },
  { name: "Right Fibula", pos: [0.21, -0.38, 0.0] },
  // ── LEFT TARSALS (7 bones) ───────────────────────────────
  { name: "Left Talus", pos: [-0.18, -0.74, 0.03] },
  { name: "Left Calcaneus", pos: [-0.18, -0.8, -0.04] },
  { name: "Left Navicular", pos: [-0.16, -0.76, 0.06] },
  { name: "Left Medial Cuneiform", pos: [-0.15, -0.78, 0.08] },
  { name: "Left Intermediate Cuneiform", pos: [-0.18, -0.78, 0.08] },
  { name: "Left Lateral Cuneiform", pos: [-0.21, -0.78, 0.08] },
  { name: "Left Cuboid", pos: [-0.22, -0.78, 0.04] },
  // ── LEFT METATARSALS (5 bones) ───────────────────────────
  { name: "Left Metatarsal 1", pos: [-0.14, -0.81, 0.12] },
  { name: "Left Metatarsal 2", pos: [-0.17, -0.81, 0.12] },
  { name: "Left Metatarsal 3", pos: [-0.2, -0.81, 0.12] },
  { name: "Left Metatarsal 4", pos: [-0.22, -0.81, 0.11] },
  { name: "Left Metatarsal 5", pos: [-0.24, -0.81, 0.1] },
  // ── LEFT TOE PHALANGES (14 bones) ────────────────────────
  { name: "Left Big Toe Proximal Phalanx", pos: [-0.14, -0.83, 0.16] },
  { name: "Left Big Toe Distal Phalanx", pos: [-0.14, -0.84, 0.19] },
  { name: "Left 2nd Toe Proximal Phalanx", pos: [-0.17, -0.83, 0.16] },
  { name: "Left 2nd Toe Middle Phalanx", pos: [-0.17, -0.84, 0.18] },
  { name: "Left 2nd Toe Distal Phalanx", pos: [-0.17, -0.84, 0.2] },
  { name: "Left 3rd Toe Proximal Phalanx", pos: [-0.2, -0.83, 0.16] },
  { name: "Left 3rd Toe Middle Phalanx", pos: [-0.2, -0.84, 0.18] },
  { name: "Left 3rd Toe Distal Phalanx", pos: [-0.2, -0.84, 0.2] },
  { name: "Left 4th Toe Proximal Phalanx", pos: [-0.22, -0.83, 0.15] },
  { name: "Left 4th Toe Middle Phalanx", pos: [-0.22, -0.84, 0.17] },
  { name: "Left 4th Toe Distal Phalanx", pos: [-0.22, -0.84, 0.19] },
  { name: "Left 5th Toe Proximal Phalanx", pos: [-0.24, -0.83, 0.14] },
  { name: "Left 5th Toe Middle Phalanx", pos: [-0.24, -0.84, 0.16] },
  { name: "Left 5th Toe Distal Phalanx", pos: [-0.24, -0.84, 0.18] },
  // ── RIGHT TARSALS (7 bones) ──────────────────────────────
  { name: "Right Talus", pos: [0.18, -0.74, 0.03] },
  { name: "Right Calcaneus", pos: [0.18, -0.8, -0.04] },
  { name: "Right Navicular", pos: [0.16, -0.76, 0.06] },
  { name: "Right Medial Cuneiform", pos: [0.15, -0.78, 0.08] },
  { name: "Right Intermediate Cuneiform", pos: [0.18, -0.78, 0.08] },
  { name: "Right Lateral Cuneiform", pos: [0.21, -0.78, 0.08] },
  { name: "Right Cuboid", pos: [0.22, -0.78, 0.04] },
  // ── RIGHT METATARSALS (5 bones) ──────────────────────────
  { name: "Right Metatarsal 1", pos: [0.14, -0.81, 0.12] },
  { name: "Right Metatarsal 2", pos: [0.17, -0.81, 0.12] },
  { name: "Right Metatarsal 3", pos: [0.2, -0.81, 0.12] },
  { name: "Right Metatarsal 4", pos: [0.22, -0.81, 0.11] },
  { name: "Right Metatarsal 5", pos: [0.24, -0.81, 0.1] },
  // ── RIGHT TOE PHALANGES (14 bones) ───────────────────────
  { name: "Right Big Toe Proximal Phalanx", pos: [0.14, -0.83, 0.16] },
  { name: "Right Big Toe Distal Phalanx", pos: [0.14, -0.84, 0.19] },
  { name: "Right 2nd Toe Proximal Phalanx", pos: [0.17, -0.83, 0.16] },
  { name: "Right 2nd Toe Middle Phalanx", pos: [0.17, -0.84, 0.18] },
  { name: "Right 2nd Toe Distal Phalanx", pos: [0.17, -0.84, 0.2] },
  { name: "Right 3rd Toe Proximal Phalanx", pos: [0.2, -0.83, 0.16] },
  { name: "Right 3rd Toe Middle Phalanx", pos: [0.2, -0.84, 0.18] },
  { name: "Right 3rd Toe Distal Phalanx", pos: [0.2, -0.84, 0.2] },
  { name: "Right 4th Toe Proximal Phalanx", pos: [0.22, -0.83, 0.15] },
  { name: "Right 4th Toe Middle Phalanx", pos: [0.22, -0.84, 0.17] },
  { name: "Right 4th Toe Distal Phalanx", pos: [0.22, -0.84, 0.19] },
  { name: "Right 5th Toe Proximal Phalanx", pos: [0.24, -0.83, 0.14] },
  { name: "Right 5th Toe Middle Phalanx", pos: [0.24, -0.84, 0.16] },
  { name: "Right 5th Toe Distal Phalanx", pos: [0.24, -0.84, 0.18] },
];

type SystemKey = "skeletal" | "organs" | "nervous" | "outer";

export default function Anatome3DViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const labelOverlayRef = useRef<HTMLDivElement>(null);
  const labelElemsRef = useRef<HTMLDivElement[]>([]);
  const dotElemsRef = useRef<THREE.Vector3[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const systemGroupsRef = useRef<Record<SystemKey, THREE.Group> | null>(null);
  const labelGroupRef = useRef<THREE.Group | null>(null);
  const [partName, setPartName] = useState("Anatomy Guide");
  const [partDesc, setPartDesc] = useState(
    "Rotate the model and hover over parts to explore the complex systems of the human body.",
  );
  const [visibility, setVisibility] = useState<Record<SystemKey, boolean>>({
    skeletal: true,
    organs: true,
    nervous: true,
    outer: true,
  });
  const [labelsVisible, setLabelsVisible] = useState(false);
  const labelsVisibleRef = useRef(false);

  useEffect(() => {
    labelsVisibleRef.current = labelsVisible;
    if (labelOverlayRef.current) {
      labelOverlayRef.current.style.display = labelsVisible ? "block" : "none";
    }
    if (labelGroupRef.current) {
      labelGroupRef.current.visible = labelsVisible;
    }
  }, [labelsVisible]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.08);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.0, 0);
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const spotlight = new THREE.SpotLight(0xffffff, 1.2);
    spotlight.position.set(5, 10, 5);
    scene.add(spotlight);
    const rimLight = new THREE.PointLight(0x4ade80, 0.8);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
    frontLight.position.set(0, 2, 5);
    scene.add(frontLight);

    const boneMat = new THREE.MeshPhongMaterial({
      color: 0xe8e0d0,
      shininess: 60,
    });
    const organMat = (color: number) =>
      new THREE.MeshPhongMaterial({
        color,
        transparent: true,
        opacity: 0.9,
        shininess: 100,
      });
    const nerveMat = new THREE.MeshBasicMaterial({ color: 0xffee00 });
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });

    const groups: Record<SystemKey, THREE.Group> = {
      skeletal: new THREE.Group(),
      organs: new THREE.Group(),
      nervous: new THREE.Group(),
      outer: new THREE.Group(),
    };
    systemGroupsRef.current = groups;

    // ── Outer body silhouette ────────────────────────────────
    const addOuter = (
      geom: THREE.BufferGeometry,
      pos: [number, number, number],
    ) => {
      const m = new THREE.Mesh(geom, bodyMat);
      m.position.set(...pos);
      m.name = "Outer Body";
      groups.outer.add(m);
    };
    addOuter(new THREE.CapsuleGeometry(0.36, 0.72, 10, 20), [0, 1.15, 0]);
    addOuter(new THREE.SphereGeometry(0.2, 16, 16), [0, 2.0, 0]);
    addOuter(new THREE.CapsuleGeometry(0.11, 0.85, 4, 10), [-0.18, 0.35, 0]);
    addOuter(new THREE.CapsuleGeometry(0.11, 0.85, 4, 10), [0.18, 0.35, 0]);
    addOuter(new THREE.CapsuleGeometry(0.07, 0.55, 4, 8), [-0.42, 1.5, 0]);
    addOuter(new THREE.CapsuleGeometry(0.07, 0.55, 4, 8), [0.42, 1.5, 0]);

    // Helper to add a named bone
    const bone = (
      name: string,
      geom: THREE.BufferGeometry,
      pos: [number, number, number],
      rot?: [number, number, number],
      scale?: [number, number, number],
    ) => {
      const m = new THREE.Mesh(geom, boneMat);
      m.position.set(...pos);
      if (rot) m.rotation.set(...rot);
      if (scale) m.scale.set(...scale);
      m.name = name;
      groups.skeletal.add(m);
      return m;
    };

    // ── HEAD ────────────────────────────────────────────────
    bone(
      "Frontal Bone",
      new THREE.SphereGeometry(0.14, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      [0, 2.06, 0.04],
    );
    bone(
      "Parietal Bone",
      new THREE.SphereGeometry(
        0.15,
        12,
        8,
        0,
        Math.PI * 2,
        Math.PI / 4,
        Math.PI / 2,
      ),
      [0, 2.05, -0.01],
    );
    bone(
      "Occipital Bone",
      new THREE.SphereGeometry(
        0.13,
        12,
        8,
        0,
        Math.PI * 2,
        Math.PI / 2,
        Math.PI / 2,
      ),
      [0, 1.96, -0.08],
    );
    bone(
      "Mandible",
      new THREE.BoxGeometry(0.14, 0.05, 0.1),
      [0, 1.82, 0.07],
      [0.2, 0, 0],
    );

    // ── CERVICAL VERTEBRAE (neck) ────────────────────────────
    for (let i = 0; i < 7; i++) {
      bone("Cervical Vertebrae", new THREE.BoxGeometry(0.065, 0.025, 0.045), [
        0,
        1.78 - i * 0.035,
        0,
      ]);
    }

    // ── CLAVICLE ─────────────────────────────────────────────
    bone(
      "Clavicle",
      new THREE.CapsuleGeometry(0.012, 0.22, 4, 8),
      [-0.22, 1.68, 0],
      [0, 0, Math.PI / 2 - 0.3],
    );
    bone(
      "Clavicle",
      new THREE.CapsuleGeometry(0.012, 0.22, 4, 8),
      [0.22, 1.68, 0],
      [0, 0, -(Math.PI / 2 - 0.3)],
    );

    // ── SCAPULA ──────────────────────────────────────────────
    bone(
      "Scapula",
      new THREE.BoxGeometry(0.12, 0.1, 0.02),
      [-0.36, 1.58, -0.04],
    );
    bone(
      "Scapula",
      new THREE.BoxGeometry(0.12, 0.1, 0.02),
      [0.36, 1.58, -0.04],
    );

    // ── STERNUM ──────────────────────────────────────────────
    bone("Sternum", new THREE.BoxGeometry(0.045, 0.28, 0.025), [0, 1.52, 0.1]);

    // ── VERTEBRAL COLUMN (thoracic + lumbar) ─────────────────
    for (let i = 0; i < 12; i++) {
      bone("Vertebral Column", new THREE.BoxGeometry(0.075, 0.028, 0.05), [
        0,
        1.62 - i * 0.055,
        -0.04,
      ]);
    }
    for (let i = 0; i < 5; i++) {
      bone("Lumbar", new THREE.BoxGeometry(0.09, 0.032, 0.06), [
        0,
        0.96 - i * 0.06,
        -0.04,
      ]);
    }

    // ── RIBS ─────────────────────────────────────────────────
    for (let i = 0; i < 7; i++) {
      const r = 0.16 + i * 0.008;
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.009, 8, 22, Math.PI),
        boneMat.clone(),
      );
      rib.rotation.x = Math.PI / 2;
      rib.rotation.y = Math.PI;
      rib.position.set(0, 1.58 - i * 0.06, 0.04);
      rib.name = "True Ribs";
      groups.skeletal.add(rib);
    }
    for (let i = 0; i < 3; i++) {
      const name = i < 2 ? "False Ribs" : "Floating Ribs";
      const r = 0.19 + i * 0.006;
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.008, 8, 22, Math.PI * 0.75),
        boneMat.clone(),
      );
      rib.rotation.x = Math.PI / 2;
      rib.rotation.y = Math.PI;
      rib.position.set(0, 1.16 - i * 0.055, 0);
      rib.name = name;
      groups.skeletal.add(rib);
    }

    // ── HUMERUS ──────────────────────────────────────────────
    bone(
      "Humerus",
      new THREE.CapsuleGeometry(0.028, 0.38, 4, 8),
      [-0.44, 1.46, 0],
      [0, 0, -0.18],
    );
    bone(
      "Humerus",
      new THREE.CapsuleGeometry(0.028, 0.38, 4, 8),
      [0.44, 1.46, 0],
      [0, 0, 0.18],
    );

    // ── RADIUS ───────────────────────────────────────────────
    bone(
      "Radius",
      new THREE.CapsuleGeometry(0.018, 0.32, 4, 8),
      [-0.5, 1.08, 0.02],
      [0.1, 0, -0.1],
    );
    bone(
      "Radius",
      new THREE.CapsuleGeometry(0.018, 0.32, 4, 8),
      [0.5, 1.08, 0.02],
      [0.1, 0, 0.1],
    );

    // ── ULNA ─────────────────────────────────────────────────
    bone(
      "Ulna",
      new THREE.CapsuleGeometry(0.015, 0.34, 4, 8),
      [-0.52, 1.06, -0.02],
      [0.1, 0, -0.12],
    );
    bone(
      "Ulna",
      new THREE.CapsuleGeometry(0.015, 0.34, 4, 8),
      [0.52, 1.06, -0.02],
      [0.1, 0, 0.12],
    );

    // ── CARPALS & WRIST ───────────────────────────────────────
    const wristBones = ["Scaphoid", "Lunate", "Carpals", "Carpals"];
    for (let side = -1; side <= 1; side += 2) {
      wristBones.forEach((bname, i) => {
        bone(bname, new THREE.BoxGeometry(0.025, 0.022, 0.02), [
          side * (0.53 + (i - 1.5) * 0.025),
          0.8,
          0,
        ]);
      });
      for (let i = 0; i < 5; i++) {
        bone("Metacarpals", new THREE.CapsuleGeometry(0.009, 0.065, 4, 6), [
          side * (0.51 + (i - 2) * 0.022),
          0.73,
          0,
        ]);
      }
      for (let i = 0; i < 5; i++) {
        bone("Phalanges", new THREE.CapsuleGeometry(0.007, 0.05, 4, 6), [
          side * (0.51 + (i - 2) * 0.022),
          0.65,
          0,
        ]);
        bone("Phalanges", new THREE.CapsuleGeometry(0.006, 0.04, 4, 6), [
          side * (0.51 + (i - 2) * 0.022),
          0.59,
          0,
        ]);
      }
    }

    // ── PELVIS ────────────────────────────────────────────────
    bone(
      "Ilium",
      new THREE.TorusGeometry(0.15, 0.04, 8, 16, Math.PI),
      [0, 0.82, 0],
      [Math.PI / 2, 0, 0],
    );
    bone("Ilium", new THREE.BoxGeometry(0.13, 0.08, 0.04), [-0.15, 0.82, 0]);
    bone("Ilium", new THREE.BoxGeometry(0.13, 0.08, 0.04), [0.15, 0.82, 0]);
    bone(
      "Pubis",
      new THREE.CapsuleGeometry(0.022, 0.12, 4, 8),
      [0, 0.68, 0.06],
      [0, 0, Math.PI / 2],
    );
    bone("Sacrum", new THREE.BoxGeometry(0.09, 0.12, 0.04), [0, 0.72, -0.04]);
    bone("Coccyx", new THREE.BoxGeometry(0.04, 0.05, 0.03), [0, 0.62, -0.02]);
    bone("Ischium", new THREE.BoxGeometry(0.07, 0.06, 0.04), [-0.12, 0.65, 0]);
    bone("Ischium", new THREE.BoxGeometry(0.07, 0.06, 0.04), [0.12, 0.65, 0]);

    // ── FEMUR ────────────────────────────────────────────────
    bone(
      "Femur",
      new THREE.CapsuleGeometry(0.038, 0.62, 4, 10),
      [-0.18, 0.28, 0],
    );
    bone(
      "Femur",
      new THREE.CapsuleGeometry(0.038, 0.62, 4, 10),
      [0.18, 0.28, 0],
    );

    // ── PATELLA ──────────────────────────────────────────────
    bone(
      "Patella",
      new THREE.SphereGeometry(0.025, 8, 8),
      [-0.18, -0.12, 0.06],
    );
    bone("Patella", new THREE.SphereGeometry(0.025, 8, 8), [0.18, -0.12, 0.06]);

    // ── TIBIA ────────────────────────────────────────────────
    bone(
      "Tibia",
      new THREE.CapsuleGeometry(0.028, 0.48, 4, 8),
      [-0.17, -0.36, 0.02],
    );
    bone(
      "Tibia",
      new THREE.CapsuleGeometry(0.028, 0.48, 4, 8),
      [0.17, -0.36, 0.02],
    );

    // ── FIBULA ───────────────────────────────────────────────
    bone(
      "Fibula",
      new THREE.CapsuleGeometry(0.012, 0.46, 4, 8),
      [-0.22, -0.36, 0],
    );
    bone(
      "Fibula",
      new THREE.CapsuleGeometry(0.012, 0.46, 4, 8),
      [0.22, -0.36, 0],
    );

    // ── TARSALS ──────────────────────────────────────────────
    bone(
      "Talus",
      new THREE.BoxGeometry(0.04, 0.028, 0.055),
      [-0.19, -0.72, 0.03],
    );
    bone(
      "Talus",
      new THREE.BoxGeometry(0.04, 0.028, 0.055),
      [0.19, -0.72, 0.03],
    );
    bone(
      "Calcaneus",
      new THREE.BoxGeometry(0.042, 0.03, 0.07),
      [-0.19, -0.77, -0.02],
    );
    bone(
      "Calcaneus",
      new THREE.BoxGeometry(0.042, 0.03, 0.07),
      [0.19, -0.77, -0.02],
    );
    for (let i = 0; i < 3; i++) {
      bone("Tarsals", new THREE.BoxGeometry(0.025, 0.035, 0.04), [
        -0.19 + (i - 1) * 0.026,
        -0.79,
        0.06,
      ]);
      bone("Tarsals", new THREE.BoxGeometry(0.025, 0.035, 0.04), [
        0.19 + (i - 1) * 0.026,
        -0.79,
        0.06,
      ]);
    }

    // ── METATARSALS ──────────────────────────────────────────
    for (let i = 0; i < 5; i++) {
      bone(
        "Metatarsals",
        new THREE.CapsuleGeometry(0.009, 0.07, 4, 6),
        [-0.2 + (i - 2) * 0.022, -0.83, 0.1],
        [Math.PI / 2, 0, 0],
      );
      bone(
        "Metatarsals",
        new THREE.CapsuleGeometry(0.009, 0.07, 4, 6),
        [0.2 + (i - 2) * 0.022, -0.83, 0.1],
        [Math.PI / 2, 0, 0],
      );
    }

    // ── TOE PHALANGES ────────────────────────────────────────
    for (let i = 0; i < 5; i++) {
      bone(
        "Phalanges",
        new THREE.CapsuleGeometry(0.007, 0.03, 4, 6),
        [-0.2 + (i - 2) * 0.022, -0.84, 0.15],
        [Math.PI / 2, 0, 0],
      );
      bone(
        "Phalanges",
        new THREE.CapsuleGeometry(0.007, 0.03, 4, 6),
        [0.2 + (i - 2) * 0.022, -0.84, 0.15],
        [Math.PI / 2, 0, 0],
      );
    }

    // ── ORGANS ───────────────────────────────────────────────
    const brain = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      organMat(0xffb6c1),
    );
    brain.position.y = 2.02;
    brain.name = "Brain";
    groups.organs.add(brain);
    const heart = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      organMat(0xdc143c),
    );
    heart.position.set(0.02, 1.42, 0.06);
    heart.name = "Heart";
    groups.organs.add(heart);
    const lungGeom = new THREE.CapsuleGeometry(0.075, 0.16, 8, 8);
    const lungL2 = new THREE.Mesh(lungGeom, organMat(0xff9999));
    lungL2.position.set(-0.12, 1.4, 0);
    lungL2.rotation.z = 0.1;
    lungL2.name = "Lungs";
    groups.organs.add(lungL2);
    const lungR2 = lungL2.clone();
    lungR2.position.x = 0.12;
    lungR2.rotation.z = -0.1;
    groups.organs.add(lungR2);
    const liver = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.09, 1),
      organMat(0x6b2121),
    );
    liver.position.set(0.1, 1.22, 0.03);
    liver.scale.set(1.4, 0.8, 1);
    liver.name = "Liver";
    groups.organs.add(liver);
    const stomach = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      organMat(0xfac0c0),
    );
    stomach.position.set(-0.08, 1.18, 0.06);
    stomach.name = "Stomach";
    groups.organs.add(stomach);
    const intestines = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.065, 10, 20),
      organMat(0xcc8e5e),
    );
    intestines.position.set(0, 0.95, 0.06);
    intestines.rotation.x = Math.PI / 2;
    intestines.name = "Intestines";
    groups.organs.add(intestines);

    // ── NERVOUS SYSTEM ───────────────────────────────────────
    const centralNerve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.002, 1.6),
      nerveMat,
    );
    centralNerve.position.y = 1.2;
    centralNerve.name = "Vertebral Column";
    groups.nervous.add(centralNerve);
    for (let i = 0; i < 12; i++) {
      const branch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.001, 0.38),
        nerveMat,
      );
      branch.position.y = 1.6 - i * 0.12;
      branch.rotation.z = Math.PI / 2;
      groups.nervous.add(branch);
    }

    for (const g of Object.values(groups)) scene.add(g);

    // ── BONE LABEL DOT MARKERS ───────────────────────────────
    const labelGroup = new THREE.Group();
    labelGroupRef.current = labelGroup;
    labelGroup.visible = false;
    scene.add(labelGroup);

    const dotMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
    const dotGeo = new THREE.SphereGeometry(0.012, 6, 6);
    const vec3Positions: THREE.Vector3[] = [];

    for (const b of BONES_206) {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(...b.pos);
      dot.name = b.name;
      labelGroup.add(dot);
      vec3Positions.push(new THREE.Vector3(...b.pos));
    }
    dotElemsRef.current = vec3Positions;

    // Create HTML label elements
    const overlay = labelOverlayRef.current;
    if (overlay) {
      overlay.innerHTML = "";
      const elems: HTMLDivElement[] = [];
      for (const b of BONES_206) {
        const el = document.createElement("div");
        el.className = "bone-label";
        el.style.cssText = [
          "position:absolute",
          "pointer-events:none",
          "display:flex",
          "align-items:center",
          "gap:4px",
          "transform:translate(-50%,-50%)",
          "z-index:15",
        ].join(";");
        // dot
        const dot = document.createElement("span");
        dot.style.cssText =
          "width:5px;height:5px;border-radius:50%;background:#4ade80;flex-shrink:0";
        // text
        const txt = document.createElement("span");
        txt.textContent = b.name;
        txt.style.cssText = [
          "font-size:9px",
          "font-weight:600",
          "color:#4ade80",
          "white-space:nowrap",
          "background:rgba(2,6,23,0.78)",
          "border:1px solid rgba(74,222,128,0.3)",
          "border-radius:4px",
          "padding:1px 4px",
        ].join(";");
        el.appendChild(dot);
        el.appendChild(txt);
        overlay.appendChild(el);
        elems.push(el);
      }
      labelElemsRef.current = elems;
      overlay.style.display = "none";
    }

    // ── Raycaster ────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${e.clientX - rect.left + 20}px`;
        tooltipRef.current.style.top = `${e.clientY - rect.top - 20}px`;
      }
      raycaster.setFromCamera(mouse, camera);
      const allObjects: THREE.Object3D[] = [];
      for (const g of Object.values(groups))
        g.traverse((o) => allObjects.push(o));
      if (labelGroupRef.current)
        labelGroupRef.current.traverse((o) => allObjects.push(o));
      const hits = raycaster.intersectObjects(allObjects, false);
      if (
        hits.length > 0 &&
        hits[0].object.name &&
        hits[0].object.name !== "Outer Body"
      ) {
        const name = hits[0].object.name;
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "block";
          tooltipRef.current.textContent = name;
        }
        setPartName(name);
        setPartDesc(
          PART_DATA[name] ??
            "Detailed component of the biological system being explored.",
        );
      } else {
        if (tooltipRef.current) tooltipRef.current.style.display = "none";
      }
    };
    container.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const tempVec = new THREE.Vector3();
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

      // Update label positions
      if (labelsVisibleRef.current && labelElemsRef.current.length > 0) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        dotElemsRef.current.forEach((pos3d, i) => {
          const el = labelElemsRef.current[i];
          if (!el) return;
          tempVec.copy(pos3d).project(camera);
          const x = (tempVec.x * 0.5 + 0.5) * w;
          const y = (-tempVec.y * 0.5 + 0.5) * h;
          // hide if behind camera
          if (tempVec.z > 1) {
            el.style.display = "none";
          } else {
            el.style.display = "flex";
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
          }
        });
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const groups = systemGroupsRef.current;
    if (!groups) return;
    for (const key of Object.keys(visibility) as SystemKey[])
      groups[key].visible = visibility[key];
  }, [visibility]);

  const toggleSystem = (key: SystemKey) =>
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));

  const resetCamera = () => {
    cameraRef.current?.position.set(0, 1, 5);
    controlsRef.current?.target.set(0, 1.0, 0);
  };

  const SYSTEM_LABELS: { key: SystemKey; label: string }[] = [
    { key: "skeletal", label: "Skeleton" },
    { key: "organs", label: "Organs" },
    { key: "nervous", label: "Nervous" },
    { key: "outer", label: "Skin/X-Ray" },
  ];

  return (
    <div className="relative w-full h-full" style={{ background: "#020617" }}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Label HTML overlay */}
      <div
        ref={labelOverlayRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />

      {/* Hover tooltip */}
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none hidden z-20 px-3 py-1.5 rounded-lg text-xs font-semibold"
        style={{
          background: "rgba(15,23,42,0.95)",
          color: "#4ade80",
          border: "1px solid rgba(74,222,128,0.5)",
          boxShadow: "0 0 15px rgba(74,222,128,0.2)",
        }}
      />

      {/* Header */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h2 className="text-white text-xl font-bold tracking-tight">
          ANATOME<span style={{ color: "#4ade80" }}>3D</span>
        </h2>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#10b981" }}
          />
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">
            Full Body · 206 Bones
          </p>
        </div>
      </div>

      {/* Bone counter badge */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-xs font-bold"
        style={{
          background: "rgba(15,23,42,0.8)",
          border: "1px solid rgba(74,222,128,0.4)",
          color: "#4ade80",
        }}
      >
        206 Bones Labeled
      </div>

      {/* Info card */}
      <div
        className="absolute top-4 right-4 z-10 p-4 rounded-2xl w-64"
        style={{
          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-base" style={{ color: "#4ade80" }}>
            {partName}
          </h3>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded"
            style={{ background: "rgba(30,41,59,1)", color: "#94a3b8" }}
          >
            INTERACTIVE
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#cbd5e1" }}>
          {partDesc}
        </p>
        <div
          className="mt-3 pt-3 flex gap-3 text-[9px] font-mono"
          style={{
            borderTop: "1px solid rgba(100,116,139,0.3)",
            color: "#64748b",
          }}
        >
          <span>SKELETAL</span>
          <span>ORGANS</span>
          <span>NERVOUS</span>
        </div>
      </div>

      {/* Controls */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2.5 rounded-3xl flex-wrap justify-center"
        style={{
          background: "rgba(15,23,42,0.8)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth: "calc(100vw - 2rem)",
        }}
      >
        <span
          className="px-2 text-[9px] font-bold uppercase tracking-tight"
          style={{ color: "#64748b" }}
        >
          Systems
        </span>
        {SYSTEM_LABELS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggleSystem(key)}
            className="px-3 py-1.5 rounded-2xl text-white text-xs font-semibold transition-all"
            style={{
              background: visibility[key] ? "#10b981" : "rgba(30,41,59,1)",
              boxShadow: visibility[key]
                ? "0 0 15px rgba(16,185,129,0.4)"
                : "none",
            }}
            data-ocid={`anatome3d.toggle.${key}`}
          >
            {label}
          </button>
        ))}
        <div
          className="w-px h-5 mx-1"
          style={{ background: "rgba(100,116,139,0.3)" }}
        />
        <button
          type="button"
          onClick={() => setLabelsVisible((v) => !v)}
          className="px-3 py-1.5 rounded-2xl text-white text-xs font-semibold transition-all"
          style={{
            background: labelsVisible ? "#8b5cf6" : "rgba(30,41,59,1)",
            boxShadow: labelsVisible ? "0 0 15px rgba(139,92,246,0.5)" : "none",
            border: labelsVisible
              ? "1px solid rgba(139,92,246,0.6)"
              : "1px solid transparent",
          }}
          data-ocid="anatome3d.toggle_labels"
        >
          🦴 206 Labels
        </button>
        <div
          className="w-px h-5 mx-1"
          style={{ background: "rgba(100,116,139,0.3)" }}
        />
        <button
          type="button"
          onClick={resetCamera}
          className="p-2 rounded-2xl transition-colors"
          style={{ background: "rgba(30,41,59,1)", color: "#94a3b8" }}
          title="Reset View"
          data-ocid="anatome3d.reset_camera"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Reset camera view"
            role="img"
          >
            <title>Reset camera view</title>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      {labelsVisible && (
        <div
          className="absolute bottom-20 right-4 z-10 p-3 rounded-xl text-[9px]"
          style={{
            background: "rgba(15,23,42,0.85)",
            border: "1px solid rgba(139,92,246,0.4)",
            color: "#94a3b8",
            maxWidth: "160px",
          }}
        >
          <div className="font-bold mb-1" style={{ color: "#a78bfa" }}>
            206 Bones Active
          </div>
          <div>Hover any dot or bone to see its name and description.</div>
          <div className="mt-1" style={{ color: "#64748b" }}>
            Rotate to explore all sides.
          </div>
        </div>
      )}
    </div>
  );
}
