package main

import (
	"booking-system/handlers"
	"booking-system/middleware"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()

	// Публичные маршруты
	router.HandleFunc("/register", handlers.RegisterHandler).Methods("POST")
	router.HandleFunc("/login", handlers.LoginHandler).Methods("POST")

	// Защищенные маршруты
	protected := router.PathPrefix("/protected").Subrouter()
	protected.Use(middleware.AuthMiddleware)
	protected.HandleFunc("/dashboard", func(w http.ResponseWriter, r *http.Request) {
		username := r.Context().Value("username").(string)
		w.Write([]byte("Добро пожаловать, " + username))
	}).Methods("GET")

	log.Println("Сервер запущен на :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
