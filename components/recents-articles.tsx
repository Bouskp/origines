'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArticleCard } from '@/components/article-card'

export type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    author?: { name: string }[]
    'wp:featuredmedia'?: { source_url: string; alt_text: string }[]
    'wp:term'?: { name: string; slug: string }[][]
  }
}

export function RecentArticles({
  initialArticles,
  total,
  kicker = 'À lire',
  title = 'A la Une',
  pageSize = 1,
}: {
  initialArticles: WPPost[]
  total: number
  kicker?: string
  title?: string
  pageSize?: number
}) {
  const [articles, setArticles] = useState(initialArticles)
  const [count, setCount] = useState(total)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  if (articles.length === 0) return null

  const [hero, ...rest] = articles
  const stack = rest.slice(0, 3)
  const grid = rest.slice(3)
  const hasMore = articles.length < count

  async function loadMore() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(
        `/api/posts?offset=${articles.length}&perPage=${pageSize}`,
      )
      if (!res.ok) throw new Error('fetch failed')
      const data: { articles: WPPost[]; total: number } = await res.json()
      setArticles((prev) => {
        const seen = new Set(prev.map((a) => a.id))
        return [...prev, ...data.articles.filter((a) => !seen.has(a.id))]
      })
      setCount(data.total)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='container-editorial section-gap'>
      {/* En-tête de section */}
      <header className='mb-10 flex items-end justify-between gap-6 border-b pb-6'>
        <div className='space-y-4'>
          <p className='kicker'>{kicker}</p>
          <h2 className='font-display text-h2 font-bold'>{title}</h2>
        </div>
      </header>

      {/* Une grande carte + une pile de trois */}
      <div className='grid gap-12 lg:grid-cols-12 lg:gap-16'>
        <div className='lg:col-span-7'>
          <ArticleCard article={hero} variant='grid' priority />
        </div>
        {stack.length > 0 && (
          <div className='flex flex-col lg:col-span-5'>
            {stack.map((a) => (
              <ArticleCard key={a.id} article={a} variant='row' />
            ))}
          </div>
        )}
      </div>

      {/* Grille */}
      {grid.length > 0 && (
        <div className='mt-16 grid gap-x-8 gap-y-12 border-t pt-12 sm:grid-cols-2 lg:grid-cols-3'>
          {grid.map((a) => (
            <ArticleCard key={a.id} article={a} variant='grid' />
          ))}
        </div>
      )}

      {/* Charger plus */}
      {(hasMore || error) && (
        <div className='mt-14 flex flex-col items-center gap-3'>
          <Button
            onClick={loadMore}
            disabled={loading}
            variant='outline'
            className='nav-label h-12 rounded-none border-foreground px-10 hover:bg-foreground hover:text-background'
          >
            {loading ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' /> Chargement
              </>
            ) : (
              'Voir plus d’articles'
            )}
          </Button>
          {error && (
            <p role='alert' className='text-meta text-destructive'>
              Impossible de charger la suite. Réessaie dans un instant.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
