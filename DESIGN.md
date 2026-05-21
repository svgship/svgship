# SVGShip 设计系统

现代活力风格，面向 Cricut/手工社区用户。

## 设计原则

1. **立即可用** — 用户首次访问即可下载模板，零摩擦
2. **现代活力** — 蓝紫色系渐变，毛玻璃卡片，大胆排版
3. **桌面优先** — 工具类产品，用户主要在电脑上使用
4. **无障碍内建** — 键盘导航、屏幕阅读器、对比度从一开始就是内建的

## 色彩系统

### 亮色模式

```css
:root {
  /* 主色 - Indigo/Violet 渐变 */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-primary-container: #eef2ff;
  --color-on-primary: #ffffff;
  --color-on-primary-container: #312e81;

  /* 强调色 - Pink CTA */
  --color-accent: #ec4899;
  --color-accent-hover: #db2777;
  --color-accent-container: #fdf2f8;

  /* 次要色 - Violet */
  --color-secondary: #8b5cf6;
  --color-secondary-container: #f5f3ff;
  --color-on-secondary: #ffffff;

  /* 表面色 */
  --color-surface: #ffffff;
  --color-surface-elevated: #ffffff;
  --color-surface-container: #f8f7ff;
  --color-surface-container-low: #fafafe;
  --color-surface-container-high: #f0eeff;
  --color-on-surface: #1e1b4b;
  --color-on-surface-variant: #6b7280;

  /* 轮廓 */
  --color-outline: #9ca3af;
  --color-outline-variant: #e5e7eb;

  /* 错误 */
  --color-error: #ef4444;
  --color-error-container: #fef2f2;

  /* 成功 */
  --color-success: #10b981;
  --color-success-container: #ecfdf5;

  /* 背景 */
  --color-background: #fafafe;
  --color-on-background: #1e1b4b;
}
```

### 暗色模式

```css
.dark {
  --color-primary: #818cf8;
  --color-primary-hover: #a5b4fc;
  --color-primary-container: rgba(99, 102, 241, 0.15);
  --color-on-primary: #1e1b4b;
  --color-on-primary-container: #c7d2fe;

  --color-accent: #f472b6;
  --color-accent-hover: #f9a8d4;
  --color-accent-container: rgba(236, 72, 153, 0.15);

  --color-secondary: #a78bfa;
  --color-secondary-container: rgba(139, 92, 246, 0.15);

  --color-surface: #0f0f23;
  --color-surface-elevated: #1a1a2e;
  --color-surface-container: #16162a;
  --color-surface-container-low: #121226;
  --color-surface-container-high: #1e1e36;
  --color-on-surface: #e8e6f0;
  --color-on-surface-variant: #9ca3af;

  --color-outline: #6b7280;
  --color-outline-variant: #2d2d44;

  --color-error: #f87171;
  --color-error-container: rgba(239, 68, 68, 0.15);

  --color-success: #34d399;
  --color-success-container: rgba(16, 185, 129, 0.15);

  --color-background: #0f0f23;
  --color-on-background: #e8e6f0;
}
```

## 渐变

```css
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
--gradient-primary-subtle: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf2f8 100%);
--gradient-hero: linear-gradient(135deg, #312e81 0%, #4c1d95 40%, #6d28d9 70%, #7c3aed 100%);
--gradient-card: linear-gradient(
  135deg,
  rgba(99, 102, 241, 0.05) 0%,
  rgba(139, 92, 246, 0.05) 100%
);
```

## 毛玻璃效果

```css
--glass-bg: rgba(255, 255, 255, 0.7);
--glass-border: rgba(255, 255, 255, 0.3);
--glass-shadow: 0 8px 32px rgba(99, 102, 241, 0.08);
```

使用方式：添加 `.glass` 类或手动设置 `backdrop-filter: blur(12px)`。

## 字体

```css
--font-heading: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

- **标题**: Space Grotesk，字重 600-700
- **正文**: Inter，字重 400
- **代码**: JetBrains Mono

### 字体大小

| 用途       | 大小 | 行高 | 字重 |
| ---------- | ---- | ---- | ---- |
| 正文       | 16px | 24px | 400  |
| 标签       | 12px | 16px | 500  |
| 标题（大） | 48px | 56px | 700  |
| 标题（中） | 32px | 40px | 700  |
| 标题（小） | 24px | 32px | 600  |

## 阴影

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
--shadow-glow: 0 0 20px rgba(99, 102, 241, 0.15);
```

## 圆角

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
```

卡片统一使用 `rounded-2xl` (16px)，按钮使用 `rounded-xl` (12px)。

## 动画

```css
@keyframes fadeIn { ... }
@keyframes slideUp { ... }
@keyframes shimmer { ... }
@keyframes float { ... }
```

- 页面进入: `animate-slide-up` (0.5s ease-out)
- 骨架屏: `animate-shimmer`
- 装饰元素: `animate-float` (3s 循环)
- 悬停过渡: `transition-all duration-200`

## 组件规范

### Header

- 高度: 64px
- 毛玻璃背景 + sticky 定位
- Logo: 图标 + 渐变文字 "SVGShip"
- 导航链接: hover 时背景变色

### 文件输入区（FileDropzone）

- 圆角: `rounded-2xl` (16px)
- 虚线边框，2px
- 拖拽激活时: 主色边框 + 发光阴影 + 图标放大
- 图标: Lucide React `Upload`

### 下载按钮

- 渐变背景 (`--gradient-primary`)
- hover: 上移 1px + 阴影加深
- 图标: Lucide React `Download`

### 工具页布局（ToolPageLayout）

- 统一的 Header + 图标标题区 + 内容 + Footer 结构
- 图标: 渐变背景圆角方块 + 白色 Lucide 图标
- 结果卡片: 白色背景 + 边框 + 阴影

### 模板卡片

- 圆角: `rounded-2xl`
- 渐变卡片背景
- hover: 上移 4px + 阴影加深 + 图片微放大
- 分类标签: 渐变背景 pill

### Hero 区域

- 渐变背景 (`--gradient-hero`)
- 装饰性浮动圆形（radial-gradient + animate-float）
- 波浪分隔线（SVG path）
- 徽章标签: 毛玻璃 pill
- CTA 按钮: 毛玻璃 + 白色实心两种

## 图标

使用 **Lucide React** 图标库：

- 统一 stroke 风格
- 默认大小: 20px (h-5 w-5)
- 工具页图标: 24px (h-6 w-6)

## 响应式断点

```css
/* 桌面优先 */
@media (max-width: 1024px) {
  /* 平板 */
}
@media (max-width: 768px) {
  /* 大手机 */
}
@media (max-width: 640px) {
  /* 手机 */
}
```

### 布局规范

| 元素         | 桌面     | 平板     | 手机 |
| ------------ | -------- | -------- | ---- |
| 容器最大宽度 | 1280px   | 100%     | 100% |
| 内边距       | 48px     | 32px     | 16px |
| 模板网格     | 4 列     | 2 列     | 1 列 |
| 工具页面     | 单栏居中 | 单栏居中 | 单栏 |

## 无障碍规范

### 对比度

- 正文文字: 最低 4.5:1
- 大文字 (18px+): 最低 3:1
- 交互元素: 最低 3:1

### 触摸目标

- 所有可点击元素: 最小 44px × 44px

### 键盘导航

- Tab 顺序: 从上到下
- Enter: 激活按钮和链接
- 焦点样式: 2px solid --color-primary
