const themes = ["light", "dark", "coffee"];

export function toggleTheme(theme: string) {
  document.documentElement.classList.remove("light", "dark", "coffee");
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
