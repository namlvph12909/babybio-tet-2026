document.addEventListener('DOMContentLoaded', () => {
    // --- State & Config ---
    const CONFIG = {
        screens: ['welcome', 'form', 'game', 'result'],
        prizes: [
            { id: 'v50', name: 'Voucher 50.000đ', type: 'voucher', prob: 0.4, image: 'assets/images/envelope.png' }, // Placeholder img for now
            { id: 'v100', name: 'Voucher 100.000đ', type: 'voucher', prob: 0.25, image: 'assets/images/envelope.png' },
            { id: 'v150', name: 'Voucher 150.000đ', type: 'voucher', prob: 0.15, image: 'assets/images/envelope.png' },
            { id: 'doudou', name: 'Thỏ Doudou Babybio', type: 'gift', prob: 0.1, image: 'assets/images/envelope.png' },
            { id: 'bear', name: 'Gấu bông Babybio', type: 'gift', prob: 0.1, image: 'assets/images/envelope.png' }
        ]
    };

    let currentUser = null;

    // --- DOM Elements ---
    const screens = {};
    CONFIG.screens.forEach(s => screens[s] = document.getElementById(`screen-${s}`));
    
    const btnStart = document.getElementById('btn-start');
    const formEntry = document.getElementById('entry-form');
    const sky = document.getElementById('envelopes-sky');
    const btnHome = document.getElementById('btn-home');

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
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const invoice = document.getElementById('invoice').value.trim();
        
        // Validation: Check if invoice used locally
        const usedInvoices = JSON.parse(localStorage.getItem('babybio_used_invoices') || '[]');
        if (usedInvoices.includes(invoice)) {
            alert('Hóa đơn này đã được sử dụng để quay thưởng!');
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

        // Mark invoice as used (Move this to AFTER win if strict, but here prevents abuse)
        // For smoother UX, we can save it now.
        saveInvoice(invoice);

        // Transition to Game
        showScreen('game');
        startGame();
    }

    function saveInvoice(invoice) {
        const used = JSON.parse(localStorage.getItem('babybio_used_invoices') || '[]');
        used.push(invoice);
        localStorage.setItem('babybio_used_invoices', JSON.stringify(used));
    }

    // --- Game Logic ---
    let gameInterval;
    const GAME_DURATION = 10000; // Auto-end if no interaction? Or infinite? infinite until click.

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
        const left = Math.random() * 90; // 0% to 90%
        env.style.left = `${left}%`;
        
        // Start from top
        env.style.top = '-100px';
        
        // Random Size
        const size = 40 + Math.random() * 40; // 40px to 80px
        env.style.width = `${size}px`;

        // Random Rotation
        const rot = Math.random() * 360;
        env.style.transform = `rotate(${rot}deg)`;

        // Fall Animation (Manual via JS for control, or CSS class additions)
        // Let's us CSS transitions/animations for simplicity if attached to element
        // But for "falling", we need keyframes dynamically or just set a long transition
        
        // Better: Use Web Animations API or simple CSS class w/ inline styling
        env.style.transition = `top ${3 + Math.random()}s linear`;
        
        sky.appendChild(env);

        // Trigger reflow/next frame to start transition
        requestAnimationFrame(() => {
            env.style.top = '110%'; // Fall below key
        });

        // Click Handler
        env.addEventListener('click', () => {
             // Stop Spawning
             clearInterval(gameInterval);
             // Pick Prize
             const prize = pickPrize();
             showResult(prize);
        });

        // Cleanup
        setTimeout(() => {
            if(env.parentNode) env.remove();
        }, 5000);
    }

    function pickPrize() {
        const rand = Math.random();
        let cumulative = 0;
        for (const p of CONFIG.prizes) {
            cumulative += p.prob;
            if (rand < cumulative) return p;
        }
        return CONFIG.prizes[0]; // Fallback
    }

    function showResult(prize) {
        const code = generateCode();
        
        // Update Result DOM
        document.getElementById('prize-name').textContent = prize.name;
        // document.getElementById('prize-img').src = prize.image; // Use specific image if available
        document.getElementById('prize-img').src = 'assets/images/mascot.png'; // Placeholder fallback until we have prize icons
        document.getElementById('prize-code').textContent = code;

        // Transition
        setTimeout(() => {
             showScreen('result');
        }, 500); // Small delay to feel the "catch"
    }

    function generateCode() {
        const num = Math.floor(Math.random() * 900000) + 100000;
        return `BB-TET-${num}`;
    }
});
