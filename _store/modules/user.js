import {
	getUserInfo
} from '@/_api/test.js';

export default {
	namespaced: true,
	state: {
		userInfo: null,
		isLoading: false
	},
	mutations: {
		setUserInfo(state, data) {
			state.userInfo = data;
		},
		setLoading(state, status) {
			state.isLoading = status;
		}
	},
	actions: {
		// 关键 Action: 负责业务逻辑和 API 调用
		async fetchAndFormatUserInfo({
			commit,
			rootState
		}) {

			commit('setLoading', true);

			try {
				// 1. 获取 Store 中的配置数据 (语言、货币等)
				const currency = rootState.settings.mainCurrency;
				console.log(`[Store Action] 准备用 ${currency} 格式化数据`);

				// 2. 调用 API 获取原始数据
				const response = await getUserInfo({});
				const rawData = response.data;

				// 3. 在 Store Action 中进行复杂的业务处理或格式化
				const formattedData = {
					name: rawData.name,
					// 根据 Store 里的货币配置，处理薪资显示
					salaryDisplay: `${currency} ${rawData.salary.toFixed(2)}`,
					lastUpdate: new Date().toLocaleTimeString()
				};

				// 4. 提交到 State
				commit('setUserInfo', formattedData);

			} catch (error) {
				console.error('获取用户信息失败:', error);
				// 可以提交一个错误状态或弹出提示
				// commit('setError', error); 
			} finally {
				commit('setLoading', false);
			}
		}
	},
};