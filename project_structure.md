# Project Structure

## Root Directory
- **README.md**: Project documentation and Roadmap.
- **project_structure.md**: File structure definition.
- **index.html**: Main entry point for the Single Page Application (SPA).

## Source Code
### `css/`
- **style.css**: Main stylesheet (Global styles, resets, variables).
- **animations.css**: Keyframes and animation classes.
- **responsive.css**: Media queries for mobile/tablet optimization.

### `js/`
- **main.js**: App entry point, state management.
- **form.js**: Form handling and validation logic.
- **game.js**: Game loop, animation control, and prize logic.
- **data.js**: Mock data and data storage helpers (localStorage).

### `assets/`
- **images/**: Backgrounds, Character (Horse), Logos, Red Envelope images, Prize images.
- **icons/**: UI icons.

## Data Models
- **User**: { name, phone, store, product, invoiceId }
- **Prize**: { id, type, name, image, remainingQty }
- **Ticket**: { code, userPhone, prizeId, timestamp }
