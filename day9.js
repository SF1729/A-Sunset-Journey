/* ==========================================================================
   BUDDUU — DAY 09: “OPERATION: LAST GATE // THE SEVEN SEALS”
   7 Trials • 7 Seals • Hardcore 3-Attempt Model • Live IST Countdown Engine
   ========================================================================== */

/**
 * ==========================================================================
 * 1. PUZZLE CONFIGURATION (Preserving 100% of Authoritative Answers)
 * ==========================================================================
 */
const PUZZLE_CONFIG = {
  p1: {
    targetSequence: ["🌅", "❤️", "🌙", "⭐"],
    hints: [
      "Follow the natural order of time: daylight begins, the heart connects, night watcher follows, and the night star shines.",
      "The sequence is Sunrise (🌅) → Heart (❤️) → Moon (🌙) → Star (⭐)."
    ]
  },
  p2: {
    triggerObj: "clock",
    descriptions: {
      photo: "A framed polaroid of past sunset moments. The glass is smooth and firmly fixed; no mechanism is concealed behind it.",
      note: "A folded handwritten scrap that reads: 'Patience reveals what haste overlooks. True switches measure what remains.'",
      clock: "An antique brass clock. Its hands tick with an unusual mechanical resonance... As you press the crown, a latch clicks inside!"
    },
    hints: [
      "One preserves a moment, one a message, one measures the wait. Which one counts time?",
      "Inspect and trigger the antique clock mechanism."
    ]
  },
  p3: {
    targetWord: "HEART",
    hints: [
      "Every letter moved forward by 1 in the alphabet (I→H, F→E...).",
      "Shift each letter back: I-1=H, F-1=E, B-1=A, S-1=R, U-1=T."
    ]
  },
  p4: {
    triggerPanel: "heart",
    descriptions: {
      key: "A heavy brass key. It doesn't fit any panel socket in this chamber.",
      hourglass: "A delicate sand timer. The sand flows normally, but the frame is stationary.",
      heart: "A carved ruby heart. As your fingers press upon its facet, a circuit clicks and glows brightly!",
      compass: "A magnetic compass needle spinning erratically in circles.",
      prism: "A glass prism scattering amber light, but entirely decorative."
    },
    hints: [
      "Look back at the word you just decoded in Trial 03.",
      "Select and activate the ruby heart emblem on the panel."
    ]
  },
  p5: {
    targetSequence: ["B", "D", "A", "C"],
    hints: [
      "Rule 3 states C is last. Rule 2 states D follows B immediately.",
      "Since B is before A, and D is immediately after B: the sequence is B, D, A, C."
    ]
  },
  p6: {
    targetRelay: "amber",
    hints: [
      "Recall the clue: 'The relay that carries the warmth of the warning light'.",
      "The warning light glow in this facility is amber."
    ]
  },
  p7: {
    targetCode: "4549",
    hints: [
      "Collect the tokens from chambers 1, 2, and 3. Then append the day before Day 10.",
      "Chamber 1 token is 4. Chamber 2 is 5. Chamber 3 is 4. Day 9 is 9. Combine them: 4549."
    ]
  },
  p8: {
    targetWord: "TOMORROW",
    hints: [
      "Think about what day arrives after tonight, holding the 10th birthday.",
      "The answer is 'TOMORROW'."
    ]
  }
};

/**
 * ==========================================================================
 * 2. STATE MANAGEMENT & STORAGE
 * ==========================================================================
 */
const STORAGE_KEY = "budduu_day9_escape_state_v1";

const DEFAULT_STATE = {
  dateUnlocked: false,
  introSeen: false,
  currentRoom: 1, // Chambers 1..4
  completedRooms: [],
  completedPuzzles: [],
  earnedTokens: { 1: null, 2: null, 3: null },
  puzzleAttempts: {
    p1: 3, p2: 3, p3: 3, p4: 3,
    p5: 3, p6: 3, p7: 3, p8: 3
  },
  hintsRequested: {
    p1: 0, p2: 0, p3: 0, p4: 0,
    p5: 0, p6: 0, p7: 0, p8: 0
  },
  roomLockdown: null,
  isEscapeComplete: false,
  soundEnabled: false
};

let gameState = { ...DEFAULT_STATE };

// Working Buffers
let p1SelectedSymbols = [];
let p5SelectedSwitches = [];
let p7EnteredDigits = [];

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      gameState = {
        ...DEFAULT_STATE,
        ...parsed,
        earnedTokens: { ...DEFAULT_STATE.earnedTokens, ...(parsed.earnedTokens || {}) },
        puzzleAttempts: { ...DEFAULT_STATE.puzzleAttempts, ...(parsed.puzzleAttempts || {}) },
        hintsRequested: { ...DEFAULT_STATE.hintsRequested, ...(parsed.hintsRequested || {}) }
      };
      return true;
    }
  } catch (err) {
    console.warn("Storage read error:", err);
  }
  return false;
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (err) {
    console.warn("Storage write error:", err);
  }
}

