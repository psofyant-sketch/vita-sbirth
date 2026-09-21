// AMBIL ELEMEN DARI DOM
const giftSection = document.getElementById('giftSection');
const giftBox = document.getElementById('giftBox');
const mainContent = document.getElementById('mainContent');
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const floatingHeartsBg = document.getElementById('floatingHeartsBg');
const bgMusic = document.getElementById('bgMusic');

const gotoCakeBtn = document.getElementById('gotoCakeBtn');
const cakeSection = document.getElementById('cakeSection');
const candleFlame = document.getElementById('candleFlame');
const romanticPopup = document.getElementById('romanticPopup');
const closePopupBtn = document.getElementById('closePopupBtn');

// GENERATE ORNAMEN LATAR BELAKANG HATI/BINTANG
function createBackgroundDecorations() {
    const symbols = ['❤️', '✨', '💖', '🌸', '⭐'];
    for (let i = 0; i < 20; i++) {
        const span = document.createElement('div');
        span.className = 'bg-heart';
        span.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        span.style.left = Math.random() * 100 + 'vw';
        span.style.fontSize = (Math.random() * 18 + 12) + 'px';
        span.style.animationDuration = (Math.random() * 8 + 6) + 's';
        span.style.animationDelay = (Math.random() * 5) + 's';
        floatingHeartsBg.appendChild(span);
    }
}
createBackgroundDecorations();

// SETTING UKURAN CANVAS
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// KELOMPOK PARTIKEL PETASAN & KONFETI LOOP TANPA BATAS
let particles = [];
let isCelebrationStarted = false;

class Particle {
    constructor(x, y, color, isFirework = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isFirework = isFirework;
        
        if (isFirework) {
            this.vx = (Math.random() - 0.5) * 5;
            this.vy = -(Math.random() * 7 + 11);
            this.targetY = Math.random() * (canvas.height * 0.5);
        } else {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 1.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
        }
        
        this.alpha = 1;
        this.friction = 0.95;
        this.gravity = 0.18;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        if (this.isFirework) {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            if (this.vy >= 0 || this.y <= this.targetY) {
                this.explode();
            }
        } else {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity * 0.4;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.012;
        }
    }

    explode() {
        const index = particles.indexOf(this);
        if (index > -1) {
            particles.splice(index, 1);
            const colors = ['#ff477e', '#ff758c', '#ffd166', '#ffb3c6', '#ffffff', '#ff8fab'];
            for (let i = 0; i < 45; i++) {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                particles.push(new Particle(this.x, this.y, randomColor, false));
            }
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// LOOP UTAMA ANIMASI CANVAS
function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(animateFireworks);
}
animateFireworks();

// FUNGSI MELUNCURKAN PETASAN DARI BAWAH
function launchFireworkFromBottom() {
    const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    const y = canvas.height;
    const colors = ['#ff477e', '#ff758c', '#ffd166', '#ffffff', '#ff8fab'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(new Particle(x, y, color, true));
}

// EVENT KETIKA KOTAK KADO DIKLIK
giftBox.addEventListener('click', () => {
    if (isCelebrationStarted) return;
    isCelebrationStarted = true;

    // 1. Putar Lagu MP3 dari elemen Audio HTML
    if (bgMusic) {
        bgMusic.volume = 0.7;
        bgMusic.play().catch(error => {
            console.log("Autoplay diblokir atau file lagu-romantis.mp3 tidak ditemukan:", error);
        });
    }

    // 2. Transisi Sembunyikan Kado & Tampilkan Konten
    giftSection.style.transform = 'scale(0)';
    giftSection.style.opacity = '0';

    setTimeout(() => {
        giftSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
    }, 500);

    // 3. Petasan Terus Menerus Tanpa Batas (Infinite Loop Interval)
    setInterval(() => {
        launchFireworkFromBottom();
        if (Math.random() > 0.5) {
            launchFireworkFromBottom();
        }
    }, 800);
});

// TOMBOL MENUJU BAGIAN KUE LILIN
gotoCakeBtn.addEventListener('click', () => {
    cakeSection.classList.remove('hidden');
    cakeSection.scrollIntoView({ behavior: 'smooth' });
});

// INTERAKSI TIUP LILIN (KLIK PADA API)
let isCandleBlown = false;
candleFlame.addEventListener('click', () => {
    if (isCandleBlown) return;
    isCandleBlown = true;

    // Matikan Api
    candleFlame.classList.add('out');

    // Buat letupan petasan ekstra meriah saat lilin ditiup
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            launchFireworkFromBottom();
        }, i * 200);
    }

    // Munculkan Popup Pesan Romantis setelah sebentar
    setTimeout(() => {
        romanticPopup.classList.remove('hidden');
    }, 600);
});

// TUTUP POPUP ROMANTIS
closePopupBtn.addEventListener('click', () => {
    romanticPopup.classList.add('hidden');
});