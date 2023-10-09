---
title: MedSync WebApp Documentation
---

# MedSync WebApp Documentation

## Introduction

Welcome to the MedSync WebApp documentation. The core idea of the app is to create a bridge between patients and healthcare
professionals, providing an easy booking system for medical services via the Telegram platform.

!!! warning
    The MedSync WebApp is for demonstration purposes only and not intended for actual medical services.

[Link to Bot in Telegram](https://t.me/MedSyncbot)

**Key Features:**

- An intuitive interface to search, select, and book appointments healthcare experts, diagnostic types, and clinics
- Integration with Telegram for seamless user experience.

!!! example "Showcase"

    You can try out the MedSync WebApp:

    - Initiate the [MedSync bot on Telegram](https://t.me/MedSyncbot).
    - Otherwise, you can see the [Userflow page](userflow.md) for a quick overview of the MedSync WebApp in screenshots.

---

## System Requirements and Setup

!!! note
    This guide focuses on setting up on Windows/MacOS/Linux.

### Prerequisites:

- **Operating Systems**: 
    - Windows/MacOS/Linux: The project can be tested on any of these platforms, but it's recommended to deploy on a Linux server.

- **Required Software**: 
    - **Docker & Docker-Compose**: Required to containerize and orchestrate the application services. Compatible with Windows, MacOS, and Linux.

- **Nginx (Optional)**: 
    - Required for live deployment. It's used as a reverse proxy to route requests to the appropriate services (frontend and backend).

!!! danger
    Some stages of the setup might require financial investment (i.e. server, domain). Ensure you're aware of any costs before proceeding.

### Deployment Requirements:

#### Live Deployment (Production):

- A **server with domain ownership and an SSL certificate**(1).
    { .annotate }

    1.  You can obtain one, for instance, using Let's Encrypt's Certbot.

- **Nginx:** a web server that can be used as a reverse proxy. It's used to route requests to the appropriate
    services (our frontend and backend) 

For detailed steps on live deployment, please refer to the [Production Deployment Guide](production-environment.md).

#### Local Deployment (Development):

- You can test the project on your **local machine**.
- Use **Ngrok** for domain access and SSL certificate during local testing.
- This will require creating an account with Ngrok, setting up 1 static domain and noting down the domain for later use.
- If you can obtain a static IP, you can use it, but then you'll expose your personal IP to the WebApp users.
 
For detailed steps on local deployment, please refer to the [Development Deployment Guide](development-environment.md).

---

### Project Composition:

![Project Composition](images/project-prod.png)

The project is composed these components:

- **Frontend**: A React JS application.
- **Backend**: Comprises multiple components:
    - **Bot**: Built on the [aiogram framework](https://docs.aiogram.dev/en/latest/).
    - **Database**: [PostgreSQL](https://www.postgresql.org/) for structured data storage.
    - **Redis Caching**: [Redis](https://redis.io/) is utilized for caching purposes within the bot.
    - **REST API**: Developed using [FastAPI](https://fastapi.tiangolo.com/) with [SQLAlchemy](https://www.sqlalchemy.org/) for ORM,
  and [Alembic](https://alembic.sqlalchemy.org/en/latest/) for database migrations.
- **Nginx (Optional)**: You'll need to set up Nginx if you're deploying the project live.
- **Ngrok (Optional)**: There's also a [Ngrok](https://ngrok.com/) configuration, but it's commented out by default.
- **Documentation Image (Optional)**: While there's an image dedicated for documentation, it is commented out by default
  in the Docker configuration. Built with [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).
---

## Project Setup

1. **Configuration**: Clone the repo and adjust the necessary environment variables and settings to match your deployment. [Read more](configuration.md).

2. **Initializing Dependencies:** Ensure all required software and libraries are set up. [Read more](dependencies-initialization.md).
3. **Development vs Production**: Depending on your deployment, you'll need to adjust the project configuration. [Development Mode Guide](development-environment.md), [Production Mode Guide](production-environment.md).
4. **Launching the Project**: With dependencies set and configurations adjusted, proceed to deploy the project using Docker Compose. 
    Further steps involve setting up database tables and populating them. [Read more](running.md).

---

## Quick Overview

!!! question
    Wondering what functionalities MedSync offers? Here's a brief outline to get you started.

MedSync offers a series of functionalities aimed at enhancing patient-doctor interaction. Here's a brief outline:

- **Doctor Selection**: Search and choose from a list of medical experts based on specialization.
- **Appointment Booking**: Pick a convenient date and time slot.
- **Medical Tests**: Browse through various medical tests, learn about them, and book as needed.
- **Theme Adaptability**: The web app interface dynamically adapts to your current Telegram theme colors, ensuring a cohesive visual experience.
!!! example 
    If you have set a dark theme on Telegram, the MedSync WebApp interface will adapt to show dark mode elements, aligning with your preferred visual settings.

---

## Acknowledgements

This project is a submission for a [Telegram contest](https://t.me/contest/327). 

In order to create this documentation we've taken inspiration and borrowed some code blocks under the MIT
license from the [aiogram-3-guide](https://github.com/MasterGroosha/aiogram-3-guide) repository.

## License & Attribution

MedSync operates under the [MIT License](https://github.com/Latand/MedSyncWebApp/blob/main/LICENSE). We've utilized various third-party libraries to enhance functionality.

## Contributors

MedSync's success is attributed to its dedicated team of developers, a UX/UI designer, and AI agents.



