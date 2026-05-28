# SVGShip

专业 SVG 资源导航 — 为设计师和开发者精选的优质 SVG 资源合集。

[English](./README.md) | 中文

## 关于

SVGShip 是一个一站式 SVG 资源导航站，收录并分类整理高质量的 SVG 图标库、插画素材、工具、教程和灵感作品，帮助设计师和开发者快速找到所需资源。

## 分类

- **图标** — 高质量 SVG 图标库，覆盖线性、面性、彩色、3D 等多种风格
- **插画与背景** — 矢量插画、背景生成器和纹理素材
- **工具** — SVG 编辑器、动画制作、优化压缩和格式转换工具
- **教程与文章** — SVG 基础入门、动画进阶、路径滤镜和实战案例
- **灵感** — SVG 交互作品、动画案例、生成艺术和创意合集

## 功能特性

- **全局授权筛选** — 按授权类型过滤所有资源（免费可商用、需署名、仅个人免费、付费）
- **分类标签** — 每个分类下独立的内容标签筛选
- **搜索** — 支持按站点名称、描述和标签全文搜索
- **国际化** — 中英文界面，基于 locale 的路由
- **深色模式** — 亮色/暗色主题，支持跟随系统偏好
- **响应式** — 适配所有屏幕尺寸
- **SEO** — 动态 metadata、Open Graph、sitemap、robots.txt、hreflang

## 技术栈

- **框架：** Next.js 16（App Router）
- **语言：** TypeScript
- **样式：** Tailwind CSS 4
- **图标：** Lucide React
- **数据：** 静态 JSON（`src/data/sites.json` + `src/data/categories.ts`）
- **代码质量：** ESLint、Prettier、Husky + lint-staged

## 快速开始

### 环境要求

- Node.js 18+
- pnpm（推荐）

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
pnpm build
```

## 项目结构

```
src/
├── app/
│   ├── [locale]/           # 基于 locale 的路由（en/zh）
│   │   ├── layout.tsx      # 每个 locale 的 metadata（OG、hreflang、canonical）
│   │   └── page.tsx        # 主页：Hero + 搜索 + 授权筛选 + 分类展示
│   ├── layout.tsx          # 根布局（字体、主题）
│   ├── robots.ts           # SEO robots 配置
│   └── sitemap.ts          # 动态 sitemap
├── components/
│   ├── layout/             # Header、Footer、ThemeToggle
│   ├── HeroSearch.tsx      # Hero 区域 + 搜索框
│   ├── LicenseFilterBar.tsx # 全局授权/价格筛选栏
│   ├── CategorySection.tsx # 分类区块 + 内容标签筛选
│   └── SiteCard.tsx        # 站点卡片（含定价标签）
├── data/
│   ├── sites.json          # 站点数据（16+ 精选 SVG 资源）
│   └── categories.ts       # 分类定义及标签配置
├── lib/
│   └── i18n/               # 国际化上下文与 locale 文件
├── types/                  # 共享 TypeScript 类型
└── middleware.ts            # locale 检测与 cookie 路由
```

## 常用命令

| 命令              | 说明                 |
| ----------------- | -------------------- |
| `pnpm dev`        | 启动开发服务器       |
| `pnpm build`      | 生产环境构建         |
| `pnpm start`      | 启动生产服务器       |
| `pnpm lint`       | 运行 ESLint          |
| `pnpm format`     | 使用 Prettier 格式化 |
| `pnpm type-check` | TypeScript 类型检查  |

## 添加资源

编辑 `src/data/sites.json` 添加新的 SVG 资源：

```json
{
  "id": "site-id",
  "name": "站点名称",
  "url": "https://example.com",
  "description": {
    "zh": "中文描述",
    "en": "English description"
  },
  "category": "icons",
  "tags": ["线性", "免费可商用"],
  "featured": false
}
```

可用分类：`icons`、`illustrations`、`tools`、`tutorials`、`inspiration`

## 开源协议

MIT
