import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  admins?: string[] | { _id: string; name: string }[];
}

export default function Admin() {
  const { token, user } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: null as File | null,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // Overlay state for restock/delete
  const [showRestock, setShowRestock] = useState<{ id: string | null, open: boolean }>({ id: null, open: false });
  const [restockQty, setRestockQty] = useState("");
  const [showDelete, setShowDelete] = useState<{ id: string | null, open: boolean }>({ id: null, open: false });

  const fetchSweets = async () => {
    if (!user) return setSweets([]);
    // Only fetch sweets for this admin
    const res = await fetch(`${API_BASE_URL}/sweets/search?admin=${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSweets(data.data || data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const addOrUpdateSweet = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    if (form.image) {
      formData.append("image", form.image);
    }

    let url = `${API_BASE_URL}/sweets`;
    let method: "POST" | "PUT" = "POST";
    if (editId) {
      url = `${API_BASE_URL}/sweets/${editId}`;
      method = "PUT";
    }

    // Add admins field to formData
    if (user) {
      formData.append("admins", user._id);
    }

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(editId ? "Sweet updated!" : (data.message || "Sweet added!"));
    } else {
      toast.error(data.message || (editId ? "Failed to update sweet" : "Failed to add sweet"));
    }

    setForm({ name: "", category: "", price: "", quantity: "", image: null });
    setEditId(null);
    setPreview(null);
    fetchSweets();
  };

  const deleteSweet = async (id: string) => {
    setShowDelete({ id, open: true });
  };

  const confirmDeleteSweet = async () => {
    if (!showDelete.id) return;
    const res = await fetch(`${API_BASE_URL}/sweets/${showDelete.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message || "Sweet deleted!");
    } else {
      toast.error(data.message || "Failed to delete sweet");
    }
    setShowDelete({ id: null, open: false });
    fetchSweets();
  };

  const restockSweet = async (id: string) => {
    setShowRestock({ id, open: true });
    setRestockQty("");
  };

  const confirmRestockSweet = async () => {
    if (!showRestock.id || !restockQty.trim() || isNaN(Number(restockQty)) || Number(restockQty) <= 0) {
      toast.error("Invalid quantity");
      return;
    }
    const res = await fetch(`${API_BASE_URL}/sweets/${showRestock.id}/restock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: Number(restockQty) }), 
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message || "Sweet restocked!");
    } else {
      toast.error(data.message || "Failed to restock");
    }
    setShowRestock({ id: null, open: false });
    setRestockQty("");
    fetchSweets();
  };

  const handleEdit = (sweet: Sweet) => {
    setEditId(sweet._id);
    setForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      image: null,
    });
    setPreview(sweet.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ name: "", category: "", price: "", quantity: "", image: null });
    setPreview(null);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf6ed] py-8 px-2">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-[#1B2A49] mb-8 drop-shadow-lg">Admin Panel</h1>
      {/* Add Sweet Form */}
      <form
        onSubmit={addOrUpdateSweet}
        className="grid grid-cols-2 gap-4 max-w-xl mx-auto mb-10 bg-[#fffbe8] rounded-2xl shadow-xl p-8 border border-[#e6e2d3]"
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border-2 border-[#e6e2d3] p-3 rounded-lg focus:outline-none focus:border-[#1B2A49] transition col-span-2 md:col-span-1 bg-[#f8f5f0] text-[#1B2A49]"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border-2 border-[#e6e2d3] p-3 rounded-lg focus:outline-none focus:border-[#1B2A49] transition col-span-2 md:col-span-1 bg-[#f8f5f0] text-[#1B2A49]"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border-2 border-[#e6e2d3] p-3 rounded-lg focus:outline-none focus:border-[#1B2A49] transition col-span-2 md:col-span-1 bg-[#f8f5f0] text-[#1B2A49]"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="border-2 border-[#e6e2d3] p-3 rounded-lg focus:outline-none focus:border-[#1B2A49] transition col-span-2 md:col-span-1 bg-[#f8f5f0] text-[#1B2A49]"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="col-span-2 border-2 border-[#e6e2d3] p-3 rounded-lg bg-[#f8f5f0] text-[#1B2A49]"
        />

        {/* Optional: show preview */}
        {(form.image || preview) && (
          <img
            src={form.image ? URL.createObjectURL(form.image) : preview!}
            alt="preview"
            className="col-span-2 w-24 h-24 object-cover rounded-xl border border-[#e6e2d3] shadow mx-auto"
          />
        )}

        <div className="col-span-2 flex gap-2">
          <button type="submit" className="flex-1 bg-[#1B2A49] text-[#fffbe8] p-3 rounded-lg font-semibold shadow hover:bg-[#24345c] transition">
            {editId ? "Update Sweet" : "Add Sweet"}
          </button>
          {editId && (
            <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-300 text-[#1B2A49] p-3 rounded-lg font-semibold shadow hover:bg-gray-400 transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Restock Overlay */}
      {showRestock.open && (
        <div className="fixed inset-0 bg-[#1B2A49]/80 flex items-center justify-center z-50">
          <div className="bg-[#fffbe8] rounded-2xl shadow-xl p-6 w-full max-w-xs mx-2 flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#1B2A49] mb-4">Restock Sweet</h2>
            <input
              type="number"
              placeholder="Enter quantity"
              value={restockQty}
              onChange={e => setRestockQty(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#e6e2d3] mb-4 text-[#1B2A49] bg-[#f8f5f0] focus:outline-none"
              min={1}
              autoFocus
            />
            <div className="flex gap-2 w-full">
              <button onClick={confirmRestockSweet} className="flex-1 bg-[#24345c] text-[#fffbe8] p-2 rounded-lg font-semibold shadow hover:bg-[#1B2A49] transition">Confirm</button>
              <button onClick={() => setShowRestock({ id: null, open: false })} className="flex-1 bg-gray-300 text-[#1B2A49] p-2 rounded-lg font-semibold shadow hover:bg-gray-400 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Overlay */}
      {showDelete.open && (
        <div className="fixed inset-0 bg-[#1B2A49]/80 flex items-center justify-center z-50">
          <div className="bg-[#fffbe8] rounded-2xl shadow-xl p-6 w-full max-w-xs mx-2 flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#c1121f] mb-4">Delete Sweet</h2>
            <p className="mb-4 text-[#1B2A49]">Are you sure you want to delete this sweet?</p>
            <div className="flex gap-2 w-full">
              <button onClick={confirmDeleteSweet} className="flex-1 bg-red-600 text-white p-2 rounded-lg font-semibold shadow hover:bg-red-700 transition">Delete</button>
              <button onClick={() => setShowDelete({ id: null, open: false })} className="flex-1 bg-gray-300 text-[#1B2A49] p-2 rounded-lg font-semibold shadow hover:bg-gray-400 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto max-w-6xl mx-auto">
        <table className="w-full border rounded-xl overflow-hidden shadow-xl bg-[#fffbe8]">
          <thead className="bg-[#1B2A49] text-[#fffbe8]">
            <tr>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet) => (
              <tr key={sweet._id} className="text-center border hover:bg-[#f8f5f0] transition">
                <td className="p-2 border">
                  {sweet.image ? (
                    <img
                      src={sweet.image}
                      alt={sweet.name}
                      className="w-16 h-16 object-cover mx-auto rounded-xl border border-[#e6e2d3] shadow"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-[#f8f5f0] rounded-xl text-[#b0a99f] border border-[#e6e2d3] shadow mx-auto">No Image</div>
                  )}
                </td>
                <td className="p-2 border font-semibold text-[#1B2A49]">{sweet.name}</td>
                <td className="p-2 border text-[#24345c]">{sweet.category}</td>
                <td className="p-2 border text-[#24345c] font-bold">
                  <span>&#8377;</span>
                  {sweet.price}
                </td>
                <td className={`p-2 border font-bold ${sweet.quantity === 0 ? 'text-red-500' : 'text-[#1B2A49]'}`}>{sweet.quantity}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(sweet)}
                    className="bg-yellow-400 text-[#1B2A49] px-3 py-1 rounded-lg font-semibold shadow hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => restockSweet(sweet._id)}
                    className="bg-[#24345c] text-[#fffbe8] px-3 py-1 rounded-lg font-semibold shadow hover:bg-[#1B2A49] transition"
                  >
                    Restock
                  </button>
                  <button
                    onClick={() => deleteSweet(sweet._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg font-semibold shadow hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
