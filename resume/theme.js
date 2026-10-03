const themeStorageKey = "resume-theme";
const themeToggle = document.querySelector(".theme-toggle");
const themePreference = window.matchMedia("(prefers-color-scheme: dark)");

if (!themeToggle) {
  throw new Error("The theme toggle button could not be found.");
}

function getSavedTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch (error) {
    console.warn("Unable to read the saved theme preference.", error);
    return null;
  }
}

function setTheme(theme, savePreference = false) {
  const isDark = theme === "dark";
  const themeName = isDark ? "dark" : "light";
  const nextThemeName = isDark ? "light" : "dark";

  document.documentElement.dataset.theme = themeName;
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `Switch to ${nextThemeName} theme`);
  themeToggle.title = `Switch to ${nextThemeName} theme`;
  themeToggle.querySelector(".theme-toggle-icon").textContent = isDark ? "☀" : "☾";
  themeToggle.querySelector(".theme-toggle-label").textContent = isDark ? "Light" : "Dark";
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#111b21" : "#f5f7fa";

  if (savePreference) {
    try {
      localStorage.setItem(themeStorageKey, themeName);
    } catch (error) {
      console.warn("Unable to save the theme preference.", error);
    }
  }
}

themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
});

themePreference.addEventListener("change", (event) => {
  if (!getSavedTheme()) {
    setTheme(event.matches ? "dark" : "light");
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === themeStorageKey) {
    setTheme(event.newValue === "dark" ? "dark" : event.newValue === "light" ? "light" : themePreference.matches ? "dark" : "light");
  }
});

setTheme(document.documentElement.dataset.theme);
