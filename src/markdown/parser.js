// src/markdown/parser.js

import { getCombinedMappings } from './config.js';

/**
 * Default fallback mappings used if config loading fails.
 */
const fallbackMappings = [
	{ mdStart: '# ', htmlElement: 'h1' },
	{ mdStart: '## ', htmlElement: 'h2' },
	{ mdStart: '### ', htmlElement: 'h3' },
	{ mdStart: '> ', htmlElement: 'blockquote' },
	{ mdStart: '- ', htmlElement: 'li', wrapWith: 'ul' },
	{ mdStart: '* ', htmlElement: 'li', wrapWith: 'ul' },
	{ mdStart: '1. ', htmlElement: 'li', wrapWith: 'ol' }
];

function parseInline(text) {
	return text
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/`(.+?)`/g, '<code>$1</code>')
		.replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1">')
		.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

/**
 * Converts markdown string to HTML using external or fallback mappings.
 * @param {string} markdown
 * @returns {Promise<string>}
 */
export async function markdownToHtml(markdown) {
	let mappings;
	try {
		mappings = await getCombinedMappings();
		if (!Array.isArray(mappings) || mappings.length === 0) throw new Error('No valid mappings');
	} catch {
		console.warn('Falling back to default markdown mappings');
		mappings = fallbackMappings;
	}

	const lines = markdown.split('\n');
	let output = '';
	let currentListType = null;

	for (let line of lines) {
		let trimmed = line.trimEnd();
		let matched = false;

		for (let map of mappings) {
			if (trimmed.startsWith(map.mdStart)) {
				let content = trimmed.substring(map.mdStart.length);
				let html = `<${map.htmlElement}>${parseInline(content)}</${map.htmlElement}>`;

				if (map.wrapWith) {
					if (currentListType !== map.wrapWith) {
						if (currentListType) output += `</${currentListType}>\n`;
						output += `<${map.wrapWith}>\n`;
						currentListType = map.wrapWith;
					}
					output += html + '\n';
				} else {
					if (currentListType) {
						output += `</${currentListType}>\n`;
						currentListType = null;
					}
					output += html + '\n';
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