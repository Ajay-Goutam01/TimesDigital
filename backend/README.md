# TIME PUBLIC SCHOOL & TIMES DIGITAL - Backend Server

Production-ready, modular, and dynamic CMS + School & Competitive Coaching Management Backend for **TIME PUBLIC SCHOOL, Shahdol, Madhya Pradesh** and its coaching division **TIMES DIGITAL** (IIT-JEE / NEET / Foundation / School Integrated Coaching).

---

## 🚀 Key Features

* **ES Modules Architecture (`"type": "module"`)**: Clean, modern ES6+ JavaScript.
* **Zero Credentials in `.env`**: Admin credentials are never stored in environment variables or configuration files. Admins are created exclusively through secure CLI seeding.
* **Cryptographically Secure Password Generation**: Random temporary passwords generated via Node.js `crypto` (`crypto.randomInt`), shown only once in the terminal and stored exclusively as bcrypt hashes in MongoDB.
* **First-Login Forced Password Change**: When an admin logs in with a temporary password (`mustChangePassword: true`), all CMS management APIs are strictly blocked with error code `PASSWORD_CHANGE_REQUIRED` until they set a new permanent password.
* **Developer-Controlled Password Reset (`npm run admin:reset`)**: When an admin forgets their password, the developer generates a new temporary password from the CLI. No insecure public reset links or OTP bypasses exist.
* **Dynamic CMS Centralization**: School branding, contact numbers (Tel / WhatsApp), Google Maps embed & coordinates, social media links, and global notice banners can be dynamically updated by admin without modifying code.
* **Homepage CMS Section Manager**: Enable/disable sections (`isVisible`), reorder sections, edit hero sliders, statistics counter, and call-to-action banners from the admin dashboard.
* **Target Batches & Courses Module**: Support for IIT-JEE, NEET, Foundation, and Integrated batches (`TPS JEE Target 2027`, etc.) with class level, faculty assignment, fee structures, scholarship information, brochure uploads, and dynamic SEO slugs.
* **Faculty Management CMS**: Faculty profiles with ImageKit photo upload, Kota & national qualifications, subjects, and category filters.
* **Results & Hall of Fame**: Top rankers in JEE Main, JEE Advanced, NEET, and Board exams with scores, percentiles, and photo storage.
* **Gallery & Video CMS**: Multi-image album management and video references (Campus, Lab, Coaching, Achievements) with ImageKit integration.
* **Announcements, Events & Facilities**: Priority-based circulars, event registrations, and smart classroom/hostel/lab infrastructure features.
* **Admissions & Lead CRM (Enquiries)**: Online admissions application tracking and lead capture directly associated with batches/courses with admin follow-up notes.
* **Admin Dashboard Analytics**: `/api/admin/dashboard/stats` aggregating real-time counts, new leads, and recent admissions.
* **Security & Authentication**: JWT stored in `httpOnly` secure cookies, bcryptjs password hashing, role-based protection (`superadmin`, `admin`), Helmet, and CORS whitelisting.
* **Cloud Media Storage**: ImageKit SDK integration with memory buffer streaming via Multer and automatic file cleanup on deletion.

---

## 🛠️ Technology Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB & Mongoose
* **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
* **Media / Image Hosting**: ImageKit SDK
* **File Upload**: Multer (Memory Storage)
* **Security**: Helmet, Cookie Parser, CORS
* **Validation**: Express Validator
* **Logger**: Morgan

---

## 📁 Directory Structure

