import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { cache } from 'react'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { remark } from 'remark'

const contentDirectory = path.join(process.cwd(), 'markdown')
const prerequisitesDirectory = path.join(contentDirectory, 'prerequisites')

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
  mediaHtml: string
  videos: Video[]
  number: number
}

export type LessonGroup = {
  slug: string
  title: string
  description: string
  html: string
  mediaHtml: string
  videos: Video[]
  contentSections: SinglePageSection[]
  lessons: Lesson[]
}

export type SinglePageSection = {
  slug: string
  title: string
  html: string
  mediaHtml: string
  videos: Video[]
}

export type CourseLevel = {
  slug: string
  title: string
  shortTitle: string
  description: string
  accent: string
  number: string
  order: number
  singlePage: boolean
  sectionPages: boolean
  sectionCount: number
  html: string
  contentSections: SinglePageSection[]
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
    home: string
    levels: string
    humanoid: string
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
    back: string
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
    watchMovement: string
    conceptVisual: string
    prerequisite: string
    prerequisites: string
    showPrerequisites: string
    hidePrerequisites: string
    previous: string
    next: string
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

export type HumanoidContent = {
  visible: boolean
  eyebrow: string
  title: string
  description: string
  viewportLabel: string
  instructions: string
  bodyTitle: string
  bodyDescription: string
  jointTitle: string
  jointDescription: string
  jointSelect: string
  resetButton: string
  axes: Record<'x' | 'y' | 'z', string>
  joints: Record<
    | 'chest'
    | 'neck'
    | 'leftShoulder'
    | 'leftElbow'
    | 'leftWrist'
    | 'rightShoulder'
    | 'rightElbow'
    | 'rightWrist'
    | 'leftHip'
    | 'leftKnee'
    | 'leftAnkle'
    | 'rightHip'
    | 'rightKnee'
    | 'rightAnkle',
    string
  >
}

export type HomeContent = {
  author: string
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

export type SkillsChartContent = {
  eyebrow: string
  title: string
  description: string
  viewSwitcherLabel: string
  cardsViewLabel: string
  chartViewLabel: string
  levelLabel: string
  trackLabel: string
  skillLabel: string
  conceptLabel: string
  openSkillLabel: string
  sourceNote: string
}

export type PrerequisiteContent = {
  level: string
  section?: string
  visible: boolean
  eyebrow: string
  title: string
  description: string
  topics: string[]
  html: string
}

type LevelFrontmatter = Pick<
  CourseLevel,
  'slug' | 'shortTitle' | 'description' | 'accent' | 'number' | 'order'
> & { singlePage?: boolean; sectionPages?: boolean }

const markdownProcessor = remark().use(remarkGfm).use(remarkHtml, { sanitize: false })
const conceptFigurePattern = /<figure class="concept-graphic">[\s\S]*?<\/figure>/g

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

  const rendered = markdownToHtml(lessonBody(markdown))
  const figures = rendered.match(conceptFigurePattern) ?? []

  return {
    slug: slugify(title),
    title,
    levelSlug: level.slug,
    levelTitle: level.title,
    groupTitle,
    summary,
    prerequisite: labeledParagraph(markdown, 'Prerequisite'),
    html: rendered.replace(conceptFigurePattern, '').trim(),
    mediaHtml: figures.join('\n'),
    videos: extractVideos(markdown),
    number,
  }
}

function parseLevel(filename: string): CourseLevel {
  const parsed = matter(readContentFile(filename))
  const definition = parsed.data as LevelFrontmatter
  const title = parsed.content.match(/^#\s+(.+)$/m)?.[1] ?? definition.shortTitle
  const singlePage = definition.singlePage ?? false
  const sectionPages = definition.sectionPages ?? false

  if (singlePage) {
    const content = parsed.content
      .replace(/^#\s+.+\n?/m, '')
      .replace(/^\[Back to lesson plan index\]\(README\.md\)\s*/m, '')
      .trim()
    const headings = [...content.matchAll(/^##\s+(.+)$/gm)]
    const introMarkdown = content.slice(0, headings[0]?.index ?? content.length).trim()
    const contentSections = headings.map((heading, index) => {
      const start = (heading.index ?? 0) + heading[0].length
      const end = headings[index + 1]?.index ?? content.length
      const sectionMarkdown = content.slice(start, end).trim()
      const rendered = markdownToHtml(lessonBody(sectionMarkdown))
      const figures = rendered.match(conceptFigurePattern) ?? []

      return {
        slug: slugify(heading[1]),
        title: heading[1],
        html: rendered.replace(conceptFigurePattern, '').trim(),
        mediaHtml: figures.join('\n'),
        videos: extractVideos(sectionMarkdown),
      }
    })

    return {
      ...definition,
      singlePage,
      sectionPages,
      title,
      sectionCount: contentSections.length,
      html: markdownToHtml(introMarkdown),
      contentSections,
      groups: [],
      lessons: [],
    }
  }

  if (sectionPages) {
    const content = parsed.content
      .replace(/^#\s+.+\n?/m, '')
      .replace(/^\[Back to lesson plan index\]\(README\.md\)\s*/m, '')
      .trim()
    const headings = [...content.matchAll(/^##\s+(.+)$/gm)]
    const groups = headings.map((heading, index) => {
      const start = (heading.index ?? 0) + heading[0].length
      const end = headings[index + 1]?.index ?? content.length
      const sectionMarkdown = content.slice(start, end).trim()
      const firstSubheading = sectionMarkdown.search(/^###\s+/m)
      const introMarkdown =
        firstSubheading >= 0 ? sectionMarkdown.slice(0, firstSubheading).trim() : ''
      const bodyMarkdown =
        firstSubheading >= 0 ? sectionMarkdown.slice(firstSubheading).trim() : sectionMarkdown
      const subheadings = [...bodyMarkdown.matchAll(/^###\s+(.+)$/gm)]
      const contentSections = subheadings.length > 0
        ? subheadings.map((subheading, subheadingIndex) => {
            const subsectionStart = (subheading.index ?? 0) + subheading[0].length
            const subsectionEnd = subheadings[subheadingIndex + 1]?.index ?? bodyMarkdown.length
            const subsectionMarkdown = bodyMarkdown
              .slice(subsectionStart, subsectionEnd)
              .trim()
            const rendered = markdownToHtml(lessonBody(subsectionMarkdown))
            const figures = rendered.match(conceptFigurePattern) ?? []

            return {
              slug: slugify(subheading[1]),
              title: subheading[1],
              html: rendered.replace(conceptFigurePattern, '').trim(),
              mediaHtml: figures.join('\n'),
              videos: extractVideos(subsectionMarkdown),
            }
          })
        : (() => {
            const rendered = markdownToHtml(lessonBody(bodyMarkdown))
            const figures = rendered.match(conceptFigurePattern) ?? []

            return [{
              slug: 'content',
              title: '',
              html: rendered.replace(conceptFigurePattern, '').trim(),
              mediaHtml: figures.join('\n'),
              videos: extractVideos(bodyMarkdown),
            }]
          })()

      return {
        slug: slugify(heading[1]),
        title: heading[1],
        description: plainText(introMarkdown) || definition.description,
        html: '',
        mediaHtml: '',
        videos: [],
        contentSections,
        lessons: [],
      }
    })

    return {
      ...definition,
      singlePage,
      sectionPages,
      title,
      sectionCount: groups.length,
      html: '',
      contentSections: [],
      groups,
      lessons: [],
    }
  }

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
      html: '',
      mediaHtml: '',
      videos: [],
      contentSections: [],
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
    singlePage,
    sectionPages,
    title,
    sectionCount: groups.length,
    html: '',
    contentSections: [],
    groups,
    lessons: groups.flatMap((item) => item.lessons),
  }
}

export const getSiteContent = cache(() => {
  const parsed = matter(readContentFile('site.md'))
  return parsed.data as SiteContent
})

export const getHumanoidContent = cache(() => {
  const parsed = matter(readContentFile('humanoid.md'))
  return parsed.data as HumanoidContent
})

export const getSkillsChartContent = cache(() => {
  const parsed = matter(readContentFile('skills-chart.md'))
  return parsed.data as SkillsChartContent
})

export const getPrerequisites = cache(() =>
  fs
    .readdirSync(prerequisitesDirectory)
    .filter((filename) => filename.endsWith('.md'))
    .sort()
    .map((filename) => {
      const source = fs.readFileSync(path.join(prerequisitesDirectory, filename), 'utf8')
      const parsed = matter(source)
      const definition = parsed.data as Omit<
        PrerequisiteContent,
        'html' | 'visible'
      > & { visible?: boolean }

      return {
        ...definition,
        visible: definition.visible ?? true,
        html: markdownToHtml(parsed.content.trim()),
      }
    })
)

export const getLevelPrerequisite = (levelSlug: string) =>
  getPrerequisites().find((item) => item.level === levelSlug && !item.section)

export const getSectionPrerequisite = (levelSlug: string, sectionSlug: string) =>
  getPrerequisites().find(
    (item) => item.level === levelSlug && item.section === sectionSlug
  )

export const hasPrerequisiteContent = (content?: PrerequisiteContent) =>
  Boolean(
    content &&
      content.visible &&
      (content.description || content.topics.length > 0 || content.html.trim())
  )

export const getLevels = cache(() =>
  fs
    .readdirSync(contentDirectory)
    .filter((filename) => /^level-[a-z0-9-]+\.md$/i.test(filename))
    .map(parseLevel)
    .sort((a, b) => a.order - b.order)
)

export const getLevel = (slug: string) => getLevels().find((level) => level.slug === slug)

export function displayLevelNumber(number: string) {
  const numeric = Number(number)
  return Number.isFinite(numeric) ? String(numeric) : number
}

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
