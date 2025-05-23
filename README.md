# 🚆 IRCTC Railway Management System API

A complete Node.js + MySQL railway booking system API with:
- ✅ User registration/login
- 🚉 Admin train management
- 📈 Real-time seat availability
- 🔒 JWT auth & admin API key protection
- ⚔️ Race condition-safe bookings

---

## 📋 Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MySQL](https://dev.mysql.com/downloads/mysql/) 8.0+
- Git

---

## 🛠 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/irctc-railway-system.git
cd irctc-railway-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. MySQL Database Setup
```bash
mysql -u root -p
CREATE DATABASE world;
EXIT;
```

### 4. Configure Environment
Create a `.env` file in the root:

```env
PORT=3000
DB_URL=mysql://root:Aryan%40%23123@localhost:3306/world
JWT_SECRET=your_secure_secret
ADMIN_API_KEY=your_admin_key
```

---

## 🏃‍♂️ Running the Project

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 📊 Database Initialization
When the server starts, Sequelize will:
- Create required tables
- Apply constraints
- Sync model relationships

---

## 🌐 API Endpoints

### 👤 User Routes
| Method | Endpoint                | Description               |
|--------|--------------------------|---------------------------|
| POST   | `/api/user/register`     | Register a new user       |
| POST   | `/api/user/login`        | Login and get JWT         |
| GET    | `/api/user/availability` | Get train & seat details  |
| POST   | `/api/user/book`         | Book a train seat         |
| GET    | `/api/user/booking/:id`  | View a specific booking   |

### 🛠 Admin Routes
| Method | Endpoint                     | Description               |
|--------|-------------------------------|---------------------------|
| POST   | `/api/admin/train`            | Add a new train           |
| PUT    | `/api/admin/train/:id/seats`  | Update available seats    |

---

## 🧪 Testing (Optional)
To run any test cases or seeders:
```bash
npm test
```

---

## 🛡️ Security Features
- JWT-based user authentication
- Admin-only access via API key (header: `x-api-key`)
- Passwords hashed using `bcrypt`
- Input validation & SQL injection safety
- Seat booking race condition protection (row-level locks)

---
