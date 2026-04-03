import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCartAsync } from "../features/cart/cartThunk";
import { clearBuyNow } from "../features/cart/cartSlice";
import CartItem from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const checkouthandler = () => {
    dispatch(clearBuyNow());
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 transition hover:border-orange-400/40 hover:text-white"
          >
            <span>←</span>
            <span>Continue Shopping</span>
          </Link>

          <div className="text-sm text-gray-400">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Review your selected products, update quantities, and continue to
            checkout when you're ready.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#12161f] p-8 text-center sm:p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
              🛒
            </div>
            <h2 className="text-xl font-semibold text-white">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Add something you love and it will show up here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-2xl bg-orange-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#12161f]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Cart Items
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Adjust quantity or remove items before checkout.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-gray-500">
                    <tr>
                      <th className="px-4 py-4 text-left sm:px-6">Image</th>
                      <th className="px-4 py-4 text-left">Product</th>
                      <th className="px-4 py-4 text-left">Price</th>
                      <th className="px-4 py-4 text-left">Quantity</th>
                      <th className="px-4 py-4 text-left">Total</th>
                      <th className="px-4 py-4 text-left sm:px-6">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item) => (
                      <CartItem key={item.id} product={item} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="h-fit rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-white">
                Order Summary
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                A quick overview of your current order before you continue.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Total Items</span>
                    <span className="font-medium text-white">{totalItems}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Subtotal</span>
                    <span className="text-2xl font-bold text-orange-400">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={checkouthandler}
                  className="w-full rounded-2xl bg-orange-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => dispatch(clearCartAsync())}
                  className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                >
                  Clear Cart
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm leading-6 text-gray-400">
                  Shipping, tax, and payment details will be added in the next
                  steps.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
