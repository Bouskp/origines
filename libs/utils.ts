export { cn } from 'cn'

export const categories: {
  id: number
  name: string
  slug: string
  children?: { id: number; name: string; slug: string }[]
}[] = [
  {
    id: 2,
    name: 'Culture',
    slug: 'culture',
    children: [
      { id: 11, name: 'Arts', slug: 'arts' },
      { id: 18, name: 'Architecture', slug: 'culture-architecture' },
      { id: 15, name: 'Cinéma', slug: 'cinema' },
      { id: 12, name: 'Histoire & mémoire', slug: 'histoire-memoire' },
      { id: 147, name: 'Langues & récits', slug: 'langues-recits' },
      { id: 14, name: 'Littérature', slug: 'litterature' },
      { id: 19, name: 'Musées & expositions', slug: 'musees-expositions' },
      { id: 16, name: 'Musique', slug: 'musique' },
      { id: 13, name: 'Patrimoine', slug: 'patrimoine' },
      { id: 17, name: 'Photographie', slug: 'photographie' },
    ],
  },
  {
    id: 3,
    name: 'Style',
    slug: 'style',
    children: [
      { id: 25, name: 'Accessoires', slug: 'accessoires' },
      { id: 149, name: 'Business de la mode', slug: 'business-mode' },
      { id: 23, name: 'Collections', slug: 'collections' },
      { id: 21, name: 'Créateurs', slug: 'createurs' },
      { id: 24, name: 'Fashion Weeks', slug: 'fashion-weeks' },
      { id: 26, name: 'Joaillerie & montres', slug: 'joaillerie-montres' },
      { id: 22, name: 'Maisons & marques', slug: 'maisons-marques' },
      { id: 20, name: 'Mode', slug: 'mode' },
      { id: 27, name: 'Savoir-faire', slug: 'savoir-faire' },
      { id: 148, name: 'Street style', slug: 'street-style' },
    ],
  },
  {
    id: 4,
    name: 'Beauté',
    slug: 'beaute',
    children: [
      { id: 151, name: 'Beauté africaine', slug: 'beaute-africaine' },
      { id: 33, name: 'Bien-être', slug: 'beaute-bien-etre' },
      { id: 30, name: 'Cheveux', slug: 'cheveux' },
      { id: 29, name: 'Corps', slug: 'corps' },
      { id: 150, name: 'Grooming', slug: 'grooming' },
      { id: 32, name: 'Maquillage', slug: 'maquillage' },
      { id: 31, name: 'Parfums', slug: 'parfums' },
      { id: 28, name: 'Visage', slug: 'visage' },
    ],
  },
  {
    id: 5,
    name: 'Voyages',
    slug: 'voyages',
    children: [
      { id: 156, name: 'Carnets de voyage', slug: 'carnets-de-voyage' },
      { id: 152, name: 'Destinations', slug: 'destinations' },
      { id: 154, name: 'Escapades', slug: 'escapades' },
      { id: 157, name: 'Expériences', slug: 'experiences' },
      { id: 153, name: 'Hôtels', slug: 'hotels' },
      { id: 155, name: 'Villes', slug: 'villes' },
    ],
  },
  {
    id: 6,
    name: 'Saveurs',
    slug: 'saveurs',
    children: [
      { id: 162, name: 'Boissons', slug: 'boissons' },
      { id: 159, name: 'Chefs', slug: 'chefs' },
      { id: 163, name: 'Histoires culinaires', slug: 'histoires-culinaires' },
      { id: 161, name: 'Produits & terroirs', slug: 'produits-terroirs' },
      { id: 158, name: 'Restaurants', slug: 'restaurants' },
      { id: 160, name: 'Tables', slug: 'tables' },
    ],
  },
  {
    id: 7,
    name: 'Art de vivre',
    slug: 'art-de-vivre',
    children: [
      { id: 166, name: 'Automobile', slug: 'automobile' },
      { id: 168, name: 'Célébrations', slug: 'celebrations' },
      { id: 167, name: 'Hospitalité', slug: 'hospitalite' },
      { id: 164, name: 'Intérieurs', slug: 'interieurs' },
      { id: 169, name: 'Jardins & nature', slug: 'jardins-nature' },
      { id: 170, name: 'Maison', slug: 'maison' },
      { id: 165, name: 'Objets', slug: 'objets' },
    ],
  },
  {
    id: 8,
    name: 'Personnalités',
    slug: 'personnalites',
    // children: [
    //   { id: 175, name: 'At Home', slug: 'at-home' },
    //   { id: 174, name: 'Conversations', slug: 'conversations' },
    //   { id: 171, name: 'Cover Stories', slug: 'cover-stories' },
    //   { id: 172, name: 'Icons', slug: 'icons' },
    //   { id: 173, name: 'Nouvelle génération', slug: 'nouvelle-generation' },
    // ],
  },
  // {
  //   id: 9,
  //   name: 'Le Guide',
  //   slug: 'le-guide',
  //   children: [
  //     { id: 180, name: 'Où acheter', slug: 'shopping' },
  //     { id: 178, name: 'Où boire', slug: 'boire' },
  //     { id: 176, name: 'Où dormir', slug: 'dormir' },
  //     { id: 177, name: 'Où manger', slug: 'manger' },
  //     { id: 182, name: 'Où se détendre', slug: 'detente' },
  //     { id: 179, name: 'Où sortir', slug: 'sortir' },
  //     { id: 181, name: "Où voir de l'art", slug: 'art-culture' },
  //   ],
  // },
  // {
  //   id: 10,
  //   name: 'Vidéos',
  //   slug: 'videos',
  //   children: [
  //     { id: 184, name: 'At Home (vidéo)', slug: 'videos-at-home' },
  //     { id: 183, name: 'Cover Story (vidéo)', slug: 'videos-cover-story' },
  //     { id: 187, name: 'Escape', slug: 'escape' },
  //     { id: 185, name: 'Inside', slug: 'inside' },
  //     { id: 186, name: 'La Table', slug: 'videos-la-table' },
  //     { id: 188, name: 'The Makers', slug: 'the-makers' },
  //   ],
  // },
]
