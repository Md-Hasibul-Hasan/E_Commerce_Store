import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  deleteAccount,
} from "../features/user/userThunk";
import { toast } from "react-toastify";

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-orange-400/40 focus:outline-none";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: null,
  });

  const [pass, setPass] = useState({
    current_password: "",
    new_password: "",
    re_new_password: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        image: null,
      });
    }
  }, [user]);

  const parseErrors = (err) => {
    const data = err?.response?.data || err;

    if (typeof data === "object") {
      setErrors(data);
      const firstKey = Object.keys(data)[0];
      return data[firstKey]?.[0] || data[firstKey];
    }

    return data || "Something went wrong";
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setErrors({});

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) data.append(key, form[key]);
    });

    try {
      await dispatch(updateUserProfile(data)).unwrap();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(parseErrors(err));
    }
  };

  const changePassHandler = async (e) => {
    e.preventDefault();
    setErrors({});

    if (pass.new_password !== pass.re_new_password) {
      setErrors({ re_new_password: ["Passwords do not match"] });
      return;
    }

    try {
      await dispatch(
        changePassword({
          current_password: pass.current_password,
          new_password: pass.new_password,
          re_new_password: pass.re_new_password,
        })
      ).unwrap();

      toast.success("Password changed");

      setPass({
        current_password: "",
        new_password: "",
        re_new_password: "",
      });
    } catch (err) {
      toast.error(parseErrors(err));
    }
  };

  const forgetHandler = async () => {
    setErrors({});
    try {
      await dispatch(forgotPassword(form.email)).unwrap();
      toast.success("Reset email sent");
    } catch (err) {
      toast.error(parseErrors(err));
    }
  };

  const deleteHandler = async () => {
    const confirm = window.prompt("Enter password:");
    if (!confirm) return;

    try {
      await dispatch(deleteAccount(confirm)).unwrap();
      toast.success("Account deleted");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    } catch (err) {
      toast.error(parseErrors(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#171c27_0%,#12161f_100%)] p-6 sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
            My Account
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile Settings
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Update your personal details, change your password, and manage your
            account from one place.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#12161f] p-6 text-center">
              <img
                src={user?.image || "https://ui-avatars.com/api/?name=User"}
                alt="profile"
                className="mx-auto h-28 w-28 rounded-full border-4 border-white/10 object-cover"
              />
              <h2 className="mt-4 text-2xl font-semibold text-white">
                {user?.name || "User"}
              </h2>
              <p className="mt-1 text-sm text-gray-400">{user?.email}</p>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4 text-left">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Phone
                  </p>
                  <p className="mt-2 text-sm text-white">
                    {user?.phone || "Not added yet"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4 text-left">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Address
                  </p>
                  <p className="mt-2 text-sm text-white">
                    {user?.address || "Not added yet"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#12161f] p-6">
              <h3 className="text-lg font-semibold text-white">
                Quick Actions
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Manage security and account access.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  onClick={forgetHandler}
                  className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-300 transition hover:bg-green-500/20"
                >
                  Send Reset Email
                </button>

                <button
                  onClick={deleteHandler}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <form
              onSubmit={updateHandler}
              className="rounded-3xl border border-white/10 bg-[#12161f] p-6 sm:p-8"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  Update Profile
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Keep your account details accurate and up to date.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Full Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className={inputClasses}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400">{errors.name[0]}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Email
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Your email"
                    className={inputClasses}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email[0]}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone number"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Address
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="Address"
                    className={inputClasses}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-gray-300">
                    Profile Image
                  </label>
                  <div className="rounded-2xl border border-dashed border-white/15 bg-[#0d1118] p-4">
                    <input
                      type="file"
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.files[0] })
                      }
                      className="w-full text-sm text-gray-400 file:mr-4 file:rounded-xl file:border-0 file:bg-orange-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
                    />
                  </div>
                </div>
              </div>

              <button className="mt-6 rounded-2xl bg-orange-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-500">
                Save Changes
              </button>
            </form>

            <form
              onSubmit={changePassHandler}
              className="rounded-3xl border border-white/10 bg-[#12161f] p-6 sm:p-8"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  Change Password
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Use a strong password to keep your account secure.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Current password"
                    value={pass.current_password}
                    onChange={(e) =>
                      setPass({ ...pass, current_password: e.target.value })
                    }
                    className={inputClasses}
                  />
                  {errors.current_password && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.current_password[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="New password"
                    value={pass.new_password}
                    onChange={(e) =>
                      setPass({ ...pass, new_password: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={pass.re_new_password}
                    onChange={(e) =>
                      setPass({ ...pass, re_new_password: e.target.value })
                    }
                    className={inputClasses}
                  />
                  {errors.re_new_password && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.re_new_password[0]}
                    </p>
                  )}
                </div>
              </div>

              <button className="mt-6 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
                Update Password
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
