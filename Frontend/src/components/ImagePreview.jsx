import { useEffect } from "react";

const ImagePreview = ({ images, current, setCurrent, onClose }) => {
  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-2 py-4 sm:px-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-orange-400 bg-white/10 text-orange-400 transition hover:bg-white/20 sm:h-11 sm:w-11 sm:right-6 sm:top-6"
        >
          ✕
        </button>

        {/* Prev button */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-orange-400 bg-gray-600 text-xl text-orange-400 transition hover:bg-white/20 sm:left-6 sm:h-11 sm:w-11 sm:text-2xl"
          >
            ‹
          </button>
        )}

        {/* Modal */}
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/10 bg-[#12161f] shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 sm:px-5 sm:py-3">
            <p className="text-xs sm:text-sm font-medium text-white">
              Image Preview
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              {current + 1} / {images.length}
            </p>
          </div>

          {/* Image */}
          <div className="flex items-center justify-center bg-[#0d1118] px-2 py-3 sm:px-6 sm:py-6">
            <img
              src={images[current]}
              alt="preview"
              className="max-h-[65vh] sm:max-h-[72vh] w-full object-contain"
            />
          </div>
        </div>

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-orange-400 bg-gray-600 text-xl text-orange-400 transition hover:bg-white/20 sm:right-6 sm:h-11 sm:w-11 sm:text-2xl"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;


// import { useEffect } from "react";

// const ImagePreview = ({ images, current, setCurrent, onClose }) => {
//   const next = () => {
//     setCurrent((prev) => (prev + 1) % images.length);
//   };

//   const prev = () => {
//     setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.key === "ArrowRight") next();
//       if (e.key === "ArrowLeft") prev();
//       if (e.key === "Escape") onClose();
//     };

//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [images.length, onClose]);

//   return (
//     <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
//       <div className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
//         >
//           x
//         </button>

//         {images.length > 1 && (
//           <button
//             onClick={prev}
//             className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:left-6"
//           >
//             ‹
//           </button>
//         )}

//         <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#12161f] shadow-2xl">
//           <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
//             <p className="text-sm font-medium text-white">Image Preview</p>
//             <p className="text-sm text-gray-400">
//               {current + 1} / {images.length}
//             </p>
//           </div>

//           <div className="flex items-center justify-center bg-[#0d1118] px-4 py-5 sm:px-6 sm:py-6">
//             <img
//               src={images[current]}
//               alt="preview"
//               className="max-h-[72vh] w-full object-contain"
//             />
//           </div>
//         </div>

//         {images.length > 1 && (
//           <button
//             onClick={next}
//             className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:right-6"
//           >
//             ›
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImagePreview;