/**
 * ==========================================================================
 * 3. AUDIO SYNTHESIS ENGINE (Muted by Default)
 * ==========================================================================
 */
let audioCtx = null;

function playFx(freq = 440, duration = 0.12, type = "sine") {
  if (!gameState.soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function initAudioToggle() {
  const toggleBtn = document.getElementById("btnAudioToggle");
  const icon = document.getElementById("soundIcon");
  const label = document.getElementById("soundLabel");

  if (!toggleBtn) return;

  function updateUi() {
    if (icon) icon.textContent = gameState.soundEnabled ? "🔊" : "🔇";
    if (label) label.textContent = gameState.soundEnabled ? "SOUND: ON" : "SOUND: OFF";
    toggleBtn.setAttribute("aria-pressed", String(gameState.soundEnabled));
  }

  updateUi();

  toggleBtn.addEventListener("click", () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    persistState();
    updateUi();
    if (gameState.soundEnabled) {
      playFx(520, 0.1, "triangle");
    }
  });
}

/**
 * ==========================================================================
 * 4. ENGINE INITIALIZATION & DATE GATE
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  initDay9Engine();
});

function initDay9Engine() {
  const day9Data = (typeof JOURNEY_DAYS !== "undefined")
    ? JOURNEY_DAYS.find((d) => d.day === 9)
    : { day: 9, dateStr: "2026-10-28" };

  const isUnlockedByDate = (typeof isDateUnlocked === "function")
    ? isDateUnlocked(day9Data.dateStr)
    : true;

  const dateLockedView = document.getElementById("day9DateLockedView");
  const introView = document.getElementById("day9IntroView");
  const gameView = document.getElementById("day9GameView");
  const completionView = document.getElementById("day9CompletionScreen");

  if (!isUnlockedByDate) {
    if (dateLockedView) dateLockedView.style.display = "flex";
    if (introView) introView.style.display = "none";
    if (gameView) gameView.style.display = "none";
    if (completionView) completionView.style.display = "none";

    const daysRemaining = (typeof getDaysUntil === "function") ? getDaysUntil(day9Data.dateStr) : 0;
    const countdownEl = document.getElementById("dateLockCountdown");
    if (countdownEl) {
      countdownEl.textContent = daysRemaining > 0 
        ? `Unlocks in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} (28 October 2026)`
        : "Unlocks on 28 October 2026";
    }
    return;
  }

  if (dateLockedView) dateLockedView.style.display = "none";

  loadSavedState();
  gameState.dateUnlocked = true;

  initAudioToggle();
  initParticles();
  initNextDayGuard();
  initHudInteractions();
  initModalInteractions();
  initPuzzles();

  // If already completed in prior session, jump straight to Experience 8
  if (gameState.isEscapeComplete) {
    if (introView) introView.style.display = "none";
    if (gameView) gameView.style.display = "none";
    if (completionView) completionView.style.display = "block";
    startFinalCountdownTimer();
    return;
  }

  // Briefing Screen Gate
  if (!gameState.introSeen) {
    if (introView) introView.style.display = "flex";
    if (gameView) gameView.style.display = "none";

    const btnStart = document.getElementById("btnStartEscapeRoom");
    if (btnStart) {
      btnStart.addEventListener("click", () => {
        gameState.introSeen = true;
        persistState();
        introView.style.display = "none";
        gameView.style.display = "block";
        renderActiveRoom();
      });
    }
  } else {
    if (introView) introView.style.display = "none";
    if (gameView) gameView.style.display = "block";
    renderActiveRoom();
  }
}

/**
 * ==========================================================================
 * 5. ATMOSPHERIC DUST PARTICLES
 * ==========================================================================
 */
function initParticles() {
  const canvas = document.getElementById("day9ParticlesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const count = window.innerWidth <= 768 ? 20 : 36;
  const particles = [];
  const glyphs = ["⚜", "✦", "·", "•", "✧"];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      symbol: glyphs[Math.floor(Math.random() * glyphs.length)],
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.2 + 0.06,
      speedX: (Math.random() - 0.5) * 0.12,
      opacity: Math.random() * 0.45 + 0.1,
      pulse: Math.random() * Math.PI
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }

      p.pulse += 0.015;
      const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

      ctx.fillStyle = `rgba(199, 167, 108, ${alpha})`;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.symbol, p.x, p.y);
    });

    requestAnimationFrame(render);
  }

  render();
}

/**
 * ==========================================================================
 * 6. HUD & SEVEN SEALS TRACKING
 * ==========================================================================
 */
