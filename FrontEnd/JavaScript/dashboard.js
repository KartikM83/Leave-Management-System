document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  if (!userId) {
    alert("User not logged in");
    return;
  }

  loadLeaveSummary(userId);
  loadRecentLeaves(userId);
  loadLeaveCalendar(userId); 
});




function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

async function loadLeaveSummary(userId) {
  try {
    const res = await fetch(`http://localhost:8080/user/${userId}/summary`);
    const data = await res.json();

   
    setText("totalLeaves", data.totalAllotted);
    setText("remainingLeaves", data.totalRemaining);

  
    setText("sickLeaves", `${data.totalSick - data.approvedSick}/${data.totalSick}`);
    setText("vacationLeaves", `${data.totalVacation - data.approvedVacation}/${data.totalVacation}`);
    setText("otherLeaves", `${data.totalOther - data.approvedOther}/${data.totalOther}`);

    
    setText("approvedLeaves", data.approvedCount);
    setText("rejectedLeaves", data.rejectedCount);
    setText("pendingLeaves", data.pendingCount);
  } catch (err) {
    console.error("Error loading summary:", err);
    alert("Failed to load dashboard summary");
  }
}



async function loadRecentLeaves(userId) {
  try {
    const response = await fetch(`http://localhost:8080/user/leaves/${userId}`);
    const leaves = await response.json();

    const tableBody = document.getElementById("recentLeavesTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    leaves.slice(-5).reverse().forEach((leave, index) => {
      const row = `
        <tr class="border-b border-[#4d4d4d]">
          <td class="px-4 py-2">${index + 1}</td>
          <td class="px-4 py-2">${leave.leaveType}</td>
          <td class="px-4 py-2">${leave.startDate}</td>
          <td class="px-4 py-2">${leave.endDate}</td>
          <td class="px-4 py-2 ${
            leave.status === "APPROVED"
              ? "text-green-400"
              : leave.status === "REJECTED"
              ? "text-red-400"
              : "text-orange-400"
          }">${leave.status}</td>
          <td class="px-4 py-2">${leave.reason || "-"}</td>
          <td class="px-4 py-2">${leave.managerComment || "-"}</td>
        </tr>`;
      tableBody.innerHTML += row;
    });

  } catch (err) {
    console.error("Error loading recent leaves:", err);
    alert("Error loading recent leave history.");
  }
}











async function submitLeaveRequest() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("User not logged in");
    return;
  }

  const leaveType = document.getElementById("leaveType")?.value;
  const startDate = document.getElementById("startDate")?.value;
  const endDate = document.getElementById("endDate")?.value;
  const reason = document.getElementById("reason")?.value;

  if (!leaveType || !startDate || !endDate) {
    alert("Please fill all required fields.");
    return;
  }

  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const leaveDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

  if (leaveDays <= 0) {
    alert("End date must be after or same as start date.");
    return;
  }

  
  let summary;
  try {
    const res = await fetch(`http://localhost:8080/user/${user.id}/summary`);
    summary = await res.json();
  } catch (err) {
    console.error("Error fetching leave summary:", err);
    alert("Failed to check leave balance.");
    return;
  }

 
  let remaining = 0;
if (leaveType === "SICK") {
  remaining = summary.totalSick - (summary.approvedSick || 0) - (summary.pendingSick || 0);
} else if (leaveType === "VACATION") {
  remaining = summary.totalVacation - (summary.approvedVacation || 0) - (summary.pendingVacation || 0);
} else if (leaveType === "OTHER") {
  remaining = summary.totalOther - (summary.approvedOther || 0) - (summary.pendingOther || 0);
}


  
  if (leaveDays > remaining) {
    alert(`❌ You have only ${remaining} ${leaveType.toLowerCase()} leave days left. You requested ${leaveDays} days.`);
    return;
  }

  
  const data = {
    employeeID: user.id,
    leaveType,
    startDate,
    endDate,
    reason,
    status: "PENDING"
  };

  try {
    const response = await fetch("http://localhost:8080/user/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("✅ Leave request submitted successfully!");
      document.getElementById("startDate").value = "";
      document.getElementById("endDate").value = "";
      document.getElementById("reason").value = "";
      showSection("dashboardSection");
      loadLeaveSummary(user.id);
      loadRecentLeaves(user.id);
    } else {
      const errData = await response.json();
      const errorMessage = errData.message || errData.errorMessage || "Leave request failed.";
      alert("❌ Error: " + errorMessage);
    }
  } catch (e) {
    console.error("Submit error:", e);
    alert("❌ Server error. Try again later.");
  }
}






//Logout function
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  alert("You have been logged out.");
  window.location.href = "login.html";
}





// Calender View

function addOneDay(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}



async function loadLeaveCalendar(userId) {
  const calendarEl = document.getElementById("leaveCalendar");
  if (!calendarEl) return;

  try {
    const res = await fetch(`http://localhost:8080/user/leaves/${userId}`);
    const leaves = await res.json();

    const approvedLeaves = leaves.filter(leave => leave.status === "APPROVED");

    const events = approvedLeaves.map(leave => ({
      title: leave.leaveType,
      start: leave.startDate,
      end: addOneDay(leave.endDate),
      color: "#16a34a", 
      extendedProps: {
        reason: leave.reason
      }
    }));

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 500,
      events: events,
      eventDidMount: function(info) {
        const tooltip = `${info.event.title}\n${info.event.extendedProps.reason}`;
        info.el.setAttribute("title", tooltip);
      }
    });

    calendar.render();
  } catch (err) {
    console.error("Calendar load error:", err);
    alert("Could not load leave calendar.");
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user?.id;

//   if (!userId) {
//     alert("User not logged in");
//     return;
//   }

//   loadLeaveSummary(userId);
//   loadRecentLeaves(userId);
//   loadLeaveCalendar(userId); 
// });
