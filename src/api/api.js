// src/api/api.js

/**
 * Fetch JSON data from a given URL with extended options.
 * 
 * @param {string} url - The endpoint to call.
 * @param {object} [options={}] - Fetch config (method, body, headers, lang, token).
 * @param {string} [options.method='GET'] - HTTP method.
 * @param {object} [options.body] - Body payload, auto-serialized to JSON.
 * @param {object} [options.headers] - Additional headers.
 * @param {string} [options.lang] - Optional language code (e.g., 'en', 'cs').
 * @param {string} [options.token] - Optional Bearer token for authentication.
 * 
 * @returns {Promise<object>} - Parsed JSON response.
 */
export async function fetchJson(url, options = {}) {
    const {
        method = 'GET',
        body,
        headers = {},
        lang,
        token
    } = options;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(lang && { 'Accept-Language': lang }),
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(url, {
        method,
        headers: {
            ...defaultHeaders,
            ...headers
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
    }

    return await response.json();
}
