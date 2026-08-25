import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { remark } from 'remark'

export type Video = {
  id: string
  title: string
  url: string
}

export type Lesson = {
  slug: string
  title: string
  levelSlug: string
  levelTitle: string
  groupTitle: string
  summary: string
  prerequisite?: string
  html: string
  videos: Video[]
  number: number
}

export type LessonGroup = {
  title: string
  lessons: Lesson[]
}

export type CourseLevel = {
  slug: string
  title: string
  shortTitle: string
  description: string
  color: 'coral' | 'sky'
  number: string
  groups: LessonGroup[]
  lessons: Lesson[]
}

type LevelDefinition = Pick<
  CourseLevel,
  'slug' | 'shortTitle' | 'description' | 'color' | 'number'
> & {
  file: string
}

const levelDefinitions: LevelDefinition[] = [
  {
    slug: 'level-1',
    file: 'level-1.md',
    shortTitle: 'Belly Flying',
    description: 'Build a stable foundation, then add precise movement, altitude control, and safe entries and exits.',
    color: 'coral',
    number: '01',
  },
  {
    slug: 'level-2',
    file: 'level-2.md',
    shortTitle: 'Back Flying & Formations',
    description: 'Expand your range with back-flying control, transitions, and the first principles of flying with others.',
    color: 'sky',
    number: '02',
  },
]

const markdownProcessor = remark().use(remarkGfm).use(remarkHtml, { sanitize: false })

function markdownToHtml(markdown: string) {
  return markdownProcessor.processSync(markdown).toString()
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function plainText(value: string) {
  return value
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function labeledParagraph(markdown: string, label: string) {
  const match = markdown.match(
    new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*\\n|$)`, 'i')
  )
  return match ? plainText(match[1]) : undefined
}

function youtubeId(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1)
    return parsed.searchParams.get('v') ?? ''
  } catch {
    return ''
  }
}

function extractVideos(markdown: string): Video[] {
  const videos: Video[] = []
  const linkPattern = /\[([^\]]+)]\((https:\/\/(?:www\.)?(?:youtube\.com\/watch\?[^)]+|youtu\.be\/[^)]+))\)/g

  for (const match of markdown.matchAll(linkPattern)) {
    const id = youtubeId(match[2])
    if (id) videos.push({ id, title: match[1], url: match[2] })
  }

  return videos
}

function lessonBody(markdown: string) {
  return markdown.replace(/\n\*\*Links:\*\*[\s\S]*$/i, '').trim()
}

function parseLesson(
  title: string,
  markdown: string,
  groupTitle: string,
  level: Pick<CourseLevel, 'slug' | 'title'>,
  number: number
): Lesson {
  const summary =
    labeledParagraph(markdown, 'Desired outcome') ??
    labeledParagraph(markdown, 'Purpose') ??
    labeledParagraph(markdown, 'Description') ??
    labeledParagraph(markdown, 'Manual status') ??
    'Build understanding and control through a focused progression.'

  return {
    slug: slugify(title),
    title,
    levelSlug: level.slug,
    levelTitle: level.title,
    groupTitle,
    summary,
    prerequisite: labeledParagraph(markdown, 'Prerequisite'),
    html: markdownToHtml(lessonBody(markdown)),
    videos: extractVideos(markdown),
    number,
  }
}

function parseLevel(definition: LevelDefinition): CourseLevel {
  const source = fs.readFileSync(path.join(process.cwd(), definition.file), 'utf8')
  const title = source.match(/^#\s+(.+)$/m)?.[1] ?? definition.shortTitle
  const hasNestedLessons = /^###\s+/m.test(source)
  const draftGroups: Array<{ title: string; lessons: Array<{ title: string; markdown: string }> }> = []
  let group: (typeof draftGroups)[number] | undefined
  let lesson: { title: string; markdown: string } | undefined

  for (const line of source.split('\n')) {
    const h2 = line.match(/^##\s+(.+)$/)
    const h3 = line.match(/^###\s+(.+)$/)

    if (hasNestedLessons && h2) {
      group = { title: h2[1], lessons: [] }
      draftGroups.push(group)
      lesson = undefined
      continue
    }

    if ((hasNestedLessons && h3) || (!hasNestedLessons && h2)) {
      if (!group) {
        group = { title: definition.shortTitle, lessons: [] }
        draftGroups.push(group)
      }
      lesson = { title: (h3 ?? h2)![1], markdown: '' }
      group.lessons.push(lesson)
      continue
    }

    if (lesson) lesson.markdown += `${line}\n`
  }

  const levelBase = { slug: definition.slug, title }
  let lessonNumber = 0
  const groups = draftGroups.map((draftGroup) => ({
    title: draftGroup.title,
    lessons: draftGroup.lessons.map((draftLesson) =>
      parseLesson(
        draftLesson.title,
        draftLesson.markdown,
        draftGroup.title,
        levelBase,
        ++lessonNumber
      )
    ),
  }))

  return {
    ...definition,
    title,
    groups,
    lessons: groups.flatMap((item) => item.lessons),
  }
}

export const getLevels = cache(() => levelDefinitions.map(parseLevel))

export const getLevel = (slug: string) => getLevels().find((level) => level.slug === slug)

export const getLesson = (levelSlug: string, lessonSlug: string) =>
  getLevel(levelSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug)

export const getCourseIntro = cache(() => {
  const source = fs.readFileSync(path.join(process.cwd(), 'LearnToFly.md'), 'utf8')
  const title = source.match(/^#\s+(.+)$/m)?.[1] ?? 'Tunnel Flying Lesson Plans'
  const author = source.match(/^>\s*Author:\s*(.+)$/m)?.[1] ?? 'Justin Bender'
  const about = source.match(/^## About\s*$([\s\S]*?)(?=^## Levels\s*$)/m)?.[1].trim() ?? ''

  return { title, author, aboutHtml: markdownToHtml(about) }
})

export function getAdjacentLessons(level: CourseLevel, lesson: Lesson) {
  const index = level.lessons.findIndex((item) => item.slug === lesson.slug)
  return {
    previous: index > 0 ? level.lessons[index - 1] : undefined,
    next: index < level.lessons.length - 1 ? level.lessons[index + 1] : undefined,
  }
}
