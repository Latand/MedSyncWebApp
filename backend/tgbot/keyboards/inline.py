from aiogram.types import WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder


def main_menu(domain: str):
    kb = InlineKeyboardBuilder()
    kb.button(text="Main Page", web_app=WebAppInfo(url=domain))
    kb.button(
        text="📅 Book an appointment",
        web_app=WebAppInfo(url=f"{domain}/see_a_doctor"),
    )
    kb.button(
        text="📝 Get tested",
        web_app=WebAppInfo(url=f"{domain}/get_tested"),
    )
    kb.button(text="📋 My bookings", callback_data="my_bookings")
    kb.button(text="📋 My Results", callback_data="my_results")
    kb.adjust(1, 2, 2)
    return kb.as_markup()


