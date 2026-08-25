# Bender Tunnel Training

A static Next.js training curriculum generated from the Markdown lesson plans in this repository. Lessons are organized by level, each skill has a dedicated page, and YouTube references are available in an embedded player.

## Local development

The project uses Node.js 24. If you use `nvm`, select it with `nvm use` before installing dependencies.

```bash
nvm use
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build the static site

```bash
npm run build
```

Next.js writes the deployable static site to `out/`.

## GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` builds and deploys the site whenever `main` is pushed. In the GitHub repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

The production build automatically uses `/tunnel-training` as its base path when it runs in GitHub Actions. Local development remains at `/`.

## Editing course content

- `markdown/site.md` controls site-wide labels, metadata, navigation, contact details, and interface copy.
- `markdown/LearnToFly.md` controls the homepage and About section.
- Every `markdown/level-*.md` file creates a level and its lesson pages.

See `markdown/README.md` for the level frontmatter and heading format. Standard YouTube links placed under a lesson’s `**Links:**` section are automatically turned into in-page videos.
