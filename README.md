# ✦ Photo Mosaic Generator

Transform any image into a stunning tile-based mosaic — with an interactive hover feature that reveals the original source region behind each tile.

---

## Features

- **Instant mosaic rendering** — upload any image and see it broken into an averaged-color tile grid in real time
- **Hover to reveal** — mouse over any mosaic tile to see a tooltip with the exact crop from the original image, the tile's grid coordinates, and its averaged hex color
- **Side-by-side view** — original and mosaic are displayed together for easy comparison
- **Drag & drop upload** — drop an image directly onto the upload zone or click to browse
- **Responsive layout** — stacks vertically on mobile, side-by-side on larger screens

---

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- HTML5 Canvas API for pixel sampling and mosaic generation

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm v8 or higher

### Installation

```bash
git clone https://github.com/geraldanekwe/photo-mosaic.git
cd photo-mosaic
npm install
```

### Running locally

```bash
npm start
```

Opens the app at [http://localhost:3000](http://localhost:3000). The page hot-reloads on file changes and will surface any lint errors in the console.

### Building for production

```bash
npm run build
```

Outputs an optimized production bundle to the `build/` directory.

---

## How It Works

1. The uploaded image is drawn onto a hidden `<canvas>` element
2. The canvas is divided into a grid of tiles (default: 100×100px each)
3. For each tile, `getImageData()` samples every pixel in that region and averages the RGB values
4. The grid is rendered as a CSS Grid of `<div>` elements, each filled with its averaged hex color
5. On hover, the same canvas crops the exact source region and renders it in a floating tooltip

---

## Project Structure

```
src/
├── App.tsx                        # Root component, layout, and file upload logic
├── components/
│   └── MosaicCanvas.tsx           # Tile grid rendering and hover interaction
└── hooks/
    └── useImageProcessing.ts      # Image loading and state management
```

---
