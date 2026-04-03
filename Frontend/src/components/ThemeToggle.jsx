// import { useTheme } from "./ThemeProvider";

// const SunIcon = ({ active }) => (
//   <svg
//     viewBox="0 0 24 24"
//     aria-hidden="true"
//     className={`h-4 w-4 transition ${active ? "text-amber-900" : "text-gray-400"}`}
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="1.8"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <circle cx="12" cy="12" r="4" />
//     <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56" />
//   </svg>
// );

// const MoonIcon = ({ active }) => (
//   <svg
//     viewBox="0 0 24 24"
//     aria-hidden="true"
//     className={`h-4 w-4 transition ${active ? "text-slate-950" : "text-gray-400"}`}
//     fill="currentColor"
//   >
//     <path d="M20.2 14.4A8.5 8.5 0 0 1 9.6 3.8a.65.65 0 0 0-.77-.78A9.5 9.5 0 1 0 21 15.17a.65.65 0 0 0-.8-.77Z" />
//   </svg>
// );

// const ThemeToggle = ({ className = "" }) => {
//   const { theme, isLight, toggleTheme } = useTheme();

//   return (
//     <button
//       type="button"
//       onClick={toggleTheme}
//       className={`inline-flex items-center rounded-full border border-white/10 bg-[#11151d]/90 p-1 text-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:border-orange-400/30 ${className}`.trim()}
//       aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
//       title={`Switch to ${isLight ? "dark" : "light"} mode`}
//     >
//       <span className="relative flex h-9 w-[78px] items-center rounded-full bg-[#0b0f14] px-1">
//         <span
//           className={`absolute top-1 h-7 w-7 rounded-full bg-gradient-to-br from-orange-300 to-amber-500 shadow-[0_6px_16px_rgba(251,191,36,0.35)] transition-transform duration-200 ${
//             isLight ? "translate-x-9" : "translate-x-0"
//           }`}
//         />
//         <span className="relative z-10 flex w-full items-center justify-between px-1">
//           <span className="flex h-7 w-7 items-center justify-center">
//             <MoonIcon active={!isLight} />
//           </span>
//           <span className="flex h-7 w-7 items-center justify-center">
//             <SunIcon active={isLight} />
//           </span>
//         </span>
//       </span>
//     </button>
//   );
// };

// export default ThemeToggle;


import { useTheme } from "./ThemeProvider";

const SunIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`h-4 w-4 transition ${
      active ? "text-amber-900" : "text-gray-400"
    }`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56" />
  </svg>
);

const MoonIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`h-4 w-4 transition ${
      active ? "text-slate-950" : "text-gray-400"
    }`}
    fill="currentColor"
  >
    <path d="M20.2 14.4A8.5 8.5 0 0 1 9.6 3.8a.65.65 0 0 0-.77-.78A9.5 9.5 0 1 0 21 15.17a.65.65 0 0 0-.8-.77Z" />
  </svg>
);

const ThemeToggle = ({ className = "" }) => {
  const { isLight, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center rounded-full border border-white/10 bg-[#11151d]/90 p-1 text-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:border-orange-400/30 ${className}`.trim()}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      <span className="relative flex h-9 w-[78px] items-center rounded-full bg-[#0b0f14] px-1">
        
        {/* FIXED THUMB */}
        <span
          className={`absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-gradient-to-br from-orange-300 to-amber-500 shadow-[0_6px_16px_rgba(251,191,36,0.35)] transition-transform duration-200 ${
            isLight ? "translate-x-[38px]" : "translate-x-[2px]"
          }`}
        />

        {/* ICONS */}
        <span className="relative z-10 flex w-full items-center justify-between px-[2px]">
          <span className="flex h-7 w-7 items-center justify-center">
            <MoonIcon active={!isLight} />
          </span>
          <span className="flex h-7 w-7 items-center justify-center">
            <SunIcon active={isLight} />
          </span>
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;