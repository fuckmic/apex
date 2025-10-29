import {
	request
} from '../request';

/**
 * 用户登录接口 (使用 POST)
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<object>} 登录成功后的用户数据/Token
 */
export function userLogin(data) {
	return request.post(`api/app/login`, data, {
		// options 参数会被传递给 request.js 中的拦截器
		title: '正在登录...', // 自定义加载提示文本
		// hide: true, // 如果不需要加载遮罩，可以设置 hide 为 true
	});
}

/**
 * 获取当前用户信息接口 (使用 GET)
 * @param {boolean} [hideLoading=false] - 是否隐藏加载遮罩
 * @returns {Promise<object>} 用户信息对象
 */
export function getUserInfo(hideLoading = false) {
	// GET 请求通常将数据放在 data 对象中，但这里是获取当前用户，无需 data
	return request.get('user/info', {}, {
		hide: hideLoading // 比如在页面初始化时获取信息，可以隐藏加载框
	});
}

/**
 * 上传用户头像 (使用 request.upload)
 * @param {string} filePath - uni-app 文件路径 (e.g., res.tempFilePaths[0])
 * @returns {Promise<object>} 上传结果
 */
export function uploadAvatar(filePath) {
	// request.upload 专用于 uni.uploadFile
	return request.upload('file/upload/avatar',
		filePath, // 文件的本地路径
		'file', // 后端接收文件的字段名，默认为 'file'
		{
			type: 'avatar'
		}, // 额外的 formData
		{
			title: '正在上传头像...'
		}
	);
}