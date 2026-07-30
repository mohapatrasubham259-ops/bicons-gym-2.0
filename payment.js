alert("Payment JS Loaded");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
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

// Get Member ID & Plan
const params = new URLSearchParams(window.location.search);
const memberId = params.get("id");
const plan = params.get("plan");

// Payment Success Button
document.getElementById("payBtn").addEventListener("click", async () => {

    const today = new Date();

    const paymentDate = today.toISOString().split("T")[0];

    const expiry = new Date(today);

    switch (plan) {

        case "Monthly":
            expiry.setMonth(expiry.getMonth() + 1);
            break;

        case "3 Months":
            expiry.setMonth(expiry.getMonth() + 3);
            break;

        case "6 Months":
            expiry.setMonth(expiry.getMonth() + 6);
            break;

        case "12 Months":
            expiry.setFullYear(expiry.getFullYear() + 1);
            break;
    }

    const expiryDate = expiry.toISOString().split("T")[0];

    try {

        await updateDoc(doc(db, "members", memberId), {
            status: "Paid",
            paymentDate: paymentDate,
            expiryDate: expiryDate
        });

        alert("✅ Payment Successful!");

        window.location.href = "index.html";

    } catch (error) {

        console.error(error);
        alert("Payment update failed!");

    }

});