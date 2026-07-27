import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJ3gjoxKgNTOpLZS-Qg0mrPmp3TVJV7HM",
  authDomain: "bicon-gym.firebaseapp.com",
  projectId: "bicon-gym",
  storageBucket: "bicon-gym.firebasestorage.app",
  messagingSenderId: "64202444264",
  appId: "1:64202444264:web:9e3c1c1519431cdbb5a85d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const table = document.getElementById("membersTable");
const searchInput = document.getElementById("searchInput");

async function loadMembers() {

    table.innerHTML = "";

    const snapshot = await getDocs(collection(db, "members"));

    table.innerHTML = "";

   console.log(snapshot.size);

    snapshot.forEach((doc) => {

        const m = doc.data();

        table.innerHTML += `
        <tr>
            <td>${m.registrationNo || "-"}</td>
            <td>${m.name || ""}</td>
            <td>${m.phone || ""}</td>
            <td>${m.age || ""}</td>
            <td>${m.plan || ""}</td>
            <td>₹${m.amount || ""}</td>
            <td>${m.paymentDate || ""}</td>
            <td>${m.expiryDate || ""}</td>
            <td>${m.status || ""}</td>
            <td>
                <button class="edit-btn" data-id="${doc.id}">Edit</button>               </td>
        </tr>
        `;
    });

    addButtonEvents();
}

function addButtonEvents() {

    document.querySelectorAll(".edit-btn").forEach(btn => {

        btn.addEventListener("click", function () {
      
        const id = this.dataset.id;

const newStatus = prompt("Enter Status (Paid/Pending)");

if (!newStatus) return;

            const newStatus = prompt("Enter Status (Paid/Pending)");

if (!newStatus) return;

await updateDoc(doc(db, "members", id), {
    status: newStatus
});

alert("Status Updated Successfully!");

loadMembers();


        });

    });

}

searchInput.addEventListener("keyup", function () {

    const filter = this.value.toLowerCase();

    document.querySelectorAll("#membersTable tr").forEach(row => {

        if (row.innerText.toLowerCase().includes(filter)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});

loadMembers();