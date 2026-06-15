// --- 🛰️ TELEGRAM LAYER BOOTSTRAP ---
const tg = window.Telegram.WebApp;
tg.expand();

// DOM References
const coinCountEl = document.getElementById('coin-count');
const withdrawMirrorEl = document.getElementById('withdraw-balance-mirror');
const minerBtn = document.getElementById('miner-btn');
const miningTheater = document.querySelector('.mining-theater');
const currentLevelEl = document.getElementById('current-level');
const nextLevelValEl = document.getElementById('next-level-val');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressPercentEl = document.getElementById('progress-percent');
const currentEnergyEl = document.getElementById('current-energy');
const perTapValEl = document.getElementById('per-tap-val');

// Auto Inject Telegram Profiles
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    document.getElementById('telegram-username').innerText = `${user.first_name}`;
    document.getElementById('telegram-id').innerText = `ID: ${user.id}`;
} else {
    document.getElementById('telegram-username').innerText = "Basit Bhaiya (Dev)";
    document.getElementById('telegram-id').innerText = "ID: 77777777";
}

// --- 📊 APP LIFECYCLE VARIABLES & DATA BACKUP ---
let coins = parseFloat(localStorage.getItem('elite_coins')) || 0.0;
let level = parseInt(localStorage.getItem('elite_level')) || 1;
let energy = parseInt(localStorage.getItem('elite_energy')) || 1000;
let clickValue = 0.1;
let isBoostActive = false;

// Dynamic Formula for Gamified Levels
function getNextLevelRequirement(lvl) {
    return Math.floor(100 * Math.pow(1.8, lvl - 1));
}

function updateDOMAnalytics() {
    coinCountEl.innerText = coins.toFixed(1);
    withdrawMirrorEl.innerText = coins.toFixed(1);
    currentLevelEl.innerText = level;
    currentEnergyEl.innerText = energy;
    perTapValEl.innerText = clickValue.toFixed(1);

    let req = getNextLevelRequirement(level);
    nextLevelValEl.innerText = req;

    // Level Check and Progression Calculations
    if (coins >= req && level < 10) {
        level++;
        localStorage.setItem('elite_level', level);
        alert(`🎉 Congratulations! Leveled up to Level ${level}!`);
    }

    let previousReq = level === 1 ? 0 : getNextLevelRequirement(level - 1);
    let progressPct = Math.min(100, Math.max(0, ((coins - previousReq) / (req - previousReq)) * 100));
    progressBarFill.style.width = `${progressPct}%`;
    progressPercentEl.innerText = `${Math.floor(progressPct)}%`;
}

// --- 🔊 STUDIO GRADE SOUND SYNTHESIZER ---
function triggerPremiumAudio() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // Multi-frequency harmonic layered signature sound
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch (err) {}
}

// --- ✨ NEON PARTICLES / FLOATING ANIMATION LOGIC ---
function renderFloatingIndicator(event) {
    const num = document.createElement('div');
    num.classList.add('floating-num');
    num.innerText = `+${clickValue.toFixed(1)}`;

    // Tap offset mechanics for absolute precision inside container
    const rect = miningTheater.getBoundingClientRect();
    let posX = rect.width / 2;
    let posY = rect.height / 2;

    if (event && event.clientX) {
        posX = event.clientX - rect.left;
        posY = event.clientY - rect.top;
    } else if (event && event.touches && event.touches[0]) {
        posX = event.touches[0].clientX - rect.left;
        posY = event.touches[0].clientY - rect.top;
    }

    num.style.left = `${posX}px`;
    num.style.top = `${posY}px`;

    miningTheater.appendChild(num);
    setTimeout(() => { num.remove(); }, 600);
}

// --- 🎮 CORE MINING CONTROLLER ENGINE ---
function executeMiningTap(e) {
    if (energy <= 0) {
        alert("❌ Energy Depleted! Wait for automatic regeneration.");
        return;
    }

    coins += clickValue;
    energy -= 1; // Decrement energy pool

    // Sync database cache values instantly
    localStorage.setItem('elite_coins', coins);
    localStorage.setItem('elite_energy', energy);

    triggerPremiumAudio();
    renderFloatingIndicator(e);
    updateDOMAnalytics();
}

minerBtn.addEventListener('mousedown', executeMiningTap);
minerBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    executeMiningTap(e);
});

// --- 🔋 PASSIVE ENERGY REGENERATION ---
setInterval(() => {
    if (energy < 1000) {
        energy = Math.min(1000, energy + 2);
        localStorage.setItem('elite_energy', energy);
        currentEnergyEl.innerText = energy;
    }
}, 1500);

// --- 🧭 INSTANT ENGINE NAVBAR ROUTER ---
function navigateDeck(screenId, tabBtn) {
    document.querySelectorAll('.app-screen').forEach(scr => scr.classList.remove('active'));
    document.querySelectorAll('.deck-tab').forEach(tb => tb.classList.remove('active'));

    document.getElementById(screenId).classList.add('active');
    tabBtn.classList.add('active');
}

// --- 📋 COMPREHENSIVE REWARD ACCREDITATION ---
function claimTask(reward, element) {
    if (element.classList.contains('claimed-status')) return;
    
    alert(`Verifying action... +${reward} coins added!`);
    coins += reward;
    localStorage.setItem('elite_coins', coins);
    updateDOMAnalytics();

    element.classList.add('claimed-status');
    element.style.opacity = '0.4';
    element.querySelector('.reward-tag').innerText = "COMPLETED ✅";
}

// Boot UI System Setup initialization
updateDOMAnalytics();