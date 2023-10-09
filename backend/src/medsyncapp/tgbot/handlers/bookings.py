import operator
from typing import Any

from aiogram import Router, F, types
from aiogram.fsm.state import StatesGroup, State
from aiogram_dialog import Window, Dialog, DialogManager, StartMode, ShowMode
from aiogram_dialog.widgets.kbd import ScrollingGroup, Select, Cancel, Back
from aiogram_dialog.widgets.text import Format, Const

from medsyncapp.infrastructure.database.repo.requests import RequestsRepo
from medsyncapp.tgbot.handlers.start import start_from_dialog_menu

profile_router = Router()


class MyBookings(StatesGroup):
    show_list = State()
    show_booking = State()


async def get_bookings(dialog_manager: DialogManager, repo: RequestsRepo, **kwargs):
    bookings = await repo.bookings.get_user_bookings(dialog_manager.event.from_user.id)
    return {
        "bookings": [
            (
                ("👨‍⚕️" if booking.Doctor else "🔬")
                + (
                    f"{booking.Booking.booking_time.strftime('%d %B')}"
                    + (
                        f" - {booking.Diagnostic.type_name}"
                        if booking.Diagnostic
                        else f" - {booking.Doctor.full_name}"
                    )
                ),
                booking.Booking.booking_id,
            )
            for booking in bookings
        ]
    }


async def get_booking_info(dialog_manager: DialogManager, repo: RequestsRepo, **kwargs):
    repo: RequestsRepo = dialog_manager.middleware_data.get("repo")
    booking_id = dialog_manager.dialog_data.get("booking_id")
    booking_info = await repo.bookings.get_booking(int(booking_id))

    booking_time = booking_info.Booking.booking_time.strftime("%d %B %Y, %H:%M UTC")

    appointment_type_text = (
        f"👨‍⚕️ Doctor: {booking_info.Doctor.full_name}\n"
        if booking_info.Doctor
        else f"🔬 Diagnostic: {booking_info.Diagnostic.type_name}\n"
    )

    return {
        "text": (
            f"📋 Booking ID: {booking_info.Booking.booking_id}\n"
            f"{appointment_type_text}"
            f"📆 Date & Time: {booking_time}\n\n"
            f"📍 Location: {booking_info.Location.name}: {booking_info.Location.address}\n\n"
            f"Thank you for choosing our service! If you have any questions or need to reschedule, feel free to reach out. 📞"
        )
    }


async def show_booking(
    callback_query: types.CallbackQuery,
    widget: Any,
    dialog_manager: DialogManager,
    booking_id: str,
):
    dialog_manager.dialog_data.update(booking_id=booking_id)
    await dialog_manager.switch_to(MyBookings.show_booking)


booking_dialog = Dialog(
    Window(
        Const("Here is your booking list. Select one to see details"),
        ScrollingGroup(
            Select(
                Format("{item[0]}"),
                id="s_bookings",
                item_id_getter=operator.itemgetter(1),
                items="bookings",
                on_click=show_booking,
            ),
            id="scroll_bookings",
            width=1,
            height=10,
            hide_on_single_page=True,
        ),
        Cancel(Const("Exit"), on_click=start_from_dialog_menu),
        getter=get_bookings,
        state=MyBookings.show_list,
    ),
    Window(
        Const("Here is your booking details\n\n"),
        Format("{text}"),
        Back(Const("Back")),
        getter=get_booking_info,
        state=MyBookings.show_booking,
    ),
)


@profile_router.callback_query(F.data == "my_bookings")
async def my_bookings(
    callback_query: types.CallbackQuery, dialog_manager: DialogManager
):
    await callback_query.answer()
    await dialog_manager.start(MyBookings.show_list, mode=StartMode.RESET_STACK, show_mode=ShowMode.SEND)
