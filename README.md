# 单片机与嵌入式技术协会网站

以已确认的深蓝与白色视觉稿为基准，完整重构的静态官网。桌面与手机均有专门布局；不需要服务器、数据库、登录或付费 API。

> 当前为**视觉预览 / 示例内容版本**。项目、活动、荣誉和成员信息均有示例标识。不要把示例当作协会真实经历；发布前请核实资料、替换真实图片并取得人物授权。

## 运行与构建

使用 Node.js 22。保留仓库已有 `package-lock.json` 的依赖版本。

```bash
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`npm run build` 同时执行 TypeScript 类型检查与 Vite 生产构建，输出 `dist/`。不需要 Node.js 服务常驻。依赖声明沿用旧项目，未使用的路由和图标依赖仍保留以避免随意重写锁文件；页面自身不依赖远程字体或图库。

## 结构

```text
src/
  content/site.json    协会信息、方向、项目、活动、成员、资源、常见问题
  content/index.ts     内容类型适配
  components/         布局、导航、卡片、SVG 概念图和通用组件
  pages/              各主页面与详情、404 页面
  lib/router.tsx      站内历史导航适配，保留真实链接语义
  styles/             设计变量、基础、组件与页面样式
public/images/        本地 WebP 场景素材
public/_redirects     Cloudflare Pages 的 SPA 回退
public/_headers       基础安全与缓存响应头
public/favicon.svg    网站图标
```

主页面：`/`、`/about`、`/projects`、`/awards`、`/activities`、`/members`、`/resources`、`/join`。项目及活动都有详情页；未知地址显示设计一致的 404 页面。

## 内容与照片维护

大部分内容修改 `src/content/site.json`。未核实内容保留 `example: true`；删除全部示例或换成核实资料后，再调整预览声明。`site.preview` 目前只是内容状态记录，不会自动取消页面上的说明，这是有意保留的发布保护。

项目、活动、成员都有 `image` 字段。真实素材放到 `public/images/`，再填写例如 `/images/my-project.webp`。`image` 为空时展示现有概念图或中性人物占位；图片失效也有回退。只上传有权公开的图片，不把示意图描述成协会实拍。

项目对应 `projects[].art` 的 `home`、`robot`、`vision` 概念插图。活动对应 `board`、`lab`、`community`。修改项目信息后，首页、列表与详情自动同步。首页统计来自内容数量，没有虚构人数和奖项数量。

`site.recruitmentUrl` 为空时，招新按钮明确显示“暂未开放”，不会伪造报名成功。验证报名地址后，填写 HTTPS 表单链接。`site.email` 为空不会生成假邮箱链接。

## 发布前检查

1. 核实协会正式名称、学校归属、指导教师和成员授权。
2. 替换示例项目、活动、荣誉；不要仅删除提示文字而保留虚构数据。
3. 在 `index.html` 与 `public/robots.txt` 移除预览版的禁止索引设置，补充实际域名的 canonical、Open Graph URL 与 sitemap。不预填不存在的域名。
4. 如申请学校子域名，先确认学校对托管位置与内容审核的要求。本项目没有代替学校审批。
5. 在真实校园网和常用运营商环境测试访问。

## Cloudflare Pages

构建命令：`npm run build`。输出目录：`dist`。Node.js：22。保留 `public/_redirects`，使详情地址刷新时回退到 SPA，再由站内路由显示对应内容或 404。

当前重构位于独立分支 `redesign/reference-ui-v1`。预览部署取决于项目是否启用分支预览；本仓库不会自动替你更改 Cloudflare 账户设置。

## 自动测试与截图验收

内容测试不需要浏览器：

```bash
npm test
```

完整生产版浏览器测试：

```bash
npm run build
python -m pip install -r tests/requirements.txt
python -m playwright install chromium
python tests/visual_review.py
```

测试覆盖 11 个路由的桌面 / 手机截图、图片加载、页面错误、横向溢出、搜索、筛选、空状态、主题、菜单、FAQ，以及真实浏览器路由、刷新和持久化。输出在 `artifacts/review/`。GitHub Actions 使用相同脚本，并上传截图与 `dist`。

受限离线环境下的 `INLINE_REVIEW_TEMPLATE` 模式只用于组件排版验收，不能证明真实 Vite 构建、浏览器历史或存储通过。测试报告会明确区分两种模式。详细记录见 `docs/review/acceptance.md`。

## 素材说明

见 `docs/review/assets.md`。概念图不构成硬件实物或实验结果声明。项目不携带字体文件；中文使用本机现代无衬线字体。
