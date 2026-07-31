// ======================================
// BICON GYM - MEMBERS.JS
// PART 1
// Firebase + Load + Search
// ======================================

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

// ======================================
// FIREBASE
// ======================================

const firebaseConfig = {
    apiKey: "AIzaSyDJ3gjoxKgNTOpLZS-Qg0mrPmp3TVJV7HM",
    authDomain: "bicon-gym.firebaseapp.com",
    projectId: "bicon-gym",
    storageBucket: "bicon-gym.firebasestorage.app",
    messagingSenderId: "64202444264",
    appId: "1:64202444264:web:9e3c1c1519431cdbb5a85d",
    measurementId: "G-HY45R5RJQ4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ======================================
// GLOBAL
// ======================================

let allMembers = [];
let currentMemberId = "";

// ======================================
// LOAD MEMBERS
// ======================================

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

        console.log("Members :", allMembers.length);

        displayMembers(allMembers);

    } catch (err) {

        console.error(err);

        alert("Failed to load members.");

    }

}

// ======================================
// SEARCH
// ======================================

window.searchMembers = function () {

    const value = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = allMembers.filter(member => {

        return (
            (member.name || "").toLowerCase().includes(value) ||
            (member.phone || "").toLowerCase().includes(value)
        );

    });

    displayMembers(filtered);

};

// ======================================
// START
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadMembers();

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {

        searchInput.addEventListener("input", searchMembers);

    }

});
// ======================================
// PART 2
// DISPLAY + STATUS + EDIT + DELETE
// ======================================

// Auto Status
function getStatus(expiryDate) {

    if (!expiryDate || expiryDate.trim() === "") {
        return "Pending";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    return expiry >= today ? "Paid" : "Pending";
}

// Badge Class
function getStatusClass(status) {
    return status === "Paid"
        ? "status-paid"
        : "status-pending";
}

// Display Table
function displayMembers(members) {

    const tbody = document.getElementById("memberTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    members.forEach((member, index) => {

       await updateDoc(doc(db, "members", currentMemberId), {

    plan: document.getElementById("editPlan").value,
    amount: document.getElementById("editAmount").value,
    status: document.getElementById("editStatus").value,

    updatedAt: new Date()

});

        tbody.innerHTML += `
        <tr>

            <td>${index + 1}</td>
            <td>${member.name || ""}</td>
            <td>${member.phone || ""}</td>
            <td>${member.age || ""}</td>
            <td>${member.plan || ""}</td>
            <td>${member.amount || ""}</td>
            <td>${member.paymentDate || ""}</td>
            <td>${member.expiryDate || ""}</td>

            <td>
                <span class="${getStatusClass(status)}">
                    ${status}
                </span>
            </td>

            <td>

                <button onclick="editMember('${member.id}')">
                    Edit
                </button>

                <button
                    style="background:red;color:white"
                    onclick="deleteMember('${member.id}')">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

}

// ======================================
// EDIT MEMBER
// ======================================

window.editMember = function (id) {

    currentMemberId = id;

    const member = allMembers.find(m => m.id === id);

    if (!member) return;

    document.getElementById("editPlan").value = member.plan || "";
    document.getElementById("editAmount").value = member.amount || "";
    document.getElementById("editStatus").value = getStatus(member.expiryDate);

    document.getElementById("editModal").style.display = "flex";

};

window.closeModal = function () {

    document.getElementById("editModal").style.display = "none";

};

window.updateMember = async function () {

    try {

        

        alert("Member Updated Successfully ✅");

        closeModal();

        loadMembers();

    } catch (err) {

        console.error(err);

        alert("Update Failed");

    }

};

// ======================================
// DELETE MEMBER
// ======================================

window.deleteMember = async function (id) {

    if (!confirm("Delete this member?")) return;

    try {

        await deleteDoc(doc(db, "members", id));

        alert("Member Deleted Successfully ✅");

        loadMembers();

    } catch (err) {

        console.error(err);

        alert("Delete Failed");

    }

};
// ======================================
// PART 4
// FINAL EVENT BINDING
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // Load Members
    loadMembers();

    // Search
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", searchMembers);
    }

    // Add Member Popup
    document.getElementById("addMemberBtn").onclick = () => {
        document.getElementById("addModal").style.display = "flex";
    };

    // Save Member
    document.getElementById("addSaveBtn").onclick = async () => {

        try {

            const memberData = {

                registrationNo: "BG" + Date.now(),

                name: document.getElementById("newName").value.trim(),
                phone: document.getElementById("newPhone").value.trim(),
                age: document.getElementById("newAge").value.trim(),
                plan: document.getElementById("newPlan").value,
                amount: document.getElementById("newAmount").value,
                paymentDate: document.getElementById("newPaymentDate").value,
                expiryDate: document.getElementById("newExpiryDate").value,
                status: document.getElementById("newStatus").value,

                createdAt: new Date()

            };

            if (!memberData.name || !memberData.phone || !memberData.plan) {
                alert("Please fill all required fields.");
                return;
            }

            await addDoc(collection(db, "members"), memberData);

            alert("Member Added Successfully ✅");

            // Reset Fields
            document.getElementById("newName").value = "";
            document.getElementById("newPhone").value = "";
            document.getElementById("newAge").value = "";
            document.getElementById("newPlan").selectedIndex = 0;
            document.getElementById("newAmount").value = "";
            document.getElementById("newPaymentDate").value = "";
            document.getElementById("newExpiryDate").value = "";
            document.getElementById("newStatus").value = "Pending";

            closeAddModal();

            await loadMembers();

        } catch (err) {

            console.error(err);
            alert(err.message);

        }

    };

});