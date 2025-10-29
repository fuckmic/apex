# apex

- 说明：✅  已完成、❎ 未完成、❓ 待确认、🟰 等等做、➕ 新增功能、➖ 非使用功能、✖ 移除功能
			
在开发时，执行风格页面数组生成
在打包前，执行风格化页面到主页面的复制，再执行去掉风格化的页面数组生成。
```bash
$ node scripts/copy_pages.js bnc # btc复制到pages
$ node scripts/gen_pages.js # 生成pages数组

git cherry-pick 
```

## _api
- 最佳实践： 让 Store Action 成为 API 的主要调用者，从而实现 组件 -> Action -> API -> 后端 的清晰调用链

<!-- components/TabBar.vue -->
<template>
  <!-- 假设 'profile' 页面在 pages.json 中被标记为 auth: true -->
  <view v-if="$nav.isAuthPage('profile') && !$store.state.auth.token">
    <!-- 如果需要鉴权但未登录，则显示“去登录”按钮 -->
    <text>去登录</text>
  </view>
  <view v-else>
    <!-- 显示正常导航项 -->
    <text>我的</text>
  </view>
</template>
