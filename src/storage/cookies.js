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
 * Set a cookie with optional days until expiration.
 * @param {string} name
 * @param {string} value
 * @param {number} [days]
 */
export function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 864e5));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

/**
 * Delete a cookie.
 * @param {string} name
 */
export function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
}
