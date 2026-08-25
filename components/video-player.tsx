'use client'

import { useState } from 'react'
import type { Video } from '@/lib/course'

export function VideoPlayer({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState(0)

  if (videos.length === 0) {
    return (
      <div className="grid aspect-video place-items-center rounded-[1.5rem] border border-dashed border-[var(--line)] bg-[var(--panel)] p-8 text-center">
        <div>
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-[var(--accent-soft)] text-xl text-[var(--accent)]">
            +
          </span>
          <p className="font-extrabold">Video reference coming soon</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            This lesson is ready for the current training program’s approved resource.
          </p>
        </div>
      </div>
    )
  }

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
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2" aria-label="Lesson videos">
          {videos.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-extrabold transition ${
                index === active
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'border border-[var(--line)] bg-[var(--panel)] hover:border-[var(--accent)]'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex text-xs font-bold text-[var(--muted)] underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)]"
      >
        Open on YouTube ↗
      </a>
    </div>
  )
}
