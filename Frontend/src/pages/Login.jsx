import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin } from "../features/user/userThunk";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import Message from "../components/Message";
import Loader from "../components/Loader";

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-400/40 focus:outline-none";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";

  const { userInfo, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      toast.success("Login successful");
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }));

    if (remember) {
      localStorage.setItem("rememberEmail", email);
    } else {
      localStorage.removeItem("rememberEmail");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (googleResponse) => {
      const accessToken = googleResponse.access_token;
      dispatch(googleLogin(accessToken));
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("rememberEmail");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
              Welcome Back
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white xl:text-5xl">
              Sign in and continue shopping without losing your progress
            </h1>
            <p className="mt-5 text-sm leading-7 text-gray-400 sm:text-base">
              Access your cart, track orders, manage your profile, and pick up
              right where you left off.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#12161f] p-5">
                <p className="text-sm font-semibold text-white">Saved Cart</p>
                <p className="mt-2 text-sm text-gray-400">
                  Your items stay synced when you sign in.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#12161f] p-5">
                <p className="text-sm font-semibold text-white">Order Access</p>
                <p className="mt-2 text-sm text-gray-400">
                  Check status, payments, and delivery details anytime.
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
              Sign In
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your details to access your account.
            </p>
          </div>

          {error && (
            <Message variant="error">
              {error?.detail || "Invalid email or password"}
            </Message>
          )}

          {loading && <Loader />}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className={inputClasses}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  className={`${inputClasses} pr-16`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition hover:text-white"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-orange-400"
              />
              Remember Me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-orange-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-500 disabled:opacity-50"
            >
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-gray-500">
            <div className="h-px flex-1 bg-white/10" />
            <span>Or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={() => handleGoogleLogin()}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            New customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="font-medium text-orange-400 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
