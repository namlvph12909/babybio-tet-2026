/**
 * Database Module - Firebase Firestore Integration
 * Handles all data operations for the Lucky Draw app
 */

// Initialize Firestore instance (will be set after Firebase loads)
let db = null;

/**
 * Initialize Firebase and Firestore
 * Must be called after Firebase SDK is loaded
 */
function initDatabase() {
    if (!window.IS_FIREBASE_CONFIGURED || !window.IS_FIREBASE_CONFIGURED()) {
        console.warn('Firebase not configured. Running in DEMO mode with localStorage.');
        return false;
    }

    try {
        firebase.initializeApp(window.FIREBASE_CONFIG);
        db = firebase.firestore();
        console.log('Firebase initialized successfully!');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

/**
 * Check if an invoice has been used
 * @param {string} invoiceId - The invoice number to check
 * @returns {Promise<boolean>} - True if invoice already used
 */
async function isInvoiceUsed(invoiceId) {
    if (!db) {
        // Fallback to localStorage for demo
        const used = JSON.parse(localStorage.getItem('babybio_used_invoices') || '[]');
        return used.includes(invoiceId);
    }

    const doc = await db.collection('used_invoices').doc(invoiceId).get();
    return doc.exists;
}

/**
 * Mark an invoice as used
 * @param {string} invoiceId - The invoice number to mark
 * @param {object} userData - User data associated with this invoice
 */
async function markInvoiceUsed(invoiceId, userData) {
    if (!db) {
        // Fallback to localStorage for demo
        const used = JSON.parse(localStorage.getItem('babybio_used_invoices') || '[]');
        used.push(invoiceId);
        localStorage.setItem('babybio_used_invoices', JSON.stringify(used));
        return;
    }

    await db.collection('used_invoices').doc(invoiceId).set({
        usedAt: firebase.firestore.FieldValue.serverTimestamp(),
        userPhone: userData.phone
    });
}

/**
 * Get current prize inventory
 * @returns {Promise<object>} - Prize inventory with remaining quantities
 */
async function getPrizeInventory() {
    const defaultInventory = {
        'v50': { name: 'Voucher 50.000đ', remaining: 100, total: 100 },
        'v100': { name: 'Voucher 100.000đ', remaining: 100, total: 100 },
        'v150': { name: 'Voucher 150.000đ', remaining: 100, total: 100 },
        'doudou': { name: 'Thỏ Doudou Babybio', remaining: 100, total: 100 },
        'bear': { name: 'Gấu bông Babybio', remaining: 100, total: 100 }
    };

    if (!db) {
        // Fallback to localStorage for demo
        const stored = localStorage.getItem('babybio_inventory');
        if (!stored) {
            localStorage.setItem('babybio_inventory', JSON.stringify(defaultInventory));
            return defaultInventory;
        }
        return JSON.parse(stored);
    }

    const doc = await db.collection('config').doc('prize_inventory').get();
    if (!doc.exists) {
        // Initialize inventory in Firestore
        await db.collection('config').doc('prize_inventory').set(defaultInventory);
        return defaultInventory;
    }
    return doc.data();
}

/**
 * Deduct prize from inventory
 * @param {string} prizeId - The prize ID to deduct
 * @returns {Promise<boolean>} - True if successfully deducted
 */
async function deductPrize(prizeId) {
    if (!db) {
        // Fallback to localStorage for demo
        const inventory = await getPrizeInventory();
        if (inventory[prizeId] && inventory[prizeId].remaining > 0) {
            inventory[prizeId].remaining--;
            localStorage.setItem('babybio_inventory', JSON.stringify(inventory));
            return true;
        }
        return false;
    }

    const inventoryRef = db.collection('config').doc('prize_inventory');

    try {
        await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(inventoryRef);
            const data = doc.data();

            if (data[prizeId] && data[prizeId].remaining > 0) {
                transaction.update(inventoryRef, {
                    [`${prizeId}.remaining`]: data[prizeId].remaining - 1
                });
            } else {
                throw new Error('Prize out of stock');
            }
        });
        return true;
    } catch (error) {
        console.error('Failed to deduct prize:', error);
        return false;
    }
}

/**
 * Save a winning ticket
 * @param {object} ticket - Ticket data
 * @returns {Promise<string>} - The ticket ID
 */
async function saveTicket(ticket) {
    const ticketData = {
        code: ticket.code,
        prizeId: ticket.prizeId,
        prizeName: ticket.prizeName,
        userName: ticket.userName,
        userPhone: ticket.userPhone,
        store: ticket.store,
        product: ticket.product,
        invoiceId: ticket.invoiceId,
        createdAt: new Date().toISOString()
    };

    if (!db) {
        // Fallback to localStorage for demo
        const tickets = JSON.parse(localStorage.getItem('babybio_tickets') || '[]');
        tickets.push(ticketData);
        localStorage.setItem('babybio_tickets', JSON.stringify(tickets));
        return ticket.code;
    }

    ticketData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const docRef = await db.collection('tickets').add(ticketData);
    return docRef.id;
}

/**
 * Get all tickets (for admin)
 * @returns {Promise<Array>} - List of all tickets
 */
async function getAllTickets() {
    if (!db) {
        // Fallback to localStorage for demo
        return JSON.parse(localStorage.getItem('babybio_tickets') || '[]');
    }

    const snapshot = await db.collection('tickets')
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// Export functions
window.DB = {
    init: initDatabase,
    isInvoiceUsed,
    markInvoiceUsed,
    getPrizeInventory,
    deductPrize,
    saveTicket,
    getAllTickets
};
