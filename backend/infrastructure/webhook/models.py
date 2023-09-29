from typing import Optional

from pydantic import BaseModel


class Diagnostic(BaseModel):
    diagnostic_id: int
    type_name: str
    description: str
    price: float

    class Config:
        from_attributes = True


class DiagnosticLocation(BaseModel):
    diagnostic_location_id: int
    diagnostic_id: int
    location_id: int

    class Config:
        from_attributes = True


class DoctorBookingPayload(BaseModel):
    doctor_slot_id: int
    user_full_name: str
    user_email: str
    user_phone_number: str


class Doctor(BaseModel):
    doctor_id: int
    location_id: int
    full_name: str
    specialty_name: str
    specialty_id: int
    price: float
    reviews: int
    avg_rating: float
    photo_url: str
    address: str

    class Config:
        from_attributes = True


class Specialty(BaseModel):
    specialty_id: int
    specialty_name: str

    class Config:
        from_attributes = True


class DoctorRating(BaseModel):
    doctor_id: int
    rating: int

    class Config:
        from_attributes = True


class DoctorBooking(BaseModel):
    appointment_id: int
    user_id: int
    doctor_id: int
    slot_id: int
    status: str

    class Config:
        from_attributes = True


class Location(BaseModel):
    location_id: int
    name: str
    address: str

    class Config:
        from_attributes = True


class Slot(BaseModel):
    slot_id: int
    location_id: int
    start_time: int
    end_time: int

    class Config:
        from_attributes = True


class DoctorSlot(BaseModel):
    doctor_slot_id: int
    doctor_id: int
    slot_id: int
    is_booked: bool

    class Config:
        from_attributes = True


class DiagnosticSlot(BaseModel):
    diagnostic_slot_id: int
    diagnostic_location_id: int
    slot_id: int
    is_booked: bool

    class Config:
        from_attributes = True


class Booking(BaseModel):
    booking_id: int
    user_full_name: str
    user_email: str
    user_phone_number: str
    doctor_slot_id: int
    diagnostic_slot_id: int

    class Config:
        from_attributes = True


class User(BaseModel):
    user_id: int
    username: Optional[str]
    full_name: str

    class Config:
        from_attributes = True
