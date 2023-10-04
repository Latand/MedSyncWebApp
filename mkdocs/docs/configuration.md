## Configuration Setup

Before spinning up your instance of the MedSync WebApp & Bot, you need to set up a few configuration files. Below are
the essential configuration files and guidelines on how to modify them for your environment:

### 1. `[OPTIONAL]` Ngrok Configuration (if you're using Ngrok):

- Rename the file `ngrok.yml.dist` to `ngrok.yml`.

  In `ngrok.yml`, update the content as:

  ```yml
  version: 2
  authtoken: <your-ngrok-token>
  tunnels:
    first:
      addr: app:5173
      proto: http
      hostname: your-ngrok-hostname.ngrok-free.app
  ```

    - Replace `<your-ngrok-token>` with the token from your Ngrok account.
    - Adjust the `your-ngrok-hostname.ngrok-free.app` with the static domain you set up in Ngrok (refer to the Ngrok
      setup section for more details).

### 2. Bot & Database Configuration:

- Rename the file `.env.dist` to `.env`.

  Inside `.env`, modify the following:

  ```env
  BOT_TOKEN=123456:Your-TokEn_ExaMple
  ADMINS=123456,654321
  POSTGRES_USER=someusername
  POSTGRES_PASSWORD=postgres_pass12345
  REDIS_PASSWORD=someredispass
  DOMAIN_NAME=example.com
  ```

    - Update the `BOT_TOKEN` with your Telegram bot token.
    - Replace `ADMINS` with the Telegram IDs you wish to assign admin rights to. The bot will send the startup message
      to these users.
    - Configure the PostgreSQL credentials (`POSTGRES_USER` and `POSTGRES_PASSWORD`).
    - Update `REDIS_PASSWORD` for Redis caching.
    - Modify the `DOMAIN_NAME` with your domain (either the Ngrok domain or your owned domain).

### 3. Frontend Configuration:

- Navigate to the frontend directory and rename the file `.env.dist` to `.env`.

  Adjust the content in `.env`:

  ```env
  VITE_REACT_APP_API_URL=https://your-domain.com
  ```

    - Replace `https://your-domain.com` with your domain's URL.

---

Once these configurations are appropriately set, you can then proceed with the deployment and running of the MedSync
Bot. Consult the dedicated sections for instructions on deploying each component.