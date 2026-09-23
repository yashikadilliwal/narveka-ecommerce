import re
from pathlib import Path

from django.core.management.base import BaseCommand
from store.models import Category, Product, ProductImage, ProductVariant


class Command(BaseCommand):
    help = "Import NARVEKA products from products.ts"

    def handle(self, *args, **options):
        frontend_file = (
            Path(__file__).resolve().parents[3]
            / "frontend-products-backup.txt"
        )

        if not frontend_file.exists():
            self.stdout.write(
                self.style.ERROR(f"File not found: {frontend_file}")
            )
            return

        text = frontend_file.read_text(encoding="utf-8")

        # Find every product object using its id
        matches = list(
            re.finditer(
                r"\bid:\s*['\"](nrv-[^'\"]+)['\"]",
                text
            )
        )

        if not matches:
            self.stdout.write(
                self.style.ERROR("No NARVEKA products found.")
            )
            return

        imported = 0

        for index, match in enumerate(matches):
            product_id = match.group(1)

            start = match.start()

            if index + 1 < len(matches):
                end = matches[index + 1].start()
            else:
                end = text.find("export const CATEGORIES", start)

            block = text[start:end]

            def get_string(field, default=""):
                pattern = rf"\b{re.escape(field)}:\s*['\"](.*?)['\"]"
                result = re.search(pattern, block, re.S)
                return result.group(1).strip() if result else default

            def get_number(field, default=0):
                pattern = rf"\b{re.escape(field)}:\s*([0-9]+(?:\.[0-9]+)?)"
                result = re.search(pattern, block)
                return float(result.group(1)) if result else default

            def get_bool(field, default=False):
                pattern = rf"\b{re.escape(field)}:\s*(true|false)"
                result = re.search(pattern, block)
                return result.group(1) == "true" if result else default

            name = get_string("name")
            slug = get_string("slug")
            tagline = get_string("tagline")
            category_slug = get_string("category")
            category_label = get_string(
                "categoryLabel",
                category_slug.replace("-", " ").title()
            )

            price = get_number("price")
            original_price = get_number("originalPrice", 0)

            description = get_string("description")
            fabric = get_string("fabric")
            gsm = get_string("gsm")
            fit = get_string("fit")

            is_new = get_bool("isNew")
            is_best_seller = get_bool("isBestSeller")

            if not name or not slug:
                self.stdout.write(
                    self.style.WARNING(
                        f"Skipping {product_id}: missing name/slug"
                    )
                )
                continue

            category, _ = Category.objects.get_or_create(
                slug=category_slug,
                defaults={
                    "name": category_label,
                    "active": True,
                },
            )

            product, created = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": name,
                    "tagline": tagline,
                    "category": category,
                    "price": price,
                    "original_price": original_price or None,
                    "description": description,
                    "details": [],
                    "fabric": fabric,
                    "gsm": gsm,
                    "fit": fit,
                    "is_new": is_new,
                    "is_best_seller": is_best_seller,
                    "active": True,
                },
            )

            ProductImage.objects.filter(product=product).delete()
            ProductVariant.objects.filter(product=product).delete()

            # Get image URLs
            image_urls = re.findall(
                r"https://images\.unsplash\.com/[^'\"]+",
                block
            )

            for position, image_url in enumerate(image_urls):
                ProductImage.objects.create(
                    product=product,
                    external_url=image_url,
                    alt=name,
                    sort_order=position,
                )

            # Get sizes
            sizes_match = re.search(
                r"sizes:\s*\[(.*?)\]",
                block,
                re.S
            )

            sizes = []
            if sizes_match:
                sizes = re.findall(
                    r"['\"]([^'\"]+)['\"]",
                    sizes_match.group(1)
                )

            # Get colors
            colors_match = re.search(
                r"colors:\s*\[(.*?)\],\s*sizes:",
                block,
                re.S
            )

            colors = []

            if colors_match:
                colors = re.findall(
                    r"name:\s*['\"](.*?)['\"].*?"
                    r"hex:\s*['\"](#[A-Fa-f0-9]+)['\"]",
                    colors_match.group(1),
                    re.S,
                )

            # Get stock
            stock_match = re.search(
                r"stock:\s*\{(.*?)\}",
                block,
                re.S
            )

            stock = {}

            if stock_match:
                for size, quantity in re.findall(
                    r"([A-Za-z0-9]+):\s*(\d+)",
                    stock_match.group(1)
                ):
                    stock[size] = int(quantity)

            for size in sizes:
                for color_name, color_hex in colors:
                    ProductVariant.objects.create(
                        product=product,
                        size=size,
                        color_name=color_name,
                        color_hex=color_hex,
                        stock=stock.get(size, 0),
                    )

            action = "Created" if created else "Updated"

            self.stdout.write(
                self.style.SUCCESS(
                    f"{action}: {name} | "
                    f"Images: {len(image_urls)} | "
                    f"Variants: {len(sizes) * len(colors)}"
                )
            )

            imported += 1

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {imported} products."
            )
        )