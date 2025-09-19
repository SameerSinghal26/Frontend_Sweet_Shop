import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Login() {
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log("User role:", data);

    if (res.ok && data.data?.token && data.data?.user) {
      setAuth(data.data.token, data.data.user);
      toast.success(data.message || "Login successful!");
      if (data.data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } else {
      toast.error(data.message || (data.data && typeof data.data === "string" ? data.data : "Invalid credentials"));
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#fdf6ed] py-0 px-2 overflow-hidden">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#fffbe8] rounded-2xl shadow-xl p-8 space-y-6 border border-[#e6e2d3]">
        <h2 className="text-3xl font-bold text-center text-[#1B2A49] mb-4">Login</h2>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#e6e2d3] rounded-lg focus:outline-none focus:border-[#1B2A49] bg-[#f8f5f0] text-[#1B2A49] transition"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#e6e2d3] rounded-lg focus:outline-none focus:border-[#1B2A49] bg-[#f8f5f0] text-[#1B2A49] transition"
        />
        <button className="bg-[#1B2A49] text-[#fffbe8] w-full p-3 rounded-lg font-semibold shadow hover:bg-[#24345c] transition">
          Login
        </button>
        <div className="text-center mt-4">
          <span className="text-[#1B2A49]">Don't have an account?</span>
          <button
            type="button"
            className="ml-2 text-[#24345c] underline font-semibold hover:text-[#1B2A49]"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
