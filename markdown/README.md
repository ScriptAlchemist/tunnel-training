# Editing the Tunnel Training site

Everything visitors read is stored in this folder.

## Site-wide text

Edit `site.md` to change the site title, metadata, navigation labels, contact email, footer, interface labels, empty states, or 404-page copy.

## Homepage

Edit `LearnToFly.md`. Its frontmatter controls section headings, the coaching quote, and booking text. The Markdown body becomes the About copy.

## Levels and lessons

Every file matching `level-*.md` becomes a level page. Copy an existing level file to add another level, then update its frontmatter:

```yaml
---
slug: level-3
order: 3
number: "03"
shortTitle: Sit Flying
description: A short description shown on level cards.
accent: "#6f62c7"
---
```

Use `## Lesson title` headings for a level with one section. For multiple sections, use `## Section title` and put each lesson beneath it as a `### Lesson title` heading. Every section and lesson heading automatically generates its own static page. Text placed between a section heading and its first lesson becomes the section description.

Lesson text supports regular Markdown. Add YouTube references beneath `**Links:**`; they will be converted into the in-page video player automatically.

## Prerequisites

Prerequisite pages live in `markdown/prerequisites/` and support full Markdown, including headings, tables, links, and numbered workouts.

- `level-1.md` attaches to Level 1.
- `level-2.md` attaches to Level 2.
- `level-2--static-flying.md` attaches to the Static Flying section in Level 2.
- `level-2--formations.md` attaches to the Formations section in Level 2.

Use `level` in frontmatter for a level prerequisite. Add `section` with the section slug for a section prerequisite. The `topics` list becomes a quick overview on prerequisite cards and pages.
