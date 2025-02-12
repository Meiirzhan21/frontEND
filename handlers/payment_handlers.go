package handlers

import (
	"encoding/json"
	"net/http"

	"booking-system/database"
	"booking-system/models"
)

// Получить все платежи
func GetPayments(w http.ResponseWriter, r *http.Request) {
	var payments []models.Payment
	database.DB.Find(&payments)
	json.NewEncoder(w).Encode(payments)
}

// Создать платеж и обновить статус бронирования
func CreatePayment(w http.ResponseWriter, r *http.Request) {
	var payment models.Payment
	if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
		http.Error(w, "Ошибка чтения данных", http.StatusBadRequest)
		return
	}

	// Проверяем, существует ли бронирование
	var existingBooking models.Booking
	result := database.DB.First(&existingBooking, payment.BookingID)

	if result.RowsAffected == 0 {
		http.Error(w, "Ошибка: Бронирование не найдено", http.StatusBadRequest)
		return
	}

	// Добавляем платеж в базу данных
	database.DB.Create(&payment)

	// Обновляем статус бронирования на "paid"
	database.DB.Model(&models.Booking{}).
		Where("id = ?", payment.BookingID).
		Update("status", "paid")

	// Отправляем подтверждение
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Оплата успешна!"})
}
