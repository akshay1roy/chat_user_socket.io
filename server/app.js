import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors"
import jwt from "jsonwebtoken"

import cookieParser from "cookie-parser";


// import { Server } from "socket.io";
const port = 3000;
const secreteKeyJWT = "abcdefghijklmnopqrstuvwxyz"


const app = express();

const server = new createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }

})

app.use(
    cors({
        origin: "http://localhost:5173/",
        methods: ["GET", "POST"],
        credentials: true,
    })
)

app.get("/", (req, res) => {
    res.status(200).send("Hello world , I am akshay ")
})

app.get("/login", (req, res) => {
    const token = jwt.sign({ _id: "akshaykumarismyname" }, secreteKeyJWT)

    res
        .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" }).json({
            message: "Login Success",
        })
})

io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err)

        const token = socket.request.cookies.token;

        if (!token) return next(new Error("Authentication Error"))

        const decoded = jwt.verify(token, secreteKeyJWT);

        // socket.userId=decoded._id;

        next();
    })
})

io.on("connection", (socket) => {
    // console.log("User Connected ")
    // console.log("Id", socket.id)

    console.log("User Connected ", socket.id)

    socket.on("message", ({ room, message }) => {
        console.log({ room, message });

        // io.emit("receiveMessage",data);              messages are send sender and reciver also 

        // socket.broadcast.emit("recevieMessage", data);

        // io.to(room).emit("recevieMessage",message);
        socket.to(room).emit("recevieMessage", message);
    })

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    })


    // socket.emit("welcome",`welcome to the server ${socket.id}`);   // self -> send   ||  self->receive 


    // socket.broadcast.emit("welcome",`${socket.id} joined the server`);      // self -> send   ||  receive -> all    (but not self receive)

    socket.on("disconnect", () => {
        console.log("User Disconnected ", socket.id)
    })

})


server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})