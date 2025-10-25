import removeMarkdown from "remove-markdown";

export function countWords(markdownOrMdx: string): number {
  const plainText = removeMarkdown(markdownOrMdx);
  const s = plainText.replace(/\s+/g, " ").trim();
  if (!s) return 0;
  return s.split(" ").filter(Boolean).length;
}

export function minutesToRead(wordCount: number, wpm = 225): number {
  return Math.max(1, Math.round(wordCount / wpm));
}

export function truncateForPreview(markdownOrMdx: string, maxLength: number): string {
  const plainText = removeMarkdown(markdownOrMdx);
  const s = plainText.replace(/\s+/g, " ").trim();
  if (!s) return "";
  if (s.length <= maxLength) return s;
  return s.slice(0, maxLength - 3) + "...";
}
