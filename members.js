import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
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

function openModal(member) {

  selectedMemberId = member.id;

  document.getElementById("editPlan").value = member.plan || "";
  document.getElementById("editStatus").value = member.status || "Active";

  document.getElementById("editModal").style.display = "flex";
}

window.closeModal = function () {
  document.getElementById("editModal").style.display = "none";
}

// Load Members
async function loadMembers() {
 function openModal(member) {

  selectedMemberId = member.id;

  document.getElementById("editPlan").value = member.plan || "";
  document.getElementById("editStatus").value = member.status || "Active";

  document.getElementById("editModal").style.display = "flex";
}

window.closeModal = function () {
  document.getElementById("editModal").style.display = "none";
}

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
function displayMembers(members) {

  membersTable.innerHTML = "";

  if (members.length === 0) {
    membersTable.innerHTML = `
      <tr>
        <td colspan="10">No Members Found</td>
      </tr>`;
    return;
  }

  members.forEach((member) => {

    const row = document.createElement("tr");

    row.innerHTML = `
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
        <button onclick="openModalById('${member.id}')">Edit</button>
      </td>
    `;

    membersTable.appendChild(row);
  });
}

// Search
searchInput.addEventListener("input", () => {

  const value = searchInput.value.toLowerCase();

  const filtered = allMembers.filter(member =>
    (member.name || "").toLowerCase().includes(value) ||
    (member.phone || "").includes(value)
  );

  displayMembers(filtered);

});



// Edit Member

document.addEventListener("click",(e)=>{


 if(e.target.classList.contains("editBtn")){


   const id = e.target.dataset.id;


   editMember(id);


 }


});




  if(!newPlan) return;

  try{

    await updateDoc(doc(db,"members",id), {
      plan: newPlan
    });

    alert("Updated Successfully");

    loadMembers();

  }catch(error){

    console.log(error);
    alert("Update Failed");

  }

}



// Start
window.openModalById = function(id){

    const member = allMembers.find(m => m.id === id);

    if(member){
        openModal(member);
    }

}

document.getElementById("saveBtn").addEventListener("click", async () => {

    const newPlan = document.getElementById("editPlan").value;

    const newStatus = document.getElementById("editStatus").value;

    try{

        await updateDoc(doc(db,"members",selectedMemberId),{

            plan:newPlan,
            status:newStatus

        });

        alert("Member Updated");

        closeModal();

        loadMembers();

    }catch(error){

        console.error(error);

        alert("Update Failed");

    }

});
loadMembers();