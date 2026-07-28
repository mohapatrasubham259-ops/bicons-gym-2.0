// ===============================
// BICON GYM - MEMBERS JS
// PART 1: FIREBASE SETUP
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


// Firebase Config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// Global Variables
let allMembers = [];

let editId = null;


// Collection Name
const membersCollection = collection(db, "members");

console.log("Firebase Connected");

// ===============================
// PART 2: LOAD MEMBERS
// ===============================

async function loadMembers() {

    try {

        const snapshot = await getDocs(membersCollection);

        allMembers = [];

        snapshot.forEach((item) => {

            allMembers.push({
                id: item.id,
                ...item.data()
            });

        });


        console.log("Members Loaded:", allMembers);


        displayMembers(allMembers);


    } catch (error) {

        console.error("Load Members Error:", error);

    }

}



// Page Load
window.addEventListener("DOMContentLoaded", () => {

    loadMembers();

});

// ===============================
// PART 3: DISPLAY MEMBERS + SEARCH
// ===============================


function displayMembers(data) {


    const tableBody = document.getElementById("membersTable");


    if (!tableBody) {

        console.error("membersTable not found");

        return;

    }


    tableBody.innerHTML = "";


    data.forEach((member) => {


        let status = member.status || "Pending";


        // Auto Status Check
        if(member.expiryDate){

            let today = new Date();
            let expiry = new Date(member.expiryDate);


            if(expiry < today){

                status = "Pending";

            }

        }



        let statusClass = 
        status.toLowerCase() === "paid"
        ? "paid"
        : "pending";



        tableBody.innerHTML += `

        <tr>

            <td>${member.registrationNo || member.regNo || "-"}</td>

            <td>${member.name || "-"}</td>

            <td>${member.phone || "-"}</td>

            <td>${member.age || "-"}</td>

            <td>${member.plan || "-"}</td>

            <td>₹${member.amount || 0}</td>

            <td>${member.paymentDate || "-"}</td>

            <td>${member.expiryDate || "-"}</td>


            <td>
                <span class="${statusClass}">
                    ${status}
                </span>
            </td>


            <td>

                <button onclick="editMember('${member.id}')">
                    Edit
                </button>


                <button onclick="deleteMember('${member.id}')">
                    Delete
                </button>

            </td>


        </tr>

        `;


    });


}



// Search Function

const searchBox = document.getElementById("searchInput");


if(searchBox){

    searchBox.addEventListener("input",()=>{


        let value = searchBox.value.toLowerCase();


        let filtered = allMembers.filter((member)=>{


            return (

                member.name?.toLowerCase().includes(value)

                ||

                member.phone?.includes(value)

            );


        });


        displayMembers(filtered);


    });

}

// ===============================
// PART 4: ADD MEMBER
// ===============================


window.saveMember = async function(){


    try{


        const memberData = {


            registrationNo:
            document.getElementById("registrationNo")?.value || "",


            name:
            document.getElementById("name")?.value || "",


            phone:
            document.getElementById("phone")?.value || "",


            age:
            document.getElementById("age")?.value || "",


            plan:
            document.getElementById("plan")?.value || "",


            amount:
            document.getElementById("amount")?.value || "",


            paymentDate:
            document.getElementById("paymentDate")?.value || "",


            expiryDate:
            document.getElementById("expiryDate")?.value || "",


            status:
            document.getElementById("status")?.value || "Pending",


            createdAt:
            new Date()

        };



        await addDoc(
            membersCollection,
            memberData
        );



        alert("Member Added Successfully ✅");



        loadMembers();



        // Close Popup (if exists)

        if(document.getElementById("addMemberPopup")){

            document.getElementById("addMemberPopup").style.display="none";

        }



    }catch(error){


        console.error(
            "Add Member Error:",
            error
        );


        alert("Member Add Failed");


    }


};

// ===============================
// PART 5: EDIT MEMBER
// ===============================


window.editMember = function(id){


    const member = allMembers.find(
        item => item.id === id
    );


    if(!member){

        alert("Member not found");

        return;

    }



    editId = id;



    // Fill Form Data

    if(document.getElementById("registrationNo"))
    document.getElementById("registrationNo").value =
    member.registrationNo || member.regNo || "";


    if(document.getElementById("name"))
    document.getElementById("name").value =
    member.name || "";


    if(document.getElementById("phone"))
    document.getElementById("phone").value =
    member.phone || "";


    if(document.getElementById("age"))
    document.getElementById("age").value =
    member.age || "";


    if(document.getElementById("plan"))
    document.getElementById("plan").value =
    member.plan || "";


    if(document.getElementById("amount"))
    document.getElementById("amount").value =
    member.amount || "";


    if(document.getElementById("paymentDate"))
    document.getElementById("paymentDate").value =
    member.paymentDate || "";


    if(document.getElementById("expiryDate"))
    document.getElementById("expiryDate").value =
    member.expiryDate || "";


    if(document.getElementById("status"))
    document.getElementById("status").value =
    member.status || "Pending";



    // Open Popup

    if(document.getElementById("addMemberPopup")){

        document.getElementById("addMemberPopup").style.display="block";

    }



};





// Update Existing Member

window.updateMember = async function(){


    if(!editId){

        alert("Select member first");

        return;

    }



    try{


        const updateData = {


            registrationNo:
            document.getElementById("registrationNo").value,


            name:
            document.getElementById("name").value,


            phone:
            document.getElementById("phone").value,


            age:
            document.getElementById("age").value,


            plan:
            document.getElementById("plan").value,


            amount:
            document.getElementById("amount").value,


            paymentDate:
            document.getElementById("paymentDate").value,


            expiryDate:
            document.getElementById("expiryDate").value,


            status:
            document.getElementById("status").value

        };



        await updateDoc(

            doc(db,"members",editId),

            updateData

        );



        alert("Member Updated ✅");



        editId = null;


        loadMembers();



    }
    catch(error){


        console.error(
            "Update Error:",
            error
        );


        alert("Update Failed");


    }


};

// ===============================
// PART 6: DELETE MEMBER
// ===============================


window.deleteMember = async function(id){


    let confirmDelete = confirm(
        "Are you sure you want to delete this member?"
    );


    if(!confirmDelete){

        return;

    }



    try{


        await deleteDoc(
            doc(db,"members",id)
        );



        alert("Member Deleted ✅");



        loadMembers();



    }
    catch(error){


        console.error(
            "Delete Error:",
            error
        );


        alert("Delete Failed");


    }


};

// ===============================
// PART 7: AUTO STATUS CHECK
// ===============================


function checkAutoStatus(){


    let today = new Date();



    allMembers.forEach(async (member)=>{


        if(member.expiryDate && member.status === "Paid"){


            let expiry = new Date(member.expiryDate);



            if(expiry < today){


                await updateDoc(

                    doc(db,"members",member.id),

                    {
                        status:"Pending"
                    }

                );


            }


        }


    });


}



// Run Status Check

setTimeout(()=>{

    checkAutoStatus();

},2000);



// ===============================
// STATUS COLOR CSS SUPPORT
// ===============================


const style = document.createElement("style");

style.innerHTML = `


.paid{

    background:#00c853;

    color:white;

    padding:5px 10px;

    border-radius:15px;

}


.pending{

    background:#ff5252;

    color:white;

    padding:5px 10px;

    border-radius:15px;

}


`;

document.head.appendChild(style);