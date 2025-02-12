"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Hotel() {
  const { id } = useParams();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleBooking = async () => {
    if (!user) {
      alert("Вы не вошли в аккаунт! Пожалуйста, авторизуйтесь перед бронированием.");
      return;
    }
    if (!checkIn || !checkOut) {
      alert("Выберите даты заезда и выезда!");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          service_id: id,
          booking_date: checkIn.toISOString(),
          status: "confirmed",
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка бронирования");
      }

      alert("Бронирование успешно!");
    } catch (error) {
      console.error("Ошибка бронирования:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-black">Гостиница</h1>

        <label className="block text-black mt-4">Дата заезда:</label>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          dateFormat="dd.MM.yyyy"
          minDate={new Date()}
          className="w-full p-2 border rounded mt-2 text-black bg-white cursor-pointer"
        />

        <label className="block mt-4 text-black">Дата выезда:</label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          dateFormat="dd.MM.yyyy"
          minDate={checkIn || new Date()}
          className="w-full p-2 border rounded mt-2 text-black bg-white cursor-pointer"
        />

        <button
          onClick={handleBooking}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Забронировать
        </button>
      </div>
    </div>
  );
}