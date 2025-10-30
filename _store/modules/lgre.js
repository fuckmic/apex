// 引入你的应用配置和语言配置
import {
	LGRE_CONFIG
} from '@/_config/lgre.js';
import {
	APP_CONFIG
} from '@/_config/index.js';
import {
	cacheLgre,
	cacheMainFiat,
	cacheSecondFiat
} from '@/_utils/cache.js';

import enUS from '@/_intl/en-US.js';
import deDE from '@/_intl/de-DE.js';

// 定义一个语言数据映射
const languages = {
	'en-US': enUS,
	'de-DE': deDE,
	// ... 
};

// 定义需要特殊处理（如反转配色）的语言列表
const revseLgre = ['zh-CN', 'ko-KR'];

// 根据 APP_CONFIG.ignore 过滤出当前项目可用的语言列表
// 注意：LGRE_CONFIG 应该包含所有语言的配置
const filteredLgreList = APP_CONFIG.ignore
	.map(code => LGRE_CONFIG[code])
	.filter(item => item);

export default {
	namespaced: true,
	// State 风格：初始化为配置文件默认值，等待 Action 从缓存中读取
	state: {
		lgreList: filteredLgreList,
		lgre: APP_CONFIG.defLgre, // 默认语言代码
		msg: languages[APP_CONFIG.defLgre] || null, // 默认语言的翻译消息对象
		currentLgreCfg: LGRE_CONFIG[APP_CONFIG.defLgre] || null, // 默认语言的配置对象
		isRevse: revseLgre.includes(APP_CONFIG.defLgre),
		mainFiat: APP_CONFIG.mainFiat, // 默认主法币
		secondFiat: APP_CONFIG.secondFiat, // 默认次法币
	},
	mutations: {
		// 统一更新所有语言相关的状态和配置
		SET_LGRE(state, locale) {
			state.lgre = locale;
			state.msg = languages[locale] || null;
			state.currentLgreCfg = LGRE_CONFIG[locale] || null;
			state.isRevse = revseLgre.includes(locale);
		},
		SET_MAIN_FIAT(state, fiat) {
			state.mainFiat = fiat;
		},
		SET_SECOND_FIAT(state, fiat) {
			state.secondFiat = fiat;
		},
	},
	actions: {
		initLgre({
			commit,
			state
		}) {
			const cachedLgre = cacheLgre.get();
			const availableCodes = state.lgreList.map(item => item.code);
			let finalLgre = state.lgre;
			if (cachedLgre && availableCodes.includes(cachedLgre)) {
				finalLgre = cachedLgre;
			} else {
				cacheLgre.set(finalLgre);
			}
			commit('SET_LGRE', finalLgre);

			const cachedMainFiat = cacheMainFiat.get();
			if (cachedMainFiat) {
				commit('SET_MAIN_FIAT', cachedMainFiat);
			} else {
				cacheMainFiat.set(state.mainFiat);
			}
			const cachedSecondFiat = cacheSecondFiat.get();
			if (cachedSecondFiat) {
				commit('SET_SECOND_FIAT', cachedSecondFiat);
			} else {
				cacheSecondFiat.set(state.secondFiat);
			}
		},
		changeLgre({
			state,
			commit
		}, locale) {
			const availableCodes = state.lgreList.map(item => item.code);
			if (availableCodes.includes(locale) && languages[locale]) {
				commit('SET_LGRE', locale);
				cacheLgre.set(locale);
			} else {
				console.warn(`[Lgre] Translation not available for locale: ${locale}`);
			}
		},

		changeMainFiat({
			commit
		}, fiat) {
			commit('SET_MAIN_FIAT', fiat);
			cacheMainFiat.set(fiat);
		},

		changeSecondFiat({
			commit
		}, fiat) {
			commit('SET_SECOND_FIAT', fiat);
			cacheSecondFiat.set(fiat);
		},
	}
};