import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/libs/utils'
import { capitalizeFirst, decodeEntities, stripHtml } from '@/libs/Articles'
import { getPostsByCategory } from '@/libs/wordpress'

// Colonne de gauche : 1 grand article + BELOW articles dessous.
// Colonne de droite : le reste (COUNT - 1 - BELOW articles).
const BELOW = 2
const COUNT = 9 // 1 grand + 2 dessous + 6 en colonne

interface Article {
  id: number
  slug: string
  title: string
  image?: { src: string; alt: string }
  category?: { name: string; slug: string }
  author?: string
}

function Photo({
  article,
  ratio,
  sizes,
  className,
}: {
  article: Article
  ratio: string
  sizes: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-secondary',
        ratio,
        className,
      )}
    >
      {/* src vide = erreur next/image : on teste la valeur, pas l'objet */}
      {article.image?.src && (
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes={sizes}
          className='cover-zoom object-cover'
        />
      )}
    </div>
  )
}

function TitleLink({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className='decoration-gold decoration-1 underline-offset-[6px] after:absolute after:inset-0 group-hover:underline'
    >
      {capitalizeFirst(article.title)}
    </Link>
  )
}

export async function CategorySection({
  slug = 'culture',
  title = 'Culture',
  exclude = [],
}: {
  slug?: string // slug de la catégorie WordPress
  title?: string
  exclude?: number[] // ids déjà affichés ailleurs sur la page
}) {
  // ⚠ Doit renvoyer au moins COUNT articles (per_page ≥ 9) pour tout remplir
  const posts = await getPostsByCategory(6)

  const articles = posts
    .filter((post) => !exclude.includes(post.id)) // d'abord exclure…
    .slice(0, COUNT) // …ensuite limiter
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

  const [lead, ...rest] = articles
  if (!lead) return null
  const below = rest.slice(0, BELOW)
  const side = rest.slice(BELOW)

  return (
    <section
      aria-labelledby={`cat-${slug}`}
      className='container-editorial section-gap'
    >
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

      <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14'>
        {/* Colonne de gauche : grand article + articles dessous */}
        <div className='min-w-0 space-y-10 lg:col-span-7'>
          <article className='group relative'>
            <Photo
              article={lead}
              ratio='aspect-[4/3]'
              sizes='(min-width: 1024px) 55vw, 100vw'
            />
            <div className='mt-6 space-y-3'>
              <h3 className='font-display text-h3 font-bold'>
                <TitleLink article={lead} />
              </h3>
              {lead.excerpt && (
                <p className='line-clamp-3 font-serif text-lead text-muted-foreground'>
                  {lead.excerpt}
                </p>
              )}
            </div>
          </article>

          {/* Articles sous le principal : 2 côte à côte, filet de séparation */}
          {below.length > 0 && (
            <div className='grid grid-cols-2 gap-4 border-t pt-10 sm:gap-8'>
              {below.map((a) => (
                <article key={a.id} className='group relative min-w-0'>
                  <Photo
                    article={a}
                    ratio='aspect-[4/3]'
                    sizes='(min-width: 1024px) 27vw, 50vw'
                  />
                  <h3 className='mt-4 line-clamp-3 font-display text-lg font-bold leading-snug sm:text-xl'>
                    <TitleLink article={a} />
                  </h3>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Colonne de droite : s'étire à la hauteur de la colonne de gauche,
            chaque ligne prend une part égale (flex-1) */}
        {side.length > 0 && (
          <ul className='flex min-w-0 flex-col divide-y lg:col-span-5'>
            {side.map((a) => (
              <li key={a.id} className='flex flex-1 items-center'>
                <article className='group relative grid w-full grid-cols-[7.5rem_1fr] items-center gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-5 lg:grid-cols-[9rem_1fr] xl:grid-cols-[11rem_1fr]'>
                  <Photo
                    article={a}
                    ratio='aspect-[4/3]'
                    sizes='(min-width: 1280px) 176px, (min-width: 640px) 160px, 120px'
                  />
                  <div className='min-w-0'>
                    <h3 className='line-clamp-3 font-display text-lg font-bold leading-snug sm:text-xl'>
                      <TitleLink article={a} />
                    </h3>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
