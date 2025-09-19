import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      toast.success(data.message || "Registered!");
      navigate("/login");
    } else {
      toast.error(data.message || (data.data && typeof data.data === "string" ? data.data : "Registration failed"));
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#fdf6ed] py-0 px-2 overflow-hidden">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#fffbe8] rounded-2xl shadow-xl p-8 space-y-6 border border-[#e6e2d3]">
        <h2 className="text-3xl font-bold text-center text-[#1B2A49] mb-4">Register</h2>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#e6e2d3] rounded-lg focus:outline-none focus:border-[#1B2A49] bg-[#f8f5f0] text-[#1B2A49] transition"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#e6e2d3] rounded-lg focus:outline-none focus:border-[#1B2A49] bg-[#f8f5f0] text-[#1B2A49] transition"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#e6e2d3] rounded-lg focus:outline-none focus:border-[#1B2A49] bg-[#f8f5f0] text-[#1B2A49] transition"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#e6e2d3] rounded-lg focus:outline-none focus:border-[#1B2A49] bg-[#f8f5f0] text-[#1B2A49] transition"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-[#1B2A49] text-[#fffbe8] w-full p-3 rounded-lg font-semibold shadow hover:bg-[#24345c] transition">
          Register
        </button>
      </form>
    </div>
  );
}
