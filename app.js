import { query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const q = query(messagesRef, orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
  messagesEl.innerHTML = "";
  snapshot.forEach((doc) => {
    messagesEl.appendChild(renderMessage(doc, currentName));
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
});
