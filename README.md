# Nuxt 3 Sales Dashboard

This project is a modern, responsive sales dashboard built with [Nuxt 3](https://nuxt.com), using Tailwind CSS for styling, Pinia for state management, Highcharts for chart visualization, and Docker for containerized deployment.

---

## Features

- ⚡️ Nuxt 3 with TypeScript
- 🎨 Tailwind CSS for utility-first styling
- 📊 Highcharts integration for dynamic charting
- 📦 Pinia store for state management
- 🐳 Docker support for production-ready containers
- 🔒 Auth-aware UI sections

---

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install

---

## Development Server

Start the development server on http://localhost:3000:

# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

---

## Production

Build the application for production:

# npm

npm run build

# pnpm

pnpm build

# yarn

yarn build

# bun

bun run build

Locally preview production build:

# npm

npm run preview

# pnpm

pnpm preview

# yarn

yarn preview

# bun

bun run preview

---

## Docker

Build and run the application inside a Docker container:

# 1. Build the Docker image

docker build -t nuxt-dashboard .

# 2. Run the container

docker run -p 3000:3000 nuxt-dashboard
