# 极简出入库管理系统

这是一个基于 React、Vite 和 TypeScript 的出入库管理系统。

## 本地运行

```bash
npm install
npm run dev
```

本地开发命令会启动 `server.ts`，用于提供前端页面和 Socket.IO 在线聊天。

## 构建静态站点

```bash
npm run build
```

构建产物会输出到 `dist/`，可以部署到 GitHub Pages。

## GitHub Pages 部署

仓库已包含 `.github/workflows/deploy-pages.yml`。推送到 `main` 分支后，在 GitHub 仓库的 Pages 设置中选择 GitHub Actions 作为发布来源，即可自动部署。

## 多人访问说明

GitHub Pages 可以让多人通过同一个网址访问系统，但它只能托管静态前端。当前库存、用户、供应商、客户等业务数据保存在每个浏览器自己的 `localStorage` 中，不会自动同步给其他人。

如果需要多人共享同一份库存数据，需要再部署一个后端服务和数据库，例如 Supabase、Firebase、Render、Railway 或一台自己的服务器。
