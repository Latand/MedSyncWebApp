---
title: Initializing Dependencies
---

# Initializing Dependencies

This section guides you through the setup and initialization of the primary dependencies required to get the MedSync
WebApp up and running. These include Docker, Docker-Compose, and the database setup.

---

## 1. Docker & Docker-Compose Setup

Docker provides an efficient way to containerize applications and their dependencies. Docker-Compose, on the other hand,
allows for defining and running multi-container Docker applications. 

!!! question "What is Docker and Docker-Compose?"
      Docker is a platform for developing, shipping, and running applications using containerization. 
      Docker-Compose is a tool for defining and running multi-container Docker applications.

      Refer to [this section](docker.md) for more details on Docker and Docker-Compose.

!!! tip
    We are using Docker and Docker-Compose to run all the services required for the MedSync WebApp. 

    Refer to [this section](https://docs.medsync.botfather.dev/#project-composition) for more details on the project composition.

### Windows

1. **Install Docker Desktop for Windows**

    - Download the [Docker Desktop for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
      from the official Docker website.
    - Launch the installer and follow the installation wizard.

2. **Docker-Compose**

    - Docker Desktop for Windows already comes bundled with Docker-Compose, so there's no need for a
      separate installation.

3. **Verify Installation**

    - Open the command prompt and run:
      ```
      docker --version
      docker-compose --version
      ```
    - Ensure that both commands return their respective versions, indicating a successful installation.
    ```bash
    Docker version 24.0.2, build cb74dfc
    Docker Compose version v2.19.1
    ```
---

### MacOS

1. **Install Docker Desktop for Mac**:

    - Download [Docker Desktop for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac) from the
      official Docker website.
    - Drag and drop the Docker.app to the Applications folder.

2. **Docker-Compose**:

    - Docker Desktop for Mac already comes bundled with Docker-Compose, so there's no need for a
      separate installation.

3. **Verify Installation**:

    - Open the terminal and run:
    ```bash
     docker --version
     docker-compose --version
    ```
    - Ensure that both commands return their respective versions, indicating a successful installation.
    ```bash
    Docker version 24.0.2, build cb74dfc
    Docker Compose version v2.19.1
    ```
---            

### Ubuntu

#### **Install Docker**

1. Update the apt package index:
      ```
      sudo apt-get update
      ```
2. Install Docker's package dependencies:
      ```
      sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
      ```
3. Add Docker’s official GPG key:
      ```
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
      ```
4. Add Docker's repository:
      ```
      sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
      ```
5. Install Docker:
      ```
      sudo apt-get update
      sudo apt-get install docker-ce
      ```

#### **Install Docker-Compose**
!!! warning
    Replace `2.22.0` with the latest version of Docker-Compose.

1. Download the Docker-Compose binary:
      ```
      sudo curl -L "https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      ```
2. Apply executable permissions to the binary:
      ```
      sudo chmod +x /usr/local/bin/docker-compose
      ```

#### **Verify Installation**
1. Run:
      ```
      docker --version
      docker-compose --version
      ```
2. Both commands should return their respective versions.

    ```bash
    Docker version 24.0.2, build cb74dfc
    Docker Compose version v2.19.1
    ```
            

## 2. Deployment 

- If you opted for a local deployment, refer to the [Local Deployment Guide](development-environment.md).
- If you opted for a live deployment, refer to the [Production Deployment Guide](production-environment.md).

