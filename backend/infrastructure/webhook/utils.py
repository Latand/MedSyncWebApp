from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.database.setup import create_session_pool, create_engine
from tgbot.config import load_config, Config

config: Config = load_config()
engine = create_engine(config.db)
session_pool = create_session_pool(engine)


async def get_repo():
    async with session_pool() as session:
        yield RequestsRepo(session)
