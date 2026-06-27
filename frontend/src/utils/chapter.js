export function parseReplacementRules(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [find, ...rest] = line.split("=");
      return {
        find: find?.trim(),
        replace_with: rest.join("=").trim()
      };
    })
    .filter((item) => item.find && item.replace_with);
}

export function getChapterTitle(chapter) {
  return chapter?.title || `Chapter ${chapter?.chapter_number || chapter?.chapternumber || ""}`;
}