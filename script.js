const originalBackground =
    'url("https://i.pinimg.com/originals/1d/30/b5/1d30b5a0c298c02edaf2f501b22a6587.gif")';
const infoBackground =
    'url("https://www.shutterstock.com/image-photo/futuristic-digital-network-glowing-blue-600nw-2662126927.jpg")';

let totalMs = 0;
let usedMs = 0;
let interval;
let startTimestamp;

function loadTimerState() {
    const saved = localStorage.getItem("escapeRoomTimer");

    if (saved) {
        const data = JSON.parse(saved);
        totalMs = data.totalMs;
        startTimestamp = data.startTimestamp;

        if (Date.now() - startTimestamp < totalMs) {
            usedMs = Date.now() - startTimestamp;
            updateDisplay();
            toggleTimerButtons(true);
            resumeTimer();
        } else {
            document.getElementById("timer").textContent =
                "00:00:00.000";
        }
    }
}

function saveTimerState() {
    localStorage.setItem(
        "escapeRoomTimer",
        JSON.stringify({
            totalMs,
            startTimestamp,
        })
    );
}

function resumeTimer() {
    stopTimer();

    interval = setInterval(() => {
        usedMs = Date.now() - startTimestamp;
        updateDisplay();
        saveTimerState();

        if (totalMs - usedMs <= 0) {
            document.body.classList.add("game-over");
            localStorage.removeItem("escapeRoomTimer");

            document.querySelector("main").innerHTML = `
                <h1 style="color:#ff4444;">GAME OVER</h1>
                <h2 style="color:#ff6666;">Time Expired!</h2>
                <button onclick="location.reload()">PLAY AGAIN</button>
            `;
        }
    }, 16);
}

function pad(num, digits = 2) {
    return num.toString().padStart(digits, "0");
}

function updateDisplay() {
    const remainingMs = totalMs - usedMs;

    if (remainingMs <= 0) {
        document.getElementById("timer").textContent =
            "00:00:00.000";
        return;
    }

    const hours = Math.floor(remainingMs / 3600000);
    const mins = Math.floor(
        (remainingMs % 3600000) / 60000
    );
    const secs = Math.floor(
        (remainingMs % 60000) / 1000
    );
    const ms = pad(remainingMs % 1000, 3);

    document.getElementById("timer").textContent = `${pad(
        hours
    )}:${pad(mins)}:${pad(secs)}.${ms}`;
}

function startTimer() {
    totalMs = 45 * 60000;
    startTimestamp = Date.now();
    usedMs = 0;

    updateDisplay();
    resumeTimer();
    toggleTimerButtons(true);
}

function stopTimer() {
    clearInterval(interval);
}

function resetTimer() {
    stopTimer();
    localStorage.removeItem("escapeRoomTimer");
    totalMs = 0;
    usedMs = 0;
    updateDisplay();
    toggleTimerButtons(false);
}

function toggleTimerButtons(running) {
    document.getElementById("startBtn").disabled = running;
    document.getElementById("pauseBtn").disabled = !running;
    document.getElementById("resetBtn").disabled = false;
}

loadTimerState();

function startGame() {
    alert("Game starting! (Placeholder for full game)");
}

function showInfo() {
    document.getElementById("mainMenu").hidden = true;
    document.getElementById("infoScreen").hidden = false;
    document.body.style.backgroundImage = infoBackground;
    loadTimerState();
}

function hideInfo() {
    document.getElementById("infoScreen").hidden = true;
    document.getElementById("mainMenu").hidden = false;
    document.body.style.backgroundImage = originalBackground;
    document.body.classList.remove("game-over");
}

window.addEventListener("beforeunload", saveTimerState);