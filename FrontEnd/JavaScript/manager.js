let selectedLeaveId = null;

// Fetch All Leaves for Manager
async function fetchManagerLeaves() {
  const response = await fetch("http://localhost:8080/user/manager/all-leaves");
  const leaves = await response.json();

  const tbody = document.getElementById("newLeavesTableBody");
  tbody.innerHTML = "";

  leaves.forEach((leave, index) => {
    const row = document.createElement("tr");
    row.className = "border-b border-[#4d4d4d]";
    row.innerHTML = `
      <td class="px-4 py-2">${index + 1}</td>
      <td class="px-4 py-2">${leave.employeeName}</td>
      <td class="px-4 py-2">${leave.leaveType}</td>
      <td class="px-4 py-2">${leave.startDate}</td>
      <td class="px-4 py-2">${leave.endDate}</td>
      <td class="px-4 py-2">${leave.reason}</td>
      <td class="px-4 py-2" id="comment-${leave.id}">${leave.managerComment || "—"}</td>
      <td class="px-4 py-2 font-bold" id="status-${leave.id}">
        <span class="${getStatusClass(leave.status)}">${leave.status}</span>
      </td>
      <td class="px-4 py-2">
        <button onclick="openLeaveModal(${leave.id})"
          class="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400">Review</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}




function getStatusClass(status) {
  switch (status) {
    case "APPROVED":
      return "text-green-400";
    case "REJECTED":
      return "text-red-400";
    default:
      return "text-orange-400";
  }
}



// Review request
async function openLeaveModal(leaveId) {
  selectedLeaveId = leaveId;

  const response = await fetch("http://localhost:8080/user/manager/all-leaves");
  const data = await response.json();
  const leave = data.find((l) => l.id === leaveId);

  document.getElementById("modalEmpName").textContent = leave.employeeName;
  document.getElementById("modalEmpCode").textContent = leave.employeeCode;
  document.getElementById("modalDept").textContent = leave.department;
  document.getElementById("modalType").textContent = leave.leaveType;
  document.getElementById("modalStart").textContent = leave.startDate;
  document.getElementById("modalEnd").textContent = leave.endDate;
  document.getElementById("modalReason").textContent = leave.reason;

  document.getElementById("managerComment").value = leave.managerComment || "";

  document.getElementById("leaveModal").classList.remove("hidden");
}

//Close request
function closeLeaveModal() {
  document.getElementById("leaveModal").classList.add("hidden");
  document.getElementById("managerComment").value = "";
}



// Approve/Reject
async function handleLeaveDecision(decision) {
  const comment = document.getElementById("managerComment").value;

  const response = await fetch(
    `http://localhost:8080/user/leaves/${selectedLeaveId}/review?status=${decision}&comment=${comment}`,
    {
      method: "PUT",
    }
  );

  if (response.ok) {
    const data = await response.json();

    // Upadte row 
    document.getElementById(`status-${data.id}`).innerHTML =
      `<span class="${getStatusClass(data.status)}">${data.status}</span>`;
    document.getElementById(`comment-${data.id}`).textContent = data.managerComment;

    closeLeaveModal();

    // Refresh 
    await fetchManagerLeaves();
    await fetchLeaveCounts();

  } else {
    alert("Failed to update leave status.");
  }
}






// Cards
async function fetchLeaveCounts() {
  const [totalRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
    fetch("http://localhost:8080/user/manager/total-count"),
    fetch("http://localhost:8080/user/manager/pending-count"),
    fetch("http://localhost:8080/user/manager/status-count?status=APPROVED"),
    fetch("http://localhost:8080/user/manager/status-count?status=REJECTED")
  ]);

  document.getElementById("managerTotalLeaves").textContent = await totalRes.json();
  document.getElementById("managerPendingLeaves").textContent = await pendingRes.json();
  document.getElementById("approvedCount").textContent = await approvedRes.json();
  document.getElementById("rejectedCount").textContent = await rejectedRes.json();
}


document.addEventListener("DOMContentLoaded", () => {
  fetchManagerLeaves();
  fetchLeaveCounts();
});
