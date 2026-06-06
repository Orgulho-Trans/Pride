// JavaScript functionality for Pride 2026

document.addEventListener('DOMContentLoaded', () => {
    console.log('Pride 2026 initialized successfully.');
    
    // Set initial active state for first accordion if any
    const activeAccordions = document.querySelectorAll('.accordion-btn.active');
    activeAccordions.forEach(btn => {
        const content = btn.nextElementSibling;
        if (content) {
            content.classList.add('open');
            content.style.maxHeight = content.scrollHeight + "px";
            content.style.paddingBottom = "1.5rem";
        }
    });

    // Initialize interactive canvas glitter effect
    initGlitterCanvas();

    // Initialize creator photo actions (flip + apple popups)
    initCreatorCardActions();
});

/* ==========================================================================
   1. Dynamic Accordion Panels (Smooth Height Transitions)
   ========================================================================== */

function toggleAccordion(button) {
    if (!button) return;
    
    // Toggle active class on the button itself
    button.classList.toggle('active');
    
    // Get the next sibling element which is the accordion content wrapper
    const content = button.nextElementSibling;
    if (!content) return;
    
    // Toggle the 'open' class
    content.classList.toggle('open');
    
    if (content.classList.contains('open')) {
        // Calculate exact scroll height dynamically for a premium smooth animation
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.paddingBottom = "1.5rem";
    } else {
        content.style.maxHeight = null;
        content.style.paddingBottom = "0";
    }
}

// Keep accordion heights synced if the browser window size changes (e.g. rotating mobile screen)
window.addEventListener('resize', () => {
    document.querySelectorAll('.accordion-content.open').forEach(content => {
        content.style.maxHeight = content.scrollHeight + "px";
    });
});

/* ==========================================================================
   2. Glitter Confetti/Sparkles Click Effect (Purpurina Canvas)
   ========================================================================== */

let canvas, ctx;
let particles = [];
const transColors = ['#5BCEFA', '#F5A9B8', '#FFFFFF', '#9C59D1', '#FCF434'];

function initGlitterCanvas() {
    canvas = document.getElementById('glitterCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Listen for click events anywhere on the document
    document.addEventListener('click', (e) => {
        // Ignore clicks on links or buttons to avoid visual interference
        if (e.target.closest('a') || e.target.closest('button')) {
            createGlitterBurst(e.clientX, e.clientY, 10);
            return;
        }
        createGlitterBurst(e.clientX, e.clientY, 20);
    });
    
    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // Gravity
            p.vx *= 0.98; // Friction
            p.life--;
            
            // Draw particle as a sparkling diamond shape
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size * 0.7, 0);
            ctx.lineTo(0, p.size);
            ctx.lineTo(-p.size * 0.7, 0);
            ctx.closePath();
            
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fill();
            ctx.restore();
            
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createGlitterBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 6 + 2;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2, // Slight upward force
            size: Math.random() * 6 + 3,
            color: transColors[Math.floor(Math.random() * transColors.length)],
            rotation: Math.random() * Math.PI,
            life: Math.random() * 30 + 30,
            maxLife: 60
        });
    }
}

/* ==========================================================================
   3. Standalone Creator Profile Card Flip & Apple-Style Popup Text
   ========================================================================== */

const prideWords = [
    'Trans', 'LGBTQIA', 'Crossdresser', 
    'Binários', 'Travestis', 'Transsexuais', 
    'Transgender', 'Pride', 'Love is Love'
];

// Aesthetic Apple-style text color array
const popupColors = [
    '#5BCEFA', '#F5A9B8', '#FFFFFF', '#9C59D1', 
    '#FCF434', '#E40303', '#FF8C00', '#008026'
];

function initCreatorCardActions() {
    const cardWrapper = document.getElementById('creatorCardWrapper');
    if (!cardWrapper) return;
    
    cardWrapper.addEventListener('click', (e) => {
        // Toggle the flip CSS class
        cardWrapper.classList.toggle('flipped');
        
        // Spawn a burst of glitter particles right on the image coordinates
        const rect = cardWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        createGlitterBurst(centerX, centerY, 35);
        
        // Spawn Apple-style screen popups
        spawnApplePrideWords(centerX, centerY);
    });
}

function spawnApplePrideWords(startX, startY) {
    // Spawn all 9 words spread out
    prideWords.forEach((word, index) => {
        setTimeout(() => {
            const wordEl = document.createElement('div');
            wordEl.className = 'floating-word';
            wordEl.textContent = word;
            
            // Random direction calculations for screen drifting
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 200 + 150; // Random offset distance
            
            // Random translation targets
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance - 80; // Add upward drift
            const rotation = (Math.random() - 0.5) * 30; // Rotate slightly
            
            // Set styles dynamically
            wordEl.style.left = startX + 'px';
            wordEl.style.top = startY + 'px';
            wordEl.style.color = popupColors[Math.floor(Math.random() * popupColors.length)];
            wordEl.style.fontSize = (Math.random() * 10 + 20) + 'px'; // Random size between 20px and 30px
            wordEl.style.setProperty('--dx', dx + 'px');
            wordEl.style.setProperty('--dy', dy + 'px');
            wordEl.style.setProperty('--rot', rotation + 'deg');
            
            document.body.appendChild(wordEl);
            
            // Auto clean up after animation finishes (2.2 seconds)
            setTimeout(() => {
                if (wordEl.parentNode) {
                    document.body.removeChild(wordEl);
                }
            }, 2200);
        }, index * 80); // Stagger spawning for clean flow
    });
}

/* ==========================================================================
   4. Simple Toast Notifications Helper
   ========================================================================== */

function showToast(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        document.body.removeChild(existingToast);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 400);
    }, 3500);
}
