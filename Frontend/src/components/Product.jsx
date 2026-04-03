import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  const isOutOfStock = product.countInStock === 0;

  const imageUrl =
    product.images?.length > 0
      ? product.images[0].image
      : "/placeholder.png";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition duration-200 hover:border-orange-400">
      <Link
        to={`/product/${product.id}`}
        className="block border-b border-gray-800 bg-white"
      >
        <div className="flex h-56 items-center justify-center p-4 sm:h-60">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-full w-full object-contain"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${product.id}`} className="flex flex-1 flex-col">
          <h2 className="line-clamp-2 min-h-10 text-sm font-medium text-gray-200">
            {product.name}
          </h2>

          <p className="mt-3 text-lg font-semibold text-orange-400">
            ৳ {product.price}
          </p>

          <div className="mt-2 text-xs text-gray-400">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>

          <div className="mt-3 space-y-1 text-xs text-gray-400">
            <p className="truncate">Brand: {product.brand}</p>
            <p className="truncate">Category: {product.category}</p>
          </div>

          <p
            className={`mt-3 text-xs ${
              !isOutOfStock ? "text-green-400" : "text-red-400"
            }`}
          >
            {!isOutOfStock ? "In Stock" : "Out of Stock"}
          </p>
        </Link>
      </div>
    </article>
  );
};

export default Product;
