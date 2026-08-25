import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { cache } from 'react'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { remark } from 'remark'

const contentDirectory = path.join(process.cwd(), 'markdown')

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
  slug: string
  title: string
  description: string
  lessons: Lesson[]
}

export type CourseLevel = {
  slug: string
  title: string
  shortTitle: string
  description: string
  accent: string
  number: string
  order: number
  groups: LessonGroup[]
  lessons: Lesson[]
}

export type SiteContent = {
  title: string
  language: string
  description: string
  socialDescription: string
  siteUrl: string
  email: string
  navigation: {
    levels: string
    about: string
  }
  theme: {
    toggle: string
  }
  footer: {
    text: string
    link: string
  }
  labels: {
    mainNavigation: string
    breadcrumb: string
    lessonNavigation: string
    home: string
    levels: string
    level: string
    lesson: string
    lessons: string
    section: string
    sections: string
    courseIndex: string
    levelIndexMetadataTitle: string
    levelIndexMetadataDescription: string
    levelIndexTitle: string
    levelIndexDescription: string
    readinessTitle: string
    readinessText: string
    viewCurriculum: string
    viewSection: string
    prerequisiteIncluded: string
    video: string
    videos: string
    referencePending: string
    watchMovement: string
    prerequisite: string
    seeLessonNotes: string
    previous: string
    next: string
    videoPendingTitle: string
    videoPendingText: string
    lessonVideos: string
    openYouTube: string
    defaultLessonSummary: string
  }
  notFound: {
    eyebrow: string
    title: string
    description: string
    button: string
  }
}

export type HomeContent = {
  title: string
  author: string
  aboutEyebrow: string
  quoteLabel: string
  quote: string
  levelsEyebrow: string
  levelsTitle: string
  levelsDescription: string
  bookingEyebrow: string
  bookingTitle: string
  bookingButton: string
  bookingSubject: string
  aboutHtml: string
}

type LevelFrontmatter = Pick<
  CourseLevel,
  'slug' | 'shortTitle' | 'description' | 'accent' | 'number' | 'order'
>

const markdownProcessor = remark().use(remarkGfm).use(remarkHtml, { sanitize: false })

function readContentFile(filename: string) {
  return fs.readFileSync(path.join(contentDirectory, filename), 'utf8')
}

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
  number: number,
  defaultSummary: string
): Lesson {
  const summary =
    labeledParagraph(markdown, 'Desired outcome') ??
    labeledParagraph(markdown, 'Purpose') ??
    labeledParagraph(markdown, 'Description') ??
    labeledParagraph(markdown, 'Manual status') ??
    defaultSummary

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

function parseLevel(filename: string): CourseLevel {
  const parsed = matter(readContentFile(filename))
  const definition = parsed.data as LevelFrontmatter
  const title = parsed.content.match(/^#\s+(.+)$/m)?.[1] ?? definition.shortTitle
  const hasNestedLessons = /^###\s+/m.test(parsed.content)
  const draftGroups: Array<{
    title: string
    markdown: string
    lessons: Array<{ title: string; markdown: string }>
  }> = []
  let group: (typeof draftGroups)[number] | undefined
  let lesson: { title: string; markdown: string } | undefined

  for (const line of parsed.content.split('\n')) {
    const h2 = line.match(/^##\s+(.+)$/)
    const h3 = line.match(/^###\s+(.+)$/)

    if (hasNestedLessons && h2) {
      group = { title: h2[1], markdown: '', lessons: [] }
      draftGroups.push(group)
      lesson = undefined
      continue
    }

    if ((hasNestedLessons && h3) || (!hasNestedLessons && h2)) {
      if (!group) {
        group = { title: definition.shortTitle, markdown: '', lessons: [] }
        draftGroups.push(group)
      }
      lesson = { title: (h3 ?? h2)![1], markdown: '' }
      group.lessons.push(lesson)
      continue
    }

    if (lesson) {
      lesson.markdown += `${line}\n`
    } else if (group) {
      group.markdown += `${line}\n`
    }
  }

  const levelBase = { slug: definition.slug, title }
  const defaultSummary = getSiteContent().labels.defaultLessonSummary
  let lessonNumber = 0
  const groups = draftGroups.map((draftGroup) => {
    const description = plainText(draftGroup.markdown) || definition.description

    return {
      slug: slugify(draftGroup.title),
      title: draftGroup.title,
      description,
      lessons: draftGroup.lessons.map((draftLesson) =>
        parseLesson(
          draftLesson.title,
          draftLesson.markdown,
          draftGroup.title,
          levelBase,
          ++lessonNumber,
          defaultSummary
        )
      ),
    }
  })

  return {
    ...definition,
    title,
    groups,
    lessons: groups.flatMap((item) => item.lessons),
  }
}

export const getSiteContent = cache(() => {
  const parsed = matter(readContentFile('site.md'))
  return parsed.data as SiteContent
})

export const getLevels = cache(() =>
  fs
    .readdirSync(contentDirectory)
    .filter((filename) => /^level-[a-z0-9-]+\.md$/i.test(filename))
    .map(parseLevel)
    .sort((a, b) => a.order - b.order)
)

export const getLevel = (slug: string) => getLevels().find((level) => level.slug === slug)

export const getLesson = (levelSlug: string, lessonSlug: string) =>
  getLevel(levelSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug)

export const getSection = (levelSlug: string, sectionSlug: string) =>
  getLevel(levelSlug)?.groups.find((group) => group.slug === sectionSlug)

export const getCourseIntro = cache(() => {
  const parsed = matter(readContentFile('LearnToFly.md'))
  return {
    ...(parsed.data as Omit<HomeContent, 'aboutHtml'>),
    aboutHtml: markdownToHtml(parsed.content.trim()),
  }
})

export function getAdjacentLessons(level: CourseLevel, lesson: Lesson) {
  const section = level.groups.find((group) => group.title === lesson.groupTitle)
  const lessons = section?.lessons ?? level.lessons
  const index = lessons.findIndex((item) => item.slug === lesson.slug)
  return {
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index < lessons.length - 1 ? lessons[index + 1] : undefined,
  }
}
