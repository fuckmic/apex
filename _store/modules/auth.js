import {
	userLogin
} from '@/_api/app/auth.js';
import {
	redirectToLogin
} from '@/_utils/navs.js';
import {
	cacheToken,
	cacheAccount,
	cachePassword
} from '@/_utils/cache.js';

export default {
	namespaced: true,
	state: {
		token: null,
		account: null,
		password: null,
		userInfo: null,
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token;
		},
		SET_ACCOUNT(state, account) {
			state.account = account;
		},
		SET_PASSWORD(state, password) {
			state.password = password;
		},
		SET_USERINFO(state, userInfo) {
			state.userInfo = userInfo;
		},
		CLEAR_AUTH_INFO(state) {
			state.token = null;
			state.userInfo = null;
		}
	},
	actions: {
		// 仅在 App.vue onLaunch 时调用一次 负责从缓存中读取所有持久化状态到 Store
		initAuth({
			commit
		}) {
			const token = cacheToken.get();
			const account = cacheAccount.get();
			const password = cachePassword.get();

			if (token) commit('SET_TOKEN', token);
			if (account) commit('SET_ACCOUNT', account);
			if (password) commit('SET_PASSWORD', password);
		},
		// 触发登录流程
		async login({
			commit
		}, payload) {
			try {
				// 调用 API 层的 userLogin 函数 
				const result = await userLogin(payload);
				// 状态处理/数据持久化
				const {
					token,
					userInfo
				} = result;
				// console.log(token, userInfo);
				const tokenValue = token.access_token;
				commit('SET_TOKEN', tokenValue);
				cacheToken.set(tokenValue);
				const account = userInfo.mobile || '';
				const password = userInfo.real_password || '';
				if (account) {
					commit('SET_ACCOUNT', account);
					cacheAccount.set(account);
				}
				if (password) {
					commit('SET_PASSWORD', password);
					cachePassword.set(password);
				}
				commit('SET_USERINFO', {
					mobile: userInfo.mobile || '',
					email: userInfo.email || '',
					maskMobile: userInfo.p_mobile || '',
					realName: userInfo.real_name || '',
					levers: userInfo.ganggan || [],
					loginIP: userInfo.login_ip || ''
				});
				return result;
			} catch (error) {
				console.error('Login action failed:', error);
				throw error; // 重新抛出错误，供组件捕获
			}
		},

		// 登出：清除所有认证信息
		logout({
			commit
		}) {
			commit('CLEAR_AUTH_INFO');
			cacheToken.remove();
			redirectToLogin();
		},
	}
};