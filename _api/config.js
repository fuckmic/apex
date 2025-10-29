import store from '@/_store';
import md5 from '@/_lib/md5.min.js';
import {
	APP_CONFIG
} from '@/_config';

const API_CONFIG = {
	defHost: APP_CONFIG.defHost,
	apiSecret: APP_CONFIG.apiSecret,
	apiCode: APP_CONFIG.apiCode,
	wsCryptoUrl: `/ws`,
	wsCryptoSingleUrl: `/ws_single`,
	wsStockPrimaryUrl: `/zonghe`,
	wsStockSecondUrl: `/meigu`,
};

let _apiBaseUrl = null;

function getHostname() {
	let hostname = null;
	// #ifdef H5 || APP-PLUS
	if (typeof window !== 'undefined' && window.location && window.location.hostname) {
		hostname = window.location.hostname;
	}
	// #endif
	return hostname;
}

function ensureApiInitialized() {
	if (_apiBaseUrl) return _apiBaseUrl;
	const hostname = getHostname();
	let baseUrl = `https://api.${API_CONFIG.defHost}`;
	if (hostname) {
		if (hostname.includes('localhost')) {
			// 开发环境
			baseUrl = `https://api.${API_CONFIG.defHost}`;
		} else {
			const parts = hostname.split('.');
			if (parts.length >= 3) {
				parts[0] = `api`;
				baseUrl = `https://${parts.join('.')}`;
			}
		}
	}
	_apiBaseUrl = baseUrl.trim();
	return _apiBaseUrl;
}

export function getBaseUrl() {
	return ensureApiInitialized();
}

/**
 * 通用签名函数：计算 URL、生成 Header
 * @param {string} url - 接口相对路径，如 'user/login'
 * @returns {{fullUrl: string, headers: object}} 包含完整 URL 和签名 Header
 */
export function getSignedApiInfo(url) {
	const baseUrl = getBaseUrl();
	const token = store?.state?.auth?.token || '';
	const curLgre = store?.state?.lgre?.lgre || APP_CONFIG.defLgre;
	const str_url = `/${url}`.toLowerCase();
	const time = parseInt(new Date().getTime() / 1000);
	const mdd = md5(`${API_CONFIG.apiSecret + API_CONFIG.apiCode + str_url + time}`);
	const fullUrl = `${baseUrl}/${url}?sign=${mdd}&t=${time}`;
	const headers = {
		"Authorization": token ? `Bearer ${token}` : '',
		"language": curLgre,
	};

	return {
		fullUrl,
		headers
	};
}

// --- WebSocket URL 公共方法 ---
export function getWsUrl(path) {
	ensureApiInitialized();
	const apiHost = _apiBaseUrl.replace('https://', '');
	const finalPath = path.startsWith('/') ? path : `/${path}`;
	return `wss://${apiHost}${finalPath}`.trim();
}

export function wsCryptoUrl() {
	return getWsUrl(API_CONFIG.wsCryptoUrl);
}
export function wsCryptoSingleUrl() {
	return getWsUrl(API_CONFIG.wsCryptoSingleUrl);
}
export function wsStockPrimaryUrl() {
	return getWsUrl(API_CONFIG.wsStockPrimaryUrl);
}
export function wsStockSecondUrl() {
	return getWsUrl(API_CONFIG.wsStockSecondUrl);
}