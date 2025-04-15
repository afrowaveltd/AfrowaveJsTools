// src/utils/dom.js

/**
 * Converts newline-separated message to HTML <ul><li>...</li></ul> string.
 * @param {string} message
 * @returns {string} - HTML string
 */
export function logToHtml(message) {
	const messageLines = message.split('\n');
	const listItems = messageLines.map(line => `<li>${line}</li>`);
	return `<ul>\n${listItems.join('\n')}\n</ul>`;
}

/**
 * Escapes < and > to prevent HTML injection.
 * @param {string} text
 * @returns {string}
 */
export function escapeHTML(text) {
	return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Displays a message as HTML list inside a specified element with typewriter effect.
 * @param {string} message
 * @param {string} elementId
 * @param {number} speed
 */
export async function showLogInElement(message, elementId = 'log', speed = 5) {
	const logElement = document.getElementById(elementId);
	if (!logElement) return;

	let lines = message.split('\n').filter(line => line.length > 0);
	let html = '<ul>\n';
	for (let line of lines) {
		html += `<li>${escapeHTML(line)}</li>\n`;
	}
	html += '</ul>';

	typewriter(elementId, html, speed);
}

/**
 * Writes HTML to an element with typing animation.
 * @param {string} elementId
 * @param {string} html
 * @param {number} speed
 */
export async function typewriter(elementId, html, speed = 10) {
	const element = document.getElementById(elementId);
	if (!element) return;

	element.innerHTML = "";
	const container = document.createElement("div");
	container.innerHTML = html;

	const processNode = async (node, parent) => {
		if (node.nodeType === Node.TEXT_NODE) {
			for (let char of node.textContent) {
				parent.append(char);
				await new Promise(r => setTimeout(r, Math.random() * speed * 2));
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const newElement = document.createElement(node.tagName);
			parent.appendChild(newElement);
			for (let child of node.childNodes) {
				await processNode(child, newElement);
			}
		}
	};

	const ulElement = document.createElement("ul");
	element.appendChild(ulElement);

	for (let child of container.childNodes) {
		if (child.nodeType === Node.ELEMENT_NODE && child.tagName === "LI") {
			await processNode(child, ulElement);
		} else {
			await processNode(child, element);
		}
	}
}