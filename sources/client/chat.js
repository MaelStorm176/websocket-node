import socket from "./libs/socket.js";

const send = document.getElementById("send_message");

//When server sends a message
socket.on("message", message => {
    const resultsElement = document.getElementById("messages")
    if (resultsElement && message.pseudo && message.message && message.date) {
        //Append the message to the list of messages
        // structure: {pseudo: "pseudo", message: "message", date: "date"}
        //check message structure
        const date = new Date(message.date)
        const dateStr = date.toLocaleString()
        resultsElement.innerHTML += `<li>${message.pseudo} : <small>${message.message} (${dateStr})</small></li>`
    }
});

send.addEventListener("click", () => {
    const pseudo = document.getElementById("pseudo").value
    const message = document.getElementById("message").value
    const date = new Date();
    socket.emit("send_message", {
        pseudo: pseudo,
        message: message,
        date: date
    });
});