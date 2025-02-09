# Flask-based Slide Viewer

## Prerequisites

Before running the project, ensure that you have the following installed:

- **Podman**: A container management tool that works similarly to Docker.
- **Podman-Compose**: The `docker-compose` equivalent for Podman, used for defining and running multi-container applications.

### Installation Steps

1. **Install Podman and Podman-Compose**:

   - Follow the official [Podman installation guide](https://podman.io/getting-started/installation) to install Podman on your system.
   - Install **Podman-Compose** by following the [Podman-Compose installation instructions](https://github.com/containers/podman-compose).

2. **Clone the Repository**:

   ```bash
   git clone -b flask-react <https://github.com/NAWAZ-SRM/pixel-count-microservice.git>
   cd <pixel-count-microservice>
   ```

3. **Build the Containers**:
   Run the following command to build both the frontend and backend containers:

   ```bash
   podman compose up --build
   ```

4. **Access the Application**:
   After the containers are successfully built and running, open your web browser and navigate to:
   ```
   http://localhost:3000/
   ```
   This will load the frontend, where you can view and interact with the slides.

## Project Structure

- **Flask Backend**: Serves the slides and handles any server-side logic.
- **React Frontend**: Provides the user interface for interacting with the slides.

## Stopping the Containers

To stop the running containers, you can use the following command:

```bash
podman compose down
```

This will stop and remove the containers. If you want to stop them without removing the containers, you can use:

```bash
podman compose stop
```
