// members.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy
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

console.log("Project ID:", firebaseConfig.projectId);


// HTML elements
const membersTable = document.getElementById("membersTable");
const searchBox = document.getElementById("searchBox");

let allMembers = [];


// Load Members
async function loadMembers() {

  try {

    const q = query(
      collection(db, "members"),
      orderBy("name")
    );

    const snapshot = await getDocs(q);

    allMembers = [];

    snapshot.forEach((doc) => {

      allMembers.push({
        id: doc.id,
        ...doc.data()
      });

    });


    displayMembers(allMembers);


  } catch(error){

    console.log("Load Error:", error);

    membersTable.innerHTML =
    `<tr>
      <td colspan="6">
      Error loading members
      </td>
    </tr>`;

  }

}


// Display Members
function displayMembers(members){

  membersTable.innerHTML = "";


  members.forEach((member)=>{


    const row = document.createElement("tr");


    row.innerHTML = `

      <td>${member.name || ""}</td>

      <td>${member.phone || ""}</td>

      <td>${member.plan || ""}</td>

      <td>${member.amount || ""}</td>

      <td>${member.joinDate || ""}</td>


      <td>
        <button class="editBtn" data-id="${member.id}">
        Edit
        </button>
      </td>

    `;


    membersTable.appendChild(row);


  });


}


// Search
searchBox?.addEventListener("input",()=>{


  const value = searchBox.value.toLowerCase();


  const filtered = allMembers.filter((member)=>{


    return (

      member.name?.toLowerCase().includes(value) ||

      member.phone?.includes(value)

    );


  });


  displayMembers(filtered);


});




// Edit Member

document.addEventListener("click",(e)=>{


 if(e.target.classList.contains("editBtn")){


   const id = e.target.dataset.id;


   editMember(id);


 }


});



async function editMember(id){


 const newPlan = prompt(
 "Enter New Plan"
 );


 if(!newPlan) return;



 try{


  await updateDoc(
    doc(db,"members",id),
    {
      plan:newPlan
    }
  );


  alert("Updated Successfully");


  loadMembers();

const snapshot = await getDocs(collection(db, "members"));

console.log("Project:", firebaseConfig.projectId);
console.log("Count:", snapshot.size);


 }
 catch(error){

  console.log(error);

  alert("Update Failed");

 }


}




// Start

loadMembers();