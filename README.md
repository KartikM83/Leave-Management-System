Leave Management System

A full-stack application to manage employee leave requests and approvals with role-based access for Employees and Managers.

Table of Contents

Features

Tech Stack

Prerequisites

Installation

Configuration

Running the Application

API Endpoints

Database Schema

Usage

Contributing

License

Features

Employee can submit leave requests with type, date range, and reason.

Manager can view, approve, or reject leave requests.

Role-based access control for Employees and Managers.

Real-time leave balance calculation (sick, vacation, other).

Summary endpoint for total, approved, rejected, and pending counts.

Tech Stack

Backend: Java, Spring Boot, Spring Data JPA, Hibernate

Database: MySQL

Frontend: HTML, TailwindCSS, JavaScript

API Testing: Postman

Prerequisites

Java 17 or higher

Maven 3.6+

MySQL 5.7+ or compatible

Node.js (optional, for serving static files)

Installation

Clone the repository:

git clone https://github.com/yourusername/leave-management-system.git
cd leave-management-system/backend

Build the Spring Boot backend with Maven:

mvn clean install

Set up the database:

Create a new MySQL schema, for example leave_management.

Run SQL scripts in src/main/resources/schema.sql and data.sql to create tables and seed data.

Configuration

Open src/main/resources/application.properties and configure your database connection:

spring.datasource.url=jdbc:mysql://localhost:3306/leave_management
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

Running the Application

Start the Spring Boot server:

mvn spring-boot:run

Serve the frontend (optional):

If you have a simple HTTP server (like live-server), point it to frontend/ directory.

Or open frontend/register.html and other HTML files directly in your browser.

The backend will run on http://localhost:8080/ by default.

API Endpoints

Method

Endpoint

Description

Request Body

Response

POST

/users/register

Register a new user (Employee/Manager)

{ name, lastName, email, password, role }

UserDTO

POST

/users/login

Login and obtain user details

{ email, password }

UserDTO

POST

/leave

Submit a new leave request

LeaveRequestDTO

LeaveRequestDTO

GET

/leave/user/{userId}

Get all leave requests of a user

—

List<LeaveRequestDTO>

PUT

/leave/{leaveId}/status

Update leave status (approve/reject)

{ status, managerComment }

LeaveRequestDTO

GET

/leave/summary/{userId}

Get leave balance and summary counts

—

LeaveSummaryDTO

Database Schema

User: id, name, last_name, email, password, role, emp_code, ...

LeaveBalance: id, employee_id, total_sick_leaves, total_vacation_leaves, total_other_leaves, remaining_sick_leaves, remaining_vacation_leaves, other_leaves_remaining

LeaveRequest: id, employee_id, leave_type, start_date, end_date, reason, status, manager_comment

Usage

Register as an Employee or Manager.

Employees can log in and submit leave requests.

Managers can log in to view all requests and update their statuses.

Employees can view their leave summary at any time.

Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

License

MIT

