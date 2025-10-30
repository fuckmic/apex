import store from '@/_store';
import {
	getSignedApiInfo
} from './config';
import {
	redirectToLogin
} from '@/_utils/navs';
import {
	t
} from '@/_utils/i18n.js';

const HTTP_STATUS = {
	SUCCESS: 200,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	SERVER_ERROR: 500,
};

// --- 核心拦截器管理器 ---
const interceptors = {
	request: [], // 请求发出前
	response: [] // 响应返回后
};

// 注册拦截器
export const request = {
	/**
	 * 注册请求拦截器
	 * @param {function} handler - (config) => config | Promise.reject(error)
	 */
	useRequest(handler) {
		interceptors.request.push(handler);
	},
	/**
	 * 注册响应拦截器
	 * @param {function} successHandler - (res) => data | Promise.reject(error)
	 * @param {function} errorHandler - (error) => Promise.reject(error)
	 */
	useResponse(successHandler, errorHandler) {
		interceptors.response.push({
			success: successHandler,
			error: errorHandler
		});
	}
};

// --- 网络检查工具函数 (在核心请求拦截器外部定义，供其他流程复用) ---
const checkNetworkPromise = () => new Promise((resolve, reject) => {
	uni.getNetworkType({
		success(res) {
			if (res.networkType === 'none') {
				uni.showToast({
					title: t('api.networkFail'),
					icon: 'none'
				});
				reject(new Error(t('api.networkFail')));
			} else {
				resolve();
			}
		},
		fail() {
			uni.showToast({
				title: t('api.networkFail'),
				icon: 'none'
			});
			reject(new Error(t('api.networkFail')));
		},
	});
});

/**
 * 暴露网络检查工具，供 upload/download 等非 uni.request 流程使用
 * @returns {Promise<boolean>} 网络正常返回 true，否则返回 false
 */
request.checkNetwork = async () => {
	try {
		await checkNetworkPromise();
		return true;
	} catch (e) {
		// 网络检查失败，返回 false
		return false;
	}
};

// --- 1. 内置请求拦截器 (Network, Loading, Sign) ---
request.useRequest(async (options) => {

	// 1. 网络检查 (利用外部定义的 promise 进行中断处理)
	await checkNetworkPromise();

	// 2. 签名和 Header 注入
	const {
		fullUrl,
		headers
	} = getSignedApiInfo(options.url);

	options.url = fullUrl;
	options.header = {
		"Content-Type": "application/json",
		...headers,
		...options.header
	};

	// 3. 加载遮罩
	if (!options.hide) {
		const title = typeof options.title === 'string' ? options.title : t('api.loading');
		uni.showLoading({
			title: title,
			mask: true
		});
		options.__isLoadingShown = true; // 标记加载状态，供响应拦截器使用
	}

	return options;
});


// --- 2. 内置响应拦截器 (Auth, HTTP Status, Business Code) ---

// 成功处理器
request.useResponse((res) => {
	if (res.__isLoadingShown) uni.hideLoading(); // 隐藏加载
	// 1. HTTP 状态码鉴权
	if (res.statusCode === HTTP_STATUS.UNAUTHORIZED || res.statusCode === HTTP_STATUS.FORBIDDEN) {
		console.error(`[API Error] HTTP Status ${res.statusCode}: Unauthorized/Forbidden.`);
		store.dispatch('auth/logout');
		redirectToLogin();
		return Promise.reject(new Error(t('api.unauthorized')));
	}
	// 2. 非 200 错误
	else if (res.statusCode !== HTTP_STATUS.SUCCESS) {
		uni.showToast({
			title: `${t('api.httpError')}: ${res.statusCode}`,
			icon: 'none',
		});
		return Promise.reject(new Error(`HTTP Error: ${res.statusCode}`));
	}
	// 3. 业务逻辑状态码 (成功 HTTP 200)
	const response = res.data;
	if (response.code === 0) return response.data || response;
	// 业务级鉴权/Token过期
	if (response.code === 999) {
		console.error(`[API Error] Business Code 999: Token Expired.`);
		store.dispatch('auth/logout');
		redirectToLogin();
		return Promise.reject(new Error(response.message || t('api.unauthorized')));
	}

	// 其他业务错误
	uni.showToast({
		title: response.message || t('api.requestFail'),
		icon: 'none',
	});
	return Promise.reject(response);
});


// 失败处理器
request.useResponse(null, (error) => {
	if (error.__isLoadingShown) uni.hideLoading(); // 隐藏加载

	// uni.request 错误 (网络层错误，如超时)
	if (error && error.errMsg) {
		uni.showToast({
			title: error.errMsg || t('api.requestFail'),
			icon: 'none',
		});
	}
	console.error('Request function failed:', error);
	return Promise.reject(error);
});


// --- 核心请求执行器 ---
/**
 * 核心请求执行器，负责链式调用拦截器并执行 uni.request
 */
