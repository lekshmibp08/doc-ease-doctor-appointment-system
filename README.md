# 🏥 DocEase - Doctor Appointment System

DocEase is a **full-stack doctor appointment booking system** built with the **MERN stack (MongoDB, Express.js, React, Node.js)** using **TypeScript, Redux Toolkit, and Clean Architecture**.  
It allows users to search and book doctors, consult via chat/video, and make payments through multiple gateways.  
Admins can manage doctors, appointments, and platform activities.

---

## 🚀 Features & Functionalities

### 👨‍⚕️ User & Doctor Management
- **User Registration & Login** with Email, Phone, Password, Google OAuth2.
- **Doctor Registration & Approval** by Admin.
- **Role-Based Access Control (RBAC)** for User, Doctor, and Admin.
- **JWT Authentication** with refresh tokens.
- **Password reset & OTP verification** via email.

### 📅 Appointment Booking
- Search doctors by **name, specialty, location (text or geo-coordinates)**.
- View doctor availability & book appointments.
- Support for **recurring slots** (via RRule).
- Appointment status updates & history.

### 💳 Payments
- Integrated with **Razorpay**.
- Reschedule, Refund & cancellation policies.
- Secure transactions with minimal overhead.

### 💬 Real-Time Communication
- **1:1 chat** with text, images, and file sharing (Socket.IO).
- **Video consultation** via WebRTC.
- Real-time notifications for new messages, bookings, and updates.

### 🖼️ UI/UX
- Built with **React, TypeScript, Redux Toolkit**.
- **Responsive UI** with **Chakra UI & Tailwind CSS**.
- Clean and intuitive dashboard for Users, Doctors, and Admins.

### 🔐 Security
- JWT-based authentication.
- Encrypted passwords with **bcrypt**.
- Input validation with middleware.
- Secure API design following **Clean Architecture**.

---

## 🛠️ Tech Stack

**Frontend**
- React (TypeScript)  
- Redux Toolkit  
- Tailwind CSS  
- Vite  

**Backend**
- Node.js + Express.js (TypeScript)  
- Clean Architecture (Repository & Use Case pattern)  
- MongoDB with Mongoose  
- Socket.IO (real-time chat and booking appointments)  
- WebRTC (video consultation)  
- Cloudinary (media storage)  
- Nodemailer (emails & OTPs)  

**Integrations**
- Razorpay (Payments)  
- Google OAuth2 
- Google Maps API (doctor search via location & live coordinates)
- Firebase (Authentication & Notifications)  

**Deployment**
- Frontend: Vercel  
- Backend: AWS (EC2, Nginx, PM2)  
- Database: MongoDB Atlas  
- Storage: Cloudinary  
