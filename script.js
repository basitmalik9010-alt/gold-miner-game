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
    lastDailyClaim: 0
};

// --- VENTURES MATRIX REVENUE DEFINITIONS (10-20 Configuration) ---
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

// --- DYNAMIC LEVEL CONFIGURATION CAP ---
function getTargetForLevel(currentLevel) {
    const targets = {
        1: 5000,
        2: 25000,
        3: 100000,
        4: 500000,
        5: 2000000,
        6: 10000000,
        7: 50000000,
        8: 200000000,
        9: 1000000000,
        10: Infinity
    };
    return targets[currentLevel] || Infinity;
}

// --- INITIALIZER TERMINAL ---
document.addEventListener("DOMContentLoaded", () => {
    loadGameProgress();
    initNavigationRouter();
    initMiningEngine();
    initUpgradesMarket();
    initSettingsPanel();
    initSocialShareSystem();
    initAudioChannels();
    
    // Core Engine Loops
    setInterval(processPassiveEarnings, 1000);
    setInterval(regenerateEnergyPool, 3000);
});

// --- UI REFRESH TERMINAL ---
function updateDOMDisplay() {
    document.getElementById('coin-balance').innerText = Math.floor(gameState.coins).toLocaleString();
    document.getElementById('pph-txt').innerText = `⚡ +${gameState.pph.toLocaleString()}`;
    document.getElementById('earn-per-tap-txt').innerText = `🔨 +${gameState.earnPerTap}`;
    document.getElementById('energy-counter').innerText = `${gameState.energy} / ${gameState.maxEnergy}`;
    
    // Level & Progress Bar Calculation System (Fixed Unfreeze Logic)
    let currentTarget = getTargetForLevel(gameState.level);
    if (gameState.level >= 10) {
        document.getElementById('next-level-val').innerText = "MAX LEVEL";
        document.getElementById('level-num-txt').innerText = "Level 10/10";
        document.getElementById('level-progress-bar').style.width = "100%";
        document.getElementById('level-percent-txt').innerText = "100%";
        document.getElementById('league-name').innerText = `👑 Ultimate Emperor (Level 10)`;
    } else {
        document.getElementById('next-level-val').innerText = currentTarget.toLocaleString();
        document.getElementById('level-num-txt').innerText = `Level ${gameState.level}/10`;
        
        let percentage = (gameState.coins / currentTarget) * 100;
        if (percentage > 100) percentage = 100;
        
        document.getElementById('level-progress-bar').style.width = `${percentage}%`;
        document.getElementById('level-percent-txt').innerText = `${Math.floor(percentage)}%`;
        document.getElementById('league-name').innerText = `👑 CEO League (Level ${gameState.level})`;
    }
    
    saveGameProgress();
}

// --- SECTION ROUTER HUB (4 Tabs Logic) ---
function initNavigationRouter() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.router-section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(nl => nl.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));

            link.classList.add('active');
            const targetSection = link.getAttribute('data-target');
            document.getElementById(targetSection).classList.add('active');
            
            triggerAudioEffect('tap');
        });
    });
}

// --- TAP ACTIVE ENGINE SYSTEM ---
function initMiningEngine() {
    const tapTarget = document.getElementById('tap-target-btn');
    
    tapTarget.addEventListener('click', (e) => {
        if (gameState.isAutoMiningActive) {
        return;
    }
        if (gameState.energy >= gameState.earnPerTap) {
            gameState.coins += gameState.earnPerTap;
            gameState.energy -= gameState.earnPerTap;
            
            triggerAudioEffect('tap');
            checkLevelUpCondition();
            updateDOMDisplay();
        } else {
            alert("Urgent: Energy depleted! Wait for recovery loop.");
        }
    });

    // Daily Rewards Claim Implementation
    document.getElementById('claim-daily-btn').addEventListener('click', () => {
        const currentTime = Date.now();
        if (currentTime - gameState.lastDailyClaim >= 86400000 || gameState.lastDailyClaim === 0) {
            gameState.coins += 5000;
            gameState.lastDailyClaim = currentTime;
            alert("Success: +5,000 Coins added to your global reserve!");
            checkLevelUpCondition();
            updateDOMDisplay();
        } else {
            alert("Access Denied: Next reward node available tomorrow!");
        }
    });

    // Sponsored Ads Simulation Setup
    document.getElementById('watch-ad-btn-1').addEventListener('click', () => {
        const adButton = document.getElementById('watch-ad-btn-1');
        adButton.disabled = true;
        adButton.innerText = "⏳ Connecting Ad Network...";
        
        setTimeout(() => {
            gameState.coins += 5000;
            adButton.disabled = false;
            adButton.innerText = "⚡ Launch Ad Stream";
            alert("Ad Stream Completed: +5,000 Coins funded successfully!");
            checkLevelUpCondition();
            updateDOMDisplay();
        }, 5000);
    });
}

