const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000
        }
    })
);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Authentication_learn',
});

connection.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
        return;
    }

    console.log('Connected to MySQL via Express!');
});


// GET USERS
app.get('/users', (req, res) => {
    connection.query(
        'SELECT * FROM Authentication_learn',
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(results);
        }
    );
});


// REGISTER
app.post('/users/register', async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
        'INSERT INTO Authentication_learn (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: 'Register successful',
                id: result.insertId,
                email
            });
        }
    );
});


// LOGIN
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    connection.query(
        'SELECT * FROM Authentication_learn WHERE email = ?',
        [email],
        async (err, results) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: 'Email or password is incorrect'
                });
            }

            const user = results[0];

            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return res.status(401).json({
                    message: 'Email or password is incorrect'
                });
            }

            // SAVE USER IN SESSION
            req.session.userId = user.id;
            req.session.user = user;

            console.log('Login session:', req.session);

            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email
                }
            });
        }
    );
});


// PROTECTED API
app.get('/api/users', async (req, res) => {

    try {

        // Check session
        if (!req.session.userId) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }

        console.log('Session:', req.session);

        const user = req.session.user;

        connection.query(
            'SELECT id, email FROM Authentication_learn WHERE email = ?',
            [user.email],
            (err, results) => {

                if (err) {
                    return res.status(500).json({
                        message: 'Database error',
                        error: err.message
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        message: 'User not found'
                    });
                }

                res.json(results);
            }
        );

    } catch (err) {

        res.status(403).json({
            message: 'Authentication fail',
            error: err.message
        });

    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});