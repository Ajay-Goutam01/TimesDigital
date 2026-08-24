# DEMO DATA SEEDING & CLIENT PROPOSAL DATASET

## Overview
This directory provides idempotent, safe scripts to populate and clear realistic **DEMO CONTENT** for **TIME PUBLIC SCHOOL & TIMES DIGITAL**.

The dataset enables the school website, course catalog, batch schedules, faculty directory, Hall of Fame results, photo galleries, video library, campus facilities, event calendar, circulars, testimonials, and CRM lead records to look completely populated and photogenic for client demonstrations, stakeholder walkthroughs, and proposal screenshots.

---

## Commands

### 1. Seed Complete Demo Dataset
To populate all collections with demo data:
```bash
npm run seed:demo
```

### 2. Clear Demo Dataset (Non-Destructive to Real Data)
To remove only demo records (scoped strictly to demo slugs `demo-*`, demo emails `.example`, and demo test records):
```bash
npm run seed:demo:clear
```

---

## Seeded Modules & Record Counts

| Module | Seeded Count | Sample Content Summary |
|---|---|---|
| **Website Settings** | 1 Document | Complete school & coaching branding, phone helplines (`+91 90000 00001`), Google Maps embed, CBSE affiliation placeholder |
| **Homepage CMS** | 1 Document | 16 configured sections with Hero banner, Why Choose Us, 4 Achievement stats, Hostel & Scholarship sections |
| **Courses** | 6 Courses | JEE Main/Advanced Integrated, NEET Medical Excellence, Junior Foundation (8th-10th), Senior Secondary School, JEE Dropper, NEET Achiever |
| **Batches** | 6 Batches | TPS JEE Nurture 2027, TPS NEET Nurture 2027, TPS JEE Enthuse 2026, Foundation Olympiad, JEE Leader, NEET Leader |
| **Faculty** | 8 Profiles | Dr. Arjun Sharma (Ex-Kota Physics), Prof. Rohan Mehta (Math), Dr. Neha Verma (Biology), Prof. Amit Joshi (Chemistry), etc. |
| **Results** | 8 Rankers | JEE Advanced AIR 142 (IIT Bombay), NEET AIR 215 (AIIMS Bhopal), JEE Main 99.78%ile, Board District Rank 1, Olympiad Gold |
| **Gallery Albums** | 5 Albums | Campus Architecture, Annual Day Extravaganza, Science & Robotics Fest, Sports Meet, Kota Seminar |
| **Videos** | 4 Videos | Campus Walkthrough, Kota Pedagogy, Physics Masterclass, NEET Topper Reaction |
| **Facilities** | 6 Facilities | Interactive Smart Classrooms, Science Laboratories, Digital Library, Computer Lab, Sports Arena, Hostel Wing |
| **Events** | 4 Events | Times Talent Scholarship Exam (TTSE), Science Exhibition, Parent Induction, Annual Sports Day |
| **Announcements** | 5 Circulars | Admissions Open 2025-26 (Live Ticker), TTSE Scholarship Notice, Class 11 Batch Launch, Board Practicals, Hostel Notice |
| **Testimonials** | 5 Reviews | 5-Star parent & student reviews from IIT/AIIMS rankers and Foundation parents |
| **Admissions** | 4 Applications | Safe demo applications with application numbers (`TPS-2025-00101`, etc.) and counseling notes |
| **Enquiries (CRM)** | 5 Leads | Leads across `new`, `contacted`, `follow-up`, `converted`, and `closed` statuses |

---

## ImageKit & Media Notes
- All images are structured with standard `{ url, fileId, fileName }` schemas compatible with the ImageKit service and ImageKit folder conventions (`times-school/courses`, `times-school/faculty`, `times-school/gallery`, etc.).
- The demo dataset uses high-resolution, royalty-free educational imagery suitable for high-DPI client displays and PDF proposal generation.

---

## Important Safety Information
- **Idempotent**: Running `npm run seed:demo` multiple times performs upserts based on unique `demo-*` slugs and will not create duplicate items.
- **Privacy & Compliance**: All student and parent names, contact numbers, and emails are fictional demo placeholders (`.example`). No real student personal data or unverified claims are contained in this seed dataset.
