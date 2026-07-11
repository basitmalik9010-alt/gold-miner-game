Window.addEventListener('load', () => {
    Console.log("Game Loaded!"); 
    
    Const nameElement = document.getElementById('user-name');
    Const tg = window.Telegram.WebApp;
    
    If (!nameElement) {
        Console.error("Error: 'user-name' ID wala HTML element nahi mila!");
    } else {
        Console.log("HTML element mil gaya!");
    }

    If (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        NameElement.innerText = tg.initDataUnsafe.user.first_name;
        Console.log("Naam mil gaya:", tg.initDataUnsafe.user.first_name);
    } else {
        NameElement.innerText = "Basit Bhaiya";
        Console.log("Telegram data nahi mila, fallback use kiya.");
    }
});

// --- CORE GAME ENGINE STATE TERMINAL ---
let gameState = {
    Coins: 0,
    Pph: 0,
    Level: 1,
    Energy: 1000,
    MaxEnergy: 1000,
    EarnPerTap: 1,
    TapSoundActive: true,
    BgMusicActive: true,
    LastDailyClaim: 0,
    IsAutoMiningActive: false
};

// --- VENTURES MATRIX REVENUE DEFINITIONS (10-20 Configuration) ---
const ventureUpgrades = {
    P2p: { cost: 200, pphReward: 15, id: 'btn-buy-p2p' },
    Node: { cost: 800, pphReward: 60, id: 'btn-buy-node' },
    Aibot: { cost: 3000, pphReward: 180, id: 'btn-buy-aibot' },
    Btcfarm: { cost: 10000, pphReward: 500, id: 'btn-buy-btcfarm' },
    Meme: { cost: 35000, pphReward: 1200, id: 'btn-buy-meme' },
    Staking: { cost: 100000, pphReward: 3000, id: 'btn-buy-staking' },
    Web3: { cost: 250000, pphReward: 7500, id: 'btn-buy-web3' },
    Liquidity: { cost: 800000, pphReward: 18000, id: 'btn-buy-liquidity' },
    Layer2: { cost: 2500000, pphReward: 45000, id: 'btn-buy-layer2' },
    Meta: { cost: 7000000, pphReward: 110000, id: 'btn-buy-meta' }
};

