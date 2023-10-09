import logging
import operator
import os
from typing import Any

from aiogram import Router, F, types
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import FSInputFile
from aiogram_dialog import Window, Dialog, DialogManager, StartMode, ShowMode
from aiogram_dialog.widgets.kbd import ScrollingGroup, Select, Cancel
from aiogram_dialog.widgets.text import Format, Const

from medsyncapp.infrastructure.database.repo.requests import RequestsRepo
from medsyncapp.tgbot.handlers.start import start_from_dialog_menu

test_results_router = Router()

PUBLIC_DIR_PATH = "/src/public"

class MyResult(StatesGroup):
    show_list = State()


async def get_results(dialog_manager: DialogManager, repo: RequestsRepo, **kwargs):
    results = await repo.results.get_results(dialog_manager.event.from_user.id)
    return {
        "results": [
            (
                f"📋 {result.Diagnostic.type_name}: {result.Booking.booking_time.strftime('%d %B %Y')}",
                result.DiagnosticResult.diagnostic_result_id,
            )
            for result in results
        ]
    }


async def show_result(
    callback_query: types.CallbackQuery,
    widget: Any,
    dialog_manager: DialogManager,
    result_id: str,
):
    repo: RequestsRepo = dialog_manager.middleware_data.get("repo")
    result = await repo.results.get_result(int(result_id))
    caption = f"📋 {result.Diagnostic.type_name}: {result.Booking.booking_time.strftime('%d %B %Y')}"
    if result.DiagnosticResult.file_id:
        file = result.DiagnosticResult.file_id
    else:
        full_path = os.path.join(PUBLIC_DIR_PATH, result.DiagnosticResult.file_path)
        logging.info(f"full_path: {full_path}")
        file = FSInputFile(full_path)
    msg = await callback_query.message.answer_document(file, caption=caption)

    if not result.DiagnosticResult.file_id:
        await repo.results.save_file_id(int(result_id), msg.document.file_id)


test_results_dialog = Dialog(
    Window(
        Const("Here is your results list. Select one to see the file"),
        ScrollingGroup(
            Select(
                Format("{item[0]}"),
                id="s_result",
                item_id_getter=operator.itemgetter(1),
                items="results",
                on_click=show_result,
            ),
            id="scroll_results",
            width=1,
            height=10,
            hide_on_single_page=True,
        ),
        Cancel(Const("Exit"), on_click=start_from_dialog_menu),
        getter=get_results,
        state=MyResult.show_list,
    ),
)


@test_results_router.callback_query(F.data == "my_results")
async def my_bookings(
    callback_query: types.CallbackQuery, dialog_manager: DialogManager
):
    await callback_query.answer()
    await dialog_manager.start(
        MyResult.show_list, mode=StartMode.RESET_STACK, show_mode=ShowMode.SEND
    )
