import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "../components/ThemeToggle";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "◫" },
  { to: "/admin/products", label: "Products", icon: "◻" },
  { to: "/admin/orders", label: "Orders", icon: "▤" },
  { to: "/admin/users", label: "Users", icon: "◌" },
];

const AdminLayout = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  const currentPage =
    navItems.find((item) => location.pathname.startsWith(item.to))?.label ||
    "Admin";

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-[#10141d] p-5 lg:border-b-0 lg:border-r">
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#171c27_0%,#12161f_100%)] p-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
              Admin Panel
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              HS Shop Control
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Manage catalog, orders, users, and store performance from one
              place.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border-orange-400/30 bg-orange-400/10 text-orange-300"
                      : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                  }`
                }
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/20 text-sm">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-[#12161f] p-5">
            <p className="text-sm font-semibold text-white">
              Signed in as admin
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {user?.name || "Admin User"}
            </p>
            <p className="mt-1 text-xs text-gray-500">{user?.email}</p>

            <Link
              to="/"
              className="mt-4 inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-orange-400/30 hover:text-orange-300"
            >
              Back to Store
            </Link>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#12161f] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                Admin Workspace
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                {currentPage}
              </h1>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300">
              Welcome, {user?.name || "Admin"}
            </div>

            <ThemeToggle />
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
