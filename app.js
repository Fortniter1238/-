// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// 🔹 ВСТАВЬ СВОЙ КОНФИГ Firebase
const firebaseConfig = {
  apiKey: "ТВОЙ_API_KEY",
  authDomain: "ТВОЙ_PROJECT_ID.firebaseapp.com",
  projectId: "ТВОЙ_PROJECT_ID",
  storageBucket: "ТВОЙ_PROJECT_ID.appspot.com",
  messagingSenderId: "ТВОЙ_SENDER_ID",
  appId: "ТВОЙ_APP_ID"
};

// Инициализация
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");

// DOM элементы
const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const messagesEl = document.getElementById("messages");

// Сохраняем имя в localStorage
nameInput.value = localStorage.getItem("chat_name") || "";
nameInput.addEventListener("input", () => {
  localStorage.setItem("chat_name", nameInput.value.trim());
});

// Отправка сообщения
async function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  const author = nameInput.value.trim() || "Гость";

  await addDoc(messagesRef, {
    text,
    author,
    createdAt: serverTimestamp()
  });

  msgInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Подписка на обновления в реальном времени
const q = query(messagesRef, orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
  messagesEl.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.classList.add("message");
    if (data.author !== (nameInput.value.trim() || "Гость")) {
      div.classList.add("other");
    }
    div.innerHTML = `<strong>${data.author}:</strong> ${data.text}`;
    messagesEl.appendChild(div);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
});
