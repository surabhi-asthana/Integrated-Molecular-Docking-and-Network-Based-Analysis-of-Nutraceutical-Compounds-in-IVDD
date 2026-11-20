// Removes LaTeX-style $...$ markup from AI answers and turns it into plain text.
const GREEK = {
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", kappa: "κ",
  mu: "μ", lambda: "λ", sigma: "σ", omega: "ω",
};

export function cleanAnswer(text = "") {
  return text.replace(/\$([^$\n]+)\$/g, (_, inner) =>
    inner
      .replace(/\\mathring\{A\}/g, "Å")
      .replace(/\\text\{([^}]*)\}/g, "$1")
      .replace(/\\(alpha|beta|gamma|delta|kappa|mu|lambda|sigma|omega)/g, (__, g) => GREEK[g])
      .replace(/\^\{?2\}?/g, "²")
      .replace(/\^\{?3\}?/g, "³")
      .replace(/\\[a-zA-Z]+|[\\{}]/g, "")
  );
}