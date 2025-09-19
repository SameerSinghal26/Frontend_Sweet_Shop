import { Link } from "react-router-dom";

export default function NotFound() {
				return (
					<div className="h-screen flex flex-col items-center justify-center bg-[#fdf6ed] p-6 overflow-hidden">
				<div className="text-8xl font-extrabold text-[#1B2A49] mb-4 drop-shadow-lg">404</div>
				<div className="text-2xl md:text-3xl font-bold text-[#24345c] mb-2 text-center">Oops! Page Not Found</div>
				<p className="text-[#b0a99f] mb-6 text-center max-w-md">The page you are looking for does not exist or has been moved. Let's get you back to the sweets!</p>
				<Link to="/" className="bg-[#1B2A49] text-[#fffbe8] px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#24345c] transition">Go Home</Link>
			</div>
		);
}
