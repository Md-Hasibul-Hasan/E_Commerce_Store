const variantStyles = {
  success:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  error: "border-red-500/20 bg-red-500/10 text-red-300",
  info: "border-sky-500/20 bg-sky-500/10 text-sky-300",
};

const Message = ({ variant = "info", children }) => {
  return (
    <div
      className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${variantStyles[variant]}`}
    >
      {children}
    </div>
  );
};

export default Message;
