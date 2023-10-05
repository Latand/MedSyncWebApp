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
            

---

## 2. Acquiring a Web Domain and Creating an A-record

!!! warning "OPTIONAL"
    If you're using Ngrok for testing purposes, you can skip this section.

!!! info "What is this section about?"
    For experienced developers who are familiar with domain operations, this section provides a general overview of how to
    acquire a web domain and set up an A-record pointing to your server. 
    
    This guide serves as an example to get you started.

### **Choosing a Domain Registrar**

!!! info "What is a Domain Registrar?"
    A domain registrar is a company that manages the reservation of internet domain names. There are numerous domain
      registrars available, including Namecheap, Google Domains, and many others.

Choose a registrar based on your preference, budget, and the features they offer.

### **Acquiring a Domain**

- Navigate to your chosen domain registrar's website.
- Use their search functionality to check the availability of your desired domain name.
- Once you've found an available domain, follow the purchase process. 

### **Pointing the Domain to Your Server (Creating an A-record)**

- After acquiring your domain, you'll need to point it to your server using an A-record. An A-record maps a domain
  name to an IP address.
- Log in to your domain registrar's dashboard.
- Navigate to the DNS management section. The location and naming of this section can vary, but it's often labeled
  as "DNS Settings," "Name Server Management," or something similar.
- Look for an option to add or manage records.

!!! danger 
    Not all domain registrars allow you to set up A-records. If you can't find the option to add or manage records, you 
    can set up the A-record using a third-party DNS provider like Cloudflare.

- Add a new A-record:
    - **Host/Name**: Often, you'll set this to `@` to represent the root domain. If you're setting up a subdomain,
      you'd enter the subdomain name.
    - **Value/Points to**: Enter the `IP address` of your server.
    - **TTL**: This is the time-to-live, indicating how long the DNS resolver should cache the query. You can
      usually leave this at the default setting.
![img.png](images/dns.png)

4. **Propagation**:

    - After setting the A-record, there's a propagation time. This is the time it takes for DNS changes to be updated
      across the internet. Depending on various factors, this can take anywhere from a few minutes to 48 hours.
    - You can use tools like [DNS Checker](https://www.dnschecker.org/) to check the propagation status.

!!! success
    With your domain name acquired and A-record set, you're now ready to proceed with Nginx and SSL certificate setup. 

---

## 3. Setting up NGINX 

!!! warning
    - This section is important if you're deploying the app to a production server.
    - This section is tailored specifically for Ubuntu OS. For developers using Windows or MacOS, it's recommended to utilize
        Ngrok for testing purposes
    - If you're using Ngrok for testing purposes, you can skip this section, and run on your local machine.

!!! tip
    You can use [Telegram Testing Evnironment](https://core.telegram.org/bots/webapps#using-bots-in-the-test-environment) to allow http connections not using SSL.



### **Installing NGINX**

1. First, ensure your package lists are updated:
      ```
      sudo apt update
      ```

2. Install NGINX:
      ```
      sudo apt install nginx
      ```

3. After the installation completes, start NGINX and enable it to start at boot:
      ```
      sudo systemctl start nginx
      sudo systemctl enable nginx
      ```

4. You can check the status to confirm NGINX is running:
      ```
      sudo systemctl status nginx
      ```

### **Configuring NGINX for Your Domain**

1. Navigate to the `sites-available` directory:
      ```
      cd /etc/nginx/sites-available/
      ```

2. Create a new configuration file for your domain (replace `your_domain` with your actual domain name):
      ```
      sudo nano your_domain
      ```

3. In the editor, add the following basic configuration, adjusting `your_domain` as appropriate:
        ```nginx hl_lines="2"
        server {
          server_name your_domain;
      
             # FRONTEND
             location / {
                 proxy_pass http://localhost:3778;
                 proxy_set_header Host $host;
                 proxy_set_header X-Real-IP $remote_addr;
                 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             }

             # BACKEND
             location /api/ {
                 proxy_pass http://localhost:3779;
                 proxy_set_header Host $host;
                 proxy_set_header X-Real-IP $remote_addr;
                 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             }
         }
        ```


- Save and exit.

!!! tip "Explanation of the Configuration"

    - `proxy_pass http://localhost:3778;`
        
        This line tells NGINX to pass requests coming to the root (`/`) of your domain to a local service running on port `3778`. This is the frontend application _(refer to `docker-compose.yml` file)._

    - `location /api/ {...}`

        This block configures how to respond to requests that start with `/api/`. This is the url where our backend API server will be running.

    - `proxy_pass http://localhost:3779;` 

        Inside the `/api/` block, this line tells NGINX to pass requests meant for the API to backend application, this one running on port `3779`. _(refer to `docker-compose.yml` file)._


- Create a symbolic link from `sites-available` to `sites-enabled`:
  ```
  sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/
  ```

- Test the NGINX configuration for syntax errors:
  ```
  sudo nginx -t
  ```

- If no errors are displayed, reload NGINX:
  ```
  sudo systemctl reload nginx
  ```

## **4. Setting Up Let's Encrypt**

### Installation

1. Install Certbot (the tool we'll use to obtain SSL from Let's Encrypt):
      ```
      sudo apt install certbot python3-certbot-nginx
      ```

2. Request a certificate for your domain:
      ```
      sudo certbot --nginx -d your_domain -d 
      ```

    Follow the on-screen instructions. When prompted about redirecting HTTP traffic to HTTPS, it's recommended to choose
    the option to redirect.

    Once the process completes, Certbot will have modified the NGINX configuration file and reloaded the server.

### **Automatic Renewal of Let's Encrypt Certificates**

Let's Encrypt certificates are valid for 90 days. To ensure your certificate is always valid, you should set up an
automatic renewal:

- Test the renewal process:
  ```
  sudo certbot renew --dry-run
  ```

  If no errors are displayed, Certbot's renewal process is set up correctly.

!!! tip
    By default, Certbot installs a cron job or systemd timer that will renew certificates before they expire.
---