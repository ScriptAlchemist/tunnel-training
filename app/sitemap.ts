import type { MetadataRoute } from 'next'
import { getHumanoidContent, getLevels } from '@/lib/course'
import { absoluteSiteUrl } from '@/lib/seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const levels = getLevels()
  const humanoid = getHumanoidContent()
  const paths = [
    '/',
    '/levels/',
    ...levels.flatMap((level) => [
      `/levels/${level.slug}/`,
      ...(level.groups.length > 1
        ? level.groups.map(
            (section) => `/levels/${level.slug}/sections/${section.slug}/`
          )
        : []),
      ...level.lessons.map(
        (lesson) => `/levels/${level.slug}/${lesson.slug}/`
      ),
    ]),
    ...(humanoid.visible ? ['/humanoid/'] : []),
  ]

  return paths.map((pathname) => ({ url: absoluteSiteUrl(pathname) }))
}
