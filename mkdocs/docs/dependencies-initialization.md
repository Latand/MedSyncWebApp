# Initializing Dependencies

This section guides you through the setup and initialization of the primary dependencies required to get the MedSync
WebApp up and running. These include Docker, Docker-Compose, and the database setup.

---

## Docker & Docker-Compose Setup

Docker provides an efficient way to containerize applications and their dependencies. Docker-Compose, on the other hand,
allows for defining and running multi-container Docker applications. These tools are vital for the deployment of the
MedSync WebApp.

### Windows

#### 1. **Install Docker Desktop for Windows**:

- Download the [Docker Desktop for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
  from the official Docker website.
- Launch the installer and follow the installation wizard.

#### 2. **Docker-Compose**:

- Docker Desktop for Windows already comes bundled with Docker-Compose, so there's no need for a
  separate installation.

#### 3. **Verify Installation**:

- Open the command prompt and run:
  ```
  docker --version
  docker-compose --version
  ```
- Ensure that both commands return their respective versions, indicating a successful installation.

### MacOS

#### 1. **Install Docker Desktop for Mac**:

- Download [Docker Desktop for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac) from the
  official Docker website.
- Drag and drop the Docker.app to the Applications folder.

#### 2. **Docker-Compose**:

- Docker Desktop for Mac already comes bundled with Docker-Compose, so there's no need for a
  separate installation.

#### 3. **Verify Installation**:

- Open the terminal and run:
  ```
  docker --version
  docker-compose --version
  ```
- Ensure that both commands return their respective versions, indicating a successful installation.

### Ubuntu

1. **Install Docker**:
    - Update the apt package index:
      ```
      sudo apt-get update
      ```
    - Install Docker's package dependencies:
      ```
      sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
      ```
    - Add Docker’s official GPG key:
      ```
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
      ```
    - Add Docker's repository:
      ```
      sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
      ```
    - Install Docker:
      ```
      sudo apt-get update
      sudo apt-get install docker-ce
      ```

2. **Install Docker-Compose**:
    - Download the Docker-Compose binary:
      ```
      sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      ```
    - Apply executable permissions to the binary:
      ```
      sudo chmod +x /usr/local/bin/docker-compose
      ```

3. **Verify Installation**:
    - Run:
      ```
      docker --version
      docker-compose --version
      ```
   Both commands should return their respective versions.

---

## Acquiring a Web Domain and Creating an A-record [FOR LIVE DEPLOYMENT]

For experienced developers who are familiar with domain operations, this section provides a general overview of how to
acquire a web domain and set up an A-record pointing to your server. It's essential to note that the actual steps can
vary significantly based on the domain registrar and the hosting provider you choose. This guide serves as an example to
get you started.

### 1. **Choosing a Domain Registrar**:

- A domain registrar is a company that manages the reservation of internet domain names. There are numerous domain
  registrars available, including GoDaddy, Namecheap, Google Domains, and many others.
- Choose a registrar based on your preference, budget, and the features they offer.

### 2. **Acquiring a Domain**:

- Navigate to your chosen domain registrar's website.
- Use their search functionality to check the availability of your desired domain name.
- Once you've found an available domain, follow the purchase process. Typically, this involves adding the domain to
  your cart and proceeding with the payment.

### 3. **Pointing the Domain to Your Server (Creating an A-record)**:

- After acquiring your domain, you'll need to point it to your server using an A-record. An A-record maps a domain
  name to an IP address.
- Log in to your domain registrar's dashboard.
- Navigate to the DNS management section. The location and naming of this section can vary, but it's often labeled
  as "DNS Settings," "Name Server Management," or something similar.
- Look for an option to add or manage records.
- Add a new A-record:
    - **Host/Name**: Often, you'll set this to `@` to represent the root domain. If you're setting up a subdomain,
      you'd enter the subdomain name.
    - **Value/Points to**: Enter the `IP address` of your server.
    - **TTL**: This is the time-to-live, indicating how long the DNS resolver should cache the query. You can
      usually leave this at the default setting.
- Save your changes and wait for some time.

### 4. **Propagation**:

- After setting the A-record, there's a propagation time. This is the time it takes for DNS changes to be updated
  across the internet. Depending on various factors, this can take anywhere from a few minutes to 48 hours.
- You can use tools like [DNS Checker](https://www.dnschecker.org/) to check the propagation status.

### 5. **Ready for SSL**:

- With your domain name acquired and A-record set, you're now ready to proceed with SSL certificate setup. If you
  intend to use Let's Encrypt for your SSL, follow the specific instructions in the subsequent section.

---

## Setting up NGINX and Let's Encrypt on Ubuntu [FOR LIVE DEPLOYMENT]

This section is tailored specifically for Ubuntu OS. For developers using Windows or MacOS, it's recommended to utilize
Ngrok for testing purposes. Setting up NGINX and obtaining an SSL certificate from Let's Encrypt on Ubuntu involves the
following steps:

### 1. **Installing NGINX**:

- First, ensure your package lists are updated:
  ```
  sudo apt update
  ```

- Install NGINX:
  ```
  sudo apt install nginx
  ```

- After the installation completes, start NGINX and enable it to start at boot:
  ```
  sudo systemctl start nginx
  sudo systemctl enable nginx
  ```

- You can check the status to confirm NGINX is running:
  ```
  sudo systemctl status nginx
  ```

### 2. **Configuring NGINX for Your Domain**:

- Navigate to the `sites-available` directory:
  ```
  cd /etc/nginx/sites-available/
  ```

- Create a new configuration file for your domain (replace `your_domain` with your actual domain name):
  ```
  sudo nano your_domain
  ```

- In the editor, add the following basic configuration, adjusting `your_domain` as appropriate:
    ```nginx configuration 
    server {
        server_name your_domain;
          
        location / {
            proxy_pass http://localhost:3778;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
  
        location /api/ {
            proxy_pass http://localhost:3779;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }```

- Save and exit.

#### Explanation of the Configuration:

- `proxy_pass http://localhost:3778;`: This line tells NGINX to pass requests coming to the root (`/`) of your domain to
  a local service running on port 3778. This is the frontend application _(refer to `docker-compose.yml` file)._

- `location /api/ {...}`: This block configures how to respond to requests that start with `/api/`. This is the url
  where our backend API server will be running.

- `proxy_pass http://localhost:3779;`: Inside the `/api/` block, this line tells NGINX to pass requests meant for the
  API to backend application, this one running on port 3779. _(refer to `docker-compose.yml` file)._


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

### 3. **Setting Up Let's Encrypt**:

- Install Certbot (the tool we'll use to obtain SSL from Let's Encrypt):
  ```
  sudo apt install certbot python3-certbot-nginx
  ```

- Request a certificate for your domain:
  ```
  sudo certbot --nginx -d your_domain -d www.your_domain
  ```

  Follow the on-screen instructions. When prompted about redirecting HTTP traffic to HTTPS, it's recommended to choose
  the option to redirect.

- Once the process completes, Certbot will have modified the NGINX configuration file and reloaded the server.

### 4. **Automatic Renewal of Let's Encrypt Certificates**:

Let's Encrypt certificates are valid for 90 days. To ensure your certificate is always valid, you should set up an
automatic renewal:

- Test the renewal process:
  ```
  sudo certbot renew --dry-run
  ```

  If no errors are displayed, Certbot's renewal process is set up correctly.

- By default, Certbot installs a cron job or systemd timer that will renew certificates before they expire.

---

With these steps completed, NGINX is now set up and serving your application with HTTPS enabled via Let's Encrypt on
your Ubuntu server. Always ensure to keep your server and software updated for security and performance improvements.