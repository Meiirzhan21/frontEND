import "@/app/globals.css";

import NavBar from "@/components/NavBar"; // Подключаем шапку сайта
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/hotel-bg.jpg')" }}>
        {/* Верхняя панель навигации */}
        <NavBar />
        <main className="container mx-auto p-5 bg-white bg-opacity-90 rounded-lg shadow-lg mt-10 p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
