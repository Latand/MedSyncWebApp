---
title: Preparing the Production Environment
---

# Preparing the Production Environment

![Composition](images/project-prod.png)

On the diagram above, you can see the project's composition. In this configuration, you can run the project on your server.

!!! question "How does production mode operate?"
    - Your browser sends requests to NGINX.
    - For general site access, NGINX uses static files created by React in `/var/app/medsync/`.
    - For anything under `/api/`, NGINX forwards the request to our backend on `http://localhost:3779`.
    - React's production-ready files are made with `npm run build`.


The following is the list of actions you need to take to set up the development environment:


## 1. Setting up NGINX 

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
          root /var/app/medsync/;
          index index.html;
      
             # FRONTEND
             location / {
                 try_files $uri $uri/ /index.html;
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

!!! tip "Explanation of config"

    - `root /var/app/medsync/;`

        This line tells NGINX where to look for the files to serve. 
        In this case, we're telling NGINX to look for the files in the `/var/app/medsync/` directory. 
        This is the directory where our frontend application will be running. (refer to `docker-compose.yml` file, the volume for `dist` directory).

    - `location / {...}`

        This block configures how to respond to requests that start with `/`. This is the url where our frontend application will be running.
        The frontend application is a static website, so we need to tell NGINX to serve the `index.html` file when a request is made to `/`.
        

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

## 2. Setting Up Let's Encrypt

!!! info
    This will install an SSL certificate for your domain, that you wrote in the NGINX configuration file. 

    Make sure you have a domain name and that it's pointing to your server's IP address before proceeding. [Read more](owned-domain.md)

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
