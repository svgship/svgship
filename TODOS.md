# SVGShip TODOS

## Phase 1 可选功能

### Web Workers 优化
- **What：** 将 SVG 处理移到 Web Worker，避免阻塞主线程
- **Why：** 大文件（>1MB）处理时 UI 会卡顿
- **Pros：** 用户体验更好，可以显示处理进度
- **Cons：** 增加代码复杂度，需要 Worker 通信
- **Context：** Phase 1 可以先用同步处理，如果用户反馈卡顿再优化
- **Depends on：** T4-T7（SVG 处理工具完成后再优化）

### 批量处理
- **What：** 支持同时处理多个文件
- **Why：** Cricut 用户经常需要批量转换/优化多个 SVG
- **Pros：** 提高效率，吸引更多用户
- **Cons：** 需要队列管理，大文件批量可能慢
- **Context：** 单文件处理优先，批量作为增强功能
- **Depends on：** T4-T7（单文件处理完成后再加批量）

### 模板收藏
- **What：** 用户可以收藏喜欢的模板，保存在 localStorage
- **Why：** 提高用户留存，方便下次访问
- **Pros：** 增加用户粘性，无需后端
- **Cons：** 仅限当前设备，换设备后丢失
- **Context：** localStorage 实现，简单直接
- **Depends on：** T8（模板系统完成后再加收藏）

### SVG 编辑器
- **What：** 基础 SVG 编辑功能（缩放、改色、拆图层）
- **Why：** Cricut 用户需要简单编辑，不想打开 Illustrator
- **Pros：** 增加工具价值，减少用户跳转
- **Cons：** 编辑器复杂度高，可能超出 Phase 1 范围
- **Context：** 可以先做最基础的缩放和改色，复杂编辑延后
- **Depends on：** T4（SVG 优化器完成后再做编辑器）

## Phase 2 功能（参考设计文档）

- 用户上传模板
- 模板评分/收藏
- 教程内容
- 邮件订阅

## Phase 3 功能（参考设计文档）

- SVG 动画工具
- SVG → React/Vue 组件导出
- 图标库
- SVG 性能优化
