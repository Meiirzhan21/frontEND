package models

// Payment модель платежа
type Payment struct {
	ID            int     `json:"id" gorm:"primaryKey"`
	BookingID     int     `json:"booking_id" gorm:"not null"`
	Amount        float64 `json:"amount"`
	PaymentStatus string  `json:"payment_status"`
}
