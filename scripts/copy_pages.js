const fs = require('fs-extra');
const path = require('path');

// 接收命令行参数作为要复制的风格代码 (例如: bnc)
const styleCode = process.argv[2];

// --- 路径定义 ---
const ROOT_DIR = path.resolve(__dirname, '..'); // 项目根目录
const SOURCE_BASE_DIR = path.join(ROOT_DIR, 'pages', '_tpl'); // 模板库基路径
const TARGET_DIR = path.join(ROOT_DIR, 'pages'); // 目标 pages/ 目录
const SOURCE_DIR = path.join(SOURCE_BASE_DIR, styleCode); // 实际源路径，例如 pages/_tpl/bnc

async function copyStyleTemplate() {
	console.log(`\n======================================================`);
	console.log(`[START] 🚀 开始风格模板物理复制 (${styleCode})`);

	if (!styleCode) {
		console.error(`[ERROR] ❌ 缺少风格代码参数。`);
		console.error(`[USAGE] 请使用: node scripts/copy_pages.js [风格代码] (例如: bnc)`);
		return;
	}

	if (!fs.existsSync(SOURCE_DIR)) {
		console.error(`[ERROR] ❌ 源模板目录不存在: ${SOURCE_DIR}`);
		return;
	}

	try {
		// 1. 清理目标目录（pages/）
		// 注意：我们只清理 SOURCE_DIR 中存在的子文件夹，以避免误删 pages/ 下的公共文件（如 static）
		// 更安全的做法是先清空 pages/ 下所有非公共文件和文件夹
		console.log(`[STEP 1/2] 清理目标 pages/ 目录中的旧页面文件...`);

		// 简单粗暴且高效的清理：删除所有源模板下的文件夹和文件在目标目录的对应物
		// 为了安全和彻底，我们直接清空 TARGET_DIR，但保留_tpl文件夹本身
		const targetContents = await fs.readdir(TARGET_DIR);
		for (const item of targetContents) {
			// 排除 _tpl 文件夹本身，以及可能存在的公共资源或配置文件
			if (item !== '_tpl' && item !== 'README.md' && item !== '.DS_Store') {
				await fs.remove(path.join(TARGET_DIR, item));
				console.log(`    - 已清理旧文件/目录: ${item}`);
			}
		}

		// 2. 递归复制文件
		console.log(`[STEP 2/2] 正在将 ${SOURCE_DIR} 复制到 ${TARGET_DIR} ...`);
		// fs-extra 的 copy 方法会自动递归复制所有内容
		await fs.copy(SOURCE_DIR, TARGET_DIR, {
			overwrite: true
		});

		console.log(`\n✅ 复制完成！`);
		console.log(`   - 源路径: ${SOURCE_DIR}`);
		console.log(`   - 目标路径: ${TARGET_DIR}`);
		console.log(`   - 模板 ${styleCode} 已成功应用。`);

	} catch (error) {
		console.error(`[FATAL ERROR] 复制过程中发生错误:`, error);
	} finally {
		console.log(`======================================================`);
	}
}

copyStyleTemplate();