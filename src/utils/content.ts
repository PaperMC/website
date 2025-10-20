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
