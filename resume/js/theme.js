const themeStorageKey = "resume-theme";
const themeToggle = document.querySelector(".theme-toggle");
const stickyHeader = document.querySelector(".site-header");
const themePreference = window.matchMedia("(prefers-color-scheme: dark)");

if (!themeToggle) {
  throw new Error("The theme toggle button could not be found.");
}

if (!stickyHeader) {
  throw new Error("The sticky header could not be found.");
}

let headerSurfaceUpdateQueued = false;

function updateStickyHeaderSize() {
  document.documentElement.style.setProperty(
    "--section-sticky-top",
    `${stickyHeader.getBoundingClientRect().height}px`
  );
  queueHeaderSurfaceUpdate();
}

const headerResizeObserver = new ResizeObserver(updateStickyHeaderSize);
headerResizeObserver.observe(stickyHeader);
updateStickyHeaderSize();

function updateHeaderSurface() {
  headerSurfaceUpdateQueued = false;

  const headerBounds = stickyHeader.getBoundingClientRect();
  const sampleX = Math.min(window.innerWidth - 1, Math.max(0, window.innerWidth / 2));
  const sampleY = Math.min(window.innerHeight - 1, headerBounds.bottom + 1);
  const section = document
    .elementsFromPoint(sampleX, sampleY)
    .map((element) => element.closest("main > section"))
    .find(Boolean);
  const sectionStyles = section ? getComputedStyle(section) : null;
  const backgroundColor = sectionStyles?.backgroundColor;
  const hasSectionBackground = backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)";
  const pageBackgroundColor = getComputedStyle(document.body).backgroundColor;

  stickyHeader.style.backgroundColor = hasSectionBackground ? backgroundColor : pageBackgroundColor;
}

function queueHeaderSurfaceUpdate() {
  if (!headerSurfaceUpdateQueued) {
    headerSurfaceUpdateQueued = true;
    window.requestAnimationFrame(updateHeaderSurface);
  }
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
  queueHeaderSurfaceUpdate();

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

window.addEventListener("scroll", queueHeaderSurfaceUpdate, { passive: true });
window.addEventListener("resize", updateStickyHeaderSize);

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
updateHeaderSurface();