function renderActiveRoom() {
  if (gameState.roomLockdown === gameState.currentRoom) {
    showLockdownModal(gameState.currentRoom);
  }

  const roomNames = {
    1: "THE SEALED ENTRANCE",
    2: "THE CIPHER ARCHIVE",
    3: "THE BRASS SWITCHBOARD",
    4: "THE MASTER LEDGER & LAST GATE"
  };

  const hudBadge = document.getElementById("hudRoomBadge");
  const hudName = document.getElementById("hudRoomName");
  if (hudBadge) hudBadge.textContent = `CHAMBER 0${gameState.currentRoom} / 04`;
  if (hudName) hudName.textContent = roomNames[gameState.currentRoom] || "";

  // Map 8 puzzles to the 7 Seals Ribbon
  updateSevenSealsRibbon();

  // Show only active chamber container
  for (let r = 1; r <= 4; r++) {
    const container = document.getElementById(`room${r}Container`);
    if (container) {
      container.style.display = (r === gameState.currentRoom) ? "block" : "none";
    }
  }

  updateAttemptsDisplay();
  refreshRoomSubModules();
}

function updateSevenSealsRibbon() {
  // Mapping logic:
  // Seal 1: p1
  // Seal 2: p2
  // Seal 3: p3
  // Seal 4: p4
  // Seal 5: p5 & p6
  // Seal 6: p7
  // Seal 7: p8
  const sealsState = [
    gameState.completedPuzzles.includes("p1"),
    gameState.completedPuzzles.includes("p2"),
    gameState.completedPuzzles.includes("p3"),
    gameState.completedPuzzles.includes("p4"),
    gameState.completedPuzzles.includes("p5") && gameState.completedPuzzles.includes("p6"),
    gameState.completedPuzzles.includes("p7"),
    gameState.completedPuzzles.includes("p8")
  ];

  sealsState.forEach((isDone, idx) => {
    const node = document.getElementById(`sealNode${idx + 1}`);
    if (node) {
      node.classList.toggle("completed", isDone);
      // Active is next uncompleted
      const isCurrentTarget = !isDone && (idx === 0 || sealsState[idx - 1]);
      node.classList.toggle("active", isCurrentTarget);
    }
  });
}

function refreshRoomSubModules() {
  // Chamber 1
  const p1Module = document.getElementById("p1Module");
  const p2Module = document.getElementById("p2Module");
  const room1Banner = document.getElementById("room1SolvedBanner");
  if (p1Module && p2Module && room1Banner) {
    const p1Done = gameState.completedPuzzles.includes("p1");
    const p2Done = gameState.completedPuzzles.includes("p2");
    p1Module.style.display = p1Done ? "none" : "block";
    p2Module.style.display = p1Done && !p2Done ? "block" : "none";
    room1Banner.style.display = p1Done && p2Done ? "block" : "none";
  }

  // Chamber 2
  const p3Module = document.getElementById("p3Module");
  const p4Module = document.getElementById("p4Module");
  const room2Banner = document.getElementById("room2SolvedBanner");
  if (p3Module && p4Module && room2Banner) {
    const p3Done = gameState.completedPuzzles.includes("p3");
    const p4Done = gameState.completedPuzzles.includes("p4");
    p3Module.style.display = p3Done ? "none" : "block";
    p4Module.style.display = p3Done && !p4Done ? "block" : "none";
    room2Banner.style.display = p3Done && p4Done ? "block" : "none";
  }

  // Chamber 3
  const p5Module = document.getElementById("p5Module");
  const p6Module = document.getElementById("p6Module");
  const room3Banner = document.getElementById("room3SolvedBanner");
  if (p5Module && p6Module && room3Banner) {
    const p5Done = gameState.completedPuzzles.includes("p5");
    const p6Done = gameState.completedPuzzles.includes("p6");
    p5Module.style.display = p5Done ? "none" : "block";
    p6Module.style.display = p5Done && !p6Done ? "block" : "none";
    room3Banner.style.display = p5Done && p6Done ? "block" : "none";
  }

  // Chamber 4
  const p7Module = document.getElementById("p7Module");
  const p8Module = document.getElementById("p8Module");
  if (p7Module && p8Module) {
    const p7Done = gameState.completedPuzzles.includes("p7");
    p7Module.style.display = p7Done ? "none" : "block";
    p8Module.style.display = p7Done ? "block" : "none";

    const t1 = document.getElementById("dossierToken1");
    const t2 = document.getElementById("dossierToken2");
    const t3 = document.getElementById("dossierToken3");
    if (t1) t1.textContent = gameState.earnedTokens[1] || "4";
    if (t2) t2.textContent = gameState.earnedTokens[2] || "5";
    if (t3) t3.textContent = gameState.earnedTokens[3] || "4";
  }
}

/**
 * ==========================================================================
 * 7. HARDCORE 3-ATTEMPT MODEL & LOCKDOWN
 * ==========================================================================
 */
function getActivePuzzleId() {
  switch (gameState.currentRoom) {
    case 1:
      return gameState.completedPuzzles.includes("p1") ? "p2" : "p1";
    case 2:
      return gameState.completedPuzzles.includes("p3") ? "p4" : "p3";
    case 3:
      return gameState.completedPuzzles.includes("p5") ? "p6" : "p5";
    case 4:
      return gameState.completedPuzzles.includes("p7") ? "p8" : "p7";
    default:
      return "p1";
  }
}

