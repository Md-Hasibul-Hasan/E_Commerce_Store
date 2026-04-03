import { useState } from "react";
import Rating from "./Rating";
import ImagePreview from "./ImagePreview";

const ReviewList = ({ reviews }) => {
  const [modalImages, setModalImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  const openPreview = (images, index) => {
    setModalImages(images);
    setCurrent(index);
    setOpen(true);
  };

  const getShortName = (name) => {
    if (!name) return "Anonymous";
    return name.split(" ")[0];
  };

  return (
    <section className="mt-12">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Customer Reviews
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Honest feedback from customers who bought this product.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-[#12161f] px-4 py-2 text-sm text-gray-300">
          {reviews?.length || 0} review{reviews?.length === 1 ? "" : "s"}
        </div>
      </div>

      {reviews?.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#12161f] p-8 text-center">
          <p className="text-sm text-gray-400">
            No reviews yet. Be the first to share your experience.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {reviews?.map((review) => {
          const imgs = review.reviewimages?.map((image) => image.image) || [];

          return (
            <article
              key={review.id}
              className="rounded-3xl border border-white/10 bg-[#12161f] p-5 transition hover:border-white/15"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-400 font-semibold text-black">
                  {getShortName(review.name).charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-white">{review.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                        <Rating value={review.rating} />
                        <span>({review.rating})</span>
                      </div>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="mt-4 text-sm leading-7 text-gray-300">
                      {review.comment}
                    </p>
                  )}

                  {imgs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {imgs.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="review"
                          onClick={() => openPreview(imgs, index)}
                          className="h-20 w-20 cursor-pointer rounded-2xl border border-white/10 object-cover transition hover:scale-[1.03]"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {open && (
        <ImagePreview
          images={modalImages}
          current={current}
          setCurrent={setCurrent}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
};

export default ReviewList;
