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

const data = await getDocs(collection(db,"members"));

data.forEach((doc)=>{

let m = doc.data();

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

}


loadMembers();