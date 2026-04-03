import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductDetails } from "../features/product/productThunk";

const API = import.meta.env.VITE_API_URL;

const ReviewForm = ({ productId, orderId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product", productId);
      formData.append("order", orderId);
      formData.append("rating", rating);
      formData.append("comment", comment);

      const res = await axios.post(`${API}/api/reviews/`, formData, {
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const reviewId = res.data.id;

      for (const image of images) {
        const imgData = new FormData();
        imgData.append("review", reviewId);
        imgData.append("image", image.file);

        await axios.post(`${API}/api/reviewimages/`, imgData, {
          headers: {
            Authorization: `Bearer ${userInfo.access}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("Review submitted");
      onClose();
      dispatch(fetchProductDetails(productId));
    } catch (error) {
      console.log("ERROR:", error);

      if (error.response) {
        console.log("BACKEND ERROR:", error.response.data);
      } else {
        console.log("JS ERROR:", error.message);
      }

      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.non_field_errors?.[0] ||
          error.message ||
          "Error"
      );
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const renderStar = (index) => {
    const value = index + 1;
    const displayValue = hover !== null ? hover : rating;

    let fill = "#2f3744";

    if (displayValue >= value) {
      fill = "#fb923c";
    } else if (displayValue >= value - 0.5) {
      fill = "url(#half-gradient)";
    }

    return (
      <div key={index} className="relative">
        <div
          className="absolute left-0 top-0 z-10 h-full w-1/2 cursor-pointer"
          onMouseEnter={() => setHover(value - 0.5)}
          onMouseLeave={() => setHover(null)}
          onClick={() => setRating(value - 0.5)}
        />

        <div
          className="absolute right-0 top-0 z-10 h-full w-1/2 cursor-pointer"
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(null)}
          onClick={() => setRating(value)}
        />

        <svg viewBox="0 0 24 24" className="h-8 w-8" fill={fill}>
          <defs>
            <linearGradient id="half-gradient">
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#2f3744" />
            </linearGradient>
          </defs>
          <path d="M12 .587l3.668 7.431L24 9.748l-6 5.845L19.335 24 12 20.201 4.665 24 6 15.593 0 9.748l8.332-1.73z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#12161f] p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Write a Review</h3>
          <p className="mt-1 text-sm text-gray-400">
            Share your experience with the product and add images if you want.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-[#0d1118] p-4">
        <p className="text-sm font-medium text-white">Your Rating</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {[...Array(5)].map((_, i) => renderStar(i))}
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Selected rating: <span className="text-white">{rating || 0}</span>
        </p>
      </div>

      <div className="mt-3">
        <label className="mb-2 block text-sm font-medium text-gray-200">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="min-h-24 w-full rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-400/40"
          rows="3"
        />
      </div>

      <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-[#0d1118] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white">Review Images</p>
            <p className="mt-1 text-sm text-gray-400">
              Optional screenshots or real photos from your order.
            </p>
          </div>

          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              id="fileUpload"
              className="hidden"
            />

            <label
              htmlFor="fileUpload"
              className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:border-orange-400/30 hover:text-orange-300"
            >
              Choose Images
            </label>
          </div>
        </div>

        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.preview}
                  alt="preview"
                  className="h-20 w-20 rounded-2xl object-cover border border-white/10"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-400">
          Only logged-in customers with a completed purchase can review.
        </p>

        <button
          onClick={handleSubmit}
          className="rounded-2xl bg-orange-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
