export function countWords(markdownOrMdx: string): number {
  let s = markdownOrMdx.replace(/```[\s\S]*?```/g, " ");
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  s = s.replace(/\s+/g, " ").trim();
  if (!s) return 0;
  return s.split(" ").filter(Boolean).length;
}

export function minutesToRead(wordCount: number, wpm = 225): number {
  return Math.max(1, Math.round(wordCount / wpm));
}

export function truncateForPreview(markdownOrMdx: string, maxLength: number): string {
  let s = markdownOrMdx.replace(/[#>*`\n]/g, " ").trim();
  // remove links
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  // remove images
  s = s.replace(/!\[[^\]]*\]\([^)]+\)/g, "");
  // remove code blocks
  s = s.replace(/```[\s\S]*?```/g, "");
  // remove HTML tags
  s = s.replace(/<[^>]+>/g, " ");
  // remove extra spaces
  s = s.replace(/\s+/g, " ").trim();
  if (!s) return "";
  if (s.length <= maxLength) return s;
  return s.slice(0, maxLength - 3) + "...";
}
