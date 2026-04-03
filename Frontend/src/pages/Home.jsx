import React, { useEffect } from "react";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/productThunk";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useLocation } from "react-router-dom";
import Pagination from "../components/Pagination";
import TopProducts from "../components/TopProducts";

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { products, page, pages, loading, error, count } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const query = {
      search: params.get("search") || "",
      category: params.get("category") || "",
      brand: params.get("brand") || "",
      ordering: params.get("ordering") || "",
      page: Number(params.get("page")) || 1,
    };

    dispatch(fetchProducts(query));
  }, [dispatch, location.search]);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#171c27_0%,#12161f_100%)] p-6 sm:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
              Discover
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Shop the latest gadgets and everyday essentials
            </h1>
            <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
              Browse top-rated products, explore new arrivals, and find the
              right item faster with search, filters, and smart sorting.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                Fast search
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                Filter by brand
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                Top rated picks
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10">
          <TopProducts />
        </div>

        <section className="mt-12">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
                Catalog
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                All Products
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                {count ? `${count} products found` : "Browse our collection"}
              </p>
            </div>

            {!loading && !error && products.length > 0 && (
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                Page {page} of {pages}
              </div>
            )}
          </div>

          {loading && (
            <div className="rounded-3xl border border-white/10 bg-[#12161f] p-8">
              <Loader />
            </div>
          )}

          {error && <Message variant="error">{error}</Message>}

          {!loading && !error &&
            (products.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#12161f] p-8 text-center sm:p-12">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
                  🔎
                </div>
                <h3 className="text-xl font-semibold text-white">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Try changing your search or filters to see more results.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
              </div>
            ))}

          <Pagination page={page} pages={pages} />
        </section>
      </div>
    </div>
  );
};

export default Home;
