package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"booking-system/auth"
	"booking-system/models"
)

var users = map[string]string{} // Временная база пользователей

// Регистрация пользователя
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var creds models.User
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Ошибка чтения данных", http.StatusBadRequest)
		return
	}

	hashedPassword, err := auth.HashPassword(creds.Password)
	if err != nil {
		http.Error(w, "Ошибка при создании пароля", http.StatusInternalServerError)
		return
	}

	users[creds.Username] = hashedPassword
	w.WriteHeader(http.StatusCreated)
}

// Вход пользователя
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds models.User
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Ошибка чтения данных", http.StatusBadRequest)
		return
	}

	hashedPassword, exists := users[creds.Username]
	if !exists || !auth.CheckPasswordHash(creds.Password, hashedPassword) {
		http.Error(w, "Неверный логин или пароль", http.StatusUnauthorized)
		return
	}

	token, err := auth.GenerateJWT(creds.Username)
	if err != nil {
		http.Error(w, "Ошибка генерации токена", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
	})

	json.NewEncoder(w).Encode(map[string]string{"token": token})
}
