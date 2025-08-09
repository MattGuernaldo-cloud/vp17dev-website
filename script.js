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

function saveAccounts() {
  localStorage.setItem("accounts", JSON.stringify(accounts));
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
let storedAccounts = JSON.parse(localStorage.getItem("accounts"));
let accounts;

if (!storedAccounts || !storedAccounts.some(a => ["Indonesia", "Myanmar", "Cambodia"].includes(a.section))) {
  accounts = defaultAccounts;
  saveAccounts();
} else {
  accounts = storedAccounts;
}

// ===== Login Event =====
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

// ===== Create Account =====
document.getElementById("createAccountBtn").addEventListener("click", function () {
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

  document.getElementById("newRole").addEventListener("change", function () {
    document.getElementById("sectionField").style.display = this.value === "student" ? "block" : "none";
  });

  document.getElementById("saveAccountBtn").addEventListener("click", function () {
    let name = document.getElementById("newName").value.trim();
    let id = document.getElementById("newID").value.trim();
    let pass = document.getElementById("newPass").value.trim();
    let role = document.getElementById("newRole").value;
    let section = role === "student" ? document.getElementById("newSection").value : "";

    if (name && id && pass && role) {
      let newAccount = { id, password: pass, role, name };
      if (role === "student") {
        newAccount.section = section;
        newAccount.lasStatus = generateEmptyLAS();
      }
      accounts.push(newAccount);
      saveAccounts();
      alert("Account created successfully!");
      location.reload();
    } else {
      alert("Please fill in all fields.");
    }
  });
});

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

    saveBtn.onclick = () => {
      let checkboxes = lasForm.querySelectorAll("input[type='checkbox']");
      checkboxes.forEach(cb => {
        let subj = cb.getAttribute("data-subj");
        let las = cb.getAttribute("data-las");
        selectedStudent.lasStatus[subj][las] = cb.checked;

                selectedStudent.lasStatus[subj][las] = cb.checked;
      });

      saveAccounts();
      alert("LAS status updated!");
    };
  });
}

