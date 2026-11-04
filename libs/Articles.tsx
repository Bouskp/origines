export type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  _embedded?: {
    author?: { name: string }[]
    'wp:featuredmedia'?: { source_url: string; alt_text: string }[]
    'wp:term'?: { name: string; slug: string }[][]
  }
}

const NAMED: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  ndash: '–',
  mdash: '—',
  laquo: '«',
  raquo: '»',
}

export function decodeEntities(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCodePoint(parseInt(n, 16)),
    )
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m)
}

export function stripHtml(html: string | undefined) {
  if (!html) return ''
  return decodeEntities(
    html.replace(/\s*\[&hellip;\]/g, '…').replace(/<[^>]*>/g, ''),
  )
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

// Classes statiques (Tailwind doit les voir en entier). Clé = slug WordPress.
const CATEGORY_COLORS: Record<string, string> = {
  culture: 'text-sec-culture',
  style: 'text-sec-style',
  beaute: 'text-sec-beaute',
  voyages: 'text-sec-voyages',
  saveurs: 'text-sec-saveurs',
  'art-de-vivre': 'text-sec-art-de-vivre',
  personnalites: 'text-sec-personnalites',
  'le-guide': 'text-sec-guide',
}

export function categoryColor(slug?: string) {
  const c = slug ? CATEGORY_COLORS[slug] : undefined
  // En mode sombre, les teintes foncées perdent leur contraste : retour à l'or.
  return `${c ?? 'text-gold-text'} dark:text-gold-text`
}

export function capitalizeFirst(str: string) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function calculateReadingTime(htmlContent: string): number {
  if (!htmlContent) return 1
  // Supprime les balises HTML pour ne garder que le texte brut
  const text = htmlContent.replace(/<\/?[^>]+(>|$)/g, '')
  // Compte le nombre de mots
  const wordsCount = text.trim().split(/\s+/).length
  // Base moyenne de lecture : 200 mots par minute
  const minutes = Math.ceil(wordsCount / 200)
  return minutes > 0 ? minutes : 1
}

/**
 * Vérifie si le contenu d'un article inclut son extrait de manière sécurisée.
 * @param {Object} article - L'objet article contenant le contenu et l'extrait.
 * @returns {boolean} - true si l'extrait est inclus dans le contenu, false sinon.
 */
export function verifierExtraitInclus(article: WPPost): boolean {
  // 1. Récupération et nettoyage de base du HTML
  const contenu = stripHtml(article?.content?.rendered || '').trim()
  let extrait = stripHtml(article?.excerpt?.rendered || '').trim()

  // 2. Sécurité : Si l'un des deux est vide, on s'arrête
  if (!contenu || !extrait) return false

  // 3. Nettoyage de la troncature à la fin de l'extrait (points de suspension, espaces, crochets)
  // Cible : "…", "...", "[...]", et les espaces de fin
  extrait = extrait.replace(/(…|\.\.\.|\[\.\.\.\]|\s+)+$/, '').trim()

  // 4. Sécurité : Si l'extrait nettoyé est devenu vide, on ne valide pas
  if (extrait === '') return false

  // 5. Comparaison insensible à la casse pour plus de souplesse
  return contenu.toLowerCase().includes(extrait.toLowerCase())
}
