# Editing the Freefall Training site

Everything visitors read is stored in this folder.

## Site-wide text

Edit `site.md` to change the site title, metadata, navigation labels, contact email, footer, interface labels, empty states, or 404-page copy.

## Homepage

Edit `LearnToFly.md`. Its frontmatter controls section headings, the coaching quote, and booking text. The Markdown body becomes the About copy.

## Humanoid pose lab

Edit `humanoid.md` to change the Humanoid page title, instructions, control labels, and joint names. Set `visible: true` to include it in the navigation or `visible: false` to hide the link without deleting the page. The interactive figure supports independent X, Y, and Z rotation for the whole body and every listed joint.

## Levels and lessons

Every folder matching `level-*/` becomes a level. Its `index.md` contains the level frontmatter, level title, and any introductory copy. Copy an existing level folder to add another level, then update the frontmatter in its `index.md`:

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

Each other Markdown file in the folder represents one top-level section and must begin with a single `##` heading. Files are loaded by filename, so use numeric prefixes to control their order:

```text
markdown/
  level-2/
    index.md
    01-static-flying.md
    02-formations.md
```

For a level where the top-level sections are individual lessons, each section file contains its `## Lesson title` and lesson copy. Level 1 uses this format.

For a level with multiple tracks, give each track its own ordered folder. The track's `index.md` begins with `## Section title` and contains the section description. Each other file in that folder contains exactly one `### Skill title` and all of that skill's copy:

```text
markdown/
  level-2/
    index.md
    01-static-flying/
      index.md
      01-neutral-back-fly-position.md
      02-back-forward-and-backward.md
    02-formations/
      index.md
      01-2-way-formations.md
```

Levels 2, 3, 4, and Pro use this nested format. Folder and skill-file names are loaded in numeric order. Every section and skill heading automatically generates the same static pages as before.

Set `singlePage: true` in a level's `index.md` frontmatter when every section file should stay together on the level page instead of generating lesson cards and internal pages.

Set `sectionPages: true` when every section file should generate a section card and internal page while its `###` headings remain within that section page. Level 0 uses this format.

Wrap an illustration in `<figure class="concept-graphic">...</figure>` to move it into a lesson or section page's right-hand media column. YouTube references beneath `**Links:**` appear in that same column, above any figures.

Lesson text supports regular Markdown. Add YouTube references beneath `**Links:**`; they will be converted into the in-page video player automatically.

Levels 2, 3, and 4 use multiple track folders. Level 3 and Level 4 each contain Static Progression, Dynamic, and Formations. Level Pro contains Static Progression and Dynamic. Add, edit, or rename a skill Markdown file within the appropriate track folder to update its track page, lesson page, and the Skills Chart together.

## Skills chart

Edit `skills-chart.md` to change the chart title, description, labels, or source note. The tracks and skill nodes themselves are generated from every `level-*/` folder, so the chart does not maintain a separate copy of the curriculum.

## Prerequisites

Prerequisite content lives in `markdown/prerequisites/`. A visible prerequisite appears as a collapsible card on its level or section. Expanding the card reveals its topics and full Markdown content. These files support headings, tables, links, and numbered workouts.

- `level-1.md` attaches to Level 1.
- `level-2.md` attaches to Level 2.
- `level-2--static-flying.md` attaches to the Static Flying section in Level 2.
- `level-2--formations.md` attaches to the Formations section in Level 2.

Use `level` in frontmatter for a level prerequisite. Add `section` with the section slug for a section prerequisite. Set `visible: true` to display its card, or `visible: false` to hide it without deleting the file. The `topics` list appears inside the expanded card. Empty prerequisite files stay hidden until content is added.
