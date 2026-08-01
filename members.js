// ======================================
// BICON GYM - MEMBERS.JS
// PART 1 - FIREBASE + LOAD + SEARCH
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
// FIREBASE CONFIG
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
// GLOBAL VARIABLES
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

        snapshot.forEach((docSnap) => {

            allMembers.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });

        console.log("Members Loaded:", allMembers.length);

        displayMembers(allMembers);

    } catch (error) {

        console.error("Load Error:", error);

    }

}

// ======================================
// SEARCH MEMBERS
// ======================================

window.searchMembers = function () {

    const keyword = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = allMembers.filter(member => {

        return (
            (member.name || "").toLowerCase().includes(keyword) ||
            (member.phone || "").toLowerCase().includes(keyword)
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
// PART 2 - DISPLAY MEMBERS
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

// Display Members
function displayMembers(members) {

    const tbody = document.getElementById("memberTableBody");

    if (!tbody) return;

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
                    style="background:red;color:white"
                    onclick="deleteMember('${member.id}')">
                    Delete
                </button>
            </td>

        </tr>
        `;

    });

}