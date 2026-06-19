export function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export function formatStatus(value = '') {
  return value.replaceAll('_', ' ');
}