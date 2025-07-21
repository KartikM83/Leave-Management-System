
  function selectRadio(radioId, containerId) {
 
    document.querySelectorAll('[id^="option"]').forEach((el) => {
      el.classList.remove('bg-[#ffbd2010]');
    });

   
    document.getElementById(radioId).checked = true;
    document.getElementById(containerId).classList.add('bg-[#ffbd2010]');
  }


  function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const icon = button.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}


document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.querySelector('input[placeholder="Your Name"]').value.trim();
  const email = document.querySelector('input[placeholder="Email"]').value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const role = document.querySelector('input[type="radio"]:checked')?.value;

  if (!role) {
    alert("Please select a role (EMPLOYEE or MANAGER)");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const nameParts = fullName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || ""; 

  const payload = {
    name: firstName,
    lastName: lastName,
    email: email,
    password: password,
    role: role
  };

  try {
    const response = await fetch("http://localhost:8080/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      alert("Registration successful!");
      window.location.href = "login.html";
    } else {
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.message || response.statusText}`);
    }
  } catch (err) {
    alert("Error connecting to server: " + err.message);
  }
});

