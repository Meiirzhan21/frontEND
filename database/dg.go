package database

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"booking-system/models"
)

var DB *gorm.DB

func Connect() {
	dsn := "host=localhost user=postgres password=04062004 dbname=booking_system port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("❌ Ошибка подключения к базе данных:", err)
	}

	DB = db
	fmt.Println("✅ Подключено к базе данных")

	// Автоматическая миграция таблиц
	err = DB.AutoMigrate(&models.User{}, &models.Service{}, &models.Booking{}, &models.Payment{})
	if err != nil {
		log.Fatal("❌ Ошибка миграции:", err)
	}

	fmt.Println("✅ Таблицы созданы или обновлены")
}
