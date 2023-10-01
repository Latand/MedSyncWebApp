import asyncio
import logging

import betterlogging as bl
from aiogram import Bot, Dispatcher

from infrastructure.database.setup import create_engine, create_session_pool
from tgbot.config import load_config
from tgbot.handlers import routers_list
from tgbot.middlewares.database import DatabaseMiddleware
from tgbot.services import broadcaster


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
    dp = Dispatcher()
    engine = create_engine(config.db)
    session_pool = create_session_pool(engine)
    dp.message.outer_middleware(DatabaseMiddleware(session_pool))

    dp.include_routers(*routers_list)

    await on_startup(bot, config.tg_bot.admin_ids)
    await dp.start_polling(bot, config=config)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.error("Bot has been stopped")
