const cursorContainer = document.getElementById('cursorContainer');
const car = document.querySelector('.cursor-car');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let lastX = 0, lastY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Extra High-Speed Wind/Smoke Particle Generator
function createWindParticle(x, y, angle, speed) {
    if (speed < 2) return; 

    // ১টি মুভমেন্টে একাধিক উইন্ড ট্রেইল তৈরি (ইফেক্ট বাড়ানোর জন্য)
    for (let i = 0; i < 2; i++) {
        const wind = document.createElement('div');
        wind.className = 'wind-line';
        document.body.appendChild(wind);

        // Random offset for dynamic wind dispersion
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;

        wind.style.left = `${x + offsetX}px`;
        wind.style.top = `${y + offsetY}px`;

        // লাইন অনেক বেশি লম্বা হবে স্পিড বাড়লে
        const lineLength = Math.min(speed * 4.5, 120); 
        wind.style.width = `${lineLength}px`;

        // Wind angle calculation with slight random blur angle
        const windAngle = angle + 180 + (Math.random() - 0.5) * 10;
        wind.style.transform = `translate(-50%, -50%) rotate(${windAngle}deg)`;

        // Fast animation & fade out
        setTimeout(() => {
            wind.style.opacity = '0';
            wind.style.transform = `translate(-50%, -50%) rotate(${windAngle}deg) scaleX(2.2) scaleY(0.5)`;
        }, 10);

        setTimeout(() => {
            wind.remove();
        }, 250);
    }
}

// Animation Loop for Physics & Speed Motion
function animateCursor() {
    // 0.35 দেওয়া হয়েছে যেন আরও ফাস্ট অ্যান্ড রেসপন্সিভ ফলো করে
    cursorX += (mouseX - cursorX) * 0.35;
    cursorY += (mouseY - cursorY) * 0.35;

    // Speed Calculation
    const deltaX = cursorX - lastX;
    const deltaY = cursorY - lastY;
    const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Angle Alignment
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle += 90;

    // Extreme Stretch & Motion Scale Physics
    const stretch = Math.min(1 + speed * 0.025, 2.2); // সর্বোচ্চ ২.২ গুণ লম্বা হবে
    const squeeze = Math.max(1 - speed * 0.01, 0.5);  // চ্যাপ্টা হবে

    // Apply High-Speed Dynamic Transform
    cursorContainer.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${squeeze}, ${stretch})`;

    // Generate Wind Effect on drag
    if (speed > 2) {
        createWindParticle(cursorX, cursorY, angle - 90, speed);
    }

    lastX = cursorX;
    lastY = cursorY;

    requestAnimationFrame(animateCursor);
}

// Start Physics Animation Loop
animateCursor();