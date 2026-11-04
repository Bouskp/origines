import { Playfair_Display, EB_Garamond, Jost } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { categories } from '@/libs/utils'
import { Footer } from '@/components/footer'

// Titres, masthead, citations
export const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

// Corps des articles (déjà utilisée dans le brief)
export const serif = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
  style: ['normal', 'italic'],
  display: 'swap',
})

// Interface, navigation, étiquettes, métadonnées
export const sans = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const links = categories.map((c) => ({
  label: c.name,
  href: `/categorie/${c.slug}`,
  children: c.children?.map((s) => ({
    label: s.name,
    href: `/categorie/${s.slug}`,
  })),
}))

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='fr' className={`${display.variable} h-full antialiased`}>
      <body>
        <Navbar links={links} siteName='Origines' />
        {children}
        <Footer />
      </body>
    </html>
  )
}
