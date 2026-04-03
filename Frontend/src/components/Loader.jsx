const Loader = () => {
  return (
    <div className="flex justify-center py-16">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#12161f] px-5 py-3 text-sm text-gray-300 shadow-lg">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
        <span>Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
