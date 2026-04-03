import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { getUserProfile, refreshToken } from "./features/user/userThunk";
import { logout } from "./features/user/userSlice";
import { syncCartAsync } from "./features/cart/cartThunk";
import { useTheme } from "./components/ThemeProvider";

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const getTokenExpiryMs = (token) => {
  const decoded = parseJwt(token);
  return decoded?.exp ? decoded.exp * 1000 : null;
};

const App = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { userInfo, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { theme } = useTheme();

  useEffect(() => {
    if (!userInfo?.access) return;

    const expiryMs = getTokenExpiryMs(userInfo.access);
    if (!expiryMs) {
      dispatch(logout());
      return;
    }

    const nowMs = Date.now();
    const timeUntilExpiry = expiryMs - nowMs;
    const refreshDelay = timeUntilExpiry - 10000; // refresh 10s before expiry

    const refreshNow = () => {
      dispatch(refreshToken())
        .unwrap()
        .then(() => {
          if (!user) dispatch(getUserProfile());
        })
        .catch(() => dispatch(logout()));
    };

    if (timeUntilExpiry <= 0) {
      refreshNow();
      return;
    }

    if (timeUntilExpiry <= 10000) {
      refreshNow();
      return;
    }

    if (!user) {
      dispatch(getUserProfile());
    }

    const timeoutId = setTimeout(() => {
      refreshNow();
    }, refreshDelay);

    return () => clearTimeout(timeoutId);
  }, [dispatch, userInfo, user]);

  useEffect(() => {
    if (userInfo?.access) {
      dispatch(syncCartAsync());
    }
  }, [dispatch, userInfo]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.08),_transparent_28%),linear-gradient(180deg,#090b10_0%,#0b0f14_100%)] text-white">
      <div className="flex min-h-screen flex-col">
        {!isAdmin && <Header />}

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>

      <ToastContainer position="top-right" autoClose={2000} theme={theme} />
    </div>
  );
};

export default App;



