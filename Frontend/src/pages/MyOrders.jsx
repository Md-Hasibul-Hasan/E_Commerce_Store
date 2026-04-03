import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { listMyOrdersAsync } from "../features/order/orderThunk";
import { toast } from "react-toastify";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    dispatch(listMyOrdersAsync());
  }, [dispatch, userInfo, navigate]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const getStatusStyles = (status, isDelivered) => {
    if (status === "returned") {
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    }

    if (isDelivered) {
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    }

    switch (status) {
      case "pending":
        return "border-amber-500/20 bg-amber-500/10 text-amber-300";
      case "paid":
        return "border-green-500/20 bg-green-500/10 text-green-300";
      case "cancelled":
        return "border-red-500/20 bg-red-500/10 text-red-300";
      default:
        return "border-white/10 bg-white/[0.04] text-gray-300";
    }
  };

  const getStatusLabel = (status, isDelivered) => {
    if (status === "returned") return "Returned";
    if (isDelivered) return "Delivered";
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0d12] px-4 text-white">
        <div className="rounded-3xl border border-white/10 bg-[#12161f] px-6 py-5 text-sm text-gray-300">
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#171c27_0%,#12161f_100%)] p-6 sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
            Order History
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Track all your previous purchases, check their status, and jump back
            into any order whenever you need details or reviews.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-[#12161f] p-8 text-center sm:p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
              📦
            </div>
            <h2 className="text-xl font-semibold text-white">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Once you place an order, it will appear here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-2xl bg-orange-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                        Order ID
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">
                        #{order.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                        Total
                      </p>
                      <p className="mt-2 text-lg font-semibold text-orange-400">
                        ৳ {order.totalPrice}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                        Payment
                      </p>
                      <p className="mt-2 text-sm text-gray-300">
                        {order.paymentMethod || "Not set"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                        Status
                      </p>
                      <span
                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getStatusStyles(
                          order.status,
                          order.isDelivered
                        )}`}
                      >
                        {getStatusLabel(order.status, order.isDelivered)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="rounded-2xl bg-orange-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
                    >
                      View Details
                    </button>

                    {order.isDelivered && order.status !== "returned" && (
                      <button
                        onClick={() => navigate(`/order/${order.id}`)}
                        className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
                      >
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
