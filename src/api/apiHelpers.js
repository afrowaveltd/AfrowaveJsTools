// src/api/apiHelpers.js
import { apiRequest, Result } from './apiCore.js';

export const fetchData = (url, token = null) =>
	apiRequest({ url, token });

export const fetchText = (url, token = null) =>
	apiRequest({ url, token, responseType: 'text' });

export const fetchHTML = (url, token = null) =>
	apiRequest({ url, token, responseType: 'html' });

export const fetchDataWithBody = (url, data, method = 'POST', token = null) =>
	apiRequest({ url, method, data, token });

export const fetchDataWithParamsAndHeaders = (url, params, headers, token = null) =>
	apiRequest({ url, data: params, headers, token });

export const fetchTextWithParamsAndHeaders = (url, params, headers, token = null) =>
	apiRequest({ url, data: params, headers, token, responseType: 'text' });

export const fetchHTMLWithParamsAndHeaders = (url, params, headers, token = null) =>
	apiRequest({ url, data: params, headers, token, responseType: 'html' });

export const postDataWithParams = (url, data, token = null) =>
	apiRequest({ url, method: 'POST', data, token });

export const postDataWithParamsAndHeaders = (url, data, headers, token = null) =>
	apiRequest({ url, method: 'POST', data, headers, token });

export const deleteData = (url, token = null) =>
	apiRequest({ url, method: 'DELETE', token });

export const deleteDataWithParamsAndHeaders = (url, params, headers, token = null) =>
	apiRequest({ url, method: 'DELETE', data: params, headers, token });

export const updateData = (url, data, token = null) =>
	apiRequest({ url, method: 'PUT', data, token });

export const updateDataWithParamsAndHeaders = (url, data, headers, token = null) =>
	apiRequest({ url, method: 'PUT', data, headers, token });
