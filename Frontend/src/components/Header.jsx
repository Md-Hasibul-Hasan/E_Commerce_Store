import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";
import SearchBar from "./SearchBar";
import Filter_Ordering from "./Filter_Ordering";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo, user } = useSelector((state) => state.user);

  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const isHomePage = location.pathname === "/";

  const closeMenus = () => {
    setOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenus();
  };

  const profileImage =
    user?.image || `https://ui-avatars.com/api/?name=${user?.name || "User"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0f1111]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={closeMenus}
            className="shrink-0 text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
          >
            HS <span className="text-orange-400">Shop</span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
            <SearchBar className="min-w-0 flex-1" />
            {isHomePage && <Filter_Ordering className="shrink-0" />}
          </div>

          <div className="ml-auto hidden bg items-center gap-2 md:flex">
            <ThemeToggle />
            <Link
              to="/cart"
              className="relative flex items-center gap-1 border rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cart
              <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-semibold text-white">
                {totalItems}
              </span>
            </Link>

            {!userInfo ? (
              <Link
                to="/login"
                className="rounded-md bg-orange-400 px-3 py-2 text-sm font-medium text-black transition hover:bg-orange-500"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-200 transition hover:bg-gray-800"
                >
                  <img
                    src={profileImage}
                    alt="profile"
                    className="h-9 w-9 rounded-full object-cover border border-gray-300 dark:border-gray-700 shadow-sm"
                  />
                  <span className="text-xs text-gray-400">▾</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161616] py-1 shadow-lg">
                    <Link
                      to="/profile"
                      onClick={closeMenus}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/myorders"
                      onClick={closeMenus}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                    >
                      My Orders
                    </Link>
                    {user?.is_staff && (
                      <Link
                        to="/admin/dashboard"
                        onClick={closeMenus}
                        className="block px-4 py-2 text-sm text-orange-400 hover:bg-gray-800"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen((prev) => !prev);
              setOpen(false);
            }}
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:bg-gray-800 md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <span className="text-lg leading-none">✕</span>
            ) : (
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-white" />
                <span className="block h-0.5 w-5 rounded-full bg-white" />
                <span className="block h-0.5 w-5 rounded-full bg-white" />
              </span>
            )}
          </button>
        </div>

        <div className="mt-3 space-y-3 lg:hidden">
          <SearchBar />
          {isHomePage && <Filter_Ordering />}
        </div>

        {mobileMenuOpen && (
          <div className="mt-3 space-y-2 border-t border-gray-800 pt-3 md:hidden">
            <div className="flex justify-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <ThemeToggle />
            </div>
            <Link
              to="/cart"
              onClick={closeMenus}
              className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"
            >
              Cart ({totalItems})
            </Link>

            {!userInfo ? (
              <Link
                to="/login"
                onClick={closeMenus}
                className="block rounded-md bg-orange-400 px-3 py-2 text-sm font-medium text-black"
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={closeMenus}
                  className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"
                >
                  Profile
                </Link>
                <Link
                  to="/myorders"
                  onClick={closeMenus}
                  className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"
                >
                  My Orders
                </Link>
                {user?.is_staff && (
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMenus}
                    className="block rounded-md px-3 py-2 text-sm text-orange-400 hover:bg-gray-800"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-800"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
