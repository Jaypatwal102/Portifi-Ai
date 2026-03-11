export const themes = ["light", "dark", "coffee", "modern"] as const;
export type Theme = (typeof themes)[number];

export function toggleTheme(theme: Theme) {
  document.documentElement.classList.remove(
    "light",
    "dark",
    "coffee",
    "modern",
  );
  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
}

export function getNextTheme() {
  let ind = 0;
  for (let i = 0; i < themes.length; i++) {
    if (document.documentElement.classList.contains(themes[i])) {
      ind = i;
      break;
    }
  }
  return themes[(ind + 1) % themes.length];
}

export function getCurrentTheme(): Theme {
  for (const theme of themes) {
    if (document.documentElement.classList.contains(theme)) {
      return theme;
    }
  }

  return "light";
}
