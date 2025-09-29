# Canteen Ordering System

This is a full-stack web application for a canteen that features real-time inventory management, order processing, and a separate dashboard for the owner.

## Features

- **Client View**: Browse menu, add items to cart, and place orders.
- **Owner Dashboard**: A protected dashboard to manage menu items (CRUD), view all incoming orders in real-time, and mark orders as completed or cancelled.
- **Real-Time Updates**: Stock levels and order lists update instantly across all open tabs using WebSockets (Socket.IO).
- **Inventory Locking**: Stock is immediately decremented when an order is placed.
- **Auto-Cancellation**: Pending orders are automatically cancelled and stock is restored after 15 minutes.
- **Role-Based Access**: Separate views and permissions for clients and the owner.

## Tech Stack

- **Frontend**: React, React Router, Axios, Socket.IO Client
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Real-Time Communication**: Socket.IO

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd canteen-project
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Create a .env file and copy the contents of .env.example
    # Update the .env file with your database credentials
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    # Create a .env file and copy the contents of .env.example
    ```

## How to Run

1.  **Start the Backend Server:**
    ```bash
    # From the backend/ directory
    node src/server.js
    ```

2.  **Start the Frontend Application:**
    ```bash
    # From the frontend/ directory (in a new terminal)
    npm start
    ```