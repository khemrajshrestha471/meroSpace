const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const UserModel = require('./model/User.js')
// const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express()
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Failed to connect to MongoDB", err))

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT)
})

const JWT_SECRET = process.env.JWT_SECRET

app.post("/register-as-uploader", async (req, res) => {
    try {
        const { username, email, p_number, password } = req.body;
        const existingEmail = await UserModel.findOne({ email });
        const existingPhoneNumber = await UserModel.findOne({ p_number });
        if (existingEmail || existingPhoneNumber) {
            return res.status(400).json({ error: "Email or Phone Number already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, email, p_number, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post("/login-as-uploader", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // Generate JWT token
                const token = jwt.sign(
                    { userId: user._id, email: user.email },
                    JWT_SECRET,
                    { expiresIn: '1d' } // 1 day expiration
                );

                // Send token to client
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.SESSION_SECRET,
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                });

                res.json({ message: "Success", token });
            } else {
                res.status(401).json({ error: "Password did not match" })
            }
        } else {
            res.status(401).json({ error: "No records found" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Logout Route
app.post("/logout-as-uploader", (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.SESSION_SECRET,
        sameSite: 'strict'
    });
    res.json({ message: "Logged out successfully" });
});
