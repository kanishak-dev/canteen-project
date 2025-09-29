# Canteen Ordering System 🍔

A full-stack web application for a canteen featuring real-time inventory management, order processing, and a comprehensive owner dashboard. This project allows clients to place orders from a live menu, while the owner can manage inventory and track orders as they come in.



## ✨ Key Features

-   [cite_start]**Client Dashboard**: Browse the menu with live stock counts, add items to a cart with quantity controls, and place orders by providing a name and phone number. [cite: 4]
-   **Owner Dashboard**: A secure, login-protected dashboard for the canteen owner.
    -   [cite_start]**Menu Management**: Full CRUD (Create, Read, Update, Delete) functionality for all menu items, including name, price, and stock. [cite: 2]
    -   **Order Management**: View a real-time list of all incoming `PENDING` and `COMPLETED` orders. See order details including items, quantities, client name, phone, and the port the order came from.
-   **Real-Time System**: Built with **WebSockets (Socket.IO)**, ensuring that:
    -   Stock levels on the client's menu update instantly for all users when an item is ordered or an order is cancelled.
    -   New orders appear on the owner's dashboard immediately after being placed.
    -   Clients receive instant notifications when their order is marked as "Completed" or "Cancelled" by the owner.
-   [cite_start]**Inventory Locking**: Stock is immediately decremented from the database when an order is placed. [cite: 2, 3]
-   [cite_start]**Auto-Cancellation**: A background job runs on the server to automatically cancel pending orders after 15 minutes, restoring the stock to the menu. [cite: 2, 3]
-   **Role-Based Access**: The application has two distinct roles:
    -   **Client**: Can view the menu and place orders.
    -   **Owner**: Can access the management dashboard after logging in.

## 🛠️ Tech Stack

-   **Frontend**: React, React Router, Axios, Socket.IO Client, `jwt-decode`
-   **Backend**: Node.js, Express.js
-   **Database**: PostgreSQL
-   **Real-Time Communication**: Socket.IO
-   **Security**: Bcrypt (for password hashing), JSON Web Tokens (JWT for session management)

## 🚀 Project Setup and Installation

Follow these steps to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [PostgreSQL](https://www.postgresql.org/download/)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
cd canteen-project
```

### 2. Backend Setup
Navigate to the backend directory and install the necessary packages.
```bash
cd backend
npm install
```
Create an environment file by copying the example:
```bash
cp .env.example .env
```
Now, open the `.env` file and add your PostgreSQL database URL and a strong JWT secret.
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/canteen_db"
PORT=8000
JWT_SECRET="your_super_secret_key_that_is_long_and_random"
```

### 3. Frontend Setup
Navigate to the frontend directory and install the necessary packages.
```bash
cd ../frontend
npm install
```
Create the environment file. The default value should work for local development.
```bash
cp .env.example .env
```

### 4. Database Setup
This step creates all the necessary tables and populates them with initial data.

**A. Create the Database:**
First, make sure you have created the database in PostgreSQL.
```sql
CREATE DATABASE canteen_db;
```

**B. Create an Owner Account:**
You need a secure password for your owner account.
1.  In your `backend` terminal, run the password hashing script. Choose a secure password.
    ```bash
    node hash-password.js 'your-secure-owner-password'
    ```
2.  The script will output a long **hashed password**. Copy this hash.

**C. Populate the Database:**
1.  Open the file `backend/db/schema.sql`.
2.  Paste the hashed password you just copied into the `INSERT INTO Users` statement, replacing `'PASTE_YOUR_BCRYPT_HASH_HERE'`.
3.  From your `backend` terminal, run the following command to execute the SQL script. This will create all tables and insert the initial data.
    ```bash
    psql -U postgres -d canteen_db -f db/schema.sql
    ```

## ▶️ Running the Application

You need to run the backend and frontend servers in two separate terminals.

**1. Start the Backend Server:**
```bash
# From the backend/ directory
node src/server.js
```
The server should be running on `http://localhost:8000`.

**2. Start the Frontend Application:**
```bash
# From the frontend/ directory
npm start
```
Your browser should automatically open to `http://localhost:3000`, where you'll see the landing page.

---
### **Login Credentials**
-   **Owner Email**: `owner@canteen.com`
-   **Owner Password**: The secure password you chose during the setup.