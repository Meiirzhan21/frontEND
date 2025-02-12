package handlers

import (
	"encoding/json"
	"net/http"

	"booking-system/database"
	"booking-system/models"
)

// Получить все бронирования
func GetBookings(w http.ResponseWriter, r *http.Request) {
	var bookings []models.Booking
	database.DB.Find(&bookings)
	json.NewEncoder(w).Encode(bookings)
}

// Создать бронирование
func CreateBooking(w http.ResponseWriter, r *http.Request) {
	var booking models.Booking
	if err := json.NewDecoder(r.Body).Decode(&booking); err != nil {
		http.Error(w, "Ошибка чтения данных", http.StatusBadRequest)
		return
	}

	// Проверяем, передаётся ли user_id
	if booking.UserID == 0 {
		http.Error(w, "Ошибка: user_id не передан", http.StatusBadRequest)
		return
	}

	database.DB.Create(&booking)
	json.NewEncoder(w).Encode(booking)
}
