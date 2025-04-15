// src/api/apiCore.js

/**
 * Represents the result of an API request.
 */
export class Result {
	constructor(success, data = null, error = null) {
		this.success = success;
		this.data = data;
		this.error = error;
	}
}

/**
 * Generic API request handler with support for JSON, FormData, headers, and more.
 * @param {object} options
 * @returns {Promise<Result>}
 */
export async function apiRequest({
	url,
	method = 'GET',
	data = null,
	headers = {},
	responseType = 'json',
	useFormData = false,
	token = null,
	formName = null
} = {}) {
	try {
		if (!useFormData && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json';
		}

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		let options = { method, headers };

		if (useFormData && formName) {
			const formElement = document.forms[formName];
			if (!formElement) {
				return new Result(false, null, { code: 404, message: `Form with name "${formName}" not found.` });
			}
			options.body = new FormData(formElement);
		} else if (useFormData && data instanceof HTMLElement) {
			options.body = new FormData(data);
		} else if (useFormData && data instanceof Object) {
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => formData.append(key, value));
			options.body = formData;
		} else if (data) {
			if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
				options.body = new URLSearchParams(data).toString();
			} else {
				options.body = JSON.stringify(data);
			}
		}

		if (method.toUpperCase() === 'GET' && data) {
			url += `?${new URLSearchParams(data).toString()}`;
		}

		const response = await fetch(url, options);
		if (!response.ok) {
			return new Result(false, null, { code: response.status, message: response.statusText });
		}

		let responseData;
		if (responseType === 'json') {
			responseData = await response.json();
		} else if (responseType === 'text' || responseType === 'html') {
			responseData = await response.text();
		} else {
			return new Result(false, null, { code: 500, message: `Unsupported response type: ${responseType}` });
		}

		return new Result(true, responseData);
	} catch (error) {
		console.error('API Request Error:', error);
		return new Result(false, null, { code: 500, message: error.message });
	}
}