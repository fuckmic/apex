module.exports = (prefix) => {
	// 导入所有页面定义函数
	const binance = require('./pages/binance');

	return [].concat(
		binance(prefix)
	);
};