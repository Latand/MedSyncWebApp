import json

from aiogram import Router, F, types
from aiogram.utils.markdown import hcode, hbold

from medsyncapp.infrastructure.database.repo.requests import RequestsRepo

web_app_router = Router()


@web_app_router.message(F.web_app_data)
async def bot_echo(message: types.Message, repo: RequestsRepo):
    data = json.loads(message.web_app_data.data)

    if data.get("action") == "booking_confirmed":
        booking_id = data.get("booking_id")
        booking_info = await repo.bookings.get_booking(int(booking_id))

        booking_time = booking_info.Booking.booking_time.strftime("%d %B %Y, %H:%M UTC")

        appointment_type_text =f"👨‍⚕️ Doctor: {hbold(booking_info.Doctor.full_name)}\n" if booking_info.Doctor else f"🔬 Diagnostic: {hbold(booking_info.Diagnostic.type_name)}\n"

        await message.answer(
            text=f"🎉 Congratulations! Your booking is confirmed. 🎉\n\n"
                 f"📋 Booking ID: {hcode(booking_id)}\n"
                    f"{appointment_type_text}"
                 f"📆 Date & Time: {hbold(booking_time)}\n\n"
                 f"📍 Location: {hbold(booking_info.Location.name)}: {hbold(booking_info.Location.address)}\n\n"
                 f"Thank you for choosing our service! If you have any questions or need to reschedule, feel free to reach out. 📞"
        )
