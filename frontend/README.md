# URL Shortener React Application

A modern URL shortener built with React, Material-UI, and client-side routing.

## Features

- ✅ Create up to 5 short URLs simultaneously
- ✅ Custom shortcode support (optional)
- ✅ URL validity/expiry management (default: 30 minutes)
- ✅ Client-side routing and redirection
- ✅ Analytics and click tracking
- ✅ Material UI design
- ✅ Logging middleware integration
- ✅ Error handling and validation

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser to:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
src/
├── api/           # API layer for backend communication
├── component/     # Reusable React components
├── hook/          # Custom React hooks
├── page/          # Page components
├── state/         # State management (Context API)
├── style/         # Styling configurations
└── utils/         # Utility functions
```

## Usage

### Creating Short URLs
1. Go to the home page
2. Enter up to 5 URLs
3. Optionally set custom shortcodes and validity periods
4. Click "Create Short URLs"

### Viewing Statistics
1. Navigate to the Statistics page
2. View all created URLs and their analytics
3. Click on any URL to see detailed statistics

### Redirection
- Short URLs automatically redirect to original URLs
- Clicks are tracked for analytics

## Technologies

- React 18
- Material-UI (MUI)
- React Router
- Vite
- JavaScript ES6+

## Notes

- Data is stored in localStorage (client-side)
- Logging middleware integration ready
- Default URL validity: 30 minutes
- Maximum URLs per batch: 5+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
