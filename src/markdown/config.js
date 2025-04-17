// src/markdown/config.js

let defaultPath = "/src/markdown/mappings/default.json";
let userPath = "/src/markdown/mappings/user.json";

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
 * Loads and merges default and user-defined Markdown mappings.
 * If a mapping with the same `mdStart` exists in both, the user-defined mapping overrides the default.
 *
 * @returns {Promise<Array>} Resolves with an array of merged mapping objects.
 */
export async function getCombinedMappings() {
  const [defaults, user] = await Promise.all([
    loadMappings(defaultPath),
    loadMappings(userPath),
  ]);

  const combined = Object.fromEntries(defaults.map((m) => [m.mdStart, m]));

  for (let u of user) {
    combined[u.mdStart] = u; // override
  }

  return Object.values(combined);
}

/**
 * Allows overriding the default mapping file paths.
 *
 * @param {Object} param0 - Configuration object.
 * @param {string} [param0.defaultMap] - Path to the default mapping file.
 * @param {string} [param0.userMap] - Path to the user-defined mapping file.
 */
export function setMappingPaths({ defaultMap, userMap }) {
  if (defaultMap) defaultPath = defaultMap;
  if (userMap) userPath = userMap;
}
