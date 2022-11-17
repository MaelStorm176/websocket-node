import socket from "./libs/socket.js";
const send = document.getElementById("send");

socket.on("result", result => {
    const resultsElement = document.getElementById("results_ws")
    if (resultsElement) {
        resultsElement.innerText = ""
        resultsElement.innerText = result
    }else{
        console.log("results_socket not found")
    }
});

send.addEventListener("click", () => {
    const number_one = document.getElementById("number_one").value
    const number_two = document.getElementById("number_two").value
    socket.emit("add", {number_one, number_two});
});