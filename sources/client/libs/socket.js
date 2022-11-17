import { io } from "http://localhost:8000/socket.io/socket.io.esm.min.js"
const socket = io("ws://localhost:8000");
export default socket