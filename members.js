import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc
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


// Load Members
async function loadMembers(){

    try{

        const snapshot = await getDocs(
            collection(db,"members")
        );


        allMembers = [];


        snapshot.forEach((item)=>{

            allMembers.push({

                id:item.id,
                ...item.data()

            });

        });


        displayMembers(allMembers);


    }catch(error){

        console.log(error);

        membersTable.innerHTML =
        `
        <tr>
        <td colspan="10">
        Data Load Failed
        </td>
        </tr>
        `;

    }

}



// Display Table
function displayMembers(data){


    membersTable.innerHTML="";


    if(data.length === 0){

        membersTable.innerHTML=
        `
        <tr>
        <td colspan="10">
        No Members Found
        </td>
        </tr>
        `;

        return;

    }



    data.forEach((member)=>{


        let row=document.createElement("tr");


        row.innerHTML=
        `
        <td>${member.regNo || ""}</td>
        <td>${member.name || ""}</td>
        <td>${member.phone || ""}</td>
        <td>${member.age || ""}</td>
        <td>${member.plan || ""}</td>
        <td>₹${member.amount || ""}</td>
        <td>${member.paymentDate || ""}</td>
        <td>${member.expiryDate || ""}</td>
        <td class="${
    member.status === "Paid"
        ? "status-paid"
        : member.status === "Pending"
        ? "status-pending"
        : ""
}">
    ${member.status || ""}
</td>

        <td>
        <button onclick="openEdit('${member.id}')">
        Edit
        </button>
        </td>

        `;


        membersTable.appendChild(row);


    });


}



// Open Popup

window.openEdit=function(id){


    let member =
    allMembers.find(
        m=>m.id===id
    );


    if(member){

        selectedMemberId=id;


        document.getElementById("editPlan").value =
        member.plan || "";


        document.getElementById("editStatus").value =
        member.status || "Active";
       
        document.getElementById("editAmount").value =
         member.amount || "";

        document.getElementById("editModal").style.display="flex";

    }

}



// Close Popup

window.closeModal=function(){

    document.getElementById("editModal").style.display="none";

}




// Save Update

document.getElementById("saveBtn")
.addEventListener("click",async()=>{


    let plan =
    document.getElementById("editPlan").value;


    let status =
    document.getElementById("editStatus").value;
    
    let amount =
    document.getElementById("editAmount").value;

    console.log("New Amount:", amount);


    try{


        await updateDoc(
            doc(db,"members",selectedMemberId),
            {
          plan:plan,
          status:status,
          amount:Number(amount)
            }
        );


        alert("Member Updated");


        closeModal();


        loadMembers();



    }catch(error){


        console.log(error);

        alert("Update Failed");


    }


});




// Search

searchInput.addEventListener("input",()=>{


    let value =
    searchInput.value.toLowerCase();



    let result =
    allMembers.filter(member=>

        (member.name || "")
        .toLowerCase()
        .includes(value)

        ||

        (member.phone || "")
        .includes(value)

    );


    displayMembers(result);


});



// Start

loadMembers();