"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) {
      alert("Вы не вошли в аккаунт!");
      router.replace("/login");
      return;
    }

    setUser(storedUser);

    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Ответ от сервера:", data);
        const userBookings = data.filter((booking) => booking.user_id === storedUser.id);
        setBookings(userBookings);
      })
      .catch((error) => console.error("Ошибка загрузки бронирований:", error));
  }, [apiUrl, router]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Мои бронирования</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">У вас нет бронирований.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold text-black">{booking.name || "Гостиница"}</h2>
              <p className="text-black">{booking.city || "Город"}</p>
              <p className="text-black">Заезд: {booking.checkIn || "Не указано"}</p>
              <p className="text-black">Выезд: {booking.checkOut || "Не указано"}</p>
              <p className="text-lg font-semibold mt-2 text-black">
                Цена за ночь: ${booking.pricePerNight || "?"}
              </p>
              <p className="text-lg font-bold mt-2 text-black">
                Итого: ${booking.totalPrice || "?"}
              </p>

              {booking.status === "paid" ? (
                <p className="text-green-600 font-bold mt-4 flex items-center">✅ Оплачено</p>
              ) : (
                <p className="text-red-600 font-bold mt-4 flex items-center">⏳ Ожидание оплаты</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}