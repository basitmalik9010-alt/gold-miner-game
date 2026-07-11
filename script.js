window.addEventListener('load', () => {
    console.log("Game Loaded!"); 
    
    // Initializing UI and Data
    generateDailyCombo(); 
    loadGameProgress();
    
    const nameElement = document.getElementById('user-name');
    const tg = window.Telegram.WebApp;
    
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        nameElement.innerText = tg.initDataUnsafe.user.first_name;
    } else {
        nameElement.innerText = "Basit Bhaiya";
    }
});

// --- CORE GAME ENGINE STATE TERMINAL ---
let gameState = {
    coins: 0,
    pph: 0,
    level: 1,
    energy: 1000,
    maxEnergy: 1000,
    earnPerTap: 1,
    tapSoundActive: true,
    bgMusicActive: true,
    lastDailyClaim: 0,
    isAutoMiningActive: false
};

const allAvailableCards = ["btn-buy-p2p", "btn-buy-node", "btn-buy-aibot", "btn-buy-btcfarm", "btn-buy-meme", "btn-buy-staking", "btn-buy-web3", "btn-buy-liquidity", "btn-buy-layer2", "btn-buy-meta"];
let dailyComboSecret = [];
let userFoundCombo = JSON.parse(localStorage.getItem('userFoundComboLocal')) || [];
let isComboClaimed = localStorage.getItem('isComboClaimedLocal') === 'true';
let lastComboDate = localStorage.getItem('lastComboDateLocal') || "";

function getLocalPlayerDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function generateDailyCombo() {
    const currentDate = getLocalPlayerDate();
    if (currentDate !== lastComboDate) {
        userFoundCombo = [];
        isComboClaimed = false;
        lastComboDate = currentDate;
        localStorage.setItem('userFoundComboLocal', JSON.stringify(userFoundCombo));
        localStorage.setItem('isComboClaimedLocal', 'false');
        localStorage.setItem('lastComboDateLocal', currentDate);
        resetComboUI();
    }
    let seed = parseInt(currentDate.split('-').join(''), 10);
    let tempCards = [...allAvailableCards];
    dailyComboSecret = [];
    for (let i = 0; i < 3; i++) {
        let r = seededRandom(seed + i);
        let index = Math.floor(r * tempCards.length);
        dailyComboSecret.push(tempCards[index]);
        tempCards.splice(index, 1);
    }
}

function resetComboUI() {
    for(let i=0; i<3; i++) {
        const slot = document.getElementById(`combo-slot-${i}`);
        if(slot) {
            slot.innerText = "❓";
            slot.style.border = "2px dashed #4a5a80";
            slot.style.background = "#1a2235";
        }
    }
}

function updateComboVisualsSuccess() {
    for(let i=0; i<3; i++) {
        const slot = document.getElementById(`combo-slot-${i}`);
        if(slot) {
            slot.innerText = "👑";
            slot.style.border = "2px solid #ffcc00";
            slot.style.background = "rgba(255, 204, 0, 0.2)";
        }
    }
}

const ventureUpgrades = {
    p2p: { cost: 200, pphReward: 15, id: 'btn-buy-p2p' },
    node: { cost: 800, pphReward: 60, id: 'btn-buy-node' },
    aibot: { cost: 3000, pphReward: 180, id: 'btn-buy-aibot' },
    btcfarm: { cost: 10000, pphReward: 500, id: 'btn-buy-btcfarm' },
    meme: { cost: 35000, pphReward: 1200, id: 'btn-buy-meme' },
    staking: { cost: 100000, pphReward: 3000, id: 'btn-buy-staking' },
    web3: { cost: 250000, pphReward: 7500, id: 'btn-buy-web3' },
    liquidity: { cost: 800000, pphReward: 18000, id: 'btn-buy-liquidity' },
    layer2: { cost: 2500000, pphReward: 45000, id: 'btn-buy-layer2' },
    meta: { cost: 7000000, pphReward: 110000, id: 'btn-buy-meta' }
};

function getTargetForLevel(currentLevel) {
    const targets = { 1: 5000, 2: 25000, 3: 100000, 4: 500000, 5: 2000000, 6: 10000000, 7: 50000000, 8: 200000000, 9: 1000000000, 10: Infinity };
    return targets[currentLevel] || Infinity;
}

document.addEventListener("DOMContentLoaded", () => {
    initNavigationRouter();
    initMiningEngine();
    initUpgradesMarket();
    initSettingsPanel();
    initSocialShareSystem();
    initAudioChannels();
    initRankButtons();
    setInterval(processPassiveEarnings, 1000);
    setInterval(regenerateEnergyPool, 3000);
});

