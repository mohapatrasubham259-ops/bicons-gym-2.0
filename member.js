import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


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


const table = document.getElementById("membersTable");


async function loadMembers(){

try{

const data = await getDocs(collection(db,"members"));

console.log("Total Members:", data.size);


if(data.empty){
    table.innerHTML = `
    <tr>
    <td colspan="6">No Members Found</td>
    </tr>`;
    return;
}


data.forEach((doc)=>{

let m = doc.data();

console.log(m);


table.innerHTML += `
<tr>
<td>${m.name}</td>
<td>${m.phone}</td>
<td>${m.age}</td>
<td>${m.plan}</td>
<td>₹${m.amount}</td>
<td>${m.status}</td>
</tr>
`;

});


}catch(error){

console.log("Firebase Error:", error);

table.innerHTML = `
<tr>
<td colspan="6">Error Loading Data</td>
</tr>`;

}

}


loadMembers();