// --- VENTURES MARKET ENGINE ---
function initUpgradesMarket() {
    Object.keys(ventureUpgrades).forEach(key => {
        const upgrade = ventureUpgrades[key];
        const btn = document.getElementById(upgrade.id);
        
        if (btn) {
            btn.addEventListener('click', () => {
                if (gameState.coins >= upgrade.cost) {
                    gameState.coins -= upgrade.cost;
                    gameState.pph += upgrade.pphReward;
                    
                    // Cost multiplier escalation
                    upgrade.cost = Math.floor(upgrade.cost * 1.5);
                    btn.innerText = `Cost: ${upgrade.cost.toLocaleString()} 🪙`;
                    
                    alert(`Purchase Confirmed! PPH production enhanced by +${upgrade.pphReward}`);
                    updateDOMDisplay();
                } else {
                    alert("Deficit: Insufficient coin liquidity to purchase upgrade.");
                }
            });
        }
    });
}

// --- AUTO RUN TIMERS CONTROL HUB ---
function processPassiveEarnings() {
    if (gameState.pph > 0) {
        gameState.coins += (gameState.pph / 3600);
        checkLevelUpCondition();
        updateDOMDisplay();
    }
}

function regenerateEnergyPool() {
    if (gameState.energy < gameState.maxEnergy) {
        gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 3);
        updateDOMDisplay();
    }
}

function checkLevelUpCondition() {
    let target = getTargetForLevel(gameState.level);
    while (gameState.coins >= target && gameState.level < 10) {
        gameState.level++;
        target = getTargetForLevel(gameState.level);
        alert(`🎉 Congratulations Basit Bhaiya! You leveled up to Level ${gameState.level}!`);
    }
}

// --- SETTINGS PANEL CONTROL INTEREACE ---
function initSettingsPanel() {
    const overlay = document.getElementById('settings-overlay');
    const openBtn = document.getElementById('open-settings-btn');
    const closeBtn = document.getElementById('close-settings-btn');
    const toggleMusic = document.getElementById('toggle-bg-music');
    const toggleTap = document.getElementById('toggle-tap-sound');
    const tonTrigger = document.getElementById('ton-connect-trigger');

    openBtn.addEventListener('click', () => overlay.classList.add('active'));
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    
    // Toggle Control Systems
    toggleMusic.addEventListener('click', () => {
        gameState.bgMusicActive = !gameState.bgMusicActive;
        toggleMusic.classList.toggle('active', gameState.bgMusicActive);
        toggleMusic.innerText = gameState.bgMusicActive ? "ON" : "OFF";
        controlBackgroundLoop();
    });

    toggleTap.addEventListener('click', () => {
        gameState.tapSoundActive = !gameState.tapSoundActive;
        toggleTap.classList.toggle('active', gameState.tapSoundActive);
        toggleTap.innerText = gameState.tapSoundActive ? "ON" : "OFF";
    });

    // Real TON Connection Redirect Hook
    tonTrigger.addEventListener('click', () => {
        tonTrigger.innerText = "Connecting Tonkeeper...";
        setTimeout(() => {
            // Real TON Manifest payload redirect simulation string
            window.location.href = "https://tonconnect.org"; 
        }, 1200);
    });
}

