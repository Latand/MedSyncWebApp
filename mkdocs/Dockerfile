# Dockerfile for mkdocs
FROM python:3.11-slim

# Install mkdocs and other necessary plugins
RUN pip install mkdocs-material~=9.4 mkdocs-video~=1.5

# Setting up working directory
WORKDIR /usr/src/mkdocs

# Copy over your mkdocs project
COPY . .

# Command to run mkdocs server on container startup
CMD ["mkdocs", "serve", "--dev-addr=0.0.0.0:8000"]
#CMD ["mkdocs", "build"]
