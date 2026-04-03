from django.core.management.base import BaseCommand
from base.models import Product, ProductImage
from base.products import products


class Command(BaseCommand):
    help = "Seed products into database"

    def handle(self, *args, **kwargs):
        # Clear old data (optional)
        Product.objects.all().delete()

        for item in products:
            product = Product.objects.create(
                name=item['name'],
                brand=item['brand'],
                category=item['category'],
                description=item['description'],
                price=item['price'],
                countInStock=item['countInStock'],
                rating=item['rating'],
                numReviews=item['numReviews'],
            )

            # Handle images
            images = item.get('images', [item.get('image')])

            for img in images:
                ProductImage.objects.create(
                    product=product,
                    image=img  # works if using string path for now
                )

        self.stdout.write(self.style.SUCCESS("Products seeded successfully!"))