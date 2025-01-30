# User Management System (UMS) - Backend

This is the backend service for the **User Management System (UMS)**. It provides APIs for user authentication, profile management, notifications, and admin functionalities.

## Features

- This project uses **BullMQ**, a queue system based on **Redis**, to manage and send notifications efficiently.

- Notifications are sent based on user availability, ensuring messages are delivered at appropriate times.

- User authentication (Signup, Login, JWT-based authentication)

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Queue Management:** Redis (BullMQ)
- **Authentication:** JWT
- **Environment Variables:** dotenv

## API Documentation
- <a href="https://documenter.getpostman.com/view/14426150/2sAYX2N4R6" target="_blank">Docs</a>
## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 18.x)
- MongoDB
- Docker (for Redis container)

### Clone the Repository

```bash
 git clone https://github.com/xAdvitya/ums_backend.git
 cd ums_backend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add:

```ini
PORT=8800
DATABASE_URI=mongodb://localhost:27017/ums_db
JWT_SECRET=your_jwt_secret
```

### Running the Project

#### Run Locally (Without Docker)

1. Start MongoDB locally.
2. Run the backend:

```bash
npm start
```

The server will run on `http://localhost:8800`

#### Run with Docker (Recommended)

To build and run the project using Docker:

```bash
# Build the Docker image
docker-compose build

# Run the container
docker-compose up
```

## API Endpoints

### **Authentication**

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | User login          |
| POST   | `/auth/logout`   | User logout         |

### **User Management**

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | `/user/:id`    | Get user by ID      |
| PUT    | `/user/update` | Update user profile |

### **Notifications**

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/notification/send` | Send a notification |
