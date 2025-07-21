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


