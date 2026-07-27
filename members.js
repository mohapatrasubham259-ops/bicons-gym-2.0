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
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const table = document.getElementById("membersTable");
const searchInput = document.getElementById("searchInput");

let allMembers = [];


// Load Members
async function loadMembers(){

    try{

        table.innerHTML = `
        <tr>
        <td colspan="10">Loading...</td>
        </tr>
        `;


        const snapshot = await getDocs(collection(db, "members"));
        console.log("Documents:", snapshot.size);

        console.log("Members Count:", snapshot.size);
        console.log(snapshot.docs.map(doc => doc.data()));


        allMembers=[];


        snapshot.forEach((docSnap)=>{

            allMembers.push({
                id:docSnap.id,
                ...docSnap.data()
            });

        });


        displayMembers(allMembers);


    }catch(error){

        console.log(error);

        table.innerHTML=`
        <tr>
        <td colspan="10">
        Error loading data
        </td>
        </tr>
        `;

    }

}



// Display Members
function displayMembers(data){

    table.innerHTML="";


    if(data.length===0){

        table.innerHTML=`
        <tr>
        <td colspan="10">
        No Members Found
        </td>
        </tr>
        `;

        return;
    }


    data.forEach(member=>{


        let row=document.createElement("tr");


        row.innerHTML=`

        <td>${member.regNo || ""}</td>

        <td>${member.name || ""}</td>

        <td>${member.phone || ""}</td>

        <td>${member.age || ""}</td>

        <td>${member.plan || ""}</td>

        <td>₹${member.amount || ""}</td>

        <td>${member.paymentDate || ""}</td>

        <td>${member.expiryDate || ""}</td>

        <td>${member.status || ""}</td>


        <td>
        <button onclick="editMember('${member.id}')">
        Edit
        </button>
        </td>

        `;


        table.appendChild(row);

    });


}



// Search

searchInput.addEventListener("input",()=>{


    let value=searchInput.value.toLowerCase();


    let filtered=allMembers.filter(member=>{


        return (

        String(member.name).toLowerCase().includes(value)

        ||

        String(member.phone).includes(value)

        );


    });

    console.log("All Members:", allMembers);

    displayMembers(filtered);


});



// Edit Function

window.editMember = async function(id){


    let newStatus = prompt(
        "Enter new status (Active/Expired)"
    );


    if(newStatus){


        try{

            await updateDoc(
                doc(db,"members",id),
                {
                    status:newStatus
                }
            );


            alert("Updated Successfully");


            loadMembers();


        }catch(error){

            alert(error.message);

        }

    }

}




loadMembers();