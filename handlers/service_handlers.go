package handlers

import (
	"encoding/json"
	"net/http"

	"booking-system/database"
	"booking-system/models"
)

// Получить все услуги
func GetServices(w http.ResponseWriter, r *http.Request) {
	var services []models.Service
	database.DB.Find(&services)
	json.NewEncoder(w).Encode(services)
}

// Создать услугу
func CreateService(w http.ResponseWriter, r *http.Request) {
	var service models.Service
	if err := json.NewDecoder(r.Body).Decode(&service); err != nil {
		http.Error(w, "Ошибка чтения данных", http.StatusBadRequest)
		return
	}
	database.DB.Create(&service)
	json.NewEncoder(w).Encode(service)
}
