'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { SiteContent, Video } from '@/lib/course'

type VideoLabels = Pick<
  SiteContent['labels'],
  'lessonVideos' | 'openYouTube'
>

export function VideoPlayer({ videos, labels }: { videos: Video[]; labels: VideoLabels }) {
  const [active, setActive] = useState(0)

  if (videos.length === 0) return null

  const video = videos[active]

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-[1.5rem] bg-black shadow-2xl">
        <iframe
          key={video.id}
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {videos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2" aria-label={labels.lessonVideos}>
          {videos.map((item, index) => (
            <Button
              key={item.id}
              type="button"
              variant={index === active ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActive(index)}
              className="shrink-0 cursor-pointer rounded-full px-4 text-xs font-extrabold"
            >
              {item.title}
            </Button>
          ))}
        </div>
      )}
      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex text-xs font-bold text-muted-foreground underline decoration-border underline-offset-4 hover:text-primary"
      >
        {labels.openYouTube} ↗
      </a>
    </div>
  )
}
