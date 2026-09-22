import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'nrv-tee-01',
    name: 'Heavyweight Boxy Drop-Shoulder Tee',
    tagline: '280 GSM Compact Interlock Cotton',
    slug: 'heavyweight-boxy-drop-shoulder-tee',
    price: 2499,
    originalPrice: 2999,
    category: 't-shirts',
    categoryLabel: 'T-Shirts',
    colors: [
      { name: 'Onyx Black', hex: '#0B0B0B' },
      { name: 'Soft Ivory', hex: '#FAF9F6' },
      { name: 'Stone Grey', hex: '#8A8780' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Constructed from custom-milled 280 GSM interlock combed cotton. Designed with an exaggerated boxy drape, reinforced ribbed collar, and minimal clean lines that hold their architectural silhouette after countless washes.',
    details: [
      '280 GSM 100% Combed Compact Cotton',
      'Pre-shrunk enzyme wash for zero shrinkage',
      'Exaggerated drop shoulder & wide sleeve opening',
      'Blind-stitched hems with subtle gold neck piping',
      'Crafted in limited batch runs'
    ],
    fabric: '100% High-Grade Compact Cotton',
    gsm: '280 GSM',
    fit: 'Exaggerated Oversized / Boxy Fit',
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 48,
    stock: { XS: 4, S: 8, M: 12, L: 5, XL: 7, XXL: 3 },
    reviews: [
      {
        id: 'rev-1',
        author: 'Arjun M.',
        rating: 5,
        date: '14 Sept 2026',
        title: 'Heaviest & cleanest tee I own',
        comment: 'The collar does not bacon at all. The 280 GSM drape is stiff in the best architectural way. Truly comparable to $200 luxury streetwear brands.',
        verified: true,
        sizePurchased: 'L'
      },
      {
        id: 'rev-2',
        author: 'Kabir V.',
        rating: 5,
        date: '02 Sept 2026',
        title: 'Perfect drape for oversized look',
        comment: 'Drop shoulder proportion is dialed in accurately. Usually streetwear tees look messy, but this looks extremely sharp and elevated.',
        verified: true,
        sizePurchased: 'M'
      }
    ]
  },
  {
    id: 'nrv-hoodie-01',
    name: 'Raw Hem French Terry Heavyweight Hoodie',
    tagline: '450 GSM Heavy French Terry Knit',
    slug: 'raw-hem-french-terry-heavyweight-hoodie',
    price: 4999,
    originalPrice: 5999,
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    colors: [
      { name: 'Charcoal Black', hex: '#171717' },
      { name: 'Bone White', hex: '#F5F3EE' },
      { name: 'Washed Olive', hex: '#4A4C42' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'An uncompromising 450 GSM pure French Terry hoodie engineered with double-layered hood without drawstrings for a pure minimalist neckline. Custom raw edge rib hem and articulated sleeves create a relaxed structural drape.',
    details: [
      '450 GSM Luxury Looped Back French Terry',
      'Double-walled structured hood that stands tall',
      'No drawstrings for a pure editorial silhouette',
      'Kangaroo pocket with concealed reinforcement rivets',
      'Muted gold metal emblem plate at cuff'
    ],
    fabric: '100% Cotton Loopback Terry',
    gsm: '450 GSM',
    fit: 'Relaxed Dropped Silhouette',
    isNew: true,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 39,
    stock: { S: 5, M: 8, L: 4, XL: 6, XXL: 2 }
  },
  {
    id: 'nrv-shirt-01',
    name: 'Architectural Oversized Poplin Shirt',
    tagline: 'High-Density Crisp Egyptian Cotton',
    slug: 'architectural-oversized-poplin-shirt',
    price: 3499,
    originalPrice: 4299,
    category: 'shirts',
    categoryLabel: 'Shirts',
    colors: [
      { name: 'Crisp Ivory', hex: '#FAF9F6' },
      { name: 'Deep Black', hex: '#0B0B0B' },
      { name: 'Stone Grey', hex: '#8A8780' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'A structural statement shirt tailored with clean concealed placket, dropped shoulders, and a wide rear box pleat. Bridges high-tailoring with contemporary streetwear ease.',
    details: [
      '180 GSM High-Density Crisp Cotton Poplin',
      'Concealed horn button front fastening',
      'Deep curved hem with reinforced side gussets',
      'Extended French cuffs with dual-position fastening',
      'Subtle tonal topstitching'
    ],
    fabric: '100% Long-Staple Cotton',
    gsm: '180 GSM',
    fit: 'Oversized Contemporary Tailoring',
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 27,
    stock: { S: 6, M: 10, L: 8, XL: 3 }
  },
  {
    id: 'nrv-tee-02',
    name: 'Washed Vintage Acid Oversized Tee',
    tagline: 'Distressed Stone Wash Finish',
    slug: 'washed-vintage-acid-oversized-tee',
    price: 2699,
    originalPrice: 3199,
    category: 't-shirts',
    categoryLabel: 'T-Shirts',
    colors: [
      { name: 'Vintage Charcoal', hex: '#262626' },
      { name: 'Faded Bone', hex: '#ECE8E1' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Each garment undergoes an artisan stone and mineral wash process, giving it subtle high-low contrast along the seams and a buttery-soft broken-in hand feel.',
    details: [
      '260 GSM Single Jersey Combed Cotton',
      'Individually stone-washed for unique vintage patina',
      'Thick 1.25” collar ribbing',
      'Reinforced twin-needle construction'
    ],
    fabric: '100% Washed Cotton',
    gsm: '260 GSM',
    fit: 'Wide Boxy Fit',
    isNew: true,
    isBestSeller: false,
    rating: 4.9,
    reviewsCount: 22,
    stock: { XS: 3, S: 7, M: 9, L: 4, XL: 5 }
  },
  {
    id: 'nrv-hoodie-02',
    name: 'Minimalist Quarter-Zip Pullover Hoodie',
    tagline: 'Chunky Muted Gold Hardware',
    slug: 'minimalist-quarter-zip-pullover-hoodie',
    price: 5299,
    originalPrice: 6499,
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    colors: [
      { name: 'Deep Black', hex: '#0B0B0B' },
      { name: 'Stone Grey', hex: '#8A8780' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'A heavy zip pullover engineered for cool urban evenings. Features custom muted champagne-gold two-way zipper hardware and dense cotton fleece interior.',
    details: [
      '420 GSM Brushed Fleece Cotton',
      'Custom champagne-gold metal zip with engraved puller',
      'Structured mock neckline with integrated hood',
      'Ribbed side panels for unrestricted mobility'
    ],
    fabric: '85% Cotton, 15% Poly for Shape Retention',
    gsm: '420 GSM',
    fit: 'Modern Relaxed Fit',
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 31,
    stock: { S: 4, M: 9, L: 6, XL: 2 }
  },
  {
    id: 'nrv-pant-01',
    name: 'Relaxed Tailored Pleated Trouser',
    tagline: 'Fluid Street-Tailoring with Clean Hem',
    slug: 'relaxed-tailored-pleated-trouser',
    price: 4299,
    originalPrice: 5199,
    category: 'pants',
    categoryLabel: 'Pants',
    colors: [
      { name: 'Deep Black', hex: '#0B0B0B' },
      { name: 'Charcoal', hex: '#171717' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Designed to pool effortlessly over chunky sneakers or dress shoes. Features deep double front pleats, hidden elastic waistband insert, and an elegant fluid drape.',
    details: [
      '310 GSM Wool-Blend Poly Twill with high drape',
      'Concealed internal drawstring for custom fit',
      'Angled slash side pockets & welt back pockets',
      'Reinforced crotch gusset'
    ],
    fabric: '65% Twill Viscose, 35% Poly',
    gsm: '310 GSM',
    fit: 'Wide-Leg Tailored Dropped Rise',
    isNew: false,
    isBestSeller: true,
    rating: 4.7,
    reviewsCount: 19,
    stock: { S: 5, M: 8, L: 7, XL: 3 }
  },
  {
    id: 'nrv-shirt-02',
    name: 'Camp Collar Linen-Cotton Overshirt',
    tagline: 'Breathable Textured Open Weave',
    slug: 'camp-collar-linen-cotton-overshirt',
    price: 3199,
    originalPrice: 3899,
    category: 'shirts',
    categoryLabel: 'Shirts',
    colors: [
      { name: 'Warm Off-White', hex: '#F5F3EE' },
      { name: 'Charcoal', hex: '#171717' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Engineered for effortless layered styling. Features a relaxed retro Cuban camp collar, clean flat hem, and breathable cotton-linen blend fabric.',
    details: [
      '220 GSM Cotton-Linen slub texture',
      'Square flat hem designed to wear untucked',
      'Natural matte buttons',
      'Left chest patch pocket'
    ],
    fabric: '55% Linen, 45% Cotton',
    gsm: '220 GSM',
    fit: 'Relaxed Boxy Fit',
    isNew: true,
    isBestSeller: false,
    rating: 4.8,
    reviewsCount: 15,
    stock: { S: 4, M: 6, L: 8, XL: 4, XXL: 2 }
  },
  {
    id: 'nrv-tee-03',
    name: 'Raw Edge Minimalist Longsleeve Tee',
    tagline: 'Fine Rib Heavyweight Cotton',
    slug: 'raw-edge-minimalist-longsleeve-tee',
    price: 2799,
    originalPrice: 3299,
    category: 't-shirts',
    categoryLabel: 'T-Shirts',
    colors: [
      { name: 'Onyx Black', hex: '#0B0B0B' },
      { name: 'Soft Ivory', hex: '#FAF9F6' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Essential transitional layering piece. Extended sleeves gather softly at wrists with ribbed cuffs and subtle raw edge neckline detailing.',
    details: [
      '270 GSM Ringspun Combed Cotton',
      'Longer body length with slight curved hem',
      'Seamless tubular body knit for zero chafing',
      'Signature minimal embroidery at lower left hem'
    ],
    fabric: '100% Premium Cotton',
    gsm: '270 GSM',
    fit: 'Modern Longline Drape',
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 34,
    stock: { S: 6, M: 11, L: 9, XL: 5 }
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Collection' },
  { id: 't-shirts', name: 'T-Shirts' },
  { id: 'hoodies', name: 'Hoodies' },
  { id: 'shirts', name: 'Shirts' },
  { id: 'pants', name: 'Trousers & Pants' },
  { id: 'new-arrivals', name: 'New Arrivals' },
  { id: 'best-sellers', name: 'Best Sellers' },
];

export const LOOKBOOK_GALLERY = [
  {
    id: 'lb-1',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    title: 'Autumn Atelier Vol. 1',
    subtitle: 'Onyx Boxy Silhouette & Relaxed Tailoring',
    tag: '@narvekaclothing'
  },
  {
    id: 'lb-2',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    title: 'Monochrome Study',
    subtitle: '450 GSM French Terry Drape',
    tag: '#narvekaminimal'
  },
  {
    id: 'lb-3',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
    title: 'Architectural Ease',
    subtitle: 'Dropped Shoulders & Crisp Linens',
    tag: '@narvekaclothing'
  },
  {
    id: 'lb-4',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop',
    title: 'Modern Everyday',
    subtitle: 'Tone-on-tone Minimal Uniform',
    tag: '#ModernMinimalYou'
  }
];
