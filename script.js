window.addEventListener('load', () => {
    console.log("Game Loaded!"); 
    
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
    coins: 0, pph: 0, level: 1, energy: 1000, maxEnergy: 1000,
    earnPerTap: 1, tapSoundActive: true, bgMusicActive: true,
    lastDailyClaim: 0, isAutoMiningActive: false
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
        userFoundCombo = []; isComboClaimed = false; lastComboDate = currentDate;
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
        if(slot) { slot.innerText = "❓"; slot.style.border = "2px dashed #4a5a80"; slot.style.background = "#1a2235"; }
    }
}

function updateComboVisualsSuccess() {
    for(let i=0; i<3; i++) {
        const slot = document.getElementById(`combo-slot-${i}`);
        if(slot) { slot.innerText = "👑"; slot.style.border = "2px solid #ffcc00"; slot.style.background = "rgba(255, 204, 0, 0.2)"; }
    }
}

generateDailyCombo();

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
    loadGameProgress();
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
    saveGameProgress();
}

function initMiningEngine() {
    const tapTarget = document.getElementById('tap-target-btn');
    tapTarget?.addEventListener('click', () => {
        if (!gameState.isAutoMiningActive && gameState.energy >= gameState.earnPerTap) {
            gameState.coins += gameState.earnPerTap;
            gameState.energy -= gameState.earnPerTap;
            triggerAudioEffect('tap');
            updateDOMDisplay();
        }
    });

    document.getElementById('watch-ad-btn-1')?.addEventListener('click', () => {
        if (window.AdsGram) {
            window.AdsGram.init({ blockId: "38024" }).show().then(() => {
                gameState.coins += 5000; updateDOMDisplay();
            });
        }
    });
}

function checkCardForDailyCombo(cardId) {
    if (isComboClaimed || !dailyComboSecret.includes(cardId)) return;
    if (!userFoundCombo.includes(cardId)) {
        userFoundCombo.push(cardId);
        localStorage.setItem('userFoundComboLocal', JSON.stringify(userFoundCombo));
        if (userFoundCombo.length === 3) { isComboClaimed = true; gameState.coins += 5000000; alert("Jackpot!"); }
    }
}

function initUpgradesMarket() {
    Object.keys(ventureUpgrades).forEach(key => {
        const upgrade = ventureUpgrades[key];
        document.getElementById(upgrade.id)?.addEventListener('click', () => {
            if (gameState.coins >= upgrade.cost) {
                gameState.coins -= upgrade.cost;
                checkCardForDailyCombo(upgrade.id);
                updateDOMDisplay();
            }
        });
    });
}

function processPassiveEarnings() { if (gameState.pph > 0) { gameState.coins += (gameState.pph / 3600); updateDOMDisplay(); } }
function regenerateEnergyPool() { if (gameState.energy < gameState.maxEnergy) { gameState.energy += 3; updateDOMDisplay(); } }
function saveGameProgress() { localStorage.setItem('gameData', JSON.stringify(gameState)); }
function loadGameProgress() { const saved = localStorage.getItem('gameData'); if (saved) gameState = JSON.parse(saved); }
function initNavigationRouter() {}
function initSettingsPanel() {}
function initSocialShareSystem() {}
function initRankButtons() {}

function initAudioChannels() { document.addEventListener('click', controlBackgroundLoop, { once: true }); }
function controlBackgroundLoop() {
    const bgPlayer = document.getElementById('bg-audio-player');
    if (bgPlayer && gameState.bgMusicActive) bgPlayer.play().catch(e => {});
}

function triggerAudioEffect(type) {
    if (type === 'tap' && gameState.tapSoundActive) {
        const tapPlayer = document.getElementById('tap-audio-player');
        if(tapPlayer) { tapPlayer.currentTime = 0; tapPlayer.play().catch(e => {}); }
    }
}
