import asyncio
import logging

import betterlogging as bl
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.redis import DefaultKeyBuilder, RedisStorage
from aiogram_dialog import setup_dialogs

from medsyncapp.infrastructure.database.setup import create_engine, create_session_pool
from medsyncapp.tgbot.config import load_config
from medsyncapp.tgbot.handlers import routers_list
from medsyncapp.tgbot.handlers.bookings import booking_dialog
from medsyncapp.tgbot.handlers.test_results import test_results_router, test_results_dialog
from medsyncapp.tgbot.middlewares.database import DatabaseMiddleware
from medsyncapp.tgbot.services import broadcaster


async def on_startup(bot: Bot, admin_ids: list[int]):
    await broadcaster.broadcast(bot, admin_ids, "Bot has been started")


def setup_logging():
    """
    Set up logging configuration for the application.

    This method initializes the logging configuration for the application.
    It sets the log level to INFO and configures a basic colorized log for
    output. The log format includes the filename, line number, log level,
    timestamp, logger name, and log message.

    Returns:
        None

    Example usage:
        setup_logging()
    """
    log_level = logging.INFO
    bl.basic_colorized_config(level=log_level)

    logging.basicConfig(
        level=logging.INFO,
        format="%(filename)s:%(lineno)d #%(levelname)-8s [%(asctime)s] - %(name)s - %(message)s",
    )
    logger = logging.getLogger(__name__)
    logger.info("Starting bot")


async def main():
    setup_logging()

    config = load_config(".env")

    bot = Bot(token=config.tg_bot.token, parse_mode="HTML")
    storage = RedisStorage.from_url(
        config.redis.dsn(),
        key_builder=DefaultKeyBuilder(with_bot_id=True, with_destiny=True),
    )
    dp = Dispatcher(storage=storage)
    engine = create_engine(config.db)
    session_pool = create_session_pool(engine)
    dp.update.outer_middleware(DatabaseMiddleware(session_pool))

    dp.include_routers(*routers_list)
    dp.include_routers(booking_dialog, test_results_dialog)
    setup_dialogs(dp)

    await on_startup(bot, config.tg_bot.admin_ids)
    await dp.start_polling(bot, config=config)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.error("Bot has been stopped")
