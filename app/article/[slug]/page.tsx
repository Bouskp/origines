import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cn } from '@/libs/utils'
import {
  calculateReadingTime,
  capitalizeFirst,
  categoryColor,
  decodeEntities,
  formatDate,
  stripHtml,
  verifierExtraitInclus,
} from '@/libs/Articles'
import { ArticleCard } from '@/components/article-card'
import { getPostBySlug, getPostsByCategory } from '@/libs/wordpress'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getPostBySlug(slug)
  const imageUrl = article?._embedded?.['wp:featuredmedia']?.[0]?.source_url
  if (!article) return {}

  return {
    title: stripHtml(article.title.rendered),
    description: stripHtml(article.excerpt.rendered),
    openGraph: {
      title: stripHtml(article.title.rendered),
      description: stripHtml(article.excerpt.rendered),
      type: 'article',
      publishedTime: article.date,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function page({ params }: Props) {
  const { slug } = await params
  const article = await getPostBySlug(slug)
  const categoryId = article?._embedded?.['wp:term']?.[0]?.[0]?.id

  if (!article) notFound()

  // Ligne d'infos : auteur · date · temps de lecture
  const meta = [
    <time key='d' dateTime={article.date}>
      {formatDate(article.date)}
    </time>,
    `${calculateReadingTime(article.content.rendered)} min de lecture`,
  ].filter(Boolean)

  const url = encodeURIComponent(`${SITE}/article/${article.slug}`)
  const text = encodeURIComponent(article.title.rendered)
  const share = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${text}%20${url}` },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    },
  ]

  let relateds = categoryId ? await getPostsByCategory(categoryId) : []
  relateds = relateds.filter((post) => post.id !== article.id)

  const fullArticle = {
    id: article.id,
    slug: article.slug,
    title: capitalizeFirst(stripHtml(article.title.rendered)),
    excerpt: verifierExtraitInclus(article)
      ? ''
      : stripHtml(article.excerpt.rendered),
    date: article.date,

    contentHtml: article.content.rendered,
    readingMinutes: calculateReadingTime(article.content.rendered),
    image: article._embedded?.['wp:featuredmedia']?.[0]
      ? {
          src: article._embedded['wp:featuredmedia'][0].source_url,
          alt: article._embedded['wp:featuredmedia'][0].alt_text,
          caption: stripHtml(
            article._embedded['wp:featuredmedia'][0].caption?.rendered || '',
          ),
        }
      : {},
    category: article._embedded?.['wp:term']?.[0]?.[0]
      ? {
          id: article._embedded['wp:term'][0][0].id,
          name: decodeEntities(article._embedded['wp:term'][0][0].name),
          slug: article._embedded['wp:term'][0][0].slug,
        }
      : {},
    tags:
      article._embedded?.['wp:term']?.[1]?.map((t) => ({
        id: t.id,
        name: stripHtml(t.name),
        slug: t.slug,
      })) || [],
  }

  return (
    <>
      <article>
        {/* En-tête centré */}
        <header className='container-editorial pb-10 pt-12 text-center md:pb-14 md:pt-20'>
          {fullArticle.category && (
            <Link
              href={`/categorie/${fullArticle.category.slug}`}
              className={cn(
                'kicker hover:underline',
                categoryColor(fullArticle.category.slug),
              )}
            >
              {fullArticle.category.name}
            </Link>
          )}
          <h1 className='mx-auto mt-5 max-w-4xl font-display text-h1 font-bold'>
            {fullArticle.title}
          </h1>
          {fullArticle.excerpt && (
            <p className='mx-auto mt-6 max-w-2xl font-serif text-lead italic text-muted-foreground'>
              {fullArticle.excerpt}
            </p>
          )}
          <p className='mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-meta text-muted-foreground'>
            {meta.map((m, i) => (
              <span key={i} className='inline-flex items-center gap-3'>
                {i > 0 && <span aria-hidden>·</span>}
                <span>{m}</span>
              </span>
            ))}
          </p>
        </header>

        {/* Image principale pleine largeur */}
        {fullArticle.image && (
          <figure className='container-editorial'>
            <div className='relative aspect-[4/3] overflow-hidden bg-secondary sm:aspect-[16/9]'>
              <Image
                src={fullArticle.image.src ?? ''}
                alt={fullArticle.image.alt ?? ''}
                fill
                priority
                sizes='100vw'
                className='object-cover'
              />
            </div>
            {fullArticle.image.caption && (
              <figcaption className='mt-3 text-meta text-muted-foreground'>
                {fullArticle.image.caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Corps de l'article : colonne de lecture étroite */}
        <div className='container-text py-12 md:py-16'>
          {/* Contenu WordPress de confiance (rédaction). Si des contributeurs
             externes publient, passe-le par isomorphic-dompurify. */}
          <div
            className='prose prose-origines dropcap prose-img:h-auto prose-img:w-full'
            dangerouslySetInnerHTML={{ __html: fullArticle.contentHtml }}
          />

          <footer className='mt-14 space-y-8 border-t pt-8'>
            {/* {fullArticle.tags.length > 0 && (
             <ul className='flex flex-wrap gap-2'>
               {article.tags.map((t) => (
                 <li key={t.id}>
                   <Link
                     href={`/tag/${t.slug}`}
                     className='nav-label inline-block border px-3 py-2 transition-colors hover:bg-foreground hover:text-background'
                   >
                     {t.name}
                   </Link>
                 </li>
               ))}
             </ul>
           )} */}

            <div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
              <span className='kicker text-gold-text'>Partager</span>
              {share.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='nav-label transition-colors hover:text-gold-text'
                >
                  {s.label}
                </a>
              ))}
            </div>
          </footer>
        </div>
      </article>

      {/* Articles liés */}
      {relateds.length > 0 && (
        <section aria-labelledby='related' className='bg-secondary'>
          <div className='container-editorial section-gap'>
            <h2
              id='related'
              className='mb-10 border-b pb-4 font-display text-h2 font-bold'
            >
              À lire aussi
            </h2>
            <div className='grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'>
              {relateds.map((a) => (
                <ArticleCard key={a.id} article={a} variant='grid' />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
