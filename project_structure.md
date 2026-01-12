# Project Structure

## Root Directory
- **README.md**: Project documentation and Roadmap.
- **project_structure.md**: File structure definition.
- **index.html**: Main entry point for the Single Page Application (SPA).
- **admin.html**: Admin dashboard for monitoring participants & prizes.
- **firebase.json**: Firebase Hosting & Firestore configuration.
- **firestore.rules**: Firestore security rules.

## Source Code
### `css/`
- **style.css**: Main stylesheet (Global styles, resets, variables).

### `js/`
- **main.js**: App entry point, state management, game logic.
- **firebase-config.js**: Firebase project configuration.
- **database.js**: Database operations (Firestore / localStorage fallback).

### `assets/`
- **images/**: Backgrounds, Mascot (Horse), Logo, Red Envelope images.
- **icons/**: UI icons (if any).

## Data Models
- **User**: { name, phone, store, product, invoiceId }
- **Prize**: { id, type, name, image, remainingQty }
- **Ticket**: { code, userPhone, prizeId, timestamp }
