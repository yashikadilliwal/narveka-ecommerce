from django.core.management.base import BaseCommand
from store.models import Category, Product, ProductVariant, ProductImage, Coupon

PRODUCTS=[
("Heavyweight Boxy Drop-Shoulder Tee","heavyweight-boxy-drop-shoulder-tee","T-Shirts",2499,2999,
"280 GSM Compact Interlock Cotton",
"Constructed from custom-milled 280 GSM interlock combed cotton. Designed with an exaggerated boxy drape and reinforced ribbed collar.",
["280 GSM 100% Combed Compact Cotton","Pre-shrunk enzyme wash","Drop shoulder & wide sleeve","Blind-stitched hems"],
"100% High-Grade Compact Cotton","280 GSM","Exaggerated Oversized / Boxy Fit",True,True,
[("Onyx Black","#0B0B0B"),("Soft Ivory","#FAF9F6"),("Stone Grey","#8A8780")],["XS","S","M","L","XL","XXL"],
["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop"]),
("Raw Hem French Terry Heavyweight Hoodie","raw-hem-french-terry-heavyweight-hoodie","Hoodies",4999,5999,
"450 GSM Heavy French Terry Knit","An uncompromising 450 GSM French Terry hoodie engineered for a clean minimalist silhouette.",
["450 GSM French Terry","Double-layer structured hood","No-drawstring editorial silhouette","Reinforced kangaroo pocket"],
"100% Cotton Loopback Terry","450 GSM","Relaxed Dropped Silhouette",True,True,
[("Charcoal Black","#171717"),("Bone White","#F5F3EE"),("Stone Grey","#8A8780")],["S","M","L","XL","XXL"],
["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop"]),
("Architectural Oversized Poplin Shirt","architectural-oversized-poplin-shirt","Shirts",3499,4299,
"High-Density Crisp Cotton","A structural statement shirt with dropped shoulders, concealed placket and wide rear box pleat.",
["180 GSM High-Density Cotton Poplin","Concealed button placket","Deep curved hem","Extended cuffs"],
"100% Long-Staple Cotton","180 GSM","Oversized Contemporary Tailoring",False,True,
[("Crisp Ivory","#FAF9F6"),("Deep Black","#0B0B0B"),("Stone Grey","#8A8780")],["S","M","L","XL"],
["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop"]),
("Washed Vintage Acid Oversized Tee","washed-vintage-acid-oversized-tee","T-Shirts",2699,3199,
"Distressed Stone Wash Finish","A soft, broken-in oversized tee with artisan stone and mineral wash treatment.",
["260 GSM Single Jersey","Stone-washed finish","Thick collar ribbing","Reinforced construction"],
"100% Washed Cotton","260 GSM","Wide Boxy Fit",True,False,
[("Vintage Charcoal","#262626"),("Faded Bone","#ECE8E1")],["XS","S","M","L","XL"],
["https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop"]),
("Minimalist Quarter-Zip Pullover Hoodie","minimalist-quarter-zip-pullover-hoodie","Hoodies",5299,6499,
"Chunky Muted Gold Hardware","A heavy zip pullover with custom champagne hardware and dense fleece interior.",
["420 GSM Brushed Fleece","Custom champagne-gold zipper","Structured mock neckline","Ribbed side panels"],
"85% Cotton, 15% Poly","420 GSM","Modern Relaxed Fit",True,True,
[("Deep Black","#0B0B0B"),("Stone Grey","#8A8780")],["S","M","L","XL"],
["https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop"]),
("Relaxed Tailored Pleated Trouser","relaxed-tailored-pleated-trouser","Pants",4299,5199,
"Fluid Street-Tailoring","A wide-leg tailored trouser designed to pool effortlessly over sneakers or dress shoes.",
["310 GSM Wool-blend twill","Hidden elastic waistband insert","Slash side pockets","Reinforced crotch"],
"65% Twill Viscose, 35% Poly","310 GSM","Wide-Leg Tailored Dropped Rise",False,True,
[("Deep Black","#0B0B0B"),("Charcoal","#171717")],["S","M","L","XL"],
["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1200&auto=format&fit=crop"]),
("Camp Collar Linen-Cotton Overshirt","camp-collar-linen-cotton-overshirt","Shirts",3199,3899,
"Breathable Textured Open Weave","An effortless layered overshirt with a relaxed camp collar and breathable cotton-linen texture.",
["220 GSM Cotton-Linen","Square flat hem","Natural matte buttons","Chest patch pocket"],
"55% Linen, 45% Cotton","220 GSM","Relaxed Boxy Fit",True,False,
[("Warm Off-White","#F5F3EE"),("Charcoal","#171717")],["S","M","L","XL","XXL"],
["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop"]),
("Raw Edge Minimalist Longsleeve Tee","raw-edge-minimalist-longsleeve-tee","T-Shirts",2799,3299,
"Fine Rib Heavyweight Cotton","A refined transitional layering piece with extended sleeves and subtle raw-edge detailing.",
["270 GSM Ringspun Cotton","Longline body","Tubular body knit","Minimal hem embroidery"],
"100% Premium Cotton","270 GSM","Modern Longline Drape",False,True,
[("Onyx Black","#0B0B0B"),("Soft Ivory","#FAF9F6")],["S","M","L","XL"],
["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop"])
]

class Command(BaseCommand):
    help="Seed NARVEKA demo catalog and coupons"
    def handle(self,*args,**kwargs):
        cats={}
        for name in ["T-Shirts","Hoodies","Shirts","Pants"]:
            c,_=Category.objects.get_or_create(slug=name.lower().replace(" ","-"),defaults={"name":name})
            cats[name]=c
        for data in PRODUCTS:
            (name,slug,cat,price,orig,tagline,desc,details,fabric,gsm,fit,isnew,best,colors,sizes,images)=data
            p,_=Product.objects.update_or_create(slug=slug,defaults=dict(name=name,category=cats[cat],price=price,original_price=orig,tagline=tagline,description=desc,details=details,fabric=fabric,gsm=gsm,fit=fit,is_new=isnew,is_best_seller=best,active=True))
            ProductVariant.objects.filter(product=p).delete()
            for i,size in enumerate(sizes):
                for color_index,(cn,ch) in enumerate(colors):
                    ProductVariant.objects.create(product=p,size=size,color_name=cn,color_hex=ch,stock=max(2,12-i*2-color_index))
            ProductImage.objects.filter(product=p).delete()
            for i,url in enumerate(images):
                ProductImage.objects.create(product=p,external_url=url,alt=name,sort_order=i)
        Coupon.objects.update_or_create(code="NARVEKA10",defaults={"percentage":10,"fixed_amount":None,"minimum_spend":0,"active":True})
        Coupon.objects.update_or_create(code="FIRSTDROP",defaults={"percentage":None,"fixed_amount":500,"minimum_spend":2500,"active":True})
        self.stdout.write(self.style.SUCCESS("NARVEKA catalog seeded."))
