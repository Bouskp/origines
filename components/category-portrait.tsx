import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/libs/utils'
import { capitalizeFirst, decodeEntities } from '@/libs/Articles'
import { getPostsByCategory } from '@/libs/wordpress'

const TONES = {
  default: '',
  ivory: 'bg-secondary',
  dark: 'dark bg-background text-foreground',
} as const

// Nombre de colonnes desktop selon le nombre d'articles (classes statiques)
const COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

export async function CategoryPortraits({
  categoryId, // id WordPress de la catégorie « Personnalités »
  slug = 'personnalites',
  title = 'Personnalités',
  kicker = 'Portraits',
  exclude = [],
  tone = 'dark',
}: {
  categoryId: number
  slug?: string
  title?: string
  kicker?: string
  exclude?: number[] // ids déjà affichés ailleurs sur la page
  tone?: keyof typeof TONES
}) {
  const posts = await getPostsByCategory(categoryId)
  const articles = posts
    .filter((post) => !exclude.includes(post.id))
    .slice(0, 4)
    .map((post) => ({
      id: post.id,
      slug: post.slug,
      title: decodeEntities(post.title.rendered),
      image: {
        src: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        alt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
      },
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || '',
    }))
  if (articles.length === 0) return null

  return (
    <section aria-labelledby={`cat-${slug}`} className={TONES[tone]}>
      <div className='container-editorial section-gap'>
        {/* En-tête centré */}
        <header className='mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-14'>
          <p className='kicker text-gold-text'>{kicker}</p>
          <h2 id={`cat-${slug}`} className='font-display text-h1 font-bold'>
            {title}
          </h2>
          <div className='rule-gold' />
          <Link
            href={`/categorie/${slug}`}
            className='nav-label inline-flex items-center gap-2 hover:text-gold-text'
          >
            Tout voir <ArrowRight className='size-4' />
          </Link>
        </header>

        {/* 2 colonnes sur mobile, jusqu'à 4 sur desktop avec décalage vertical */}
        <ul
          className={cn(
            'grid grid-cols-2 items-start gap-3 sm:gap-5 lg:gap-8',
            COLS[articles.length] ?? 'lg:grid-cols-4',
          )}
        >
          {articles.map((a, i) => (
            <li key={a.id} className='min-w-0 lg:even:mt-14'>
              <article className='group relative aspect-[3/4] overflow-hidden bg-ink'>
                {a.image.src && (
                  <Image
                    src={a.image.src}
                    alt={a.image.alt}
                    fill
                    sizes='(min-width: 1024px) 25vw, 50vw'
                    className='cover-zoom object-cover'
                  />
                )}
                {/* Dégradé pour la lisibilité du texte */}
                <div aria-hidden className='scrim absolute inset-0' />

                <span
                  aria-hidden
                  className='absolute left-3 top-3 font-display text-sm text-ivory/80 sm:left-5 sm:top-5 sm:text-base'
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className='absolute inset-x-0 bottom-0 space-y-2 p-3 text-ivory sm:p-5'>
                  {a.category && (
                    <span className='kicker text-gold-soft'>{a.category}</span>
                  )}
                  <h3 className='line-clamp-4 font-display text-base font-bold leading-snug sm:text-xl lg:text-h3'>
                    <Link
                      href={`/article/${a.slug}`}
                      className='decoration-gold decoration-1 underline-offset-[6px] after:absolute after:inset-0 group-hover:underline'
                    >
                      {capitalizeFirst(a.title)}
                    </Link>
                  </h3>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
