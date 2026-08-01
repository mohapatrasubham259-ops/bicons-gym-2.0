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