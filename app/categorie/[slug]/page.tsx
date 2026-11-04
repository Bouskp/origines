import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { categories, cn } from '@/libs/utils'
import {
  calculateReadingTime,
  capitalizeFirst,
  categoryColor,
  decodeEntities,
  stripHtml,
} from '@/libs/Articles'
import {
  CATEGORY_LAYOUTS,
  DEFAULT_LAYOUT,
  TONES,
} from '@/components/category-layouts'
import { Pagination } from '@/components/pagination'
import {
  getCategoryBySlug,
  getPostsByCategoryPaginated,
} from '@/libs/wordpress'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: category.name,
    description:
      category.description ||
      `Tous les articles de la rubrique ${category.name}.`,
  }
}

const PER_PAGE = 20

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: rawPage } = await searchParams
  const page = Math.max(1, Math.floor(Number(rawPage)) || 1)
  const flatCategories = categories.flatMap((c) => [c, ...(c.children || [])])
  const category = flatCategories.find((c) => c.slug === slug)
  if (!category) notFound()

  const { data: posts, headers } = await getPostsByCategoryPaginated(
    category.id,
    page,
    PER_PAGE,
  )

  const { Layout, tone, align } = CATEGORY_LAYOUTS[slug] ?? DEFAULT_LAYOUT
  const centered = align === 'center'

  const articles = posts.map((post) => ({
    id: post.id ?? 0,
    slug: post.slug,

    title: capitalizeFirst(decodeEntities(post.title.rendered)),
    excerpt: stripHtml(post.excerpt.rendered),
    date: post.date,
    contentHtml: stripHtml(post.content.rendered),
    readingMinutes: calculateReadingTime(post.content.rendered),
    image: {
      src: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      alt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
      caption:
        post._embedded?.['wp:featuredmedia']?.[0]?.caption?.rendered || '',
    },
    category: {
      id: post._embedded?.['wp:term']?.[0]?.[0]?.id ?? 0,
      name: decodeEntities(post._embedded?.['wp:term']?.[0]?.[0]?.name || ''),
      slug: post._embedded?.['wp:term']?.[0]?.[0]?.slug || '',
    },
    tags:
      post._embedded?.['wp:term']?.[1]?.map((t) => ({
        id: t.id,
        name: stripHtml(t.name),
        slug: t.slug,
      })) || [],

    author: post._embedded?.author?.[0]
      ? {
          id: post._embedded.author[0].id,
          name: decodeEntities(post._embedded.author[0].name),
          slug: post._embedded.author[0].slug,
        }
      : undefined,
  }))

  return (
    <>
      <div className={TONES[tone]}>
        <div className='container-editorial section-gap'>
          {/* En-tête de rubrique */}
          <header
            className={cn(
              'mb-12 space-y-4 md:mb-16',
              centered && 'mx-auto max-w-2xl text-center',
            )}
          >
            <p className={cn('kicker', categoryColor(slug))}>
              Rubrique · {headers.total}{' '}
              {headers.total > 1 ? 'articles' : 'article'}
            </p>
            <h1 className='font-display text-h1 font-bold md:text-display'>
              {category.name}
            </h1>
            <div className={cn('rule-gold', centered && 'mx-auto')} />
          </header>

          {articles.length > 0 ? (
            <Layout articles={articles} startIndex={(page - 1) * PER_PAGE} />
          ) : (
            <p className='py-20 text-center font-serif text-lead text-muted-foreground'>
              Aucun article pour le moment.
            </p>
          )}

          <Pagination
            basePath={`/categorie/${slug}`}
            page={page}
            totalPages={headers.totalPages}
          />
        </div>
      </div>
    </>
  )
}
