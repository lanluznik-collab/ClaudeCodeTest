const DIACRITIC_MAP: Record<string, string> = {
  č: "c", ć: "c", š: "s", ž: "z", đ: "d",
};

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[čćšžđ]/g, (ch) => DIACRITIC_MAP[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export interface Heading {
  id: string;
  text: string;
}

// Scans raw markdown for ATX-style H2 lines ("## Heading"). Deliberately a
// line scan rather than a full markdown parse — the admin body is a single
// hand-written textarea, not arbitrary user content, so this simple/fast
// approach covers how the articles are actually written.
export function extractH2Headings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();

  for (const line of markdown.split("\n")) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = stripInlineMarkdown(match[1]);
    let id = slugifyHeading(text) || "odsek";
    const priorCount = seen.get(id) ?? 0;
    seen.set(id, priorCount + 1);
    if (priorCount > 0) id = `${id}-${priorCount + 1}`;

    headings.push({ id, text });
  }

  return headings;
}

const REFERENCES_HEADING_RE = /^##\s+(.+?)\s*$/;
const REFERENCES_KEYWORDS = ["vir", "referenc", "literatur"];

function isReferencesHeading(headingText: string): boolean {
  const normalized = stripInlineMarkdown(headingText).toLowerCase();
  return REFERENCES_KEYWORDS.some((kw) => normalized.includes(kw));
}

export interface BodySplit {
  main: string;
  references: string | null;
}

// Splits body markdown right before a trailing "Viri" / "Reference" /
// "Literatura" H2 section, so the product CTA box can be rendered between the
// article content and its reference list without a dedicated admin field —
// the split is purely a heuristic over the heading text the author already
// writes. Falls back to treating the whole body as "main" if no such heading
// is found.
export function splitBodyAtReferences(markdown: string): BodySplit {
  const lines = markdown.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const match = REFERENCES_HEADING_RE.exec(lines[i]);
    if (match && isReferencesHeading(match[1])) {
      return {
        main: lines.slice(0, i).join("\n").trimEnd(),
        references: lines.slice(i).join("\n"),
      };
    }
  }

  return { main: markdown, references: null };
}
