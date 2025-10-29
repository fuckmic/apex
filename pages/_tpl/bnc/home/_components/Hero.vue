<template>
	<view
		style="display: flex;flex-direction: column;align-items: center;justify-content: center;min-height:100vh;gap:40rpx;color: teal;">
		<view style="font-size: 300rpx;">{{`Hero`}}</view>
		<view @tap="$nav.cmnLink($nav.keys.kyc)">{{`KYC`}}</view>
	</view>
</template>

<script>
	export default {
		name: "Hero",
	}
</script>

<style>
</style>