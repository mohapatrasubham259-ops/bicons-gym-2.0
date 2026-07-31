// ===============================
// BICON GYM - MEMBERS.JS
// PART 1A
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


// ===============================
// FIREBASE CONFIG
// ===============================

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


// ===============================
// GLOBAL VARIABLES
// ===============================

let allMembers = [];


// ===============================
// LOAD MEMBERS
// ===============================

async function loadMembers() {

    try {

        const snapshot = await getDocs(
            collection(db, "members")
        );

        allMembers = [];

        snapshot.forEach((item) => {

            allMembers.push({
                id: item.id,
                ...item.data()
            });

        });

        console.log("Members Loaded :", allMembers.length);

        displayMembers(allMembers);

    }

    catch (error) {

        console.error("Load Error :", error);

    }

}

// ===============================
// PART 1B
// DISPLAY + SEARCH + STATUS
// ===============================

// Auto Status
function getStatus(expiryDate) {

    if (!expiryDate) return "Pending";

    const today = new Date();
    const expiry = new Date(expiryDate);

    return expiry >= today ? "Paid" : "Pending";
}

// Status Class
function getStatusClass(status) {

    return status === "Paid"
        ? "status-paid"
        : "status-pending";
}

// Display Members
function displayMembers(members) {

    const tbody = document.getElementById("memberTableBody");

    if (!tbody) {
        console.error("memberTableBody not found");
        return;
    }

    tbody.innerHTML = "";

    members.forEach((member, index) => {

        const status = getStatus(member.expiryDate);

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
                    style="background:red;color:white;"
                    onclick="deleteMember('${member.id}')">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

}

// Search
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

// Start
document.addEventListener("DOMContentLoaded", () => {

    loadMembers();

    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", searchMembers);
    }

});