---
title: Running on the Development Environment
---

# Running on the Development Environment

![Composition](project-dev.puml)


## 1. Ngrok Configuration

!!! warning "OPTIONAL"
    If you're using your own purchased domain, you can skip this section.
    
    Refer to this [section](ngrok.md) for more details on how to register and acquire domains on Ngrok.

1. Rename the file `ngrok.yml.dist` to `ngrok.yml`.

2. In `ngrok.yml`, update the content as:
    ```yaml hl_lines="2 9" title="ngrok.yml"
    version: 2
    authtoken: <your-ngrok-token>
    tunnels:
   
      # frontend
      first:
        addr: app:5173
        proto: http
        hostname: your-ngrok-hostname.ngrok-free.app
    ```
3. Replace `<your-ngrok-token>` with the token from your Ngrok account.

4. Adjust the `your-ngrok-hostname.ngrok-free.app` with the static domain you set up in Ngrok (refer to the [Ngrok setup section](ngrok.md) for more details).

## 2. 