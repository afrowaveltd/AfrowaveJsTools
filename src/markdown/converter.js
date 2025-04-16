// src/markdown/converter.js

import { getCombinedMappings } from "./config.js";

const fallbackMappings = [
  { mdStart: "# ", htmlElement: "h1" },
  { mdStart: "## ", htmlElement: "h2" },
  { mdStart: "### ", htmlElement: "h3" },
  { mdStart: "> ", htmlElement: "blockquote" },
  { mdStart: "---", htmlElement: "hr" },
  { mdStart: "- ", htmlElement: "li", wrapWith: "ul" },
  { mdStart: "* ", htmlElement: "li", wrapWith: "ul" },
  { mdStart: "1. ", htmlElement: "li", wrapWith: "ol" },
  {
    mdStart: "```",
    htmlElement: "pre",
    wrapWith: "codeblock",
    langSupport: true,
  },
];

function parseInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

export async function convertMarkdown(markdown, options = {}) {
  let mappings;
  try {
    mappings = await getCombinedMappings();
    if (!Array.isArray(mappings) || mappings.length === 0)
      throw new Error("Invalid mapping");
  } catch {
    console.warn("[converter] Using fallback mappings");
    mappings = fallbackMappings;
  }

  const lines = markdown.split("\n");
  let output = "";
  let currentListType = null;
  let inCodeBlock = false;
  let codeLang = "";
  let codeBuffer = [];

  for (let line of lines) {
    const trimmed = line.trimEnd();

    if (trimmed.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = trimmed.replace("```", "").trim();
        continue;
      } else {
        // Close code block
        inCodeBlock = false;
        output += `<pre><code${
          codeLang ? ` class=\"language-${codeLang}\"` : ""
        }>${codeBuffer.join("\n")}</code></pre>\n`;
        codeBuffer = [];
        codeLang = "";
        continue;
      }
    }

    if (inCodeBlock) {
      codeBuffer.push(trimmed);
      continue;
    }

    let matched = false;
    for (let map of mappings) {
      if (trimmed.startsWith(map.mdStart)) {
        let content = trimmed.substring(map.mdStart.length);
        let html = `<${map.htmlElement}>${parseInline(content)}</${
          map.htmlElement
        }>`;

        if (map.wrapWith) {
          if (currentListType !== map.wrapWith) {
            if (currentListType) output += `</${currentListType}>\n`;
            output += `<${map.wrapWith}>\n`;
            currentListType = map.wrapWith;
          }
          output += html + "\n";
        } else {
          if (currentListType) {
            output += `</${currentListType}>\n`;
            currentListType = null;
          }
          output += html + "\n";
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      if (currentListType) {
        output += `</${currentListType}>\n`;
        currentListType = null;
      }
      output += `<p>${parseInline(trimmed)}</p>\n`;
    }
  }

  if (currentListType) {
    output += `</${currentListType}>\n`;
  }

  return output.trim();
}

export async function* streamMarkdown(markdown, delay = 50) {
  let html = await convertMarkdown(markdown);
  const lines = html.split("\n");
  for (let line of lines) {
    yield line;
    await new Promise((res) => setTimeout(res, delay));
  }
}
