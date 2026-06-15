let coins = 0;
let clickValue = 0.1;
let isBoostActive = false;

const coinCountEl = document.getElementById('coin-count');
const minerBtn = document.getElementById('miner-btn');
const tapArea = document.querySelector('.tap-area');
const boostBtn = document.getElementById('boost-btn');
const boostTimerEl = document.getElementById('boost-timer');
const timerSecEl = document.getElementById('timer-sec');
const walletInput = document.getElementById('wallet-input');
const withdrawBtn = document.getElementById('withdraw-btn');

// 🎵 Non-stop Sound Function (Ab sound kabhi nahi rukega)
function playClickSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(900, audioCtx.currentTime); // Sweet coin sound
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.08);
    } catch(e) {
        console.log("Audio error managed");
    }
}

// 🚀 Floating Number (+0.1) Generator Function
function createFloatingNumber() {
    const num = document.createElement('div');
    num.classList.add('floating-number');
    
    // Agar boost active hai toh +0.3 dikhayega, nahi toh +0.1
    num.innerText = `+${clickValue.toFixed(1)}`;
    
    // Thoda left-right random karne ke liye taaki ek ke upar ek na dikhe
    const randomX = Math.floor(Math.random() * 40) - 20; 
    num.style.left = `calc(50% + ${randomX}px)`;
    num.style.top = `30px`;
    
    tapArea.appendChild(num);
    
    // Animation khatam hote hi HTML se remove kar do taaki computer slow na ho
    setTimeout(() => {
        num.remove();
    }, 600);
}

// 👆 Tap Logic (Mouse aur Tez Click ke liye)
minerBtn.addEventListener('mousedown', (e) => {
    coins += clickValue;
    coinCountEl.innerText = coins.toFixed(1);
    
    playClickSound();      // Sound play karein
    createFloatingNumber(); // "+0.1" upar udayein
});

// Mobile Users ke liye Touch Logic
minerBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    coins += clickValue;
    coinCountEl.innerText = coins.toFixed(1);
    
    playClickSound();
    createFloatingNumber();
});

// Boost Logic
boostBtn.addEventListener('click', () => {
    if (isBoostActive) return;
    alert("Loading Video Ad... Watch to get 3x Boost!");
    isBoostActive = true;
    boostBtn.disabled = true;
    clickValue = 0.3; 
    boostTimerEl.classList.remove('hidden');

    let timeLeft = 30;
    timerSecEl.innerText = timeLeft;

    const timerInterval = setInterval(() => {
        timeLeft--;
        timerSecEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isBoostActive = false;
            boostBtn.disabled = false;
            clickValue = 0.1; 
            boostTimerEl.classList.add('hidden');
        }
    }, 1000);
});

// Withdrawal Logic
withdrawBtn.addEventListener('click', () => {
    const address = walletInput.value.trim();
    if (address === "") {
        alert("Please enter a valid UPI ID or Wallet Address!");
        return;
    }
    if (coins < 5000) {
        alert(`You need at least 5,000 coins to withdraw. You currently have ${coins.toFixed(1)} coins.`);
        return;
    }
    alert(`Success! Your withdrawal request for ${coins.toFixed(1)} coins sent to: ${address}.`);
    coins = 0;
    coinCountEl.innerText = coins.toFixed(1);
    walletInput.value = "";
});