# SVGShip

Professional SVG Resource Directory — curated collection of the best SVG resources for designers and developers.

English | [中文](./README.zh-CN.md)

## About

SVGShip is a one-stop navigation site for SVG resources. It collects and categorizes high-quality SVG icon libraries, illustration resources, tools, tutorials, and inspiration — helping designers and developers quickly find what they need.

## Categories

- **Icons** — High-quality SVG icon libraries in linear, filled, colorful, 3D and more styles
- **Illustrations & Backgrounds** — Vector illustrations, background generators, and textures
- **Tools** — SVG editors, animators, optimizers, and converters
- **Tutorials** — SVG basics, animation, paths, filters, and hands-on guides
- **Inspiration** — SVG interactions, animations, generative art, and creative collections

## Features

- **Global License Filter** — Filter all resources by license type (Free Commercial, Attribution, Personal Free, Paid)
- **Category Tags** — Fine-grained content tags within each category
- **Search** — Full-text search across site names, descriptions, and tags
- **i18n** — English and Chinese interface with locale-based routing
- **Dark Mode** — Light/dark theme with system preference detection
- **Responsive** — Optimized for all screen sizes
- **SEO** — Dynamic metadata, Open Graph, sitemap, robots.txt, hreflang

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Data:** Static JSON (`src/data/sites.json` + `src/data/categories.ts`)
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

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Locale-based routing (en/zh)
│   │   ├── layout.tsx      # Per-locale metadata (OG, hreflang, canonical)
│   │   └── page.tsx        # Main page: hero + search + license filter + categories
│   ├── layout.tsx          # Root layout with fonts and theme
│   ├── robots.ts           # SEO robots config
│   └── sitemap.ts          # Dynamic sitemap
├── components/
│   ├── layout/             # Header, Footer, ThemeToggle
│   ├── HeroSearch.tsx      # Hero section with search input
│   ├── LicenseFilterBar.tsx # Global license/pricing filter
│   ├── CategorySection.tsx # Category with content tag filtering
│   └── SiteCard.tsx        # Individual site card with pricing badge
├── data/
│   ├── sites.json          # Site data (16+ curated SVG resources)
│   └── categories.ts       # Category definitions with tags
├── lib/
│   └── i18n/               # Internationalization context & locale files
├── types/                  # Shared TypeScript types
└── middleware.ts            # Locale detection & cookie routing
```

## Scripts

| Command           | Description               |
| ----------------- | ------------------------- |
| `pnpm dev`        | Start development server  |
| `pnpm build`      | Production build          |
| `pnpm start`      | Start production server   |
| `pnpm lint`       | Run ESLint                |
| `pnpm format`     | Format code with Prettier |
| `pnpm type-check` | TypeScript type checking  |

## Adding Resources

To add a new SVG resource, edit `src/data/sites.json`:

```json
{
  "id": "site-id",
  "name": "Site Name",
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

Available categories: `icons`, `illustrations`, `tools`, `tutorials`, `inspiration`

## License

MIT
