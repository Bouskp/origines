import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const btn =
  'nav-label inline-flex items-center gap-2 border border-foreground px-4 py-3 transition-colors hover:bg-foreground hover:text-background sm:px-5'

export function Pagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string // ex. /categorie/culture
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) return null
  const href = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`)

  return (
    <nav
      aria-label='Pagination'
      className='mt-16 flex items-center justify-between gap-4 border-t pt-8'
    >
      {page > 1 ? (
        <Link href={href(page - 1)} rel='prev' className={btn}>
          <ArrowLeft className='size-4' /> Précédent
        </Link>
      ) : (
        <span aria-hidden />
      )}

      <p className='text-meta text-muted-foreground'>
        Page {page} sur {totalPages}
      </p>

      {page < totalPages ? (
        <Link href={href(page + 1)} rel='next' className={btn}>
          Suivant <ArrowRight className='size-4' />
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  )
}
