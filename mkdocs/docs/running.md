---
title: Running the App
---

# Running the App

!!! warning
    Ensure you have Docker and Docker Compose installed on your system, and configurations set up before proceeding, refer to the [Dependencies Initialization](dependencies-initialization.md) and [Configuration](configuration.md) sections for more details.

## 1. Navigate to the Project Directory

Ensure you are in the root directory of the cloned project.

```bash
cd [path-to-cloned-directory]/MedSyncWebApp
```

Replace `[path-to-cloned-directory]` with the actual path where you've cloned the project.

## 2. Start the Docker Containers

Use Docker Compose to build and start all services:

```bash
docker-compose up -d
```

Wait for Docker to build and run all containers. This might take some time during the first run as Docker needs to
download images and build services.

You can see the status of the containers by running:

```bash
docker-compose ps
```

Once all containers are up and running, you can proceed to the next step.

## 3. Set Up Database Migrations

With the services running, including the database, proceed to apply the database migrations. This will help structure
the database according to the defined models.

**Run the Migration Script**

```bash
docker-compose exec bot /venv/bin/python -m alembic upgrade head
```

!!! success
    At this point, the application should be running, and the database should be properly set up with the applied migrations. 

    You can navigate to your bot and verify its status.


!!! tip
    - To **stop** the application without removing any containers, networks, or volumes:
        ```bash
        docker-compose stop
        ```
    - To **stop and remove** all containers and networks defined in `docker-compose.yml`:
        ```bash
        docker-compose down
        ```
    - To **stop and remove** all containers, networks, and volumes (which will clear data in the database and Redis):
        ```bash
        docker-compose down -v
        ```
    - To **stop and remove** all containers, networks, volumes, and related images:
        ```bash
        docker-compose down -v --rmi local
        ```
    - To **view logs** for all services:
        ```bash
        docker-compose logs -f --tail 100
        ```
    - To **view logs** for a specific service (replace `service-name` with the actual service name):
        ```bash
        docker-compose logs service-name -f --tail 100
        ``` 
    
