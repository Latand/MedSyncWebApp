from aiogram import types


def track_user_join_text(from_user: types.User):
    user_username = f"@{from_user.username}" if from_user.username else ""
    user_mention = from_user.mention_html(from_user.full_name)
    return f"{user_mention} {user_username} joined the bot"
