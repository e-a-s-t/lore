import { esc, renderMarkdown } from "./markdown.js";
import { outgoingRelations, incomingRelations } from "./relations.js";

const typeLabels = {
  all: "All",
  requirements: "Requirements",
  stories: "Stories",
  adrs: "ADRs",
  tests: "Tests",
};

let lore = {};
let allItems = [];
let currentType = "requirements";
let selectedItem = null;
let contentMode = "rendered";

const findItem = (id) => allItems.find((item) => item.id === id);

const uniqueById = (items) => {
  const seen = new Set();

  return items.filter((item) => {
    const id = item.id || item.source?.id;
    if (!id || seen.has(id)) return false;

    seen.add(id);
    return true;
  });
};

const getContent = (item) =>
  item?.content || item?.body || item?.markdown || "";

const getVisibleItems = () => {
  const q = document.getElementById("search")?.value?.toLowerCase() || "";

  return allItems.filter((item) => {
    const matchesType = currentType === "all" || item._type === currentType;
    const matchesSearch = JSON.stringify(item).toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });
};

const renderRelationsView = (item) => {
  const outgoingRaw = outgoingRelations(item, findItem);
  const incomingRaw = incomingRelations(item, allItems);

  const uniqueOutgoingRaw = uniqueById(outgoingRaw);
  const uniqueIncomingRaw = uniqueById(incomingRaw);

  const outgoingIds = new Set(uniqueOutgoingRaw.map((r) => r.id));
  const incomingIds = new Set(uniqueIncomingRaw.map((r) => r.source.id));

  const both = uniqueOutgoingRaw.filter((r) => incomingIds.has(r.id));
  const bothIds = new Set(both.map((r) => r.id));

  const outgoing = uniqueOutgoingRaw.filter((r) => !bothIds.has(r.id));
  const incoming = uniqueIncomingRaw.filter((r) => !bothIds.has(r.source.id));

  const relationPill = (id, title = "", missing = false) => `
    <span class="pill" onclick="selectById('${esc(id)}')">
      ${esc(id)}${title ? " — " + esc(title) : ""}${missing ? " ?" : ""}
    </span>
  `;

  const bothHtml = both.length
    ? both
        .map(
          (r) => `
        <div class="relation">
          ${relationPill(r.id, r.target?.title || "", !r.target)}
        </div>
      `,
        )
        .join("")
    : '<div class="muted">No bidirectional relations.</div>';

  const outgoingHtml = outgoing.length
    ? outgoing
        .map(
          (r) => `
        <div class="relation">
          <span class="muted">${esc(r.field)}</span><br />
          ${relationPill(r.id, r.target?.title || "", !r.target)}
        </div>
      `,
        )
        .join("")
    : '<div class="muted">No outgoing relations.</div>';

  const incomingHtml = incoming.length
    ? incoming
        .map(
          (r) => `
        <div class="relation">
          <span class="muted">${esc(r.field)}</span><br />
          ${relationPill(r.source.id, r.source.title || "")}
        </div>
      `,
        )
        .join("")
    : '<div class="muted">No incoming relations.</div>';

  const treeIncoming = [
    ...both.map((r) => ({
      id: r.id,
      title: r.target?.title || "",
    })),
    ...incoming.map((r) => ({
      id: r.source.id,
      title: r.source.title || "",
    })),
  ];

  const treeOutgoing = outgoing.map((r) => ({
    id: r.id,
    title: r.target?.title || "",
  }));

  const treeHtml = `
    <div class="relation-tree">
      <div class="tree-side">
        ${
          treeIncoming
            .map(
              (r) => `
          <div class="tree-node" title="${esc(r.title)}" onclick="selectById('${esc(r.id)}')">
            ${esc(r.id)}
          </div>
        `,
            )
            .join("") || '<div class="tree-empty">No incoming</div>'
        }
      </div>

      <div class="tree-center">
        <div class="tree-line"></div>
        <div class="tree-current">${esc(item.id)}</div>
        <div class="tree-line"></div>
      </div>

      <div class="tree-side">
        ${
          treeOutgoing
            .map(
              (r) => `
          <div class="tree-node" title="${esc(r.title)}" onclick="selectById('${esc(r.id)}')">
            ${esc(r.id)}
          </div>
        `,
            )
            .join("") || '<div class="tree-empty">No outgoing</div>'
        }
      </div>
    </div>
  `;

  return `
    <h3>Relations</h3>

    <h4>Bidirectional</h4>
    ${bothHtml}

    <div class="relations-columns">
      <div>
        <h4>Links from this item</h4>
        ${outgoingHtml}
      </div>

      <div>
        <h4>Linked by other items</h4>
        ${incomingHtml}
      </div>
    </div>

    <h4>Visual tree</h4>
    ${treeHtml}
  `;
};

