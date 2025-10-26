const fs = require('fs');
const path = require('path');

const TPL_DEV = `_tpl/bnc/`; // 开发时
// const TPL_DEV = ``; // 打包前
// 文件路径假设
const MANIFEST_MODULE_PATH = '../_config/manifest.js';
const CONFIG_BASE_MODULE_PATH = '../_config/pages_base.js';

function clearRequireCache(relativePath) {
	// 使用 require.resolve 获取 Node.js 实际解析到的绝对路径
	try {
		const fullPath = require.resolve(relativePath);
		if (require.cache[fullPath]) {
			delete require.cache[fullPath];
			console.log(`[Cache] Cleared cache for: ${relativePath} (${fullPath})`);
		} else {
			// 如果缓存中不存在，输出提示，帮助调试
			console.log(`[Cache] Cache not found for: ${relativePath} (${fullPath})`);
		}
	} catch (error) {
		console.error(`[Cache] Error resolving path ${relativePath}:`, error.message);
	}
}

// 1. 清除关键配置文件的缓存
clearRequireCache(MANIFEST_MODULE_PATH);
clearRequireCache(CONFIG_BASE_MODULE_PATH);

// 2. 重新 require 文件 (使用相同的相对路径) 
const manifestFn = require(MANIFEST_MODULE_PATH);
const finalPagesArray = manifestFn(TPL_DEV);
console.log(finalPagesArray)
const CONFIG_BASE = require(CONFIG_BASE_MODULE_PATH);
console.log(CONFIG_BASE)

// 组合最终的 pages.json 对象
const finalPagesJson = {
	...CONFIG_BASE,
	pages: finalPagesArray // 直接使用裁剪后的数组
};

const pagesJsonPath = path.resolve(__dirname, '../pages.json');
fs.writeFileSync(pagesJsonPath, JSON.stringify(finalPagesJson, null, 2));

console.log(`✅ pages.json 成功生成，包含 ${finalPagesArray.length} 个页面.`);