// --- PROFESSIONAL MULTI-SOCIAL REFER LINKS DECK ---
function initSocialShareSystem() {
    const textMsg = encodeURIComponent("Gold Miner Pro join karo aur real TON tokens airdrop reward pao! +5,000 coins turant free: ");
    const refLink = encodeURIComponent(document.getElementById('refer-link-input').value);

    document.getElementById('share-wa').href = `https://api.whatsapp.com/send?text=${textMsg}${refLink}`;
    document.getElementById('share-tg').href = `https://t.me/share/url?url=${refLink}&text=${textMsg}`;
    document.getElementById('share-tw').href = `https://twitter.com/intent/tweet?text=${textMsg}&url=${refLink}`;

    document.getElementById('copy-link-btn').addEventListener('click', () => {
        const copyInput = document.getElementById('refer-link-input');
        copyInput.select();
        copyInput.setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert("Referral URL successfully locked to clipboard!");
    });
}

// --- IMMERSIVE CINEMATIC AUDIO MATRIX SYSTEM ---
function initAudioChannels() {
    // Pure document par click track hoga, isse restriction 100% toot jayegi
    document.addEventListener('click', () => {
        controlBackgroundLoop();
    }, { once: true });
}

function controlBackgroundLoop() {
    const bgPlayer = document.getElementById('bg-audio-player');
    if (gameState.bgMusicActive) {
        bgPlayer.volume = 0.2;
        bgPlayer.play().catch(() => {
            console.log("Audio contextual block: User interaction required first.");
        });
    } else {
        bgPlayer.pause();
    }
}

function triggerAudioEffect(type) {
    if (type === 'tap' && gameState.tapSoundActive) {
        const tapPlayer = document.getElementById('tap-audio-player');
        tapPlayer.currentTime = 0;
        tapPlayer.play().catch(() => {});
    }
}

// --- LOCAL STORAGE PERSISTENCE SYSTEMS ---
function saveGameProgress() {
    localStorage.setItem('gm_coins', gameState.coins);
    localStorage.setItem('gm_pph', gameState.pph);
    localStorage.setItem('gm_level', gameState.level);
    localStorage.setItem('gm_lastClaim', gameState.lastDailyClaim);
}

function loadGameProgress() {
    if(localStorage.getItem('gm_coins')) gameState.coins = parseFloat(localStorage.getItem('gm_coins'));
    if(localStorage.getItem('gm_pph')) gameState.pph = parseInt(localStorage.getItem('gm_pph'));
    if(localStorage.getItem('gm_level')) gameState.level = parseInt(localStorage.getItem('gm_level'));
    if(localStorage.getItem('gm_lastClaim')) gameState.lastDailyClaim = parseInt(localStorage.getItem('gm_lastClaim'));
    updateDOMDisplay();
}
// --- Auto-Mining & Ad Refill System ---
let autoMiningInterval = null;
function stopAutoMining() {
    gameState.isAutoMiningActive = false;
    toggleBtn.innerText = "Auto-Mining: OFF";
    clearInterval(autoMiningInterval);
}
const toggleBtn = document.getElementById('toggle-mining-btn');

toggleBtn.addEventListener('click', () => {
    // Sirf Auto-Mining ki state ko ON/OFF toggle karein
    gameState.isAutoMiningActive = !gameState.isAutoMiningActive;

    if (gameState.isAutoMiningActive) {
        toggleBtn.innerText = "Auto-Mining: ON";
        
        // Mining shuru karein
        clearInterval(autoMiningInterval);
        autoMiningInterval = setInterval(() => {
            if (gameState.energy > 0) {
                gameState.coins += 1;
                gameState.energy -= 1;
                updateDOMDisplay();
            } else {
                stopAutoMining();
                alert("Energy depleted! Auto-Mining stopped.");
            }
        }, 500);
    } else {
        // Mining band karein
        stopAutoMining();
        toggleBtn.innerText = "Auto-Mining: OFF";
    }
});

    gameState.isAutoMiningActive = !gameState.isAutoMiningActive;

   if (gameState.isAutoMiningActive) {
        toggleBtn.innerText = "Auto-Mining: ON";
        gameState.refillCount++;
        
        clearInterval(autoMiningInterval); 
        autoMiningInterval = setInterval(() => {
            if (gameState.energy > 0) {
                gameState.coins += 1;
                gameState.energy -= 1;
                updateDOMDisplay();
            } else {
                stopAutoMining();
                alert("Energy depleted! Auto-Mining stopped.");
            }
        }, 500);
    } else {
        stopAutoMining();
    }
});
