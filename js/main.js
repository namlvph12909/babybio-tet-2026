document.addEventListener('DOMContentLoaded', async () => {
    // --- Initialize Database ---
    const isFirebaseMode = window.DB && window.DB.init();
    console.log(isFirebaseMode ? '🔥 Firebase Mode' : '💾 Demo Mode (localStorage)');

    // --- State & Config ---
    const CONFIG = {
        screens: ['welcome', 'form', 'game', 'result'],
        prizes: [
            { id: 'v50', name: 'Voucher 50.000đ', type: 'voucher', prob: 0.4, image: 'assets/images/envelope.png' },
            { id: 'v100', name: 'Voucher 100.000đ', type: 'voucher', prob: 0.25, image: 'assets/images/envelope.png' },
            { id: 'v150', name: 'Voucher 150.000đ', type: 'voucher', prob: 0.15, image: 'assets/images/envelope.png' },
            { id: 'doudou', name: 'Thỏ Doudou Babybio', type: 'gift', prob: 0.1, image: 'assets/images/envelope.png' },
            { id: 'bear', name: 'Gấu bông Babybio', type: 'gift', prob: 0.1, image: 'assets/images/envelope.png' }
        ]
    };

    let currentUser = null;
    let prizeInventory = null;

    // Load prize inventory on start
    if (window.DB) {
        prizeInventory = await window.DB.getPrizeInventory();
    }

    // --- DOM Elements ---
    const screens = {};
    CONFIG.screens.forEach(s => screens[s] = document.getElementById(`screen-${s}`));

    const btnStart = document.getElementById('btn-start');
    const formEntry = document.getElementById('entry-form');
    const sky = document.getElementById('envelopes-sky');
    const btnHome = document.getElementById('btn-home');
    const qrContainer = document.getElementById('qr-container');

    // --- Navigation ---
    function showScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[screenName].classList.add('active');
    }

    // --- Event Listeners ---
    btnStart.addEventListener('click', () => showScreen('form'));

    btnHome.addEventListener('click', () => {
        formEntry.reset();
        showScreen('welcome');
    });

    formEntry.addEventListener('submit', handleFormSubmit);

    // --- Form Handling ---
    async function handleFormSubmit(e) {
        e.preventDefault();

        const invoice = document.getElementById('invoice').value.trim();
        const submitBtn = formEntry.querySelector('button[type="submit"]');

        // Disable button while processing
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang xử lý...';

        try {
            // Validation: Check if invoice used
            const isUsed = window.DB
                ? await window.DB.isInvoiceUsed(invoice)
                : JSON.parse(localStorage.getItem('babybio_used_invoices') || '[]').includes(invoice);

            if (isUsed) {
                alert('Hóa đơn này đã được sử dụng để quay thưởng!');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Xác nhận & Quay';
                return;
            }

            // Save User Info (In memory)
            currentUser = {
                name: document.getElementById('fullname').value,
                phone: document.getElementById('phone').value,
                store: document.getElementById('store').value,
                product: document.getElementById('product').value,
                invoice: invoice
            };

            // Mark invoice as used
            if (window.DB) {
                await window.DB.markInvoiceUsed(invoice, currentUser);
            } else {
                const used = JSON.parse(localStorage.getItem('babybio_used_invoices') || '[]');
                used.push(invoice);
                localStorage.setItem('babybio_used_invoices', JSON.stringify(used));
            }

            // Transition to Game
            showScreen('game');
            startGame();
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Xác nhận & Quay';
        }
    }

    // --- Game Logic ---
    let gameInterval;

    function startGame() {
        sky.innerHTML = ''; // Clear previous

        // Spawn envelopes continuously
        gameInterval = setInterval(spawnEnvelope, 600);
    }

    function spawnEnvelope() {
        const env = document.createElement('img');
        env.src = 'assets/images/envelope.png';
        env.classList.add('falling-envelope');

        // Random Position
        const left = Math.random() * 90;
        env.style.left = `${left}%`;

        // Start from top
        env.style.top = '-100px';

        // Random Size
        const size = 40 + Math.random() * 40;
        env.style.width = `${size}px`;

        // Random Rotation
        const rot = Math.random() * 360;
        env.style.transform = `rotate(${rot}deg)`;

        // Fall Animation
        env.style.transition = `top ${3 + Math.random()}s linear`;

        sky.appendChild(env);

        // Trigger reflow/next frame to start transition
        requestAnimationFrame(() => {
            env.style.top = '110%';
        });

        // Click Handler
        env.addEventListener('click', async () => {
            // Stop Spawning
            clearInterval(gameInterval);
            // Clear remaining envelopes
            sky.innerHTML = '';

            // Pick Prize (with inventory check)
            const prize = await pickPrizeWithInventory();
            await showResult(prize);
        });

        // Cleanup
        setTimeout(() => {
            if (env.parentNode) env.remove();
        }, 5000);
    }

    /**
     * Pick a prize considering remaining inventory
     */
    async function pickPrizeWithInventory() {
        // Refresh inventory
        if (window.DB) {
            prizeInventory = await window.DB.getPrizeInventory();
        }

        // Filter prizes that still have stock
        const availablePrizes = CONFIG.prizes.filter(p => {
            if (!prizeInventory || !prizeInventory[p.id]) return true;
            return prizeInventory[p.id].remaining > 0;
        });

        if (availablePrizes.length === 0) {
            // All prizes out of stock - fallback to first prize
            return CONFIG.prizes[0];
        }

        // Recalculate probabilities for available prizes
        const totalProb = availablePrizes.reduce((sum, p) => sum + p.prob, 0);
        const rand = Math.random() * totalProb;

        let cumulative = 0;
        for (const p of availablePrizes) {
            cumulative += p.prob;
            if (rand < cumulative) return p;
        }

        return availablePrizes[0];
    }

    async function showResult(prize) {
        const code = generateCode();

        // Deduct prize from inventory
        if (window.DB) {
            await window.DB.deductPrize(prize.id);
        }

        // Save ticket to database
        if (window.DB) {
            await window.DB.saveTicket({
                code: code,
                prizeId: prize.id,
                prizeName: prize.name,
                userName: currentUser.name,
                userPhone: currentUser.phone,
                store: currentUser.store,
                product: currentUser.product,
                invoiceId: currentUser.invoice
            });
        }

        // Update Result DOM
        document.getElementById('prize-name').textContent = prize.name;
        document.getElementById('prize-img').src = 'assets/images/mascot.png';
        document.getElementById('prize-code').textContent = code;

        // Generate QR Code for the result
        if (qrContainer && typeof QRCode !== 'undefined') {
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: `BABYBIO-TET|${code}|${currentUser.phone}|${prize.name}`,
                width: 100,
                height: 100,
                colorDark: "#D32F2F",
                colorLight: "#ffffff"
            });
        }

        // Transition
        setTimeout(() => {
            showScreen('result');
        }, 500);
    }

    function generateCode() {
        const num = Math.floor(Math.random() * 900000) + 100000;
        return `BB-TET-${num}`;
    }
});
