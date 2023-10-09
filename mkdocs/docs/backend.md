---
title: Bot and REST API Setup
---

# Bot and REST API Setup


## 1. Introduction

!!! abstract "Overview"
    This guide dives into the backend architecture of the MedSync WebApp. 

    We will explore the key features of each service and how they interact with each other.

!!! warning "Prerequisites"
    - Before diving into the intricacies of each service, ensure you have Docker and Docker Compose set up on your machine. 
    If not, refer to the [Dependencies Initialization section](dependencies-initialization.md) and the [Docker section](docker.md) to get up to speed. 

    - ❗️❗️ Familiarity with Python is crucial.

## 2. Service Overview

### 1. Telegram Bot Service

- **Location**: `./backend/src/medsyncapp/tgbot`
- **Entry Point**: `backend/src/medsyncapp/tgbot/bot.py`
- **Key Libraries**:
    - `aiogram`: For crafting Telegram bot functionalities.
    - `environs`: Environment variable parsing from `.env` files.
    - `redis`: Used as temporary storage for the bot's FSM(1), ensuring data isn't lost during restarts.
        { .annotate }
     
        1. FSM: Finite State Machine
      
    - `betterlogging`: Enhanced logging capabilities(1)
        { .annotate }
           
        1. You can use the standard `logging` library instead if you prefer
  
    - `aiogram-dialog`: A framework that facilitates crafting interactive messages and menus for Telegram bots, mirroring the feel of a standard GUI application.

### 2. Webhook Service (REST API)

- **Location**: `./backend/src/medsyncapp/webhook`
- **Key Libraries**:
    - `uvicorn`: ASGI server for running FastAPI applications.
    - `fastapi`: Building efficient APIs.
    - `sqlalchemy`: ORM for database interactions.
    - `asyncpg`: Asynchronous PostgreSQL interaction.
    - `python-dateutil`: Date and time utilities.

### 3. PostgreSQL Database Service

- **Location**: Automatically managed by Docker.
- **Details**: This service manages our primary database storage. Our data models and ORM are crafted using SQLAlchemy.
    - **Models & Repositories**: `./backend/src/medsyncapp/infrastructure/database`
    - **Migrations**: Handled using Alembic, located at `./backend/src/medsyncapp/migrations`.

### 4. Redis Service

- **Location**: Automatically managed by Docker.
- **Details**: Redis is employed as a transient storage for the bot. It stores user states, ensuring that if the bot restarts, user interactions are not interrupted.

### Orchestration with Docker

All services are defined and orchestrated using Docker Compose. 

The configuration for this setup is located in the `docker-compose.yml` file in the root directory. 
This setup ensures that each service is isolated yet interconnected via Docker networking and volumes.


## 3. Telegram Bot Service

### 1. Introduction

!!! abstract "Overview"
    The Telegram bot serves as one of the main interaction points between the users and the MedSync WebApp. Built using Aiogram v3, the bot provides intuitive functionalities and a user-friendly interface.

#### Using the Template

