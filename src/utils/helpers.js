// src/utils/helpers.js

/**
 * Creates a debounced version of a function that delays its execution.
 * @param {Function} func - The function to debounce.
 * @param {Function} [onError] - Optional error handler.
 * @param {number} [delay=800] - Delay in ms.
 * @returns {Function}
 */
export function debounce(func, onError, delay = 800) {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(async () => {
			try {
				await func.apply(this, args);
			} catch (error) {
				if (typeof onError === 'function') {
					onError(error);
				} else {
					console.error('Error in debounced function:', error);
				}
			}
		}, delay);
	};
}
