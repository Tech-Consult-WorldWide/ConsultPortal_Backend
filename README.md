# **ConsultPortal Backend**

The backend for **ConsultPortal**, a real-time expert consultation platform. The backend handles user authentication, expert availability, appointment booking, email notifications, and real-time event-driven updates using **Solace Event Broker**.

---

## **Features**

1. **User Authentication**:
   - Firebase Authentication for secure user login and registration.

2. **Appointment Booking**:
   - Clients can book appointments with experts.
   - Sends email confirmations to both clients and experts using Nodemailer.

3. **Real-Time Availability**:
   - Experts can update their availability (`Available`, `Busy`, or `Offline`).
   - Availability status is published to Solace Event Broker for real-time updates.

4. **Real-Time Chat**:
   - Enables real-time chat between clients and experts using Solace Event Broker.

5. **Database**:
   - Firestore is used for storing user and expert data.

---

## **Technology Stack**

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for building APIs.
- **Firebase**:
  - Authentication: For secure user login.
  - Firestore: For storing user and expert data.
- **Nodemailer**: For sending email notifications.
- **Solace Event Broker**: For real-time updates and event-driven architecture.

---

## **Project Structure**
├── node_modules
├── routes/                # API routes
│   ├── availability.js    # Routes for availability updates
│   ├── chat.js            # Routes for chat system
│   ├── email.js           # Routes for email system
├── services/              # Service layer
│   ├── solaceClient.js    # Solace event broker integration
│   ├── emailService.js    # Email sending logic
├── server.js              # Main backend server
├── package.json           # Backend dependencies
├── .env                   # Environment variables

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone <backend-repo-url>
cd backend
```bash

### **2. Clone the Repository**
```bash
npm install
```bash