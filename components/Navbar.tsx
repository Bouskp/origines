'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronDown, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/libs/utils'

export type NavLink = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export function Navbar({
  links,
  siteName = 'Mon Magazine',
}: {
  links: NavLink[]
  siteName?: string
}) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false) // panneau mobile
  const [openMobile, setOpenMobile] = useState<string | null>(null) // accordéon mobile
  const [openDesktop, setOpenDesktop] = useState<string | null>(null) // menu déroulant desktop

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 87)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // La navbar vit dans le layout : elle n'est pas recréée à la navigation.
  // On ferme donc tout quand le chemin change. On compare pendant le rendu
  // (pattern recommandé par React) plutôt que dans un useEffect, ce qui évite
  // un rendu supplémentaire et l'erreur « set-state-in-effect ».
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setSheetOpen(false)
    setOpenMobile(null)
    setOpenDesktop(null)
  }

  // Ferme le menu déroulant et retire le focus du lien cliqué
  // (sinon il resterait ouvert via le focus ou le survol).
  const closeDesktop = () => {
    setOpenDesktop(null)
    ;(document.activeElement as HTMLElement | null)?.blur()
  }

  return (
    <header className='sticky top-0 z-50 border-b bg-background'>
      {/* Ligne principale */}
      <div
        className={cn(
          'container mx-auto grid grid-cols-3 items-center px-4 transition-all duration-300',
          scrolled ? 'h-14' : 'h-16 md:h-24',
        )}
      >
        {/* Gauche : burger */}
        <div className='flex items-center gap-1'>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' aria-label='Ouvrir le menu'>
                <Menu className='size-5' />
              </Button>
            </SheetTrigger>
            <SheetContent
              side='left'
              className='w-full overflow-y-auto sm:max-w-md'
            >
              <SheetHeader>
                <SheetTitle className='font-[family-name:var(--font-masthead)] text-2xl font-black uppercase'>
                  {siteName}
                </SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col px-4 pb-8'>
                {links.map((l) => {
                  const hasChildren = !!l.children?.length
                  const isOpen = openMobile === l.href
                  return (
                    <div key={l.href} className='border-b'>
                      <div className='flex items-center justify-between'>
                        <SheetClose asChild>
                          <Link
                            href={l.href}
                            className='flex-1 py-4 font-[family-name:var(--font-masthead)] text-2xl font-bold transition-colors hover:text-muted-foreground'
                          >
                            {l.label}
                          </Link>
                        </SheetClose>
                        {hasChildren && (
                          <button
                            type='button'
                            aria-label={`Afficher les sous-catégories de ${l.label}`}
                            aria-expanded={isOpen}
                            onClick={() =>
                              setOpenMobile(isOpen ? null : l.href)
                            }
                            className='p-3'
                          >
                            <ChevronDown
                              className={cn(
                                'size-5 transition-transform duration-300',
                                isOpen && 'rotate-180',
                              )}
                            />
                          </button>
                        )}
                      </div>
                      {hasChildren && isOpen && (
                        <ul className='mb-4 flex flex-col gap-1 border-l pl-4'>
                          {l.children!.map((c) => (
                            <li key={c.href}>
                              <SheetClose asChild>
                                <Link
                                  href={c.href}
                                  className='block py-2 text-base text-muted-foreground transition-colors hover:text-foreground'
                                >
                                  {c.label}
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
                <div className='mt-6 flex flex-col gap-3'>
                  <Button
                    asChild
                    className='rounded-none uppercase tracking-widest'
                  >
                    <SheetClose asChild>
                      <Link href='/subscribe'>S&apos;abonner</Link>
                    </SheetClose>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Centre : masthead */}
        <Link
          href='/'
          className={cn(
            'text-center font-[family-name:var(--font-masthead)] font-black uppercase leading-none tracking-tight transition-all duration-300',
            scrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-5xl',
          )}
        >
          {siteName}
        </Link>

        {/* Droite : actions */}
        <div className='flex items-center justify-end gap-3'>
          <Button
            asChild
            size='sm'
            className='hidden rounded-none text-xs uppercase tracking-widest md:inline-flex'
          >
            <Link href='/subscribe'>S&apos;abonner</Link>
          </Button>
        </div>
      </div>

      {/* Ligne catégories (desktop), masquée au scroll.
          overflow-visible quand elle est affichée, sinon le menu déroulant serait coupé. */}
      <nav
        aria-label='Catégories'
        className={cn(
          'hidden border-t transition-all duration-300 md:block',
          scrolled
            ? 'max-h-0 overflow-hidden border-t-0 opacity-0'
            : 'max-h-12 overflow-visible opacity-100',
        )}
      >
        <ul className='container mx-auto flex items-center justify-center gap-8 px-4'>
          {links.map((l) => {
            const hasChildren = !!l.children?.length
            const isOpen = openDesktop === l.href
            return (
              <li
                key={l.href}
                className='relative'
                onMouseEnter={() => hasChildren && setOpenDesktop(l.href)}
                onMouseLeave={() => setOpenDesktop(null)}
                onFocus={() => hasChildren && setOpenDesktop(l.href)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null))
                    setOpenDesktop(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpenDesktop(null)
                }}
              >
                <Link
                  href={l.href}
                  onClick={closeDesktop}
                  aria-haspopup={hasChildren || undefined}
                  aria-expanded={hasChildren ? isOpen : undefined}
                  className='flex items-center gap-1 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-muted-foreground'
                >
                  {l.label}
                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        'size-3 transition-transform duration-200',
                        isOpen && 'rotate-180',
                      )}
                    />
                  )}
                </Link>

                {hasChildren && (
                  <div
                    className={cn(
                      'absolute left-1/2 top-full z-50 min-w-56 -translate-x-1/2 border bg-background py-2 shadow-lg transition-all duration-200',
                      isOpen
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible translate-y-1 opacity-0',
                    )}
                  >
                    <ul>
                      {l.children!.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={closeDesktop}
                            className='block px-5 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground'
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
