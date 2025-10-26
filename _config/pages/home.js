module.exports = (prefix) => {
	const path = `pages/${prefix}home/index`;
	return {
		"path": path,
		"style": {
			"enablePullDownRefresh": false,
			"navigationStyle": "custom"
		},
		"meta": {
			"name": "home",
			"auth": false,
			"mode": "reLaunch"
		}
	};
}