function updateAttemptsDisplay() {
  const puzzleId = getActivePuzzleId();
  const remaining = gameState.puzzleAttempts[puzzleId] ?? 3;

  for (let i = 1; i <= 3; i++) {
    const pip = document.getElementById(`pip${i}`);
    if (pip) {
      pip.classList.toggle("filled", i <= remaining);
    }
  }
}

function consumeAttempt(puzzleId) {
  playFx(180, 0.28, "sawtooth");

  gameState.puzzleAttempts[puzzleId] = Math.max(0, (gameState.puzzleAttempts[puzzleId] ?? 3) - 1);
  updateAttemptsDisplay();
  persistState();

  if (gameState.puzzleAttempts[puzzleId] <= 0) {
    triggerRoomLockdown(gameState.currentRoom);
  }
}

function triggerRoomLockdown(roomNum) {
  gameState.roomLockdown = roomNum;
  persistState();
  showLockdownModal(roomNum);
}

function showLockdownModal(roomNum) {
  const modal = document.getElementById("roomLockdownModal");
  const reason = document.getElementById("lockdownReason");
  if (reason) {
    reason.textContent = `All 3 attempts exhausted on Chamber 0${roomNum}. Safety bulkheads engaged.`;
  }
  if (modal) modal.style.display = "flex";
}

function restartCurrentRoom() {
  const room = gameState.currentRoom;
  gameState.roomLockdown = null;

  if (room === 1) {
    gameState.completedPuzzles = gameState.completedPuzzles.filter(p => p !== "p1" && p !== "p2");
    gameState.puzzleAttempts.p1 = 3;
    gameState.puzzleAttempts.p2 = 3;
    gameState.earnedTokens[1] = null;
    p1SelectedSymbols = [];
    updateP1SlotsUI();
  } else if (room === 2) {
    gameState.completedPuzzles = gameState.completedPuzzles.filter(p => p !== "p3" && p !== "p4");
    gameState.puzzleAttempts.p3 = 3;
    gameState.puzzleAttempts.p4 = 3;
    gameState.earnedTokens[2] = null;
    const p3Input = document.getElementById("p3Input");
    if (p3Input) p3Input.value = "";
  } else if (room === 3) {
    gameState.completedPuzzles = gameState.completedPuzzles.filter(p => p !== "p5" && p !== "p6");
    gameState.puzzleAttempts.p5 = 3;
    gameState.puzzleAttempts.p6 = 3;
    gameState.earnedTokens[3] = null;
    p5SelectedSwitches = [];
    updateP5SlotsUI();
  } else if (room === 4) {
    gameState.completedPuzzles = gameState.completedPuzzles.filter(p => p !== "p7" && p !== "p8");
    gameState.puzzleAttempts.p7 = 3;
    gameState.puzzleAttempts.p8 = 3;
    p7EnteredDigits = [];
    updateP7DisplayUI();
  }

  persistState();

  const modal = document.getElementById("roomLockdownModal");
  if (modal) modal.style.display = "none";

  renderActiveRoom();
  setFeedback(`Chamber 0${room} re-initialized. 3 attempts restored.`, "gold");
}

function setFeedback(msg, tone = "crimson") {
  const fb = document.getElementById("roomFeedbackToast");
  if (fb) {
    fb.textContent = msg;
    fb.style.color = tone === "green" ? "#52e396" : (tone === "gold" ? "#E4C27A" : "#e06b6b");
  }
}

/**
 * ==========================================================================
 * 8. HINT REQUEST HANDLING
 * ==========================================================================
 */
function handleHintRequest(puzzleId, displayElId, btnElId) {
  const display = document.getElementById(displayElId);
  const btn = document.getElementById(btnElId);
  const hints = PUZZLE_CONFIG[puzzleId]?.hints || [];

  let count = gameState.hintsRequested[puzzleId] || 0;
  if (count < hints.length) {
    count++;
    gameState.hintsRequested[puzzleId] = count;
    persistState();
  }

  if (display) {
    display.style.display = "block";
    display.textContent = hints[count - 1] || "No further records available.";
  }

  if (btn && count >= hints.length) {
    btn.textContent = "MAX NOTES DISCLOSED";
    btn.disabled = true;
  }
}

/**
 * ==========================================================================
 * 9. PUZZLE CONTROLLER LOGIC
 * ==========================================================================
 */
function initPuzzles() {
  initChamber1();
  initChamber2();
  initChamber3();
  initChamber4();
}

