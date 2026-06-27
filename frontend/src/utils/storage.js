export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}