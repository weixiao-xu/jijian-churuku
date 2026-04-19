# 微库管理系统

这是一个基于 React、Vite、TypeScript、Express 和 Socket.IO 的微库管理系统。

## 本地运行

```bash
npm install
npm run dev
```

本地开发命令会启动 `server.ts`，用于提供前端页面和 Socket.IO 在线聊天。

## 构建

```bash
npm run build
```

构建产物会输出到 `dist/`。

## Render 部署

项目包含 `render.yaml`，可以部署为 Render Web Service，用来运行 `server.ts` 中的 Express 和 Socket.IO 服务。

Render 会自动读取以下配置：

```yaml
buildCommand: npm ci && npm run build
startCommand: npm run start
```

Render 会提供 `PORT` 环境变量，服务会自动监听该端口。

## GitHub Pages 说明

GitHub Pages 可以托管静态页面，但不能运行 `server.ts`，因此不适合作为在线聊天版本的主站。需要在线对话时，请使用 Render 地址。
