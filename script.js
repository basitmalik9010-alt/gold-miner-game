document.addEventListener("DOMContentLoaded", () => {
    // 1. Game Variable Engine (Coins, Energy, PPH)
    let coins = 0;
    let energy = 1000;
    let pph = 0;
    let perTap = 1;

    // 2. HTML Elements Connectors
    const coinDisplay = document.getElementById("coin-balance");
    const withdrawalDisplay = document.getElementById("withdrawal-display-balance");
    const energyDisplay = document.getElementById("energy-counter");
    const pphDisplay = document.getElementById("pph-txt");
    const tapBtn = document.getElementById("tap-target-btn");

    // 3. Screen Update Function
    function updateUI() {
        if (coinDisplay) coinDisplay.innerText = Math.floor(coins).toLocaleString();
        if (withdrawalDisplay) withdrawalDisplay.innerText = Math.floor(coins).toLocaleString();
        if (energyDisplay) energyDisplay.innerText = `${energy} / 1000`;
        if (pphDisplay) pphDisplay.innerText = `⚡ +${Math.floor(pph)}/h`;
    }

    // 4. Guaranteed Tap Clicking Action
    if (tapBtn) {
        tapBtn.onclick = () => {
            if (energy > 0) {
                coins += perTap;
                energy -= 1;
                updateUI();
            } else {
                alert("Out of Energy! Please wait...");
            }
        };
    }

    // 5. Bottom Navigation Menu Router (5 Tabs Switching)
    document.querySelectorAll(".nav-link").forEach(btn => {
        btn.onclick = () => {
            // Sabhi tabs ko pehle deactivate karein
            document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".router-section").forEach(s => s.classList.remove("active"));
            
            // Jo click hua use active karein
            btn.classList.add("active");
            const targetId = btn.getAttribute("data-target");
            const activeSection = document.getElementById(targetId);
            if (activeSection) {
                activeSection.classList.add("active");
            }
        };
    });

    // 6. Cards / Upgrades Buying Mechanism
    function setupCard(id, cost, gainPph) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = () => {
                if (coins >= cost) {
                    coins -= cost;
                    pph += gainPph;
                    alert("Upgrade Success! Your Profit Per Hour increased.");
                    updateUI();
                } else {
                    alert("Need more coins to unlock this venture!");
                }
            };
        }
    }
    setupCard("btn-buy-p2p", 200, 15);
    setupCard("btn-buy-node", 800, 60);

    // 7. Earn Ads Station Live Click Simulation
    const adBtn = document.getElementById("watch-ad-btn-1");
    if (adBtn) {
        adBtn.onclick = () => {
            adBtn.innerText = "⏳ Loading Video Ad Stream...";
            adBtn.style.opacity = "0.6";
            
            setTimeout(() => {
                coins += 5000;
                alert("🎬 Ad Watched Successfully!\nReward: +5,000 Coins Credited into your balance.");
                adBtn.innerText = "⚡ Launch Ad Stream";
                adBtn.style.opacity = "1";
                updateUI();
            }, 2000);
        };
    }

    // 8. Auto-Mining Clock (Profit Per Hour Engine)
    setInterval(() => {
        if (pph > 0) {
            coins += (pph / 3600);
            updateUI();
        }
    }, 1000);

    // Initial Display Load
    updateUI();
});