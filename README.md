# 🏢 Leave Management System

A full-stack web application to manage employee leave requests and approvals, built using **Spring Boot**, **MySQL**, **HTML**, **TailwindCSS**, and **JavaScript**. The system provides role-based access for **Employees** and **Managers** with leave tracking and summaries.

---

## 📚 Table of Contents

- [🔑 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Installation](#-installation)
- [🧾 Configuration](#-configuration)
- [▶️ Running the App](#️-running-the-app)
- [📡 API Endpoints](#-api-endpoints)
- [🗄 Database Schema](#-database-schema)
- [👨‍💼 Usage Flow](#-usage-flow)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🔑 Features

- Employee registration and login
- Manager registration and login
- Leave request creation by employees
- Leave approval/rejection by managers
- Role-based access control
- Leave balance tracking (sick, vacation, other)
- Leave summary reports per employee

---

## 🛠 Tech Stack

**Frontend:**
- HTML
- Tailwind CSS
- JavaScript

**Backend:**
- Java 17+
- Spring Boot
- Spring Data JPA
- Hibernate

**Database:**
- MySQL

**Tools:**
- Postman (API testing)
- Git & GitHub

---

## ⚙️ Prerequisites

Ensure the following are installed:

- Java 17 or above
- Maven 3.6+
- MySQL 5.7+
- Node.js (optional, for frontend tools like `live-server`)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/leave-management-system.git
cd leave-management-system
```
### 2: Setup MySQL
- Create a database named: leave_management
- Open src/main/resources/schema.sql and data.sql (if any) to manually create required tables and dummy data.

### Step 3: Configure Spring Boot
Update src/main/resources/application.properties:
```
spring.datasource.url=jdbc:mysql://localhost:3306/leave_management
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### ▶️ Running the App
✅ Backend (Spring Boot)
```
cd backend
mvn clean install
mvn spring-boot:run
```

App will start on: http://localhost:8080

🌐 Frontend (HTML + Tailwind)
Open the frontend folder and open files like:

- register.html
-login.html
-dashboard.html
-leave_request.html

Open using browser or Live Server extension.


# Leave Management System

## 📡 API Endpoints

| Method | Endpoint                  | Description                           |
|--------|---------------------------|-------------------------------------|
| POST   | `/users/register`          | Register new Employee/Manager       |
| POST   | `/users/login`             | Login using empCode                  |
| POST   | `/leave`                   | Submit leave request                 |
| GET    | `/leave/user/{userId}`     | View all leave requests by user     |
| PUT    | `/leave/{leaveId}/status` | Manager approves/rejects a request  |
| GET    | `/leave/summary/{userId}`  | View leave balances and summary     |

---

## 🗄 Database Schema

### User Table

| Field      | Type   |
|------------|--------|
| id         | Long   |
| emp_code   | String |
| name       | String |
| last_name  | String |
| email      | String |
| password   | String |
| role       | String (EMPLOYEE / MANAGER) |

### LeaveBalance Table

| Field                   | Type  |
|-------------------------|-------|
| id                      | Long  |
| employee_id             | Long  |
| total_sick_leaves       | int   |
| total_vacation_leaves   | int   |
| total_other_leaves      | int   |
| remaining_sick_leaves   | int   |
| remaining_vacation_leaves | int |
| other_leaves_remaining  | int   |

### LeaveRequest Table

| Field           | Type                         |
|-----------------|------------------------------|
| id              | Long                         |
| employee_id     | Long                         |
| leave_type      | String                       |
| start_date      | Date                         |
| end_date        | Date                         |
| reason          | String                       |
| status          | String (PENDING/APPROVED/REJECTED) |
| manager_comment | String                       |

---

## 👨‍💼 Usage Flow

### 👤 Employee

- Register or Login using empCode
- Apply for leave by filling the form
- View leave request history
- Check leave summary and balances

### 🧑‍💼 Manager

- Register or Login using empCode
- View all employee leave requests
- Approve or Reject leave with optional comment
- Check summaries per employee

### 📸 Screenshots

1) Register Page

<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/3ad338c8-5e78-4829-9a89-1bf87db49793" />

2) Login page
   
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/13407a49-dd54-4b96-a1ed-9847e3cb1153" />


1) Employee Dashboard
    1) Employee Dashboard

  <img width="1919" height="915" alt="image" src="https://github.com/user-attachments/assets/f9343d7c-b0ef-417d-a2ed-34425e93a20a" />

  2)Employee Profile

  <img width="1915" height="909" alt="image" src="https://github.com/user-attachments/assets/015c8a15-b164-49ed-a852-31486f65910e" />

  3) Change Password
  <img width="1919" height="903" alt="image" src="https://github.com/user-attachments/assets/5ebb099a-9230-4eea-a331-80ec498bb966" />

  4) Apply Leave
  <img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/81689109-b879-46ee-ad19-4ce7627533e3" />

  5) Leave Calender
  <img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/4c49fbbe-3b88-4e4d-bb0f-ad08ea23bca0" />
  
  6) Logout
     
2) Manager Dashbord

 




