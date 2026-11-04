// components/une-simple.tsx
import Image from 'next/image'
import Link from 'next/link'

interface Article {
  id: number
  slug: string
  title: string
  image?: { src: string; alt: string }
  category?: { name: string; slug: string }
  author?: string
}

function Img({ a, ratio }: { a: Article; ratio: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-secondary rounded-lg ${ratio}`}
    >
      {a.image && (
        <Image
          src={a.image.src}
          alt={a.image.alt}
          fill
          sizes='40vw'
          className='object-cover'
        />
      )}
    </div>
  )
}

function Title({ a, className }: { a: Article; className: string }) {
  return (
    <Link
      href={`/article/${a.slug}`}
      className={`after:absolute after:inset-0 hover:underline ${className}`}
    >
      {a.title}
    </Link>
  )
}

export function UneSimple({ articles }: { articles: Article[] }) {
  const [main, ...rest] = articles
  if (!main) return null
  const middle = rest.slice(0, 2)
  const side = rest.slice(2, 7)

  return (
    <section className='container-editorial grid gap-10 py-12 lg:grid-cols-12'>
      {/* 1 grand */}
      <article className='relative lg:col-span-5'>
        <Img a={main} ratio='aspect-[3/4]' />
        <p className='kicker mt-5 text-gold-text'>{main.category?.name}</p>
        <h1 className='mt-2 font-display text-h2 font-bold'>
          <Title a={main} className='' />
        </h1>
        <p className='mt-2 text-meta text-muted-foreground'>{main.author}</p>
      </article>

      {/* 2 moyens */}
      <div className='grid grid-cols-2 gap-5 self-start lg:col-span-3 lg:grid-cols-1 lg:gap-10'>
        {middle.map((a) => (
          <article key={a.id} className='relative'>
            <Img a={a} ratio='aspect-square' />
            <p className='kicker mt-4 text-gold-text'>{a.category?.name}</p>
            <h2 className='mt-2 font-display text-lg font-bold'>
              <Title a={a} className='' />
            </h2>
          </article>
        ))}
      </div>

      {/* 5 en colonne */}
      <ul className='divide-y self-start lg:col-span-4 lg:border-l lg:pl-10'>
        {side.map((a) => (
          <li
            key={a.id}
            className='relative grid grid-cols-[2fr_1fr] gap-4 py-5 first:pt-0'
          >
            <div>
              <p className='kicker text-gold-text'>{a.category?.name}</p>
              <h2 className='mt-2 font-display text-lg font-bold'>
                <Title a={a} className='' />
              </h2>
            </div>
            <Img a={a} ratio='aspect-[3/4]' />
          </li>
        ))}
      </ul>
    </section>
  )
}
