import {
	t
} from '@/_utils/i18n.js';
import {
	request
} from '../request';

/**
 * 用户登录接口 (使用 POST)
 * @returns {Promise<object>} 登录成功后的用户数据/Token
 */
export function userLogin(data) {
	return request.post(`api/app/login`, data, {
		title: t('cmn.submitting'), // 自定义加载提示文本
		// hide: true, // 如果不需要加载遮罩，可以设置 hide 为 true
	});
}