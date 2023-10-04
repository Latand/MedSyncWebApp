---
title: Configuration Setup
---

# Configuration Setup

Before spinning up your instance of the MedSync WebApp & Bot, you need to set up a few configuration files.

## 1. Ngrok Configuration

!!! warning "OPTIONAL"
    If you're using your own purchased domain, you can skip this section.
    
    Refer to this [section](ngrok.md) for more details on how to register and acquire domains on Ngrok.


1. Rename the file `ngrok.yml.dist` to `ngrok.yml`.

2. In `ngrok.yml`, update the content as:
    ```yml hl_lines="2 9 15"
    version: 2
    authtoken: <your-ngrok-token>
    tunnels:
   
      # frontend
      first:
        addr: app:5173
        proto: http
        hostname: your-ngrok-hostname.ngrok-free.app
   
      # backend
      second:
        addr: app:8000
        proto: http
        hostname: your-second-ngrok-hostname.ngrok-free.app
    ```
3. Replace `<your-ngrok-token>` with the token from your Ngrok account.

4. Adjust the `your-ngrok-hostname.ngrok-free.app` and `your-second-ngrok-hostname.ngrok-free.app` with the static domains you set up in Ngrok (refer to the [Ngrok setup section](ngrok.md) for more details).

    You will have two domains, one for the frontend and one for the backend.

    !!! warning
        - The domains must be different.
        - ❗️❗️ You might have to pay for the ngrok subscription to get 2 static domains.

## 2. Bot & Database Configuration

1. Rename the file `.env.dist` to `.env`.

2. Inside `.env`, modify the following:

    ```env
    BOT_TOKEN=123456:Your-TokEn_ExaMple
    ADMINS=123456,654321
    POSTGRES_USER=someusername
    POSTGRES_PASSWORD=postgres_pass12345
    REDIS_PASSWORD=someredispass
    DOMAIN_NAME=example.com
    ```

3. Update the `BOT_TOKEN` with your Telegram bot token. 
4. Replace `ADMINS` with the Telegram IDs you wish to assign admin rights to. The bot will send a message
  to these users every time it starts.
5. Configure the PostgreSQL credentials (`POSTGRES_USER` and `POSTGRES_PASSWORD`). 
6. Update `REDIS_PASSWORD` to prevent unauthorized access to the Redis database.
7. Modify the `DOMAIN_NAME` with your domain (either the ==Ngrok FRONTEND domain== or your ==owned domain==).

## 3. Frontend Configuration

1. Navigate to the frontend directory and rename the file `.env.dist` to `.env`.

2. Adjust the content in `.env`:

    ```env
    VITE_REACT_APP_API_URL=https://your-domain.com
    ```

3. Replace `https://your-domain.com` with your BACKENDdomain's URL.

!!! warning "Warning - Ngrok"
    If you're using Ngrok, you need to update the `VITE_REACT_APP_API_URL` with the Ngrok BACKEND DOMAIN.
    
    Otherwise, this will be your same owned domain.
    In the latter case, the **nginx will proxy the requests to the backend using the same domain**.

