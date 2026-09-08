# 单片机与嵌入式技术协会官网

基于 React + TypeScript + Vite + Tailwind CSS + React Router 的静态协会官网。内容集中在 `src/data.ts`，适合后续由协会成员直接维护。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- 本项目包含 `public/_redirects`，用于 React Router 子路由的 SPA fallback。

## 内容维护

- `src/data.ts`：协会名称、学校、联系方式、统计数据、项目、竞赛、活动、成员与学习资源。
- `src/index.css`：全局颜色、字体、动效与响应式基础样式。
- `src/main.tsx`：页面与组件结构。报名链接修改 `siteConfig.recruitmentUrl` 即可。

项目中的图片和项目文字目前是明确标注的示例内容，正式上线前请替换为协会真实资料，并确认外链有效。
