from django.core.management.base import BaseCommand
from base.models import Product, ProductImage
from base.products import products


class Command(BaseCommand):
    help = "Seed products into database"

    def handle(self, *args, **kwargs):
        self.stdout.write("🌱 Seeding products...")

        # 🔥 Clear old data (important order)
        ProductImage.objects.all().delete()
        Product.objects.all().delete()

        for item in products:
            # ✅ Create product (NO image field here)
            product = Product.objects.create(
                name=item['name'],
                brand=item['brand'],
                category=item['category'],
                description=item['description'],
                price=item['price'],
                countInStock=item['countInStock'],
                rating=item.get('rating', 0),
                numReviews=item.get('numReviews', 0),
            )

            # ✅ Handle images safely
            images = item.get('images')

            if images:
                for img in images:
                    if img:  # avoid None or empty
                        ProductImage.objects.create(
                            product=product,
                            image=img
                        )
            else:
                # fallback to single image
                single_image = item.get('image')
                if single_image:
                    ProductImage.objects.create(
                        product=product,
                        image=single_image
                    )

        self.stdout.write(self.style.SUCCESS("✅ Products seeded successfully!"))