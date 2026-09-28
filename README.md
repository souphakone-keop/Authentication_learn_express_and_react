# Full-Stack Authentication System (React + Express + MySQL)

A complete guide and documentation for a Login / Authentication system built with **React (Vite)** on the frontend and **Node.js (Express) + MySQL** on the backend, featuring **Session Management (`express-session`)** and password hashing using **Bcrypt**.

## 📌 Features

* **Authentication**: Login with Email and Password using `bcrypt` for password hashing and verification.
* **Session Management**: Session-based state management using HTTP-only cookies (`withCredentials: true`).
* **Protected Routes/APIs**: Restricted `/api/users` endpoint verifying session validity before serving data.
* **CORS Configured**: Cross-Origin Resource Sharing set up to support credentials (cookies) between Frontend (`http://localhost:5173`) and Backend (`http://localhost:3000`).

---

## 🛠️ Tech Stack

### Frontend
* **React.js** (Functional Components + Hooks)
* **Axios**: HTTP client for API requests
* **Tailwind CSS**: Utility-first CSS framework for UI styling

### Backend
* **Node.js & Express.js**: REST API server
* **MySQL**: Relational database
* **express-session**: Session management middleware with HTTP-only cookies
* **bcrypt**: Password hashing and verification library
* **cors**: Middleware to enable CORS with credentials

---

## 🗄️ Database Structure

Run the following SQL script to set up the database and required table:

```sql
CREATE DATABASE IF NOT EXISTS Authentication_learn;

USE Authentication_learn;

CREATE TABLE IF NOT EXISTS Authentication_learn (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Setup & Installation

### 1. Backend Setup (Express)

1. Initialize a Node.js project and install required dependencies:
   ```bash
   npm init -y
   npm install express mysql bcrypt cors express-session
   ```
2. Configure database connection settings in your server file (`app.js` or `server.js`):
   ```javascript
   const connection = mysql.createConnection({
       host: 'localhost',
       user: 'root',      // Update with your MySQL user
       password: '',      // Update with your MySQL password
       database: 'Authentication_learn',
   });
   ```
3. Start the backend server:
   ```bash
   node app.js
   ```
   *(Backend will run at `http://localhost:3000`)*

---

### 2. Frontend Setup (React)

1. Install required dependencies:
   ```bash
   npm install axios
   ```
2. Ensure **Tailwind CSS** is configured in your project.
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(Frontend will run at `http://localhost:5173`)*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | ❌ No | Server health check (`Hello World!`) |
| `GET` | `/users` | ❌ No | Fetches all registered users |
| `POST` | `/users/register` | ❌ No | Registers a new user (hashes password before insert) |
| `POST` | `/users/login` | ❌ No | Authenticates user and initiates session cookie |
| `GET` | `/api/users` | ✅ Session Required | Fetches session-protected current user details |

---

## ⚠️ Important Notes & Code Improvements

### 1. Simultaneous Function Triggering on Submit Button
In the React implementation, the submit button triggers `getUsers()` via `onClick` simultaneously with `handleLogin` via `onSubmit`:
```jsx
<button
  type="submit"
  disabled={loading}
  onClick={() => { getUsers() }}
>
  {loading ? "Logging in..." : "Login"}
</button>
```
* **Issue:** Clicking the submit button triggers both functions at once. Since session creation on the server takes time, `getUsers()` executes before the login completes, resulting in a `401 Authentication required` error.
* **Solution:** Remove `onClick` from the button and call `getUsers()` inside `handleLogin` right after login succeeds:

```javascript
try {
  const response = await axios.post(`${API}/users/login`, payload, { withCredentials: true });
  console.log('Login success: ', response.data);
  alert("Login successful!");

  // Fetch protected user data after successful authentication
  await getUsers();

  setEmail("");
  setPassword("");
} catch (err) {
  console.error("Login error:", err);
}
```

---

### 2. Security Vulnerability in `SELECT *`
The public `/users` GET endpoint currently returns hashed passwords directly:
```javascript
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM Authentication_learn', ...)
});
```
* **Recommendation:** Exclude password hashes from the SQL query response:
  ```sql
  SELECT id, email, created_at FROM Authentication_learn
  ```