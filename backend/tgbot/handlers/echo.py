import json

from aiogram import types, Router, F

from tgbot.config import Config

echo_router = Router()


@echo_router.message(F.text)
async def send_webapp(message: types.Message, config: Config):
    await message.answer(
        "Welcome to MedSync App!",
        reply_markup=types.ReplyKeyboardMarkup(
            keyboard=[
                [
                    types.KeyboardButton(
                        text="Open web app",
                        web_app=types.WebAppInfo(
                            url=config.tg_bot.web_app_domain
                        )
                    )
                ]
            ],
            resize_keyboard=True
        )
    )


@echo_router.message(F.web_app_data)
async def bot_echo(message: types.Message):
    data = json.loads(message.web_app_data.data)
    if data.get("action") == "booking_confirmed":
        booking_id = data.get("booking_id")
        await message.answer(text=f"Your booking is confirmed! Booking ID: {booking_id}")
    # await message.answer(text=message.web_app_data.data)
