package middleware

import (
	"booking-system/auth"
	"context"
	"log"
	"net/http"
	"strings"
)

// Определяем кастомные типы ключей для контекста
type contextKey string

const (
	UsernameKey contextKey = "username"
	RoleKey     contextKey = "role"
)

// AuthMiddleware проверяет JWT-токен
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Получаем заголовок Authorization
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized: Missing Authorization header", http.StatusUnauthorized)
			return
		}

		// Проверяем, начинается ли заголовок с "Bearer "
		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Unauthorized: Invalid token format", http.StatusUnauthorized)
			return
		}

		// Убираем "Bearer " и получаем токен
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Парсим токен
		claims, err := auth.ParseToken(tokenString)
		if err != nil {
			log.Printf("Ошибка авторизации: %v", err)
			http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}

		// Проверяем наличие username и role
		username, ok := claims["username"].(string)
		if !ok {
			http.Error(w, "Unauthorized: Username not found in token", http.StatusUnauthorized)
			return
		}
		role, ok := claims["role"].(string)
		if !ok {
			http.Error(w, "Unauthorized: Role not found in token", http.StatusUnauthorized)
			return
		}

		log.Printf("Пользователь авторизован: %s с ролью %s", username, role)

		// Добавляем данные в контекст
		ctx := context.WithValue(r.Context(), UsernameKey, username)
		ctx = context.WithValue(ctx, RoleKey, role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
