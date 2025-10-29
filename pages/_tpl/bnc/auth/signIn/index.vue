<template>
	<view class="container">
		<text class="title">用户登录</text>

		<input class="input" v-model="form.username" placeholder="请输入用户名" />

		<input class="input" v-model="form.password" type="password" placeholder="请输入密码" />

		<!-- 登录按钮 -->
		<button class="login-btn" @tap="onLogin" :disabled="isSubmitting || !isFormValid">
			{{ isSubmitting ? '登录中...' : '登录' }}
		</button>

		<!-- 导航到注册页 -->
		<text class="link" @tap="onSignUp">
			还没有账号？去注册
		</text>

		<view>{{$store.state.auth.userInfo}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
				},
				isSubmitting: false,
			};
		},
		computed: {
			isFormValid() {
				return this.form.username.trim().length > 0 && this.form.password.trim().length > 0;
			}
		},
		created() {
			// 在 created 钩子中，组件实例和 $store 已经准备好，可以读取并设置表单默认值
			this.initFormFromStore();
			console.log(`created`, this.form);
		},
		methods: {
			// 初始化表单：用于记住密码功能
			initFormFromStore() {
				const authState = this.$store.state.auth;
				if (authState.account) {
					this.form.username = authState.account;
				}
				if (authState.password) {
					this.form.password = authState.password;
				}
			},
			async onLogin() {
				this.isSubmitting = true;
				// 验证表单
				try {
					// 触发 Store Action (auth 模块的 login Action)
					// Action 会调用 API 并更新 Store 状态
					await this.$store.dispatch('auth/login', this.form);
					// this.$nav.cmnLink(this.$nav.keys.home);
				} catch (error) {
					// 错误处理：
					//  这里只需要记录错误日志或执行额外的业务逻辑 
					console.error('Login process failed at component level:', error);
				} finally {
					this.isSubmitting = false;
				}
			},
			onSignUp() {
				this.$nav.cmnLink(this.$nav.keys.signUp)
			}
		}
	}
</script>

<style>
	/* 使用简单的样式确保页面可用性 */
	.container {
		padding: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.title {
		font-size: 28px;
		font-weight: bold;
		margin-bottom: 40px;
		color: #333;
	}

	.input {
		width: 100%;
		height: 48px;
		background-color: white;
		border: 1px solid #ddd;
		margin-bottom: 20px;
		padding: 0 15px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.login-btn {
		width: 100%;
		margin-top: 10px;
		background-color: #007aff;
		color: white;
		border-radius: 8px;
		font-size: 16px;
		padding: 12px 0;
		transition: background-color 0.3s;
	}

	.login-btn:disabled {
		background-color: #99cfff;
	}

	.link {
		margin-top: 25px;
		color: #007aff;
		font-size: 14px;
		text-decoration: underline;
	}
</style>