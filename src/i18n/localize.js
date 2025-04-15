// src/i18n/localize.js

/**
 * Attempts to determine user language via cookie or fallback.
 */
function getLanguageFromCookie() {
	const cookies = document.cookie.split(';');
	for (let cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name.toLowerCase() === 'language') {
			return value;
		}
	}
	return 'en';
}

/**
 * Localize a phrase by calling backend API.
 * @param {string} text - The text to localize.
 * @param {string} [language] - Optional language override.
 * @returns {Promise<string>}
 */
export async function localize(text, language = '') {
	const lang = language || getLanguageFromCookie();
	let url = `/api/GetLocalized/${encodeURIComponent(text)}/${lang}`;

	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error('Failed to fetch translation');
		return await response.text();
	} catch (error) {
		console.warn('Localization failed:', error);
		return text;
	}
}
