import {
	userLogin
} from '@/_api/app/auth.js';
import {
	redirectToLogin
} from '@/_utils/navs.js';

export default {
	namespaced: true,
	state: {
		token: uni.getStorageSync('USER_TOKEN') || null,
		account: uni.getStorageSync('USER_ACCOUNT') || null,
		password: uni.getStorageSync('USER_PASSWORD') || null,
		userInfo: null,
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token;
			if (token) {
				uni.setStorageSync('USER_TOKEN', token);
			} else {
				uni.removeStorageSync('USER_TOKEN');
			}
		},
		SET_ACCOUNT(state, account) {
			state.account = account;
			if (account) {
				uni.setStorageSync('USER_ACCOUNT', account);
			} else {
				uni.removeStorageSync('USER_ACCOUNT');
			}
		},
		SET_PASSWORD(state, password) {
			state.password = password;
			if (password) {
				uni.setStorageSync('USER_PASSWORD', password);
			} else {
				uni.removeStorageSync('USER_PASSWORD');
			}
		},
		SET_USERINFO(state, userInfo) {
			state.userInfo = userInfo;
		},
		CLEAR_AUTH_INFO(state) {
			state.token = null;
			uni.removeStorageSync('USER_TOKEN');
		}
	},
	actions: {
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
				commit('SET_TOKEN', token.access_token);
				const mobile = userInfo.mobile || '';
				const account = mobile;
				const password = userInfo.real_password || '';
				const email = userInfo.email || '';
				const maskMobile = userInfo.p_mobile || '';
				const realName = userInfo.real_name || '';
				const levers = userInfo.ganggan || [];
				const loginIP = userInfo.login_ip || '';
				if (account) {
					commit('SET_ACCOUNT', account);
				}
				if (password) {
					commit('SET_PASSWORD', password);
				}
				commit('SET_USERINFO', {
					mobile,
					email,
					maskMobile,
					realName,
					levers,
					loginIP
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
			redirectToLogin();
		},
	}
};