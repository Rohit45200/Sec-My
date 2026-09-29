# TechSym SaJYu-26 — Student ID Card Management System

**Official Digital ID Card Generation & Participant Verification Web Application**  
**Institution:** Sengunthar Engineering College, Tiruchengode, Namakkal District, Tamil Nadu  
**Symposium:** TechSym SaJYu-26 (National Level Technical Symposium)  
**Dates:** 30 September 2026 & 01 October 2026  

---

## 📌 Project Overview

**TechSym SaJYu-26 Student ID Card Management System** is a production-focused MERN full-stack web application designed for students, faculty coordinators, and registration desk volunteers. Participating engineering students from Sengunthar Engineering College and other institutions can register online, upload their passport-style photo, and receive an authentic, verified digital symposium identity card.

The generated ID card features an official college crest, department details, academic year, participant category, convener signature, and a dynamic QR code for swift gate access and lunch/kit verification.

---

## 🚀 Key Features

1. **Student Registration Form**:
   - Mobile-first, responsive registration interface.
   - Client-side auto-compression using HTML5 Canvas to keep photos under 100 KB without quality loss.
   - Strict frontend and backend validations (name, roll number, email, 10-digit mobile, photo).
   - Duplicate registration protection by college register number.

2. **Atomic & Race-Condition Safe Participant ID Generation**:
   - Format: `TS26-<DEPT_CODE>-<SEQ>` (e.g., `TS26-CSE-001`, `TS26-ECE-042`).
   - Uses an atomic counter mechanism (`findOneAndUpdate` with `$inc` in MongoDB) so concurrent registrations never receive duplicate IDs.

3. **Official College Identity Badge**:
   - Styled to match the official Sengunthar Engineering College identity card format.
   - Includes college accreditation badges (Autonomous, NBA, NAAC 'A' Grade), lanyard slot graphic, barcode/security strip, convener signature seal, and dynamic QR code.

4. **Multi-Format Export & Printing**:
   - **Download PNG**: Instant high-DPI image download via `html2canvas`.
   - **Download PDF**: Formatted standard ID badge PDF via `jsPDF`.
   - **Print Card**: Standard browser print dialog with dedicated `@media print` CSS that isolates and centers only the ID card.

5. **Search & Re-Download**:
   - Students who already registered can instantly retrieve and print their ID card using either their Register Number or Participant ID.

6. **QR Code Gate Verification**:
   - Encodes a direct verification link (`/#verify-TS26-CSE-001`).
   - Gate security and volunteers can scan the badge with any mobile camera to view verified delegate status in real-time.

7. **Organizer / Admin Portal**:
   - Passcode-protected (`admin123` by default).
   - Live registration roster with department and year filters.
   - Instant search by student name, roll number, or ID.
   - One-click **Export to CSV** for college records and attendance sheets.
   - Delete / manage registrations.

8. **Zero Downtime Database Resilience**:
   - Connects to MongoDB Atlas when `MONGODB_URI` is provided in `.env`.
   - Automatically activates a memory-backed datastore with identical schema and counter logic if running in preview or offline, guaranteeing 100% operational uptime.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas, Mongoose (with embedded atomic counter schema and resilient store).
- **ID Generation & Export**: QRCode, HTML2Canvas, jsPDF.

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── .env                      # Local environment configuration
├── package.json              # Project dependencies and npm scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler configuration
├── index.html                # HTML entry point with metadata
├── server.ts                 # Express full-stack server entry point (Vite middleware in dev)
├── src/
│   ├── main.tsx              # React mounting root
│   ├── App.tsx               # Primary app controller and view router
│   ├── index.css             # Tailwind and print media queries
│   ├── constants/
│   │   └── symposiumData.ts  # College, event, department, and participant options
│   ├── types/
│   │   └── participant.ts    # Participant and API response TypeScript types
│   ├── services/
│   │   └── api.ts            # Client API connector for backend endpoints
│   ├── utils/
│   │   ├── imageCompressor.ts # Client-side canvas photo compression
│   │   └── idCardExporter.ts  # PNG, PDF, and print export utilities
│   ├── components/
│   │   ├── CollegeLogo.tsx    # SVG college crest & symposium logo
│   │   ├── Header.tsx         # College header & tab navigation
│   │   ├── Footer.tsx         # Official college footer with venue/contact
│   │   ├── RegistrationForm.tsx # Student registration form
│   │   ├── IdCard.tsx         # Digital ID card graphic badge
│   │   ├── IdCardModal.tsx    # ID card display, download, and print view
│   │   ├── SearchIdCard.tsx   # Search existing card by Register No / ID
│   │   ├── VerificationView.tsx # Gate checkpoint QR verification screen
│   │   └── AdminDashboard.tsx # Organizer roster, filters, and CSV export
│   └── server/
│       ├── db.ts              # MongoDB Atlas connection manager & atomic counter
│       ├── models/
│       │   ├── Participant.ts # Mongoose Participant schema
│       │   └── Counter.ts     # Mongoose atomic sequence counter schema
│       └── routes/
│           └── participantRoutes.ts # REST API routes & controllers
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

# MongoDB Atlas URI (leave empty for automatic in-memory mode during local testing)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/techsym26?retryWrites=true&w=majority"

# Passcode for symposium staff/admin portal
ADMIN_PASSCODE="admin123"

# Frontend API URL (empty defaults to /api on same host)
VITE_API_URL=""
```

---

## 💻 Local Setup & Execution

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/techsym-sajyu-26.git
cd techsym-sajyu-26
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server and database status check |
| `POST` | `/api/participants` | Register student, validate input, generate atomic ID, save |
| `GET` | `/api/participants/:id` | Look up participant by Participant ID or Register Number |
| `GET` | `/api/verify/:participantId` | Public gate verification for QR code scanners |
| `GET` | `/api/participants` | Admin list with filters (`search`, `department`, `year`) |
| `DELETE` | `/api/participants/:id` | Admin delete endpoint (`x-admin-passcode` required) |

---

## 🌐 Free-Tier Deployment Guide

### Deploying on Render (Free Tier):
1. Push repository to GitHub.
2. Create a new **Web Service** on [Render.com](https://render.com).
3. Connect your GitHub repository.
4. Set Build Command: `npm install && npm run build`
5. Set Start Command: `npm start`
6. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default)
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>`
   - `ADMIN_PASSCODE`: `<Your chosen admin passcode>`

### Setting Up Free MongoDB Atlas:
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a database user and password under **Database Access**.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere).
4. Copy the connection string into `MONGODB_URI`.

---

## 🔒 Security & Data Integrity Notes

- All student inputs are trimmed, sanitized, and type-checked on both frontend and backend.
- College register numbers are converted to uppercase and indexed to strictly prohibit duplicate registrations.
- Student photos are compressed to under 100 KB on the client side before transmission, preventing network spikes and database bloat.
- Sensitive administrative routes require the configured `x-admin-passcode`.
- Sensitive database credentials are never committed to version control and remain purely in server environment variables.
