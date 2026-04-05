import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetailsAsync,
  payOrderAsync,
  sslPayAsync,
} from "../features/order/orderThunk";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import ReviewForm from "../components/ReviewForm";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    loading,
    error,
    order,
    successPay,
    loadingPay,
    loadingSSL,
  } = useSelector((state) => state.order);

  const { userInfo, user } = useSelector((state) => state.user);

  const [showReview, setShowReview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    dispatch(getOrderDetailsAsync(id));
  }, [dispatch, id, userInfo, navigate]);

  useEffect(() => {
    if (successPay) {
      dispatch(getOrderDetailsAsync(id));
    }
  }, [successPay, dispatch, id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");

    if (status === "success") toast.success("Payment Successful");
    if (status === "fail") toast.error("Payment Failed");
    if (status === "cancel") toast.warning("Payment Cancelled");
  }, [location]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const successPaymentHandler = (details) => {
    dispatch(
      payOrderAsync({
        id: order.id,
        paymentResult: details,
      })
    );
  };

  if (loading || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0d12] px-4 text-white">
        <div className="rounded-3xl border border-white/10 bg-[#12161f] px-6 py-5 text-sm text-gray-300">
          Loading order details...
        </div>
      </div>
    );
  }

  const isPending = order.status === "pending";
  const isPaid = order.isPaid === true || order.status === "paid";
  const isCancelled = order.status === "cancelled";
  const isReturned = order.status === "returned";
  const isDelivered = Boolean(order.isDelivered);
  const isCOD = order.paymentMethod === "COD";
  const shippingAddress = order.shippingAddress || {};
  const shippingAddressText = [
    shippingAddress.address,
    shippingAddress.city,
    shippingAddress.postalCode,
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join(", ");

  const itemsPrice = order.orderitems
    ?.reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  const statusBanner = isReturned
    ? {
        title: "Order Returned",
        message: "This order was marked as returned. If needed, contact support for more details.",
        classes: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      }
    : isCancelled
    ? {
        title: "Order Cancelled",
        message: "This order was cancelled. You can place a new order anytime.",
        classes: "border-red-500/20 bg-red-500/10 text-red-300",
      }
    : isDelivered
    ? {
        title: "Order Delivered",
        message: "Your order has been delivered successfully.",
        classes: "border-blue-500/20 bg-blue-500/10 text-blue-300",
      }
    : isPaid
    ? {
        title: "Payment Successful",
        message: "Your payment was received and the order is being processed.",
        classes: "border-green-500/20 bg-green-500/10 text-green-300",
      }
    : isCOD
    ? {
        title: "Cash on Delivery",
        message:
          "Please receive the order and pay at your doorstep when it arrives.",
        classes: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      }
    : {
        title: "Payment Pending",
        message:
          "Please complete payment within 30 minutes to keep this order active.",
        classes: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/myorders"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 transition hover:border-orange-400/40 hover:text-white"
          >
            <span>&larr;</span>
            <span>Back to Orders</span>
          </Link>

          <div className="text-sm text-gray-400">Order #{order.id}</div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#171c27_0%,#12161f_100%)] p-6 sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
            Order Details
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Track Your Order
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Review shipping, payment, order items, and payment actions all in
            one place.
          </p>
        </div>

        <div
          className={`mt-6 rounded-3xl border px-5 py-4 sm:px-6 ${statusBanner.classes}`}
        >
          <p className="text-sm font-semibold">{statusBanner.title}</p>
          <p className="mt-1 text-sm opacity-90">{statusBanner.message}</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-6">
            <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
                <h2 className="text-xl font-semibold">Shipping</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Delivery and recipient information.
                </p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      Name: <span className="text-white">{user?.name || "Unavailable"}</span>
                    </p>
                    <p>
                      Email: <span className="text-white">{user?.email || "Unavailable"}</span>
                    </p>
                    <p className="leading-7">
                      Address:{" "}
                      <span className="text-white">
                        {shippingAddressText || "Shipping address unavailable"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  {isReturned ? (
                    <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-300">
                      Returned
                    </span>
                  ) : isDelivered ? (
                    <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-300">
                      Delivered
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-300">
                      Not Delivered
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
                <h2 className="text-xl font-semibold">Payment</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Payment method and live payment status.
                </p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                  <p className="text-sm text-gray-300">
                    Method:{" "}
                    <span className="font-medium text-white">
                      {order.paymentMethod || "Not selected"}
                    </span>
                  </p>
                </div>

                <div className="mt-4">
                  {isPaid ? (
                    <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-300">
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-300">
                      Not Paid
                    </span>
                  )}
                </div>

                {loadingPay && (
                  <p className="mt-4 text-sm text-yellow-300">
                    Processing payment...
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Order Items</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Everything included in this order.
                </p>
              </div>

              {order.orderitems?.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4 text-sm text-gray-400">
                  Order is empty.
                </div>
              ) : (
                <div className="space-y-4">
                  {order.orderitems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0d1118] p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/product/${item.product}`}
                          className="line-clamp-2 text-sm font-medium text-white transition hover:text-orange-300"
                        >
                          {item.name}
                        </Link>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            Qty: {item.qty}
                          </span>
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            Unit: Tk {item.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <span className="text-lg font-semibold text-orange-400">
                          Tk {(item.qty * item.price).toFixed(2)}
                        </span>

                        {isDelivered && !isReturned && (
                          <button
                            onClick={() => {
                              setSelectedProduct(item.product);
                              setShowReview(true);
                            }}
                            className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                          >
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:sticky sm:top-24 sm:p-6">
            <div className="rounded-2xl border border-orange-400/15 bg-orange-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-orange-200">
                Summary
              </p>
              <p className="mt-2 text-sm leading-6 text-orange-100/80">
                Payment totals and available order actions.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3">
                <span className="text-sm text-gray-400">Items</span>
                <span className="text-sm font-medium text-white">Tk {itemsPrice}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3">
                <span className="text-sm text-gray-400">Shipping</span>
                <span className="text-sm font-medium text-white">
                  Tk {order.shippingPrice}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3">
                <span className="text-sm text-gray-400">Tax</span>
                <span className="text-sm font-medium text-white">Tk {order.taxPrice}</span>
              </div>

              <div className="rounded-2xl border border-orange-400/25 bg-[#18120a] px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-200">Total</span>
                  <span className="text-2xl font-bold text-orange-400">
                    Tk {order.totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {isPending && order.paymentMethod === "PayPal" && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                <p className="mb-3 text-sm font-medium text-white">
                  Pay with PayPal
                </p>
                <PayPalScriptProvider
                  options={{
                    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                    currency: "USD",
                  }}
                >
                  <PayPalButtons
                    createOrder={(data, actions) =>
                      actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: order.totalPrice,
                            },
                          },
                        ],
                      })
                    }
                    onApprove={(data, actions) =>
                      actions.order.capture().then(successPaymentHandler)
                    }
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {isPending && order.paymentMethod === "SSLCommerz" && (
              <button
                onClick={() => dispatch(sslPayAsync(order.id))}
                disabled={isPaid}
                className="mt-5 w-full rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
              >
                {loadingSSL ? "Processing..." : "Pay with SSLCommerz"}
              </button>
            )}

            {isCancelled && (
              <p className="mt-5 text-sm text-red-300">
                This order was cancelled. You can continue shopping and place a
                new order.
              </p>
            )}

            {isReturned && (
              <p className="mt-5 text-sm text-amber-300">
                This order was returned. You can continue shopping and place a
                new order.
              </p>
            )}

            {(isPaid || isCancelled || isReturned || order.paymentMethod === "COD") && (
              <button
                onClick={() => navigate("/")}
                className="mt-5 w-full rounded-2xl bg-orange-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
              >
                Continue Shopping
              </button>
            )}
          </aside>
        </div>

        {showReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-4">
            <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#1a1a1a] p-4 sm:p-5">
              <button
                onClick={() => setShowReview(false)}
                className="absolute right-4 top-4 text-lg text-white/80 transition hover:text-white"
              >
                x
              </button>

              <ReviewForm
                productId={selectedProduct}
                orderId={order.id}
                onClose={() => setShowReview(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
