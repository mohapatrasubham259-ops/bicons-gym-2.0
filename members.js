import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
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
  appId: "1:64202444264:web:9e3c1c1519431cdbb5a85d",
  measurementId: "G-HY45R5RJQ4"
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

        <td class="${member.status}">
  ${member.status || ""}
</td>


       <td>
    <button onclick="editMember('${member.id}')">Edit</button>

    <button onclick="renewMember('${member.id}')"
        style="background:#28a745;color:white;margin:5px;padding:6px 12px;border:none;border-radius:5px;cursor:pointer;">
        Renew
    </button>

    <button onclick="deleteMember('${member.id}')"
        style="background:#dc3545;color:white;margin:5px;padding:6px 12px;border:none;border-radius:5px;cursor:pointer;">
        Delete
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

window.deleteMember = async function(id) {

    if (!confirm("Delete this member?")) return;

    await deleteDoc(doc(db, "members", id));

    alert("Member deleted successfully!");

    loadMembers();
}
    }catch(error){

        alert(error.message);

    }

}

window.renewMember = async function(id) {

    const months = parseInt(prompt("Renew for how many months? (1, 3, 6, 12)"));

    if (!months || isNaN(months)) {
        alert("Invalid plan.");
        return;
    }

    const amount = prompt("Enter Amount");

    if (!amount) return;

    const today = new Date();

    const expiry = new Date(today);
    expiry.setMonth(expiry.getMonth() + months);

    const paymentDate = today.toISOString().split("T")[0];
    const expiryDate = expiry.toISOString().split("T")[0];

    let plan = months + " Month";
    if (months > 1) plan = months + " Months";

    try {

        await updateDoc(doc(db, "members", id), {
            plan: plan,
            amount: amount,
            paymentDate: paymentDate,
            expiryDate: expiryDate,
            status: "Paid"
        });

        alert("Membership Renewed Successfully");

        loadMembers();

    } catch (error) {
        alert(error.message);
    }

}


loadMembers();