/* --- CHAMBER 1 --- */
function initChamber1() {
  // P1: Runes
  const runeBtns = document.querySelectorAll(".btn-rune");
  runeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (gameState.completedPuzzles.includes("p1")) return;
      const sym = btn.dataset.symbol;
      if (p1SelectedSymbols.length < 4) {
        p1SelectedSymbols.push(sym);
        playFx(480, 0.08);
        updateP1SlotsUI();
      }
    });
  });

  const btnClear = document.getElementById("btnP1Clear");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      p1SelectedSymbols = [];
      updateP1SlotsUI();
      setFeedback("Rune sequence cleared.");
    });
  }

  const btnSubmit = document.getElementById("btnP1Submit");
  if (btnSubmit) {
    btnSubmit.addEventListener("click", () => {
      if (gameState.completedPuzzles.includes("p1")) return;

      if (p1SelectedSymbols.length < 4) {
        setFeedback("Select 4 runes before engaging lock.");
        return;
      }

      const target = PUZZLE_CONFIG.p1.targetSequence;
      const isMatch = p1SelectedSymbols.every((s, i) => s === target[i]);

      if (isMatch) {
        playFx(660, 0.25);
        gameState.completedPuzzles.push("p1");
        persistState();
        setFeedback("Seal 01 Recovered. Entrance tumblers retracted.", "green");
        updateSevenSealsRibbon();
        refreshRoomSubModules();
        updateAttemptsDisplay();
      } else {
        consumeAttempt("p1");
        setFeedback("Incorrect rune sequence. The lock rejects the order.");
      }
    });
  }

  const btnP1Hint = document.getElementById("btnP1Hint");
  if (btnP1Hint) {
    btnP1Hint.addEventListener("click", () => {
      handleHintRequest("p1", "p1HintDisplay", "btnP1Hint");
    });
  }

  // P2: Inspectable Relics
  const relicBtns = document.querySelectorAll(".relic-item-btn");
  relicBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showInspectionModal(btn.dataset.obj);
    });
  });

  const btnP2Hint = document.getElementById("btnP2Hint");
  if (btnP2Hint) {
    btnP2Hint.addEventListener("click", () => {
      handleHintRequest("p2", "p2HintDisplay", "btnP2Hint");
    });
  }

  const btnAdv1 = document.getElementById("btnAdvanceToRoom2");
  if (btnAdv1) {
    btnAdv1.addEventListener("click", () => {
      gameState.currentRoom = 2;
      persistState();
      renderActiveRoom();
    });
  }
}

function updateP1SlotsUI() {
  for (let i = 0; i < 4; i++) {
    const slot = document.getElementById(`p1Slot${i}`);
    if (slot) {
      slot.textContent = p1SelectedSymbols[i] || "_";
      slot.style.borderColor = p1SelectedSymbols[i] ? "#C7A76C" : "rgba(199, 167, 108, 0.4)";
    }
  }
}

/* --- CHAMBER 2 --- */
function initChamber2() {
  // P3: Cipher
  const formP3 = document.getElementById("p3Form");
  const inputP3 = document.getElementById("p3Input");

  if (formP3) {
    formP3.addEventListener("submit", (e) => {
      e.preventDefault();
      if (gameState.completedPuzzles.includes("p3")) return;

      const raw = inputP3 ? inputP3.value.trim().toUpperCase() : "";
      if (!raw) {
        setFeedback("Enter decoded word before validating.");
        return;
      }

      if (raw === PUZZLE_CONFIG.p3.targetWord) {
        playFx(660, 0.25);
        gameState.completedPuzzles.push("p3");
        persistState();
        setFeedback("Seal 03 Recovered. Manuscript decrypted.", "green");
        updateSevenSealsRibbon();
        refreshRoomSubModules();
        updateAttemptsDisplay();
      } else {
        consumeAttempt("p3");
        setFeedback("Cipher mismatch. Letters are shifted incorrectly.");
      }
    });
  }

  const btnP3Hint = document.getElementById("btnP3Hint");
  if (btnP3Hint) {
    btnP3Hint.addEventListener("click", () => {
      handleHintRequest("p3", "p3HintDisplay", "btnP3Hint");
    });
  }

  // P4: Emblem Panel
  const panelBtns = document.querySelectorAll(".emblem-card-btn");
  panelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (gameState.completedPuzzles.includes("p4")) return;
      const key = btn.dataset.panel;

      if (key === PUZZLE_CONFIG.p4.triggerPanel) {
        playFx(720, 0.3);
        gameState.completedPuzzles.push("p4");
        gameState.completedRooms.push(2);
        gameState.earnedTokens[2] = 5;
        persistState();
        setFeedback("Seal 04 Recovered. Ruby Heart switch engaged!", "green");
        updateSevenSealsRibbon();
        refreshRoomSubModules();
        updateAttemptsDisplay();
      } else {
        consumeAttempt("p4");
        setFeedback("Emblem mechanism is inert. Not the correct symbol.");
      }
    });
  });

  const btnP4Hint = document.getElementById("btnP4Hint");
  if (btnP4Hint) {
    btnP4Hint.addEventListener("click", () => {
      handleHintRequest("p4", "p4HintDisplay", "btnP4Hint");
    });
  }

  const btnAdv2 = document.getElementById("btnAdvanceToRoom3");
  if (btnAdv2) {
    btnAdv2.addEventListener("click", () => {
      gameState.currentRoom = 3;
      persistState();
      renderActiveRoom();
    });
  }
}

