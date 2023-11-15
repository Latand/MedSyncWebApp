from aiogram import Router, types, Bot
from aiogram.filters import JOIN_TRANSITION, ChatMemberUpdatedFilter

from medsyncapp.tgbot.config import Config
from medsyncapp.tgbot.services.broadcaster import broadcast
from medsyncapp.tgbot.services.log_new_user import track_user_join_text

new_users_router = Router()




@new_users_router.my_chat_member(ChatMemberUpdatedFilter(JOIN_TRANSITION))
async def new_user(cmu: types.ChatMemberUpdated, config: Config, bot: Bot):
    await broadcast(bot, config.tg_bot.admin_ids, track_user_join_text(cmu.from_user))
