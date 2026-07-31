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

// ===========================
// Firebase
// ===========================

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

// ===========================
// Global
// ===========================

let allMembers = [];

// ===========================
// Auto Status
// ===========================

function getStatus(expiryDate){

    if(!expiryDate) return "Pending";

    const today = new Date();

    const expiry = new Date(expiryDate);

    return expiry >= today ? "Paid" : "Pending";

}

function statusClass(status){

    return status=="Paid"
    ? "status-paid"
    : "status-pending";

}

// ===========================
// Display Members
// ===========================

function displayMembers(data){

    const tbody=document.getElementById("memberTableBody");

    if(!tbody) return;

    tbody.innerHTML="";

    data.forEach((member,index)=>{

        const status=getStatus(member.expiryDate);

        tbody.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${member.name || ""}</td>

<td>${member.phone || ""}</td>

<td>${member.age || ""}</td>

<td>${member.plan || ""}</td>

<td>${member.amount || ""}</td>

<td>${member.paymentDate || ""}</td>

<td>${member.expiryDate || ""}</td>

<td>

<span class="${statusClass(status)}">

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

// ===========================
// Load Members
// ===========================

async function loadMembers(){

    const snapshot=await getDocs(
        collection(db,"members")
    );

    allMembers=[];

    snapshot.forEach(doc=>{

        allMembers.push({

            id:doc.id,

            ...doc.data()

        });

    });

    displayMembers(allMembers);

}

// ===========================
// Search
// ===========================

window.searchMembers=function(){

    const text=document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    const result=allMembers.filter(member=>{

        return (

            (member.name||"")
            .toLowerCase()
            .includes(text)

            ||

            (member.phone||"")
            .toLowerCase()
            .includes(text)

        );

    });

    displayMembers(result);

}

// ===========================
// Start
// ===========================

document.addEventListener("DOMContentLoaded",()=>{

    loadMembers();

    document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        searchMembers
    );

});

// ===========================
// ADD MEMBER POPUP
// ===========================

const addModal = document.getElementById("addModal");
const addBtn = document.getElementById("addMemberBtn");
const addSaveBtn = document.getElementById("addSaveBtn");

if(addBtn){

    addBtn.addEventListener("click",()=>{

        addModal.style.display="flex";

    });

}

window.closeAddModal=function(){

    addModal.style.display="none";

}


// ===========================
// SAVE MEMBER
// ===========================

if(addSaveBtn){

addSaveBtn.addEventListener("click",saveMember);

}


async function saveMember(){

const name=document.getElementById("newName").value.trim();
const phone=document.getElementById("newPhone").value.trim();
const age=document.getElementById("newAge").value;
const plan=document.getElementById("newPlan").value;
const amount=document.getElementById("newAmount").value;
const paymentDate=document.getElementById("newPaymentDate").value;
const expiryDate=document.getElementById("newExpiryDate").value;

if(name=="" || phone==""){

alert("Name and Phone Required");

return;

}

const status=getStatus(expiryDate);

await addDoc(collection(db,"members"),{

name,
phone,
age,
plan,
amount,
paymentDate,
expiryDate,
status,
createdAt:Date.now()

});

alert("Member Added Successfully ✅");

closeAddModal();

document.getElementById("newName").value="";
document.getElementById("newPhone").value="";
document.getElementById("newAge").value="";
document.getElementById("newPlan").value="";
document.getElementById("newAmount").value="";
document.getElementById("newPaymentDate").value="";
document.getElementById("newExpiryDate").value="";

await loadMembers();

}
document.addEventListener("DOMContentLoaded", () => {

    const addBtn = document.getElementById("addMemberBtn");
    const addModal = document.getElementById("addModal");

    console.log(addBtn);
    console.log(addModal);

    if(addBtn && addModal){

        addBtn.addEventListener("click", () => {

            addModal.style.display = "flex";

        });

    }

});

// ===========================
// PART 2
// ADD MEMBER
// ===========================

// Popup Elements
const addModal = document.getElementById("addModal");
const addBtn = document.getElementById("addMemberBtn");
const addSaveBtn = document.getElementById("addSaveBtn");

// Open Popup
if (addBtn) {
    addBtn.addEventListener("click", () => {
        addModal.style.display = "flex";
    });
}

// Close Popup
window.closeAddModal = function () {
    addModal.style.display = "none";
};

// Save Member
async function saveMember() {

    const name = document.getElementById("newName").value.trim();
    const phone = document.getElementById("newPhone").value.trim();
    const age = document.getElementById("newAge").value;
    const plan = document.getElementById("newPlan").value;
    const amount = document.getElementById("newAmount").value;
    const paymentDate = document.getElementById("newPaymentDate").value;
    const expiryDate = document.getElementById("newExpiryDate").value;

    if (!name || !phone) {
        alert("Please enter Name and Phone Number");
        return;
    }

    const status = getStatus(expiryDate);

    try {

        await addDoc(collection(db, "members"), {
            name,
            phone,
            age,
            plan,
            amount,
            paymentDate,
            expiryDate,
            status,
            createdAt: Date.now()
        });

        alert("Member Added Successfully ✅");

        addModal.style.display = "none";

        document.getElementById("newName").value = "";
        document.getElementById("newPhone").value = "";
        document.getElementById("newAge").value = "";
        document.getElementById("newPlan").value = "";
        document.getElementById("newAmount").value = "";
        document.getElementById("newPaymentDate").value = "";
        document.getElementById("newExpiryDate").value = "";

        await loadMembers();

    } catch (err) {

        console.error(err);
        alert("Error adding member");

    }

}

// Save Button
if (addSaveBtn) {
    addSaveBtn.addEventListener("click", saveMember);
}

// ===========================
// PART 3
// EDIT + DELETE
// ===========================

// Open Edit Popup
window.editMember = function(id){

    const member = allMembers.find(m => m.id === id);

    if(!member) return;

    document.getElementById("editModal").style.display = "flex";

    document.getElementById("editPlan").value = member.plan || "";
    document.getElementById("editAmount").value = member.amount || "";
    document.getElementById("editStatus").value = member.status || "Pending";

    document.getElementById("editModal").dataset.id = id;

}


// Close Edit Popup
window.closeModal = function(){

    document.getElementById("editModal").style.display = "none";

}


// Update Member
window.updateMember = async function(){

    const id = document.getElementById("editModal").dataset.id;

    try{

        await updateDoc(doc(db,"members",id),{

            plan:document.getElementById("editPlan").value,
            amount:document.getElementById("editAmount").value,
            status:document.getElementById("editStatus").value

        });

        alert("Member Updated ✅");

        closeModal();

        await loadMembers();

    }catch(err){

        console.error(err);

        alert("Update Failed");

    }

}



// Delete Member
window.deleteMember = async function(id){

    if(!confirm("Delete this member?")) return;

    try{

        await deleteDoc(doc(db,"members",id));

        alert("Member Deleted ✅");

        await loadMembers();

    }catch(err){

        console.error(err);

        alert("Delete Failed");

    }

}