/* --- CHAMBER 3 --- */
function initChamber3() {
  // P5: Switches
  const switchBtns = document.querySelectorAll(".switch-lever-btn");
  switchBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (gameState.completedPuzzles.includes("p5")) return;
      const sw = btn.dataset.switch;

      if (p5SelectedSwitches.includes(sw)) {
        setFeedback(`Lever ${sw} already positioned.`);
        return;
      }

      if (p5SelectedSwitches.length < 4) {
        p5SelectedSwitches.push(sw);
        btn.classList.add("active-sw");
        playFx(420, 0.1, "triangle");
        updateP5SlotsUI();
      }
    });
  });

  const btnResetP5 = document.getElementById("btnP5Reset");
  if (btnResetP5) {
    btnResetP5.addEventListener("click", () => {
      p5SelectedSwitches = [];
      document.querySelectorAll(".switch-lever-btn").forEach(s => s.classList.remove("active-sw"));
      updateP5SlotsUI();
      setFeedback("Levers reset to default.");
    });
  }

  const btnSubmitP5 = document.getElementById("btnP5Submit");
  if (btnSubmitP5) {
    btnSubmitP5.addEventListener("click", () => {
      if (gameState.completedPuzzles.includes("p5")) return;

      if (p5SelectedSwitches.length < 4) {
        setFeedback("Position all 4 levers before engaging grid.");
        return;
      }

      const target = PUZZLE_CONFIG.p5.targetSequence;
      const isMatch = p5SelectedSwitches.every((sw, idx) => sw === target[idx]);

      if (isMatch) {
        playFx(680, 0.3);
        gameState.completedPuzzles.push("p5");
        persistState();
        setFeedback("Main grid energized! Relay coupling ready.", "green");
        refreshRoomSubModules();
        updateAttemptsDisplay();
      } else {
        consumeAttempt("p5");
        setFeedback("Circuit tripped: Lever order violated circuit rules.");
        p5SelectedSwitches = [];
        document.querySelectorAll(".switch-lever-btn").forEach(s => s.classList.remove("active-sw"));
        updateP5SlotsUI();
      }
    });
  }

  const btnP5Hint = document.getElementById("btnP5Hint");
  if (btnP5Hint) {
    btnP5Hint.addEventListener("click", () => {
      handleHintRequest("p5", "p5HintDisplay", "btnP5Hint");
    });
  }

  // P6: Relays
  const relayBtns = document.querySelectorAll(".relay-card");
  relayBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (gameState.completedPuzzles.includes("p6")) return;
      const relay = btn.dataset.relay;

      if (relay === PUZZLE_CONFIG.p6.targetRelay) {
        playFx(760, 0.3);
        gameState.completedPuzzles.push("p6");
        gameState.completedRooms.push(3);
        gameState.earnedTokens[3] = 4;
        persistState();
        setFeedback("Seal 05 Recovered. Amber Relay connected!", "green");
        updateSevenSealsRibbon();
        refreshRoomSubModules();
        updateAttemptsDisplay();
      } else {
        consumeAttempt("p6");
        setFeedback("Relay overload: Temperature rating mismatch.");
      }
    });
  });

  const btnP6Hint = document.getElementById("btnP6Hint");
  if (btnP6Hint) {
    btnP6Hint.addEventListener("click", () => {
      handleHintRequest("p6", "p6HintDisplay", "btnP6Hint");
    });
  }

  const btnAdv3 = document.getElementById("btnAdvanceToRoom4");
  if (btnAdv3) {
    btnAdv3.addEventListener("click", () => {
      gameState.currentRoom = 4;
      persistState();
      renderActiveRoom();
    });
  }
}

function updateP5SlotsUI() {
  for (let i = 0; i < 4; i++) {
    const slot = document.getElementById(`swSlot${i}`);
    if (slot) {
      slot.textContent = p5SelectedSwitches[i] || "_";
      slot.style.borderColor = p5SelectedSwitches[i] ? "#52e396" : "rgba(199, 167, 108, 0.4)";
    }
  }
}

