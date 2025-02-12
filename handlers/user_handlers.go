package handlers

import (
	"booking-system/database"
	"booking-system/models"
	"encoding/json"
	"net/http"
)

// Получить всех пользователей
func GetUsers(w http.ResponseWriter, r *http.Request) {
	var users []models.User
	database.DB.Find(&users)
	json.NewEncoder(w).Encode(users)
}

// Создать пользователя
func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Ошибка чтения данных", http.StatusBadRequest)
		return
	}

	// Проверяем, существует ли пользователь с таким email
	var existingUser models.User
	result := database.DB.Where("email = ?", user.Email).First(&existingUser)

	if result.RowsAffected > 0 {
		http.Error(w, "Ошибка: Email уже используется", http.StatusConflict)
		return
	}

	database.DB.Create(&user)
	json.NewEncoder(w).Encode(user)
}
