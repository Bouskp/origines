import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/libs/utils'
import { getPostsByCategory } from '@/libs/wordpress'
import { capitalizeFirst, decodeEntities, stripHtml } from '@/libs/Articles'

interface Article {
  id: number
  slug: string
  title: string
  image?: { src: string; alt: string }
  category?: { name: string; slug: string }
  author?: string
}

export async function CategoryFour({
  slug = 'style',
  title = 'Style',
  exclude = [],
  ivory = false,
}: {
  slug?: string // slug de la catégorie WordPress
  title?: string
  exclude?: number[] // ids déjà affichés ailleurs sur la page
  ivory?: boolean // fond ivoire pour rythmer la page
}) {
  const posts = await getPostsByCategory(3)
  console.log(posts)
  const articles = posts.slice(0, 4).map((post) => ({
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

  return (
    <section
      aria-labelledby={`cat-${slug}`}
      className={cn(ivory && 'bg-secondary')}
    >
      <div className='container-editorial section-gap'>
        {/* Titre cliquable vers la rubrique */}
        <header className='mb-8 flex items-end justify-between border-b pb-4'>
          <h2 id={`cat-${slug}`} className='font-display text-h2 font-bold'>
            <Link href={`/categorie/${slug}`} className='hover:text-gold-text'>
              {title}
            </Link>
          </h2>
          <Link
            href={`/categorie/${slug}`}
            className='nav-label inline-flex items-center gap-2 hover:text-gold-text'
          >
            Tout voir <ArrowRight className='size-4' />
          </Link>
        </header>

        {/* 4 colonnes : 2 sur tablette, 1 sur mobile */}
        <div className='grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4'>
          {articles.map((a) => (
            <article key={a.id} className='group relative'>
              <div className='relative aspect-[4/5] overflow-hidden bg-secondary'>
                {a.image && (
                  <Image
                    src={a.image.src}
                    alt={a.image.alt}
                    fill
                    sizes='(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
                    className='cover-zoom object-cover'
                  />
                )}
              </div>

              <h3 className='mt-5 font-display text-h3 font-bold'>
                <Link
                  href={`/article/${a.slug}`}
                  className='decoration-gold decoration-1 underline-offset-[6px] after:absolute after:inset-0 group-hover:underline'
                >
                  {capitalizeFirst(a.title)}
                </Link>
              </h3>

              {a.excerpt && (
                <p className='mt-3 line-clamp-3 font-serif text-base text-muted-foreground'>
                  {a.excerpt}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
