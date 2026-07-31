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