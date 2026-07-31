// members.js - PART 1
// Firebase + Load Members + Display Table

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
  appId: "1:64202444264:web:9e3c1c1519431cdbb5a85d",
  measurementId: "G-HY45R5RJQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Store members
let allMembers = [];


// Load Members
async function loadMembers(){

    try{

        const snapshot = await getDocs(
            collection(db,"members")
        );


        allMembers = [];


        snapshot.forEach((doc)=>{

            allMembers.push({

                id: doc.id,
                ...doc.data()

            });

        });


        console.log(
            "Members Loaded:",
            allMembers
        );


        displayMembers(allMembers);


    }catch(error){

        console.error(
            "Load Error:",
            error
        );

    }

}



// Display Members

function displayMembers(data){


    const tableBody =
    document.getElementById("memberTableBody");


    if(!tableBody){
        console.log(
            "Table body not found"
        );
        return;
    }



    tableBody.innerHTML = "";



    data.forEach((member,index)=>{


        let row = `

        <tr>

        <td>${index+1}</td>

        <td>${member.name || "-"}</td>

        <td>${member.phone || "-"}</td>

        <td>${member.age || "-"}</td>

        <td>${member.plan || "-"}</td>

        <td>${member.amount || "-"}</td>

        <td>${member.paymentDate || "-"}</td>

        <td>${member.expiryDate || "-"}</td>

       <td class="${getStatusClass(member.expiryDate)}">
${getAutoStatus(member.expiryDate)}
</td> 

        <td>
            

<button 
onclick="editMember('${member.id}')">
Edit
</button>


<button 
onclick="deleteMember('${member.id}')"
style="background:red;color:white;margin-left:5px;">
Delete
</button>


        </td>


        </tr>

        `;


        tableBody.innerHTML += row;


    });


}



// Start

loadMembers();
// ===============================
// PART 2
// Search + Serial No.
// ===============================


// Search Function

function searchMembers(){


    const searchBox =
    document.getElementById("searchInput");


    if(!searchBox){
        return;
    }


    const value =
    searchBox.value.toLowerCase();



    const filtered =
    allMembers.filter((member)=>{


        return (

            (member.name || "")
            .toLowerCase()
            .includes(value)

            ||

            (member.phone || "")
            .toLowerCase()
            .includes(value)

        );


    });



    displayMembers(filtered);


}



// Search Button

const searchBtn =
document.getElementById("searchBtn");


if(searchBtn){

    searchBtn.addEventListener(
        "click",
        searchMembers
    );

}



// Enter press search

const searchInput =
document.getElementById("searchInput");


if(searchInput){

    searchInput.addEventListener(
        "keyup",
        function(e){

            if(e.key === "Enter"){
                searchMembers();
            }

        }
    );

}

// ===============================
// EDIT MEMBER
// ===============================


window.editMember = function(id){


    const member =
    allMembers.find(
        item => item.id === id
    );


    if(!member) return;


    document.getElementById("editModal")
    .style.display="block";


    document.getElementById("editPlan").value =
    member.plan || "Monthly";


    document.getElementById("editAmount").value =
    member.amount || "";


    document.getElementById("editStatus").value =
    member.status || "Pending";


    // save id
    document.getElementById("editModal")
    .setAttribute("data-id",id);


}




// ===============================
// UPDATE MEMBER
// ===============================


window.updateMember = async function(){


    const id =
    document.getElementById("editModal")
    .getAttribute("data-id");


    await updateDoc(
        doc(db,"members",id),
        {

            plan:
            document.getElementById("editPlan").value,


            amount:
            document.getElementById("editAmount").value,


            status:
            document.getElementById("editStatus").value

        }
    );


    alert("Member Updated ✅");


    document.getElementById("editModal")
    .style.display="none";


    loadMembers();


}


// Delete Member

window.deleteMember = async function(id){


    if(confirm("Delete this member?")){


        await deleteDoc(
            doc(db,"members",id)
        );


        location.reload();

    }

}



// Auto Status Check

function checkStatus(expiryDate){


    if(!expiryDate)
    return "Pending";


    let today =
    new Date();


    let expiry =
    new Date(expiryDate);



    if(expiry < today){

        return "Pending";

    }
    else{

        return "Paid";

    }


}
// ===============================
// AUTO STATUS
// ===============================


function getAutoStatus(expiryDate){


    if(!expiryDate){
        return "Pending";
    }


    const today = new Date();

    const expiry = new Date(expiryDate);


    if(expiry >= today){

        return "Paid";

    }
    else{

        return "Pending";

    }

}




function getStatusClass(expiryDate){


    if(getAutoStatus(expiryDate) === "Paid"){

        return "paid";

    }
    else{

        return "pending";

    }

}
window.addEventListener("DOMContentLoaded", () => {
    loadMembers();
});
// ===============================
// CLOSE POPUP FUNCTIONS
// ===============================

window.closeModal = function(){

    document.getElementById("editModal")
    .style.display = "none";

}



window.closeAddModal = function(){

    document.getElementById("addModal")
    .style.display = "none";

}

// ===============================
// DELETE MEMBER
// ===============================

window.deleteMember = async function(id){

    if(confirm("Delete this member?")){


        await deleteDoc(
            doc(db,"members",id)
        );


        alert("Member Deleted ✅");


        loadMembers();

    }

}

// ===============================
// OPEN ADD MEMBER POPUP
// ===============================

const addBtn = document.getElementById("addMemberBtn");

if(addBtn){

    addBtn.onclick = function(){

        document.getElementById("addModal")
        .style.display = "flex";

    }

}

// OPEN ADD MEMBER POPUP

document.addEventListener("DOMContentLoaded",()=>{

    const addBtn = document.getElementById("addMemberBtn");
    const addModal = document.getElementById("addModal");


    if(addBtn && addModal){

        addBtn.addEventListener("click",()=>{

            addModal.style.display = "flex";

        });

    }

});


// CLOSE ADD POPUP

window.closeAddModal = function(){

    document.getElementById("addModal")
    .style.display="none";

}