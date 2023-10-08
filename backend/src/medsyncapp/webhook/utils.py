import hashlib
import hmac
import time
from urllib.parse import unquote, parse_qsl

from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.database.setup import create_session_pool, create_engine
from tgbot.config import load_config, Config

config: Config = load_config()
engine = create_engine(config.db)
session_pool = create_session_pool(engine)


async def get_repo():
    async with session_pool() as session:
        yield RequestsRepo(session)


def parse_init_data(init_data: str = None) -> dict:
    if not init_data:
        return {}

    parsed_data = dict(parse_qsl(init_data))
    return parsed_data


def validate_telegram_data(init_data: str) -> bool:
    parsed_data = parse_init_data(init_data)

    received_hash = parsed_data.pop("hash")
    # Constructing the data-check-string
    fields = sorted(
        [(key, unquote(value)) for key, value in parsed_data.items() if key != "hash"]
    )
    # Constructing the data-check-string using the sorted order
    data_check_string = "\n".join(f"{k}={v}" for k, v in fields)

    print(data_check_string)
    # Computing the secret key
    secret_key = hmac.new(
        b"WebAppData", config.tg_bot.token.encode(), hashlib.sha256
    ).digest()

    # Comparing received hash with computed hash
    computed_hash = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()

    if computed_hash != received_hash:
        return False

    # Checking for outdated data
    auth_date = int(parsed_data.get("auth_date", [0])[0])
    current_time = int(time.time())
    # Check if the data is older than 24 hours (86400 seconds)
    if current_time - auth_date > 86400:
        return False

    return True