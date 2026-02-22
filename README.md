# jh.de — Personal Website

Personal website and blog of Johannes Herold, built with [Astro 5](https://astro.build).

## Tech Stack

- **Framework:** Astro 5 (static site generation)
- **Styling:** Custom CSS with CSS variables (no Tailwind)
- **Content:** Astro Content Collections (MDX)
- **i18n:** German (default) + English
- **Fonts:** Satoshi Variable

## Project Structure

```
├── public/                  # Static assets (images, fonts, favicon)
├── src/
│   ├── components/          # Astro components (Navigation, Footer, ProfileHeader, ...)
│   ├── content/
│   │   └── posts/           # Blog posts (de/ + en/)
│   ├── data/                # JSON data (authors)
│   ├── i18n/                # i18n config + translations (de.json, en.json)
│   ├── layouts/             # BaseLayout, PostLayout
│   └── pages/
│       ├── [lang]/          # All localized pages (index, blog, about, legal)
│       └── index.astro      # Root redirect → /de/
├── docker-compose.dev.yml   # Dev container config
├── docker-compose.prod.yml  # Production container config
├── dockerfile               # Production multi-stage build (Astro → Nginx)
├── dockerfile.dev           # Dev container with hot reload
├── nginx.conf               # Nginx config for production
└── astro.config.mjs         # Astro configuration
```

## Development

Development runs inside Docker on a remote Hetzner dev server, accessed via SSH (Cursor Remote). The dev server is secured behind Cloudflare Tunnel.

```bash
# Start dev container
docker compose -f docker-compose.dev.yml up -d

# View logs
docker logs jhde-jh-de-1 -f

# Rebuild after config changes
docker compose -f docker-compose.dev.yml up -d --build
```

The dev container mounts the project directory, so file changes trigger Astro's hot reload automatically.

## Commands

| Command           | Action                                     |
| :---------------- | :----------------------------------------- |
| `npm install`     | Install dependencies                       |
| `npm run dev`     | Start local dev server at `localhost:3000`  |
| `npm run build`   | Build production site to `./dist/`         |
| `npm run preview` | Preview production build locally           |

## Deployment

Production deployments are managed via [Dokploy](https://dokploy.com) on a separate Hetzner server. The production build uses a multi-stage Dockerfile: Astro builds static files, then Nginx serves them.

## Branch Strategy

```
main     ← production releases
develop  ← integration branch
feat/*   ← feature branches
```
