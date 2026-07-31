// members.js - PART 1
// Firebase + Load Members + Display Table

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
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

        <td>${member.status || "Pending"}</td>

        <td>
            <button class="editBtn">
            Edit
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