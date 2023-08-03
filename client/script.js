import { io } from "socket.io-client";

const name = prompt("Enter your name to join");

var show_messages = document.getElementById("show_messages");
var form = document.getElementById("form");
var joinRoomBtn = document.getElementById("joinRoomBtn");

const socket = io("http://localhost:5000");

if(name) socket.emit("new-user-join", name);

socket.on("user-joined", name => {
  displayMessage(`${name} joined the chat`, "right");
});

socket.on("connect", () => {
  displayMessage(`You connected with id : ${socket.id}`);
});

socket.on("broadcast-receive", (data) => {
  displayMessage(`${data.name}: ${data.message}`, "left");
});

socket.on("left-chat", (name) => {
  displayMessage(`${name} left the chat`, "left");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  var messageInput = document.getElementById("inpMessage");
  var privateRoomInput = document.getElementById("privateRoomInput");
  var commonRoomName = document.getElementById("commonRoomName");

  var message = messageInput.value;
  var roomName = commonRoomName.value;
  var privateRoomId = privateRoomInput.value;

  if (message === "") return;

  if (privateRoomId || roomName) {
    socket.emit("send-message", message, privateRoomId || roomName);
  }else{
    socket.emit("send-message", message);
  }

  displayMessage(message, "right");

  messageInput.value = "";
});

joinRoomBtn.addEventListener("click", () => {
  var roomName = document.getElementById("commonRoomName").value;

  socket.emit("join-room", roomName, (message) => {
    displayMessage(message);
  });
});

function displayMessage(message, position) {
  const pTag = document.createElement("p");
  pTag.textContent = message;
  pTag.classList.add("message");
  pTag.classList.add(position);
  show_messages.append(pTag);
  show_messages.scrollTo(0, document.body.scrollHeight);
};

document.addEventListener("keydown", e => {
  if (e.target.matches("input")) return;

  if (e.key === "c") socket.connect();
  if (e.key === "d") socket.disconnect();
});

// setInterval(() => {
//   socket.emit("ping");
// }, 1000);
