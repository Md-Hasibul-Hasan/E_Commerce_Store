import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API = import.meta.env.VITE_API_URL;

const AdminUsers = () => {
  const { userInfo, user } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/api/users/`, {
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
        },
      });

      setUsers(data.results || data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await axios.delete(`${API}/api/users/${id}/`, {
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
        },
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAdmin = async (id) => {
    try {
      setLoadingId(id);

      await axios.put(
        `${API}/api/users/${id}/toggle_admin/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.access}`,
          },
        }
      );

      fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
          Access
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Users</h2>
        <p className="mt-2 text-sm text-gray-400">
          Manage user accounts, admin permissions, and account actions.
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#12161f]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-gray-500">
              <tr>
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Admin Access</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((account) => {
                const isCurrentUser = account.id === user?.id;

                return (
                  <tr
                    key={account.id}
                    className="border-t border-white/10 text-gray-200"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-white">{account.name}</p>
                        {isCurrentUser && (
                          <p className="mt-1 text-xs text-gray-500">
                            Current account
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-300">{account.email}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          account.is_staff
                            ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            : "border border-white/10 bg-white/[0.04] text-gray-300"
                        }`}
                      >
                        {account.is_staff ? "Admin" : "User"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <label className="inline-flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={account.is_staff}
                          disabled={loadingId === account.id || isCurrentUser}
                          onChange={() => toggleAdmin(account.id)}
                          className="peer sr-only"
                        />

                        <div className="relative h-6 w-11 rounded-full bg-white/15 transition peer-checked:bg-emerald-500 peer-disabled:opacity-50">
                          <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                        </div>

                        <span className="text-sm text-gray-300">
                          {loadingId === account.id
                            ? "Updating..."
                            : account.is_staff
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </label>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => deleteHandler(account.id)}
                          disabled={isCurrentUser}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!users.length && (
          <div className="border-t border-white/10 px-5 py-10 text-center">
            <h3 className="text-lg font-semibold text-white">No users found</h3>
            <p className="mt-2 text-sm text-gray-400">
              Registered accounts will appear here automatically.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminUsers;
