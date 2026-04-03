import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../features/cart/cartSlice";

const methods = [
  {
    value: "COD",
    title: "Cash on Delivery",
    subtitle: "Pay when your order arrives.",
  },
  {
    value: "PayPal",
    title: "PayPal / Card",
    subtitle: "Use PayPal or a connected card.",
  },
  {
    value: "SSLCommerz",
    title: "SSLCommerz",
    subtitle: "Pay with local gateway options.",
  },
];

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress, paymentMethod: savedMethod } = useSelector(
    (state) => state.cart
  );

  const [paymentMethod, setPaymentMethod] = useState(savedMethod || "COD");

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <CheckoutSteps step1 step2 step3 />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-[#12161f] p-6 sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
                Checkout
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Payment Method
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Choose how you want to pay. You can review everything again on
                the final step before placing the order.
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
              {methods.map((method) => {
                const selected = paymentMethod === method.value;

                return (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                      selected
                        ? "border-orange-400/40 bg-orange-400/10"
                        : "border-white/10 bg-[#0d1118] hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={selected}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 accent-orange-400"
                    />

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {method.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        {method.subtitle}
                      </p>
                    </div>
                  </label>
                );
              })}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-orange-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-500 sm:w-auto"
                >
                  Continue to Review
                </button>
              </div>
            </form>
          </section>

          <aside className="h-fit rounded-3xl border border-white/10 bg-[#12161f] p-6">
            <h2 className="text-xl font-semibold">Payment Notes</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Select the option that works best for you. You will confirm the
              order details on the next page.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                <p className="text-sm font-medium text-white">
                  Flexible payment
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Keep COD for simplicity or use online payment for faster
                  confirmation.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                <p className="text-sm font-medium text-white">
                  Secure processing
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Payment selection is stored only for this checkout flow.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Payment;
