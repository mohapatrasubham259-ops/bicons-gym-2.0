// members.js

import { 
initializeApp 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";


import {
getFirestore,
collection,
getDocs,
addDoc,
doc,
updateDoc,
deleteDoc
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



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);



let allMembers = [];

let editId = null;



// LOAD MEMBERS

async function loadMembers(){

try{

const snap = await getDocs(collection(db,"members"));

allMembers=[];


snap.forEach((doc)=>{

allMembers.push({

id:doc.id,
...doc.data()

});


});


autoStatusUpdate();

displayMembers(allMembers);


}

catch(error){

console.log(error);

}


}





// DISPLAY TABLE

function displayMembers(data){


const table=document.getElementById("memberTable");


table.innerHTML="";


data.forEach((m,index)=>{


let status=m.status || "Pending";


let colorClass = status=="Paid" ? "paid":"pending";



table.innerHTML += `


<tr>

<td>${m.regNo || index+1}</td>

<td>${m.name || ""}</td>

<td>${m.phone || ""}</td>

<td>${m.age || ""}</td>

<td>${m.plan || ""}</td>

<td>₹${m.amount || ""}</td>

<td>${m.paymentDate || ""}</td>

<td>${m.expiryDate || ""}</td>


<td class="${colorClass}">
${status}
</td>


<td>

<button onclick="editMember('${m.id}')">
Edit
</button>


<button 
style="background:red"
onclick="deleteMember('${m.id}')">
Delete
</button>


</td>


</tr>


`;


});


}





// ADD / UPDATE MEMBER


window.saveMember = async function(){


let data={


name:document.getElementById("name").value,

phone:document.getElementById("phone").value,

age:document.getElementById("age").value,

plan:document.getElementById("plan").value,

amount:document.getElementById("amount").value,

paymentDate:document.getElementById("paymentDate").value,

expiryDate:document.getElementById("expiryDate").value,


status:"Paid"



};




if(editId){


await updateDoc(
doc(db,"members",editId),
data
);


editId=null;


}

else{


await addDoc(
collection(db,"members"),
data
);


}



closePopup();


loadMembers();


}





// OPEN ADD POPUP

window.openAdd=function(){


editId=null;


document.getElementById("formTitle").innerHTML="Add Member";


clearForm();


document.getElementById("popup").style.display="flex";


}





window.closePopup=function(){


document.getElementById("popup").style.display="none";


}





function clearForm(){


document.getElementById("name").value="";

document.getElementById("phone").value="";

document.getElementById("age").value="";

document.getElementById("amount").value="";

document.getElementById("paymentDate").value="";

document.getElementById("expiryDate").value="";


}





// EDIT MEMBER


window.editMember=function(id){


let m=allMembers.find(x=>x.id==id);


if(!m)return;



editId=id;


document.getElementById("formTitle").innerHTML="Edit Member";


document.getElementById("name").value=m.name || "";

document.getElementById("phone").value=m.phone || "";

document.getElementById("age").value=m.age || "";

document.getElementById("plan").value=m.plan || "1 Month";

document.getElementById("amount").value=m.amount || "";

document.getElementById("paymentDate").value=m.paymentDate || "";

document.getElementById("expiryDate").value=m.expiryDate || "";


document.getElementById("popup").style.display="flex";


}





// DELETE MEMBER


window.deleteMember=async function(id){


if(confirm("Delete this member?")){


await deleteDoc(
doc(db,"members",id)
);


loadMembers();


}


}





// SEARCH


window.searchMember=function(){


let text=document
.getElementById("searchBox")
.value
.toLowerCase();



let result=allMembers.filter(m=>


(m.name||"")
.toLowerCase()
.includes(text)


||

(m.phone||"")
.includes(text)



);



displayMembers(result);



}





// AUTO EXPIRY STATUS


async function autoStatusUpdate(){


let today=new Date();


for(let m of allMembers){


if(!m.expiryDate) continue;



let expiry=new Date(m.expiryDate);



let newStatus =
expiry >= today
?
"Paid"
:
"Pending";



if(m.status !== newStatus){


await updateDoc(

doc(db,"members",m.id),

{

status:newStatus

}

);


}


}



}





loadMembers();