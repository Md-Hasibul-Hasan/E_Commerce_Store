import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/user/userThunk";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-400/40 focus:outline-none";

const Register = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.user);

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    re_password: "",
  });

  const { name, email, password, re_password } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== re_password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        registerUser({ name, email, password, re_password })
      ).unwrap();

      toast.success("Check your email to activate your account");
    } catch (err) {
      const alreadyExists =
        err?.email?.[0]?.toLowerCase().includes("already") ||
        err?.detail?.toLowerCase().includes("already");

      if (alreadyExists) {
        try {
          await axios.post(`${API}/auth/users/resend_activation/`, {
            email,
          });

          toast.success("Activation email sent again");
        } catch (resendErr) {
          toast.error("Failed to resend activation");
        }
      } else {
        toast.error(
          err?.email?.[0] || err?.detail || "Registration failed"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
              New Account
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white xl:text-5xl">
              Create your account and start shopping with a personalized experience
            </h1>
            <p className="mt-5 text-sm leading-7 text-gray-400 sm:text-base">
              Save your cart, track orders, manage your profile, and get a
              smoother checkout flow across devices.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#12161f] p-5">
                <p className="text-sm font-semibold text-white">
                  Faster Checkout
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Keep your shipping and account details ready for future orders.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#12161f] p-5">
                <p className="text-sm font-semibold text-white">
                  Order Tracking
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Access order history and payment details anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#12161f] p-6 shadow-xl sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
              Account
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Register
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Create your account to continue.
            </p>
          </div>

          {error && (
            <Message variant="error">
              {error?.email?.[0] || error?.detail || "Registration failed"}
            </Message>
          )}

          {loading && <Loader />}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                className={inputClasses}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                className={inputClasses}
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                className={inputClasses}
                placeholder="Create password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                name="re_password"
                value={re_password}
                onChange={onChange}
                required
                className={inputClasses}
                placeholder="Confirm password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-orange-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="font-medium text-orange-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Register;
