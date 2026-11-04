// components/article-card.tsx
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/libs/utils'
import {
  capitalizeFirst,
  categoryColor,
  decodeEntities,
  formatDate,
  stripHtml,
} from '@/libs/Articles'
import type { WPPost } from './recents-articles'

type Variant = 'hero' | 'row' | 'grid'

function Cover({
  article,
  sizes,
  className,
  priority,
}: {
  article: WPPost
  sizes: string
  className?: string
  priority?: boolean
}) {
  return (
    <div className={cn('relative overflow-hidden bg-secondary', className)}>
      {article._embedded ? (
        <Image
          src={article._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''}
          alt={article._embedded?.['wp:featuredmedia']?.[0]?.alt_text || ''}
          fill
          sizes={sizes}
          priority={priority}
          className='cover-zoom object-cover'
        />
      ) : (
        <span className='masthead absolute inset-0 grid place-items-center text-4xl text-gold/40'>
          O
        </span>
      )}
    </div>
  )
}

function Kicker({ article }: { article: WPPost }) {
  if (!article._embedded?.['wp:term']?.[0]?.[0]) return null
  return (
    <span
      className={cn(
        'kicker',
        categoryColor(article._embedded['wp:term'][0][0].slug),
      )}
    >
      {decodeEntities(article._embedded['wp:term'][0][0].name)}
    </span>
  )
}

function Meta({ article }: { article: WPPost }) {
  return (
    <p className='text-meta text-muted-foreground'>
      <time dateTime={article.date}>{formatDate(article.date)}</time>
    </p>
  )
}

/* Le lien est posé sur le titre et étiré sur toute la carte (after:inset-0),
   ce qui garde un HTML sémantique et une carte entièrement cliquable. */
function TitleLink({
  article,
  className,
}: {
  article: WPPost
  className?: string
}) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className={cn('after:absolute after:inset-0 ', className)}
    >
      {decodeEntities(capitalizeFirst(article.title.rendered))}
    </Link>
  )
}

export function ArticleCard({
  article,
  variant = 'grid',
  priority = false,
}: {
  article: WPPost
  variant?: Variant
  priority?: boolean
}) {
  if (variant === 'hero') {
    return (
      <article className='group relative'>
        <Cover
          article={article}
          priority={priority}
          sizes='(min-width: 1024px) 55vw, 100vw'
          className='aspect-[4/3]'
        />
        <div className='mt-6 space-y-4'>
          <Kicker article={article} />
          <h3 className='font-display text-h1 font-bold '>
            <TitleLink article={article} />
          </h3>
          {article.excerpt && (
            <p className='line-clamp-3 font-serif text-lead text-muted-foreground'>
              {stripHtml(article.excerpt.rendered)}
            </p>
          )}
          <Meta article={article} />
        </div>
      </article>
    )
  }

  if (variant === 'row') {
    return (
      <article className='group relative grid grid-cols-[1fr_7.5rem] items-start gap-5 border-b py-6 first:pt-0 last:border-b-0 sm:grid-cols-[1fr_10rem]'>
        <div className='space-y-3'>
          <Kicker article={article} />
          <h3 className='font-display text-h3 font-bold'>
            <TitleLink article={article} />
          </h3>
          <Meta article={article} />
        </div>
        <Cover article={article} sizes='160px' className='aspect-square' />
      </article>
    )
  }

  return (
    <article className='group relative'>
      <Cover
        article={article}
        sizes='(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'
        className='aspect-[3/2]'
      />
      <div className='mt-4 space-y-3'>
        <Kicker article={article} />
        <h3 className='font-display text-h3 font-bold group-hover:underline focus-visible:underline line-clamp-3'>
          <TitleLink article={article} />
        </h3>
        <Meta article={article} />
      </div>
    </article>
  )
}
