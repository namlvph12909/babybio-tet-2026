# CHƯƠNG TRÌNH QUAY SỐ MAY MẮN – TẾT VUI, TẾT ẤM BABYBIO (03/2026)

## Overview
A Lucky Draw web application for Babybio's Tet campaign. Users scan a QR code, enter their purchase details, and participate in an interactive "Red Envelope" (Lì xì) picking game to win prizes.

## Requirements
- **Platform:** Web (Mobile-first).
- **Design:** Tet theme (Red/Yellow) + Babybio Brand (Pink/Green). Modern, dynamic animations.
- **Process:**
  1. Landing Page (Welcome).
  2. Form Submission (Name, Phone, Store, Product, Invoice).
  3. Validation (1 turn per invoice/can).
  4. Interactive Game (Horse character + Falling Envelopes).
  5. Result Display (Prize + Code).

## Tech Stack
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla).
- **Backend:** Firebase (Firestore Database + Hosting).
- **Libraries:** QRCode.js (QR Generation).

## Roadmap

### Phase 1: Business Analysis (BA) & Setup ✅
- [x] Analyze Requirements from Google Doc.
- [x] Create Project Structure & Documentation.
- [x] Define detailed Data Model (User, Prize, Turn).
- [x] Define UI/UX Flow & Assets List.

### Phase 2: Development (DEV) - Frontend ✅
- [x] **Step 1: Scaffolding**
    - [x] Setup HTML structure.
    - [x] Setup Basic CSS variables (Design System).
- [x] **Step 2: UI Implementation**
    - [x] Landing Page (Hero section).
    - [x] Registration Form.
    - [x] Game Interface (Animation layer).
    - [x] Result Popup.
- [x] **Step 3: Logic Implementation**
    - [x] Form Validation.
    - [x] "Lucky Draw" Logic (Randomizer with probability).
    - [x] Game Loop (Animations, Interaction).
    - [x] Prize Code Generation (BB-TET-XXXXXX).

### Phase 3: Quality Control (QC) & Polish ✅
- [x] **Step 4: Aesthetics & Polish**
    - [x] Add Micro-animations (Hover, Click, Entry).
    - [x] Optimize for Mobile.
    - [x] Ensure "Wow" factor.
- [x] **Step 5: Testing**
    - [x] Test Flow (Happy Code).
    - [x] Test Validation (Edge cases).

### Phase 4: Backend & Database ✅
- [x] **Step 6: Firebase Setup**
    - [x] Initialize Firebase Project (User needs to create on console.firebase.google.com).
    - [x] Configure Firestore Database (`firebase.json`, `firestore.rules`).
    - [x] Integrate Firebase SDK into Frontend.
- [x] **Step 7: Database Logic** (`js/database.js`)
    - [x] Save customer information to Firestore.
    - [x] Check & lock used invoices (1 invoice = 1 turn).
    - [x] Manage prize inventory (deduct quantity on win).
    - [x] Save winning tickets (code, user, prize, timestamp).
- [x] **Step 8: QR Code Generation**
    - [x] Generate QR for landing page URL (in `admin.html`).
    - [x] Generate QR for prize code on result screen.
- [x] **Step 9: Admin Dashboard** (`admin.html`)
    - [x] Create admin.html page.
    - [x] Display list of participants & winners.
    - [x] Show prize inventory status.

### Phase 5: Deployment ✅
- [x] **Step 10: Deploy to Firebase Hosting**
    - [x] Install Firebase CLI.
    - [x] Deploy project to live URL.
    - [x] **Live URLs:**
        - Main: https://babybio-web.web.app
        - Admin: https://babybio-web.web.app/admin.html

## How to Run (Development)
1. Navigate to the project folder.
2. Open `index.html` in your web browser (Chrome/Edge recommended).
3. Use mobile view (F12 -> Toggle Device Toolbar) for the best experience.

## How to Run (Production)
1. Setup Firebase project and update `js/firebase-config.js`.
2. Run `firebase deploy` to publish to the web.
3. Share the QR code or URL with customers.
