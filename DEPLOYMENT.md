# GitHub Pages Deployment Guide

This guide explains how to deploy the ASIMOV Network Widget demo to GitHub Pages.

## 🚀 Automatic Deployment (Recommended)

The repository is configured with GitHub Actions for automatic deployment:

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Set Source to "GitHub Actions"

2. **Push to main branch** - the demo will automatically build and deploy

3. **Access your demo** at: `https://asimov-protocol.github.io/asimov-network-widget/`

## 📝 Manual Deployment

If you prefer manual deployment:

```bash
# Build the demo
npm run build:demo

# Deploy to GitHub Pages
npm run deploy
```

## 🔧 Configuration

### Base Path
The demo is configured for the path `/asimov-network-widget/`. If your repository has a different name, update the `base` property in `vite.demo.config.ts`:

```typescript
base: '/your-repo-name/',
```

### Build Scripts

- `npm run build:demo` - Builds the demo for production
- `npm run preview:demo` - Preview the built demo locally
- `npm run deploy` - Deploy to GitHub Pages using gh-pages

## 📁 Generated Files

The build creates static files in `dist-demo/`:
- `index.html` - Main demo page
- `assets/` - CSS and JavaScript bundles
- `asimov.svg` - Logo asset

These files are served directly by GitHub Pages with no server-side processing required.

## 🌐 Live Demo

Once deployed, your demo will be available at:
- **URL**: `https://asimov-protocol.github.io/asimov-network-widget/`
- **Features**: Full interactive network simulation
- **Performance**: Optimized production build with code splitting
