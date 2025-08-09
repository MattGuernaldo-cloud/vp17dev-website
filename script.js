// Firebase imports
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";


import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAP41MMOtk6MyQ4ZS0CqJYP0W9ZJn_l0FY",
  authDomain: "cmdiesearch.firebaseapp.com",
  projectId: "cmdiesearch",
  storageBucket: "cmdiesearch.appspot.com",
  messagingSenderId: "911853594551",
  appId: "1:911853594551:web:f05695ef898ee13c786a32",
  measurementId: "G-SG7E1CJPTS"
};

// Init Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const subjects = [
  "Research in Daily Life 2:",
  "Introduction to the Philosophy of Human Person:",
  "Physical Science:",
  "English for Academic and Professional Purposes:",
  "Filipino sa Piling Larangan:",
  "JAVA IV Object-Oriented Programming:",
  "Oracle II Database II:",
  "21st Century Literature from the Philippines and the World:"
];

// ===== Helper Functions =====
function generateEmptyLAS() {
  return subjects.map(() => Array(10).fill(false));
}

// 🔥 FIREBASE CHANGES: Save all accounts to Firestore
async function saveAccountsToFirestore() {
  for (let acc of accounts) {
    const docRef = doc(db, "accounts", acc.id);
    await setDoc(docRef, acc); // overwrites or creates
  }
}

// 🔥 FIREBASE CHANGES: Save a single account to Firestore
async function saveAccountToFirestore(account) {
  const docRef = doc(db, "accounts", account.id);
  await setDoc(docRef, account);
}

// 🔥 FIREBASE CHANGES: Load accounts from Firestore
async function loadAccountsFromFirestore() {
  const querySnapshot = await getDocs(collection(db, "accounts"));
  accounts = querySnapshot.docs.map(doc => doc.data());
}

function logout() {
  location.reload();
}

// ===== Default Accounts =====
const defaultAccounts = [
  {
    id: "01-S2425-1977",
    password: "1234",
    role: "student",
    name: "Matt Simon Guernaldo",
    section: "Indonesia",
    lasStatus: generateEmptyLAS()
  },
  {
    id: "01-S2425-1978",
    password: "1234",
    role: "student",
    name: "John Edsel De Lima",
    section: "Indonesia",
    lasStatus: generateEmptyLAS()
  },
  {
    id: "01-S2425-1979",
    password: "1234",
    role: "student",
    name: "Princess Juliane Bedania",
    section: "Indonesia",
    lasStatus: generateEmptyLAS()
  },
  {
    id: "T-001",
    password: "admin",
    role: "teacher",
    name: "Teacher Admin"
  }
];

// ===== Load Accounts =====
let accounts = [];

(async function initialize() {
  await loadAccountsFromFirestore();

  // If no accounts found in Firestore, populate with default and save
  if (accounts.length === 0) {
    accounts = defaultAccounts;
    await saveAccountsToFirestore();
  }

  // Now that accounts are loaded, setup event listeners:
  setupLogin();
  setupCreateAccount();
})();

// ===== Login Event =====
function setupLogin() {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let id = document.getElementById("userID").value.trim();
    let pass = document.getElementById("password").value.trim();
    let user = accounts.find(acc => acc.id === id && acc.password === pass);

    if (user) {
      user.role === "student" ? showStudentView(user) : showTeacherView(user);
    } else {
      alert("Invalid ID or Password");
    }
  });
}

// ===== Create Account =====
function setupCreateAccount() {
  document.getElementById("createAccountBtn").addEventListener("click", function () {
    // Step 1: Render the Create Account form
    document.body.innerHTML = `
      <div class="create-account-container">
        <h2>Create New Account</h2>
        <label>Full Name</label>
        <input type="text" id="newName" placeholder="Enter full name" required>
        <label>ID</label>
        <input type="text" id="newID" placeholder="Enter ID" required>
        <label>Password</label>
        <input type="password" id="newPass" placeholder="Enter password" required>
        <label>Role</label>
        <select id="newRole" required>
          <option value="">-- Select Role --</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <div id="sectionField" style="display:none;">
          <label>Section</label>
          <select id="newSection">
            <option value="Indonesia">Indonesia</option>
            <option value="Myanmar">Myanmar</option>
            <option value="Cambodia">Cambodia</option>
          </select>
        </div>
        <button class="save-btn" id="saveAccountBtn">Save Account</button>
        <button class="cancel-btn" onclick="location.reload()">Cancel</button>
      </div>
    `;

    // Step 2: Show/Hide Section dropdown depending on Role selected
    document.getElementById("newRole").addEventListener("change", function () {
      document.getElementById("sectionField").style.display = this.value === "student" ? "block" : "none";
    });

    // Step 3: When clicking 'Save Account' button
    document.getElementById("saveAccountBtn").addEventListener("click", async function () {
      // Step 3.1: Get form values
      let name = document.getElementById("newName").value.trim();
      let id = document.getElementById("newID").value.trim();
      let pass = document.getElementById("newPass").value.trim();
      let role = document.getElementById("newRole").value;
      let section = role === "student" ? document.getElementById("newSection").value : "";

      // Step 3.2: Validate all required fields are filled
      if (name && id && pass && role) {
        // Step 3.3: Create new account object
        let newAccount = { id, password: pass, role, name };

        // Step 3.4: If student, add section and initialize LAS status
        if (role === "student") {
          newAccount.section = section;
          newAccount.lasStatus = generateEmptyLAS();
        }

        // 🔥 FIREBASE CHANGES: Add new account to array and Firestore
        accounts.push(newAccount);
        await saveAccountToFirestore(newAccount);

        // Step 3.5: Show success alert
        alert("Account created successfully!");

        // Step 3.6: Reload page (or redirect as needed)
        location.reload();
      } else {
        // Step 3.7: If validation failed, alert user
        alert("Please fill in all fields.");
      }
    });
  });
}

