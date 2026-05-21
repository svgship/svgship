# SVGShip

A modern, all-in-one SVG toolkit for designers and crafters. Optimize, convert, and transform SVG files with a beautiful, intuitive interface.

English | [中文](./README.zh-CN.md)

## Features

- **SVG Optimization** — Compress SVG files using SVGO while preserving visual quality
- **PNG to SVG** — Convert raster images to scalable vector graphics via Potrace
- **SVG to PNG** — Export SVG files as high-quality PNG images
- **Background Removal** — Remove backgrounds from SVG files automatically
- **Template Gallery** — Browse and download ready-to-use SVG templates
- **i18n Support** — Multi-language interface (English / Chinese)
- **Dark Mode** — Full light/dark theme with system preference detection
- **Responsive Design** — Desktop-first layout, optimized for all screen sizes

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **SVG Processing:** SVGO, Potrace, DOMPurify
- **Testing:** Vitest + Testing Library
- **Code Quality:** ESLint, Prettier, Husky + lint-staged

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
```

### Testing

```bash
pnpm test:run
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Locale-based routing
│   │   ├── page.tsx        # Landing page with hero + tools + templates
│   │   ├── tools/          # SVG processing tools
│   │   │   ├── optimize/
│   │   │   ├── png-to-svg/
│   │   │   ├── svg-to-png/
│   │   │   └── background-remove/
│   │   └── templates/      # Template gallery & detail pages
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── layout/             # Header, Footer, ThemeToggle
│   └── ui/                 # FileDropzone, DownloadButton, ToolPageLayout
├── lib/
│   ├── i18n/               # Internationalization context & hooks
│   ├── svg/                # SVG processing utilities
│   └── templates/          # Template data & helpers
├── types/                  # Shared TypeScript types
└── middleware.ts            # Locale detection & routing
```

## Scripts

| Command              | Description               |
| -------------------- | ------------------------- |
| `pnpm dev`           | Start development server  |
| `pnpm build`         | Production build          |
| `pnpm start`         | Start production server   |
| `pnpm lint`          | Run ESLint                |
| `pnpm format`        | Format code with Prettier |
| `pnpm type-check`    | TypeScript type checking  |
| `pnpm test`          | Run tests in watch mode   |
| `pnpm test:run`      | Run tests once            |
| `pnpm test:coverage` | Run tests with coverage   |

## Design System

See [DESIGN.md](./DESIGN.md) for the full design specification, including color tokens, typography, component guidelines, and accessibility standards.

## License

MIT
