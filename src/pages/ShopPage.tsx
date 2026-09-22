import React, { useState, useMemo } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { SlidersHorizontal, X, Grid3X3, LayoutGrid, Check } from 'lucide-react';
import { BRAND } from '../config/brand';
import { useProducts } from '../context/ProductContext';

export const ShopPage: React.FC = () => {
  const { selectedCategory, openCategory } = useNavigation();
  const { products } = useProducts();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(7000);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  // Available unique colors and sizes from dataset
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const allColors = [
    { name: 'Onyx Black', hex: '#0B0B0B' },
    { name: 'Charcoal', hex: '#171717' },
    { name: 'Soft Ivory', hex: '#FAF9F6' },
    { name: 'Warm Off-White', hex: '#F5F3EE' },
    { name: 'Stone Grey', hex: '#8A8780' },
    { name: 'Washed Olive', hex: '#4A4C42' },
  ];

  const handleToggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const handleToggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(7000);
    openCategory('all');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    maxPrice < 7000;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory === 'new-arrivals') {
        if (!prod.isNew) return false;
      } else if (selectedCategory === 'best-sellers') {
        if (!prod.isBestSeller) return false;
      } else if (selectedCategory !== 'all') {
        if (prod.category !== selectedCategory) return false;
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((s) => prod.sizes.includes(s as any));
        if (!hasSize) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasColor = selectedColors.some((c) =>
          prod.colors.some((pc) => pc.name.toLowerCase().includes(c.toLowerCase()))
        );
        if (!hasColor) return false;
      }

      // Price filter
      if (prod.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured / default
    });
  }, [selectedCategory, selectedSizes, selectedColors, maxPrice, sortBy]);

  const currentCategoryLabel =
    CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'All Streetwear';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Category Header */}
      <div className="mb-10 text-center sm:text-left pb-6 border-b border-brand-lightgrey">
        <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold">
          {BRAND.established} • ARCHIVE CATALOGUE
        </span>
        <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black mt-2">
          {currentCategoryLabel}
        </h1>
        <p className="text-xs text-brand-stone max-w-2xl mt-2 leading-relaxed">
          Contemporary streetwear garments cut with architectural proportion. Engineered from custom-milled 280-450 GSM luxury textiles.
        </p>
      </div>

      {/* Categories Horizontal Quick Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => openCategory(cat.id)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide-editorial whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-brand-black text-brand-ivory border-brand-black shadow-sm'
                : 'bg-brand-offwhite text-brand-charcoal border-brand-lightgrey hover:border-brand-stone hover:text-brand-black'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Controls Bar: Filter Toggle, Active Pills, Sorting, Grid switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-y border-brand-lightgrey">
        {/* Left: Mobile Filter trigger / Results count */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-1.5 border border-brand-stone/40 bg-brand-offwhite text-xs font-semibold uppercase tracking-wider"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold" />
            <span>Filters {hasActiveFilters ? `(Active)` : ''}</span>
          </button>
          <span className="text-xs text-brand-stone uppercase tracking-luxury">
            Showing <strong className="text-brand-black">{filteredProducts.length}</strong> Pieces
          </span>
        </div>

        {/* Right: Grid Switcher & Sorting */}
        <div className="flex items-center gap-4">
          {/* Desktop Grid Switcher */}
          <div className="hidden md:flex items-center border border-brand-lightgrey p-0.5 bg-brand-offwhite">
            <button
              onClick={() => setGridCols(3)}
              className={`p-1.5 transition-colors ${gridCols === 3 ? 'bg-brand-black text-brand-ivory' : 'text-brand-stone hover:text-brand-black'}`}
              title="3 Columns"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1.5 transition-colors ${gridCols === 4 ? 'bg-brand-black text-brand-ivory' : 'text-brand-stone hover:text-brand-black'}`}
              title="4 Columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-stone uppercase tracking-wider hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-brand-offwhite border border-brand-stone/30 px-3 py-1.5 text-xs text-brand-black uppercase tracking-wider focus:outline-none focus:border-brand-gold cursor-pointer"
            >
              <option value="featured">Featured Archive</option>
              <option value="newest">New Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 space-y-8 pr-6 border-r border-brand-lightgrey">
          {/* Filter Header with Clear All */}
          <div className="flex items-center justify-between pb-3 border-b border-brand-lightgrey">
            <h3 className="text-xs font-semibold uppercase tracking-luxury text-brand-black flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold" />
              <span>Refine Pieces</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-brand-stone hover:text-brand-black underline tracking-wide"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-luxury text-brand-charcoal">
              Size
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {allSizes.map((sz) => {
                const active = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => handleToggleSize(sz)}
                    className={`py-2 text-xs font-semibold uppercase tracking-wider border transition-all ${
                      active
                        ? 'bg-brand-black text-brand-ivory border-brand-black'
                        : 'bg-brand-offwhite text-brand-charcoal border-brand-lightgrey hover:border-brand-black'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-luxury text-brand-charcoal">
              Color Palette
            </h4>
            <div className="space-y-2">
              {allColors.map((col) => {
                const active = selectedColors.includes(col.name);
                return (
                  <button
                    key={col.name}
                    onClick={() => handleToggleColor(col.name)}
                    className={`w-full flex items-center justify-between p-2 text-xs transition-colors border ${
                      active
                        ? 'bg-brand-offwhite border-brand-black text-brand-black font-semibold'
                        : 'border-transparent hover:bg-brand-offwhite/50 text-brand-charcoal'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-brand-stone/40"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </span>
                    {active && <Check className="w-3.5 h-3.5 text-brand-gold" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-semibold uppercase tracking-luxury text-brand-charcoal">
                Price Ceiling
              </h4>
              <span className="font-bold text-brand-black">
                {BRAND.currency.symbol}{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={7000}
              step={250}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-black cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-brand-stone">
              <span>{BRAND.currency.symbol}2,000</span>
              <span>{BRAND.currency.symbol}7,000+</span>
            </div>
          </div>

          {/* Atelier Assurance Box */}
          <div className="p-4 bg-brand-offwhite border border-brand-lightgrey text-xs space-y-2">
            <p className="font-semibold text-brand-black uppercase tracking-wider">
              ✦ Tailored Assurance
            </p>
            <p className="text-brand-stone leading-relaxed text-[11px]">
              Every garment is cut and sewn in limited numbered batches with pre-shrunk high-GSM luxury cotton.
            </p>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-brand-offwhite border border-brand-lightgrey text-xs">
              <span className="text-brand-stone uppercase tracking-wider text-[10px]">
                Active Filters:
              </span>
              {selectedSizes.map((sz) => (
                <span
                  key={sz}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-ivory border border-brand-lightgrey text-xs text-brand-black"
                >
                  Size: {sz}
                  <button onClick={() => handleToggleSize(sz)}>
                    <X className="w-3 h-3 text-brand-stone hover:text-brand-black" />
                  </button>
                </span>
              ))}
              {selectedColors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-ivory border border-brand-lightgrey text-xs text-brand-black"
                >
                  {c}
                  <button onClick={() => handleToggleColor(c)}>
                    <X className="w-3 h-3 text-brand-stone hover:text-brand-black" />
                  </button>
                </span>
              ))}
              {maxPrice < 7000 && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-ivory border border-brand-lightgrey text-xs text-brand-black">
                  Under {BRAND.currency.symbol}{maxPrice}
                  <button onClick={() => setMaxPrice(7000)}>
                    <X className="w-3 h-3 text-brand-stone hover:text-brand-black" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-brand-stone hover:text-brand-black underline ml-auto"
              >
                Reset
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-brand-offwhite border border-brand-lightgrey p-8 space-y-4">
              <h3 className="editorial-title text-xl font-bold text-brand-black">
                No Pieces Match Your Criteria
              </h3>
              <p className="text-xs text-brand-stone max-w-md mx-auto">
                Try widening your price range, choosing different size options, or resetting your filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-brand-black text-brand-ivory text-xs font-semibold uppercase tracking-luxury hover:bg-brand-gold hover:text-brand-black transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
              } gap-6 lg:gap-8`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-brand-black/70 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-brand-ivory p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-lightgrey">
                <h3 className="text-sm font-semibold uppercase tracking-luxury text-brand-black">
                  Refine Catalogue
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-brand-stone hover:text-brand-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-luxury text-brand-black">
                  Sizes
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {allSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleToggleSize(sz)}
                      className={`py-2 text-xs font-semibold uppercase border ${
                        selectedSizes.includes(sz)
                          ? 'bg-brand-black text-brand-ivory'
                          : 'bg-brand-offwhite text-brand-black border-brand-lightgrey'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-luxury text-brand-black">
                  Colors
                </h4>
                <div className="space-y-1.5">
                  {allColors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => handleToggleColor(col.name)}
                      className={`w-full flex items-center justify-between p-2 text-xs border ${
                        selectedColors.includes(col.name)
                          ? 'bg-brand-offwhite border-brand-black'
                          : 'border-brand-lightgrey'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </span>
                      {selectedColors.includes(col.name) && (
                        <Check className="w-3.5 h-3.5 text-brand-gold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Price Limit:</span>
                  <strong>{BRAND.currency.symbol}{maxPrice.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={7000}
                  step={250}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-black"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-brand-lightgrey flex gap-2">
              <button
                onClick={clearAllFilters}
                className="w-1/2 py-3 bg-brand-offwhite border border-brand-lightgrey text-xs uppercase font-semibold text-brand-stone hover:text-brand-black"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-3 bg-brand-black text-brand-ivory text-xs uppercase font-semibold hover:bg-brand-charcoal hover:text-brand-gold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
