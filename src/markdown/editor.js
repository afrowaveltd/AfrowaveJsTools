// src/markdown/editor.js

import { convertMarkdown, streamMarkdown } from "./converter.js";
import { getObject, setObject } from "../storage/localStorage.js";
import { convertHtmlToMarkdown } from "./htmlToMarkdown.js";

export class MarkdownEditor {
  constructor(options = {}) {
    this.settings = {
      elementId: options.elementId || "md-editor",
      previewId: options.previewId || "md-preview",
      toolbarId: options.toolbarId || "md-toolbar-buttons",
      wysiwygId: options.wysiwygId || "md-wysiwyg",
      mode: options.mode || "code", // ← ZMĚNA: výchozí režim je teď 'code'
      storageKey: options.storageKey || "markdown-draft",
      streaming: options.streaming || false,
      mappingConfig: options.mappingConfig || {},
      autoRender: true,
      ...options,
    };

    this.editorEl = document.getElementById(this.settings.elementId);
    this.previewEl = document.getElementById(this.settings.previewId);
    this.toolbarEl = document.getElementById(this.settings.toolbarId);
    this.wysiwygEl = document.getElementById(this.settings.wysiwygId);

    this.value = "";
    this.init();
  }

  init() {
    if (!this.editorEl) {
      throw new Error(
        `Editor element with id '${this.settings.elementId}' not found.`
      );
    }
    this.value = getObject(this.settings.storageKey) || "";
    this.editorEl.value = this.value;
    setObject(this.settings.storageKey, this.value);

    this.editorEl.addEventListener("input", () => {
      this.value = this.editorEl.value;
      setObject(this.settings.storageKey, this.value);
      if (this.settings.autoRender) {
        this.render();
      }
    });

    if (this.wysiwygEl) {
      const handler = async () => {
        const html = this.wysiwygEl.innerHTML;
        this.value = await convertHtmlToMarkdown(html);
        setObject(this.settings.storageKey, this.value);
        this.editorEl.value = this.value;
        if (this.settings.autoRender) {
          this.render();
        }
      };
      this.wysiwygEl.addEventListener("input", handler);
      this.wysiwygEl.addEventListener("keyup", handler);
      this.wysiwygEl.addEventListener("paste", handler);
      this.wysiwygEl.addEventListener("mouseup", handler);
      this.wysiwygEl.addEventListener("click", handler);
    }

    if (this.toolbarEl) this.renderToolbar();
    if (this.settings.autoRender) {
      this.render();
    }
  }
  renderToolbar() {
    if (!this.toolbarEl) return;
  
    this.toolbarEl.className = "toolbar toolbar-group aMD-toolbar aMD-toolbar-group";
    this.toolbarEl.innerHTML = `
      <button class="btn btn-sm btn-outline-secondary aMD-btn aMD-btn-sm" data-action="bold" title="Bold">
        <i class="bi bi-type-bold"></i>
      </button>
      <button class="btn btn-sm btn-outline-secondary aMD-btn aMD-btn-sm" data-action="italic" title="Italic">
        <i class="bi bi-type-italic"></i>
      </button>
      <button class="btn btn-sm btn-outline-secondary aMD-btn aMD-btn-sm" data-action="code" title="Code">
        <i class="bi bi-code"></i>
      </button>
      <button class="btn btn-sm btn-outline-secondary aMD-btn aMD-btn-sm" data-action="heading" title="Heading">
        <i class="bi bi-type-h1"></i>
      </button>
      <div class="divider aMD-toolbar-divider"></div>
      <button class="btn btn-sm btn-outline-secondary aMD-btn aMD-btn-sm" data-action="mode-code" title="Code Mode">
        <i class="bi bi-code-slash"></i>
      </button>
      <button class="btn btn-sm btn-outline-secondary aMD-btn aMD-btn-sm" data-action="mode-wysiwyg" title="WYSIWYG Mode">
        <i class="bi bi-layout-text-window-reverse"></i>
      </button>
      <button class="btn btn-sm btn-outline-secondary aMD-btn aMD-btn-sm" data-action="mode-split" title="Split Mode">
        <i class="bi bi-columns-gap"></i>
      </button>
    `;
  
    this.toolbarEl.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
  
        if (action.startsWith("mode-")) {
          const mode = action.replace("mode-", "");
          this.updateVisibility(mode);
        } else {
          this.applyFormat(action);
        }
      });
    });
  }
  

  getMarkdown() {
    return this.value;
  }

  setMarkdown(text) {
    this.value = text;
    this.editorEl.value = text;
    setObject(this.settings.storageKey, text);
    if (this.settings.autoRender) this.render();
  }

  applyFormat(type) {
    const textarea = this.editorEl;
    const { selectionStart, selectionEnd, value, scrollTop, scrollLeft } =
      textarea;
    let before = value.slice(0, selectionStart);
    let selected = value.slice(selectionStart, selectionEnd);
    let after = value.slice(selectionEnd);

    const originalStart = selectionStart;
    const originalEnd = selectionEnd;

    const toggle = (marker, double = false) => {
      const escaped = marker.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(
        `^${double ? escaped + escaped : escaped}(.*)$${
          double ? escaped + escaped : escaped
        }`
      );
      if (regex.test(selected)) {
        selected = selected.replace(regex, "$1");
      } else {
        selected = `${double ? marker + marker : marker}${selected || type}${
          double ? marker + marker : marker
        }`;
      }
    };

    let marker = "";
    switch (type) {
      case "bold":
        marker = "**";
        toggle("**", true);
        break;
      case "italic":
        marker = "*";
        toggle("*");
        break;
      case "code":
        marker = "`";
        toggle("`");
        break;
      case "heading":
        if (selected.startsWith("# ")) {
          selected = selected.slice(2);
        } else {
          selected = `# ${selected || "Heading"}`;
        }
        break;
      case "hr":
        selected = "";
        before += "\n---\n";
        break;

      case "ul":
        selected = selected
          .split("\n")
          .map((line) => (line.startsWith("- ") ? line.slice(2) : `- ${line}`))
          .join("\n");
        break;
      case "ol":
        selected = selected
          .split("\n")
          .map((line, i) => `${i + 1}. ${line.replace(/^\d+\.\s/, "")}`)
          .join("\n");
        break;
      case "table":
        selected =
          selected ||
          `| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |`;
        break;
      default:
        return;
    }

    const newValue = before + selected + after;
    this.setMarkdown(newValue);

    let cursorPos = originalStart;
    if (!value.slice(originalStart, originalEnd)) {
      cursorPos += marker.length * (type === "bold" ? 2 : 1);
    } else {
      cursorPos += selected.length;
    }

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
      textarea.scrollTop = scrollTop;
      textarea.scrollLeft = scrollLeft;
    });
  }

  async downloadFile(format = "md") {
    const content =
      format === "html" ? await convertMarkdown(this.value) : this.value;
    const blob = new Blob([content], {
      type: format === "html" ? "text/html" : "text/markdown",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `document.${format}`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async render() {
    if (!this.previewEl) return;
    if (this.settings.streaming) {
      this.previewEl.innerHTML = "";
      for await (let line of streamMarkdown(this.value)) {
        this.previewEl.innerHTML += line + "\n";
      }
    } else {
      const html = await convertMarkdown(this.value);
      this.previewEl.innerHTML = html;
    }
    if (window.Prism) Prism.highlightAll();
  }

  destroy() {
    this.editorEl.removeEventListener("input", this.render);
    this.editorEl = null;
    this.previewEl = null;
    if (this.toolbarEl) this.toolbarEl.innerHTML = "";
  }

  loadFromStorage() {
    const content = getObject(this.settings.storageKey);
    if (content) this.setMarkdown(content);
  }

  saveToStorage() {
    setObject(this.settings.storageKey, this.getMarkdown());
  }

  async updateVisibility(mode = this.settings.mode) {
    const previousMode = this.settings.mode;
    this.settings.mode = mode;

    await this.syncCurrentContent();

    if (!this.editorEl || !this.previewEl || !this.wysiwygEl) return;

    // vždy aktualizujeme obě komponenty na základě hodnoty
    this.editorEl.value = this.value;
    const html = await convertMarkdown(this.value);
    this.wysiwygEl.innerHTML = html;

    this.editorEl.style.display =
      mode === "code" || mode === "split" ? "block" : "none";
    this.previewEl.style.display = mode === "preview" ? "block" : "none";
    this.wysiwygEl.style.display =
      mode === "wysiwyg" || mode === "split" ? "block" : "none";
  }

  async syncCurrentContent() {
    const isVisible = (el) =>
      el && window.getComputedStyle(el).display !== "none";

    if (isVisible(this.wysiwygEl)) {
      const html = this.wysiwygEl.innerHTML.trim();
      this.value = await convertHtmlToMarkdown(html);
    } else if (isVisible(this.editorEl)) {
      this.value = this.editorEl.value.trim();
    }

    setObject(this.settings.storageKey, this.value);
  }

  togglePreviewVisibility(show = null) {
    if (!this.previewEl) return;
    const isVisible = this.previewEl.style.display !== "none";
    const willShow = show !== null ? show : !isVisible;
    this.previewEl.style.display = willShow ? "block" : "none";
  }

  // Reserved for later use:
  // async loadFromApi(params = {}) {...}
  // async saveToApi(data = {}, params = {}) {...}
}
