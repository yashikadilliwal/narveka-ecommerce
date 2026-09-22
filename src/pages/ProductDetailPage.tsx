import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import type { ProductColor, Review } from '../types';
import { BRAND } from '../config/brand';

import { ProductCard } from '../components/shop/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  Heart,
  ShoppingBag,
  Ruler,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  Star,
  CheckCircle,
  Share2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { selectedProduct, setIsSizeGuideOpen, navigateTo } = useNavigation();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { products } = useProducts();
  const { user } = useAuth();

  const product = selectedProduct || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  // Customer Reviews State
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || [
    {
      id: 'rev-def-1',
      author: 'Vikram S.',
      rating: 5,
      date: '18 Sept 2026',
      title: 'Flawless heavyweight drop',
      comment: 'The 280 GSM weight is unreal. It holds a stiff, architectural boxy drape around the shoulders that looks incredible in photographs and in person.',
      verified: true,
      sizePurchased: 'L'
    }
  ]);

  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');

  const inWishlist = isInWishlist(product.id);

  // Related products (excluding current)
  const relatedProducts = products.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isBestSeller)
  ).slice(0, 3);

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard', 'info');
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { showToast('Please sign in to leave a review.', 'error'); navigateTo('account'); return; }
    if (!newReviewComment) { showToast('Please provide your review remarks.', 'error'); return; }
    try {
      const saved = await api<any>(`/products/${product.slug}/reviews/`, {
        method:'POST',
        body:JSON.stringify({rating:newReviewRating,title:newReviewTitle||'NARVEKA Review',comment:newReviewComment})
      }, true);
      const newRev: Review = {
        id:String(saved.id), author:saved.author, rating:saved.rating, date:new Date(saved.date).toLocaleDateString('en-IN'),
        title:saved.title, comment:saved.comment, verified:saved.verified, sizePurchased:selectedSize
      };
      setReviewsList([newRev,...reviewsList]);
      setIsReviewFormOpen(false); setNewReviewComment(''); setNewReviewTitle('');
      showToast('Thank you for your NARVEKA review.', 'success');
    } catch(err) { showToast((err as Error).message,'error'); }
  };

  const remainingStock = product.stock[selectedSize] || 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-brand-stone mb-8 uppercase tracking-luxury">
        <button onClick={() => navigateTo('home')} className="hover:text-brand-black transition-colors">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigateTo('shop')} className="hover:text-brand-black transition-colors">
          Shop
        </button>
        <span>/</span>
        <span className="text-brand-black font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid: dominant photography on left, sticky purchase details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Product Image Gallery (Dominant Photography) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-[3/4] bg-brand-offwhite border border-brand-lightgrey overflow-hidden shadow-card">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-brand-black text-brand-ivory text-[10px] font-semibold uppercase tracking-luxury px-3 py-1 border border-brand-gold/40">
                New Drop
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-ivory/80 backdrop-blur-sm border border-brand-lightgrey flex items-center justify-center text-brand-charcoal hover:text-brand-gold transition-colors"
              title="Share piece"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[3/4] overflow-hidden border transition-all ${
                    activeImageIndex === idx
                      ? 'border-brand-black ring-1 ring-brand-black'
                      : 'border-brand-lightgrey opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Controls */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-luxury font-semibold text-brand-gold">
                {product.categoryLabel}
              </span>
              <span className="text-brand-stone text-xs">•</span>
              <span className="text-xs uppercase tracking-luxury text-brand-stone font-medium">
                {product.gsm}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-brand-black leading-tight">
              {product.name}
            </h1>

            {/* Price & Badges */}
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xl font-bold text-brand-black">
                {BRAND.currency.symbol}
                {product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-brand-stone line-through">
                    {BRAND.currency.symbol}
                    {product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-brand-gold font-semibold uppercase tracking-wider">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-brand-stone mt-1">
              Price inclusive of all taxes. Free shipping on this piece.
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-brand-charcoal leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          <div className="space-y-2.5 pt-2 border-t border-brand-lightgrey">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-luxury text-brand-black">
                Color: <span className="font-normal text-brand-stone">{selectedColor.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    selectedColor.name === color.name
                      ? 'ring-2 ring-brand-gold ring-offset-2 border-brand-black scale-105'
                      : 'border-brand-stone/40 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-luxury text-brand-black">
                Select Size: <span className="font-normal text-brand-stone">{selectedSize}</span>
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-brand-stone hover:text-brand-gold flex items-center gap-1 underline underline-offset-2"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide & Chart</span>
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-3 text-xs font-semibold uppercase tracking-wider border transition-all ${
                    selectedSize === sz
                      ? 'bg-brand-black text-brand-ivory border-brand-black shadow-sm'
                      : 'bg-brand-offwhite text-brand-charcoal border-brand-lightgrey hover:border-brand-black'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Low stock indicator */}
            {remainingStock < 6 && (
              <p className="text-[11px] text-amber-700 flex items-center gap-1 font-medium pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                Limited batch: Only {remainingStock} units remaining in size {selectedSize}.
              </p>
            )}
          </div>

          {/* Quantity & CTAs */}
          <div className="space-y-3 pt-4 border-t border-brand-lightgrey">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-brand-lightgrey bg-brand-offwhite">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-3 text-xs text-brand-charcoal hover:bg-brand-lightgrey/50 transition-colors"
                >
                  -
                </button>
                <span className="px-3 py-3 text-xs font-semibold text-brand-black min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-3 text-xs text-brand-charcoal hover:bg-brand-lightgrey/50 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Primary Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-brand-black text-brand-ivory hover:bg-brand-charcoal hover:text-brand-gold py-3.5 px-6 text-xs font-semibold uppercase tracking-luxury transition-all flex items-center justify-center gap-2 border border-brand-black shadow-card"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-3.5 border border-brand-lightgrey bg-brand-offwhite hover:border-brand-gold transition-colors text-brand-charcoal"
                title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <Heart
                  className={`w-4 h-4 ${inWishlist ? 'fill-brand-gold text-brand-gold' : ''}`}
                />
              </button>
            </div>

            {/* Direct Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-brand-ivory text-brand-black hover:bg-brand-gold hover:text-brand-black py-3.5 px-4 text-xs font-semibold uppercase tracking-luxury transition-all border border-brand-black"
            >
              Buy Now — Instant Checkout
            </button>
          </div>

          {/* Atelier Perks Summary */}
          <div className="grid grid-cols-2 gap-3 py-3 text-[11px] text-brand-stone border-y border-brand-lightgrey">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Free Express Delivery (3-5 Days)</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-brand-gold shrink-0" />
              <span>7-Day Doorstep Returns</span>
            </div>
          </div>

          {/* Expandable Accordions */}
          <div className="divide-y divide-brand-lightgrey border-b border-brand-lightgrey text-xs">
            {/* Accordion 1: Details & Materials */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full flex items-center justify-between font-semibold uppercase tracking-luxury text-brand-black text-left"
              >
                <span>Garment Specifications & Fabric</span>
                {openAccordion === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'details' && (
                <div className="mt-3 space-y-2 text-brand-charcoal animate-fade-in text-xs">
                  <p><strong>Composition:</strong> {product.fabric}</p>
                  <p><strong>Weight:</strong> {product.gsm}</p>
                  <p><strong>Fit:</strong> {product.fit}</p>
                  <ul className="list-disc list-inside space-y-1 text-brand-stone pt-1">
                    {product.details.map((det, i) => (
                      <li key={i}>{det}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Accordion 2: Shipping & Delivery */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex items-center justify-between font-semibold uppercase tracking-luxury text-brand-black text-left"
              >
                <span>Shipping & Express Courier</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="mt-3 space-y-2 text-brand-stone animate-fade-in text-xs leading-relaxed">
                  <p>• All orders are dispatched via Bluedart / Delhivery Express priority air service.</p>
                  <p>• Metro deliveries arrive within 48 to 72 hours of dispatch.</p>
                  <p>• Full live tracking link provided immediately upon dispatch.</p>
                </div>
              )}
            </div>

            {/* Accordion 3: Return & Exchange */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('returns')}
                className="w-full flex items-center justify-between font-semibold uppercase tracking-luxury text-brand-black text-left"
              >
                <span>Returns & Exchanges</span>
                {openAccordion === 'returns' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'returns' && (
                <div className="mt-3 space-y-2 text-brand-stone animate-fade-in text-xs leading-relaxed">
                  <p>• We offer a 7-day hassle-free return or size exchange policy from the date of delivery.</p>
                  <p>• Reverse pickup will be arranged right from your doorstep at zero extra cost.</p>
                  <p>• Garments must be unworn, unwashed with all tags intact in original luxury pouch.</p>
                </div>
              )}
            </div>

            {/* Accordion 4: Wash & Care */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('care')}
                className="w-full flex items-center justify-between font-semibold uppercase tracking-luxury text-brand-black text-left"
              >
                <span>Wash & Care Guide</span>
                {openAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'care' && (
                <div className="mt-3 space-y-1.5 text-brand-stone animate-fade-in text-xs leading-relaxed">
                  <p>• Cold machine wash (30°C) with similar darks.</p>
                  <p>• Wash inside out to preserve surface hand-feel.</p>
                  <p>• Do not tumble dry. Line dry in shade to maintain architectural drape.</p>
                  <p>• Warm iron inside out if needed.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-20 pt-14 border-t border-brand-lightgrey">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-brand-lightgrey gap-4">
          <div>
            <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
              Atelier Client Feedback
            </span>
            <h3 className="editorial-title text-2xl font-bold text-brand-black mt-1">
              Verified Reviews ({reviewsList.length})
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-brand-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-gold" />
                ))}
              </div>
              <span className="text-xs font-semibold text-brand-black">
                {product.rating.toFixed(1)} out of 5.0
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
            className="px-5 py-2.5 bg-brand-black text-brand-ivory text-xs uppercase font-semibold tracking-luxury hover:bg-brand-charcoal hover:text-brand-gold transition-colors self-start sm:self-auto"
          >
            {isReviewFormOpen ? 'Close Form' : 'Write a Review'}
          </button>
        </div>

        {/* Review Submission Form Modal / Drawer */}
        {isReviewFormOpen && (
          <form
            onSubmit={handleAddReview}
            className="p-6 bg-brand-offwhite border border-brand-lightgrey mb-10 space-y-4 max-w-xl animate-fade-in"
          >
            <h4 className="text-sm font-semibold uppercase tracking-luxury text-brand-black">
              Submit Your Review
            </h4>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewReviewRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newReviewRating ? 'fill-brand-gold text-brand-gold' : 'text-brand-stone'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Siddharth R."
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Exceptional fabric weight"
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                Your Experience & Fit Feedback
              </label>
              <textarea
                required
                rows={3}
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Share your thoughts on the drape, fabric weight, and proportions..."
                className="w-full bg-brand-ivory border border-brand-stone/30 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-black text-brand-ivory hover:bg-brand-charcoal hover:text-brand-gold text-xs font-semibold uppercase tracking-luxury transition-colors"
            >
              Post Review
            </button>
          </form>
        )}

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-brand-offwhite border border-brand-lightgrey space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-black">{rev.author}</span>
                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Verified Owner
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-brand-stone">{rev.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-brand-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-brand-gold" />
                  ))}
                </div>
                {rev.sizePurchased && (
                  <span className="text-[10px] text-brand-stone uppercase">
                    Purchased Size {rev.sizePurchased}
                  </span>
                )}
              </div>

              <h5 className="text-xs font-bold uppercase tracking-wide text-brand-black">
                {rev.title}
              </h5>
              <p className="text-xs text-brand-stone leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products / Complete the Look */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-14 border-t border-brand-lightgrey">
          <div className="mb-10 text-center sm:text-left">
            <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
              Curated Uniform
            </span>
            <h3 className="editorial-title text-2xl sm:text-3xl font-bold text-brand-black mt-1">
              Complete The Look
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
