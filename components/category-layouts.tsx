// components/category-layouts.tsx
// Un layout par rubrique + un registre « slug → layout ».
// Tous sont des composants serveur qui reçoivent la liste d'articles de la page.
import Image from 'next/image'
import Link from 'next/link'
import type { ComponentType } from 'react'
import { cn } from '@/libs/utils'
import { categoryColor, formatDate } from '@/libs/Articles'

interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  contentHtml: string
  readingMinutes: number
  image:
    | {
        src: string
        alt: string
        caption: string
      }
    | undefined
  category:
    | {
        id: number
        name: string
        slug: string
      }
    | undefined
  tags:
    | {
        id: number
        name: string
        slug: string
      }[]
    | []

  author:
    | {
        id: number
        name: string
        slug: string
      }
    | undefined
}

export type LayoutProps = { articles: Article[]; startIndex?: number }

/* ---------- Briques communes ---------- */

function Photo({
  a,
  sizes,
  className,
}: {
  a: Article
  sizes: string
  className?: string
}) {
  return (
    <div className={cn('relative w-full overflow-hidden bg-accent', className)}>
      {a.image?.src && (
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

function Eyebrow({ a, light }: { a: Article; light?: boolean }) {
  if (!a.category?.name) return null
  return (
    <span
      className={cn(
        'kicker',
        light ? 'text-gold-soft' : categoryColor(a.category.slug),
      )}
    >
      {a.category.name}
    </span>
  )
}

// Lien étiré sur toute la carte (la carte doit être « group relative »)
function TitleLink({ a, className }: { a: Article; className?: string }) {
  return (
    <Link
      href={`/article/${a.slug}`}
      className={cn('after:absolute after:inset-0', className)}
    >
      {a.title}
    </Link>
  )
}

function Meta({ a }: { a: Article }) {
  return (
    <p className='text-meta text-muted-foreground'>
      <time dateTime={a.date}>{formatDate(a.date)}</time>
    </p>
  )
}

/* ---------- 1. CULTURE : éditorial (une + liste de lecture) ---------- */

function CultureLayout({ articles }: LayoutProps) {
  const [lead, ...rest] = articles
  if (!lead) return null
  return (
    <div className='space-y-14 md:space-y-20'>
      <article className='group relative grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-14'>
        <Photo
          a={lead}
          sizes='(min-width: 1024px) 58vw, 100vw'
          className='aspect-[4/3] lg:col-span-7'
        />
        <div className='space-y-4 lg:col-span-5'>
          <Eyebrow a={lead} />
          <h2 className='font-display text-h1 font-bold'>
            <TitleLink a={lead} />
          </h2>
          {lead.excerpt && (
            <p className='line-clamp-4 font-serif text-lead text-muted-foreground'>
              {lead.excerpt}
            </p>
          )}
          <Meta a={lead} />
        </div>
      </article>

      <ul className='grid gap-x-16 lg:grid-cols-2'>
        {rest.map((a) => (
          <li
            key={a.id}
            className='border-b first:border-t lg:[&:nth-child(2)]:border-t'
          >
            <article className='group relative grid grid-cols-[1fr_7rem] items-start gap-5 py-6 sm:grid-cols-[1fr_11rem]'>
              <div className='min-w-0 space-y-2'>
                <Eyebrow a={a} />
                <h2 className='font-display text-xl font-bold leading-snug sm:text-h3'>
                  <TitleLink a={a} />
                </h2>
                {a.excerpt && (
                  <p className='line-clamp-2 hidden font-serif text-base text-muted-foreground sm:block'>
                    {a.excerpt}
                  </p>
                )}
                <Meta a={a} />
              </div>
              <Photo a={a} sizes='176px' className='aspect-[4/3]' />
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- 2. STYLE : lookbook en maçonnerie ---------- */

const RATIOS = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[2/3]']

function StyleLayout({ articles }: LayoutProps) {
  return (
    <div className='columns-2 gap-4 sm:gap-6 lg:columns-3 lg:gap-8'>
      {articles.map((a, i) => (
        <article
          key={a.id}
          className='group relative mb-8 break-inside-avoid sm:mb-10'
        >
          <Photo
            a={a}
            sizes='(min-width: 1024px) 33vw, 50vw'
            className={RATIOS[i % RATIOS.length]}
          />
          <div className='mt-3 space-y-1.5'>
            <Eyebrow a={a} />
            <h2 className='font-display text-base font-bold leading-snug sm:text-lg'>
              <TitleLink a={a} />
            </h2>
          </div>
        </article>
      ))}
    </div>
  )
}

/* ---------- 3. BEAUTÉ : grille de portraits uniformes ---------- */

function BeauteLayout({ articles }: LayoutProps) {
  return (
    <ul className='grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4'>
      {articles.map((a) => (
        <li key={a.id} className='min-w-0'>
          <article className='group relative'>
            <Photo
              a={a}
              sizes='(min-width: 1280px) 24vw, (min-width: 768px) 32vw, 50vw'
              className='aspect-[3/4]'
            />
            <div className='mt-4 space-y-2'>
              <Eyebrow a={a} />
              <h2 className='font-display text-base font-bold leading-snug sm:text-lg line-clamp-3 group-hover:underline underline-offset-[5px]'>
                <TitleLink a={a} />
              </h2>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}

/* ---------- 4. VOYAGES : bandeaux cinéma puis grille ---------- */

function VoyagesLayout({ articles }: LayoutProps) {
  const feature = articles.slice(0, 3)
  const rest = articles.slice(3)
  return (
    <div className='space-y-12 md:space-y-16'>
      <div className='space-y-6 md:space-y-8'>
        {feature.map((a) => (
          <article
            key={a.id}
            className='group relative isolate overflow-hidden bg-ink text-ivory'
          >
            <Photo
              a={a}
              sizes='100vw'
              className='aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]'
            />
            <div aria-hidden className='scrim absolute inset-0' />
            <div className='absolute inset-x-0 bottom-0 space-y-3 p-5 sm:p-8 lg:p-12'>
              <Eyebrow a={a} light />
              <h2 className='max-w-3xl font-display text-h2 font-bold'>
                <TitleLink a={a} />
              </h2>
              {a.excerpt && (
                <p className='line-clamp-2 hidden max-w-2xl font-serif text-lead text-ivory/85 md:block'>
                  {a.excerpt}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {rest.length > 0 && (
        <div className='grid gap-x-8 gap-y-12 border-t pt-12 sm:grid-cols-2 lg:grid-cols-3'>
          {rest.map((a) => (
            <article key={a.id} className='group relative'>
              <Photo
                a={a}
                sizes='(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'
                className='aspect-[3/2]'
              />
              <div className='mt-4 space-y-2'>
                <Eyebrow a={a} />
                <h2 className='font-display text-h3 font-bold'>
                  <TitleLink a={a} />
                </h2>
                <Meta a={a} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- 5. SAVEURS : liste numérotée façon carte ---------- */

function SaveursLayout({ articles, startIndex = 0 }: LayoutProps) {
  return (
    <ol className='grid gap-x-16 lg:grid-cols-2'>
      {articles.map((a, i) => (
        <li
          key={a.id}
          className='border-b first:border-t lg:[&:nth-child(2)]:border-t'
        >
          <article className='group relative grid grid-cols-[2.5rem_1fr_5.5rem] items-start gap-4 py-6 sm:grid-cols-[3.5rem_1fr_7rem] sm:gap-5'>
            <span
              aria-hidden
              className='font-display text-2xl font-bold text-gold-text sm:text-3xl'
            >
              {String(startIndex + i + 1).padStart(2, '0')}
            </span>
            <div className='min-w-0 space-y-2'>
              <Eyebrow a={a} />
              <h2 className='font-display text-xl font-bold leading-snug sm:text-h3 line-clamp-3'>
                <TitleLink a={a} />
              </h2>
              {a.excerpt && (
                <p className='hidden font-serif text-base text-muted-foreground sm:line-clamp-3'>
                  {a.excerpt}
                </p>
              )}
            </div>
            <Photo a={a} sizes='112px' className='aspect-square' />
          </article>
        </li>
      ))}
    </ol>
  )
}

/* ---------- 6. ART DE VIVRE : mosaïque asymétrique répétée ---------- */

const SPANS = {
  7: 'lg:col-span-7',
  5: 'lg:col-span-5',
  4: 'lg:col-span-4',
} as const

// Motif de 5 articles : [7|5] puis [4|4|4], en alternant le côté du grand
function spanFor(i: number): 7 | 5 | 4 {
  const group = Math.floor(i / 5)
  const k = i % 5
  if (k >= 2) return 4
  return (k === 0) === (group % 2 === 0) ? 7 : 5
}

function ArtDeVivreLayout({ articles }: LayoutProps) {
  return (
    <div className='grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-12'>
      {articles.map((a, i) => {
        const span = spanFor(i)
        const big = span !== 4
        return (
          <article
            key={a.id}
            className={cn('group relative min-w-0', SPANS[span])}
          >
            <Photo
              a={a}
              sizes={
                big
                  ? '(min-width: 1024px) 55vw, 100vw'
                  : '(min-width: 1024px) 30vw, 50vw'
              }
              className={big ? 'h-64 sm:h-80 lg:h-[26rem]' : 'aspect-square'}
            />
            <div className='mt-4 space-y-2'>
              <Eyebrow a={a} />
              <h2
                className={cn(
                  'font-display font-bold leading-snug',
                  big ? 'text-h3 lg:text-h3' : 'text-lg sm:text-xl',
                )}
              >
                <TitleLink a={a} />
              </h2>
              {big && a.excerpt && (
                <p className='line-clamp-2 font-serif text-base text-muted-foreground'>
                  {a.excerpt}
                </p>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}

/* ---------- 7. PERSONNALITÉS : portraits décalés, texte superposé ---------- */

function PersonnalitesLayout({ articles, startIndex = 0 }: LayoutProps) {
  return (
    <ul className='grid grid-cols-2 items-start gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-8'>
      {articles.map((a, i) => (
        <li key={a.id} className='min-w-0 lg:even:mt-14'>
          <article className='group relative aspect-[3/4] overflow-hidden bg-ink'>
            {a.image?.src && (
              <Image
                src={a.image.src}
                alt={a.image.alt}
                fill
                sizes='(min-width: 1024px) 25vw, 50vw'
                className='cover-zoom object-cover'
              />
            )}
            <div aria-hidden className='scrim absolute inset-0' />
            <span
              aria-hidden
              className='absolute left-3 top-3 font-display text-sm text-ivory/80 sm:left-5 sm:top-5 sm:text-base'
            >
              {String(startIndex + i + 1).padStart(2, '0')}
            </span>
            <div className='absolute inset-x-0 bottom-0 space-y-2 p-3 text-ivory sm:p-5'>
              <Eyebrow a={a} light />
              <h2 className='line-clamp-4 font-display text-base font-bold leading-snug sm:text-xl lg:text-h3'>
                <TitleLink a={a} />
              </h2>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}

/* ---------- Par défaut : grille simple ---------- */

function GridLayout({ articles }: LayoutProps) {
  return (
    <div className='grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'>
      {articles.map((a) => (
        <article key={a.id} className='group relative'>
          <Photo
            a={a}
            sizes='(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'
            className='aspect-[3/2]'
          />
          <div className='mt-4 space-y-2'>
            <Eyebrow a={a} />
            <h2 className='font-display text-h3 font-bold'>
              <TitleLink a={a} />
            </h2>
            <Meta a={a} />
          </div>
        </article>
      ))}
    </div>
  )
}

/* ---------- Registre ---------- */

export const TONES = {
  default: '',
  ivory: 'bg-secondary',
  dark: 'dark bg-background text-foreground',
} as const

export type CategoryLayoutConfig = {
  Layout: ComponentType<LayoutProps>
  tone: keyof typeof TONES
  align?: 'left' | 'center'
}

// Clé = slug WordPress de la catégorie
export const CATEGORY_LAYOUTS: Record<string, CategoryLayoutConfig> = {
  culture: { Layout: CultureLayout, tone: 'default' },
  style: { Layout: StyleLayout, tone: 'default' },
  beaute: { Layout: BeauteLayout, tone: 'ivory' },
  voyages: { Layout: VoyagesLayout, tone: 'default' },
  saveurs: { Layout: SaveursLayout, tone: 'default' },
  'art-de-vivre': { Layout: ArtDeVivreLayout, tone: 'ivory' },
  personnalites: { Layout: PersonnalitesLayout, tone: 'dark', align: 'center' },
}

export const DEFAULT_LAYOUT: CategoryLayoutConfig = {
  Layout: GridLayout,
  tone: 'default',
}
