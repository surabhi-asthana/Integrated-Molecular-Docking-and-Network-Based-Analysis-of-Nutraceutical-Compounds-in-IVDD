export const PROTEINS = [
  { id: "TNFA", name: "TNF-α" },
  { id: "IKKB", name: "IKKβ" },
  { id: "MD2", name: "MD-2" },
  { id: "STAT3", name: "STAT3" },
  { id: "IL1B", name: "IL-1β" },
  { id: "IL6", name: "IL-6" },
  { id: "NLRP3", name: "NLRP3" },
  { id: "MMP13", name: "MMP-13" },
  { id: "MMP7", name: "MMP-7" },
  { id: "ADAMTS5", name: "ADAMTS-5" },
];

export const COMPOUNDS = [
  { id: "curcumin", name: "Curcumin" },
  { id: "quercetin", name: "Quercetin" },
  { id: "baicalein", name: "Baicalein" },
  { id: "resveratrol", name: "Resveratrol" },
  { id: "melatonin", name: "Melatonin"  },
];

export const nameOf = (list, id) => list.find((x) => x.id === id)?.name ?? id;