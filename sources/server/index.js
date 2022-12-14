import express from "express"
import {faker} from "@faker-js/faker"
import {Server} from "socket.io"
import {createServer} from "http"

const EVERY_FIVE_SECONDS = 5000

let users = []

const server = express();
const http = createServer(server);
const io = new Server(http, {
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

server.use(express.static("sources/client")) // Serve the client files

server.get("/api/users", (request, response) => {
    response.json(users)
})

server.get("/api/sse/users", (request, response) => {
    response.setHeader("Content-Type", "text/event-stream")
    response.setHeader("Cache-Control", "no-cache")
    response.setHeader("Connection", "keep-alive")

    response.flushHeaders();

    const interval = setInterval(() => {
        users = generateUsers()
        response.write(`event:message\ndata: ${JSON.stringify(users)}\n\n`)
    }, EVERY_FIVE_SECONDS)

    request.on("close", () => {
        console.log("Connection closed")
        clearInterval(interval)
    })
});



http.listen(8000, "0.0.0.0", () => {
    console.log("Server listening")
})

io.on("connection", socket => {
    console.log("Socket connected")
    setInterval(() => {
        users = generateUsers()
        socket.emit("users", users)
    }, EVERY_FIVE_SECONDS);


    const allChannels = getActiveSocketIds();
    io.emit("channels", allChannels);

    socket.on("disconnect", () => {
        //remove the channel from the list of channels
        allChannels.splice(allChannels.indexOf(socket.id), 1);
        io.emit("channels", allChannels);
    });

    /**
     * Numbers
     */
    socket.on("add", ({number_one, number_two}) => {
        const result = parseInt(number_one) + parseInt(number_two)
        socket.emit("result", result)
    });

    /**
     * Chat
     */
    socket.on("send_message", message => {
        // On envoie le message à tous les clients connectés INCLUDING the sender
        io.emit("message", message)
    });

    /**
     * Channels + Chat
     */
    socket.on("send_message_channel", message => {
        io.in(message.channel).emit("message_channel", message)
    });

    socket.on("join_channel", channel => {
        //leave the previous channel
        socket.leave(socket.id)
        //join the new channel
        socket.join(channel);
    });
});

setInterval(() => {
    users = generateUsers()
}, EVERY_FIVE_SECONDS)


const generateUsers = () => Array.from(Array(10)).map(() => ({
    email: faker.internet.email(),
    identifier: faker.random.numeric(10)
}))

const getActiveSocketIds = () => {
    const activeSockets = io.sockets.adapter.rooms;
    return [...activeSockets.keys()];
}