/* --- CHAMBER 4 --- */
function initChamber4() {
  // P7: Keypad
  const keyBtns = document.querySelectorAll(".btn-num[data-key]");
  keyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (gameState.completedPuzzles.includes("p7")) return;
      if (p7EnteredDigits.length < 4) {
        p7EnteredDigits.push(btn.dataset.key);
        playFx(520, 0.08);
        updateP7DisplayUI();
      }
    });
  });

  const btnClr = document.getElementById("btnKeypadClear");
  if (btnClr) {
    btnClr.addEventListener("click", () => {
      p7EnteredDigits = [];
      updateP7DisplayUI();
    });
  }

  const btnEnt = document.getElementById("btnKeypadEnter");
  if (btnEnt) {
    btnEnt.addEventListener("click", () => {
      if (gameState.completedPuzzles.includes("p7")) return;

      if (p7EnteredDigits.length < 4) {
        setFeedback("Keypad requires all 4 digits.");
        return;
      }

      const entered = p7EnteredDigits.join("");
      if (entered === PUZZLE_CONFIG.p7.targetCode) {
        playFx(740, 0.3);
        gameState.completedPuzzles.push("p7");
        persistState();
        setFeedback("Seal 06 Recovered. Master Ledger unlocked.", "green");
        updateSevenSealsRibbon();
        refreshRoomSubModules();
        updateAttemptsDisplay();
      } else {
        consumeAttempt("p7");
        setFeedback("CLEARANCE REJECTED: Numeric code mismatch.");
        p7EnteredDigits = [];
        updateP7DisplayUI();
      }
    });
  }

  const btnP7Hint = document.getElementById("btnP7Hint");
  if (btnP7Hint) {
    btnP7Hint.addEventListener("click", () => {
      handleHintRequest("p7", "p7HintDisplay", "btnP7Hint");
    });
  }

  // P8: Final Word Lock
  const formP8 = document.getElementById("p8Form");
  const inputP8 = document.getElementById("p8Input");
  if (formP8) {
    formP8.addEventListener("submit", (e) => {
      e.preventDefault();
      if (gameState.completedPuzzles.includes("p8")) return;

      const raw = inputP8 ? inputP8.value.trim().toUpperCase() : "";
      if (!raw) {
        setFeedback("Speak the authorization word.");
        return;
      }

      if (raw === PUZZLE_CONFIG.p8.targetWord) {
        playFx(880, 0.45);
        gameState.completedPuzzles.push("p8");
        gameState.completedRooms.push(4);
        gameState.isEscapeComplete = true;
        persistState();

        updateSevenSealsRibbon();
        triggerFinalCinematic();
      } else {
        consumeAttempt("p8");
        setFeedback("Incorrect word. Ponder the day that arrives next.");
      }
    });
  }

  const btnP8Hint = document.getElementById("btnP8Hint");
  if (btnP8Hint) {
    btnP8Hint.addEventListener("click", () => {
      handleHintRequest("p8", "p8HintDisplay", "btnP8Hint");
    });
  }
}

function updateP7DisplayUI() {
  for (let i = 0; i < 4; i++) {
    const win = document.getElementById(`vDigit${i}`);
    if (win) {
      win.textContent = p7EnteredDigits[i] || "_";
      win.style.borderColor = p7EnteredDigits[i] ? "#C7A76C" : "rgba(199, 167, 108, 0.45)";
    }
  }
}

/**
 * ==========================================================================
 * 10. INSPECTION MODAL INTERACTIONS
 * ==========================================================================
 */
let currentInspectedKey = null;

function showInspectionModal(key) {
  currentInspectedKey = key;
  const modal = document.getElementById("clueInspectionModal");
  const icon = document.getElementById("modalObjIcon");
  const title = document.getElementById("modalObjTitle");
  const desc = document.getElementById("modalObjDesc");
  const btnActivate = document.getElementById("btnModalActivate");

  const icons = { photo: "🖼️", note: "📜", clock: "🕰️" };
  const titles = { photo: "Framed Polaroid", note: "Folded Scrap", clock: "Antique Clock" };

  if (icon) icon.textContent = icons[key] || "🔍";
  if (title) title.textContent = titles[key] || "Inspecting Relic";
  if (desc) desc.textContent = PUZZLE_CONFIG.p2.descriptions[key] || "";

  if (btnActivate) {
    const isClock = key === "clock";
    const p2Done = gameState.completedPuzzles.includes("p2");
    btnActivate.style.display = (isClock && !p2Done) ? "inline-block" : "none";
  }

  if (modal) modal.style.display = "flex";
}

