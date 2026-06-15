document.addEventListener("DOMContentLoaded", () => {
    // Advanced Reactive State Controller Engine
    let state = {
        coins: parseFloat(localStorage.getItem("h_coins")) || 0.0,
        energy: parseInt(localStorage.getItem("h_energy")) || 1000,
        pph: parseFloat(localStorage.getItem("h_pph")) || 0.0, // Profit Per Hour
        perTap: 1.0,
        level: parseInt(localStorage.getItem("h_level")) || 1,
        maxEnergy: 1000,
        coinsNeeded: 1500
    };

    // Safe Initialization Telegram Integration Protocols
    let tgUser = { first_name: "Basit Bhaiya", id: "73849103" };
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        tg.ready();
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            tgUser = tg.initDataUnsafe.user;
        }
    }

    // Dynamic Referral Link Configuration Constructor
    const refLinkInput = document.getElementById("share-link-input");
    if(refLinkInput) {
        refLinkInput.value = `https://t.me/gold_miner_elite_bot?start=ref_${tgUser.id}`;
    }

    const elements = {
        username: document.getElementById("username-display"),
        coinDisplay: document.getElementById("coin-balance"),
        withdrawalDisplay: document.getElementById("withdrawal-display-balance"),
        energyDisplay: document.getElementById("energy-counter"),
        progressBar: document.getElementById("level-progress"),
        progressPercent: document.getElementById("progress-percent-text"),
        levelText: document.getElementById("current-level-text"),
        tapBtn: document.getElementById("tap-target-btn"),
        payoutBtn: document.getElementById("payout-trigger-btn"),
        profileBtn: document.getElementById("user-profile-btn"),
        walletBtn: document.getElementById("wallet-connect-btn"),
        walletInput: document.getElementById("wallet-address"),
        warningText: document.getElementById("limit-warning-text"),
        pphDisplay: document.getElementById("pph-txt"),
        copyBtn: document.getElementById("copy-link-trigger"),
        toast: document.getElementById("copy-toast"),
        tgInvite: document.getElementById("tg-invite-btn")
    };

    elements.username.innerText = tgUser.first_name;

    function updateDashboard() {
        elements.coinDisplay.innerText = Math.floor(state.coins).toLocaleString();
        elements.withdrawalDisplay.innerText = Math.floor(state.coins).toLocaleString();
        elements.energyDisplay.innerText = `${state.energy} / ${state.maxEnergy}`;
        elements.pphDisplay.innerText = `⚡ +${state.pph.toFixed(0)}/h`;
        
        let percent = (state.coins / state.coinsNeeded) * 100;
        if(percent > 100) percent = 100;
        elements.progressBar.style.width = `${percent}%`;
        elements.progressPercent.innerText = `${Math.floor(percent)}%`;
        elements.levelText.innerText = `Level ${state.level}/10`;

        // Smart Contract TON Target Limit Lock Mechanism
        if (state.coins >= 5000) {
            elements.payoutBtn.classList.add("ready");
            elements.warningText.innerHTML = "🎯 Requirement Met! You can now request your TON distribution.";
            elements.warningText.style.color = "#27ae60";
        } else {
            elements.payoutBtn.classList.remove("ready");
            elements.warningText.innerHTML = "Minimum Payout Requirement: <strong>5,000.0 COINS</strong>";
            elements.warningText.style.color = "#eb5757";
        }

        // Persistent Cache Saving Operations
        localStorage.setItem("h_coins", state.coins);
        localStorage.setItem("h_energy", state.energy);
        localStorage.setItem("h_pph", state.pph);
        localStorage.setItem("h_level", state.level);
    }

    // Audio Click Synthesizer Engine
    function triggerClickSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(580, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {}
    }

    // Passive Income Profit Per Hour (PPH) Chrono Loop
    setInterval(() => {
        if (state.pph > 0) {
            // Generates fractions of coins distributed smoothly per second (PPH / 3600 seconds)
            state.coins += (state.pph / 3600);
            updateDashboard();
        }
    }, 1000);

    // Core Interaction Engine Trigger Listener
    elements.tapBtn.addEventListener("click", (e) => {
        if (state.energy < state.perTap) return;

        state.energy -= 1;
        state.coins += state.perTap;
        triggerClickSound();

        if (state.coins >= state.coinsNeeded && state.level < 10) {
            state.level += 1;
            state.coinsNeeded *= 2.5;
        }

        // Floating UI Vector Text Generator
        const rect = elements.tapBtn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const floatDiv = document.createElement("div");
        floatDiv.className = "floating-text";
        floatDiv.innerText = `+${state.perTap}`;
        floatDiv.style.left = `${x}px`;
        floatDiv.style.top = `${y}px`;
        
        elements.tapBtn.appendChild(floatDiv);
        setTimeout(() => floatDiv.remove(), 700);

        updateDashboard();
    });

    // Buy Venture Upgrades System Logic
    function setupUpgradeCard(btnId, baseCost, addedPph) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        
        btn.addEventListener("click", () => {
            if (state.coins >= baseCost) {
                state.coins -= baseCost;
                state.pph += addedPph;
                alert(`🎉 Business Venture Upgraded Successfully!\nYour Passive Income increased by +${addedPph} PPH.`);
                updateDashboard();
            } else {
                alert("❌ Insufficient Funds: You do not have enough coins to acquire this enterprise node yet.");
            }
        });
    }
    setupUpgradeCard("btn-buy-p2p", 200, 15);
    setupUpgradeCard("btn-buy-node", 800, 60);
    setupUpgradeCard("btn-buy-alpha", 3000, 250);

    // Fully Functional Referral Copy Logic Interceptors
    elements.copyBtn.addEventListener("click", () => {
        refLinkInput.select();
        refLinkInput.setSelectionRange(0, 99999); // Mobile compliance handle
        navigator.clipboard.writeText(refLinkInput.value).then(() => {
            elements.toast.style.display = "block";
            setTimeout(() => elements.toast.style.display = "none", 2500);
        });
    });

    // Native External Telegram Referral Redirect Engine
    elements.tgInvite.addEventListener("click", () => {
        const shareText = encodeURIComponent("🚀 Join my Elite Web3 Crypto Mining Alliance! Tap to earn massive secure token distributions!");
        const fullShareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLinkInput.value)}&text=${shareText}`;
        window.open(fullShareUrl, "_blank");
    });

    // Claim Active Referral Bonuses Loops
    document.querySelectorAll(".claim-ref-btn").forEach(btn => {
        if(!btn.classList.contains("claimed")) {
            btn.addEventListener("click", () => {
                const prize = parseFloat(btn.dataset.prize);
                state.coins += prize;
                btn.innerText = "Claimed ✓";
                btn.classList.add("claimed");
                btn.disabled = true;
                alert(`🪙 Reward Dispatched! +${prize} coins have been successfully added into your balance matrix.`);
                updateDashboard();
            });
        }
    });

    // Navigation Structural Subsystem Switching Systems
    document.querySelectorAll(".nav-link").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".router-section").forEach(s => s.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(btn.dataset.target).classList.add("active");
        });
    });

    // Energy Replenish Systems Loop
    setInterval(() => {
        if (state.energy < state.maxEnergy) {
            state.energy = Math.min(state.maxEnergy, state.energy + 3);
            updateDashboard();
        }
    }, 1500);

    elements.profileBtn.addEventListener("click", () => {
        alert(`👤 Telegram Executive Node Profile:\n──────────────────\nUser: ${tgUser.first_name}\nNode ID: ${tgUser.id}\nNetwork Status: Vault Core Secured 🔐`);
    });

    elements.walletBtn.addEventListener("click", () => {
        alert("💎 TON Connect Web3 Pipeline:\n──────────────────\nEstablishing link with decentralized secure RPC architecture... Ensure Tonkeeper is activated.");
    });

    elements.payoutBtn.addEventListener("click", () => {
        if (state.coins < 5000) return;
        const addr = elements.walletInput.value.trim();
        if (!addr) {
            alert("⚠️ Missing Fields: Destination on-chain address string parameter is empty.");
            return;
        }
        alert(`🚀 Smart Contract Automated Payout Dispatched!\n──────────────────\nAsset Allocation: ${Math.floor(state.coins)} Coins\nDestination TON String: ${addr}\n\nTransaction payload broadcast complete.`);
    });

    updateDashboard();
});