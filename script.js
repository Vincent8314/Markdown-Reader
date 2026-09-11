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

  // marked.js only produces the <pre><code> structure; it doesn't
  // color the code itself. highlight.js walks each code block and
  // wraps the tokens (keywords, strings, etc.) in the hljs-* spans
  // that style.css already has rules for.
  if (typeof hljs === "undefined") {
    console.warn("highlight.js failed to load; code blocks will render uncolored.");
  } else {
    content.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }
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


// document.querySelectorAll('#markdownContent ul').forEach(ul => {
//   let depth = 0;
//   let el = ul;
//   while ((el = el.parentElement?.closest('ul'))) depth++;
//   ul.style.listStyleType = depth % 2 === 0 ? 'disc' : 'circle';
// });

function applyNestedListStyles(root = document.querySelector('#markdownContent')) {
  if (!root) return console.warn('applyNestedListStyles: root not found');

  const lists = root.querySelectorAll('ul');
  console.log(`applyNestedListStyles: found ${lists.length} <ul> elements`);

  lists.forEach(ul => {
    let depth = 0;
    let el = ul;
    while ((el = el.parentElement?.closest('ul'))) depth++;
    ul.style.listStyleType = depth % 2 === 0 ? 'disc' : 'circle';
  });
}

// Run once after initial render
applyNestedListStyles();

// Re-run whenever markdown content changes (streaming, edits, etc.)
const container = document.querySelector('#markdownContent');
if (container) {
  const observer = new MutationObserver(() => applyNestedListStyles());
  observer.observe(container, { childList: true, subtree: true });
}