export function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderMarkdown(markdown) {
  const lines = esc(markdown).split("\n");
  let html = "";
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h3>${line.slice(4)}</h3>`;
    } else if (line.startsWith("## ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h2>${line.slice(3)}</h2>`;
    } else if (line.startsWith("# ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h1>${line.slice(2)}</h1>`;
    } else if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${line.slice(2)}</li>`;
    } else if (line.trim() === "") {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += "<br />";
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<p>${line}</p>`;
    }
  }

  if (inList) {
    html += "</ul>";
  }

  const inlineCodeRegex = new RegExp("`([^`]+)`", "g");

  return html
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(inlineCodeRegex, "<code>$1</code>");
}
