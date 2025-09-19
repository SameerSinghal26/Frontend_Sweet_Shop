import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const debounceRef = useRef<number | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setName(params.get("name") || "");
    setCategory(params.get("category") || "");
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
  }, [location.search]);

  const updateSearch = () => {
    const params = new URLSearchParams();
    if (name.trim()) params.set("name", name);
    if (category.trim()) params.set("category", category);
    if (minPrice.trim()) params.set("minPrice", minPrice);
    if (maxPrice.trim()) params.set("maxPrice", maxPrice);
    navigate({ pathname: "/", search: params.toString() });
  };

  // Debounce search on input change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateSearch();
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line
  }, [name, category, minPrice, maxPrice]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch();
    setShowMobileSearch(false);
  };

  return (
    <nav className="bg-[#1B2A49] text-[#FFFBEA] px-2 sm:px-6 py-3 shadow-lg sticky top-0 z-50 w-full overflow-x-hidden">
      <div className="flex items-center justify-between w-full gap-2">
        {/* Logo & Sweet Shop name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}> 
          <span className="font-extrabold lg:text-2xl tracking-wide drop-shadow-lg text-[#FFFBEA]">Sweet Shop</span>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-center flex-1">
          {/* Desktop search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-wrap items-center bg-[#23283a] rounded-full px-4 py-2 w-full max-w-3xl mx-2 gap-3 justify-center"
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-transparent text-[#FFFBEA] placeholder-[#b0a99f] px-3 py-2 rounded-full focus:outline-none border-none min-w-[120px] flex-1"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-transparent text-[#FFFBEA] placeholder-[#b0a99f] px-3 py-2 rounded-full focus:outline-none border-none min-w-[120px] flex-1"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="bg-transparent text-[#FFFBEA] placeholder-[#b0a99f] px-3 py-2 rounded-full focus:outline-none border-none min-w-[90px] flex-1"
              min={0}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="bg-transparent text-[#FFFBEA] placeholder-[#b0a99f] px-3 py-2 rounded-full focus:outline-none border-none min-w-[90px] flex-1"
              min={0}
            />
            <button type="submit" className="p-2 rounded-full text-[#b0a99f] hover:text-[#FFFBEA] focus:outline-none">
              <FiSearch size={20} />
            </button>
          </form>
          {/* Mobile search icon */}
          <button
            type="button"
            className="md:hidden p-2 rounded-full text-[#FFFBEA] hover:bg-[#23283a] focus:outline-none"
            onClick={() => setShowMobileSearch((v) => !v)}
          >
            <FiSearch size={22} />
          </button>
          {/* Mobile search input (overlay) */}
          {showMobileSearch && (
            <div className="fixed inset-0 bg-[#1B2A49]/80 flex items-center justify-center z-50">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col gap-2 items-center bg-[#23283a] rounded-2xl px-4 py-4 w-full max-w-xs mx-2"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-transparent text-[#FFFBEA] placeholder-[#b0a99f] px-3 py-2 rounded-full focus:outline-none border-none w-full"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="bg-transparent text-[#FFFBEA] placeholder-[#b0a99f] px-3 py-2 rounded-full focus:outline-none border-none w-full"
                />
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="bg-transparent text-[#FFFBEA] placeholder-[#b0a99f] px-3 py-2 rounded-full focus:outline-none border-none w-full"
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="bg-transparent text-[#FFFBEA] placeholder-[#b0a99f] px-3 py-2 rounded-full focus:outline-none border-none w-full"
                  min={0}
                />
                <button type="submit" className="p-2 rounded-full text-[#b0a99f] hover:text-[#FFFBEA] focus:outline-none w-full">
                  <FiSearch size={20} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right side buttons */}
        <div className="flex gap-2 items-center">
          {token && user?.role === "admin" && (
            <Link to="/admin" className="bg-[#23283a] text-[#FFFBEA] font-semibold px-4 py-2 rounded-lg transition hover:bg-[#fffbe8] hover:text-[#1B2A49]">Admin</Link>
          )}
          {!token ? (
            <Link to="/login" className="bg-[#c1121f] text-[#FFFBEA] font-semibold px-4 py-2 rounded-lg transition hover:bg-[#a60d1a]">Login</Link>
          ) : (
            <button
              onClick={() => { logout(); toast.success("Logged out successfully!"); }}
              className="bg-[#c1121f] px-4 py-2 rounded-lg hover:bg-[#a60d1a] transition font-semibold shadow"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
