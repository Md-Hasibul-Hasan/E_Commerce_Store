import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../features/cart/cartSlice";

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-400/50 focus:outline-none";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <CheckoutSteps step1 step2 />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-[#12161f] p-6 sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
                Checkout
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Shipping Address
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Tell us where to deliver your order. You can update this before
                placing the final order.
              </p>
            </div>

            <form onSubmit={submitHandler} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, road, area"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dhaka"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1207"
                  className={inputClasses}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm text-gray-300">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Bangladesh"
                  className={inputClasses}
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-orange-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-500 sm:w-auto"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </section>

          <aside className="h-fit rounded-3xl border border-white/10 bg-[#12161f] p-6">
            <h2 className="text-xl font-semibold">Why we need this</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Your address is used for delivery, shipping calculation, and order
              confirmation details.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                <p className="text-sm font-medium text-white">
                  Secure checkout
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Your information is only used to process your order.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                <p className="text-sm font-medium text-white">
                  Fast delivery updates
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Accurate address details help us avoid delivery delays.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
