Authentication System

A simple full-stack authentication system built with React.js, Express.js, MySQL, and Express Session.

This project demonstrates user registration, login, password hashing, session-based authentication, and protected API requests between a React frontend and Express backend.

Tech Stack

Frontend

* React.js
* Axios
* Vite
* JavaScript
* CSS

Backend

* Node.js
* Express.js
* MySQL
* bcrypt
* express-session
* CORS

Project Structure

Authentication/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── ...
│
└── backend/
    ├── index.js
    ├── package.json
    └── ...

Features

* User registration
* Password hashing with bcrypt
* User login
* Session-based authentication
* Protected API endpoint
* MySQL database
* CORS configuration
* React + Axios API communication

Authentication Flow

React Frontend
      │
      │ POST /users/login
      ▼
Express Backend
      │
      │ Check email
      │ Compare password with bcrypt
      ▼
MySQL Database
      │
      │ Login successful
      ▼
Express Session
      │
      │ Create session
      ▼
React Frontend
      │
      │ GET /api/users
      │ withCredentials: true
      ▼
Protected API

Database

Create a MySQL database:

CREATE DATABASE Authentication_learn;

Create the users table:

USE Authentication_learn;
CREATE TABLE Authentication_learn (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

Passwords are stored as bcrypt hashes instead of plain text.

Backend Setup

Go to the backend folder:

cd backend

Install dependencies:

npm install

Required packages:

npm install express mysql bcrypt cors express-session

Start the backend:

node index.js

The backend will run on:

http://localhost:3000

Backend API

Register

POST /users/register

Request:

{
  "email": "test1@gmail.com",
  "password": "test1"
}

Response:

{
  "message": "Register successful",
  "id": 1,
  "email": "test1@gmail.com"
}

Login

POST /users/login

Request:

{
  "email": "test1@gmail.com",
  "password": "test1"
}

Response:

{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "test1@gmail.com"
  }
}

After successful login, the server creates a session:

req.session.userId = user.id;
req.session.user = user;

Get Authenticated User

GET /api/users

This endpoint requires an active session.

If the user is not authenticated:

{
  "message": "Authentication required"
}

Frontend Setup

Go to the frontend folder:

cd frontend

Install dependencies:

npm install

Install Axios:

npm install axios

Start the development server:

npm run dev

The frontend will normally run on:

http://localhost:5173

Axios Authentication

Because the frontend and backend run on different ports, Axios must send credentials with requests.

Login:

const response = await axios.post(
  "http://localhost:3000/users/login",
  {
    email,
    password
  },
  {
    withCredentials: true
  }
);

Access protected API:

const response = await axios.get(
  "http://localhost:3000/api/users",
  {
    withCredentials: true
  }
);

CORS Configuration

The backend allows requests from the React frontend:

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

credentials: true is required so the browser can send the session cookie.

Session Configuration

The backend uses express-session:

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000
        }
    })
);

The browser stores the session ID in a cookie.

The user data itself is stored in the server-side session:

req.session.userId = user.id;
req.session.user = user;

The frontend does not need to store a JWT in localStorage.

Environment

For local development, the MySQL connection is configured as:

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Authentication_learn"
});

Update these values according to your local MySQL configuration.

Important Notes

Password Security

Passwords should never be stored as plain text.

This project uses bcrypt:

const hashedPassword = await bcrypt.hash(password, 10);

During login:

const isMatch = await bcrypt.compare(
    password,
    user.password
);

Session Authentication

This project uses session-based authentication instead of storing JWT tokens in localStorage.

Login
  ↓
Create Session
  ↓
Session ID Cookie
  ↓
Browser sends Cookie
  ↓
Backend checks req.session
  ↓
Protected API

Development Session Store

express-session uses an in-memory session store by default.

This is suitable for learning and local development, but a production application should use a persistent session store such as Redis or a database-backed session store.

Future Improvements

* Add logout endpoint
* Add authentication middleware
* Add user roles and permissions
* Add form validation
* Add better error handling
* Use environment variables for secrets and database credentials
* Use a production session store such as Redis
* Hide sensitive database fields from API responses
* Add frontend protected routes
* Add loading and error states
* Deploy frontend and backend

Learning Goals

This project was created to practice:

* React API integration
* Axios
* Express.js
* REST API
* MySQL CRUD
* Password hashing
* Authentication
* Session management
* Cookies
* CORS
* Frontend ↔ Backend communication

Author

Souphakone Keopheth

Computer Science — Bangkok University

First Class Honors