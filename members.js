import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const membersTable = document.getElementById("membersTable");
const searchInput = document.getElementById("searchInput");

let allMembers = [];
let selectedMemberId = "";

// =====================
// Load Members
// =====================
async function loadMembers() {

  try {

    const snapshot = await getDocs(collection(db, "members"));

    allMembers = [];

    snapshot.forEach((item) => {

      allMembers.push({
        id: item.id,
        ...item.data()
      });

    });

    displayMembers(allMembers);

  } catch (error) {

    console.error(error);

    membersTable.innerHTML = `
      <tr>
        <td colspan="10">Data Load Failed</td>
      </tr>
    `;
  }

}

// =====================
// Display Members
// =====================
function displayMembers(data) {

  membersTable.innerHTML = "";

  if (data.length === 0) {

    membersTable.innerHTML = `
      <tr>
        <td colspan="10">No Members Found</td>
      </tr>
    `;

    return;
  }

  data.forEach((member) => {

let status = "Paid";

if (member.expiryDate) {

    const today = new Date();

    const expiry = new Date(member.expiryDate);

    if (expiry < today) {
        status = "Pending";
    }

}

    const statusColor =
     status === "Paid"
        ? "#00c853"
        : member.status === "Pending"
        ? "#8B0000"
        : "#ffffff";

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${member.regNo || ""}</td>
      <td>${member.name || ""}</td>
      <td>${member.phone || ""}</td>
      <td>${member.age || ""}</td>
      <td>${member.plan || ""}</td>
      <td>₹${member.amount || ""}</td>
      <td>${member.paymentDate || ""}</td>
      <td>${member.expiryDate || ""}</td>

      <td style="color:${statusColor};font-weight:bold;">
        ${member.status || ""}
      </td>

      <td>
        <button onclick="openEdit('${member.id}')">
          ✏️ Edit
        </button>

        <button
          onclick="deleteMember('${member.id}')"
          style="
            background:#d32f2f;
            color:white;
            margin-left:5px;
            border:none;
            padding:6px 10px;
            border-radius:6px;
            cursor:pointer;
          ">
          🗑 Delete
        </button>
      </td>
    `;

    membersTable.appendChild(row);

  });

}
// =====================
// Open Edit Popup
// =====================
window.openEdit = function (id) {

    const member = allMembers.find(m => m.id === id);

    if (!member) return;

    selectedMemberId = id;

    document.getElementById("editPlan").value =
        member.plan || "";

    document.getElementById("editStatus").value =
        member.status || "Paid";

    document.getElementById("editAmount").value =
        member.amount || "";

    document.getElementById("editModal").style.display = "flex";

};


// =====================
// Close Popup
// =====================
window.closeModal = function () {

    document.getElementById("editModal").style.display = "none";

};


// =====================
// Save Member
// =====================
document.getElementById("saveBtn").addEventListener("click", async () => {

    const plan = document.getElementById("editPlan").value;

    const status = document.getElementById("editStatus").value;

    const amount = Number(document.getElementById("editAmount").value);

    try {

        await updateDoc(doc(db, "members", selectedMemberId), {
            plan: plan,
            status: status,
            amount: amount
        });

        alert("Member Updated Successfully");

        closeModal();

        loadMembers();

    } catch (error) {

        console.error(error);

        alert("Update Failed");

    }

});


// =====================
// Delete Member
// =====================
window.deleteMember = async function (id) {

    const ok = confirm("Are you sure you want to delete this member?");

    if (!ok) return;

    try {

        await deleteDoc(doc(db, "members", id));

        alert("Member Deleted Successfully");

        loadMembers();

    } catch (error) {

        console.error(error);

        alert("Delete Failed");

    }

};


// =====================
// Search
// =====================
searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    const result = allMembers.filter(member =>

        (member.name || "").toLowerCase().includes(value) ||

        (member.phone || "").includes(value)

    );

    displayMembers(result);

});


// =====================
// Start
// =====================

window.deleteMember = async function(id){

    if(!confirm("Delete this member?")) return;

    try{

        await deleteDoc(doc(db,"members",id));

        alert("Member Deleted");

        loadMembers();

    }catch(error){

        console.log(error);

        alert("Delete Failed");

    }

}
loadMembers();