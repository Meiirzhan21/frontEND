"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(storedUser);
  }, []);

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center text-white">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <span>🏨</span>
          <span className="font-bold">Hotel Booking</span>
        </Link>
      </div>

      <div className="flex space-x-6 text-white">
        <Link href="/search" className="hover:text-gray-200">Поиск</Link>
        <Link href="/bookings" className="hover:text-gray-200">Мои бронирования</Link>
        <Link href="/profile" className="hover:underline">Личный кабинет</Link>

        {user ? (
          <>
            <span className="font-bold">{user.name}</span>
            <button 
              onClick={() => {
                localStorage.removeItem("currentUser");
                localStorage.removeItem("isLoggedIn");
                window.location.href = "/";
              }} 
              className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-200">Вход</Link>
            <Link href="/register" className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
