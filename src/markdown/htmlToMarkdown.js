// src/markdown/htmlToMarkdown.js

export async function convertHtmlToMarkdown(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  function parse(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const tag = node.tagName.toLowerCase();
    let content = Array.from(node.childNodes).map(parse).join("");

    switch (tag) {
      case "strong":
      case "b":
        return `**${content}**`;
      case "em":
      case "i":
        return `*${content}*`;
      case "code":
        return `\`${content}\``;
      case "pre":
        const codeNode = node.querySelector("code");
        const langClass = codeNode?.getAttribute("class") || "";
        const langMatch = langClass.match(/language-([\w-]+)/);
        const lang = langMatch ? langMatch[1] : "";
        const codeContent = codeNode ? parse(codeNode) : content;
        return `\n\n\`\`\`${lang}\n${codeContent}\n\`\`\`\n\n`;

      case "h1":
        return `# ${content}\n\n`;
      case "h2":
        return `## ${content}\n\n`;
      case "h3":
        return `### ${content}\n\n`;
      case "h4":
        return `#### ${content}\n\n`;
      case "h5":
        return `##### ${content}\n\n`;
      case "h6":
        return `###### ${content}\n\n`;
      case "ul":
        return (
          content
            .split(/\n+/)
            .map((line) => (line ? `- ${line}` : ""))
            .join("\n") + "\n\n"
        );
      case "ol":
        let i = 1;
        return (
          content
            .split(/\n+/)
            .map((line) => (line ? `${i++}. ${line}` : ""))
            .join("\n") + "\n\n"
        );
      case "li":
        return `${content}\n`;
      case "blockquote":
        return (
          content
            .split("\n")
            .map(function (line) {
              return "> " + line;
            })
            .join("\n") + "\n\n"
        );

      case "a":
        return `[${content}](${node.getAttribute("href")})`;
      case "img":
        return `![${node.getAttribute("alt") || ""}](${node.getAttribute(
          "src"
        )})`;
      case "br":
        return "  \n";
      case "hr":
        return `---\n\n`;
      case "p":
        return `${content}\n\n`;
      default:
        return content;
    }
  }

  let markdown = Array.from(tempDiv.childNodes).map(parse).join("").trim();
  // Odstranit více než 2 prázdné řádky po sobě
  markdown = markdown.replace(/\n{3,}/g, "\n\n");
  return markdown;
}
