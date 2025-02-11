"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();
  const isProcessing = useRef(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if (!storedUser) {
      alert("Вы не вошли в аккаунт!");
      router.replace("/login");
      return;
    }

    // Проверяем смену пользователя, если пользователь новый — сбрасываем бронирования
    const lastUser = localStorage.getItem("lastUser");
    if (lastUser !== storedUser.email) {
      localStorage.setItem("lastUser", storedUser.email);
      localStorage.setItem("bookings", JSON.stringify([]));
      setBookings([]);
    } else {
      setBookings(storedBookings);
    }

    setUser(storedUser);
  }, []);

  // Проверяем успешную оплату после возврата
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success") === "true" && query.get("bookingId")) {
      const bookingId = parseInt(query.get("bookingId"));

      if (!isProcessing.current) {
        isProcessing.current = true;

        setBookings((prevBookings) => {
          const updatedBookings = prevBookings.map((b) =>
            b.hotelId === bookingId ? { ...b, paid: true } : b
          );

          localStorage.setItem("bookings", JSON.stringify(updatedBookings));

          return updatedBookings.filter((b) => b.hotelId !== bookingId);
        });

        setAlertMessage("Оплата успешно завершена!");

        setTimeout(() => {
          setAlertMessage("");
          router.replace("/bookings");
          isProcessing.current = false;
        }, 3000);
      }
    }
  }, [router]);

  const handlePayment = async (booking) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking, userEmail: user.email }),
      });

      const data = await response.json();
      if (data.url) {
        localStorage.setItem("pendingPayment", booking.hotelId);
        window.location.href = data.url;
      } else {
        alert("Ошибка при создании оплаты");
      }
    } catch (error) {
      console.error("Ошибка при оплате:", error);
      alert("Не удалось обработать оплату.");
    }
  };

  // Очистка всех бронирований
  const handleClearBookings = () => {
    localStorage.setItem("bookings", JSON.stringify([]));
    setBookings([]);
    alert("Все бронирования удалены!");
  };

  if (!user) {
    return <p className="text-center text-gray-600">Перенаправление на страницу входа...</p>;
  }

  return (
    <div className="container mx-auto py-10">
      {alertMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-black text-white py-3 px-6 rounded">
          {alertMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-6 text-black">Мои бронирования</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">У вас нет бронирований.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold text-black">{booking.name}</h2>
              <p className="text-black">{booking.city}</p>
              <p className="text-black">Заезд: {booking.checkIn}</p>
              <p className="text-black">Выезд: {booking.checkOut}</p>
              <p className="text-lg font-semibold mt-2 text-black">Цена за ночь: ${booking.pricePerNight}</p>
              <p className="text-lg font-bold mt-2 text-black">Итого: ${booking.totalPrice}</p>

              {booking.paid ? (
                <p className="text-green-600 font-bold mt-4 flex items-center">✅ Оплачено</p>
              ) : (
                <button
                  onClick={() => handlePayment(booking)}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  💳 Оплатить
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Кнопка очистки бронирований */}
      {bookings.length > 0 && (
        <button
          onClick={handleClearBookings}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          🗑 Очистить бронирования
        </button>
      )}
    </div>
  );
}
