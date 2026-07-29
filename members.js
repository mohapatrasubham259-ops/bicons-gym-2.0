// ===============================
// BICON GYM - MEMBERS JS (PART 1)
// Firebase + Load Members
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDJ3gjoxKgNTOpLZS-Qg0mrPmp3TVJV7HM",
  authDomain: "bicon-gym.firebaseapp.com",
  projectId: "bicon-gym",
  storageBucket: "bicon-gym.firebasestorage.app",
  messagingSenderId: "64202444264",
  appId: "1:64202444264:web:9e3c1c1519431cdbb5a85d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const membersRef = collection(db, "members");

let allMembers = [];
let editId = null;

// ===============================
// LOAD MEMBERS
// ===============================

async function loadMembers() {

  try {

    const snapshot = await getDocs(membersRef);

    allMembers = [];

    snapshot.forEach((docSnap) => {

      allMembers.push({
        id: docSnap.id,
        ...docSnap.data()
      });

    });

    console.log("Members Loaded:", allMembers);

    displayMembers(allMembers);

  } catch (err) {

    console.error("Load Error:", err);

  }

}

// ===============================
// DISPLAY MEMBERS
// ===============================

function displayMembers(data) {

  const tbody = document.getElementById("membersTableBody");

  if (!tbody) {
    console.error("membersTableBody not found");
    return;
  }

  tbody.innerHTML = "";

  data.forEach((member) => {

    let status = member.status || "Pending";

    const statusClass =
      status === "Paid"
        ? "status-paid"
        : "status-pending";

    tbody.innerHTML += `
      <tr>

        <td>${member.registrationNo || "-"}</td>

        <td>${member.name || "-"}</td>

        <td>${member.phone || "-"}</td>

        <td>${member.age || "-"}</td>

        <td>${member.plan || "-"}</td>

        <td>₹${member.amount || "-"}</td>

        <td>${member.paymentDate || "-"}</td>

        <td>${member.expiryDate || "-"}</td>

        <td class="${statusClass}">
          ${status}
        </td>

        <td>

          <button onclick="editMember('${member.id}')">
            Edit
          </button>

          <button onclick="deleteMember('${member.id}')">
            Delete
          </button>

        </td>

      </tr>
    `;

  });

}

// Load Page
window.addEventListener("DOMContentLoaded", loadMembers);
// ===============================
// PART 2
// SEARCH + ADD MEMBER
// ===============================

// Search
const searchInput = document.getElementById("searchInput");

if (searchInput) {

  searchInput.addEventListener("input", () => {

    const value = searchInput.value.trim().toLowerCase();

    const filtered = allMembers.filter(member => {

      return (
        (member.name || "").toLowerCase().includes(value) ||
        (member.phone || "").includes(value) ||
        (member.registrationNo || "").toLowerCase().includes(value)
      );

    });

    displayMembers(filtered);

  });

}

// Open Add Popup
const addBtn = document.getElementById("addMemberBtn");
const addModal = document.getElementById("addModal");

if (addBtn) {

  addBtn.onclick = () => {

    addModal.style.display = "flex";

  };

}

// Close Add Popup
window.closeAddModal = function () {

  document.getElementById("addModal").style.display = "none";

};

// Save New Member
const addSaveBtn = document.getElementById("addSaveBtn");

if (addSaveBtn) {

  addSaveBtn.onclick = saveMember;

}

async function saveMember() {

  try {

    const memberData = {

      registrationNo: "BG" + Date.now(),

      name: document.getElementById("newName").value.trim(),

      phone: document.getElementById("newPhone").value.trim(),

      age: document.getElementById("newAge").value,

      plan: document.getElementById("newPlan").value,

      amount: document.getElementById("newAmount").value,

      paymentDate: document.getElementById("newPaymentDate").value,

      expiryDate: document.getElementById("newExpiryDate").value,

      status: document.getElementById("newStatus").value,

      createdAt: new Date()

    };

    await addDoc(membersRef, memberData);

    alert("Member Added Successfully ✅");

    closeAddModal();

    document.getElementById("newName").value = "";
    document.getElementById("newPhone").value = "";
    document.getElementById("newAge").value = "";
    document.getElementById("newPlan").value = "";
    document.getElementById("newAmount").value = "";
    document.getElementById("newPaymentDate").value = "";
    document.getElementById("newExpiryDate").value = "";
    document.getElementById("newStatus").value = "Paid";

    await loadMembers();

  } catch (err) {

    console.error(err);

    alert("Failed to Add Member");

  }

}