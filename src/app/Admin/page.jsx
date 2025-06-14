"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Admin({ children }) {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePath, setActivePath] = useState("");

  const ADMIN_WALLET = "N3WGSFVJRZ6UNRPCXUZGRQOTVQOLRLPKZILVMNWO7OYBUQM2DZBVHZEAUY";

  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    setWalletAddress(storedWallet);

    if (storedWallet === ADMIN_WALLET) {
      setIsAdmin(true);
    }

    setActivePath(window.location.pathname);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("walletAddress");
    router.push("/");
  };

  const navLinks = [
    { name: "Mint NFT", path: "/Admin/MintNFT" },
    { name: "Reissue Request", path: "/Admin/ReissueRequest" },
    ...(isAdmin ? [{ name: "Admin Panel", path: "/Admin" }] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-2xl m-4 shadow-xl flex flex-col h-[calc(100vh-2rem)] sticky top-4">
        {/* Logo and Title */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EM</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Event Manager</h1>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center p-3 text-gray-700 rounded-lg transition-all duration-300 ${
                activePath === item.path
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 text-blue-600 font-medium"
                  : "hover:bg-blue-50"
              }`}
            >
              <div className="mr-3 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
