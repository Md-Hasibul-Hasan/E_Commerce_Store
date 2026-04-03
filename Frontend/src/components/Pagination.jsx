import { useNavigate, useLocation } from "react-router-dom";

const Pagination = ({ page, pages }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const changePage = (nextPage) => {
    const params = new URLSearchParams(location.search);
    params.set("page", nextPage);
    navigate(`/?${params.toString()}`);
  };

  if (pages <= 1) return null;

  const visiblePages = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(pages, page + 1);

  for (let current = start; current <= end; current += 1) {
    visiblePages.push(current);
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <button
        disabled={page === 1}
        onClick={() => changePage(page - 1)}
        className="rounded-2xl border border-white/10 bg-[#12161f] px-4 py-2 text-sm font-medium text-white transition hover:border-orange-400/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-45"
      >
        Prev
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => changePage(1)}
            className="rounded-2xl border border-white/10 bg-[#12161f] px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-orange-400/30 hover:bg-white/[0.04]"
          >
            1
          </button>
          {start > 2 && <span className="px-1 text-gray-500">...</span>}
        </>
      )}

      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => changePage(pageNumber)}
          className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
            pageNumber === page
              ? "bg-orange-400 text-black"
              : "border border-white/10 bg-[#12161f] text-gray-200 hover:border-orange-400/30 hover:bg-white/[0.04]"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {end < pages && (
        <>
          {end < pages - 1 && <span className="px-1 text-gray-500">...</span>}
          <button
            onClick={() => changePage(pages)}
            className="rounded-2xl border border-white/10 bg-[#12161f] px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-orange-400/30 hover:bg-white/[0.04]"
          >
            {pages}
          </button>
        </>
      )}

      <button
        disabled={page === pages}
        onClick={() => changePage(page + 1)}
        className="rounded-2xl border border-white/10 bg-[#12161f] px-4 py-2 text-sm font-medium text-white transition hover:border-orange-400/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-45"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
