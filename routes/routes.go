package routes

import (
	"booking-system/handlers"
	"net/http"

	"github.com/gorilla/mux"
)

// SetupRouter инициализирует маршруты
func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	// Глобальная обработка OPTIONS-запросов (CORS fix)
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	// Аутентификация
	r.HandleFunc("/register", handlers.RegisterHandler).Methods("POST")
	r.HandleFunc("/login", handlers.LoginHandler).Methods("POST")

	// Пользователи
	r.HandleFunc("/users", handlers.GetUsers).Methods("GET")
	r.HandleFunc("/users", handlers.CreateUser).Methods("POST")

	// Бронирования
	r.HandleFunc("/bookings", handlers.GetBookings).Methods("GET")
	r.HandleFunc("/bookings", handlers.CreateBooking).Methods("POST")

	// Платежи
	r.HandleFunc("/payments", handlers.GetPayments).Methods("GET")
	r.HandleFunc("/payments", handlers.CreatePayment).Methods("POST")

	// Услуги
	r.HandleFunc("/services", handlers.GetServices).Methods("GET")
	r.HandleFunc("/services", handlers.CreateService).Methods("POST")

	return r
}