function instance(url, options = {}) {
	// 初始配置对象，包含 URL 和用户传入的选项
	let config = {
		url,
		...options
	};
	let promise = Promise.resolve(config);

	// 1. 应用请求拦截器链
	interceptors.request.forEach(handler => {
		promise = promise.then(handler);
	});

	// 2. 执行 uni.request (在请求拦截器链之后)
	promise = promise.then(finalConfig => {
		// uni.request 的 Promise 风格返回 [err, res]
		return new Promise((resolve, reject) => {
			uni.request({
				...finalConfig,
				success: (res) => {
					// 成功返回 HTTP 响应，但可能包含业务错误或 401
					res.__isLoadingShown = finalConfig.__isLoadingShown;
					resolve(res);
				},
				fail: (err) => {
					// 失败通常是网络/超时错误
					err.__isLoadingShown = finalConfig.__isLoadingShown;
					reject(err);
				}
			});
		});
	});

	// 3. 应用响应拦截器链
	interceptors.response.forEach(handler => {
		promise = promise.then(handler.success, handler.error);
	});

	return promise;
}


// --- 请求方法快捷函数 (挂载到 request 对象) ---

request.get = (url, data = {}, options = {}) => {
	return instance(url, {
		method: 'GET',
		data,
		...options
	});
};

request.post = (url, data = {}, options = {}) => {
	return instance(url, {
		method: 'POST',
		data,
		...options
	});
};

request.put = (url, data = {}, options = {}) => {
	return instance(url, {
		method: 'PUT',
		data,
		...options
	});
};

request.del = (url, data = {}, options = {}) => {
	return instance(url, {
		method: 'DELETE',
		data,
		...options
	});
};

// --- 文件操作封装 (保持简洁) ---

// 上传文件封装
request.upload = (url, filePath, name = 'file', formData = {}, options = {}) => {

	const {
		fullUrl,
		headers
	} = getSignedApiInfo(url);

	// upload 过程复杂，单独处理逻辑
	return new Promise(async (resolve, reject) => {
		// 使用修正后的 request.checkNetwork()
		if (!await request.checkNetwork()) {
			return reject(new Error(t('api.networkFail')));
		}

		let isLoadingShown = false;
		if (!options.hide) {
			const title = typeof options.title === 'string' ? options.title : t('api.loading');
			uni.showLoading({
				title,
				mask: true
			});
			isLoadingShown = true;
		}

		uni.uploadFile({
			url: fullUrl,
			filePath,
			name,
			formData,
			header: headers,
			success: (res) => {
				if (isLoadingShown) uni.hideLoading();
				if (res.statusCode === HTTP_STATUS.SUCCESS && res.data) {
					try {
						const responseData = JSON.parse(res.data);
						// 模拟 uni.request 响应结构，交给辅助函数处理业务逻辑
						handleUploadResponse({
							statusCode: res.statusCode,
							data: responseData
						}).then(resolve).catch(reject);
					} catch (e) {
						reject(new Error(t('api.requestFail')));
					}
				} else {
					// 非 200 状态，直接拒绝
					reject(new Error(`Upload Failed with Status: ${res.statusCode}`));
				}
			},
			fail: (err) => {
				if (isLoadingShown) uni.hideLoading();
				reject(err);
			}
		});
	});
};

// download 封装
request.download = (url, options = {}) => {
	const {
		fullUrl,
		headers
	} = getSignedApiInfo(url);

	return new Promise((resolve, reject) => {
		uni.downloadFile({
			...options,
			url: fullUrl,
			header: {
				...headers,
				...options.header
			},
			success: (res) => {
				if (res.statusCode === HTTP_STATUS.SUCCESS) {
					resolve(res.tempFilePath);
				} else if (res.statusCode === HTTP_STATUS.UNAUTHORIZED || res.statusCode === HTTP_STATUS
					.FORBIDDEN) {
					store.dispatch('auth/logout');
					redirectToLogin();
					reject({
						code: res.statusCode,
						msg: t('api.unauthorized')
					});
				} else {
					reject({
						code: res.statusCode,
						msg: `下载失败，状态码 ${res.statusCode}`
					});
				}
			},
			fail: (err) => {
				reject({
					code: -1,
					msg: '下载网络连接失败'
				});
			}
		});
	});
};

/**
 * 辅助函数：处理 uploadFile 的响应 (复用业务逻辑)
 * @param {object} res - 类似 uni.request 返回的成功结果
 */
function handleUploadResponse(res) {
	const response = res.data;
	if (response.code === 0) return Promise.resolve(response.data || response);
	if (response.code === 999) {
		store.dispatch('auth/logout');
		redirectToLogin();
		return Promise.reject(new Error(response.message || t('api.unauthorized')));
	}
	uni.showToast({
		title: response.message || t('api.requestFail'),
		icon: 'none',
	});
	return Promise.reject(response);
}