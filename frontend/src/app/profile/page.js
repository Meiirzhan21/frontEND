"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!isLoggedIn || !currentUser) {
      router.replace("/login");
      return;
    }

    setUser(currentUser);

    // Загружаем оплаченные бронирования
    fetch(`${apiUrl}/bookings`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка при загрузке бронирований");
        }
        return response.json();
      })
      .then((data) => {
        const userBookings = data.filter(
          (booking) => booking.user_id === currentUser.id && booking.status === "paid"
        );
        setBookings(userBookings);
      })
      .catch((error) => {
        console.error("Ошибка загрузки бронирований:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiUrl, router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    router.replace("/login");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Личный кабинет</h1>

      {user ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
          <p className="text-lg font-semibold text-black">Имя: {user.name}</p>
          <p className="text-lg font-semibold text-black">Почта: {user.email}</p>

          <h2 className="text-2xl font-bold mt-6 text-black">Оплаченные бронирования</h2>
          {loading ? (
            <p className="text-gray-600">Загрузка...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-600">У вас нет оплаченных бронирований.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 mt-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-lg p-4">
                  <h2 className="text-xl font-bold text-black">{booking.name || "Гостиница"}</h2>
                  <p className="text-black">{booking.city || "Город"}</p>
                  <p className="text-black">
                    Заезд: {new Date(booking.checkIn).toLocaleDateString() || "Не указано"}
                  </p>
                  <p className="text-black">
                    Выезд: {new Date(booking.checkOut).toLocaleDateString() || "Не указано"}
                  </p>
                  <p className="text-lg font-semibold mt-2 text-black">
                    Цена за ночь: ${booking.pricePerNight || "?"}
                  </p>
                  <p className="text-lg font-bold mt-2 text-black">
                    Итого: ${booking.totalPrice || "?"}
                  </p>
                  <p className="text-green-600 font-bold mt-4 flex items-center">✅ Оплачено</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Выйти
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">Вы не вошли в систему.</p>
      )}
    </div>
  );
}