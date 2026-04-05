# WEB-PROJECT
## SmartDorm – University Resource Booking System
##  Project Description
SmartDorm is a web-based management system designed for students and university administration to streamline the process of booking common resources such as study rooms, laundry machines, and coworking equipment. The project aims to eliminate scheduling conflicts and improve transparency in dormitory and campus facility usage.

---

## Group Members
Bagdat Alua
Beisen Ayaulym
Mukhtarkyzy Meruert

---

## Tech Stack
* **Frontend:** Angular 17+ (using Signals, @if, @for syntax)

* **Backend:**  Django REST Framework (DRF)

* **Database:**  PostgreSQL / SQLite

* **Authentication:**  JWT (JSON Web Tokens)

---

## Core Features
* **User Authentication:**  Secure login and logout with role-based access.

* **Resource Management:**  View available rooms and equipment in real-time.

* **Booking System:**  Full CRUD operations for making, viewing, and canceling reservations.

* **Issue Reporting:**  A dedicated channel to report broken equipment directly to maintenance.

* **Personal Dashboard:**  Students can track their upcoming bookings and history.

---

## Technical Requirements Coverage
* **Models:**  4+ models (User, Room, Equipment, Booking, IssueReport) with ForeignKey relationships.

* **API Views:**  Mixture of Function-Based Views (FBV) and Class-Based Views (CBV).

* **Serializers:**  Implementation of both serializers.Serializer and serializers.ModelSerializer.

* **Frontend Logic::**  Angular services for API calls, HTTP Interceptors for JWT, and dynamic routing.

---

## How to Run
1. **Backend:**
Bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

2. **Frontend:**
Bash
cd frontend
npm install
ng serve