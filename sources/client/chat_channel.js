import socket from "./libs/socket.js";
const send = document.getElementById("send_message_channel");
const resultsElement = document.getElementById("messages_channel");
const allMessagesChannel = document.getElementById("all_messages_channel");

send.addEventListener("click", () => {
    const pseudo = document.getElementById("pseudo_channel")
    const message = document.getElementById("message_channel")
    const date = new Date();
    const channel = document.querySelector("input[name=channel]:checked")

    if (channel) {
        if (pseudo.value && message.value) {
            socket.emit("send_message_channel", {
                pseudo: pseudo.value,
                message: message.value,
                date: date,
                channel: channel.value
            });
            message.value = ""
        }else{
            alert("Pseudo et message sont requis")
        }
    }else{
        alert("Vous devez choisir un channel")
    }
});

socket.on("message_channel", message => {
    console.log(message)
    if (resultsElement && message.pseudo && message.message && message.date) {
        //Append the message to the list of messages
        // structure: {pseudo: "pseudo", message: "message", date: "date"}
        //check message structure
        const date = new Date(message.date)
        const dateStr = date.toLocaleString()
        resultsElement.innerHTML += `<li>${message.pseudo} : <small>${message.message} (${dateStr})</small></li>`
    }
})

socket.on("channels", channels => {
    const channelsElement = document.getElementById("users_channel")
    if (channelsElement) {
        channelsElement.innerHTML = ""
        appendChannelsToAList(channels, channelsElement);
    }else{
        console.log("channels_socket not found")
    }
});

function appendChannelsToAList(channels, channelsElement) {
    for (let channel of channels) {
        const li = document.createElement("li")
        const label = document.createElement("label")
        const input = document.createElement("input")
        input.type = "radio"
        input.name = "channel"
        input.value = channel
        input.id = "channel_"+channel

        input.addEventListener("change", () => {
            socket.emit("join_channel", channel)
            allMessagesChannel.style.display = "block"
            resultsElement.innerHTML = ""
        });

        label.innerText = channel
        label.htmlFor = "channel_"+channel
        label.prepend(input)


        li.appendChild(label)
        channelsElement.appendChild(li)
    }
}
