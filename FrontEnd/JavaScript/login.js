
// Show password

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


// login for submition

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const fields = {
    email,
    password
  };

  try {
    const response = await fetch("http://localhost:8080/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fields)
    });

    if (!response.ok) {
      const err = await response.json();
      alert("Login failed: " + err.errorMessage || "Wrong credentials");
      return;
    }

    const user = await response.json();

    
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userId", user.id); 

    alert("Login successful!");

    
    if (user.role === "EMPLOYEE") {
      window.location.href = "employee.html";
    } else if (user.role === "MANAGER") {
      window.location.href = "manager.html";
    }

  } catch (error) {
    alert("Server error. Try again later.");
    console.error(error);
  }
});
