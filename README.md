# User Registration API

A full-stack user registration and authentication application built with **FastAPI** (backend) and **React + Vite** (frontend).

---

## 🗂️ Project Structure

```
.
├── back-end/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── src/
│       ├── api/
│       │   ├── routes/
│       │   │   ├── auth.py
│       │   │   └── user.py
│       │   └── schemas/
│       │       └── schemas.py
│       ├── core/
│       │   ├── generate_id.py
│       │   ├── security_password.py
│       │   └── token_jwt.py
│       ├── database/
│       │   ├── connection.py
│       │   └── repository.py
│       └── utils/
│           └── email.py
└── front-end/
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx
        ├── services/
        │   ├── api.js
        │   ├── authService.js
        │   └── userService.js
        └── utils/
            └── auth.js
```

---

## Backend

### Tech Stack

| Tool | Purpose |
|---|---|
| FastAPI | Web framework |
| Uvicorn | ASGI server |
| Motor | Async MongoDB driver |
| MongoDB | Database |
| Passlib[bcrypt] | Password hashing |
| python-jose | JWT token handling |
| python-dotenv | Environment variables |
| Pydantic | Data validation |
| smtplib | Email sending |

### User Data Model

| Field | Type | Description |
|---|---|---|
| `id` | UUID4 | Unique identifier |
| `name` | string | Full name |
| `email` | string | Email address |
| `telephone` | string | Phone number |
| `password` | string | Bcrypt hash |
| `created_at` | datetime (UTC) | Account creation date |
| `is_active` | bool | Account status (default: `True`) |
| `account_deletion_code` | int | Temporary 6-digit deletion code |

### API Routes

#### Auth — `/auth`

| Method | Route | Description | Auth required |
|---|---|---|---|
| POST | `/register` | Register a new user | ❌ |
| POST | `/login` | Authenticate and receive JWT token | ❌ |

#### User — `/user`

| Method | Route | Description | Auth required |
|---|---|---|---|
| GET | `/` | Get current user data | ✅ |
| PATCH | `/name` | Update name | ✅ |
| PATCH | `/phone` | Update phone number | ✅ |
| PATCH | `/email` | Update email | ✅ |
| PATCH | `/password` | Update password | ✅ |
| POST | `/delete/request` | Request account deletion (sends code via email) | ✅ |
| POST | `/delete/confirm` | Confirm account deletion with code | ✅ |

Swagger link: http://localhost:8000/docs

### Setup

**1. Clone the repository and switch to the backend branch:**
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/back-end
```

**2. Create and activate a virtual environment:**
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\activate     # Windows
```

**3. Install dependencies:**
```bash
pip install -r requirements.txt
```

**4. Configure environment variables:**
```bash
cp .env.example .env
# Fill in the values in .env
```

**5. Run the server:**
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### Environment Variables

See `.env.example` for all required variables:

```env
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_password
```

---

##  Frontend

### Tech Stack

| Tool | Purpose |
|---|---|
| React + Vite | UI framework and build tool |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| React Router DOM | Client-side routing |
| Plus Jakarta Sans | Font (Google Fonts) |

### Pages

| Page | Route | Description |
|---|---|---|
| `Login.jsx` | `/login` | User login form |
| `Register.jsx` | `/register` | User registration form |
| `Dashboard.jsx` | `/dashboard` | User profile and account management |

The Dashboard features a sidebar with three sections:
- **Perfil** — displays current user data
- **Conta** — edit name, phone, and email
- **Segurança** — change password and delete account

### Setup

**1. Navigate to the frontend folder:**
```bash
cd your-repo/front-end
```

**2. Install dependencies:**
```bash
npm install
```

**3. Configure environment variables:**
```bash
cp .env.example .env
# Fill in the values in .env
```

**4. Run the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

```env
VITE_API_URL=http://localhost:8000
```

---

## Authentication

- Tokens are JWT-based with a **30-minute expiry**.
- The token is stored in `localStorage` under the key `token`.
- All protected routes receive the token via an Axios interceptor that automatically injects the `Authorization: Bearer <token>` header.

---

## Branches

| Branch | Description |
|---|---|
| `main` | Stable, production-ready code |
| `back-end` | Backend development |
| `front-end` | Frontend development |

---

## License

This project is for educational purposes.