function initModalInteractions() {
  const btnClose = document.getElementById("btnModalClose");
  const btnActivate = document.getElementById("btnModalActivate");
  const modal = document.getElementById("clueInspectionModal");

  if (btnClose && modal) {
    btnClose.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (btnActivate && modal) {
    btnActivate.addEventListener("click", () => {
      if (currentInspectedKey === PUZZLE_CONFIG.p2.triggerObj) {
        playFx(640, 0.25);
        gameState.completedPuzzles.push("p2");
        gameState.completedRooms.push(1);
        gameState.earnedTokens[1] = 4;
        persistState();
        modal.style.display = "none";
        setFeedback("Seal 02 Recovered. Antique clock latch released!", "green");
        updateSevenSealsRibbon();
        refreshRoomSubModules();
        updateAttemptsDisplay();
      }
    });
  }

  const btnRestart = document.getElementById("btnRestartRoom");
  if (btnRestart) {
    btnRestart.addEventListener("click", () => {
      restartCurrentRoom();
    });
  }
}

function initHudInteractions() {
  const btnReview = document.getElementById("btnReviewRooms");
  if (btnReview) {
    btnReview.addEventListener("click", () => {
      const compView = document.getElementById("day9CompletionScreen");
      const gameView = document.getElementById("day9GameView");
      if (compView) compView.style.display = "none";
      if (gameView) {
        gameView.style.display = "block";
        gameState.currentRoom = 1;
        renderActiveRoom();
      }
    });
  }
}

/**
 * ==========================================================================
 * 11. EXPERIENCE 07 CINEMATIC & GATE REVEAL
 * ==========================================================================
 */
function triggerFinalCinematic() {
  const gameView = document.getElementById("day9GameView");
  const stage = document.getElementById("escapeSequenceStage");
  const btnProceed = document.getElementById("btnProceedCompletion");
  const compScreen = document.getElementById("day9CompletionScreen");

  if (gameView) gameView.style.display = "none";
  if (stage) stage.style.display = "flex";

  const lines = [
    document.getElementById("escLine0"),
    document.getElementById("escLine1"),
    document.getElementById("escLine2"),
    document.getElementById("escLine3"),
    document.getElementById("escLine4"),
    document.getElementById("escLine5"),
    document.getElementById("escLine6"),
    document.getElementById("escLine7")
  ];

  let currentLine = 0;

  function showNextLine() {
    if (currentLine < lines.length) {
      lines.forEach((l, idx) => {
        if (l) l.classList.toggle("active-reveal", idx === currentLine);
      });

      playFx(480 + currentLine * 40, 0.14);
      currentLine++;
      setTimeout(showNextLine, 1800);
    } else {
      if (btnProceed) btnProceed.style.display = "block";
    }
  }

  setTimeout(showNextLine, 600);

  if (btnProceed) {
    btnProceed.addEventListener("click", () => {
      if (stage) stage.style.display = "none";
      if (compScreen) compScreen.style.display = "block";
      startFinalCountdownTimer();
    });
  }
}

/**
 * ==========================================================================
 * 12. EXPERIENCE 08: LIVE IST COUNTDOWN ENGINE
 * Target: 29 October 2026, 12:00 AM India Standard Time (UTC+05:30)
 * ==========================================================================
 */
let countdownInterval = null;

function startFinalCountdownTimer() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  // Exact target timestamp in IST (Asia/Kolkata = UTC+05:30)
  const targetDateMs = new Date("2026-10-29T00:00:00+05:30").getTime();

  const elDays = document.getElementById("cdDays");
  const elHours = document.getElementById("cdHours");
  const elMinutes = document.getElementById("cdMinutes");
  const elSeconds = document.getElementById("cdSeconds");
  const banner = document.getElementById("authStatusBanner");
  const bannerIcon = document.getElementById("authStatusIcon");
  const bannerTitle = document.getElementById("authDateTitle");
  const bannerSubtext = document.getElementById("authSubtext");
  const pendingNote = document.getElementById("countdownPendingNote");

  function tick() {
    const now = Date.now();
    const diff = targetDateMs - now;

    if (diff <= 0) {
      // Midnight IST reached
      if (elDays) elDays.textContent = "00";
      if (elHours) elHours.textContent = "00";
      if (elMinutes) elMinutes.textContent = "00";
      if (elSeconds) elSeconds.textContent = "00";

      if (pendingNote) pendingNote.textContent = "All locks deactivated. Access granted.";
      if (bannerIcon) bannerIcon.textContent = "🔓";
      if (bannerTitle) bannerTitle.textContent = "AUTHORIZATION GRANTED";
      if (bannerSubtext) bannerSubtext.textContent = "DAY 10 — ACCESS AVAILABLE NOW";
      if (banner) {
        banner.style.borderColor = "#52e396";
        banner.style.background = "rgba(82, 227, 150, 0.15)";
      }

      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (elDays) elDays.textContent = String(days).padStart(2, "0");
    if (elHours) elHours.textContent = String(hours).padStart(2, "0");
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, "0");
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, "0");
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

/**
 * ==========================================================================
 * 13. NEXT DAY DATE-GUARD (Day 10 Protection)
 * ==========================================================================
 */
function initNextDayGuard() {
  const navNextBtn = document.getElementById("navNextDayBtn");
  const compDay10Btn = document.getElementById("completionDay10Btn");

  const handleNextClick = (e) => {
    const day10Data = (typeof JOURNEY_DAYS !== "undefined")
      ? JOURNEY_DAYS.find((d) => d.day === 10)
      : { day: 10, dateStr: "2026-10-29" };

    if (day10Data && typeof isDateUnlocked === "function" && !isDateUnlocked(day10Data.dateStr)) {
      e.preventDefault();
      if (typeof showLockModal === "function") {
        showLockModal(day10Data);
      }
    }
  };

  if (navNextBtn) navNextBtn.addEventListener("click", handleNextClick);
  if (compDay10Btn) compDay10Btn.addEventListener("click", handleNextClick);
}