// --- DYNAMIC LEVEL CONFIGURATION CAP ---
function getTargetForLevel(currentLevel) {
    Const targets = {
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
    Return targets[currentLevel] || Infinity;
}

// --- INITIALIZER TERMINAL ---
document.addEventListener("DOMContentLoaded", () => {
    LoadGameProgress();
    InitNavigationRouter();
    InitMiningEngine();
    InitUpgradesMarket();
    InitSettingsPanel();
    InitSocialShareSystem();
    InitAudioChannels();
    InitRankButtons();
    
    // Core Engine Loops
    SetInterval(processPassiveEarnings, 1000);
    SetInterval(regenerateEnergyPool, 3000);
});

// --- UI REFRESH TERMINAL ---
function updateDOMDisplay() {
    Document.getElementById('coin-balance').innerText = Math.floor(gameState.coins).toLocaleString();
    Document.getElementById('pph-txt').innerText = `⚡ +${gameState.pph.toLocaleString()}`;
    Document.getElementById('earn-per-tap-txt').innerText = `🔨 +${gameState.earnPerTap}`;
    Document.getElementById('energy-counter').innerText = `${gameState.energy} / ${gameState.maxEnergy}`;
    
    Const scoreElement = document.getElementById('current-score');
    If (scoreElement) {
        ScoreElement.innerText = Math.floor(gameState.coins).toLocaleString();
    }
    
    Let currentTarget = getTargetForLevel(gameState.level);
    If (gameState.level >= 10) {
        Document.getElementById('next-level-val').innerText = "MAX LEVEL";
        Document.getElementById('level-num-txt').innerText = "Level 10/10";
        Document.getElementById('level-progress-bar').style.width = "100%";
        Document.getElementById('level-percent-txt').innerText = "100%";
        Document.getElementById('league-name').innerText = `👑 Ultimate Emperor (Level 10)`;
    } else {
        Document.getElementById('next-level-val').innerText = currentTarget.toLocaleString();
        Document.getElementById('level-num-txt').innerText = `Level ${gameState.level}/10`;
        
        Let percentage = (gameState.coins / currentTarget) * 100;
        If (percentage > 100) percentage = 100;
        
        Document.getElementById('level-progress-bar').style.width = `${percentage}%`;
        Document.getElementById('level-percent-txt').innerText = `${Math.floor(percentage)}%`;
        Document.getElementById('league-name').innerText = `👑 CEO Basit Malik (Level ${gameState.level})`;
    }
    
    SaveGameProgress();
}

// --- SECTION ROUTER HUB (4 Tabs Logic) ---
function initNavigationRouter() {
    Const navLinks = document.querySelectorAll('.nav-link');
    Const sections = document.querySelectorAll('.router-section');

    NavLinks.forEach(link => {
        Link.addEventListener('click', () => {
            NavLinks.forEach(nl => nl.classList.remove('active'));
            Sections.forEach(sec => sec.classList.remove('active'));

            Link.classList.add('active');
            Const targetSection = link.getAttribute('data-target');
            Document.getElementById(targetSection).classList.add('active');
            
            TriggerAudioEffect('tap');
        });
    });
}

// --- TAP ACTIVE ENGINE SYSTEM ---
function initMiningEngine() {
    Const tapTarget = document.getElementById('tap-target-btn');
    
    TapTarget.addEventListener('click', (e) => {
        If (gameState.isAutoMiningActive) {
            Return;
        }
        If (gameState.energy >= gameState.earnPerTap) {
            GameState.coins += gameState.earnPerTap;
            GameState.energy -= gameState.earnPerTap;
            
            TriggerAudioEffect('tap');
            CheckLevelUpCondition();
            UpdateDOMDisplay();
        } else {
            Alert("Urgent: Energy depleted! Wait for recovery loop.");
        }
    });

    // Daily Rewards Claim Implementation
    Document.getElementById('claim-daily-btn').addEventListener('click', () => {
        Const currentTime = Date.now();
        If (currentTime - gameState.lastDailyClaim >= 86400000 || gameState.lastDailyClaim === 0) {
            GameState.coins += 5000;
            GameState.lastDailyClaim = currentTime;
            Alert("Success: +5,000 Coins added to your global reserve!");
            CheckLevelUpCondition();
            UpdateDOMDisplay();
        } else {
            Alert("Access Denied: Next reward node available tomorrow!");
        }
    });

    // Real AdsGram Integration Setup
    Document.getElementById('watch-ad-btn-1').addEventListener('click', () => {
        Const adButton = document.getElementById('watch-ad-btn-1');
        AdButton.disabled = true;
        AdButton.innerText = "⏳ Loading Ad...";
        
        Try {
            If (window.AdsGram) {
                Const AdController = window.AdsGram.init({ blockId: "38024" });
                AdController.show().then((result) => {
                    GameState.coins += 5000;
                    AdButton.disabled = false;
                    AdButton.innerText = "⚡ Launch Ad Stream";
                    Alert("Success: +5,000 Coins added to your global reserve!");
                    CheckLevelUpCondition();
                    UpdateDOMDisplay();
                }).catch((result) => {
                    AdButton.disabled = false;
                    AdButton.innerText = "⚡ Launch Ad Stream";
                    Alert("Ad poora nahi dekha gaya, isliye reward nahi mila.");
                    Console.log("AdsGram Error:", result);
                });
            } else {
                Throw new Error("AdsGram script not loaded yet");
            }
        } catch (error) {
            AdButton.disabled = false;
            AdButton.innerText = "⚡ Launch Ad Stream";
            Alert("Ad network load nahi ho paya. Kripya thodi der baad prayas karein.");
            Console.error("AdsGram Initialization Error:", error);
        }
    });

    // Auto-Mining Button Logic
    Const toggleBtn = document.getElementById('toggle-mining-btn');
    If (toggleBtn) {
        ToggleBtn.addEventListener('click', () => {
            GameState.isAutoMiningActive = !gameState.isAutoMiningActive;

            If (gameState.isAutoMiningActive) {
                ToggleBtn.innerText = "Auto-Mining: ON";
                ToggleBtn.classList.add('active');
                
                ClearInterval(autoMiningInterval);
                AutoMiningInterval = setInterval(() => {
                    If (gameState.energy > 0) {
                        GameState.coins += 1;
                        GameState.energy -= 1;
                        UpdateDOMDisplay();
                    } else {
                        StopAutoMining();
                        Alert("Energy depleted! Auto-Mining stopped.");
                    }
                }, 500);
            } else {
                StopAutoMining();
            }
        });
    }
}

Let autoMiningInterval = null;
function stopAutoMining() {
    GameState.isAutoMiningActive = false;
    Const toggleBtn = document.getElementById('toggle-mining-btn');
    If (toggleBtn) {
        ToggleBtn.innerText = "Auto-Mining: OFF";
        ToggleBtn.classList.remove('active');
    }
    ClearInterval(autoMiningInterval);
}

// --- VENTURES MARKET ENGINE ---
function initUpgradesMarket() {
    Object.keys(ventureUpgrades).forEach(key => {
        Const upgrade = ventureUpgrades[key];
        Const btn = document.getElementById(upgrade.id);
        
        If (btn) {
            Btn.addEventListener('click', () => {
                If (gameState.coins >= upgrade.cost) {
                    GameState.coins -= upgrade.cost;
                    GameState.pph += upgrade.pphReward;
                    
                    Upgrade.cost = Math.floor(upgrade.cost * 1.5);
                    Btn.innerText = `Cost: ${upgrade.cost.toLocaleString()} 🪙`;
                    
                    Alert(`Purchase Confirmed! PPH production enhanced by +${upgrade.pphReward}`);
                    UpdateDOMDisplay();
                } else {
                    Alert("Deficit: Insufficient coin liquidity to purchase upgrade.");
                }
            });
        }
    });
}

// --- AUTO RUN TIMERS CONTROL HUB ---
function processPassiveEarnings() {
    If (gameState.pph > 0) {
        GameState.coins += (gameState.pph / 3600);
        CheckLevelUpCondition();
        UpdateDOMDisplay();
    }
}

function regenerateEnergyPool() {
    If (gameState.energy < gameState.maxEnergy) {
        GameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 3);
        UpdateDOMDisplay();
    }
}

