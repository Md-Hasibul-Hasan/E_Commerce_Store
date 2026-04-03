import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import ReviewList from "../components/ReviewList";
import ImagePreview from "../components/ImagePreview";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { fetchProductDetails } from "../features/product/productThunk";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync, buyNowAsync } from "../features/cart/cartThunk";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(0);
  const [modalImages, setModalImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [quan, setQuan] = useState(1);

  const { product, loading, error } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const images =
    product?.images?.map((img) => img.image) || ["/placeholder.png"];

  useEffect(() => {
    if (window.location.hash === "#reviews") {
      const el = document.getElementById("reviews");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }

    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [images.length]);

  const openPreview = (galleryImages, index) => {
    setModalImages(galleryImages);
    setCurrent(index);
    setOpen(true);
  };

  const addToCartHandler = () => {
    dispatch(addToCartAsync({ id, qty: quan }));
  };

  const buyNowHandler = () => {
    dispatch(buyNowAsync({ id: product.id, qty: quan }));
    navigate("/login?redirect=/shipping");
  };

  const isOutOfStock = product?.countInStock === 0;

  const decreaseQty = () => {
    let qty = quan - 1;
    if (qty < 1) qty = 1;
    setQuan(qty);
  };

  const increaseQty = () => {
    let qty = quan + 1;
    if (qty > product.countInStock) qty = product.countInStock;
    setQuan(qty);
  };

  const handleQtyInput = (e) => {
    let qty = Number(e.target.value);
    if (qty < 1) qty = 1;
    if (qty > product.countInStock) qty = product.countInStock;
    setQuan(qty);
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 transition hover:border-orange-400/40 hover:text-white"
          >
            <span>←</span>
            <span>Back to shop</span>
          </Link>

          <a
            href="#reviews"
            className="text-sm text-gray-400 transition hover:text-orange-400"
          >
            Jump to reviews
          </a>
        </div>

        {loading && <Loader />}
        {error && <Message variant="error">{error}</Message>}

        {!loading && !error && product && (
          <>
            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.95fr]">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,#1d2639_0%,#121722_45%,#0e1118_100%)] p-4 sm:p-6">
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" />

                  <div className="relative flex min-h-[320px] items-center justify-center sm:min-h-[460px]">
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={product.name}
                        onClick={() => openPreview(images, index)}
                        className={`absolute max-h-full max-w-full cursor-zoom-in object-contain px-4 transition-all duration-700 ${
                          index === current
                            ? "scale-100 opacity-100"
                            : "scale-95 opacity-0"
                        }`}
                      />
                    ))}

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrent((prev) =>
                              prev === 0 ? images.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xl text-white transition hover:bg-black/55"
                        >
                          ‹
                        </button>

                        <button
                          onClick={() =>
                            setCurrent((prev) => (prev + 1) % images.length)
                          }
                          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xl text-white transition hover:bg-black/55"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                    {images.map((img, index) => (
                      <button
                        key={img + index}
                        onClick={() => setCurrent(index)}
                        className={`overflow-hidden rounded-2xl border transition ${
                          index === current
                            ? "border-orange-400 ring-1 ring-orange-400/40"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="h-20 w-full bg-white object-contain p-2"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="mb-2 inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-orange-300">
                        {product.category || "Featured Product"}
                      </p>

                      <h1 className="text-2xl font-semibold leading-tight sm:text-4xl">
                        {product.name}
                      </h1>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        Price
                      </p>
                      <p className="mt-1 text-2xl font-bold text-orange-400 sm:text-3xl">
                        ৳ {product.price}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-4">
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />

                    <span className="text-sm text-gray-500">•</span>

                    <p className="text-sm text-gray-400">
                      Brand: <span className="text-white">{product.brand}</span>
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                        Availability
                      </p>
                      <p
                        className={`mt-2 text-sm font-medium ${
                          isOutOfStock ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {isOutOfStock
                          ? "Out of Stock"
                          : `In Stock (${product.countInStock})`}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                        Delivery
                      </p>
                      <p className="mt-2 text-sm text-gray-300">
                        Fast delivery and secure checkout available.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                      Description
                    </p>
                    <p className="text-sm leading-7 text-gray-300">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                        Select quantity
                      </p>
                      <div className="mt-3 inline-flex items-center rounded-2xl border border-white/10 bg-[#0d1118] p-1">
                        <button
                          onClick={decreaseQty}
                          disabled={isOutOfStock}
                          className="h-10 w-10 rounded-xl text-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-gray-600"
                        >
                          −
                        </button>

                        <input
                          type="number"
                          value={isOutOfStock ? 0 : quan}
                          onChange={handleQtyInput}
                          disabled={isOutOfStock}
                          className="w-16 bg-transparent text-center text-base font-medium text-white focus:outline-none disabled:text-gray-500"
                        />

                        <button
                          onClick={increaseQty}
                          disabled={isOutOfStock}
                          className="h-10 w-10 rounded-xl text-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">
                      {isOutOfStock
                        ? "This product is currently unavailable."
                        : "Choose your quantity and continue."}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      disabled={isOutOfStock}
                      onClick={addToCartHandler}
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                        isOutOfStock
                          ? "cursor-not-allowed bg-gray-800 text-gray-500"
                          : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      Add to Cart
                    </button>

                    <button
                      disabled={isOutOfStock}
                      onClick={buyNowHandler}
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                        isOutOfStock
                          ? "cursor-not-allowed bg-gray-800 text-gray-500"
                          : "bg-orange-400 text-black hover:bg-orange-500"
                      }`}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section id="reviews" className="mt-12 rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
              <ReviewList reviews={product.reviews} />
            </section>
          </>
        )}

        {open && (
          <ImagePreview
            images={modalImages}
            current={current}
            setCurrent={setCurrent}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
