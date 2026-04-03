import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const Activate = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await axios.post(`${API}/auth/users/activation/`, {
          uid,
          token,
        });

        setStatus("success");
        toast.success("Account activated successfully");
        setCountdown(3);
      } catch (error) {
        console.log(error.response?.data);
        setStatus("error");
        toast.error("Activation failed");
        setCountdown(3);
      }
    };

    activateAccount();
  }, [uid, token]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      navigate("/login");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const statusCopy =
    status === "success"
      ? {
          title: "Account Activated",
          message:
            "Your account is ready now. You will be redirected to login shortly.",
          badge:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        }
      : status === "error"
      ? {
          title: "Activation Failed",
          message:
            "This activation link may be invalid or already used. You can still go back to login and request another email if needed.",
          badge: "border-red-500/20 bg-red-500/10 text-red-300",
        }
      : {
          title: "Activating Account",
          message:
            "We are confirming your email and finishing account setup now.",
          badge:
            "border-orange-400/20 bg-orange-400/10 text-orange-300",
        };

  return (
    <div className="grid min-h-[calc(100vh-9rem)] place-items-center">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#12161f] shadow-2xl lg:grid-cols-[1.02fr_0.98fr]">
        <section className="hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0))] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
              Email Verification
            </p>
            <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight text-white">
              Finalizing your account activation.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
              Once activation finishes, you can sign in and continue shopping,
              tracking orders, and saving your cart across devices.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0d1118]/80 p-5">
            <p className="text-sm font-medium text-white">What happens next</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li>You are redirected to login automatically.</li>
              <li>Your account becomes ready for full sign-in.</li>
              <li>You can request a new activation email if needed.</li>
            </ul>
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300 lg:hidden">
              Email Verification
            </p>

            <div
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusCopy.badge}`}
            >
              {status === "loading"
                ? "In Progress"
                : status === "success"
                ? "Success"
                : "Needs Attention"}
            </div>

            <h2 className="mt-4 text-3xl font-semibold text-white">
              {statusCopy.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {statusCopy.message}
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-[#0d1118] p-5">
              <p className="text-sm font-medium text-white">
                Redirecting to login
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {countdown !== null ? `In ${countdown} second${countdown === 1 ? "" : "s"}.` : "Please wait..."}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-orange-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
              >
                Go to Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition hover:border-orange-400/30 hover:text-orange-300"
              >
                Create Another Account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Activate;
