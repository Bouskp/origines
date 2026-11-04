import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/libs/utils'
import {
  capitalizeFirst,
  categoryColor,
  decodeEntities,
  stripHtml,
} from '@/libs/Articles'
import { getPostsByCategory } from '@/libs/wordpress'

export async function CategoryRail({
  slug = 'beaute',
  title = 'Beauté',
  kicker = 'Rituels & soins',
  description = 'Soins, maquillage, cheveux : les gestes et les adresses qui comptent.',
  count = 8,
  exclude = [],
  ivory = false,
}: {
  slug?: string // slug de la catégorie WordPress
  title?: string
  kicker?: string
  description?: string
  count?: number
  exclude?: number[] // ids déjà affichés ailleurs sur la page
  ivory?: boolean
}) {
  const posts = await getPostsByCategory(4)
  const articles = posts
    .filter((post) => !exclude.includes(post.id))
    .slice(0, count)
    .map((post) => ({
      id: post.id,
      slug: post.slug,
      title: decodeEntities(post.title.rendered),
      excerpt: stripHtml(post.excerpt.rendered),
      date: post.date,
      image: {
        src: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        alt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
      },
      category: {
        name: post._embedded?.['wp:term']?.[0]?.[0]?.name || '',
        slug: post._embedded?.['wp:term']?.[0]?.[0]?.slug || '',
      },
      author: decodeEntities(post._embedded?.author?.[0]?.name || ''),
    }))
  if (articles.length === 0) return null

  return (
    <section
      aria-labelledby={`cat-${slug}`}
      className={cn(ivory && 'bg-secondary')}
    >
      {/* grid-cols-1 : colonne en minmax(0,1fr), sinon le rail fait déborder la page */}
      <div className='container-editorial section-gap grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-12 lg:gap-14'>
        {/* Introduction (reste visible pendant le défilement sur desktop) */}
        <div className='min-w-0 space-y-4 self-start md:max-w-xl md:space-y-5 lg:sticky lg:top-28 lg:col-span-3 lg:max-w-none'>
          <p className={cn('kicker', categoryColor(slug))}>{kicker}</p>
          <h2
            id={`cat-${slug}`}
            className='break-words font-display text-h1 font-bold lg:text-h2'
          >
            {capitalizeFirst(title)}
          </h2>
          <div className='rule-gold' />
          <p className='font-serif text-lead text-muted-foreground'>
            {description}
          </p>
          <Link
            href={`/categorie/${slug}`}
            className='nav-label inline-flex items-center gap-3 border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background'
          >
            Tout voir <ArrowRight className='size-4' />
          </Link>
        </div>

        {/* min-w-0 : sans lui, la colonne s'élargit au contenu du rail */}
        <div className='min-w-0 lg:col-span-9'>
          <ul
            tabIndex={0}
            aria-label={`Articles ${title}`}
            className={cn(
              // Défilement horizontal avec accroche
              'flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-6',
              // Mobile / tablette : le rail déborde jusqu'au bord de l'écran
              '-mx-[var(--gutter)] px-[var(--gutter)] scroll-px-[var(--gutter)]',
              // Desktop : aligné sur la grille, barre de défilement fine visible
              'lg:mx-0 lg:px-0 lg:scroll-px-0',
              'lg:[scrollbar-width:thin] lg:[scrollbar-color:var(--gold)_transparent]',
              // Mobile / tablette : barre masquée (défilement tactile)
              'max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden',
              'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
            )}
          >
            {articles.map((a) => (
              <li
                key={a.id}
                className='shrink-0 basis-[78%] snap-start min-[480px]:basis-[56%] sm:basis-[42%] lg:basis-[44%] xl:basis-[31%]'
              >
                <article className='group relative'>
                  <div className='relative aspect-[3/4] overflow-hidden bg-secondary'>
                    {a.image.src && (
                      <Image
                        src={a.image.src}
                        alt={a.image.alt}
                        fill
                        sizes='(min-width: 1280px) 24vw, (min-width: 1024px) 34vw, (min-width: 640px) 42vw, (min-width: 480px) 56vw, 78vw'
                        className='cover-zoom object-cover'
                      />
                    )}
                  </div>

                  <div className='mt-4 space-y-2 sm:mt-5'>
                    {/* {a.category.name && (
                      <span
                        className={cn('kicker', categoryColor(a.category.slug))}
                      >
                        {a.category.name}
                      </span>
                    )} */}
                    <h3 className='font-display text-xl font-bold leading-snug xl:text-h3 line-clamp-3'>
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
      </div>
    </section>
  )
}
