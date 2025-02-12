package main

import (
	"booking-system/routes"
	"fmt"
	"log"
	"net/http"
)

func main() {
	r := routes.SetupRouter()

	fmt.Println("🚀 Сервер запущен на http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
