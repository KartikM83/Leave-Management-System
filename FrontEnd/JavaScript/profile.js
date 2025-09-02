const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const viewDiv = document.getElementById("profileView");
const editForm = document.getElementById("profileEditForm");

// Show form on Edit
editBtn.addEventListener("click", () => {
  viewDiv.classList.add("hidden");
  editForm.classList.remove("hidden");
});

//Cancel edit
cancelBtn.addEventListener("click", () => {
  editForm.classList.add("hidden");
  viewDiv.classList.remove("hidden");
});

// Save profile 
saveBtn.addEventListener("click", () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("User not logged in");
    return;
  }

  const updatedData = {
    empCode: document.getElementById("empCode").value,
    name: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    gender: document.getElementById("gender").value,
    dob: document.getElementById("dob").value,
    email: document.getElementById("email").value,
    department: document.getElementById("workingDept").value,
    mobile: document.getElementById("mobile").value,
    city: document.getElementById("city").value,
    country: document.getElementById("country").value,
    address: document.getElementById("address").value,
  };

  fetch(`http://localhost:8080/users/profile/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedData)
  })
    .then(res => {
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    })
    .then(data => {
      document.getElementById("viewEmpCode").textContent = data.empCode;
      document.getElementById("viewFirstName").textContent = data.name;
      document.getElementById("viewLastName").textContent = data.lastName;
      document.getElementById("viewGender").textContent = data.gender;
      document.getElementById("viewDob").textContent = data.dob;
      document.getElementById("viewDept").textContent = data.department;
      document.getElementById("viewMobile").textContent = data.mobile;
      document.getElementById("viewCity").textContent = data.city;
      document.getElementById("viewCountry").textContent = data.country;
      document.getElementById("viewAddress").textContent = data.address;

      editForm.classList.add("hidden");
      viewDiv.classList.remove("hidden");

      alert("Profile updated successfully!");
    })
    .catch(err => {
      console.error(err);
      alert("Failed to update profile");
    });
});




function loadUserProfile() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  fetch(`http://localhost:8080/users/profile/${userId}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    })
    .then(data => {
      // Update View
      document.getElementById("viewEmpCode").textContent = data.empCode || "";
      document.getElementById("viewFirstName").textContent = data.name || "";
      document.getElementById("viewLastName").textContent = data.lastName || "";
      document.getElementById("viewGender").textContent = data.gender || "";
      document.getElementById("viewDob").textContent = data.dob || "";
      document.getElementById("viewEmail").textContent = data.email || "";
      document.getElementById("viewDept").textContent = data.department || "";
      document.getElementById("viewMobile").textContent = data.mobile || "";
      document.getElementById("viewCity").textContent = data.city || "";
      document.getElementById("viewCountry").textContent = data.country || "";
      document.getElementById("viewAddress").textContent = data.address || "";

      // Fill Edit Form
      document.getElementById("empCode").value = data.empCode || "";
      document.getElementById("firstName").value = data.name || "";
      document.getElementById("lastName").value = data.lastName || "";
      document.getElementById("gender").value = data.gender || "";
      document.getElementById("dob").value = data.dob || "";
      document.getElementById("email").value = data.email || "";
      document.getElementById("workingDept").value = data.department || "";
      document.getElementById("mobile").value = data.mobile || "";
      document.getElementById("city").value = data.city || "";
      document.getElementById("country").value = data.country || "";
      document.getElementById("address").value = data.address || "";
    })
    .catch(err => {
      console.error("Failed to load user profile", err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();

  
});