// ===== Student View =====
function showStudentView(user) {
  let subjectHTML = subjects.map((subject, subjIndex) => {
    let checkboxes = user.lasStatus[subjIndex]
      .map((done, lasIndex) => `
        <label style="margin: 0 8px 5px 0;">
          <input type="checkbox" class="student-checkbox" ${done ? "checked" : ""} onclick="return false;">
          LAS ${lasIndex + 1}
        </label>
      `).join("");
    return `
      <div class="subject-card">
        <h3>${subject}</h3>
        <div>${checkboxes}</div>
      </div>
    `;
  }).join("");

  document.body.innerHTML = `
    <button class="logout-btn" onclick="logout()">Logout</button>
    <div class="student-container">
      <h2>Good day, ${user.name} this is your missed LAS.</h2>
      <p></p>
      <div class="missed-las">${subjectHTML}</div>
    </div>
  `;
}

// ===== Teacher View =====
function showTeacherView(user) {
  const sections = ["Indonesia", "Myanmar", "Cambodia"];

  document.body.innerHTML = `
    <button class="logout-btn" onclick="logout()">Logout</button>
    <div class="teacher-container">
      <h2>Welcome, ${user.name}</h2>
      <p>Select a section and student to update LAS:</p>
      <select id="sectionSelect">
        <option value="">-- Select Section --</option>
        ${sections.map(sec => `<option value="${sec}">${sec}</option>`).join("")}
      </select>
      <select id="studentSelect" disabled>
        <option value="">-- Select Student --</option>
      </select>
      <div id="lasForm"></div>
      <button id="saveBtn" style="display:none;">Save</button>
    </div>
  `;

  const sectionSelect = document.getElementById("sectionSelect");
  const studentSelect = document.getElementById("studentSelect");
  const lasForm = document.getElementById("lasForm");
  const saveBtn = document.getElementById("saveBtn");

  sectionSelect.addEventListener("change", () => {
    let sectionValue = sectionSelect.value;
    if (!sectionValue) {
      studentSelect.disabled = true;
      lasForm.innerHTML = "";
      saveBtn.style.display = "none";
      return;
    }

    let studentsInSection = accounts.filter(a => a.role === "student" && a.section === sectionValue);
    studentSelect.innerHTML = `<option value="">-- Select Student --</option>` +
      studentsInSection.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
    studentSelect.disabled = false;
    lasForm.innerHTML = "";
    saveBtn.style.display = "none";
  });

  studentSelect.addEventListener("change", () => {
    let selectedStudent = accounts.find(s => s.id === studentSelect.value);
    if (!selectedStudent) {
      lasForm.innerHTML = "";
      saveBtn.style.display = "none";
      return;
    }

    lasForm.innerHTML = subjects.map((subject, subjIndex) => `
      <div class="teacher-subject">
        <h3>${subject}</h3>
        ${[...Array(10)].map((_, lasIndex) => `
          <label style="margin: 0 8px 5px 0;">
            <input type="checkbox"
              ${selectedStudent.lasStatus[subjIndex][lasIndex] ? "checked" : ""}
              data-subj="${subjIndex}" data-las="${lasIndex}">
            LAS ${lasIndex + 1}
          </label>
        `).join("")}
      </div>
    `).join("");

    saveBtn.style.display = "inline-block";

    saveBtn.onclick = async () => {
      let checkboxes = lasForm.querySelectorAll("input[type='checkbox']");
      checkboxes.forEach(cb => {
        let subj = cb.getAttribute("data-subj");
        let las = cb.getAttribute("data-las");
        selectedStudent.lasStatus[subj][las] = cb.checked;
      });

      // 🔥 FIREBASE CHANGES: Save updated student to Firestore
      await saveAccountToFirestore(selectedStudent);

      alert("LAS status updated!");
    };
  });
}
