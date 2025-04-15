// src/storage/cookies.js

/**
 * Get a cookie by name.
 * @param {string} name
 * @returns {string|null}
 */
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Sets a cookie with a specified name, value, and expiration period.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to store in the cookie.
 * @param {number} [expirationDays=36500] - Number of days before expiration (default: 100 years).
 */
export function setCookie(name, value, expirationDays = 36500) {
	const d = new Date();
	d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
	const expires = `expires=${d.toUTCString()}`;
	document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

/**
 * Delete a cookie.
 * @param {string} name
 */
export function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
}
