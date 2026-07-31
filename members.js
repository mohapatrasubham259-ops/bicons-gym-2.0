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

  data.forEach((member, index) => {

    let status = member.status || "Pending";

    const statusClass =
      status === "Paid"
        ? "status-paid"
        : "status-pending";

    tbody.innerHTML += `
      <tr>

       

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
// ===============================
// PART 3
// EDIT + DELETE + STATUS
// ===============================

// Open Edit Popup
window.editMember = function (id) {

  const member = allMembers.find(m => m.id === id);

  if (!member) return;

  editId = id;

  document.getElementById("editPlan").value =
    member.plan || "Monthly";

  document.getElementById("editAmount").value =
    member.amount || "";

  document.getElementById("editStatus").value =
    member.status || "Pending";

  document.getElementById("editModal").style.display = "flex";

};

// Close Edit Popup
window.closeModal = function () {

  document.getElementById("editModal").style.display = "none";

};

// Save Edit
const saveBtn = document.getElementById("saveBtn");

if (saveBtn) {

  saveBtn.onclick = async () => {

    if (!editId) return;

    try {

      const plan = document.getElementById("editPlan").value;
      const amount = document.getElementById("editAmount").value;
      const status = document.getElementById("editStatus").value;

      let updateData = {
        plan,
        amount,
        status
      };

      // Update payment date & expiry whenever status is Paid
if (status === "Paid") {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    updateData.paymentDate = today.toISOString().split("T")[0];

    const expiry = new Date(today);

    switch (plan) {

        case "Joining":
        case "Monthly":
            expiry.setMonth(expiry.getMonth() + 1);
            break;

        case "3 Months":
            expiry.setMonth(expiry.getMonth() + 3);
            break;

        case "6 Months":
            expiry.setMonth(expiry.getMonth() + 6);
            break;

        case "12 Months":
            expiry.setFullYear(expiry.getFullYear() + 1);
            break;

        default:
            expiry.setMonth(expiry.getMonth() + 1);
    }

    updateData.expiryDate = expiry.toISOString().split("T")[0];
}


    console.log("Plan =", plan);
    console.log("Status =", status);
    console.log("Update Data =", updateData);

     await updateDoc(doc(db, "members", editId), updateData);

      

      alert("Member Updated Successfully ✅");

      closeModal();

      editId = null;

      await loadMembers();

    } catch (err) {

      console.error(err);

      alert("Update Failed");

    }

  };

}
// Delete Member
window.deleteMember = async function (id) {

  if (!confirm("Delete this member?")) return;

  try {

    await deleteDoc(doc(db, "members", id));

    alert("Member Deleted Successfully ✅");

    await loadMembers();

  } catch (err) {

    console.error(err);

    alert("Delete Failed");

  }

};

// ===============================
// AUTO STATUS UPDATE
// ===============================

async function checkAutoStatus() {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const member of allMembers) {

    if (!member.expiryDate) continue;

    const expiry = new Date(member.expiryDate);
    expiry.setHours(0, 0, 0, 0);

  if (member.status === "Paid" && expiry < today) {

    await updateDoc(doc(db, "members", member.id), {
        status: "Pending"
    });

}

   if (member.status !== newStatus) {

  try {

    await updateDoc(doc(db, "members", member.id), {
      status: newStatus
    });

  } catch (err) {

    console.error(err);

  }

}

  }

  await loadMembers();

}

// Run every 30 seconds
setInterval(checkAutoStatus, 30000);