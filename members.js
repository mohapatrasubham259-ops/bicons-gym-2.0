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

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const membersRef = collection(db, "members");

let allMembers = [];
let editId = null;

// Load Members
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

// Display Members
function displayMembers(data) {

 const tableBody = document.getElementById("membersTableBody");
  if (!tablebody) {
    console.error("membersTableBody not found");
    return;
  }

 tableBody.innerHTML = "";

  data.forEach(member => {

    let status = member.status || "Pending";

    if (member.expiryDate) {

      const today = new Date().setHours(0,0,0,0);
      const expiry = new Date(member.expiryDate).setHours(0,0,0,0);

      if (expiry < today) {
        status = "Pending";
      }

    }

    const statusClass =
      status === "Paid"
        ? "status-paid"
        : "status-pending";

   tableBody.innerHTML += ``
      <tr>
        <td>${member.registrationNo ?? "-"}</td>
        <td>${member.name ?? "-"}</td>
        <td>${member.phone ?? "-"}</td>
        <td>${member.age ?? "-"}</td>
        <td>${member.plan ?? "-"}</td>
        <td>₹${member.amount ?? "-"}</td>
        <td>${member.paymentDate ?? "-"}</td>
        <td>${member.expiryDate ?? "-"}</td>
        <td class="${statusClass}">${status}</td>
        <td>
          <button onclick="editMember('${member.id}')">Edit</button>
          <button onclick="deleteMember('${member.id}')">Delete</button>
        </td>
      </tr>
    `;

  });

}

// Load on Page Open
window.addEventListener("DOMContentLoaded", loadMembers);

// ===============================
// PART 2
// Search + Add Member
// ===============================

// ---------- SEARCH ----------

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

// ---------- OPEN / CLOSE ADD MODAL ----------

const addBtn = document.getElementById("addMemberBtn");
const addModal = document.getElementById("addModal");

if (addBtn) {

  addBtn.onclick = () => {

    addModal.style.display = "flex";

  };

}

window.closeAddModal = function () {

  addModal.style.display = "none";

};

// ---------- SAVE NEW MEMBER ----------

const addSaveBtn = document.getElementById("addSaveBtn");

if (addSaveBtn) {

  addSaveBtn.onclick = saveMember;

}

async function saveMember() {

  try {

    const memberData = {

      registrationNo:
        "BG" + Date.now(),

      name:
        document.getElementById("newName").value.trim(),

      phone:
        document.getElementById("newPhone").value.trim(),

      age:
        document.getElementById("newAge").value,

      plan:
        document.getElementById("newPlan").value,

      amount:
        document.getElementById("newAmount").value,

      paymentDate:
        document.getElementById("newPaymentDate").value,

      expiryDate:
        document.getElementById("newExpiryDate").value,

      status:
        document.getElementById("newStatus").value,

      createdAt:
        new Date()

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

    loadMembers();

  } catch (error) {

    console.error(error);

    alert("Failed to Add Member");

  }

}

// ===============================
// PART 3
// Edit + Delete + Auto Status
// ===============================

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

    saveBtn.onclick = async function () {

        if (!editId) return;

        try {

            await updateDoc(doc(db, "members", editId), {

                plan: document.getElementById("editPlan").value,

                amount: document.getElementById("editAmount").value,

                status: document.getElementById("editStatus").value

            });

            alert("Member Updated Successfully ✅");

            closeModal();

            editId = null;

            loadMembers();

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

        alert("Member Deleted ✅");

        loadMembers();

    } catch (err) {

        console.error(err);

        alert("Delete Failed");

    }

};

// Auto Status Check
async function checkAutoStatus() {

    const today = new Date();
    today.setHours(0,0,0,0);

    for (const member of allMembers) {

        if (!member.expiryDate) continue;

        const expiry = new Date(member.expiryDate);
        expiry.setHours(0,0,0,0);

        const newStatus =
            expiry < today ? "Pending" : "Paid";

        if (member.status !== newStatus) {

            try {

                await updateDoc(doc(db, "members", member.id), {

                    status: newStatus

                });

            } catch (e) {

                console.error(e);

            }

        }

    }

    loadMembers();

}

// Run after loading
setTimeout(() => {

    checkAutoStatus();

}, 2000);