For developers looking to build similar Telegram bots, a [template](https://github.com/Latand/tgbot_template_v3) is available. This template provides a structured project layout for a bot.

### 2. Diving into the Bot

#### Entry Point: `bot.py`

!!! example
    See full code in [bot.py](https://github.com/Latand/MedSyncWebApp/blob/main/backend/src/medsyncapp/tgbot/bot.py)

The `bot.py` file is where the magic begins:

- **Initialization**: Here, core components like the bot, dispatcher, storage, SQLAlchemy engine, and session pool are initialized.
  
- **Configuration**: All necessary configurations, including registering [routers](https://docs.aiogram.dev/en/latest/dispatcher/router.html)(1), are set up here.
    { .annotate }

    1. Routers, similar to FastAPI routers, determine how incoming bot messages are handled. 
  
- **Middlewares**: Middlewares such as the database middleware are set up to pass database sessions to each handler automatically and to register users in the database.
  
- **Polling**: The dispatcher starts polling to receive updates from Telegram.

#### Structuring the Bot: Routers and Handlers

The bot's handlers are organized using routers. Routers are stored in `...tgbot/handlers`, with each module usually initializing a new router. 

!!! example "Start Handlers"

    When a user interacts with the bot using the `/start` command, a welcoming message along with the main menu options is presented. Here's a glimpse into the code:

    ```python title="...tgbot/handlers/start.py" hl_lines="7 10 15"
    from aiogram import types, Router
    from aiogram.filters import CommandStart

    from tgbot.config import Config
    from tgbot.keyboards.inline import main_menu

    start_router = Router()


    @start_router.message(CommandStart())
    async def send_webapp(message: types.Message, config: Config):
        await message.answer(
            "Welcome to MedSync App!\n\n"
            "You can use our Web App to book an appointment with a doctor, or get tested in one of our clinics.",
            reply_markup=main_menu(domain=config.tg_bot.web_app_domain),
        )
    ```

    ```python title="...tgbot/keyboards/inline.py" hl_lines="6"
    from aiogram.types import WebAppInfo
    from aiogram.utils.keyboard import InlineKeyboardBuilder

    def main_menu(domain: str):
        kb = InlineKeyboardBuilder()
        kb.button(text="Main Page", web_app=WebAppInfo(url=domain))
        # ... other buttons
        return kb.as_markup()
    ```


This code snippet represents the creation of the main start handler and main menu keyboard. 

As seen, the `WebAppInfo` utility provides an interactive button leading users directly to the specified web app domain. This domain value is fetched from the `.env` file (`FRONTEND_URL` variable).

#### Navigating with Aiogram-dialog

A major feature of the MedSync bot is its ability to easily paginate through bookings or diagnostic test results. This is achieved using the `aiogram-dialog` framework.

- **Official Documentation**: For an in-depth understanding of `aiogram-dialog`, refer to its [official documentation](https://github.com/Tishka17/aiogram_dialog).

- **Usage in MedSync**: The `aiogram-dialog` framework is predominantly used in the `...tgbot/handlers/test_results.py` and `...tgbot/handlers/bookings.py` files.

---

## 4. REST API Service

### 1. Introduction

!!! abstract "Overview"
    The REST API Service forms the backbone of the MedSync WebApp, allowing seamless communication between the frontend, the database, and other components of the application.

#### WebServer Initialization

**Entry Point: `./backend/src/medsyncapp/webhook/app.py`**

!!! example
    See full code in [app.py](https://github.com/Latand/MedSyncWebApp/blob/main/backend/src/medsyncapp/webhook/app.py)


- When the Docker container starts, it runs the Uvicorn command that uses the `app.py` file as the entry point to initialize the web server.

- Uvicorn is an [ASGI server implementation](https://www.uvicorn.org/), ideally suited for frameworks like FastAPI.

### 2. Organizing the API: Routers and Endpoints

!!! info
    Just as the bot service has routers to handle different bot commands, the REST API service employs routers to manage different HTTP endpoints. This allows the API to be modular, scalable, and organized.

    Each router in FastAPI can have a prefix. For instance, if the router is meant to handle doctor-related requests, you might use a prefix like `/api/doctors`.

#### Dependencies and Utilities

The `...webhook/utils.py` file contains various utility functions and dependencies required by the API routers. This can include:

- **Configuration**: Using the same old `config.py` as in the bot service, the API can access the same environment variables.
  
- **Database Sessions**: Setting up sessions pool and requests repository to interact with the database that will be passed to each endpoint.
  
- **Validation Functions**: Functions that might validate incoming data, like verifying the Telegram `initData` to ensure that the request is coming through the Telegram bot.

#### Defining Routes

After setting up the base and utilities, routes (or endpoints) for the API are defined within the routers. Each route corresponds to a particular HTTP method (GET, POST, PUT, etc.) and a specific task.

!!! Example "Doctor Route"

    ```python
    from fastapi import Depends, APIRouter, HTTPException

    from infrastructure.database.repo.requests import RequestsRepo
    from infrastructure.webhook.utils import get_repo

    doctor_router = APIRouter(prefix="/doctors")

    @doctor_router.get("/{doctor_id}")
    async def get_doctor(doctor_id: int, repo: RequestsRepo = Depends(get_repo)):
        result = await repo.doctors.get_doctor(doctor_id)

        if result is None:
            raise HTTPException(status_code=404, detail="Doctor not found")

        return result
    ```
    See full code in [doctors.py](https://github.com/Latand/MedSyncWebApp/blob/main/backend/src/medsyncapp/webhook/routers/doctors.py)


In this snippet:

- The route `/{doctor_id}` is defined under the `doctor_router`, which has a prefix of `/doctors`, that is then combined with the api prefix to form the final route: `/api/doctors/{doctor_id}`.
  
- The `get_doctor` function is an async function that fetches details of a specific doctor using their `doctor_id`.
  
- If the doctor is not found in the database, a 404 HTTP exception is raised.
  
- Otherwise, the doctor's details are returned as a JSON response.


!!! Example "Routers Prefixes"

    ```python hl_lines="1 5 6 9 16 18"
    from fastapi import FastAPI, APIRouter

    from medsyncapp.webhook import routers

    app = FastAPI()
    prefix_router = APIRouter(prefix="/api")

    for router in [
        routers.doctors.doctor_router,
        routers.diagnostics.diagnostics_router,
        routers.slots.slots_router,
        routers.slots.working_hours_router,
        routers.locations.locations_router,
        routers.doctors.specialties_router,
    ]:
        prefix_router.include_router(router)

    app.include_router(prefix_router)
    ```
    
    Here we see the `prefix_router` being initialized with the `/api` prefix. 

    Then, each router is included in the `prefix_router` using the `include_router` method. 

    Finally, the `prefix_router` is included in the main `app`.