import { io } from "http://localhost:8000/socket.io/socket.io.esm.min.js"

const EACH_SECONDS = 1000

/**
 * Simply fetches the users from the server and appends them to the list
 * @returns {Promise<void>}
 */
const fetchAndDisplayUsers = async () => {
    try {
        const response = await fetch("/api/users")
        const users = await response.json()
        const usersElement = document.getElementById("users")

        if (usersElement) {
            usersElement.innerHTML = ""
            appendUsersToAList(users, usersElement)
        }else{
            console.error("No users element found")
        }
    } catch (error) {
        console.error(error)
    }
}

/**
 * Connects to the event source and listens for the "users" event
 * @type {EventSource}
 */
const users_sse = new EventSource("/api/sse/users")
users_sse.addEventListener("message", event => {
    const users = JSON.parse(event.data)
    const usersElement = document.getElementById("users_sse")
    if (usersElement) {
        usersElement.innerHTML = ""
        appendUsersToAList(users, usersElement);
    }else{
        console.log("users_sse not found")
    }
})

/**
 * Connects to the socket.io server and listens for the "users" event
 */
const socket = io("http://localhost:8000");
socket.on("users", users => {
    const usersElement = document.getElementById("users_ws")
    if (usersElement) {
        usersElement.innerHTML = ""
        appendUsersToAList(users, usersElement);
    }else{
        console.log("users_socket not found")
    }
});

/**
 * Appends the users to the list
 * @param users
 * @param listElement
 */
const appendUsersToAList = (users, listElement) => {
    users.forEach(user => {
        const userElement = document.createElement("li")
        userElement.innerText = `[#${user.identifier}] ${user.email}`
        listElement.appendChild(userElement)
    })
}

//Polling
setInterval(fetchAndDisplayUsers, EACH_SECONDS)