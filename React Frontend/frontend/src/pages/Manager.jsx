import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Manager() {
  const [active, setActive] = useState("dashboard");
  const [leaves, setLeaves] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [modal, setModal] = useState({ open: false, leave: null, comment: "" });
  const [showPwd, setShowPwd] = useState({ old: false, new: false, confirm: false });
  const navigate = useNavigate();

  useEffect(() => {
    fetchManagerLeaves();
    fetchLeaveCounts();
  }, []);

  async function fetchManagerLeaves() {
    try {
      const data = await api("http://localhost:8080/user/manager/all-leaves");
      setLeaves(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load leaves");
    }
  }

  async function fetchLeaveCounts() {
    try {
      const [totalRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
        api("http://localhost:8080/user/manager/total-count"),
        api("http://localhost:8080/user/manager/pending-count"),
        api("http://localhost:8080/user/manager/status-count?status=APPROVED"),
        api("http://localhost:8080/user/manager/status-count?status=REJECTED"),
      ]);
      setCounts({ total: totalRes, pending: pendingRes, approved: approvedRes, rejected: rejectedRes });
    } catch (err) {
      console.error(err);
    }
  }

  function getStatusClass(status) {
    return status === "APPROVED"
      ? "text-green-400"
      : status === "REJECTED"
      ? "text-red-400"
      : "text-orange-400";
  }

  function openLeaveModal(leave) {
    setModal({ open: true, leave, comment: leave.managerComment || "" });
  }
  function closeLeaveModal() {
    setModal({ open: false, leave: null, comment: "" });
  }

  async function handleLeaveDecision(decision) {
    if (!modal.leave) return;
    try {
      await api(
        `http://localhost:8080/user/leaves/${modal.leave.id}/review?status=${decision}&comment=${encodeURIComponent(
          modal.comment
        )}`,
        { method: "PUT" }
      );
      await fetchManagerLeaves();
      await fetchLeaveCounts();
      closeLeaveModal();
    } catch (err) {
      alert("Failed to update leave status.");
    }
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    alert("Logged out");
    navigate("/");
  }

  return (
    <div className="bg-[#2d2d2d] w-full h-screen text-white">
      {/* Navbar */}
      <div className="w-full h-[10%] flex justify-between items-center px-5 border-b-2 border-[#3d3d3d]">
        <div className="text-5xl font-bold text-[#ffbd20]">LMS</div>
        <div className="flex gap-5 text-md">
          {["dashboard", "profile", "change", "leaves"].map((key) => (
            <div
              key={key}
              onClick={() => setActive(key)}
              className={`hover:text-[#ffbd20] cursor-pointer ${
                active === key ? "text-[#ffbd20]" : ""
              }`}
            >
              {key === "dashboard" && "Dashboard"}
              {key === "profile" && "My Profile"}
              {key === "change" && "Change Password"}
              {key === "leaves" && "New Leaves"}
            </div>
          ))}
          <div className="hover:text-[#ffbd20] cursor-pointer" onClick={logout}>
            Logout
          </div>
        </div>
      </div>

      {/* Dashboard */}
      {active === "dashboard" && (
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-6 text-[#ffbd20]">Hi Manager 👋</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#3d3d3d] p-4 rounded-lg text-center">
              <h3>Total Requests</h3>
              <p className="text-3xl text-yellow-400 font-bold">{counts.total}</p>
            </div>
            <div className="bg-[#3d3d3d] p-4 rounded-lg text-center">
              <h3>Pending</h3>
              <p className="text-3xl text-orange-400 font-bold">{counts.pending}</p>
            </div>
            <div className="bg-[#3d3d3d] p-4 rounded-lg text-center">
              <h3>Approved</h3>
              <p className="text-3xl text-green-400 font-bold">{counts.approved}</p>
            </div>
            <div className="bg-[#3d3d3d] p-4 rounded-lg text-center">
              <h3>Rejected</h3>
              <p className="text-3xl text-red-400 font-bold">{counts.rejected}</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaves Section */}
      {active === "leaves" && (
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-6 text-[#ffbd20]">New Leave Requests</h2>
          <div className="overflow-x-auto bg-[#3d3d3d] rounded-lg">
            <table className="min-w-full">
              <thead className="bg-[#ffbd20] text-black">
                <tr>
                  <th className="px-4 py-2">S.No.</th>
                  <th className="px-4 py-2">Employee</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Start</th>
                  <th className="px-4 py-2">End</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2">Comment</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave, idx) => (
                  <tr key={leave.id} className="border-b border-[#4d4d4d]">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{leave.employeeName}</td>
                    <td className="px-4 py-2">{leave.leaveType}</td>
                    <td className="px-4 py-2">{leave.startDate}</td>
                    <td className="px-4 py-2">{leave.endDate}</td>
                    <td className="px-4 py-2">{leave.reason}</td>
                    <td className="px-4 py-2">{leave.managerComment || "—"}</td>
                    <td className={`px-4 py-2 font-bold ${getStatusClass(leave.status)}`}>
                      {leave.status}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openLeaveModal(leave)}
                        className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.open && modal.leave && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#3d3d3d] p-6 rounded-lg w-[500px] relative">
            <button onClick={closeLeaveModal} className="absolute top-2 right-3 text-white text-xl">
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#ffbd20]">Leave Details</h2>
            <p><strong>Employee:</strong> {modal.leave.employeeName}</p>
            <p><strong>Type:</strong> {modal.leave.leaveType}</p>
            <p><strong>Dates:</strong> {modal.leave.startDate} → {modal.leave.endDate}</p>
            <p><strong>Reason:</strong> {modal.leave.reason}</p>
            <textarea
              value={modal.comment}
              onChange={(e) => setModal({ ...modal, comment: e.target.value })}
              className="w-full p-2 bg-[#2d2d2d] border border-[#555] rounded text-white mt-3"
              rows="2"
              placeholder="Manager comment"
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => handleLeaveDecision("APPROVED")}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
              >
                Approve
              </button>
              <button
                onClick={() => handleLeaveDecision("REJECTED")}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
