---
title: Configuration Setup
---

# Configuration Setup

Before spinning up your instance of the MedSync WebApp & Bot, you need to clone the repository and set up a few configuration files.

## 1. Preliminary Steps

1. Clone the Project Repository

    ```bash
    git clone https://github.com/Latand/MedSyncWebApp.git
    ```

2. Navigate into the Project Directory

    ```bash
    cd MedSyncWebApp
    ```

## 2. Obtain a Domain and SSL Certificate

- If you're running locally, you can use Ngrok setup to obtain a domain and SSL certificate. [Read the Ngrok setup section](ngrok.md).
- If you're running on a server, you can use a domain you already own. [Read the Acquiring a Domain section](owned-domain.md).

After you have a domain and SSL certificate, note down the domain(s) for the next step.

## 3. Bot & Database Configuration

1. Rename the file `.env.dist` to `.env`.
    
    ```bash
    mv .env.dist .env
    ```

2. Open the content in `.env`:
    Open with nano/vim:
    ```bash
    nano .env
    ```

3. Inside `.env`, modify the following:

    ```dotenv hl_lines="1 2 5 6 10 15" title=".env"
    BOT_TOKEN=123456:Your-TokEn_ExaMple
    ADMINS=123456789,987654321
    USE_REDIS=True

    POSTGRES_USER=someusername
    POSTGRES_PASSWORD=postgres_pass12345
    POSTGRES_DB=bot
    DB_HOST=pg_database

    FRONTEND_URL=https://example.com

    REDIS_HOST=redis_cache
    REDIS_PORT=6388
    REDIS_DB=1
    REDIS_PASSWORD=someredispass
    ```

4. Update the `BOT_TOKEN` with your Telegram bot token. 
5. Replace `ADMINS` with the Telegram IDs you wish to assign admin rights to. The bot will send a message
  to these users every time it starts.
6. Configure the PostgreSQL credentials (`POSTGRES_USER` and `POSTGRES_PASSWORD`). 
7. Update `REDIS_PASSWORD` to prevent unauthorized access to the Redis database.
8. Modify the `FRONTEND_URL` with your domain (either the Ngrok FRONTEND url or your owned domain url).

## 4. Frontend Configuration

1. Navigate to the frontend directory and rename the file `.env.dist` to `.env`.
    
    ```bash
    cd frontend
    mv .env.dist .env
    ```

2. Open the content in `.env`:
    Open with nano/vim:
    ```bash
    nano .env
    ```
    You should see:
    ```dotenv title="frontend/.env"
    VITE_REACT_APP_API_URL=https://your-domain.com
    ```

    Replace `https://your-domain.com` with your BACKEND URL.

!!! question "What is Backend URL?"

    - If you're **running live**: this have to be your same [owned purchased domain](owned-domain.md). The **nginx will proxy the requests to the backend using the same domain**.
    - If you're using Ngrok, you need to set the `VITE_REACT_APP_API_URL=http://localhost:3779`, but the app will work only on your local machine.

!!! success "You're good to go!"

    You have successfully configured the project. Proceed to [the next step to initialize the dependencies](dependencies-initialization.md).