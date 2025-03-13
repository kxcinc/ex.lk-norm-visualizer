# Lk-Norm Visualizer

An interactive visualization tool for Lk-norm boundaries in R² and R³ spaces, where ||x||^k_k ≤ 1.

## Features

- 2D visualization of Lk-norm boundaries in R²
- 3D visualization of Lk-norm boundaries in R³
- Adjustable k parameter (0.1 to 10.0)
- Interactive controls for exploring the shapes
- Optional fixed rotation for 3D visualization 
- Export visualizations as PNG and SVG files
- Automated UI testing with Playwright
- Visual regression testing for consistent rendering

## Live Demo

The application is available at:
- [lk-norm-visualizer.pages.dev](https://lk-norm-visualizer.pages.dev) (Cloudflare Pages)
- [lk-norm-visualizer.ex.bykxc.app](https://lk-norm-visualizer.ex.bykxc.app) (Custom Domain)

## Repository

This project is open source and available on GitHub:
- [github.com/kxcinc/ex.lk-norm-visualizer](https://github.com/kxcinc/ex.lk-norm-visualizer)

## Development

This project is built with:
- React 19
- TypeScript (strict mode)
- Three.js (via React Three Fiber)
- Vite
- Playwright for end-to-end testing
- Visual regression testing for UI consistency
- Biome for linting and formatting

### Visual Regression Testing

The project includes visual regression testing to ensure that the visualizations render consistently. These tests:

- Capture screenshots of both 2D and 3D visualizations with different k values
- Compare new renders against baseline snapshots to catch unintended visual changes
- Use fixed rotation in 3D mode for consistent comparison
- Include tolerance thresholds to handle minor rendering differences

### Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Type checking
bun run typecheck

# Lint code with Biome
bun run lint

# Format code with Biome
bun run format

# Check and fix issues with Biome
bun run check

# Run UI tests (Chromium and WebKit browsers)
bun run test

# Run tests with UI
bun run test:ui

# Run tests in headed mode
bun run test:headed

# Run visual regression tests
bun run test:visual

# Run visual tests in headed mode
bun run test:visual -- --headed

# Update visual test snapshots
bun run test:update-snapshots

# Debug visual tests
bun run test:visual -- --debug
```

### Deployment

```bash
# Build and deploy to preview environment (default branch)
bun run deploy

# Build and deploy to production environment (main branch)
bun run deploy-live

# Push to GitHub repository
git push kxc main
```

## Math Background

The Lk-norm of a vector x in n-dimensional space is defined as:

||x||_k = (|x₁|^k + |x₂|^k + ... + |xₙ|^k)^(1/k)

This visualization shows the boundary where ||x||^k_k = 1 for different values of k.

Special cases:
- k=1: Manhattan/Taxicab norm (L1)
- k=2: Euclidean norm (L2)
- k→∞: Maximum/Infinity norm (L∞)