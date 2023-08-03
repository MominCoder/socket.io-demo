import { io } from "socket.io-client";

var show_messages = document.getElementById("show_messages");
var form = document.getElementById("form");
var joinRoomBtn = document.getElementById("joinRoomBtn");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  displayMessage(`You connected with id : ${socket.id}`);
});

socket.on("broadcast", (msg) => {
  displayMessage(msg);
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

  displayMessage(message);

  messageInput.value = "";
});

joinRoomBtn.addEventListener("click", () => {
  var roomName = document.getElementById("commonRoomName").value;

  socket.emit("join-room", roomName, (message) => {
    displayMessage(message);
  });
});

function displayMessage(message) {
  const pTag = document.createElement("p");
  pTag.textContent = message;
  show_messages.append(pTag);
};

document.addEventListener("keydown", e => {
  if (e.target.matches("input")) return;

  if (e.key === "c") socket.connect();
  if (e.key === "d") socket.disconnect();
});

// setInterval(() => {
//   socket.emit("ping");
// }, 1000);
