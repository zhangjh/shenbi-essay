# 神笔作文网站工具脚本

## 动态生成 Sitemap

`generate-sitemap.js` 脚本用于动态生成网站的 sitemap.xml 文件，包含所有静态页面和题目详情页。

### 使用方法

1. 安装依赖：
   ```bash
   npm install
   ```

2. 运行脚本：
   ```bash
   npm run sitemap
   ```

3. 脚本会自动从 API 获取所有题目，并生成包含静态页面和题目详情页的 sitemap.xml 文件到 `public/sitemap.xml`。

### 自动化部署

可以在构建过程中自动生成 sitemap.xml，只需在 package.json 的构建命令中添加：

```json
"build": "npm run sitemap && vite build"
```

这样每次构建网站时都会自动更新 sitemap.xml 文件。

### 注意事项

- 确保环境变量 `VITE_BIZ_DOMAIN` 已正确设置，否则脚本将使用默认值 `https://tx.zhangjh.cn`
- 生成的 sitemap.xml 中的 URL 基础路径为 `https://shenbi.tech`，如需修改请编辑脚本中的 `SITE_URL` 变量