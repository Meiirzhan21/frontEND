"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Map from "@/components/Map";
import hotelData from "@/app/hotels/page";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

export default function Hotel() {
  const { id } = useParams();
  const hotel = hotelData[id] || {};
  const router = useRouter();

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Чтобы избежать ложных срабатываний

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Завершаем загрузку
  }, []);

  const calculateTotalPrice = (checkIn, checkOut) => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
      return nights * hotel.price;
    }
    return 0;
  };

  const handleBooking = () => {
    if (loading) return; // Ждем завершения загрузки

    if (!user) {
      alert("Вы не вошли в аккаунт! Пожалуйста, авторизуйтесь перед бронированием.");
      router.push("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      alert("Выберите даты заезда и выезда!");
      return;
    }

    const total = calculateTotalPrice(checkIn, checkOut);

    const booking = { 
      hotelId: id, 
      name: hotel.name, 
      city: hotel.city,
      checkIn, 
      checkOut, 
      pricePerNight: hotel.price,
      totalPrice: total
    };

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("Бронирование успешно!");
  };

  return (
    <div className="container mx-auto py-10 relative">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
        <img src={hotel.image} alt={hotel.name} className="w-full h-96 object-cover"/>

        <div className="p-6 relative">
          <h1 className="text-4xl font-bold text-black">{hotel.name}</h1>
          <p className="text-lg text-black">{hotel.city}</p>
          <p className="mt-4 text-lg text-black">{hotel.description}</p>
          <p className="text-2xl font-bold mt-4 text-black">${hotel.price} / ночь</p>

          {/* Форма бронирования */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2 text-black">Выберите даты</h2>

            <label className="block text-black">Дата заезда:</label>
            <div className="relative">
              <DatePicker
                selected={checkIn}
                onChange={(date) => {
                  setCheckIn(date);
                  setTotalPrice(calculateTotalPrice(date, checkOut));
                }}
                dateFormat="dd.MM.yyyy"
                minDate={new Date()}
                className="w-full p-2 border rounded mt-2 text-black bg-white cursor-pointer"
              />
            </div>

            <label className="block mt-4 text-black">Дата выезда:</label>
            <div className="relative">
              <DatePicker
                selected={checkOut}
                onChange={(date) => {
                  setCheckOut(date);
                  setTotalPrice(calculateTotalPrice(checkIn, date));
                }}
                dateFormat="dd.MM.yyyy"
                minDate={checkIn || new Date()}
                className="w-full p-2 border rounded mt-2 text-black bg-white cursor-pointer"
              />
            </div>

            <p className="mt-4 text-lg font-semibold text-black">Итого: ${totalPrice || 0}</p>

            <button 
              onClick={handleBooking} 
              className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Забронировать
            </button>
          </div>

          {/* Вставляем карту */}
          <div className="mt-6 relative z-0">
            <h2 className="text-xl font-bold mb-2 text-black">Расположение отеля</h2>
            <Map lat={hotel.lat} lng={hotel.lng} name={hotel.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
