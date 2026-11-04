import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

type FooterLink = { label: string; href: string; external?: boolean }

// Cinq colonnes du brief : « une architecture institutionnelle discrète ».
// Les routes sont à adapter à ton projet ; les URLs externes (⚠) sont des
// placeholders à remplacer.
const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Origines',
    links: [
      { label: 'Culture', href: '/categorie/culture' },
      { label: 'Style', href: '/categorie/style' },
      { label: 'Beauté', href: '/categorie/beaute' },
      { label: 'Voyages', href: '/categorie/voyages' },
      { label: 'Saveurs', href: '/categorie/saveurs' },
      { label: 'Art de vivre', href: '/categorie/art-de-vivre' },
      { label: 'Personnalités', href: '/categorie/personnalites' },
      { label: 'Le Guide', href: '/guide' },
      { label: 'Vidéos', href: '/videos' },
    ],
  },
  {
    title: 'À propos',
    links: [
      { label: 'À propos d’Origines', href: '/a-propos' },
      { label: 'La rédaction', href: '/redaction' },
      { label: 'Contributeurs', href: '/contributeurs' },
      { label: 'Nous contacter', href: '/contact' },
      { label: 'Travailler avec nous', href: '/carrieres' },
    ],
  },
  {
    title: 'Professionnels',
    links: [
      { label: 'Publicité', href: '/professionnels/publicite' },
      { label: 'Partenariats', href: '/professionnels/partenariats' },
      { label: 'Brand Content', href: '/professionnels/brand-content' },
      {
        label: 'Hospitality & Tourism',
        href: '/professionnels/hospitality-tourism',
      },
      { label: 'Luxury & Fashion', href: '/professionnels/luxury-fashion' },
    ],
  },
  {
    title: 'Mian Media',
    links: [
      { label: 'Mian Media', href: 'https://mianmedia.com', external: true },
      { label: 'Hamaniè', href: 'https://hamanie.news', external: true },
      {
        label: 'Mian Magazine',
        href: 'https://mianmedia.com/magazines.html',
        external: true,
      },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { label: 'Newsletter', href: '/newsletter' },
      { label: 'Instagram', href: 'https://instagram.com', external: true }, // ⚠
      { label: 'YouTube', href: 'https://youtube.com', external: true },
      { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
    ],
  },
]

const linkClass =
  'inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'

export function Footer() {
  return (
    // « dark » réutilise les tokens du mode sombre : le footer reste sombre
    // même quand le reste du site est clair.
    <footer className='dark mt-[var(--section-gap)] border-t bg-background text-foreground'>
      <div className='container-editorial pb-[max(2rem,env(safe-area-inset-bottom))] pt-14 md:pt-20'>
        {/* Signature + newsletter */}
        <div className='flex flex-col gap-8 pb-12 md:flex-row md:items-end md:justify-between md:pb-16'>
          <div className='max-w-md space-y-4'>
            <Link href='/' className='masthead block text-3xl md:text-4xl'>
              Origines
            </Link>
            <p className='font-serif text-lead text-muted-foreground'>
              Le site panafricain des cultures, du style et de l’art de vivre.
            </p>
          </div>
          <Link
            href='/newsletter'
            className='nav-label inline-flex items-center justify-center gap-3 border border-foreground px-6 py-4 transition-colors hover:bg-foreground hover:text-background'
          >
            La Lettre d’Origines <ArrowRight className='size-4' />
          </Link>
        </div>

        {/* Cinq colonnes */}
        <nav
          aria-label='Pied de page'
          className='grid grid-cols-2 gap-x-6 gap-y-10 border-t pt-10 sm:grid-cols-3 lg:grid-cols-5'
        >
          {COLUMNS.map((col) => (
            <div key={col.title} className='min-w-0'>
              <h2 className='kicker mb-5 text-gold-text'>{col.title}</h2>
              <ul className='space-y-3'>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={linkClass}
                      >
                        {l.label}
                        <ArrowUpRight className='size-3.5' aria-hidden />
                      </a>
                    ) : (
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Barre du bas */}
        <div className='mt-14 flex flex-col gap-2 border-t pt-6 text-meta text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
          <p>© {new Date().getFullYear()} Origines. Un média Mian Media.</p>
          <p>Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