function updateDOMDisplay() {
    document.getElementById('coin-balance').innerText = Math.floor(gameState.coins).toLocaleString();
    document.getElementById('pph-txt').innerText = `⚡ +${gameState.pph.toLocaleString()}`;
    document.getElementById('earn-per-tap-txt').innerText = `🔨 +${gameState.earnPerTap}`;
    document.getElementById('energy-counter').innerText = `${gameState.energy} / ${gameState.maxEnergy}`;
    
    let currentTarget = getTargetForLevel(gameState.level);
    if (gameState.level >= 10) {
        document.getElementById('next-level-val').innerText = "MAX LEVEL";
        document.getElementById('level-num-txt').innerText = "Level 10/10";
    } else {
        document.getElementById('next-level-val').innerText = currentTarget.toLocaleString();
        document.getElementById('level-num-txt').innerText = `Level ${gameState.level}/10`;
        let percentage = Math.min((gameState.coins / currentTarget) * 100, 100);
        document.getElementById('level-progress-bar').style.width = `${percentage}%`;
        document.getElementById('level-percent-txt').innerText = `${Math.floor(percentage)}%`;
    }
    saveGameProgress();
}

function initNavigationRouter() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.router-section');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(nl => nl.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(link.getAttribute('data-target')).classList.add('active');
            triggerAudioEffect('tap');
        });
    });
}

let autoMiningInterval = null;
function initMiningEngine() {
    const tapTarget = document.getElementById('tap-target-btn');
    if (tapTarget) {
       tapTarget.addEventListener('click', (e) => {
            if (!gameState.isAutoMiningActive && gameState.energy >= gameState.earnPerTap) {
                gameState.coins += gameState.earnPerTap;
                gameState.energy -= gameState.earnPerTap;
                triggerAudioEffect('tap');
                checkLevelUpCondition();
                updateDOMDisplay();
            }
        });
    }
}

function checkCardForDailyCombo(cardId) {
    const slotElement0 = document.getElementById('combo-slot-0');
    if (!slotElement0 || isComboClaimed) return;
    if (!dailyComboSecret.includes(cardId)) {
        if (userFoundCombo.length > 0) {
            userFoundCombo = [];
            localStorage.setItem('userFoundComboLocal', JSON.stringify(userFoundCombo));
            resetComboUI();
            alert("❌ WRONG CARD! Progress reset.");
        }
        return;
    }
    if (!userFoundCombo.includes(cardId)) {
        userFoundCombo.push(cardId);
        localStorage.setItem('userFoundComboLocal', JSON.stringify(userFoundCombo));
        const slot = document.getElementById(`combo-slot-${userFoundCombo.length - 1}`);
        if (slot) { slot.innerText = "🔒"; slot.style.border = "2px solid #22c55e"; }
        if (userFoundCombo.length === 3) {
            isComboClaimed = true;
            localStorage.setItem('isComboClaimedLocal', 'true');
            gameState.coins += 5000000;
            updateComboVisualsSuccess();
            alert("🎉 Jackpot! +5,000,000 Coins!");
            updateDOMDisplay();
        }
    }
}

function processPassiveEarnings() { if (gameState.pph > 0) { gameState.coins += (gameState.pph / 3600); updateDOMDisplay(); } }
function regenerateEnergyPool() { if (gameState.energy < gameState.maxEnergy) { gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 3); updateDOMDisplay(); } }
function checkLevelUpCondition() {
    let target = getTargetForLevel(gameState.level);
    if (gameState.coins >= target && gameState.level < 10) { gameState.level++; alert("Level Up!"); }
}

function initSettingsPanel() {
    const overlay = document.getElementById('settings-overlay');
    document.getElementById('open-settings-btn')?.addEventListener('click', () => overlay.classList.add('active'));
    document.getElementById('close-settings-btn')?.addEventListener('click', () => overlay.classList.remove('active'));
}

function initSocialShareSystem() {
    document.getElementById('copy-link-btn')?.addEventListener('click', () => {
        document.getElementById('refer-link-input')?.select();
        document.execCommand("copy");
        alert("Referral link copied!");
    });
}

function initAudioChannels() { document.addEventListener('click', controlBackgroundLoop, { once: true }); }
function controlBackgroundLoop() {
    const bgPlayer = document.getElementById('bg-audio-player');
    if (bgPlayer && gameState.bgMusicActive) bgPlayer.play().catch(e => console.log("Audio locked"));
}

function triggerAudioEffect(type) {
    if (type === 'tap' && gameState.tapSoundActive) {
        const tapPlayer = document.getElementById('tap-audio-player');
        if(tapPlayer) { tapPlayer.currentTime = 0; tapPlayer.play().catch(e => {}); }
    }
}

function saveGameProgress() { localStorage.setItem('gameData', JSON.stringify(gameState)); }
function loadGameProgress() { const saved = localStorage.getItem('gameData'); if (saved) gameState = JSON.parse(saved); }
function initRankButtons() {}
function initUpgradesMarket() {
    Object.keys(ventureUpgrades).forEach(key => {
        const upgrade = ventureUpgrades[key];
        document.getElementById(upgrade.id)?.addEventListener('click', () => {
            if (gameState.coins >= upgrade.cost) {
                gameState.coins -= upgrade.cost;
                gameState.pph += upgrade.pphReward;
                checkCardForDailyCombo(upgrade.id);
                updateDOMDisplay();
            } else alert("Not enough coins!");
        });
    });
}
