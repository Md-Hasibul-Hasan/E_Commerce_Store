import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrderAsync } from "../features/order/orderThunk";
import { resetOrder } from "../features/order/orderSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, buyNowItem, shippingAddress, paymentMethod } =
    useSelector((state) => state.cart);

  const { loading, success, order, error } = useSelector(
    (state) => state.order
  );

  const items = buyNowItem ? [buyNowItem] : cartItems;

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }

    if (!paymentMethod) {
      navigate("/payment");
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const itemsPrice = items
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const shippingPrice = Number(itemsPrice) > 1000 ? 0 : 120;
  const taxPrice = (Number(itemsPrice) * 0.05).toFixed(2);

  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order.id}`);
      dispatch(resetOrder());
    }
  }, [success, order, navigate, dispatch]);

  const placeOrderHandler = () => {
    dispatch(
      createOrderAsync({
        orderItems: items,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <CheckoutSteps step1 step2 step3 step4 />

        <div className="mb-8 mt-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
            Checkout
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Review and Place Order
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Double-check your shipping details, payment method, and order items
            before confirming your purchase.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Your order will be delivered to this address.
                  </p>
                </div>

                <Link
                  to="/shipping"
                  className="text-sm text-orange-300 transition hover:text-orange-400"
                >
                  Edit
                </Link>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0d1118] p-4 text-sm leading-7 text-gray-300">
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    The selected payment option for this order.
                  </p>
                </div>

                <Link
                  to="/payment"
                  className="text-sm text-orange-300 transition hover:text-orange-400"
                >
                  Change
                </Link>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0d1118] p-4 text-sm text-gray-300">
                {paymentMethod}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Order Items</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Review each item in this order before placing it.
                </p>
              </div>

              {items.length === 0 ? (
                <p className="text-sm text-gray-400">No items selected.</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0d1118] p-4 sm:flex-row sm:items-center"
                    >
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="h-20 w-20 rounded-2xl bg-white object-contain p-2"
                      />

                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/product/${item.id}`}
                          className="line-clamp-2 text-sm font-medium text-white transition hover:text-orange-300"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-2 text-sm text-gray-400">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="text-sm text-gray-300 sm:text-right">
                        <div>
                          ৳ {item.price} x {item.quantity}
                        </div>
                        <div className="mt-1 text-base font-semibold text-white">
                          ৳ {(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <p className="mt-2 text-sm text-gray-400">
              Final totals for this purchase.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium text-white">৳ {itemsPrice}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="font-medium text-white">৳ {shippingPrice}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-sm">
                <span className="text-gray-400">Tax</span>
                <span className="font-medium text-white">৳ {taxPrice}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-orange-400/20 bg-orange-400/10 px-4 py-4">
                <span className="text-sm font-medium text-orange-200">Total</span>
                <span className="text-2xl font-bold text-orange-400">
                  ৳ {totalPrice}
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              onClick={placeOrderHandler}
              disabled={items.length === 0 || loading}
              className="mt-6 w-full rounded-2xl bg-orange-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              By placing this order, you confirm your shipping information and
              selected payment method.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
