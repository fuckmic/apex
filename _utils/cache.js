const TOKEN_KEY = 'USER_TOKEN';
const ACCOUNT_KEY = 'USER_ACCOUNT';
const PASSWORD_KEY = 'USER_PASSWORD'; // 用于记住密码功能
const LGRE_KEY = 'APP_LGRE';
const MAIN_FIAT_KEY = 'APP_MAIN_FIAT';
const SECOND_FIAT_KEY = 'APP_SECOND_FIAT';
const STABLE_KEY = `APP_STABLE`;

export const cacheToken = {
	get: () => uni.getStorageSync(TOKEN_KEY) || null,
	set: (token) => uni.setStorageSync(TOKEN_KEY, token),
	remove: () => uni.removeStorageSync(TOKEN_KEY)
};

export const cacheAccount = {
	get: () => uni.getStorageSync(ACCOUNT_KEY) || null,
	set: (account) => uni.setStorageSync(ACCOUNT_KEY, account),
	remove: () => uni.removeStorageSync(ACCOUNT_KEY)
};

export const cachePassword = {
	get: () => uni.getStorageSync(PASSWORD_KEY) || null,
	set: (password) => uni.setStorageSync(PASSWORD_KEY, password),
	remove: () => uni.removeStorageSync(PASSWORD_KEY)
};

export const cacheLgre = {
	get: () => uni.getStorageSync(LGRE_KEY) || null,
	set: (locale) => uni.setStorageSync(LGRE_KEY, locale)
};

export const cacheMainFiat = {
	get: () => uni.getStorageSync(MAIN_FIAT_KEY) || null,
	set: (fiat) => uni.setStorageSync(MAIN_FIAT_KEY, fiat)
};

export const cacheSecondFiat = {
	get: () => uni.getStorageSync(SECOND_FIAT_KEY) || null,
	set: (fiat) => uni.setStorageSync(SECOND_FIAT_KEY, fiat)
};

export const cacheStable = {
	get: () => uni.getStorageSync(STABLE_KEY) || null,
	set: (stable) => uni.setStorageSync(STABLE_KEY, stable)
}