module.exports = (prefix) => {
	return [{
		"path": `pages/${prefix}home/index`,
		"style": {
			"enablePullDownRefresh": false,
			"navigationStyle": "custom"
		},
		"meta": {
			"name": "home",
			"auth": false,
			"mode": "reLaunch"
		}
	}, {
		"path": `pages/${prefix}auth/signIn/index`,
		"style": {
			"enablePullDownRefresh": false,
			"navigationStyle": "custom"
		},
		"meta": {
			"name": "signIn",
			"auth": false,
			"mode": "reLaunch"
		}
	}, {
		"path": `pages/${prefix}auth/signUp/index`,
		"style": {
			"enablePullDownRefresh": false,
			"navigationStyle": "custom"
		},
		"meta": {
			"name": "signUp",
			"auth": false,
			"mode": "reLaunch"
		}
	}, {
		"path": `pages/${prefix}auth/kyc/index`,
		"style": {
			"enablePullDownRefresh": false,
			"navigationStyle": "custom"
		},
		"meta": {
			"name": "kyc",
			"auth": true,
			"mode": "navigateTo"
		}
	}]

}