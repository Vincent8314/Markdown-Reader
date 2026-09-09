const markdownUrlInput = document.getElementById("markdownUrl");
const loadButton = document.getElementById("loadButton");

const markdownFileInput = document.getElementById("markdownFile");
const fileNameDisplay = document.getElementById("fileName");

const themeButtons = document.querySelectorAll(".themeControls button[data-theme]");

const status = document.getElementById("status");
const output = document.getElementById("markdownOutput");
const content = document.getElementById("markdownContent");

const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");

const DEFAULT_MARKDOWN_URL = "https://vincent8314.github.io/Encyclopedia-md/README.md";


/* =========================
   RENDER MARKDOWN (shared)
   ========================= */

function renderMarkdown(markdownText) {
  const html = marked.parse(markdownText);
  content.innerHTML = html;
}

function setStatus(message) {
  status.textContent = message;
}


/* =========================
   LOAD FROM URL
   ========================= */

async function loadMarkdownFromUrl(url) {

  if (!url) {
    setStatus("Please enter a Markdown URL.");
    return;
  }

  try {
    setStatus("Loading Markdown...");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const markdownText = await response.text();

    renderMarkdown(markdownText);

    setStatus("Markdown loaded from URL.");
    fileNameDisplay.textContent = "";

    closeMenu();

  } catch (error) {
    console.error(error);

    setStatus(`Could not load the Markdown: ${error.message}`);

    content.innerHTML = "";
  }
}


/* =========================
   LOAD FROM FILE
   ========================= */

function loadMarkdownFromFile(file) {

  if (!file) {
    return;
  }

  setStatus("Reading file...");

  const reader = new FileReader();

  reader.onload = () => {
    renderMarkdown(reader.result);
    setStatus(`Markdown loaded from "${file.name}".`);
    fileNameDisplay.textContent = file.name;
    closeMenu();
  };

  reader.onerror = () => {
    console.error(reader.error);
    setStatus("Could not read that file.");
    content.innerHTML = "";
  };

  reader.readAsText(file);
}


/* =========================
   THEME SWITCHING
   ========================= */

function setTheme(theme) {

  output.dataset.theme = theme;

  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.theme === theme));
  });
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
});


/* =========================
   URL LOAD TRIGGERS
   ========================= */

loadButton.addEventListener("click", () => {
  loadMarkdownFromUrl(markdownUrlInput.value.trim());
});

markdownUrlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadMarkdownFromUrl(markdownUrlInput.value.trim());
  }
});


/* =========================
   FILE LOAD TRIGGER
   ========================= */

markdownFileInput.addEventListener("change", () => {
  const file = markdownFileInput.files[0];
  loadMarkdownFromFile(file);
});


/* =========================
   SIDEBAR MENU
   ========================= */

function openMenu() {
  sidebar.classList.add("open");
  sidebar.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");

  // Move focus into the sidebar for keyboard/screen-reader users.
  markdownUrlInput.focus();
}

function closeMenu() {
  sidebar.classList.remove("open");
  sidebar.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");

  menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.contains("open");
  isOpen ? closeMenu() : openMenu();
});

closeSidebar.addEventListener("click", closeMenu);
backdrop.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("open")) {
    closeMenu();
  }
});


/* =========================
   DEFAULT MARKDOWN
   ========================= */

if (DEFAULT_MARKDOWN_URL) {

  markdownUrlInput.value = DEFAULT_MARKDOWN_URL;

  loadMarkdownFromUrl(DEFAULT_MARKDOWN_URL);

}
