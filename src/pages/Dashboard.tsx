import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  admins?: { _id: string; name: string }[] | string[];
}

export default function Dashboard() {
  const { token } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const location = useLocation();
  const debounceRef = useRef<number | null>(null);

  const fetchSweets = async () => {
    const params = new URLSearchParams(location.search);
    const url = params.toString()
      ? `${API_BASE_URL}/sweets/search?${params.toString()}`
      : `${API_BASE_URL}/sweets`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSweets(data.data || data);
  };

  const purchaseSweet = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/sweets/${id}/purchase`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(`Purchase failed: ${err.message || "Unknown error"}`);
        return;
      }

      await res.json();
      toast.success("Purchase successful!");

      fetchSweets();

    } catch (err) {
      toast.error("Something went wrong while purchasing.");
    }
  };

  useEffect(() => {
    // Debounce fetch for live search/filter
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSweets();
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [location.search]);

  return (
    <div className="min-h-screen bg-[#fdf6ed] py-8 px-2 mt">
      <Toaster position="top-right" />
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-[#1B2A49] mb-8 drop-shadow-lg">Sweet Shop Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {sweets.length === 0 ? (
          <div className="col-span-full text-center text-lg text-[#b0a99f]">No sweets found.</div>
        ) : (
          sweets.map((sweet) => (
            <div
              key={sweet._id}
              className="bg-[#fffbe8] rounded-2xl shadow-xl p-6 flex flex-col items-center border border-[#e6e2d3] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative"
            >
              <div className="absolute top-4 right-4 bg-[#1B2A49] text-[#fffbe8] px-3 py-1 rounded-full text-xs font-semibold shadow">
                {sweet.category}
              </div>
              {sweet.image ? (
                <img
                  src={sweet.image}
                  alt={sweet.name}
                  className="w-24 h-24 object-cover rounded-xl mb-3 border border-[#e6e2d3] shadow"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-[#f8f5f0] rounded-xl mb-3 text-[#b0a99f] border border-[#e6e2d3] shadow">
                  No Image
                </div>
              )}
              <h2 className="text-2xl font-bold text-[#1B2A49] mb-2 text-center">{sweet.name}</h2>
              <p className="mt-1 text-lg font-semibold text-[#24345c]">₹{sweet.price}</p>
              <p className="text-sm text-[#b0a99f] mb-2">Stock: <span className={sweet.quantity === 0 ? "text-red-500 font-bold" : "font-bold text-[#1B2A49]"}>{sweet.quantity}</span></p>
              {/* Show admin names if available */}
              {sweet.admins && (
                <p className="text-xs text-[#24345c] mb-2">Owner: {
                  Array.isArray(sweet.admins)
                    ? sweet.admins.map((admin: any) => typeof admin === "string" ? admin : admin.name).join(", ")
                    : typeof sweet.admins === "string"
                      ? sweet.admins
                      : ""
                }</p>
              )}

              <button
                disabled={sweet.quantity === 0}
                onClick={() => purchaseSweet(sweet._id)}
                className={`mt-4 w-full py-2 rounded-xl font-semibold text-lg shadow-md transition-all duration-200 ${
                  sweet.quantity === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#1B2A49] text-[#fffbe8] hover:bg-[#24345c]"
                }`}
              >
                {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
