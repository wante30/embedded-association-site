# 单片机与嵌入式协会网站

哈尔滨理工大学计算机科学与技术学院单片机与嵌入式协会的静态官网。网站展示已确认适合公开的协会介绍、项目、活动、竞赛记录、成员角色和学习资源；不需要服务器、数据库、登录或付费 API。

## 运行与构建

使用 Node.js 22。保留仓库已有 `package-lock.json` 的依赖版本。

```bash
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`npm run build` 同时执行 TypeScript 类型检查与 Vite 生产构建，随后通过 `postbuild` 为已知路由生成静态入口和 `404.html`，输出 `dist/`。不需要 Node.js 服务常驻。依赖声明沿用旧项目，未使用的路由和图标依赖仍保留以避免随意重写锁文件；页面自身不依赖远程字体或图库。

## 结构

```text
src/
  content/site.json    协会信息、方向、项目、活动、成员、资源、常见问题
  content/index.ts     内容类型适配
  content/routes.json  主页面路径与标题，供应用和静态入口构建共用
  components/         布局、导航、卡片、SVG 概念图和通用组件
  pages/              各主页面与详情、404 页面
  lib/router.tsx      站内历史导航适配，保留真实链接语义
  lib/basePath.mjs    GitHub Pages 项目子路径的路由处理
  lib/assetPath.mjs   GitHub Pages 项目子路径的媒体资源处理
  styles/             设计变量、基础、组件与页面样式
