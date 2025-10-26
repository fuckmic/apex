# apex

- 说明：✅  已完成、❎ 未完成、❓ 待确认、🟰 等等做、➕ 新增功能、➖ 非使用功能、✖ 移除功能
			
在开发时，执行风格页面数组生成
在打包前，执行风格化页面到主页面的复制，再执行去掉风格化的页面数组生成。
```bash
$ node scripts/copy_pages.js bnc # btc复制到pages
$ node scripts/gen_pages.js # 生成pages数组

git cherry-pick 
```
