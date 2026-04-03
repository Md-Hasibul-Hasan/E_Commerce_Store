import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API = import.meta.env.VITE_API_URL;

const badgeClasses = {
  paid: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  unpaid: "border border-red-500/20 bg-red-500/10 text-red-300",
  delivered: "border border-sky-500/20 bg-sky-500/10 text-sky-300",
  pending: "border border-amber-500/20 bg-amber-500/10 text-amber-300",
  cancelled: "border border-red-500/20 bg-red-500/10 text-red-300",
  returned: "border border-amber-500/20 bg-amber-500/10 text-amber-300",
  default: "border border-white/10 bg-white/[0.04] text-gray-300",
};

const getOrderStatusBadge = (order) => {
  if (order.status === "returned") {
    return {
      className: badgeClasses.returned,
      label: "Returned",
    };
  }

  if (order.isDelivered) {
    return {
      className: badgeClasses.delivered,
      label: "Delivered",
    };
  }

  switch (order.status) {
    case "paid":
      return {
        className: badgeClasses.paid,
        label: "Paid",
      };
    case "cancelled":
      return {
        className: badgeClasses.cancelled,
        label: "Cancelled",
      };
    case "pending":
      return {
        className: badgeClasses.pending,
        label: "Pending",
      };
    default:
      return {
        className: badgeClasses.default,
        label: order.status || "Unknown",
      };
  }
};

const paymentFilterOptions = [
  { value: "all", label: "All Payments" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
];

const statusFilterOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
  { value: "delivered", label: "Delivered" },
];

const escapePdfText = (value = "") =>
  String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "");

const buildPdfBlob = (order) => {
  const shippingAddress = order.shippingAddress || {};
  const orderStatus = getOrderStatusBadge(order);
  const addressText = [
    shippingAddress.address,
    shippingAddress.city,
    shippingAddress.postalCode,
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join(", ");

  const itemsTotal = (order.orderitems || []).reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const lines = [
    `Order Summary #${order.id}`,
    "",
    `Customer: ${order.user || "Unavailable"}`,
    `Payment Method: ${order.paymentMethod || "Unavailable"}`,
    `Payment Status: ${order.isPaid ? "Paid" : "Unpaid"}`,
    `Order Status: ${orderStatus.label}`,
    `Shipping Address: ${addressText || "Unavailable"}`,
    "",
    "Items:",
    ...(order.orderitems || []).map(
      (item) =>
        `${item.name} | Qty ${item.qty} | Tk ${Number(item.price || 0) * Number(item.qty || 0)}`
    ),
    "",
    `Items Total: Tk ${itemsTotal.toFixed(2)}`,
    `Shipping: Tk ${Number(order.shippingPrice || 0).toFixed(2)}`,
    `Tax: Tk ${Number(order.taxPrice || 0).toFixed(2)}`,
    `Grand Total: Tk ${Number(order.totalPrice || 0).toFixed(2)}`,
  ];

  let y = 800;
  const contentLines = lines.map((line) => {
    const safeLine = escapePdfText(line);
    const segment = `BT /F1 12 Tf 40 ${y} Td (${safeLine}) Tj ET`;
    y -= line === "" ? 10 : 18;
    return segment;
  });

  const contentStream = contentLines.join("\n");
  const contentLength = new TextEncoder().encode(contentStream).length;

  const pdfParts = [
    "%PDF-1.4\n",
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${contentLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pdf = "";
  const offsets = [0];

  for (const part of pdfParts) {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += part;
  }

  const xrefStart = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${pdfParts.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i <= pdfParts.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${pdfParts.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const AdminOrders = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/api/orders/`, {
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
        },
      });

      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deliverHandler = async (id) => {
    await axios.put(
      `${API}/api/orders/${id}/deliver/`,
      {},
      {
        headers: { Authorization: `Bearer ${userInfo.access}` },
      }
    );

    fetchOrders();
  };

  const returnHandler = async (id) => {
    await axios.put(
      `${API}/api/orders/${id}/mark-returned/`,
      {},
      {
        headers: { Authorization: `Bearer ${userInfo.access}` },
      }
    );

    fetchOrders();
  };

  const downloadSummary = (order) => {
    const blob = buildPdfBlob(order);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `order-${order.id}-summary.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && order.isPaid) ||
      (paymentFilter === "unpaid" && !order.isPaid);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "delivered" && order.isDelivered) ||
      order.status === statusFilter;

    return matchesPayment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
          Operations
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Orders</h2>
        <p className="mt-2 text-sm text-gray-400">
          Review purchases, monitor payment state, and confirm deliveries.
        </p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
              Filters
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Filter orders by payment and lifecycle status.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-gray-300">
              Payment
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-white outline-none transition focus:border-orange-400/40"
              >
                {paymentFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-300">
              Order Status
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-white outline-none transition focus:border-orange-400/40"
              >
                {statusFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {filteredOrders.map((order) => {
          const statusBadge = getOrderStatusBadge(order);

          return (
            <article
              key={order.id}
              className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    Order #{order.id}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {order.user}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {order.paymentMethod || "Payment method unavailable"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <p className="text-2xl font-semibold text-white">
                    Tk {order.totalPrice}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.isPaid ? badgeClasses.paid : badgeClasses.unpaid
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1118] p-4">
                <p className="text-sm font-medium text-white">Items</p>

                <div className="mt-4 space-y-3">
                  {order.orderitems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-2xl object-cover"
                          />
                        )}

                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="text-sm text-gray-400">Qty {item.qty}</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-gray-200">
                        Tk {item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => downloadSummary(order)}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:border-orange-400/30 hover:text-orange-300"
                >
                  Download PDF
                </button>

                {!order.isDelivered &&
                  order.status !== "cancelled" &&
                  order.status !== "returned" && (
                  <button
                    onClick={() => deliverHandler(order.id)}
                    className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                  >
                    Mark as Delivered
                  </button>
                )}

                {order.status !== "cancelled" && order.status !== "returned" && (
                  <button
                    onClick={() => returnHandler(order.id)}
                    className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
                  >
                    Mark as Returned
                  </button>
                )}
              </div>
            </article>
          );
        })}

        {!filteredOrders.length && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#12161f] p-10 text-center">
            <h3 className="text-lg font-semibold text-white">No matching orders</h3>
            <p className="mt-2 text-sm text-gray-400">
              Try changing the filters to see more orders.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminOrders;
