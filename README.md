# Tunnel Training

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

- `LearnToFly.md` supplies the About section.
- `level-1.md` supplies the Level 1 lessons.
- `level-2.md` supplies the Level 2 groups and lessons.

Keep lesson titles as Markdown headings. Standard YouTube links placed under a lesson’s `**Links:**` section are automatically turned into in-page videos.
