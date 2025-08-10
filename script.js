// Firebase imports via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBgehM22uCpXI5NDqd1vfvMMWnN4GZfOWY",
  authDomain: "las-tracking.firebaseapp.com",
  projectId: "las-tracking",
  storageBucket: "las-tracking.firebasestorage.app",
  messagingSenderId: "715146359357",
  appId: "1:715146359357:web:63346d7abf61c5444a3054"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle Register
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert("Registration successful: " + userCredential.user.email);
  } catch (error) {
    alert("Registration failed: " + error.message);
  }
});

// Handle Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful: " + userCredential.user.email);
    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});
