require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authMiddleware = require("./middleware/authMiddleware");
const postRoutes = require("./routes/postRoutes");

const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
    res.send("API working");
});

app.get("/api/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Welcome",
        user: req.user,
    });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });