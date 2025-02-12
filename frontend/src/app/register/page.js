"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    if (!email || !name || !password) {
      alert("Заполните все поля!");
      return;
    }

    // Создаём объект пользователя
    const newUser = { email, name, password };

    // Сохраняем пользователя в localStorage
    localStorage.setItem("user", JSON.stringify(newUser));
    alert("Регистрация успешна!");

    // После регистрации перенаправляем на страницу входа
    router.push("/login");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Регистрация</h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <label className="block mb-2 text-black">Почта</label>
        <input
          type="email"
          placeholder="Введите вашу почту"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mt-2 text-black"
        />

        <label className="block mt-4 mb-2 text-black">Имя пользователя</label>
        <input
          type="text"
          placeholder="Введите имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          onClick={handleRegister}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
