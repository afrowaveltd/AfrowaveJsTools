// src/storage/localStorage.js

const DEFAULT_PREFIX = 'afw_';

/**
 * Get item from localStorage and parse as JSON.
 * 
 * @param {string} key - The key to retrieve.
 * @param {string} [prefix=DEFAULT_PREFIX] - Optional prefix.
 * @returns {any|null} - Parsed object or null if not found.
 */
export function getObject(key, prefix = DEFAULT_PREFIX) {
    const raw = localStorage.getItem(prefix + key);
    try {
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Store object in localStorage as JSON.
 * 
 * @param {string} key - The key to set.
 * @param {any} value - Object or primitive to store.
 * @param {string} [prefix=DEFAULT_PREFIX] - Optional prefix.
 */
export function setObject(key, value, prefix = DEFAULT_PREFIX) {
    localStorage.setItem(prefix + key, JSON.stringify(value));
}

/**
 * Remove item from localStorage.
 * 
 * @param {string} key - The key to remove.
 * @param {string} [prefix=DEFAULT_PREFIX] - Optional prefix.
 */
export function removeItem(key, prefix = DEFAULT_PREFIX) {
    localStorage.removeItem(prefix + key);
}

/**
 * Clear all keys with a given prefix (default: afw_).
 * 
 * @param {string} [prefix=DEFAULT_PREFIX] - The prefix to filter keys.
 */
export function clearPrefixed(prefix = DEFAULT_PREFIX) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(k => localStorage.removeItem(k));
}
