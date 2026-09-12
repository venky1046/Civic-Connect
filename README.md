# Civic Connect

**Your Voice. Your City. Our Responsibility.**

A full-stack civic issue reporting and tracking platform. Citizens report problems
(potholes, garbage overflow, water leakage, etc.), see whether others have already
reported the same issue nearby, and track resolution. Admins manage, prioritize, and
resolve complaints, with automatic email notifications at every key step.

---

## 1. Tech Stack

**Backend:** Node.js, Express.js, MySQL (mysql2), JWT, bcrypt, Multer, Nodemailer
**Frontend:** React (Vite), React Router, Tailwind CSS, Recharts, lucide-react, Axios

---

## 2. Project Structure

```
civic-connect/
├── client/           React frontend (Vite)
├── server/           Express backend API
├── database/
│   └── schema.sql    MySQL schema
└── README.md
```

---

## 3. Prerequisites

- Node.js 18+
- MySQL 8+ running locally (or accessible remotely)
- An SMTP-capable email account (e.g. a Gmail account with an "App Password") if you
  want real emails sent. Without this, the app still works fully — emails are logged
  to the server console instead of being sent.

---

## 4. Database Setup

```bash
mysql -u root -p < database/schema.sql
```

This creates the `civic_connect` database and all required tables. The database
starts **completely empty** — no fake users or complaints are seeded.

---

## 5. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your real values:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=civic_connect

JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=admin_inbox@example.com

MAX_UPLOAD_MB=5
DUPLICATE_RADIUS_METERS=150
```

> **Never commit your real `.env` file.** It's already excluded via `.gitignore`.

### Create the admin account

There is no public admin-registration form (by design). Create the first admin from
the command line:

```bash
npm run seed:admin -- "City Admin" admin@example.com "StrongPass123" "9999999999"
```

This inserts a single admin user directly into the database with a securely hashed
password. Use this account to log in to `/login` and reach the Admin Dashboard.

### Run the backend

```bash
npm run dev      # with nodemon, auto-restarts on changes
# or
npm start        # plain node
```

The API will be available at `http://localhost:5000`. Visit
`http://localhost:5000/api/health` to confirm it's running.

---

## 6. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. Vite is pre-configured to proxy
`/api` and `/uploads` requests to `http://localhost:5000`, so no extra frontend env
file is required.

To build for production:

```bash
npm run build
npm run preview
```

---

## 7. Configuring Email (Gmail example)

1. Enable 2-Step Verification on the Gmail account you'll send from.
2. Generate an **App Password**: Google Account → Security → App passwords.
3. Put the Gmail address in `EMAIL_USER` and the 16-character app password in
   `EMAIL_PASSWORD`.
4. Set `ADMIN_EMAIL` to the inbox that should receive new-complaint notifications.

If these variables are left blank, the app **does not crash** — it logs a
`[mailer:DRY-RUN]` line to the server console instead of sending, so you can still
develop and test the full complaint flow without real email credentials.

---

## 8. Testing the Complete Complaint Flow

1. Register a citizen account at `/register`.
2. Go to **Report Issue**, pick a category, fill in details, use "Use My Current
   Location" (or type a location manually), and upload a JPG/PNG photo.
3. Submit. If no similar issue exists nearby, you'll get a new Complaint ID
   (`CC-2026-00001`) and both the admin and your own inbox get an email (or a
   console log, if email isn't configured).
4. Submit a **second** complaint in the same category and a nearby/similar location
   — you should see the "This issue has already been reported" dialog with a
   **Support This Issue** / **Submit as Separate Issue** choice.
5. Log in as the admin (the account created via `seed:admin`), open
   **Admin → All Complaints**, click into the complaint, and move its status forward
   (SUBMITTED → UNDER REVIEW → ASSIGNED → IN PROGRESS → RESOLVED).
6. When you mark it **RESOLVED**, every citizen who reported or supported that issue
   receives a resolution email (or console log).
7. Back on the citizen side, open **Track Complaint** with the Complaint ID — you'll
   see the "Was this issue actually resolved?" feedback buttons.

---

## 9. Security Notes

- Passwords are hashed with bcrypt (never stored in plain text).
- All complaint/support/admin actions use the authenticated user's identity from the
  JWT — a client can never pass its own `user_id` to impersonate someone else.
- Admin-only endpoints are protected by both `requireAuth` and `requireAdmin`
  middleware.
- All SQL queries use parameterized statements (no string concatenation).
- Uploaded files are validated for MIME type (JPG/JPEG/PNG only) and size (≤5MB) on
  the server, not just the client.
- Internal error details are never sent to the client; only safe, generic messages.

---

## 10. Community Priority Rules

Priority is calculated automatically from the number of unique citizens who reported
or supported an issue — it cannot be manually overridden by an admin:

| Citizens reporting | Priority   |
|---------------------|-----------|
| 1–10                | 🟢 LOW     |
| 11–25               | 🟡 MEDIUM  |
| 26–50               | 🟠 HIGH    |
| 51+                 | 🔴 CRITICAL |

---

## 11. Notes on "No Fake Data"

The production database starts empty except for whichever admin account you create
with `npm run seed:admin`. No mock complaints or citizen accounts are inserted by
the application itself.
