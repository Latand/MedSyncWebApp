---
title: MedSync WebApp Documentation
---

# MedSync WebApp Documentation

## Introduction

Welcome to the MedSync WebApp documentation. This core idea of the app is to create a bridge between patients and healthcare
professionals, providing easy booking system for medical services via the Telegram platform.

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

## System Requirements and Setup

!!! note
    This guide focuses on setting up on Windows/MacOS/Linux.

#### Software and OS:

- **Windows/MacOS/Linux**

    While the project can be tested on either of these operating systems, it's recommended to deploy on a Linux server.

- **Docker & Docker-Compose (1)**
    { .annotate }

    1. Compatible with Windows, MacOS, and Linux. 

    Required to containerize and orchestrate the application services. 

#### Hosting and Domain:

- **Server with Domain Ownership and SSL-Certificate (1)**
    { .annotate }

    1.  If you're deploying this project live, you'll need a server and an owned domain. For
    securing your domain, an SSL certificate is mandatory. You can obtain one, for instance, using Let's Encrypt's
    Certbot.

#### Local Testing (Optional):

- **Ngrok**: If you opt to run the project locally, you can use Ngrok for easy access to the domain and SSL certificate. 
- This will require creating an account with Ngrok, setting up 2 static domains **(❗️❗️paid option)**, and noting down the domains for later use.
  Detailed instructions for Ngrok setup can be found on [a dedicated page](ngrok.md). 

!!! danger
    At some stage, financial investment will be required, be it for server and domain or for 
    utilizing tunneling services like Ngrok. 
    If you can obtain a static IP that you can expose to the internet, you can avoid the need for Ngrok, but you'll expose your IP to the WebApp users.

### Project Composition:

```mermaid
stateDiagram-v2
    state fork_docker_init <<fork>>
        [*] --> fork_docker_init : Docker Compose Initiated

    fork_docker_init --> Frontend
    fork_docker_init --> Backend
    fork_docker_init --> Documentation
    fork_docker_init --> Ngrok

    state Frontend
    Frontend : React JS application

    state Backend
    Backend --> Bot
    Backend --> Database
    Backend --> Caching
    Backend --> API

    state Bot
    Bot : Bot built on Aiogram

    state Database
    Database : PostgreSQL

    state Caching
    Caching : Redis (for bot caching)

    state API
    API : REST API built on FastAPI

    state Optional Documentation 
    Documentation

    state 
    Ngrok : Optional Ngrok

```

Once the Docker processes are initiated, it will orchestrate the entire project setup:

- **Frontend**: A React JS application.
- **Backend**: Comprises multiple components:
    - **Bot**: Built on the [aiogram framework](https://docs.aiogram.dev/en/latest/).
    - **Database**: [PostgreSQL](https://www.postgresql.org/) for structured data storage.
    - **Caching**: [Redis](https://redis.io/) is utilized for caching purposes within the bot.
    - **REST API**: Developed using [FastAPI](https://fastapi.tiangolo.com/) with [SQLAlchemy](https://www.sqlalchemy.org/) for ORM,
  and [Alembic](https://alembic.sqlalchemy.org/en/latest/) for database migrations.
- **Documentation Image (Optional)**: While there's an image dedicated for documentation, it is commented out by default
  in the Docker configuration. Build with [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).
- **Ngrok (Optional)**: There's also a [Ngrok](https://ngrok.com/) configuration, but it's commented out by default.

---

## Project Setup

### Configuration

!!! info
    Setting up the MedSync Bot requires configuring certain environment variables and adjusting specific settings to match
    your intended deployment environment.

**[Configuration Guidelines](configuration.md)**: This section provides a detailed walkthrough on how to adjust the
essential configurations for the MedSync Bot. Ensure you've set these up before deploying.

Once you've followed through with the configuration steps, you can then move forward with the deployment process.

### Initializing Dependencies

Before diving into the core setup, it's pivotal to ensure all dependencies and related tools are in place and configured
correctly. Initializing dependencies is a foundational step that preempts the rest of the setup process, ensuring that
everything is in place for the MedSync WebApp to function correctly.

**[Dependency Initialization Guidelines](dependencies-initialization.md)**: This guide details the steps to ensure all
software, libraries, and tools are correctly installed and initialized. Adhering to these guidelines will aid in
preventing potential issues during the setup and running of the MedSync WebApp.

It's advisable to review and complete the dependency initialization before proceeding further into the setup.

### Launching the Project

Once you've completed the configuration and dependency initialization, you can then proceed with launching the project.
We will be using Docker Compose to orchestrate the entire project setup.

Then we'll run a special command to create the required tables in the database and populate them with initial data.

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



