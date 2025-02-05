package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Ваш секретный ключ
var secretKey = []byte("your-secret-key")

// ParseToken парсит JWT токен и извлекает данные из него
func ParseToken(tokenString string) (jwt.MapClaims, error) {
	// Парсим токен
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Проверка на использование правильного алгоритма (например, HMAC)
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid token signing method")
		}
		return secretKey, nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	// Преобразуем claims в MapClaims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}

// GenerateJWT генерирует JWT токен для пользователя
func GenerateJWT(username string) (string, error) {
	// Устанавливаем время действия токена (например, 24 часа)
	expirationTime := time.Now().Add(24 * time.Hour)

	// Создаем объект claims с данными
	claims := jwt.MapClaims{
		"username": username, // Теперь username хранится здесь
		"exp":      expirationTime.Unix(),
	}

	// Создаем новый токен с указанными claims и подписываем его с помощью HMAC
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Подписываем токен и возвращаем его строковое представление
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
