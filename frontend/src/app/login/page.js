"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (isLoggedIn === "true" && currentUser) {
      router.replace("/profile"); // Перенаправляем ТОЛЬКО если пользователь уже авторизован
    }
  }, []);

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("Пользователь не зарегистрирован!");
      return;
    }

    // Проверяем данные пользователя
    if (storedUser.email.trim().toLowerCase() !== email.trim().toLowerCase() || storedUser.password !== password) {
      alert("Неправильная почта или пароль!");
      return;
    }

    // Сохраняем статус входа
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(storedUser));

    alert("Вы успешно вошли в аккаунт!");
    router.replace("/profile");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Вход</h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <label className="block mb-2 text-black">Почта</label>
        <input
          type="email"
          placeholder="Введите вашу почту"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mt-2 text-black"
        />

        <label className="block mt-4 mb-2 text-black">Пароль</label>
        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mt-2 text-black"
        />

        <button
          onClick={handleLogin}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
