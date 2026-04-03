import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-400/40";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    new_password: "",
    re_new_password: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.re_new_password) {
      return toast.error("Passwords do not match");
    }

    try {
      await axios.post(`${API}/auth/users/reset_password_confirm/`, {
        uid,
        token,
        new_password: form.new_password,
        re_new_password: form.re_new_password,
      });

      toast.success("Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Reset failed");
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-9rem)] place-items-center">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#12161f] shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.18),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0))] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
              Account Recovery
            </p>
            <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight text-white">
              Set a fresh password and get back into your account.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
              Choose a strong new password you have not used before. After
              reset, you will be redirected to the login page automatically.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0d1118]/80 p-5">
            <p className="text-sm font-medium text-white">Quick tips</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li>Use at least 8 characters.</li>
              <li>Mix uppercase, lowercase, numbers, and symbols.</li>
              <li>Avoid reusing your previous password.</li>
            </ul>
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300 lg:hidden">
              Account Recovery
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Reset Password
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Enter your new password below and confirm it to finish the reset.
            </p>

            <form onSubmit={submitHandler} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={form.new_password}
                  onChange={(e) =>
                    setForm({ ...form, new_password: e.target.value })
                  }
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={form.re_new_password}
                  onChange={(e) =>
                    setForm({ ...form, re_new_password: e.target.value })
                  }
                  className={inputClasses}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-orange-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
              >
                Reset Password
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-400">
              Remembered it?
              <Link
                to="/login"
                className="ml-2 font-medium text-orange-300 transition hover:text-orange-200"
              >
                Back to login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResetPassword;
