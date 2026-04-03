import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const { userInfo } = useSelector((state) => state.user);

  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
    pending: 0,
    products: 0,
    totalStock: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API}/api/admin/stats/`, {
          headers: { Authorization: `Bearer ${userInfo.access}` },
        });

        setStats({
          users: data.users || 0,
          orders: data.orders || 0,
          delivered: data.delivered || 0,
          cancelled: data.cancelled || 0,
          returned: data.returned || 0,
          pending: data.pending || 0,
          products: data.products || 0,
          totalStock: data.total_stock || 0,
          revenue: Number(data.revenue || 0),
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [userInfo]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#171c27_0%,#12161f_100%)] p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
          Overview
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Store Performance
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          Monitor the most important numbers across users, orders, catalog, and
          revenue from one dashboard.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Users"
          value={stats.users}
          helper="Registered accounts"
          accent="text-blue-300"
          border="border-blue-500/20"
          bg="bg-blue-500/10"
        />
        <StatCard
          title="Revenue"
          value={`Tk ${stats.revenue.toFixed(2)}`}
          helper="Successful orders revenue"
          accent="text-pink-300"
          border="border-pink-500/20"
          bg="bg-pink-500/10"
        />
        <StatCard
          title="Products"
          value={stats.products}
          helper="Live items in catalog"
          accent="text-orange-300"
          border="border-orange-500/20"
          bg="bg-orange-500/10"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Stock"
          value={stats.totalStock}
          helper="Units currently available"
          accent="text-cyan-300"
          border="border-cyan-500/20"
          bg="bg-cyan-500/10"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          helper="All placed orders"
          accent="text-green-300"
          border="border-green-500/20"
          bg="bg-green-500/10"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          helper="Orders waiting payment"
          accent="text-amber-300"
          border="border-amber-500/20"
          bg="bg-amber-500/10"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Delivered"
          value={stats.delivered}
          helper="Completed deliveries"
          accent="text-sky-300"
          border="border-sky-500/20"
          bg="bg-sky-500/10"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          helper="Cancelled orders"
          accent="text-red-300"
          border="border-red-500/20"
          bg="bg-red-500/10"
        />
        <StatCard
          title="Returned"
          value={stats.returned}
          helper="Returned orders"
          accent="text-amber-300"
          border="border-amber-500/20"
          bg="bg-amber-500/10"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-[#12161f] p-6">
          <h3 className="text-xl font-semibold text-white">Snapshot</h3>
          <p className="mt-2 text-sm text-gray-400">
            A quick summary of how the store is performing right now.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoBlock
              label="Average revenue per order"
              value={
                stats.delivered > 0
                  ? `Tk ${(stats.revenue / stats.delivered).toFixed(2)}`
                  : "Tk 0.00"
              }
            />
            <InfoBlock
              label="Catalog density"
              value={
                stats.users > 0
                  ? `${(stats.products / stats.users).toFixed(2)} products per user`
                  : `${stats.products} products`
              }
            />
            <InfoBlock
              label="Average stock per product"
              value={
                stats.products > 0
                  ? `${(stats.totalStock / stats.products).toFixed(2)} units`
                  : "0.00 units"
              }
            />
            <InfoBlock
              label="Delivery completion"
              value={
                stats.orders > 0
                  ? `${((stats.delivered / stats.orders) * 100).toFixed(1)}%`
                  : "0.0%"
              }
            />
            <InfoBlock
              label="Cancellation rate"
              value={
                stats.orders > 0
                  ? `${((stats.cancelled / stats.orders) * 100).toFixed(1)}%`
                  : "0.0%"
              }
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#12161f] p-6">
          <h3 className="text-xl font-semibold text-white">Admin Notes</h3>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Use the sidebar to manage products, process pending orders, and
            update user roles when needed.
          </p>

          <div className="mt-6 space-y-3">
            <NoteCard text="Review new products and keep catalog details updated." />
            <NoteCard text="Check recent orders regularly so delivery status stays accurate." />
            <NoteCard text="Use the users section to promote or manage admin access safely." />
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, helper, accent, border, bg }) => {
  return (
    <div className={`rounded-3xl border ${border} ${bg} p-5`}>
      <p className="text-xs uppercase tracking-[0.18em] text-white/60">
        {title}
      </p>
      <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
      <p className="mt-2 text-sm text-white/70">{helper}</p>
    </div>
  );
};

const InfoBlock = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
};

const NoteCard = ({ text }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4 text-sm leading-6 text-gray-300">
      {text}
    </div>
  );
};

export default AdminDashboard;
