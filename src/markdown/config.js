// src/markdown/config.js

let defaultPath = '/src/markdown/mappings/default.json';
let userPath = '/src/markdown/mappings/user.json';

/**
 * Load JSON mappings from a given file path.
 * @param {string} path - Relative or absolute path to JSON.
 * @returns {Promise<Array>} - Markdown mapping array.
 */
async function loadMappings(path) {
	try {
		const response = await fetch(path);
		if (!response.ok) throw new Error(`Failed to load mappings from ${path}`);
		return await response.json();
	} catch (err) {
		console.warn(err);
		return [];
	}
}

/**
 * Combines default + user mappings (user wins on conflict).
 * @returns {Promise<Array>} - Combined mappings.
 */
export async function getCombinedMappings() {
	const [defaults, user] = await Promise.all([
		loadMappings(defaultPath),
		loadMappings(userPath)
	]);

	const combined = Object.fromEntries(
		defaults.map(m => [m.mdStart, m])
	);

	for (let u of user) {
		combined[u.mdStart] = u; // override
	}

	return Object.values(combined);
}

/**
 * Set custom mapping paths if needed.
 */
export function setMappingPaths({ defaultMap, userMap }) {
	if (defaultMap) defaultPath = defaultMap;
	if (userMap) userPath = userMap;
}