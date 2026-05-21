# SVGShip 设计系统

基于 Material Design 3 色彩体系，面向 Cricut/手工社区用户。

## 设计原则

1. **立即可用** — 用户首次访问即可下载模板，零摩擦
2. **具体而非通用** — 每个 UI 元素都有明确用途，不使用装饰性元素
3. **桌面优先** — 工具类产品，用户主要在电脑上使用
4. **无障碍内建** — 键盘导航、屏幕阅读器、对比度从一开始就是内建的

## 色彩系统

### 亮色模式

```css
:root {
  /* 主色 */
  --color-primary: #0047cf;
  --color-primary-container: #165dff;
  --color-on-primary: #ffffff;
  --color-on-primary-container: #eeefff;

  /* 次要色 */
  --color-secondary: #0055c8;
  --color-secondary-container: #276eec;
  --color-on-secondary: #ffffff;

  /* 表面色 */
  --color-surface: #f8f9fb;
  --color-surface-container: #edeef0;
  --color-surface-container-low: #f3f4f6;
  --color-surface-container-high: #e7e8ea;
  --color-surface-container-highest: #e1e2e4;
  --color-on-surface: #191c1e;
  --color-on-surface-variant: #434656;

  /* 轮廓 */
  --color-outline: #737688;
  --color-outline-variant: #c3c5d9;

  /* 错误 */
  --color-error: #ba1a1a;
  --color-error-container: #ffdad6;
  --color-on-error: #ffffff;

  /* 背景 */
  --color-background: #f8f9fb;
  --color-on-background: #191c1e;
}
```

### 暗色模式

```css
.dark {
  --color-primary: #b6c4ff;
  --color-primary-container: #0047cf;
  --color-on-primary: #00164f;
  --color-on-primary-container: #eeefff;

  --color-secondary: #b1c5ff;
  --color-secondary-container: #0055c8;
  --color-on-secondary: #001946;

  --color-surface: #0f172a;
  --color-surface-container: #1e293b;
  --color-surface-container-low: #1a2332;
  --color-surface-container-high: #334155;
  --color-surface-container-highest: #3d4b5f;
  --color-on-surface: #e1e2e4;
  --color-on-surface-variant: #c3c5d9;

  --color-outline: #8d90a1;
  --color-outline-variant: #434656;

  --color-error: #ffb4ab;
  --color-error-container: #93000a;
  --color-on-error: #690005;

  --color-background: #0f172a;
  --color-on-background: #e1e2e4;
}
```

## 字体

```css
:root {
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### 字体大小

| 用途 | 大小 | 行高 | 字重 |
|------|------|------|------|
| 正文 | 16px | 24px | 400 |
| 标签 | 12px | 16px | 500 |
| 标题（大） | 40px | 48px | 700 |
| 标题（中） | 32px | 40px | 600 |
| 标题（小） | 24px | 32px | 600 |

## 间距

```css
:root {
  --space-unit: 8px;
  --space-xs: 4px;    /* 0.5x */
  --space-sm: 8px;    /* 1x */
  --space-md: 16px;   /* 2x */
  --space-lg: 24px;   /* 3x */
  --space-xl: 32px;   /* 4x */
  --space-2xl: 48px;  /* 6x */
  --space-3xl: 64px;  /* 8x */
}
```

## 圆角

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}
```

## 响应式断点

```css
/* 桌面优先 */
@media (max-width: 1024px) { /* 平板 */ }
@media (max-width: 768px)  { /* 大手机 */ }
@media (max-width: 640px)  { /* 手机 */ }
```

### 布局规范

| 元素 | 桌面 | 平板 | 手机 |
|------|------|------|------|
| 容器最大宽度 | 1280px | 100% | 100% |
| 内边距 | 48px | 32px | 16px |
| 模板网格 | 4 列 | 2 列 | 1 列 |
| 工具页面 | 双栏 | 双栏 | 单栏 |

## 组件规范

### 文件输入区（FileDropzone）

- 虚线边框，2px，颜色：--color-outline-variant
- 内边距：48px
- 居中图标 + 文案
- 拖拽时边框变为实线，颜色：--color-primary
- 支持点击选择和拖拽
- 最小触摸目标：44px

### 按钮

**主按钮：**
- 背景：--color-primary
- 文字：--color-on-primary
- 内边距：12px 24px
- 圆角：--radius-md
- 悬停：背景变亮 10%

**次按钮：**
- 背景：透明
- 边框：1px solid --color-outline
- 文字：--color-primary
- 悬停：背景 --color-primary-container 10% 透明度

### 模板卡片

- 背景：--color-surface-container-low
- 圆角：--radius-lg
- 内边距：16px
- SVG 预览图（16:9 或 1:1 比例）
- 标题（16px，600 字重）
- 分类标签（12px，--color-primary）
- 下载按钮（次按钮样式）
- 悬停：阴影 + 微微上移

### 导航栏

- 高度：64px
- 背景：--color-surface
- 底部边框：1px solid --color-outline-variant
- Logo 左对齐
- 导航项右对齐
- 当前页面：--color-primary，底部 2px 指示条

### 处理进度

- 线性进度条（不确定状态用动画）
- 百分比文字（如果可计算）
- 处理中禁用操作按钮

## 无障碍规范

### 键盘导航

- Tab 顺序：从上到下，从左到右
- Enter：激活按钮和链接
- Escape：关闭模态框和下拉菜单
- 焦点样式：2px solid --color-primary，2px 偏移

### ARIA 标签

- 文件输入：`aria-label="上传 SVG 文件"`
- 下载按钮：`aria-label="下载优化后的文件"`
- 语言切换：`aria-label="切换语言"`
- 模板卡片：`role="article"`，标题作为 `aria-label`

### 对比度

- 正文文字：最低 4.5:1 对比度
- 大文字（18px+）：最低 3:1 对比度
- 交互元素：最低 3:1 对比度

### 触摸目标

- 所有可点击元素：最小 44px × 44px
- 按钮内边距确保足够点击区域

## 暗色模式

- 使用 `.dark` 类切换
- 所有颜色使用 CSS 变量，自动适配
- 图片和 SVG 预览不需要特殊处理
- 代码块使用 --color-surface-container

## 图标

- 使用 Material Symbols Outlined
- 大小：24px 默认
- 颜色：--color-on-surface-variant
- 交互状态：悬停变为 --color-primary

## 动画

- 过渡时间：200ms（快速），300ms（标准），500ms（缓慢）
- 缓动函数：ease-in-out
- 避免过度动画，只在有意义的地方使用
- 加载动画：骨架屏或 spinner

## 空状态设计

每个空状态包含：
1. 插图（简洁、相关）
2. 引导文案（说明当前状态）
3. 主操作按钮（引导用户下一步）

示例：
- 模板浏览无结果：插图 + "没有找到匹配的模板" + "查看全部模板"按钮
- 文件输入区：图标 + "拖拽 SVG 文件到这里" + "或点击选择文件"

## 错误状态设计

每个错误包含：
1. 错误图标（红色）
2. 具体错误信息（说明发生了什么）
3. 建议操作（告诉用户怎么解决）

示例：
- 格式不支持："不支持的文件格式。请上传 SVG 或 PNG 文件。"
- 文件过大："文件超过 10MB 限制。请压缩后重试。"
- 处理失败："SVG 优化失败。文件可能已损坏。"
