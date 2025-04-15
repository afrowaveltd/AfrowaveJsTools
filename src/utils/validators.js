// src/utils/validators.js

/**
 * Check if a string is a valid email.
 */
export function isEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Check if string is a valid URL.
 */
export function isURL(value) {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
}

/**
 * Check if string is a valid phone number (international format).
 */
export function isPhoneNumber(value) {
	const cleaned = value.replace(/\s+/g, '');
	return /^\+?\d{7,15}$/.test(cleaned);
}

/**
 * Check if file type is in allowed list.
 */
export function isFileType(file, allowedTypes) {
	return file && allowedTypes.includes(file.type);
}

/**
 * Check if file extension is valid.
 */
export function isFileExtension(filename, allowedExtensions) {
	const ext = filename.split('.').pop().toLowerCase();
	return allowedExtensions.includes(ext);
}

/**
 * Check if value is not empty.
 */
export function isNotEmpty(value) {
	return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate string length.
 */
export function isLengthValid(value, min, max) {
	if (typeof value !== 'string') return false;
	const len = value.length;
	return len >= min && (max ? len <= max : true);
}

/**
 * Escape dangerous HTML characters (XSS prevention).
 */
export function escapeHtml(str) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'/': '&#x2F;'
	};
	return str.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Check if string is a valid ISO date (YYYY-MM-DD).
 */
export function isISODate(value) {
	return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Check if string is a valid general date (yyyy/mm/dd, dd-mm-yyyy, etc).
 */
export function isDate(value) {
	const parsed = Date.parse(value);
	return !isNaN(parsed);
}

/**
 * Check if string contains only "safe" characters.
 */
export function isSafeString(value) {
	// Disallow script-like injections and encoded threats
	const unsafePattern = /<script.*?>|javascript:|data:|on\w+=|&#|&lt;/i;
	return !unsafePattern.test(value);
}

/**
 * Validate if password has at least one special character.
 */
export function hasSpecialCharacter(value) {
	return /[^a-zA-Z0-9]/.test(value);
}

/**
 * Validate if password has repeated characters (e.g., aaa).
 * @param {string} value
 * @param {number} maxRepeat - e.g. 2 = max "aa" allowed
 */
export function hasRepeatedCharacters(value, maxRepeat = 2) {
	const pattern = new RegExp(`(.)\\1{${maxRepeat},}`, 'g');
	return pattern.test(value);
}