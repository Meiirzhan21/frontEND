package models

type Booking struct {
	ID          int    `json:"id" gorm:"primaryKey"`
	UserID      int    `json:"user_id" gorm:"not null"`
	ServiceID   int    `json:"service_id" gorm:"not null"`
	BookingDate string `json:"booking_date"`
	Status      string `json:"status"`
}
