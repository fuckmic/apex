import pages from '@/pages.json';
const RELAUNCH = `reLaunch`;

// 私有变量，用于存储 Vuex store 实例
let _store = null;

export const keys = Object.create(null);
const paths = Object.create(null);

// 遍历 pages.json 配置
pages.pages.forEach(v => {
	const {
		name,
		auth,
		mode = ''
	} = v.meta;
	paths[name] = {
		name,
		path: `/${v.path}`,
		auth,
		mode
	};
	keys[name] = name;
})

console.log(keys, paths);

/**
 * 注入 Vuex store 实例
 * 必须在 main.js 中调用此函数进行初始化
 */
export const setStore = (storeInstance) => {
	if (storeInstance) {
		_store = storeInstance;
		console.log('[NavService] Store 依赖注入成功。');
	} else {
		console.error('[NavService] 依赖注入失败：Store 实例为空。');
	}
};

// 将params对象拼接为查询字符串
const fmtQueryParams = (params) => {
	const queryString = Object.keys(params)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
		.join('&');
	return `?${queryString}`;
};

/**
 * 获取 Token
 * @returns {string} Token 字符串
 */
function getAuthToken() {
	// 直接从注入的 _store 实例中获取
	return _store?.state?.auth?.token || '';
}

/**
 * 重定向到登录页（使用 uni.reLaunch）
 * @returns {boolean} 是否成功执行跳转
 */
export function redirectToLogin() {
	const loginPath = paths.signIn?.path;
	if (loginPath) {
		uni.reLaunch({
			url: loginPath
		});
		return true;
	} else {
		console.error("[NavService Error] 登录页配置缺失 ('signIn')，无法跳转。");
		return false;
	}
}

/**
 * 检查是否已登录。如果未登录，则执行跳转到登录页的操作。
 * @returns {boolean} 是否已登录
 */
export function checkAuth() {
	// 不再需要 store 参数
	if (!getAuthToken()) {
		redirectToLogin();
		return false;
	}
	return true;
}

/**
 * 核心跳转函数
 * @param {string} key - 页面名称 key (来自 pages.json meta.name)
 * @param {object} params - 跳转参数
 */
export function cmnLink(key, params = {}) {
	// 不再需要 store 参数

	const obj = paths[key] || null;
	if (!obj) {
		console.error(`[NavService Error] Path not found for key: ${key}.`);
		if (paths.home?.path) {
			uni.reLaunch({
				url: paths.home.path
			});
		}
		return;
	}

	const {
		path,
		auth,
		mode
	} = obj;

	const temp = Object.keys(params).length > 0 ? fmtQueryParams(params) : ``;
	const targetUrl = path + temp;

	// 1. 鉴权检查 (如果需要，但未登录，则中断并跳转登录)
	if (auth && !getAuthToken()) { // 直接调用 getAuthToken()
		console.warn(`[NavService] Auth required for ${key}. Token missing. Redirecting to login.`);
		redirectToLogin();
		return;
	}

	// 2. 执行跳转
	if (mode.trim() === RELAUNCH) {
		uni.reLaunch({
			url: targetUrl
		});
	} else {
		uni.navigateTo({
			url: targetUrl
		});
	}
}

/**
 * 页面回退
 */
export function navBack() {
	const pages = getCurrentPages();

	/*#ifdef APP-PLUS || H5*/
	// 兼容H5 history.back()，App-Plus使用 navigateBack
	if (pages.length > 1) {
		uni.navigateBack({
			delta: 1,
			fail: () => {
				const homePath = paths.home?.path;
				if (homePath) {
					uni.reLaunch({
						url: homePath
					});
				}
			}
		});
	} else {
		// 如果是第一页，则直接重定向到首页
		const homePath = paths.home?.path;
		if (homePath) {
			uni.reLaunch({
				url: homePath
			});
		}
	}
	/*#endif*/
	/*#ifndef APP-PLUS || H5*/
	// 其他平台（如小程序）
	if (pages.length > 1) {
		uni.navigateBack({
			delta: 1
		});
	} else {
		const homePath = paths.home?.path;
		if (homePath) {
			uni.reLaunch({
				url: homePath
			});
		}
	}
	/*#endif*/
}

export async function support() {
	initSupport();
}

export function forgotPassword() {
	initForgotPassword();
}

export function openLink(val) {
	/*#ifdef H5*/
	window.open(val);
	/*#endif*/
	/*#ifndef H5*/
	// uni.navigateTo 携带 webview 页面进行跳转
	if (paths.webview?.path) {
		uni.navigateTo({
			url: paths.webview.path + fmtQueryParams({
				url: val
			})
		});
	} else {
		console.error("[NavService] Webview page configuration missing.");
	}
	/*#endif*/
}

/**
 * 判断给定路径是否为需要鉴权的页面
 * @param {string} key - 页面名称 key
 * @returns {boolean}
 */
export function isAuthPage(key) {
	const page = paths[key];
	return page && page.auth === true;
}

/**
 * 获取当前页面路径对应的 key (来自 pages.json meta.name)
 * 增加 H5 刷新容错处理。
 * @returns {string | null}
 */
export function getCurrentPageKey() {
	const pagesStack = getCurrentPages();
	let currentPath = null;

	if (pagesStack.length > 0) {
		// 正常逻辑：从页面栈获取 (小程序、App、H5正常跳转)
		const currentPage = pagesStack[pagesStack.length - 1];
		currentPath = '/' + currentPage.route; // e.g., /pages/home/index
	} else {
		/*#ifdef H5*/
		// H5 刷新容错逻辑：页面栈为空时，从浏览器 URL 获取路径
		let urlPath = window.location.pathname;

		// 检查是否是 Hash 模式 (默认模式)，如果是，则从 #/ 后面获取路径
		if (window.location.hash.startsWith('#/')) {
			urlPath = window.location.hash.substring(1);
		}

		// 移除查询参数部分，得到干净的路径
		const questionMarkIndex = urlPath.indexOf('?');
		if (questionMarkIndex !== -1) {
			urlPath = urlPath.substring(0, questionMarkIndex);
		}

		// 确保路径格式正确（以 / 开头，用于匹配 pages.json 中的 path）
		currentPath = urlPath;
		/*#endif*/
	}

	if (currentPath) {
		// 查找匹配的 key
		const pageKey = Object.keys(paths).find(key => paths[key].path === currentPath);
		return pageKey || null;
	}

	return null;
}

/**
 * 自动检查当前页面的权限，如果需要鉴权但Token缺失，则重定向到登录页。
 * 这个函数设计用于在 App.vue 的 onShow 钩子中调用。
 * @returns {void}
 */
export function autoCheckAuthAndRedirect() {
	if (!_store) {
		console.error('[NavService] Store 尚未注入，无法进行权限检查。');
		return;
	}

	const currentPageKey = getCurrentPageKey();

	if (!currentPageKey) {
		// 无法获取当前页面信息，跳过检查
		return;
	}

	// 1. 检查当前页面是否需要鉴权
	const requiresAuth = isAuthPage(currentPageKey);

	if (requiresAuth) {
		// 2. 如果需要鉴权，检查 Token 是否存在
		const token = getAuthToken();

		if (!token) {
			// 3. Token 缺失，执行重定向到登录页
			console.warn(
				`[NavService] Current page (${currentPageKey}) requires authentication. Token missing. Redirecting...`);
			redirectToLogin();
		}
	}
}