// src/markdown/editor.js

import { convertMarkdown, streamMarkdown } from './converter.js';
import { getObject, setObject } from '../storage/localStorage.js';

export class MarkdownEditor {
	constructor(options = {}) {
		this.settings = {
			elementId: options.elementId || 'md-editor',
			previewId: options.previewId || 'md-preview',
			wysiwygId: options.wysiwygId || 'md-wysiwyg',
			toolbarId: options.toolbarId || 'md-toolbar',
			mode: options.mode || 'split', // 'code' | 'split' | 'wysiwyg'
			storageKey: options.storageKey || 'markdown-draft',
			streaming: options.streaming || false,
			mappingConfig: options.mappingConfig || {},
			autoRender: true,
			...options
		};

		this.editorEl = document.getElementById(this.settings.elementId);
		this.previewEl = document.getElementById(this.settings.previewId);
		this.wysiwygEl = document.getElementById(this.settings.wysiwygId);
		this.toolbarEl = document.getElementById(this.settings.toolbarId);
		this.value = '';
		this.init();
	}

	init() {
		if (!this.editorEl) {
			throw new Error(`Editor element with id '${this.settings.elementId}' not found.`);
		}
		this.value = getObject(this.settings.storageKey) || '';
		this.editorEl.value = this.value;

		this.editorEl.addEventListener('input', () => {
			this.value = this.editorEl.value;
			setObject(this.settings.storageKey, this.value);
			if (this.settings.autoRender && this.settings.mode !== 'wysiwyg') {
				this.render();
			}
		});

		if (this.wysiwygEl) {
			this.wysiwygEl.addEventListener('input', () => {
				this.value = this.wysiwygEl.innerHTML;
				setObject(this.settings.storageKey, this.value);
			});
		}

		if (this.toolbarEl) this.renderToolbar();
		if (this.settings.autoRender && this.settings.mode !== 'wysiwyg') {
			this.render();
		}
		this.updateVisibility();
	}

	renderToolbar() {
		this.toolbarEl.innerHTML = `
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-outline-secondary" title="Bold" data-action="bold">
					<i class="bi bi-type-bold"></i>
				</button>
				<button type="button" class="btn btn-outline-secondary" title="Italic" data-action="italic">
					<i class="bi bi-type-italic"></i>
				</button>
				<button type="button" class="btn btn-outline-secondary" title="Code" data-action="code">
					<i class="bi bi-code"></i>
				</button>
				<button type="button" class="btn btn-outline-secondary" title="Heading" data-action="heading">
					<i class="bi bi-type-h1"></i>
				</button>
			</div>`;

		this.toolbarEl.querySelectorAll('button[data-action]').forEach(btn => {
			btn.addEventListener('click', () => {
				const action = btn.dataset.action;
				this.applyFormat(action);
			});
		});
	}

	applyFormat(action) {
		if (this.settings.mode === 'wysiwyg' && this.wysiwygEl) {
			document.execCommand(action);
			return;
		}

		const textarea = this.editorEl;
		const { selectionStart, selectionEnd, value } = textarea;
		let before = value.substring(0, selectionStart);
		let selected = value.substring(selectionStart, selectionEnd);
		let after = value.substring(selectionEnd);

		switch (action) {
			case 'bold': selected = `**${selected || 'bold'}**`; break;
			case 'italic': selected = `*${selected || 'italic'}*`; break;
			case 'code': selected = `\`${selected || 'code'}\``; break;
			case 'heading': selected = `# ${selected || 'Heading'}`; break;
			default: return;
		}

		this.setMarkdown(before + selected + after);
		textarea.focus();
	}

	getMarkdown() {
		return this.value;
	}

    async renderRawMarkdown() {
        const html = await convertMarkdown(this.value);
        return html;
    }
    
	setMarkdown(text) {
		this.value = text;
		this.editorEl.value = text;
		setObject(this.settings.storageKey, text);
		if (this.settings.autoRender && this.settings.mode !== 'wysiwyg') this.render();
	}

	async render() {
		if (!this.previewEl) return;

		if (this.settings.streaming) {
			this.previewEl.innerHTML = '';
			for await (let line of streamMarkdown(this.value)) {
				this.previewEl.innerHTML += line + '\n';
			}
		} else {
			const html = await convertMarkdown(this.value);
			this.previewEl.innerHTML = html;
		}

		if (window.Prism) {
			window.Prism.highlightAll();
		}
	}

	updateVisibility() {
		if (this.editorEl) this.editorEl.style.display = (this.settings.mode === 'code' || this.settings.mode === 'split') ? 'block' : 'none';
		if (this.previewEl) this.previewEl.style.display = (this.settings.mode === 'preview' || this.settings.mode === 'split') ? 'block' : 'none';
		if (this.wysiwygEl) this.wysiwygEl.style.display = this.settings.mode === 'wysiwyg' ? 'block' : 'none';
	}

	destroy() {
		this.editorEl.removeEventListener('input', this.render);
		this.editorEl = null;
		this.previewEl = null;
		if (this.toolbarEl) this.toolbarEl.innerHTML = '';
	}

	loadFromStorage() {
		const content = getObject(this.settings.storageKey);
		if (content) this.setMarkdown(content);
	}

	saveToStorage() {
		setObject(this.settings.storageKey, this.getMarkdown());
	}

	// Reserved for future API extensions:
	// async loadFromApi(params = {}) {}
	// async saveToApi(data = {}, params = {}) {}
}
