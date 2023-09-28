export BOT_CONTAINER_NAME=medsync_bot
docker exec ${BOT_CONTAINER_NAME} alembic upgrade head