# 💬 Realtime Chat Web App

A full-stack **MERN** realtime chat application powered by **Socket.IO**.  
This platform allows users to send private messages, create invite-only chat rooms, and connect with others instantly — all with personalized avatars.


---
![License](https://img.shields.io/github/license/vyshnvv/MERN_ChatApp)

## 🚀 Features

- 🔐 **User Authentication** – Register and log in securely  
- 🧑‍🎨 **Custom Avatars** – Auto-generated avatars using [DiceBear](https://www.dicebear.com/)  
- 💬 **Private Messaging** – One-to-one chat with end-to-end communication  
- 👥 **Invite-Only Chat Rooms** – Create secure rooms and invite specific friends  
- 📡 **Realtime Communication** – Powered by Socket.IO for seamless live chat  
- 🟢 **Online/Offline Status** – See which friends are active  
- 📨 **Message History** – Stores chat history in MongoDB  
- 📱 **Responsive Design** – Works across desktop and mobile devices  

---

## 🧰 Technologies Used

### Frontend
- [React.js](https://reactjs.org/) — UI library  
- [React Router](https://reactrouter.com/) — Navigation and routing  
- [Axios](https://axios-http.com/) — API communication  
- [Socket.IO Client](https://socket.io/) — Realtime communication  

### Backend
- [Node.js](https://nodejs.org/) — JavaScript runtime  
- [Express.js](https://expressjs.com/) — Backend framework  
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — Cloud database  
- [Mongoose](https://mongoosejs.com/) — ODM for MongoDB  
- [Socket.IO](https://socket.io/) — WebSocket-based communication  
- [JWT](https://jwt.io/) — Authentication tokens  
- [bcrypt](https://www.npmjs.com/package/bcrypt) — Password hashing  
- [dotenv](https://www.npmjs.com/package/dotenv) — Environment variables
- [Cloudinary](https://cloudinary.com/) — Cloud image storage & delivery  

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vyshnvv/MERN_ChatApp
cd MERN_ChatApp
```
### 2. Install Dependencies

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 3. Set Up Environment Variables
Create a .env file inside the server/ directory with the following content:

```bash
PORT=5001
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Use ```openssl rand -base64 32``` to create a JWT secret or provide a random string.


### 4. Build the App
From the root directory:

```bash
npm run build
```

### 5. Start Development Servers

Backend (Express + Socket.IO)
```bash
cd backend
npm run dev
```

Frontend (React)
```bash
cd frontend
npm run dev
```

## 🌐 Live Demo
[Check It Out](https://mern-chatapp-lahq.onrender.com)
