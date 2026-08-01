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

// ======================================
// PART 3 - EDIT MEMBER
// ======================================

// Open Edit Popup
window.editMember = function (id) {

    currentMemberId = id;

    const member = allMembers.find(m => m.id === id);

    if (!member) return;

    document.getElementById("editPlan").value = member.plan || "";
    document.getElementById("editAmount").value = member.amount || "";
    document.getElementById("editStatus").value = member.status || "Pending";

    document.getElementById("editModal").style.display = "flex";

};

// Close Edit Popup
window.closeModal = function () {

    document.getElementById("editModal").style.display = "none";

};

// Update Member
window.updateMember = async function () {

    try {

        let paymentDate = "";
        let expiryDate = "";

        const status = document.getElementById("editStatus").value;
        const plan = document.getElementById("editPlan").value;

        // Pending → Paid
        if (status === "Paid") {

            const today = new Date();

            paymentDate = today.toISOString().split("T")[0];

            const expiry = new Date(today);

            if (plan === "Joining" || plan === "Monthly") {
                expiry.setDate(expiry.getDate() + 30);
            }
            else if (plan === "3 Months") {
                expiry.setDate(expiry.getDate() + 90);
            }
            else if (plan === "6 Months") {
                expiry.setDate(expiry.getDate() + 180);
            }

            expiryDate = expiry.toISOString().split("T")[0];

        }

        await updateDoc(doc(db, "members", currentMemberId), {

            plan: plan,
            amount: document.getElementById("editAmount").value,
            status: status,
            paymentDate: paymentDate,
            expiryDate: expiryDate,
            updatedAt: new Date()

        });

        alert("Member Updated Successfully ✅");

        closeModal();

        await loadMembers();

    } catch (err) {

        console.error(err);

        alert("Update Failed");

    }

};

// ======================================
// PART 4 - DELETE + ADD MEMBER
// ======================================

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

// Open Add Popup
window.openAddModal = function () {
    const modal = document.getElementById("addModal");
    modal.style.display = "flex";
};

window.closeAddModal = function () {
    const modal = document.getElementById("addModal");
    modal.style.display = "none";
};
// Wait until page loads
document.addEventListener("DOMContentLoaded", () => {

    const addBtn = document.getElementById("addMemberBtn");

    if (addBtn) {

        addBtn.addEventListener("click", openAddModal);

        addBtn.addEventListener("touchstart", openAddModal);

    }

});

// ======================================
// PART 5 - ADD MEMBER SAVE
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const addSaveBtn = document.getElementById("addSaveBtn");

    if (!addSaveBtn) return;

    addSaveBtn.onclick = async function () {

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