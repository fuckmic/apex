<script>
	import {
		autoCheckAuthAndRedirect
	} from '@/_utils/navs.js';
	export default {
		data() {
			return {

			};
		},

		async onLaunch() {
			const sessionId = Date.now() + '_' + Math.random().toString(36).substring(2, 9);
			uni.setStorageSync('CurrentAppSessionId', sessionId);
			console.log('App Launch. New Session ID:', sessionId);
			// 调用 Vuex 的 initLgre action 来初始化语言数据
			// this.$store.dispatch('lgre/initLgre');
			// this.$store.dispatch('theme/initTheme');
			// // 非加密币项目，可以注释该行代码。
			// this.$store.dispatch('crypto/initStable');

			// // 获取系统信息
			// const systemInfo = uni.getSystemInfoSync();
			// this.$store.dispatch('layout/updateVerticalStatus', systemInfo.windowWidth);
			// cacheAppName.set(systemInfo.appName);
		},
		onShow(opt) {
			console.log('App Show');
			uni.hideTabBar();
			// 尝试自动检查并重定向
			autoCheckAuthAndRedirect();
			// // 获取当前页面实例
			// const pages = getCurrentPages();
			// if (pages.length === 0) return;
			// const currentPage = pages[pages.length - 1];
			// // 获取当前页面的路由路径
			// const currentPath = '/' + currentPage.route;
			// // 3. 判断当前页面是否需要鉴权
			// if (this.$nav.isAuthPage(currentPath)) {
			// 	console.log(`当前页面 ${currentPath} 需要鉴权，进行检查。`);
			// 	// 4. 如果需要，执行鉴权检查
			// 	this.$nav.checkAuth();
			// } else {
			// 	console.log(`当前页面 ${currentPath} 不需要鉴权。`);
			// }
		},
		onHide() {
			console.log('App Hide');
			uni.hideTabBar();
		},
		onReady: function() {
			// 监听窗口大小变化事件，以便在PC端浏览器调整窗口时更新布局
			uni.onWindowResize((res) => {
				console.log(res);
				// this.$store.dispatch('layout/updateVerticalStatus', systemInfo.windowWidth);
			});
		},

		methods: {
			// forceReload() {
			// 	// #ifdef APP-PLUS
			// 	const currentWebview = plus.webview.currentWebview();
			// 	currentWebview.reload(true);
			// 	plus.runtime.restart();
			// 	// #endif

			// 	// #ifdef H5
			// 	window.location.reload();
			// 	// #endif
			// }
		}
	}
</script>

<style lang="scss">
	// @import "@/_css/_variables.scss";

	// @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Open+Sans:wght@300..800&family=Roboto:ital,wght@0,100..900;1,100..900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap');

	// @font-face {
	// 	font-family: 'BinancePlex';
	// 	font-display: swap;
	// 	src: url('/static/fonts/BinancePlex-Light.woff2') format('woff2');
	// 	font-weight: 200
	// }

	// @font-face {
	// 	font-family: 'BinancePlex';
	// 	font-display: swap;
	// 	src: url('/static/fonts/BinancePlex-Light.woff2') format('woff2');
	// 	font-weight: 300
	// }

	// @font-face {
	// 	font-family: 'BinancePlex';
	// 	font-display: swap;
	// 	src: url('/static/fonts/BinancePlex-Regular.woff2') format('woff2');
	// 	font-weight: 400
	// }

	// @font-face {
	// 	font-family: 'BinancePlex';
	// 	font-display: swap;
	// 	src: url('/static/fonts/BinancePlex-Medium.woff2') format('woff2');
	// 	font-weight: 500
	// }

	// @font-face {
	// 	font-family: 'BinancePlex';
	// 	font-display: swap;
	// 	src: url('/static/fonts/BinancePlex-SemiBold.woff2') format('woff2');
	// 	font-weight: 600
	// }

	// @font-face {
	// 	font-family: 'BinancePlex';
	// 	font-display: swap;
	// 	src: url('/static/fonts/BinancePlex-Bold.woff2') format('woff2');
	// 	font-weight: 700
	// }

	// @font-face {
	// 	font-family: 'BinancePlex';
	// 	font-display: swap;
	// 	src: url('/static/fonts/BinancePlex-Black.woff2') format('woff2');
	// 	font-weight: 900
	// }

	body {
		font-family: BinancePlex, Barlow, -apple-system, BlinkMacSystemFont, Roboto, Ubuntu, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
		font-size: 28rpx;
		font-weight: 400;
	}

	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	// @media screen and (min-width: 1600px) {
	// 	width: 1400px;
	// }
	::-webkit-scrollbar {
		display: none;
	}

	@media screen and (max-device-width:375px) {
		page {
			width: 100vw;
		}
	}

	@media screen and (min-device-width:375px) and (max-device-width:750px) {
		page {
			width: 100vw;
			margin: 0 auto;
		}
	}
</style>