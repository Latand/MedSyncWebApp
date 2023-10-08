---
title: Docker and Docker Compose for MedSync WebApp
---

# Docker and Docker Compose for MedSync WebApp

!!! info "Quick Analogy"
    Think of **Docker** as a shipping container for your application. No matter where you ship it – be it a developer's 
    local setup or a production server – the contents (your application and its environment) remain consistent. 
    
    **Docker Compose**, on the other hand, is like the layout plan of a housing complex, detailing how multiple containers (or houses) interact and connect with each other.

## What is Docker?

Docker is a platform designed to develop, ship, and run applications inside containers.

Key Benefits:

- **Consistency**: Docker ensures that components like the frontend, bot backend, and databases work uniformly.
- **Isolation**: Potential conflicts between system libraries and application dependencies are minimized, much like how a sealed room might prevent external disturbances.
- **Ease of Deployment**: Sharing and deploying Docker images is as straightforward as sending a packaged box to another location.

## What is Docker Compose?

Docker Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure the application's services. 
You can then start all the services with a single command (`docker-compose up`).

### Key Components in MedSync's `docker-compose.yml`:

!!! example "docker-compose.yml"
    Full file available [here](https://github.com/Latand/MedSyncWebApp/blob/main/docker-compose.yml).

- **Services**: Each service corresponds to a container running a specific piece of the MedSync WebApp, such as the bot backend or the PostgreSQL database.
    - **app**: Represents the frontend of the MedSync WebApp. The Docker container is built from the `frontend` directory.
    - **bot**: Represents the backend bot service, responsible for handling user interactions on Telegram. It also shares volumes with the frontend to access static files.
    - **pg_database**: A PostgreSQL database container.
    - **webhook**: Handles incoming web requests, serving as another backend service.
    - **redis_cache**: Redis service acting as an in-memory data structure store, used for caching and other functionalities.
    - **mkdocs**: Service for serving the project documentation.

- **Volumes**: Used to persist data across container restarts.
    - **pgdata**: Stores the PostgreSQL data, ensuring that the database retains its data even after the container is restarted.
    - **cache**: Utilized by the Redis service to persist cached data.

!!! attention "Environment & Logging"
    - **Environment Variables**: Settings and configurations for containers are often passed using environment variables. The `env_file` directive in the YAML file specifies a file from which these variables are sourced.
    - **Logging**: Each service has logging configurations ensuring that logs are maintained in a manageable size and number of files.## Why Use Docker and Docker Compose for MedSync?

---

## Explanation of the `bot` Service Configuration in Docker Compose

The `bot` service in the Docker Compose file is handling user interactions on the Telegram platform. Let's break down its configuration:

| Configuration Line                        | Explanation                                                                                            |
|-------------------------------------------|--------------------------------------------------------------------------------------------------------|
| `image: "medsyncapp_bot"`                 | Blueprint for creating the bot container named "medsyncapp_bot".                                       |
| `stop_signal: SIGINT`                     | Command to safely shut down, like turning off a machine.                                               |
| `context: ./backend`                      | Specifies the starting directory as `./backend`.                                                       |
| `dockerfile: ./bot.Dockerfile`            | Uses the recipe in `bot.Dockerfile` for building the image.                                            |
| `volumes: - ./backend/src:/src/`          | Maps `./backend/src` to container's `/src/` for real-time code updates.                                |
| `volumes: - /var/app/medsync:/src/public` | Maps shared static files for both frontend and bot.                                                    |
| `restart: always`                         | Always tries to restart bot if it stops.                                                               |
| `env_file: - ".env"`                      | Uses settings from `.env` file.                                                                        |
| `driver: "json-file"`                     | Uses JSON format for saving logs.                                                                      |
| `max-size: "200k"`                        | Each log file's size is capped at 200 kilobytes.                                                       |
| `max-file: "10"`                          | Keeps only the latest 10 log files, discarding the oldest.                                             |


## Explanation of the `bot.Dockefile` file

!!! example "bot.Dockerfile"
    Full file available [here](https://github.com/Latand/MedSyncWebApp/blob/main/backend/bot.Dockerfile).

Let's break down this Dockerfile, line by line:

| Dockerfile Line                                           | Explanation                                                                                                                                                             |
|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `FROM python:3.11-slim as builder`                        | Start with a lightweight Python 3.11 image named `builder`. This will be used as a temporary image to build necessary components.                                       |
| `RUN python3 -m venv /venv && ...`                        | Create a virtual environment in `/venv` and upgrade `pip`, `wheel`, and `setuptools`. It also creates a directory `/src` for later use.                                 |
| `COPY pyproject.toml /src/`                               | Copy the `pyproject.toml` (project metadata and dependencies) file into the `/src` directory inside the Docker image.                                                   |
| `COPY src /src/src`                                       | Copy the entire `src` directory from the host machine to `/src/src` inside the Docker image.                                                                            |
| `RUN /venv/bin/pip install '/src[bot]'`                   | Use pip from the virtual environment to install the Python package located at `/src`, specifically the `[bot]` extras.                                                  |
| `FROM python:3.11-slim`                                   | Start with a fresh lightweight Python 3.11 image. This will be the main image and will not include the artifacts from the builder image.                                |
| `WORKDIR /src`                                            | Set the working directory inside the Docker container to `/src`. This means subsequent commands will be run inside this directory.                                      |
| `COPY --from=builder /venv /venv`                         | Copy the virtual environment from the `builder` image to the main image. This step transfers the dependencies installed in the `builder` stage.                         |
| `CMD  ["/venv/bin/python", "-m", "medsyncapp.tgbot.bot"]` | Set the default command to run when the container starts. This will launch the bot using the Python installed in the virtual environment.                               |


**In essence, this Dockerfile uses a multi-stage build:**

1. The initial stage (`builder`) creates a virtual environment and installs the required Python packages inside it. 
2. The second stage starts with a fresh Python image, into which the virtual environment from the `builder` stage is copied, resulting in a lean and optimized final Docker image.


!!! success "Benefits Overview"

    - **Simplicity**: It's like having a remote control for your entire home setup; one button can turn everything on or off.
    - **Reproducibility**: Similar to following a recipe, every developer can recreate the same environment.
    - **Scalability**: As the project grows, adding more sevices or expanding existing ones becomes seamless.
    - **Transparency**: The layout and design are open for everyone to understand.
