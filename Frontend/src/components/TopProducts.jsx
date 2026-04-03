import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { fetchTopProducts } from "../features/product/productThunk";
import Product from "./Product";
import Loader from "./Loader";
import Message from "./Message";
import "swiper/css";
import "swiper/css/navigation";

const TopProducts = () => {
  const dispatch = useDispatch();

  const { topProducts, loadingTop, errorTop } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchTopProducts());
  }, [dispatch]);

  if (!loadingTop && (!topProducts || topProducts.length === 0)) {
    return null;
  }

  return (
    <section className="mb-14 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
            Featured Picks
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Top Products
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            A quick look at standout products customers are checking out most.
          </p>
        </div>
      </div>

      {loadingTop && <Loader />}
      {errorTop && <Message variant="error">{errorTop}</Message>}

      {!loadingTop && !errorTop && (
        <div className="top-products-slider group relative rounded-[2rem] border border-white/10 bg-[#12161f] p-4 sm:p-5">
          <style>
            {`
              .top-products-slider .swiper {
                padding: 0.25rem;
              }

              .top-products-slider .swiper-button-prev,
              .top-products-slider .swiper-button-next {
                width: 2.75rem;
                height: 2.75rem;
                border-radius: 9999px;
                border: 1px solid rgba(255, 255, 255, 0.12);
                background: rgba(13, 17, 24, 0.92);
                color: #fff;
                opacity: 0;
                transition: opacity 0.25s ease, background 0.25s ease;
              }

              .top-products-slider .swiper-button-prev:hover,
              .top-products-slider .swiper-button-next:hover {
                background: rgba(251, 146, 60, 0.95);
                color: #0b0f14;
              }

              .top-products-slider .swiper-button-prev::after,
              .top-products-slider .swiper-button-next::after {
                font-size: 0.95rem;
                font-weight: 700;
              }

              .top-products-slider:hover .swiper-button-prev,
              .top-products-slider:hover .swiper-button-next {
                opacity: 1;
              }

              @media (max-width: 640px) {
                .top-products-slider .swiper-button-prev,
                .top-products-slider .swiper-button-next {
                  display: none;
                }
              }
            `}
          </style>

          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            loop={topProducts.length > 4}
            autoplay={{
              delay: 3200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={18}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 1.2 },
              640: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {topProducts.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <div className="flex h-full">
                  <div className="w-full">
                    <Product product={product} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  );
};

export default TopProducts;
