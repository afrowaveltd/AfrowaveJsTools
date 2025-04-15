// src/utils/dateUtils.js

/**
 * Converts a Date or date string to SQL date (YYYY-MM-DD).
 * @param {Date|string} date
 * @returns {string}
 */
export function toSqlDate(date) {
	const d = new Date(date);
	return d.toISOString().split('T')[0];
}

/**
 * Converts to SQL datetime (YYYY-MM-DD HH:mm:ss).
 * @param {Date|string} date
 * @returns {string}
 */
export function toSqlDateTime(date) {
	const d = new Date(date);
	const iso = d.toISOString();
	return iso.slice(0, 19).replace('T', ' ');
}

/**
 * Converts ISO date to local format using given locale (e.g. 'cs-CZ').
 * @param {string} isoString
 * @param {string} locale
 * @returns {string}
 */
export function fromIsoToLocale(isoString, locale = 'en-US') {
	const date = new Date(isoString);
	return date.toLocaleString(locale);
}

/**
 * Try parsing flexible date input (e.g. dd.mm.yyyy or yyyy/mm/dd).
 * @param {string} input
 * @returns {Date|null}
 */
export function parseFlexibleDate(input) {
	const parts = input.match(/(\d{1,4})\D(\d{1,2})\D(\d{1,4})/);
	if (!parts) return null;

	let [_, a, b, c] = parts.map(p => parseInt(p, 10));
	// Infer format based on values
	if (a > 31) return new Date(a, b - 1, c); // yyyy-mm-dd
	if (c > 31) return new Date(c, b - 1, a); // dd-mm-yyyy
	return null;
}