function checkLevelUpCondition() {
    Let target = getTargetForLevel(gameState.level);
    While (gameState.coins >= target && gameState.level < 10) {
        GameState.level++;
        Target = getTargetForLevel(gameState.level);
        Alert(`🎉 Congratulations Basit Bhaiya! You leveled up to Level ${gameState.level}!`);
    }
}

// --- SETTINGS PANEL CONTROL INTEREACE ---
function initSettingsPanel() {
    Const overlay = document.getElementById('settings-overlay');
    Const openBtn = document.getElementById('open-settings-btn');
    Const closeBtn = document.getElementById('close-settings-btn');
    Const toggleMusic = document.getElementById('toggle-bg-music');
    Const toggleTap = document.getElementById('toggle-tap-sound');
    Const tonTrigger = document.getElementById('ton-connect-trigger');

    If(openBtn) openBtn.addEventListener('click', () => overlay.classList.add('active'));
    If(closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    
    If(toggleMusic) {
        ToggleMusic.addEventListener('click', () => {
            GameState.bgMusicActive = !gameState.bgMusicActive;
            ToggleMusic.classList.toggle('active', gameState.bgMusicActive);
            ToggleMusic.innerText = gameState.bgMusicActive ? "ON" : "OFF";
            ControlBackgroundLoop();
        });
    }

    If(toggleTap) {
        ToggleTap.addEventListener('click', () => {
            GameState.tapSoundActive = !gameState.tapSoundActive;
            ToggleTap.classList.toggle('active', gameState.tapSoundActive);
            ToggleTap.innerText = gameState.tapSoundActive ? "ON" : "OFF";
        });
    }

    If(tonTrigger) {
        TonTrigger.addEventListener('click', () => {
            TonTrigger.innerText = "Connecting Tonkeeper...";
            SetTimeout(() => {
                Window.location.href = "https://tonconnect.org"; 
            }, 1200);
        });
    }
}

// --- PROFESSIONAL MULTI-SOCIAL REFER LINKS DECK ---
function initSocialShareSystem() {
    Const textMsg = encodeURIComponent("Gold Miner Pro join karo aur real TON tokens airdrop reward pao! +5,000 coins turant free: ");
    Const referInput = document.getElementById('refer-link-input');
    Const refLink = referInput ? EncodeURIComponent(referInput.value) : "";

    If(document.getElementById('share-wa')) document.getElementById('share-wa').href = `https://api.whatsapp.com/send?text=${textMsg}${refLink}`;
    If(document.getElementById('share-tg')) document.getElementById('share-tg').href = `https://t.me/share/url?url=${refLink}&text=${textMsg}`;
    If(document.getElementById('share-tw')) document.getElementById('share-tw').href = `https://twitter.com/intent/tweet?text=${textMsg}&url=${refLink}`;

    Const copyBtn = document.getElementById('copy-link-btn');
    If(copyBtn) {
        CopyBtn.addEventListener('click', () => {
            Const copyInput = document.getElementById('refer-link-input');
            CopyInput.select();
            CopyInput.setSelectionRange(0, 99999);
            Document.execCommand("copy");
            Alert("Referral URL successfully locked to clipboard!");
        });
    }
}

// --- IMMERSIVE CINEMATIC AUDIO MATRIX SYSTEM ---
function initAudioChannels() {
    Document.addEventListener('click', () => {
        ControlBackgroundLoop();
    }, { once: true });
}

function controlBackgroundLoop() {
    Const bgPlayer = document.getElementById('bg-audio-player');
    If (bgPlayer && gameState.bgMusicActive) {
        BgPlayer.volume = 0.2;
        BgPlayer.play().catch(() => {
            Console.log("Audio contextual block: User interaction required first.");
        });
    } else if(bgPlayer) {
        BgPlayer.pause();
    }
}

function triggerAudioEffect(type) {
    If (type === 'tap' && gameState.tapSoundActive) {
        Const tapPlayer = document.getElementById('tap-audio-player');
        If(tapPlayer) {
            TapPlayer.currentTime = 0;
            TapPlayer.play().catch(() => {});
        }
    }
}

function initRankButtons() {
    Const rankButtons = document.querySelectorAll('.rank-btn');
    RankButtons.forEach(button => {
        Button.addEventListener('click', function() {
            Const activeBtn = document.querySelector('.rank-btn.active');
            If(activeBtn) activeBtn.classList.remove('active');
            This.classList.add('active');
        });
    });
}

// --- LOCAL STORAGE PERSISTENCE SYSTEMS ---
function saveGameProgress() {
    LocalStorage.setItem('gm_coins', gameState.coins);
    LocalStorage.setItem('gm_pph', gameState.pph);
    LocalStorage.setItem('gm_level', gameState.level);
    LocalStorage.setItem('gm_lastClaim', gameState.lastDailyClaim);
}

function loadGameProgress() {
    If(localStorage.getItem('gm_coins')) gameState.coins = parseFloat(localStorage.getItem('gm_coins'));
    If(localStorage.getItem('gm_pph')) gameState.pph = parseInt(localStorage.getItem('gm_pph'));
    If(localStorage.getItem('gm_level')) gameState.level = parseInt(localStorage.getItem('gm_level'));
    If(localStorage.getItem('gm_lastClaim')) gameState.lastDailyClaim = parseInt(localStorage.getItem('gm_lastClaim'));
    UpdateDOMDisplay();
}
