# 部署到 Cloudflare Pages

本项目支持部署到 Cloudflare Pages。以下是详细的部署步骤：

## 前置要求

1. **安装 Cloudflare 适配器**：
   ```bash
   npm install -D @sveltejs/adapter-cloudflare
   ```

2. **安装 Wrangler CLI**（用于命令行部署）：
   ```bash
   npm install -g wrangler
   ```

## 方法一：通过 Cloudflare Dashboard 部署（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 Pages 部分

2. **连接 Git 仓库**
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 授权并选择你的 GitHub 仓库

3. **配置构建设置**
   - **Framework preset**: SvelteKit
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
   - **Root directory**: `/` (项目根目录)

4. **环境变量**（如果需要）
   - 在 Settings > Environment variables 中添加必要的环境变量

5. **部署**
   - 点击 "Save and Deploy"
   - Cloudflare 会自动构建和部署你的项目

## 方法二：通过 Wrangler CLI 部署

1. **登录 Cloudflare**：
   ```bash
   wrangler login
   ```

2. **构建项目**：
   ```bash
   npm run build
   ```

3. **部署**：
   ```bash
   wrangler pages deploy build --project-name=kite-news
   ```

4. **或者使用提供的脚本**：
   ```bash
   ./scripts/deploy-cloudflare.sh
   ```

## 方法三：GitHub Actions 自动部署

项目已配置 GitHub Actions，当代码推送到 `main` 分支时会自动部署。

**设置步骤**：

1. **获取 Cloudflare API Token**：
   - 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - 创建一个具有 "Cloudflare Pages:Edit" 权限的 token

2. **获取 Account ID**：
   - 在 Cloudflare Dashboard 右侧边栏找到 Account ID

3. **在 GitHub 仓库中设置 Secrets**：
   - 进入仓库的 Settings > Secrets and variables > Actions
   - 添加以下 secrets：
     - `CLOUDFLARE_API_TOKEN`: 你的 API token
     - `CLOUDFLARE_ACCOUNT_ID`: 你的 Account ID

4. **推送代码**：
   - 推送到 `main` 分支会触发自动部署

## 自定义域名

1. 在 Cloudflare Pages 项目设置中
2. 进入 "Custom domains" 部分
3. 添加你的域名
4. 按照指示配置 DNS 记录

## 环境变量

如果你的项目需要环境变量，在 Cloudflare Pages 项目设置中：

1. 进入 Settings > Environment variables
2. 添加生产环境和预览环境的变量
3. 重新部署项目

## 注意事项

- 确保 `svelte.config.js` 使用了 `@sveltejs/adapter-cloudflare`
- Cloudflare Pages 支持 SvelteKit 的所有功能，包括 SSR
- 构建时间限制：免费计划 1 分钟，付费计划 20 分钟
- 文件大小限制：单个文件最大 25MB

## 故障排除

**构建失败**：
- 检查 Node.js 版本（推荐 18+）
- 确保所有依赖都已正确安装
- 查看构建日志中的错误信息

**部署后页面空白**：
- 检查浏览器控制台的错误信息
- 确保所有静态资源路径正确
- 检查环境变量是否正确设置

**API 路由不工作**：
- 确保使用了正确的 Cloudflare 适配器
- 检查 API 路由的文件结构和导出