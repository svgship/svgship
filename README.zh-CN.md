# SVGShip

一个现代化的一站式 SVG 工具箱，专为设计师和手工爱好者打造。提供优化、转换和处理 SVG 文件的能力，拥有美观直观的操作界面。

[English](./README.md) | 中文

## 功能特性

- **SVG 优化** — 使用 SVGO 压缩 SVG 文件，保持视觉质量不变
- **PNG 转 SVG** — 通过 Potrace 将光栅图像转换为可缩放矢量图形
- **SVG 转 PNG** — 将 SVG 文件导出为高质量 PNG 图片
- **背景移除** — 自动移除 SVG 文件的背景
- **模板库** — 浏览和下载即用的 SVG 模板
- **国际化** — 多语言界面（中文 / 英文）
- **深色模式** — 完整的亮色/暗色主题，支持跟随系统偏好
- **响应式设计** — 桌面优先布局，适配所有屏幕尺寸

## 技术栈

- **框架：** Next.js 16（App Router）
- **语言：** TypeScript
- **样式：** Tailwind CSS 4
- **图标：** Lucide React
- **SVG 处理：** SVGO、Potrace、DOMPurify
- **测试：** Vitest + Testing Library
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

### 运行测试

```bash
pnpm test:run
```

## 项目结构

```
src/
├── app/
│   ├── [locale]/           # 基于 locale 的路由
│   │   ├── page.tsx        # 首页（Hero + 工具 + 模板）
│   │   ├── tools/          # SVG 处理工具
│   │   │   ├── optimize/        # SVG 优化
│   │   │   ├── png-to-svg/      # PNG 转 SVG
│   │   │   ├── svg-to-png/      # SVG 转 PNG
│   │   │   └── background-remove/ # 背景移除
│   │   └── templates/      # 模板库及详情页
│   ├── layout.tsx          # 根布局
│   └── globals.css         # 全局样式和 CSS 变量
├── components/
│   ├── layout/             # Header、Footer、ThemeToggle
│   └── ui/                 # FileDropzone、DownloadButton、ToolPageLayout
├── lib/
│   ├── i18n/               # 国际化上下文与 Hooks
│   ├── svg/                # SVG 处理工具函数
│   └── templates/          # 模板数据与辅助函数
├── types/                  # 共享 TypeScript 类型
└── middleware.ts            # locale 检测与路由
```

## 常用命令

| 命令                 | 说明                 |
| -------------------- | -------------------- |
| `pnpm dev`           | 启动开发服务器       |
| `pnpm build`         | 生产环境构建         |
| `pnpm start`         | 启动生产服务器       |
| `pnpm lint`          | 运行 ESLint          |
| `pnpm format`        | 使用 Prettier 格式化 |
| `pnpm type-check`    | TypeScript 类型检查  |
| `pnpm test`          | 监听模式运行测试     |
| `pnpm test:run`      | 运行一次测试         |
| `pnpm test:coverage` | 运行测试并生成覆盖率 |

## 设计系统

完整的色彩体系、排版规范、组件指南和无障碍标准请参阅 [DESIGN.md](./DESIGN.md)。

## 开源协议

MIT