const renderContent = (item) => {
  const content = getContent(item) || JSON.stringify(item, null, 2);

  if (contentMode === "markdown") {
    return `<pre>${esc(content)}</pre>`;
  }

  return `<div class="rendered">${renderMarkdown(content)}</div>`;
};

const renderDetail = (item) => {
  selectedItem = item;

  if (!item) {
    document.getElementById("content").innerHTML =
      '<div class="muted">Select an item to view content.</div>';
    document.getElementById("relations").innerHTML =
      '<div class="muted">Select an item to view relations.</div>';
    return;
  }

  document.getElementById("content").innerHTML = `
    <div class="item-header">
      <h2>${esc(item.id)}</h2>
      <h3>${esc(item.title || "")}</h3>
      <div class="muted">Type: ${esc(item._type)} | Status: ${esc(item.status || "")}</div>
    </div>

    <h3>Content</h3>
    <div class="content-toolbar">
      <button onclick="toggleContentMode()">
        ${contentMode === "markdown" ? "Show formatted" : "Show markdown"}
      </button>
    </div>

    ${renderContent(item)}
  `;

  document.getElementById("relations").innerHTML = renderRelationsView(item);
};

const renderList = () => {
  const items = getVisibleItems();

  const grouped = {
    requirements: items.filter((item) => item._type === "requirements"),
    stories: items.filter((item) => item._type === "stories"),
    adrs: items.filter((item) => item._type === "adrs"),
    tests: items.filter((item) => item._type === "tests"),
  };

  const groupHtml = Object.entries(grouped)
    .filter(([, groupItems]) => groupItems.length > 0)
    .map(
      ([type, groupItems]) => `
      <div class="item-group">
        <h3>${esc(typeLabels[type])} <span class="muted">(${groupItems.length})</span></h3>
        ${groupItems
          .map(
            (item) => `
          <div class="item" onclick="selectById('${esc(item.id)}')">
            <div class="item-id">${esc(item.id)}</div>
            <div class="item-title">${esc(item.title || "")}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    `,
    )
    .join("");

  document.getElementById("list").innerHTML =
    groupHtml || '<div class="muted">No matching lore items.</div>';
};

window.selectType = (type) => {
  currentType = type;

  const filter = document.getElementById("typeFilter");
  if (filter) {
    filter.value = type;
  }

  renderList();
  renderDetail(getVisibleItems()[0]);
};

window.selectById = (id) => {
  const item = findItem(id);
  if (!item) return;

  renderDetail(item);
};

window.setTypeFilter = (value) => {
  currentType = value;
  renderList();
  renderDetail(getVisibleItems()[0]);
};

window.toggleContentMode = () => {
  contentMode = contentMode === "markdown" ? "rendered" : "markdown";
  renderDetail(selectedItem);
};

window.searchLore = () => {
  renderList();
  renderDetail(getVisibleItems()[0]);
};

async function start() {
  const response = await fetch("/api/lore");
  lore = await response.json();

  allItems = ["requirements", "stories", "adrs", "tests"].flatMap((type) =>
    (lore[type] || []).map((item) => ({ ...item, _type: type })),
  );

  document.getElementById("app").innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <select id="typeFilter" onchange="setTypeFilter(this.value)">
          <option value="all">All</option>
          <option value="requirements" selected>Requirements</option>
          <option value="stories">Stories</option>
          <option value="adrs">ADRs</option>
          <option value="tests">Tests</option>
        </select>

        <input id="search" placeholder="Search lore..." oninput="searchLore()" />

        <div id="list"></div>
      </aside>

      <main class="main">
        <div id="content"></div>
      </main>

      <aside class="relations-panel">
        <div id="relations"></div>
      </aside>
    </div>
  `;

  renderList();
  renderDetail(getVisibleItems()[0]);
}

start();
