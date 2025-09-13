const socket = io();

const nameInput = document.getElementById("name");
const msgInput = document.getElementById("message");
const sendBtn = document.getElementById("send");
const messagesEl = document.getElementById("messages");

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = msgInput.value.trim();
  const user = nameInput.value.trim() || "Гость";
  if (!text) return;
  socket.emit("message", { text, user });
  msgInput.value = "";
}

socket.on("init", (msgs) => {
  messagesEl.innerHTML = "";
  msgs.forEach(addMessage);
});

socket.on("message", (msg) => {
  addMessage(msg);
});

function addMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  if (msg.user !== (nameInput.value.trim() || "Гость")) {
    div.classList.add("other");
  }
  div.innerHTML = `<strong>${escapeHtml(msg.user)}:</strong> ${escapeHtml(msg.text)} <small>${msg.time}</small>`;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}
