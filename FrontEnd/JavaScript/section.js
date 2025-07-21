function showSection(id) {
  const sections = ["dashboardSection", "profileSection", "changePasswordSection", "applyLeaveSection", "calendarSection"];

  sections.forEach(sec => {
    document.getElementById(sec).classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");


  if (id === "calendarSection") {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      loadLeaveCalendar(user.id);
    }
  }
}


function mshowSection(id) {
  const sections = ["dashboardSection", "profileSection", "changePasswordSection","LeavesSection"];
  sections.forEach(sec => {
    document.getElementById(sec).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}


