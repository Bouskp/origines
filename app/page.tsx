import { CategorySection } from '@/components/saveurs-section'
import { RecentArticles } from '@/components/recents-articles'
import { getRecentPosts } from '@/libs/wordpress'
import { CategoryFour } from '@/components/style-section'
import { CategoryRail } from '@/components/category-rail'
import { CategoryMosaic } from '@/components/category-mosaic'
import { CategoryPortraits } from '@/components/category-portrait'

export default async function home() {
  const posts = await getRecentPosts()

  const formatPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    date: post.date,
    _embedded: {
      author: [{ name: post._embedded?.author?.[0]?.name || '' }],
      'wp:featuredmedia': [
        {
          source_url:
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
          alt_text: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
        },
      ],
      'wp:term': [
        [
          {
            name: post._embedded?.['wp:term']?.[0]?.[0]?.name || '',
            slug: post._embedded?.['wp:term']?.[0]?.[0]?.slug || '',
          },
        ],
      ],
    },
  }))

  return (
    <div>
      <RecentArticles
        initialArticles={formatPosts}
        kicker='articles récents'
        total={1}
      />
      {/* Section Culture */}
      <CategorySection slug='saveurs' title='Saveurs' />
      <CategoryFour slug='style' title='Style' ivory={true} />
      <CategoryRail slug='beaute' title='Beauté' />
      <CategoryMosaic
        categoryId={7}
        slug='art-de-vivre'
        title='Art de vivre'
        kicker='Maison & élégance'
      />
      <CategoryPortraits
        categoryId={8}
        slug='personnalites'
        title='Personnalités'
      />
    </div>
  )
}
