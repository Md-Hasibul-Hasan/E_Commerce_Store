import React from "react";
import { Link } from "react-router-dom";

const Step = ({ active, completed, to, number, children }) => {
  if (!active && !completed) {
    return (
      <div className="flex min-w-[120px] flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-gray-500">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs font-semibold">
          {number}
        </span>
        <span className="text-sm font-medium">{children}</span>
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`flex min-w-[120px] flex-1 items-center gap-3 rounded-2xl border px-4 py-3 transition ${
        completed
          ? "border-orange-400/40 bg-orange-400/10 text-orange-300"
          : "border-white/10 bg-white/[0.04] text-white hover:border-orange-400/30"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
          completed
            ? "bg-orange-400 text-black"
            : "border border-white/15 text-white"
        }`}
      >
        {completed ? "✓" : number}
      </span>
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
};

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Step active={step1} completed={step1} to="/login" number="1">
        Login
      </Step>
      <Step active={step2} completed={step2} to="/shipping" number="2">
        Shipping
      </Step>
      <Step active={step3} completed={step3} to="/payment" number="3">
        Payment
      </Step>
      <Step active={step4} completed={step4} to="/placeorder" number="4">
        Place Order
      </Step>
    </div>
  );
};

export default CheckoutSteps;
