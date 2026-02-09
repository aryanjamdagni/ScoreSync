# ScoreSync

ScoreSync is a full-stack, role-based **Store Rating & Management System** built using the **MERN stack**.  
It allows administrators to manage stores and users, store owners to monitor ratings, and users to browse and rate stores — all through a modern, responsive UI.

---

## Features

### Admin
- Manage stores (create, list, filter, sort)
- Manage users and roles
- View platform statistics
- Role-based access control

### Store Owner
- View store dashboard
- Receive real-time notifications on ratings
- Monitor store performance

### User
- Browse stores
- Rate stores
- View average ratings

### Notifications
- Real-time notifications using Socket.IO
- Persistent notifications stored in MongoDB
- Mark notifications as read

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion
- Axios
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO
- Zod (request validation)

---

## Project Structure

ScoreSync/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── utils/
│ │ ├── socket.js
│ │ ├── app.js
│ │ └── server.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ ├── context/
│ │ ├── hooks/
│ │ ├── pages/
│ │ ├── utils/
│ │ └── main.jsx
│ └── package.json
│
└── README.md


---

## Authentication & Roles

Authentication is handled using **JWT tokens**.

Supported roles:
- `ADMIN`
- `OWNER`
- `USER`

All protected routes are validated on both frontend and backend.

---

## Environment Variables

### Backend (`backend/.env`)
PORT=Your desired port for the backend 
NODE_ENV=development

MONGO_URI=Your MongoDB connection string

JWT_ACCESS_SECRET=Your JWT secret key
JWT_ACCESS_EXPIRES=Time until access token expires (e.g., 15m)  


FRONTEND_URL=URL of the frontend 
CORS_ORIGINS=URLs allowed for CORS 


### Frontend (`frontend/.env`)
VITE_API_BASE_URL=URL of the backend API 


---

## Running the Project Locally

### Clone the Repository
git clone 
cd scoresync


### Start Backend
cd backend
npm install
npm run dev


Backend runs on:
http://localhost:5000


### Start Frontend
cd frontend
npm install
npm run dev


Frontend runs on:
http://localhost:5173


---

## Admin Role Setup

After registering a user, promote them to admin using MongoDB:

db.users.updateOne(
{ email: "admin@test.com" },
{ $set: { role: "ADMIN" } }
)


Log out and log in again to refresh the token.

---

## Real-Time Notifications

- Implemented using Socket.IO
- Triggered on:
  - New store ratings
  - Store owner registration
- Delivered instantly if user is online
- Stored persistently if offline

---

## UI Highlights

- Glass-morphism inspired design
- Fully responsive layout
- Sidebar collapse support
- Consistent spacing and typography
- Smooth animations with Framer Motion

---

## Security

- JWT validation on protected routes
- Role-based authorization
- Input validation with Zod
- Rate limiting and secure headers
- Centralized error handling

---

## Future Improvements

- Assign store owners from admin panel
- Pagination for large datasets
- Analytics dashboards
- Email notifications
- Theme customization

---

## License

This project is licensed under the MIT License.

---

## Author

Aryan Jamdagni  
Full-Stack MERN Developer
