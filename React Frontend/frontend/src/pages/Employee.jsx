import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Employee(){
  const [active, setActive] = useState('dashboard') // 'dashboard','profile','change','apply','calendar'
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])
  const calendarRef = useRef(null)
  const navigate = useNavigate()

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
  useEffect(()=>{
    if(!user){
      alert('User not logged in')
      navigate('/')
      return
    }
    loadSummary()
    loadRecent()
    // load calendar later when user navigates to calendar
  },[])

  async function loadSummary(){
    try{
      const data = await api(`http://localhost:8080/user/${user.id}/summary`)
      setSummary(data)
    }catch(err){
      console.error(err); alert('Failed to load dashboard summary')
    }
  }

  async function loadRecent(){
    try{
      const leaves = await api(`http://localhost:8080/user/leaves/${user.id}`)
      setRecent(leaves.slice(-5).reverse())
    }catch(err){ console.error(err); alert('Error loading recent leave history.') }
  }

  function logout(){
    localStorage.removeItem('user'); localStorage.removeItem('userId')
    alert('You have been logged out.')
    navigate('/')
  }

  // Apply leave
  async function submitLeaveRequest(e){
    e?.preventDefault?.()
    const leaveType = document.getElementById('leaveType')?.value
    const startDate = document.getElementById('startDate')?.value
    const endDate = document.getElementById('endDate')?.value
    const reason = document.getElementById('reason')?.value
    if(!leaveType||!startDate||!endDate){ alert('Please fill all required fields.'); return }
    const start = new Date(startDate), end = new Date(endDate)
    const timeDiff = end.getTime()-start.getTime()
    const leaveDays = Math.floor(timeDiff/(1000*60*60*24))+1
    if(leaveDays<=0){ alert('End date must be after or same as start date.'); return }
    let summaryData
    try{ summaryData = await api(`http://localhost:8080/user/${user.id}/summary`) }catch(e){ alert('Failed to check leave balance.'); return }
    let remaining = 0
    if(leaveType==='SICK') remaining = summaryData.totalSick - (summaryData.approvedSick||0) - (summaryData.pendingSick||0)
    else if(leaveType==='VACATION') remaining = summaryData.totalVacation - (summaryData.approvedVacation||0) - (summaryData.pendingVacation||0)
    else if(leaveType==='OTHER') remaining = summaryData.totalOther - (summaryData.approvedOther||0) - (summaryData.pendingOther||0)
    if(leaveDays>remaining){ alert(`❌ You have only ${remaining} ${leaveType.toLowerCase()} leave days left. You requested ${leaveDays} days.`); return }
    const payload = { employeeID: user.id, leaveType, startDate, endDate, reason, status: 'PENDING' }
    try{
      const res = await api('http://localhost:8080/user/apply', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      alert('✅ Leave request submitted successfully!')
      document.getElementById('startDate').value=''; document.getElementById('endDate').value=''; document.getElementById('reason').value=''
      setActive('dashboard'); loadSummary(); loadRecent()
    }catch(err){ alert('❌ Error: ' + (err.response?.message || err.message)) }
  }

  // change password
  async function changePassword(){
    const userId = localStorage.getItem('userId')
    if(!userId){ alert('User not logged in.'); return }
    const oldPassword = document.getElementById('oldPassword')?.value.trim()
    const newPassword = document.getElementById('newPassword')?.value.trim()
    const confirmPassword = document.getElementById('confirmPassword')?.value.trim()
    if(newPassword !== confirmPassword){ alert('New passwords do not match!'); return }
    try{
      await api(`http://localhost:8080/users/change-password/${userId}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ oldPassword, newPassword }) })
      alert('Password changed successfully')
      document.getElementById('oldPassword').value=''; document.getElementById('newPassword').value=''; document.getElementById('confirmPassword').value=''
    }catch(err){ alert(err.message || 'Error updating password') }
  }

  // profile load/save
  async function loadUserProfile(){
    const userId = localStorage.getItem('userId')
    if(!userId) return
    try{
      const data = await api(`http://localhost:8080/users/profile/${userId}`)
      // populate view fields
      const viewIds = { viewEmpCode: data.empCode||'', viewFirstName: data.name||'', viewLastName: data.lastName||'', viewGender: data.gender||'', viewDob: data.dob||'', viewEmail: data.email||'', viewDept: data.department||'', viewMobile: data.mobile||'', viewCity: data.city||'', viewCountry: data.country||'', viewAddress: data.address||'' }
      Object.entries(viewIds).forEach(([k,v])=>{ const el=document.getElementById(k); if(el) el.textContent = v })
      // fill edit form
      const setIds = { empCode: data.empCode||'', firstName: data.name||'', lastName: data.lastName||'', gender: data.gender||'', dob: data.dob||'', email: data.email||'', workingDept: data.department||'', mobile: data.mobile||'', city: data.city||'', country: data.country||'', address: data.address||'' }
      Object.entries(setIds).forEach(([k,v])=>{ const el=document.getElementById(k); if(el) el.value = v })
    }catch(err){ console.error('Failed to load user profile', err) }
  }

  function showEdit(){ const view=document.getElementById('profileView'); const form=document.getElementById('profileEditForm'); if(view) view.classList.add('hidden'); if(form) form.classList.remove('hidden') }
  function hideEdit(){ const view=document.getElementById('profileView'); const form=document.getElementById('profileEditForm'); if(view) view.classList.remove('hidden'); if(form) form.classList.add('hidden') }

  async function saveProfile(){
    const userId = localStorage.getItem('userId'); if(!userId){ alert('User not logged in'); return }
    const updatedData = {
      empCode: document.getElementById('empCode')?.value,
      name: document.getElementById('firstName')?.value,
      lastName: document.getElementById('lastName')?.value,
      gender: document.getElementById('gender')?.value,
      dob: document.getElementById('dob')?.value,
      email: document.getElementById('email')?.value,
      department: document.getElementById('workingDept')?.value,
      mobile: document.getElementById('mobile')?.value,
      city: document.getElementById('city')?.value,
      country: document.getElementById('country')?.value,
      address: document.getElementById('address')?.value,
    }
    try{
      const data = await api(`http://localhost:8080/users/profile/${userId}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(updatedData) })
      // update view
      document.getElementById('viewEmpCode').textContent = data.empCode;
      document.getElementById('viewFirstName').textContent = data.name;
      document.getElementById('viewLastName').textContent = data.lastName;
      document.getElementById('viewGender').textContent = data.gender;
      document.getElementById('viewDob').textContent = data.dob;
      document.getElementById('viewDept').textContent = data.department;
      document.getElementById('viewMobile').textContent = data.mobile;
      document.getElementById('viewCity').textContent = data.city;
      document.getElementById('viewCountry').textContent = data.country;
      document.getElementById('viewAddress').textContent = data.address;
      hideEdit(); alert('Profile updated successfully!')
    }catch(err){ console.error(err); alert('Failed to update profile') }
  }

  // Calendar integration using FullCalendar
  useEffect(()=>{
    if(active === 'calendar'){
      // render calendar
      const el = calendarRef.current
      if(!el) return
      (async ()=>{
        try{
          const leaves = await api(`http://localhost:8080/user/leaves/${user.id}`)
          const approved = leaves.filter(l=>l.status==='APPROVED')
          const events = approved.map(leave=>({ title: leave.leaveType, start: leave.startDate, end: new Date(new Date(leave.endDate).getTime()+24*60*60*1000).toISOString().split('T')[0], color: '#16a34a', extendedProps:{ reason: leave.reason } }))
          // clear previous calendar if exists
          el.innerHTML = ''
          const calendar = new FullCalendar.Calendar(el, { initialView: 'dayGridMonth', height:500, events, eventDidMount: info => { const tooltip = `${info.event.title}\n${info.event.extendedProps.reason}`; info.el.setAttribute('title', tooltip) } })
          calendar.render()
        }catch(err){ console.error('Calendar load error', err); alert('Could not load leave calendar.') }
      })()
    }
  },[active])

  useEffect(()=>{ if(active==='profile') loadUserProfile() },[active])

  return (
    <div className="bg-[#2d2d2d] w-full h-screen text-white">
      {/* Navbar */}
      <div className="w-full h-[10%] flex justify-between items-center px-5 border-b-2 border-[#3d3d3d]">
        <div className="text-5xl font-bold text-[#ffbd20]">LMS</div>
        <div className="flex gap-5 text-md">
          <div className={`hover:text-[#ffbd20] cursor-pointer ${active==='dashboard' ? 'text-[#ffbd20]' : ''}`} onClick={()=>setActive('dashboard')}>Dashboard</div>
          <div className={`hover:text-[#ffbd20] cursor-pointer ${active==='profile' ? 'text-[#ffbd20]' : ''}`} onClick={()=>setActive('profile')}>My Profile</div>
          <div className={`hover:text-[#ffbd20] cursor-pointer ${active==='change' ? 'text-[#ffbd20]' : ''}`} onClick={()=>setActive('change')}>Change Password</div>
          <div className={`hover:text-[#ffbd20] cursor-pointer ${active==='apply' ? 'text-[#ffbd20]' : ''}`} onClick={()=>setActive('apply')}>Apply Leave</div>
          <div className={`hover:text-[#ffbd20] cursor-pointer ${active==='calendar' ? 'text-[#ffbd20]' : ''}`} onClick={()=>setActive('calendar')}>Leave Calendar</div>
          <div className="hover:text-[#ffbd20] cursor-pointer" onClick={logout}>Logout</div>
        </div>
      </div>

      {/* Dashboard Section */}
      {active === 'dashboard' && <div id="dashboardSection" className="p-10">
        <h2 className="text-3xl font-bold mb-6 text-[#ffbd20]">Hi {user?.name || 'User'} 👋</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#3d3d3d] p-4 rounded-lg text-center"><h3 className="text-xl font-semibold">Total Leaves</h3><p id="totalLeaves" className="text-3xl mt-2 font-bold text-yellow-400">{summary?.totalAllotted ?? 0}</p></div>
          <div className="bg-[#3d3d3d] p-4 rounded-lg text-center"><h3 className="text-xl font-semibold">Remaining</h3><p id="remainingLeaves" className="text-3xl mt-2 font-bold text-blue-400">{summary?.totalRemaining ?? 0}</p></div>
          <div className="bg-[#3d3d3d] p-4 rounded-lg text-center"><h3 className="text-xl font-semibold">Sick Leaves</h3><p id="sickLeaves" className="text-3xl mt-2 font-bold text-yellow-400">{summary ? `${summary.totalSick - summary.approvedSick}/${summary.totalSick}` : '0/0'}</p></div>
          <div className="bg-[#3d3d3d] p-4 rounded-lg text-center"><h3 className="text-xl font-semibold">Vacation Leaves</h3><p id="vacationLeaves" className="text-3xl mt-2 font-bold text-yellow-400">{summary ? `${summary.totalVacation - summary.approvedVacation}/${summary.totalVacation}` : '0/0'}</p></div>
          <div className="bg-[#3d3d3d] p-4 rounded-lg text-center"><h3 className="text-xl font-semibold">Other Leaves</h3><p id="otherLeaves" className="text-3xl mt-2 font-bold text-yellow-400">{summary ? `${summary.totalOther - summary.approvedOther}/${summary.totalOther}` : '0/0'}</p></div>
          <div className="bg-[#3d3d3d] p-4 rounded-lg text-center"><h3 className="text-xl font-semibold">Approved</h3><p id="approvedLeaves" className="text-3xl mt-2 font-bold text-green-400">{summary?.approvedCount ?? 0}</p></div>
          <div className="bg-[#3d3d3d] p-4 rounded-lg text-center"><h3 className="text-xl font-semibold">Rejected</h3><p id="rejectedLeaves" className="text-3xl mt-2 font-bold text-red-400">{summary?.rejectedCount ?? 0}</p></div>
          <div className="bg-[#3d3d3d] p-4 rounded-lg text-center"><h3 className="text-xl font-semibold">Pending</h3><p id="pendingLeaves" className="text-3xl mt-2 font-bold text-orange-400">{summary?.pendingCount ?? 0}</p></div>
        </div>

        <h3 className="text-2xl font-bold mb-4">Recent Leaves</h3>
        <div className="overflow-x-auto bg-[#3d3d3d] rounded-lg">
          <table className="min-w-full">
            <thead className="bg-[#ffbd20] text-black"><tr><th className="px-4 py-2 text-left">S.No.</th><th className="px-4 py-2 text-left">Leave Type</th><th className="px-4 py-2 text-left">Start Date</th><th className="px-4 py-2 text-left">End Date</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Reason</th><th className="px-4 py-2 text-left">Manager Comment</th></tr></thead>
            <tbody id="recentLeavesTableBody">
              {recent.map((leave, idx) => (
                <tr className="border-b border-[#4d4d4d]" key={leave.id || idx}>
                  <td className="px-4 py-2">{idx+1}</td>
                  <td className="px-4 py-2">{leave.leaveType}</td>
                  <td className="px-4 py-2">{leave.startDate}</td>
                  <td className="px-4 py-2">{leave.endDate}</td>
                  <td className={`px-4 py-2 ${leave.status==='APPROVED' ? 'text-green-400' : leave.status==='REJECTED' ? 'text-red-400' : 'text-orange-400'}`}>{leave.status}</td>
                  <td className="px-4 py-2">{leave.reason || '-'}</td>
                  <td className="px-4 py-2">{leave.managerComment || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Profile */}
      {active === 'profile' && <div id="profileSection" className="p-10">
        <h2 className="text-3xl font-bold mb-6 text-[#ffbd20]">My Profile</h2>
        <div id="profileView" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><strong>Employee Code:</strong> <span id="viewEmpCode">EMP001</span></div>
            <div><strong>Gender:</strong> <span id="viewGender"></span></div>
            <div><strong>First Name:</strong> <span id="viewFirstName">Kartik</span></div>
            <div><strong>Last Name:</strong> <span id="viewLastName"></span></div>
            <div><strong>Date of Birth:</strong> <span id="viewDob"></span></div>
            <div><strong>Email:</strong> <span id="viewEmail">kartik@example.com</span></div>
            <div><strong>Department:</strong> <span id="viewDept"></span></div>
            <div><strong>Mobile:</strong> <span id="viewMobile"> </span></div>
            <div><strong>City:</strong> <span id="viewCity"></span></div>
            <div><strong>Country:</strong> <span id="viewCountry"></span></div>
            <div className="col-span-2"><strong>Address:</strong> <span id="viewAddress"></span></div>
          </div>
          <button id="editBtn" onClick={showEdit} className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded hover:bg-yellow-400 font-semibold">Edit</button>
        </div>

        <div id="profileEditForm" className="hidden mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#3d3d3d] p-6 rounded-xl">
            <div><label className="block mb-1 text-sm">Employee Code</label><input type="text" id="empCode" defaultValue="EMP001" disabled className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" /></div>
            <div><label className="block mb-1 text-sm">Gender</label><input type="text" id="gender" defaultValue="" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" placeholder="Eg: Male"/></div>
            <div><label className="block mb-1 text-sm">First Name</label><input type="text" id="firstName" defaultValue="Kartik" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" /></div>
            <div><label className="block mb-1 text-sm">Last Name</label><input type="text" id="lastName" defaultValue="" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" placeholder="Eg: Mankar"/></div>
            <div><label className="block mb-1 text-sm">DOB</label><input type="text" id="dob" defaultValue="" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" placeholder="Eg: YYYY/MM/DD"/></div>
            <div><label className="block mb-1 text-sm">Email</label><input type="email" id="email" defaultValue="kartik@example.com" disabled className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" /></div>
            <div><label className="block mb-1 text-sm">Department</label><input type="text" id="workingDept" defaultValue="" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" placeholder="Eg: HR/IT Department" /></div>
            <div><label className="block mb-1 text-sm">Mobile</label><input type="text" id="mobile" defaultValue="" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" placeholder="+91 8930465997" /></div>
            <div><label className="block mb-1 text-sm">City</label><input type="text" id="city" defaultValue="" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" placeholder="Eg: Nagpur"/></div>
            <div><label className="block mb-1 text-sm">Country</label><input type="text" id="country" defaultValue="" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" placeholder="Eg: India" /></div>
            <div className="md:col-span-2"><label className="block mb-1 text-sm">Address</label><input type="text" id="address" defaultValue="" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" placeholder="Eg: Near sive mandir,nagpur"/></div>
            <div className="mt-6 flex gap-4 col-span-2">
              <button id="saveBtn" onClick={saveProfile} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-semibold">Save</button>
              <button id="cancelBtn" onClick={hideEdit} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      </div>}

      {/* Change Password */}
      {active === 'change' && <div id="changePasswordSection" className="p-10">
        <h2 className="text-3xl font-bold mb-6 text-[#ffbd20]">Change Password</h2>
        <div className="w-full bg-[#3d3d3d] p-6 rounded-xl space-y-6">
          <div className="flex gap-2">
            <div className="w-full">
              <label className="block mb-1 text-sm font-semibold">Old Password</label>
              <div className="relative w-full">
                <i className="fa fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"></i>
                <input id="oldPassword" type="password" placeholder="Old Password" className="w-full p-4 pl-10 pr-10 border placeholder-white border-[#555] rounded-xl bg-[#2d2d2d] text-white hover:border-white focus:border-[#ffbd20] focus:border-2 focus:outline-none transition-colors duration-200" />
                <button type="button" onClick={()=>{ const el=document.getElementById('oldPassword'); if(el) el.type = el.type==='password' ? 'text' : 'password' }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white focus:outline-none"><i className="fa fa-eye"></i></button>
              </div>
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm font-semibold">New Password</label>
              <div className="relative w-full">
                <i className="fa fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"></i>
                <input id="newPassword" type="password" placeholder="New Password" className="w-full p-4 pl-10 pr-10 border placeholder-white border-[#555] rounded-xl bg-[#2d2d2d] text-white hover:border-white focus:border-[#ffbd20] focus:border-2 focus:outline-none transition-colors duration-200" />
                <button type="button" onClick={()=>{ const el=document.getElementById('newPassword'); if(el) el.type = el.type==='password' ? 'text' : 'password' }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white focus:outline-none"><i className="fa fa-eye"></i></button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <div className="w-1/2">
              <label className="block mb-1 text-sm font-semibold">Confirm New Password</label>
              <div className="relative w-full">
                <i className="fa fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"></i>
                <input id="confirmPassword" type="password" placeholder="Confirm Password" className="w-full p-4 pl-10 pr-10 border placeholder-white border-[#555] rounded-xl bg-[#2d2d2d] text-white hover:border-white focus:border-[#ffbd20] focus:border-2 focus:outline-none transition-colors duration-200" />
                <button type="button" onClick={()=>{ const el=document.getElementById('confirmPassword'); if(el) el.type = el.type==='password' ? 'text' : 'password' }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white focus:outline-none"><i className="fa fa-eye"></i></button>
              </div>
            </div>
          </div>
          <button onClick={changePassword} className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded mt-4">Change Password</button>
        </div>
      </div>}

      {/* Apply Leave */}
      {active === 'apply' && <div id="applyLeaveSection" className="p-10">
        <h2 className="text-3xl font-bold mb-6 text-[#ffbd20]">Apply for Leave</h2>
        <div className="flex items-center justify-center ">
          <div className="w-[100%] bg-[#3d3d3d] p-6 rounded-xl space-y-6 ">
            <div>
              <label className="block mb-1 text-sm font-semibold">Leave Type</label>
              <select id="leaveType" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white"><option value="SICK">Sick Leaves</option><option value="VACATION">Vacation Leaves</option><option value="OTHER">Other Leaves</option></select>
            </div>
            <div><label className="block mb-1 text-sm font-semibold">Start Date</label><input type="date" id="startDate" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" /></div>
            <div><label className="block mb-1 text-sm font-semibold">End Date</label><input type="date" id="endDate" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white" /></div>
            <div><label className="block mb-1 text-sm font-semibold">Reason</label><textarea id="reason" rows="3" className="w-full p-2 rounded bg-[#2d2d2d] border border-[#555] text-white"></textarea></div>
            <button onClick={submitLeaveRequest} className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded font-semibold w-full">Submit Leave Request</button>
          </div>
        </div>
      </div>}

      {/* Calendar */}
      {active === 'calendar' && <section id="calendarSection" className="p-6"><h2 className="text-xl font-bold mb-4">Leave Calendar</h2><div id="leaveCalendar" ref={calendarRef}></div></section>}
    </div>
  )
}
