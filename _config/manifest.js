module.exports = (prefix) => {
	// 导入所有页面定义函数
	const homeFn = require('./pages/home');

	return [].concat(
		homeFn(prefix)
	);
};