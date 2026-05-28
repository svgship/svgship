# SVGShip — 专业 SVG 资源导航站设计文档

## 概述

SVGShip 从 SVG 处理工具转型为专业 SVG 资源导航站，聚合外部优质 SVG 资源网站，按分类索引和推荐。定位类似 Hao123，面向泛用户群体（设计师、教育工作者、自媒体、PPT 制作者等）。

## 核心决策

| 决策     | 选择                                  |
| -------- | ------------------------------------- |
| 产品形态 | 单页导航站（分类锚点）                |
| 目标用户 | 泛用户                                |
| 资源范围 | 图标库、插画、矢量素材、SVG 动画/特效 |
| 内容管理 | 静态 JSON 数据，代码内维护            |
| 用户互动 | 无（纯展示）                          |
| 多语言   | 保留中英文切换                        |
| 现有工具 | 全部移除                              |

## 页面结构

单页长页面，从上到下：

```
┌─────────────────────────────────┐
│  Header（毛玻璃 sticky）         │
│  Logo | 分类锚点 | 语言切换 | 主题切换 │
├─────────────────────────────────┤
│  Hero 区域                       │
│  大标题 + 副标题 + 搜索框          │
├─────────────────────────────────┤
│  分类一：图标库                    │
│  [卡片] [卡片] [卡片] [卡片]      │
├─────────────────────────────────┤
│  分类二：插画                     │
│  [卡片] [卡片] [卡片] [卡片]      │
├─────────────────────────────────┤
│  分类三：矢量素材                  │
│  [卡片] [卡片] [卡片] [卡片]      │
├─────────────────────────────────┤
│  分类四：SVG 动画/特效             │
│  [卡片] [卡片] [卡片] [卡片]      │
├─────────────────────────────────┤
│  Footer                          │
│  版权 | 关于 | 联系               │
└─────────────────────────────────┘
```

### Header

- 毛玻璃 sticky 定位，高度 64px
- 左侧：SVGShip Logo（保留现有）
- 中间：分类锚点链接（图标库 | 插画 | 矢量素材 | SVG 动画），点击平滑滚动到对应区块
- 右侧：i18n 切换 + 暗色模式切换

### Hero 区域

- 简洁风格，去掉波浪装饰和浮动圆形
- 大标题：SVG 资源导航（英文：SVG Resource Directory）
- 副标题：一句话说明站点价值
- 搜索框：前端过滤，匹配网站名称和描述

### 分类区块

每个分类区块包含：

- 分类标题 + 图标 + 简短描述
- 网站卡片网格（`featured: true` 的卡片排在最前）
- 分类顺序：图标库 → 插画 → 矢量素材 → SVG 动画/特效

### Footer

- 版权信息
- 关于页面链接（可选）
- 联系邮箱

## 网站卡片设计

每张卡片包含：

| 元素 | 说明                                                                                  |
| ---- | ------------------------------------------------------------------------------------- |
| Logo | 网站图标，`logo` 字段为文件名，组件解析为 `/logos/{filename}`；未设置时显示首字母占位 |
| 名称 | 网站名称                                                                              |
| 描述 | 一句话中文简介（英文切换时显示英文描述）                                              |
| 标签 | 可选，如 "免费"、"开源"、"付费"                                                       |
| 链接 | 点击卡片或"访问"按钮跳转外部网站                                                      |

卡片样式沿用现有设计系统：

- `rounded-2xl` 圆角
- 渐变卡片背景
- hover：上浮 4px + 阴影加深
- 标签用渐变 pill 样式

## 数据结构

### sites.json

```ts
interface SvgSite {
  id: string; // 唯一标识
  name: string; // 网站名
  url: string; // 外部链接
  description: {
    zh: string; // 中文简介
    en: string; // 英文简介
  };
  logo?: string; // logo 文件名（public/logos/ 下）
  category: CategorySlug; // 分类
  tags?: string[]; // 标签，如 ["免费", "开源"]
  featured?: boolean; // 是否推荐（置顶显示）
}

type CategorySlug = 'icons' | 'illustrations' | 'vectors' | 'animations';
```

### categories.ts

```ts
interface Category {
  slug: CategorySlug;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  icon: string; // Lucide icon name
}
```

### 文件位置

- 网站数据：`src/data/sites.json`
- 分类定义：`src/data/categories.ts`
- Logo 图片：`public/logos/`

## 搜索功能

纯前端实现：

- 搜索框输入关键词
- 匹配 `sites.json` 中的 `name`、`description`（当前语言）、`tags`
- 实时过滤显示匹配结果
- 搜索时：隐藏分类区块，显示扁平的搜索结果网格
- 清空搜索框：恢复分类视图
- 无结果时显示空状态提示

## 技术栈

保留：

- Next.js 16（App Router）
- TypeScript
- Tailwind CSS 4
- Lucide React
- i18n 系统（`src/lib/i18n/`）
- 暗色模式
- 响应式设计

移除：

- `potrace`、`svgo`、`dompurify` 依赖
- `src/app/[locale]/tools/` 整个目录
- `src/lib/svg/` 工具库
- `src/app/[locale]/templates/` 模板库
- `src/lib/templates/` 模板数据
- `src/components/ui/FileDropzone`、`DownloadButton` 等工具组件

## 路由结构

```
src/app/
├── layout.tsx                  # 根布局
├── globals.css                 # 全局样式
└── [locale]/
    ├── layout.tsx              # locale 布局（i18n provider）
    └── page.tsx                # 导航首页（单页）
```

## 响应式布局

| 元素         | 桌面     | 平板     | 手机      |
| ------------ | -------- | -------- | --------- |
| 卡片网格     | 4 列     | 2 列     | 1 列      |
| Header 锚点  | 水平显示 | 水平显示 | 折叠/隐藏 |
| Hero 搜索框  | 居中宽   | 居中宽   | 全宽      |
| 容器最大宽度 | 1280px   | 100%     | 100%      |

## MVP 范围

### 包含

- [x] 单页导航布局
- [x] 四个分类区块（图标库、插画、矢量素材、SVG 动画）
- [x] 网站卡片展示
- [x] 前端搜索过滤
- [x] 中英文切换
- [x] 暗色模式
- [x] 响应式适配
- [x] 初始收录 15-20 个网站

### 不包含（后续迭代）

- 用户系统（收藏、评论）
- 后台管理
- 广告系统
- 网站详情页
- 用户提交网站

## 设计系统

沿用现有 DESIGN.md 中的设计规范，主要复用：

- 色彩系统（Indigo/Violet 渐变）
- 毛玻璃效果
- 字体（Space Grotesk + Inter）
- 卡片样式（圆角、渐变、hover 动效）
- 暗色模式配色

简化：

- Hero 区域去掉波浪分隔线和浮动装饰
- 移除工具页相关组件样式
