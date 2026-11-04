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

// « dark » réutilise les tokens du mode sombre : textes, filets et kickers
// s'adaptent tout seuls dans la section.
const TONES = {
  default: '',
  ivory: 'bg-secondary',
  dark: 'dark bg-background text-foreground',
} as const

type Item = {
  id: number
  slug: string
  title: string
  excerpt: string
  image: { src: string; alt: string }
  category: { name: string; slug: string }
}

function Photo({ a, ratio, sizes }: { a: Item; ratio: string; sizes: string }) {
  return (
    <div className={cn('relative w-full overflow-hidden bg-secondary', ratio)}>
      {a.image.src && (
        <Image
          src={a.image.src}
          alt={a.image.alt}
          fill
          sizes={sizes}
          className='cover-zoom object-cover'
        />
      )}
    </div>
  )
}

function Eyebrow({ a }: { a: Item }) {
  if (!a.category.name) return null
  return (
    <span className={cn('kicker', categoryColor(a.category.slug))}>
      {a.category.name}
    </span>
  )
}

function TitleLink({ a }: { a: Item }) {
  return (
    <Link
      href={`/article/${a.slug}`}
      className=' after:absolute after:inset-0 '
    >
      {capitalizeFirst(a.title)}
    </Link>
  )
}

export async function CategoryMosaic({
  categoryId, // id WordPress de la catégorie « Art de vivre »
  slug = 'art-de-vivre',
  title = 'Art de vivre',
  kicker = 'Maison & élégance',
  exclude = [],
  tone = 'default',
}: {
  categoryId: number
  slug?: string
  title?: string
  kicker?: string
  exclude?: number[] // ids déjà affichés ailleurs sur la page
  tone?: keyof typeof TONES
}) {
  const posts = await getPostsByCategory(categoryId)
  const articles: Item[] = posts
    .filter((post) => !exclude.includes(post.id))
    .slice(0, 8)
    .map((post) => ({
      id: post.id,
      slug: post.slug,
      title: decodeEntities(post.title.rendered),
      excerpt: stripHtml(post.excerpt.rendered),
      image: {
        src: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        alt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
      },
      category: {
        name: post._embedded?.['wp:term']?.[0]?.[0]?.name || '',
        slug: post._embedded?.['wp:term']?.[0]?.[0]?.slug || '',
      },
    }))
  if (articles.length === 0) return null

  const [lead, wide, ...small] = articles

  return (
    <section aria-labelledby={`cat-${slug}`} className={TONES[tone]}>
      <div className='container-editorial section-gap'>
        {/* En-tête */}
        <header className='mb-8 flex items-end justify-between gap-6 border-b pb-4 md:mb-12'>
          <div className='space-y-3'>
            <p className={cn('kicker', categoryColor(slug))}>{kicker}</p>
            <h2 id={`cat-${slug}`} className='font-display text-h2 font-bold'>
              <Link
                href={`/categorie/${slug}`}
                className='hover:text-gold-text'
              >
                {title}
              </Link>
            </h2>
          </div>
          <Link
            href={`/categorie/${slug}`}
            className='nav-label hidden items-center gap-2 pb-1 hover:text-gold-text sm:inline-flex'
          >
            Tout voir <ArrowRight className='size-4' />
          </Link>
        </header>

        <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14'>
          {/* Grand article : portrait sur desktop, paysage en dessous */}
          <article
            className={cn(
              'group relative min-w-0',
              wide ? 'lg:col-span-5' : 'lg:col-span-8',
            )}
          >
            <Photo
              a={lead}
              ratio='aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]'
              sizes='(min-width: 1024px) 40vw, 100vw'
            />
            <div className='mt-6 space-y-3'>
              {/* <Eyebrow a={lead} /> */}
              <h3 className='font-display text-h2 font-bold line-clamp-3 md:block group-hover:underline'>
                <TitleLink a={lead} />
              </h3>
            </div>
          </article>

          {/* Colonne de droite : 1 carte large + 2 carrées */}
          {wide && (
            <div className='grid min-w-0 grid-cols-2 content-start gap-x-5 gap-y-10 sm:gap-x-8 lg:col-span-7'>
              <article className='group relative col-span-2 grid gap-5 sm:grid-cols-2 sm:items-center sm:gap-8'>
                <Photo
                  a={wide}
                  ratio='aspect-[4/3]'
                  sizes='(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw'
                />
                <div className='space-y-3'>
                  {/* <Eyebrow a={wide} /> */}
                  <h3 className='font-display text-h3 font-bold'>
                    <TitleLink a={wide} />
                  </h3>
                </div>
              </article>

              {small.map((a) => (
                <article key={a.id} className='group relative'>
                  <Photo
                    a={a}
                    ratio='aspect-square'
                    sizes='(min-width: 1024px) 28vw, 50vw'
                  />
                  <div className='mt-4 space-y-2'>
                    {/* <Eyebrow a={a} /> */}
                    <h3 className='font-display text-lg font-bold leading-snug sm:text-xl line-clamp-3 md:block'>
                      <TitleLink a={a} />
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
