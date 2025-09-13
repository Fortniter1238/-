// app.js
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

/* 1) Вставь сюда свои ключи Firebase */
const firebaseConfig = {
  apiKey: "PASTE_YOUR_KEY",
  authDomain: "PASTE.firebaseapp.com",
  projectId: "PASTE",
  storageBucket: "PASTE.appspot.com",
  messagingSenderId: "PASTE",
  appId: "PASTE"
};

/* 2) Инициализация */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");

/* DOM элементы */
const messagesEl = document.getElementById("messages");
const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const userLabel = document.getElementById("userLabel");

/* Имя пользователя (сохраняем в localStorage) */
const savedName = localStorage.getItem("chat_name") || "";
if (savedName) {
  nameInput.value = savedName;
  userLabel.textContent = savedName;
}
nameInput.addEventListener("input", () => {
  const v = nameInput.value.trim();
  localStorage.setItem("chat_name", v);
  userLabel.textContent = v || "Гость";
});

/* Отправка сообщения */
async function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  const author = (nameInput.value || "Гость").trim().slice(0, 24);

  try {
    await addDoc(messagesRef, {
      text,
      author,
      createdAt: serverTimestamp()
    });
    msgInput.value = "";
  } catch (e) {
    console.error("Ошибка отправки:", e);
    alert("Не удалось отправить сообщение.");
  }
}

/* Enter для отправки */
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
sendBtn.addEventListener("click", sendMessage);

/* Рендер одного сообщения */
function renderMessage(doc, currentName) {
  const data = doc.data();
  const isYou = data.author === currentName && currentName !== "Гость";

  const wrapper = document.createElement("div");
  wrapper.className = "bubble" + (isYou ? " you" : "");

  const text = document.createElement("div");
  text.textContent = data.text || "";

  const meta = document.createElement("div");
  meta.className = "meta";

  const author = document.createElement("span");
  author.className = "author";
  author.textContent = data.author || "Гость";

  const time = document.createElement("span");
  time.className = "time";
  let ts = "";
  if (data.createdAt && data.createdAt.toDate) {
    const d = data.createdAt.toDate();
    ts = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  time.textContent = ts;

  meta.appendChild(author);
  meta.appendChild(time);

  wrapper.appendChild(text);
  wrapper.appendChild(meta);
  return wrapper;
}

/* 3) Подписка на обновления в реальном времени */
const q = query(messagesRef, orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
  const currentName = (nameInput.value || "Гость").trim();
  messagesEl.innerHTML = "";
  snapshot.forEach((doc) => {
    messagesEl.appendChild(renderMessage(doc, currentName));
  });
  // автоскролл вниз
  messagesEl.scrollTop = messagesEl.scrollHeight;
});
