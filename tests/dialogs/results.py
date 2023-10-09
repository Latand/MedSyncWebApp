import random
from collections import namedtuple
from datetime import datetime
from typing import TypeVar

import pytest
from aiogram import Dispatcher, Router
from aiogram.filters import CommandStart
from aiogram.methods import TelegramMethod, SendDocument, SendMessage
from aiogram.types import CallbackQuery, Update, Message, Document
from aiogram_dialog import setup_dialogs, StartMode, ShowMode
from aiogram_dialog.test_tools import BotClient, MockMessageManager
from aiogram_dialog.test_tools.bot_client import FakeBot
from aiogram_dialog.test_tools.keyboard import InlineButtonTextLocator

from medsyncapp.tgbot.handlers.test_results import test_results_dialog, MyResult

Diagnostic = namedtuple("Diagnostic", ["type_name"])
Booking = namedtuple("Booking", ["booking_time"])
DiagnosticResult = namedtuple(
    "DiagnosticResult", ["diagnostic_result_id", "file_id", "file_path"]
)

Row = namedtuple("Row", ["Diagnostic", "Booking", "DiagnosticResult"])

test_data = [
    Row(
        Diagnostic=Diagnostic(type_name="Blood Test"),
        Booking=Booking(booking_time=datetime.fromtimestamp(1234567890)),
        DiagnosticResult=DiagnosticResult(
            diagnostic_result_id=1, file_id="123", file_path="123"
        ),
    )
]

T = TypeVar("T")


class MyFakeBot(FakeBot):
    def __init__(self, message_manager):
        super().__init__()
        self.message_manager: MockMessageManager = message_manager

    def __call__(self, method: TelegramMethod[T]) -> None:
        async def fake_session():
            if isinstance(method, SendDocument):
                self.message_manager.sent_messages.append(
                    Message(
                        message_id=self.message_manager.last_message_id + 1,
                        date=datetime.now(),
                        chat=self.message_manager.sent_messages[-1].chat,
                        document=Document(
                            file_id=method.document, file_unique_id=method.document
                        ),
                        caption=method.caption,
                    )
                )
            elif isinstance(method, SendMessage):
                self.message_manager.sent_messages.append(
                    Message(
                        message_id=self.message_manager.last_message_id + 1,
                        date=datetime.now(),
                        chat=self.message_manager.sent_messages[-1].chat,
                        text=method.text,
                    )
                )

            print(len(self.message_manager.sent_messages))
        return fake_session()


@pytest.fixture()
def mock_repo():
    class MockRequestsRepo:
        class results:
            async def get_results(self, **kwargs):
                return test_data

            async def get_result(self):
                return test_data[0]

    return MockRequestsRepo()


class BotClientM(BotClient):
    def __init__(self, dp, bot: MyFakeBot):
        super().__init__(dp, bot=bot)

    # def _new_callback_query(self, data: str):
    #     print()
    #     return CallbackQuery(
    #         data=data,
    #         id=str(random.randint(1, 100000)),
    #         date=datetime.fromtimestamp(1234567890),
    #         chat=self.chat,
    #         from_user=self.user,
    #         chat_instance="--",
    #     )
    #
    # async def send_callback(self, data: str):
    #     return await self.dp.feed_update(
    #         self.bot,
    #         Update(
    #             update_id=self._new_update_id(),
    #             callback_query=self._new_callback_query(data),
    #         ),
    #     )


@pytest.fixture()
def message_manager() -> MockMessageManager:
    return MockMessageManager()


@pytest.fixture()
def client(dp, bot) -> BotClientM:
    return BotClientM(dp, bot)


test_results_router = Router()


@test_results_router.message(CommandStart())
async def my_bookings(message, dialog_manager):
    await dialog_manager.start(
        MyResult.show_list, mode=StartMode.RESET_STACK, show_mode=ShowMode.SEND
    )


@pytest.fixture()
def dp(message_manager: MockMessageManager, mock_repo):
    dp = Dispatcher()
    dp.workflow_data.update(
        repo=mock_repo,
    )
    dp.include_routers(test_results_dialog, test_results_router)
    setup_dialogs(dp, message_manager=message_manager)
    return dp


@pytest.fixture()
def bot(message_manager: MockMessageManager):
    return MyFakeBot(message_manager)


@pytest.mark.asyncio
async def test_my_bookings(dp, message_manager, client, mock_repo):
    await client.send("/start")

    first_message = message_manager.one_message()
    assert first_message.text == "Here is your results list. Select one to see the file"
    assert first_message.reply_markup

    await client.click(
        first_message, InlineButtonTextLocator("📋 Blood Test: 14 February 2009")
    )
    second_message = message_manager.sent_messages[-2]
    assert second_message.document.file_id
    assert second_message.caption == "📋 Blood Test: 14 February 2009"
