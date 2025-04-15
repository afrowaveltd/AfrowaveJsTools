// src/markdown/htmlToMarkdown.js

import { getCombinedMappings } from './config.js';

const stripTags = html => html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

export async function convertHtmlToMarkdown(html) {
	let mappings;
	try {
		mappings = await getCombinedMappings();
		if (!Array.isArray(mappings)) throw new Error('Invalid mappings');
	} catch {
		console.warn('[htmlToMarkdown] using fallback');
		mappings = [
			{ htmlElement: 'h1', mdStart: '# ' },
			{ htmlElement: 'h2', mdStart: '## ' },
			{ htmlElement: 'h3', mdStart: '### ' },
			{ htmlElement: 'h4', mdStart: '#### ' },
			{ htmlElement: 'h5', mdStart: '##### ' },
			{ htmlElement: 'h6', mdStart: '###### ' },
			{ htmlElement: 'blockquote', mdStart: '> ' },
			{ htmlElement: 'li', mdStart: '- ' },
			{ htmlElement: 'pre', mdStart: '```\n', mdEnd: '\n```' },
			{ htmlElement: 'p', mdStart: '' },
			{ htmlElement: 'strong', mdInline: '**' },
			{ htmlElement: 'b', mdInline: '**' },
			{ htmlElement: 'em', mdInline: '*' },
			{ htmlElement: 'i', mdInline: '*' },
			{ htmlElement: 'code', mdInline: '`' },
			{ htmlElement: 'a', mdLink: true },
			{ htmlElement: 'img', mdImage: true }
		];
	}

	html = stripTags(html);
	const wrapper = document.createElement('div');
	wrapper.innerHTML = html;

	let result = '';

	const processNode = (node) => {
		if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim();
		if (node.nodeType !== Node.ELEMENT_NODE) return '';

		const tag = node.tagName.toLowerCase();
		const map = mappings.find(m => m.htmlElement.toLowerCase() === tag);
		let content = Array.from(node.childNodes).map(processNode).join('');
		if (!map) return content;

		if (map.mdInline) {
			return `${map.mdInline}${content}${map.mdInline}`;
		}

		if (map.mdLink && node.hasAttribute('href')) {
			return `[${content}](${node.getAttribute('href')})`;
		}

		if (map.mdImage && node.hasAttribute('src')) {
			return `![${node.getAttribute('alt') || ''}](${node.getAttribute('src')})`;
		}

		if (tag === 'pre') {
			return `${map.mdStart}${content}${map.mdEnd}`;
		}

		return `${map.mdStart}${content}`;
	};

	for (let child of wrapper.childNodes) {
		const line = processNode(child);
		if (line.trim()) result += line + '\n';
	}

	return result.trim();
}
