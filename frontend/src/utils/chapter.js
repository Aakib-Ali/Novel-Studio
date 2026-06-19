export function parseReplacementRules(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [find, ...rest] = line.split(':');
      return { find: find.trim(), replace_with: rest.join(':').trim() };
    })
    .filter(rule => rule.find && rule.replace_with);
}