// 用于存储 Vuex Store 实例，以便在任何地方访问当前翻译消息
let _storeInstance = null;

/**
 * 初始化翻译模块，传入 Vuex Store 实例
 * @param {object} storeInstance - Vuex Store 实例
 */
export function initI18n(storeInstance) {
	if (!storeInstance) {
		console.error('[i18n] Initialization failed: Store instance is required.');
		return;
	}
	_storeInstance = storeInstance;
}

/**
 * 翻译函数：根据路径获取当前语言的翻译文本。
 * @param {string} path - 翻译文本的路径，例如 'signIn.btnLogin'
 * @param {object} [params] - 替换参数对象，例如 { key: 'value' }
 * @returns {string} 翻译后的字符串，如果未找到则返回路径本身。
 */
export function t(path, params) {
	if (!_storeInstance) {
		console.warn(`[i18n] Store not initialized. Returning path: ${path}`);
		return path;
	}

	// 从 Vuex Store 的 lgre 模块中获取当前语言的消息对象
	const msg = _storeInstance.state.lgre.msg;

	// 【关键修复点】确保 msg 是一个有效的对象，否则返回路径
	if (!msg || typeof msg !== 'object') {
		// 这里不会报错，直接返回路径。App.vue onLaunch 执行后，msg 会被正确设置
		return path;
	}

	// 使用 reduce 安全地访问嵌套路径 (e.g., msg['signIn']['btnLogin'])
	// 注意：这里的 reduce 已经包含在 msg 对象上进行迭代的逻辑。
	let translatedString = path.split('.').reduce((o, i) => o?.[i], msg);

	if (translatedString === undefined || translatedString === null) {
		console.warn(`[i18n] Translation not found for path: ${path}`);
		return path;
	}

	// 检查是否有参数需要替换
	if (params && typeof params === 'object') {
		// 遍历参数，替换占位符 {key}
		for (const key in params) {
			const placeholder = `{${key}}`;
			if (translatedString.includes(placeholder)) {
				// 使用正则表达式进行全局替换
				translatedString = translatedString.replace(new RegExp(placeholder, 'g'), params[key]);
			}
		}
	}

	return translatedString;
}