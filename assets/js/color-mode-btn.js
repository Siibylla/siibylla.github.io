const STORAGE_KEY = "theme";

const DARK_THEME = "dark";
const LIGHT_THEME = "light";

const DARK_QUERY = "(prefers-color-scheme: dark)";

const documentElement = document.documentElement;

const colorModeButton = document.querySelector(".color-mode-btn");

// Keep the browser chrome color in sync; values match --color-bg in root.scss
const themeColorMeta = document.querySelector("meta[name=theme-color]");
const THEME_COLORS = { dark: "#16181a", light: "#f7f7f5" };

if (colorModeButton) {
  const darkMedia = window.matchMedia(DARK_QUERY);

  // localStorage can throw in private mode or when storage is disabled
  const safeGet = key => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {}
  };

  const getStoredTheme = () => {
    const stored = safeGet(STORAGE_KEY);
    return stored === DARK_THEME || stored === LIGHT_THEME ? stored : null;
  };

  const getSystemTheme = () => (darkMedia.matches ? DARK_THEME : LIGHT_THEME);

  const getInitialTheme = () => getStoredTheme() ?? getSystemTheme();

  // Persist only on explicit user action
  const applyTheme = (theme, shouldSave = false) => {
    documentElement.setAttribute("data-theme", theme);
    colorModeButton.setAttribute("aria-pressed", String(theme === DARK_THEME));
    themeColorMeta?.setAttribute("content", THEME_COLORS[theme]);

    if (shouldSave) {
      safeSet(STORAGE_KEY, theme);
    }
  };

  // Applied without saving so system changes can still be followed
  applyTheme(getInitialTheme());

  // Follow system changes until the user makes an explicit choice
  darkMedia.addEventListener("change", event => {
    if (getStoredTheme() !== null) {
      return;
    }

    applyTheme(event.matches ? DARK_THEME : LIGHT_THEME);
  });

  // Explicit user choice, so persist it
  colorModeButton.addEventListener("click", () => {
    const currentTheme = documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

    applyTheme(nextTheme, true);
  });
}