public/images/        本地照片与概念素材（WebP / JPEG）
public/_redirects     Cloudflare Pages 的 SPA 回退
public/_headers       基础安全与缓存响应头
public/favicon.svg    网站图标
```

主页面：`/`、`/about`、`/projects`、`/awards`、`/activities`、`/members`、`/resources`、`/join`。项目及活动都有详情页；未知地址显示设计一致的 404 页面。

## 内容与照片维护

大部分内容修改 `src/content/site.json`。只填写已确认、适合公开的信息；暂时缺失的资料留空或标记为待补充，不用猜测补齐。`site.preview` 保留为内容状态字段，当前公开记录均应与可核对材料一致。

项目、活动、成员都有 `image` 字段。真实素材放到 `public/images/`，再填写例如 `/images/my-project.webp`；运行时会自动追加部署 base path。真实项目和活动缺图或加载失败时显示“资料图待补充”或“照片待补充”，不会静默回退为概念 SVG；成员保留中性人物占位。项目的 `imageCaption` 写明图中内容和所属阶段。只上传有权公开的图片，不把示意图描述成协会实拍。

历史示例分支保留概念插图，但已公开的真实记录不会使用它们。协会主要面向集成电路专业学生，受众说明维护在 `site.audience`。资源页并行展示 FPGA 与单片机/嵌入式路线，分别由 `fpgaLearningPaths`、`learningPaths` 中的 `title` / `topics` 维护。方向卡片的 `resourceCategory` 决定跳转筛选；新增分类时同步资源页分类选项。修改项目信息后，首页、列表与详情自动同步。首页将 projects 的第一项作为重点项目，其余项目展示为相关演进入口；概览读取成立年份、实践地点与指导教师，不展示虚构人数或奖项数量。

荣誉记录保留赛事、级别、奖项、成员和 sourceLabel（“获奖证书”或“成绩截图”）；荣誉文字档案不另列指导教师；证书图片按最新确认保留原有教师信息。`certificate` 维护高清图、缩略图及原始尺寸，全部使用 base-aware 路径。点击缩略图可打开适应屏幕的大图、放大滚动或单独打开图片；大图按需加载。

证书必须先在本地用不透明实色覆盖身份证号和验证二维码，成绩名单只展示相关队伍；再导出无 EXIF/XMP、无图层的公开副本。高清副本采用无损 WebP，缩略图从脱敏结果生成。未脱敏原图、合并 PDF 和 ZIP 不进入仓库或网站。`docs/review/certificates-manifest.json` 记录公开图哈希和遮盖区域，测试检查资源完整性、元数据与实际遮盖像素；新增或更换图片时同步更新并逐张人工复核。

首页在重点项目后、协会介绍页在简介后展示竞赛荣誉摘要，并提供主要按钮直达完整荣誉页。首页使用已有的真实证书缩略图并直达证书墙，摘要读取 `awards` 中前 3 条真实记录，数量按当前公开记录自动计算；不单独维护获奖文案。调整代表成果时可修改记录顺序，不改变奖项名称与级别。

当前加入页明确显示禁用的“纳新群筹备中”按钮，没有报名表单。正式入口确认后，需要同时更新 `site.recruitmentUrl`、加入页和对应测试；仅填写 JSON 不会自动启用按钮。`site.email` 为空不会生成假邮箱链接。

## 发布前检查

1. 核实新增项目、活动、荣誉和成员信息，并确认照片公开授权。
2. 运行 `npm test`、`npm run build` 和 `python tests/visual_review.py`。
3. Pages 发布构建必须使用 `/embedded-association-site/` base，并在该子路径运行浏览器检查；已知路由必须 HTTP 200，未知路由应为 404。
4. 如申请学校子域名，先确认学校对托管位置与内容审核的要求。本项目没有代替学校审批。
5. 在真实校园网和常用运营商环境测试访问。

## GitHub Pages

`.github/workflows/pages.yml` 在 `master` 更新时安装锁定依赖、运行内容回归测试，并以 `/embedded-association-site/` 为 base 构建；构建的 `postbuild` 根据主页面路径和 JSON 中的项目/活动 ID 生成目录入口（如 `dist/projects/huishu-2026/index.html`）及 `dist/404.html`，然后上传并部署 Pages artifact。已知页面直接访问或刷新由目录入口返回 HTTP 200，未知地址保留 HTTP 404 和应用内未找到页面。路由和运行时图片仍使用原有 base-aware helpers。`public/_redirects` 仍可供其他静态托管环境使用。

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

测试从 JSON 自动收集全部主页面和详情，目前为 14 个公开路由加 404 页面。通过普通静态服务测试生产构建，覆盖 HTTP 状态/刷新、图片解码与真实图片存在、路径前缀、页面错误、320–1920px 横向溢出、搜索、筛选、空状态、主题、菜单、FAQ、浏览器历史与持久化。另用 320×568 / 390×844 触控场景验收首页入口、至少 44px 的主要触控区、16px 搜索文字、菜单关闭与焦点恢复，并保存首屏和电路图区截图。脚本自动选择空闲端口并在结束时关闭服务；不会留下 npm/Vite 子进程。

本地还应测试 Pages 构建（PowerShell）：

```powershell
npm run build -- --base /embedded-association-site/
$env:REVIEW_BASE_PATH='/embedded-association-site/'
$env:REVIEW_OUTPUT='artifacts/review/pages'
python tests/visual_review.py
Remove-Item Env:REVIEW_BASE_PATH
Remove-Item Env:REVIEW_OUTPUT
```

可通过 `REVIEW_BASE_URL` 指定已部署站点，此时不会启动本地服务，报告 mode 为 `deployed site`。两次构建与验收必须顺序执行，避免覆盖正在受测的 `dist`。GitHub Actions 分别验收根路径和 Pages 子路径，并将报告/截图保存在 `artifacts/review/root`、`artifacts/review/pages`。

受限离线环境下的 `INLINE_REVIEW_TEMPLATE` 模式只用于组件排版验收，不能证明真实 Vite 构建、浏览器历史或存储通过。测试报告会明确区分两种模式。详细记录见 `docs/review/acceptance.md`。

## 素材说明

见 `docs/review/assets.md`。概念图不构成硬件实物或实验结果声明。项目不携带字体文件；中文使用本机现代无衬线字体。
