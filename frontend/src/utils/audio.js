import api from "../api/api";

export function resolveAssetUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  try {
    const origin = new URL(api.baseURL).origin;
    return `${origin}${url}`;
  } catch {
    return url;
  }
}

export function assetLabel(asset) {
  if (!asset) return "Audio asset";
  return `${asset.voice_name || asset.voicename} • ${(asset.language || "").toUpperCase()}`;
}