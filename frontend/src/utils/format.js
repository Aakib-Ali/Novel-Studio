export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function formatStatus(value) {
  if (!value) return "Unknown";
  return value.replaceAll("_", " ");
}