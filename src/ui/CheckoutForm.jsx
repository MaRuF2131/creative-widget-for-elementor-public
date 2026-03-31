'use client';

import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/api/axios";

const domains = ["example.com", "myshop.net", "portfolio.dev"];
const plugins = ["SEO Booster", "Speed Optimizer", "Security Pro"];

const CheckoutForm = ({ contest, close, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    domain: "",
    plugin: "",
  });

  // 👉 Next Step Validation
  const handleNext = () => {
    if (step === 1 && !/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Please enter a valid email");
    }
    if (step === 2 && !formData.domain) {
      return toast.error("Please select a domain");
    }
    if (step === 3 && !formData.plugin) {
      return toast.error("Please select a plugin");
    }

    setStep((prev) => prev + 1);
  };

  // 👉 Payment
  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/api/payments/create-intent", {
        contestId: contest?._id,
        ...formData,
      });

      if (!data?.clientSecret) {
        return toast.error("Failed to initialize payment");
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: formData.email,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success("Payment successful 🎉");
        onSuccess?.();
        close?.();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-6">

        {/* 🔵 Progress */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition
              ${step >= s ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-600"}`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* 🧾 Step Content */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Your Email</h2>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Choose Domain</h2>
            <select
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.domain}
              onChange={(e) =>
                setFormData({ ...formData, domain: e.target.value })
              }
            >
              <option value="">-- Select Domain --</option>
              {domains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Choose Plugin</h2>
            <select
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.plugin}
              onChange={(e) =>
                setFormData({ ...formData, plugin: e.target.value })
              }
            >
              <option value="">-- Select Plugin --</option>
              {plugins.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handlePay}>
            <h2 className="text-lg font-semibold mb-3">Payment</h2>

            {/* 🧾 Summary */}
            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm space-y-1">
              <p><b>Email:</b> {formData.email}</p>
              <p><b>Domain:</b> {formData.domain}</p>
              <p><b>Plugin:</b> {formData.plugin}</p>
              <p><b>Price:</b> ${contest?.price || 100}</p>
            </div>

            <div className="border p-3 rounded-lg mb-4">
              <CardElement />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        )}

        {/* 🔘 Actions */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => setStep((prev) => prev - 1)}
            className="text-gray-500 hover:text-red-500 transition"
          >
            Cancel
          </button>

          {step < 4 && (
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg"
            >
              Next →
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CheckoutForm;