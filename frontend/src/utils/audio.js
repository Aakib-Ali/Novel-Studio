export function audioBadge(asset) {
  return `${asset.language.toUpperCase()} · ${asset.voice_name}`;
}