```
backend/
├── app.js                          # Express application configuration & route binding
├── server.js                       # Server entry point & database connection
├── package.json
├── .env.example
├── .env
├── .gitignore
├── README.md
│
├── config/
│   ├── db.js                       # MongoDB connection
│   └── imagekit.js                 # ImageKit SDK client
│
├── controllers/
│   ├── auth.controller.js          # Admin login, logout, me, profile, change password
│   ├── admin.controller.js         # Super Admin user management
│   ├── websiteSettings.controller.js # Centralized settings & contact details
│   ├── homepage.controller.js      # Homepage dynamic sections CMS
│   ├── course.controller.js        # Academic courses management
│   ├── batch.controller.js         # Coaching & school batches management
│   ├── faculty.controller.js       # Faculty CMS
│   ├── result.controller.js        # Exam results & rankers CMS
│   ├── gallery.controller.js       # Photo albums CMS
│   ├── video.controller.js         # Video library CMS
│   ├── announcement.controller.js  # Circulars & notice board
│   ├── event.controller.js         # School & coaching events
│   ├── facility.controller.js      # Infrastructure & facilities
│   ├── testimonial.controller.js   # Student/parent testimonials
│   ├── admission.controller.js     # Online admission applications
│   ├── enquiry.controller.js       # Lead capture & enquiry CRM
│   └── dashboard.controller.js     # Aggregated dashboard metrics
│
├── models/
│   ├── admin.model.js              # Admin schema (mustChangePassword, bcrypt hash)
│   ├── websiteSettings.model.js
│   ├── homepage.model.js
│   ├── course.model.js
│   ├── batch.model.js
│   ├── faculty.model.js
│   ├── result.model.js
│   ├── gallery.model.js
│   ├── video.model.js
│   ├── announcement.model.js
│   ├── event.model.js
│   ├── facility.model.js
│   ├── testimonial.model.js
│   ├── admission.model.js
│   └── enquiry.model.js
│
├── routes/
│   ├── auth.routes.js              # /api/auth
│   ├── admin.routes.js             # /api/admin/users
│   ├── websiteSettings.routes.js   # /api/website-settings
│   ├── homepage.routes.js          # /api/homepage
│   ├── course.routes.js            # /api/courses
│   ├── batch.routes.js             # /api/batches
│   ├── faculty.routes.js           # /api/faculty
│   ├── result.routes.js            # /api/results
│   ├── gallery.routes.js           # /api/gallery
│   ├── video.routes.js             # /api/videos
│   ├── announcement.routes.js      # /api/announcements
│   ├── event.routes.js             # /api/events
│   ├── facility.routes.js          # /api/facilities
│   ├── testimonial.routes.js       # /api/testimonials
│   ├── admission.routes.js         # /api/admissions
│   ├── enquiry.routes.js           # /api/enquiries
│   └── dashboard.routes.js         # /api/admin/dashboard
│
├── middlewares/
│   ├── auth.middleware.js          # JWT verification & requirePasswordChanged check
│   ├── admin.middleware.js         # Role-based authorization (superadmin, admin)
│   ├── upload.middleware.js        # Multer memory storage
│   ├── validation.middleware.js    # Express-validator error handler
│   ├── error.middleware.js         # Centralized error handler with error codes
│   └── notFound.middleware.js      # 404 handler
│
├── services/
│   ├── imagekit.service.js         # Upload, multi-upload, and deletion from ImageKit
│   └── slug.service.js             # Unique SEO slug generator
│
├── utils/
│   ├── ApiError.js                 # Standardized error class with error code support
│   ├── ApiResponse.js              # Standardized response wrapper
│   ├── asyncHandler.js             # Async route handler wrapper
│   ├── generatePassword.js         # Cryptographically secure random password generator
│   ├── generateSlug.js             # Slug formatter
│   └── constants.js                # App constants & categories
│
└── scripts/
    ├── seedAdmin.js                # Interactive CLI admin creation
    └── resetAdminPassword.js       # Developer-controlled CLI password reset
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory (Note: No admin credentials stored here):

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000,http://localhost:5173

# Database
MONGO_URI=mongodb://127.0.0.1:27017/times_digital_db

# Security / JWT
JWT_SECRET=your_super_secret_jwt_key_times_digital_production_2025
JWT_EXPIRES_IN=7d
COOKIE_SECRET=your_secure_cookie_signing_secret_phrase

# ImageKit Storage
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

---

## 🔐 Admin Lifecycle & Password Management

### 1. Interactive Admin Creation
Run the interactive CLI seed script:
```bash
npm run seed:admin
```
1. Prompts for the Admin Email interactively.
2. Checks for duplicates in MongoDB.
3. Generates a cryptographically secure random temporary password.
4. Stores the bcrypt hash in MongoDB with `mustChangePassword: true`.
5. Displays the temporary password **only once** in the terminal.

### 2. First Login & Forced Password Change
1. Admin logs in with the temporary password via `POST /api/auth/login`.
2. Login response returns `{ mustChangePassword: true, ... }`.
3. If the admin attempts to access any CMS or Admin API before changing the password, the request is blocked with HTTP `403 Forbidden` and `code: "PASSWORD_CHANGE_REQUIRED"`.
4. Admin submits new password to `PATCH /api/auth/change-password` (or `POST /api/auth/change-password`).
5. Password is updated, `mustChangePassword` is set to `false`, and a fresh JWT is issued granting full dashboard access.

### 3. Developer-Controlled Password Reset
If an admin forgets their password, the developer runs:
```bash
npm run admin:reset
```
1. Prompts for the Admin Email.
2. Generates a new random temporary password.
3. Updates the database, hashes the password, and resets `mustChangePassword: true`.
4. Shows the temporary password once in terminal for the developer to provide securely to the admin.

---

## 📦 Running the Server

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Start production server:
   ```bash
   npm start
   ```

---

## 🔗 Key API Endpoints Summary

### Authentication
* `POST /api/auth/login` - Admin login (sets `httpOnly` cookie, checks `mustChangePassword`)
* `POST /api/auth/logout` - Admin logout (clears cookie)
* `GET /api/auth/me` - Get current admin profile (Accessible during password change state)
* `PATCH /api/auth/change-password` - Set permanent password (Clears `mustChangePassword` flag)
* `POST /api/auth/change-password` - Alternative endpoint for password change
* `PATCH /api/auth/profile` - Update admin profile/avatar (Requires active permanent password)

### Admin CMS & Management (Blocked until `mustChangePassword === false`)
* `GET /api/admin/dashboard/stats` - Dashboard analytics
* `GET /api/admin/users` - Sub-admin user management (Superadmin only)
* `PUT /api/website-settings` - Update centralized contact & branding
* `PUT /api/homepage` - Update dynamic homepage sections & banners
* `POST /api/batches`, `PUT /api/batches/:id`, `DELETE /api/batches/:id`
* `POST /api/courses`, `PUT /api/courses/:id`, `DELETE /api/courses/:id`
* `POST /api/faculty`, `PUT /api/faculty/:id`, `DELETE /api/faculty/:id`
* `POST /api/results`, `PUT /api/results/:id`, `DELETE /api/results/:id`
* `POST /api/gallery`, `PUT /api/gallery/:id`, `DELETE /api/gallery/:id`
* `POST /api/videos`, `PUT /api/videos/:id`, `DELETE /api/videos/:id`
* `GET /api/admissions`, `PATCH /api/admissions/:id/status`
* `GET /api/enquiries`, `PATCH /api/enquiries/:id/status`
