function changePassword() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("User not logged in.");
    return;
  }

  const oldPassword = document.getElementById("oldPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match!");
    return;
  }

  const payload = {
    oldPassword,
    newPassword
  };

  fetch(`http://localhost:8080/users/change-password/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error("Password update failed");
      return res.text(); // since backend returns a plain message
    })
    .then(msg => {
      alert(msg);
      document.getElementById("oldPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmPassword").value = "";
    })
    .catch(err => {
      alert(err.message || "Error updating password");
    });
}





