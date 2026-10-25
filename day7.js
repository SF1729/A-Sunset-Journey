/* ==========================================================================
   BUDDUU — DAY 7: “ZERO HOUR: THE LAST TIMELINE”
   Master Engine with Thriller Sensory & Mystical Loops
   ========================================================================== */

const DAY7_CONFIG = {
  day: 7,
  dateStr: "2026-10-26",
  storageKeys: {
    lockSolved: "budduu_day7_lock_solved",
    ruleLockStage: "budduu_day7_rule_stage",
    completed: "budduu_day7_completed",
    doorsFragments: "budduu_day7_doors_fragments",
    letterIndex: "budduu_day7_letter_idx",
    audioMuted: "budduu_day7_audio_muted",
    singularityResonance: "budduu_day7_singularity_res"
  },
  colors: ["RED", "BLUE", "GREEN", "YELLOW"],
  cipherKey: {
    "1": "RED",
    "2": "BLUE",
    "3": "GREEN",
    "4": "YELLOW"
  }
};

// --------------------------------------------------------------------------
// STATE VARIABLES
// --------------------------------------------------------------------------
let isMysterySolved = false;
let isDay7Completed = false;
let isAudioMuted = false;

// 1. Paradox Protocol Lock State
const TOTAL_LOCK_STAGES = 5;
const MAX_ATTEMPTS_PER_STAGE = 3;
let currentLockStage = 1;
let currentStageAttemptsLeft = MAX_ATTEMPTS_PER_STAGE;
let hintsRemaining = 2;

let currentPuzzleData = {
  rawSequence: [],
  targetAnswer: [],
  instruction: "",
  hint: "",
  displayType: "COLOR_FLASH"
};

let playerInputSequence = [];
let isPuzzleAnimationBusy = false;

// 2. Experience 01: Biometrics & Fragments
let biometricHoldProgress = 0;
let biometricHoldTimer = null;
let isBiometricVerified = false;

const collectedFragments = new Set();
const doorPastRelicsAligned = new Set();
let doorImaginationInput = [];
const imaginationTarget = ["CLOCK", "STAR", "STAIR", "EYE"];
let isImaginationResetting = false;

// 3. Experience 03: Singularity & Climax
let selectedTimelinePath = "SINGULARITY"; // Default balanced resonance
let currentLetterParagraph = 1;
const totalLetterParagraphs = 5;

// Web Audio Synthesizer Context
let day7AudioCtx = null;
let morseIntervalId = null;

function ensureAudioCtx() {
  if (!day7AudioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (AudioCtxClass) day7AudioCtx = new AudioCtxClass();
  }
  if (day7AudioCtx && day7AudioCtx.state === "suspended") {
    day7AudioCtx.resume().catch(() => {});
  }
}

// ==========================================================================
// ADVANCED WEB AUDIO SYNTHESIZER ENGINE (BASS, STATIC & CHORDS)
// ==========================================================================
function playCyberSfx(type = "beep", freq = 520, duration = 0.22) {
  if (isAudioMuted) return;
  try {
    ensureAudioCtx();
    if (!day7AudioCtx) return;
    const now = day7AudioCtx.currentTime;

    if (type === "beep") {
      const osc = day7AudioCtx.createOscillator();
      const gain = day7AudioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(day7AudioCtx.destination);
      osc.start(now);
      osc.stop(now + duration);

    } else if (type === "scan") {
      const osc = day7AudioCtx.createOscillator();
      const gain = day7AudioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.5);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      osc.connect(gain);
      gain.connect(day7AudioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.55);

    } else if (type === "static") {
      // Procedural White-Noise Static Burst
      const bufferSize = Math.floor(day7AudioCtx.sampleRate * 0.28);
      const buffer = day7AudioCtx.createBuffer(1, bufferSize, day7AudioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = day7AudioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = day7AudioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1400;

      const gain = day7AudioCtx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(day7AudioCtx.destination);
      noise.start(now);

    } else if (type === "error") {
      const osc = day7AudioCtx.createOscillator();
      const gain = day7AudioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(110, now + 0.14);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      osc.connect(gain);
      gain.connect(day7AudioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.38);

    } else if (type === "success") {
      [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
        const osc = day7AudioCtx.createOscillator();
        const gain = day7AudioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(day7AudioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });

    } else if (type === "core") {
      // 45Hz Deep Sub-Bass Conduit Hum
      const osc = day7AudioCtx.createOscillator();
      const gain = day7AudioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 1.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);
      osc.connect(gain);
      gain.connect(day7AudioCtx.destination);
      osc.start(now);
      osc.stop(now + 1.35);
    }
  } catch (err) {}
}

// Background Ghost Morse Code spelling: "B - U - D - D - U - U"
function startGhostMorseSignal() {
  if (morseIntervalId) return;
  const morsePattern = [
    // B (- . . .)
    3, 1, 1, 1, 1, 1, 1, 3,
    // U (. . -)
    1, 1, 1, 1, 3, 3,
    // D (- . .)
    3, 1, 1, 1, 1, 3,
    // D (- . .)
    3, 1, 1, 1, 1, 3,
    // U (. . -)
    1, 1, 1, 1, 3, 3,
    // U (. . -)
    1, 1, 1, 1, 3, 7
  ];

  const transmitSequence = () => {
    if (isAudioMuted || !day7AudioCtx) return;
    try {
      const now = day7AudioCtx.currentTime;
      let t = now + 0.2;
      const unit = 0.07;

      morsePattern.forEach((duration, idx) => {
        if (idx % 2 === 0) {
          const osc = day7AudioCtx.createOscillator();
          const gain = day7AudioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, t);
          gain.gain.setValueAtTime(0.012, t); // Subtle eerie ambient volume
          gain.gain.exponentialRampToValueAtTime(0.00001, t + duration * unit);
          osc.connect(gain);
          gain.connect(day7AudioCtx.destination);
          osc.start(t);
          osc.stop(t + duration * unit);
        }
        t += duration * unit;
      });
    } catch (e) {}
  };

  transmitSequence();
  morseIntervalId = setInterval(transmitSequence, 14000);
}

// --------------------------------------------------------------------------
// INITIALIZATION
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initDay7Flow();
});

function initDay7Flow() {
  const day7Data = (typeof JOURNEY_DAYS !== "undefined")
    ? JOURNEY_DAYS.find((d) => d.day === DAY7_CONFIG.day)
    : { day: 7, dateStr: DAY7_CONFIG.dateStr };

  const dateLockedView = document.getElementById("day7DateLockedView");
  const unlockedView = document.getElementById("day7UnlockedView");

  // GATE 1: Date Lock Verification
  let isDateReady = true;
  if (typeof isDateUnlocked === "function") {
    isDateReady = isDateUnlocked(day7Data.dateStr);
  } else {
    const target = new Date(`${DAY7_CONFIG.dateStr}T00:00:00`);
    const now = new Date();
    isDateReady = now >= target;
  }

  if (!isDateReady) {
    if (dateLockedView) dateLockedView.style.display = "flex";
    if (unlockedView) unlockedView.style.display = "none";

    let daysRemaining = 0;
    if (typeof getDaysUntil === "function") {
      daysRemaining = getDaysUntil(day7Data.dateStr);
    } else {
      const diff = new Date(`${DAY7_CONFIG.dateStr}T00:00:00`) - new Date();
      daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    const countdownEl = document.getElementById("dateLockCountdown");
    if (countdownEl) {
      countdownEl.textContent = daysRemaining > 0 
        ? `TEMPORAL COORDINATES LOCKED: ${daysRemaining} ${daysRemaining === 1 ? 'DAY' : 'DAYS'} (26 OCT 2026)`
        : "SYNCHRONIZING ON 26 OCTOBER 2026";
    }
    return;
  }

  if (dateLockedView) dateLockedView.style.display = "none";

  loadStoredProgress();
  initGhostCursor();
  initReverseChronoClock();
  initTextWhispers();
  initSecretTerminalBackdoor();
  initDay7Particles();
  initNextDayNavigation();
  initGlobalBackdrop();
  initAudioHUD();

  launchActualDay7Content();
}

function loadStoredProgress() {
  try {
    if (localStorage.getItem(DAY7_CONFIG.storageKeys.lockSolved) === "true") {
      isMysterySolved = true;
    }

    const savedStage = parseInt(localStorage.getItem(DAY7_CONFIG.storageKeys.ruleLockStage), 10);
    if (!isNaN(savedStage) && savedStage >= 1 && savedStage <= TOTAL_LOCK_STAGES) {
      currentLockStage = savedStage;
    }

    if (localStorage.getItem(DAY7_CONFIG.storageKeys.completed) === "true") {
      isMysterySolved = true;
      isDay7Completed = true;
      ["PAST", "IMAGINATION", "FUTURE"].forEach((f) => collectedFragments.add(f));
      currentLetterParagraph = totalLetterParagraphs;
      return;
    }

    const savedFrags = JSON.parse(localStorage.getItem(DAY7_CONFIG.storageKeys.doorsFragments) || "[]");
    savedFrags.forEach((f) => collectedFragments.add(f));

    const savedLetterIdx = parseInt(localStorage.getItem(DAY7_CONFIG.storageKeys.letterIndex), 10);
    if (!isNaN(savedLetterIdx) && savedLetterIdx >= 1) {
      currentLetterParagraph = Math.min(savedLetterIdx, totalLetterParagraphs);
    }

    if (localStorage.getItem(DAY7_CONFIG.storageKeys.audioMuted) === "true") {
      isAudioMuted = true;
    }
  } catch (err) {}
}

// --------------------------------------------------------------------------
// MYSTICAL HUD: REVERSE CHRONO CLOCK & GHOST CURSOR
// --------------------------------------------------------------------------
function initReverseChronoClock() {
  const chronoEl = document.getElementById("hudChronoResidue");
  if (!chronoEl) return;
  let ms = 392;
  let sec = 14;

  setInterval(() => {
    ms -= 37;
    if (ms <= 0) {
      ms = 999;
      sec++;
    }
    const secStr = sec.toString().padStart(2, "0");
    const msStr = ms.toString().padStart(3, "0");
    chronoEl.textContent = `CHRONO RESIDUE: -00:00:${secStr}.${msStr}`;
  }, 45);
}

function initGhostCursor() {
  const ghost = document.getElementById("ghostCursor");
  if (!ghost || window.innerWidth <= 600) return;

  window.addEventListener("mousemove", (e) => {
    // 380ms Temporal Lag behind actual cursor
    setTimeout(() => {
      ghost.style.transform = `translate3d(${e.clientX - 8}px, ${e.clientY - 8}px, 0)`;
    }, 180);
  }, { passive: true });
}

// --------------------------------------------------------------------------
// SUBLIMINAL TEXT MUTATION (PARANOID GLITCH SCRAMBLER)
// --------------------------------------------------------------------------
function initTextWhispers() {
  const elements = [
    document.getElementById("openingDreamTitle"),
    document.getElementById("cueTitleExp1"),
    document.getElementById("cueTitleExp2"),
    document.getElementById("lockTitle"),
    document.getElementById("coreChamberTitle")
  ];

  const runes = "010101_∆§#%0x7F";

  elements.forEach((el) => {
    if (!el) return;
    const original = el.innerText;
    const whisper = el.getAttribute("data-whisper");
    if (!whisper) return;

    let scrambleInterval = null;

    el.addEventListener("mouseenter", () => {
      let iteration = 0;
      clearInterval(scrambleInterval);

      scrambleInterval = setInterval(() => {
        el.innerText = whisper.split("").map((letter, idx) => {
          if (idx < iteration) return letter;
          return runes[Math.floor(Math.random() * runes.length)];
        }).join("");

        if (iteration >= whisper.length) {
          clearInterval(scrambleInterval);
          setTimeout(() => { el.innerText = original; }, 850);
        }
        iteration += 2;
      }, 30);
    });
  });
}

// --------------------------------------------------------------------------
// SECRET ROOT SHELL BACKDOOR (TRIPLE-CLICK BRAND DOT)
// --------------------------------------------------------------------------
function initSecretTerminalBackdoor() {
  const brandDot = document.getElementById("brandHoloDot");
  const termModal = document.getElementById("secretTerminalModal");
  const closeBtn = document.getElementById("closeSecretTermBtn");
  const backdrop = document.getElementById("modalDimBackdrop");
  const form = document.getElementById("secretTermForm");
  const input = document.getElementById("secretTermInput");
  const output = document.getElementById("secretTermOutput");

  let clickCount = 0;
  let clickTimer = null;

  if (brandDot) {
    brandDot.onclick = () => {
      clickCount++;
      clearTimeout(clickTimer);
      playCyberSfx("beep", 400 + clickCount * 120, 0.1);

      if (clickCount >= 3) {
        clickCount = 0;
        playCyberSfx("scan");
        if (termModal) termModal.style.display = "flex";
        if (backdrop) backdrop.style.display = "block";
        if (input) input.focus();
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 700);
      }
    };
  }

  const closeTerm = () => {
    if (termModal) termModal.style.display = "none";
    if (backdrop) backdrop.style.display = "none";
  };

  if (closeBtn) closeBtn.onclick = closeTerm;

  if (form && input && output) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const val = input.value.trim().toUpperCase();
      input.value = "";
      if (!val) return;

      const appendLine = (msg, cl = "text-dim") => {
        const div = document.createElement("div");
        div.className = `term-log-entry ${cl}`;
        div.innerHTML = msg;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
      };

      appendLine(`ARCHITECT@OMEGA:~$ ${val}`, "text-cyan");

      if (val === "HELP") {
        appendLine("&gt; AVAILABLE COMMANDS: BUDDUU, ARCHITECT, TIMELINE, DAY8, CLEAR, EXIT", "text-warm-white");
      } else if (val === "BUDDUU") {
        appendLine("&gt; [UNREDACTED LOG #000]: The whole facility was built for you. Even through 7 cycles of memory wipes, my hands rebuild what my mind was forced to forget. ❤️", "text-crimson");
        playCyberSfx("success");
      } else if (val === "ARCHITECT") {
        appendLine("&gt; ARCHITECT STATUS: Biometrics match user sitting at screen. Cycle 002 termination pending.", "text-cyan");
      } else if (val === "TIMELINE") {
        appendLine("&gt; PRIME (Success without closure) vs NULL (Catastrophe with closure). Singularity: 50%.", "text-warm-white");
      } else if (val === "DAY8") {
        appendLine("&gt; CO-ORDINATES: SECTOR 08 &bull; NEURAL ECHOES MATERIALIZING...", "text-emerald");
      } else if (val === "CLEAR") {
        output.innerHTML = "";
      } else if (val === "EXIT") {
        closeTerm();
      } else {
        appendLine(`&gt; ERROR: UNRECOGNIZED COMMAND &quot;${val}&quot;. TYPE &quot;HELP&quot;.`, "text-alert");
        playCyberSfx("static");
      }
    };
  }
}

// --------------------------------------------------------------------------
// AUDIO TOGGLE HUD & GLOBAL MODALS
// --------------------------------------------------------------------------
function initAudioHUD() {
  const toggleBtn = document.getElementById("hudAudioToggleBtn");
  const label = document.getElementById("hudAudioLabel");

  const updateHUD = () => {
    if (label) label.textContent = isAudioMuted ? "AUDIO: OFF" : "AUDIO: ON";
    if (toggleBtn) toggleBtn.style.opacity = isAudioMuted ? "0.6" : "1";
  };

  if (toggleBtn) {
    toggleBtn.onclick = () => {
      isAudioMuted = !isAudioMuted;
      try {
        localStorage.setItem(DAY7_CONFIG.storageKeys.audioMuted, isAudioMuted.toString());
      } catch (err) {}
      updateHUD();
      if (!isAudioMuted) {
        ensureAudioCtx();
        playCyberSfx("beep", 660, 0.15);
        startGhostMorseSignal();
      }
    };
  }
  updateHUD();
}

function initGlobalBackdrop() {
  const backdrop = document.getElementById("modalDimBackdrop");
  if (!backdrop) return;

  const closeModals = () => {
    const doorModal = document.getElementById("doorChamberModal");
    const termModal = document.getElementById("secretTerminalModal");
    if (doorModal) doorModal.style.display = "none";
    if (termModal) termModal.style.display = "none";
    backdrop.style.display = "none";
  };

  backdrop.onclick = closeModals;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModals();
  });
}

// --------------------------------------------------------------------------
// PARTICLES CANVAS: HIGH GRAPHICS CONNECTING CYBER MESH
// --------------------------------------------------------------------------
function initDay7Particles() {
  const canvas = document.getElementById("day7ParticlesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const particleCount = window.innerWidth <= 768 ? 22 : 45;
  const particles = [];
  const telemetryWords = ["CYCLE_02", "NULL", "PRIME", "ARCHITECT", "0x07", "BUDDUU", "OVERRIDE"];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      isWord: Math.random() > 0.8,
      word: telemetryWords[Math.floor(Math.random() * telemetryWords.length)],
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(67, 189, 245, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.fillStyle = `rgba(67, 189, 245, ${p.alpha})`;

      if (p.isWord) {
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillText(p.word, p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestAnimationFrame(render);
  }
  render();
}

// --------------------------------------------------------------------------
// MAIN DAY 7 FLOW LAUNCHER
// --------------------------------------------------------------------------
function launchActualDay7Content() {
  const unlockedView = document.getElementById("day7UnlockedView");
  if (unlockedView) unlockedView.style.display = "block";

  initOpeningScene(isDay7Completed);
  initExperience1Breach(isDay7Completed);
  initExperience2ParadoxLock(isDay7Completed);
  initExperience3LastTimeline(isDay7Completed);

  if (collectedFragments.size >= 3) {
    const lockSec = document.getElementById("museumExperienceSection");
    if (lockSec) lockSec.style.display = "block";
    updateJourneyProgress(50, "EXPERIENCE 02: THE PARADOX PROTOCOL");
  }

  if (isMysterySolved) {
    const coreSec = document.getElementById("finalDreamSection");
    if (coreSec) coreSec.style.display = "block";
    updateJourneyProgress(75, "EXPERIENCE 03: THE LAST TIMELINE");
  }

  if (isDay7Completed) {
    updateJourneyProgress(100, "DAY 07 COMPLETED // CYCLE 003 PENDING");
    renderCompletionView();
  }
}

// --------------------------------------------------------------------------
// SCENE 0: OPENING SCENE
// --------------------------------------------------------------------------
function initOpeningScene(skipIntro) {
  const openingStage = document.getElementById("dreamOpeningScene");
  const mainStage = document.getElementById("mainDreamStage");
  const enterBtn = document.getElementById("enterDreamworldBtn");

  if (skipIntro) {
    if (openingStage) openingStage.style.display = "none";
    if (mainStage) {
      mainStage.style.display = "block";
      mainStage.classList.add("visible");
    }
    return;
  }

  if (enterBtn) {
    let transitioning = false;
    enterBtn.onclick = () => {
      if (transitioning) return;
      transitioning = true;
      ensureAudioCtx();
      playCyberSfx("scan");
      startGhostMorseSignal();

      if (openingStage) {
        openingStage.classList.add("fade-out");
        setTimeout(() => {
          openingStage.style.display = "none";
          if (mainStage) {
            mainStage.style.display = "block";
            setTimeout(() => {
              mainStage.classList.add("visible");
              const firstSec = document.getElementById("doorsExperienceSection");
              if (firstSec) firstSec.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
          }
        }, 750);
      }
    };
  }
}

// ==========================================================================
// EXPERIENCE 01: HOLD-TO-SYNC BIOMETRIC SCANNER & PROTOCOL TERMINALS
// ==========================================================================
function initExperience1Breach(alreadyCompleted) {
  const touchBtn = document.getElementById("biometricTouchBtn");
  const touchCaption = document.getElementById("touchpadCaption");
  const holdFill = document.getElementById("scannerHoldFill");
  const logFeed = document.getElementById("terminalLogFeed");
  const architectBadge = document.getElementById("architectIdentityBadge");
  const indicatorDot = document.getElementById("terminalIndicatorDot");
  const statusTag = document.getElementById("terminalStatusTag");

  const slotPast = document.getElementById("fragSlotPast");
  const slotIm = document.getElementById("fragSlotImagination");
  const slotFut = document.getElementById("fragSlotFuture");

  const doorPast = document.getElementById("doorCardPast");
  const doorIm = document.getElementById("doorCardImagination");
  const doorFut = document.getElementById("doorCardFuture");

  const openPastBtn = document.getElementById("openDoorPastBtn");
  const openImBtn = document.getElementById("openDoorImaginationBtn");
  const openFutBtn = document.getElementById("openDoorFutureBtn");

  const chamberModal = document.getElementById("doorChamberModal");
  const closeModalBtn = document.getElementById("closeDoorModalBtn");
  const backdrop = document.getElementById("modalDimBackdrop");

  const panelPast = document.getElementById("panelDoorPast");
  const panelIm = document.getElementById("panelDoorImagination");
  const panelFut = document.getElementById("panelDoorFuture");

  const completedPath = document.getElementById("doorsCompletedPath");
  const enterMuseumBtn = document.getElementById("enterMuseumBtn");
  const lockSection = document.getElementById("museumExperienceSection");

  // Press & Hold Scanner Mechanics
  function startBiometricHold() {
    if (isBiometricVerified) return;
    ensureAudioCtx();
    biometricHoldProgress = 0;
    touchBtn.classList.add("is-scanning");
    playCyberSfx("scan");

    if (navigator.vibrate) navigator.vibrate([40, 80, 40]);

    if (logFeed) {
      logFeed.innerHTML = `
        <div class="console-line text-dim">&gt; SENSING RETINAL PULSE... KEEP CONTACT FIRM.</div>
        <div class="console-line text-alert">&gt; WARNING: CIVILIAN BYPASS REJECTED.</div>
      `;
    }

    clearInterval(biometricHoldTimer);
    biometricHoldTimer = setInterval(() => {
      biometricHoldProgress += 20;
      const pct = Math.min(100, Math.round((biometricHoldProgress / 1000) * 100));

      if (holdFill) holdFill.style.width = `${pct}%`;
      if (touchCaption) touchCaption.textContent = `SYNCHRONIZING DNA... ${pct}%`;

      // Pitch increases as you reach 100%
      if (biometricHoldProgress % 100 === 0) {
        playCyberSfx("beep", 260 + biometricHoldProgress * 0.7, 0.08);
      }

      if (biometricHoldProgress >= 1000) {
        clearInterval(biometricHoldTimer);
        verifyBiometricRoot();
      }
    }, 20);
  }

  function cancelBiometricHold() {
    if (isBiometricVerified || biometricHoldProgress >= 1000) return;
    clearInterval(biometricHoldTimer);
    touchBtn.classList.remove("is-scanning");
    if (holdFill) holdFill.style.width = "0%";
    if (touchCaption) touchCaption.textContent = "CONTACT LOST. HOLD FIRM FOR 3s";
    playCyberSfx("error");
    document.body.classList.add("glitch-flash");
    setTimeout(() => document.body.classList.remove("glitch-flash"), 350);
  }

  function verifyBiometricRoot() {
    isBiometricVerified = true;
    touchBtn.classList.remove("is-scanning");
    touchBtn.style.borderColor = "var(--d7-emerald)";
    touchBtn.style.background = "rgba(16, 185, 129, 0.15)";
    touchBtn.style.color = "var(--d7-emerald)";

    if (touchCaption) touchCaption.textContent = "BIOMETRIC MATCH // ROOT ELEVATED";
    if (indicatorDot) { indicatorDot.className = "terminal-indicator green-blink"; }
    if (statusTag) { statusTag.textContent = "ACCESS GRANTED"; statusTag.style.color = "var(--d7-emerald)"; }

    playCyberSfx("success");
    if (navigator.vibrate) navigator.vibrate([100, 50, 200]);

    if (logFeed) {
      logFeed.innerHTML += `
        <div class="console-line text-cyan">&gt; BIOMETRIC CADENCE VERIFIED: WELCOME BACK, ARCHITECT.</div>
        <div class="console-line text-cyan">&gt; SECURITY RECOGNITION CONFIRMED: FACILITY UNSEALING.</div>
      `;
    }

    if (architectBadge) architectBadge.style.display = "block";
  }

  if (touchBtn) {
    touchBtn.addEventListener("mousedown", startBiometricHold);
    touchBtn.addEventListener("mouseup", cancelBiometricHold);
    touchBtn.addEventListener("mouseleave", cancelBiometricHold);
    touchBtn.addEventListener("touchstart", (e) => { e.preventDefault(); startBiometricHold(); });
    touchBtn.addEventListener("touchend", cancelBiometricHold);
  }

  function updateFragmentUI() {
    if (collectedFragments.has("PAST")) {
      if (slotPast) slotPast.classList.add("is-collected");
      if (doorPast) {
        doorPast.classList.add("door-unlocked");
        const b = document.getElementById("doorBadgePast");
        if (b) b.textContent = "DECRYPTED ✓";
      }
    }
    if (collectedFragments.has("IMAGINATION")) {
      if (slotIm) slotIm.classList.add("is-collected");
      if (doorIm) {
        doorIm.classList.add("door-unlocked");
        const b = document.getElementById("doorBadgeImagination");
        if (b) b.textContent = "DECRYPTED ✓";
      }
    }
    if (collectedFragments.has("FUTURE")) {
      if (slotFut) slotFut.classList.add("is-collected");
      if (doorFut) {
        doorFut.classList.add("door-unlocked");
        const b = document.getElementById("doorBadgeFuture");
        if (b) b.textContent = "DECRYPTED ✓";
      }
    }

    if (collectedFragments.size >= 3) {
      if (completedPath) completedPath.style.display = "block";
      updateJourneyProgress(50, "EXPERIENCE 02: THE PARADOX PROTOCOL");
    }
  }

  function openChamber(panelType) {
    if (!chamberModal) return;
    chamberModal.style.display = "block";
    if (backdrop) backdrop.style.display = "block";

    if (panelPast) panelPast.style.display = (panelType === "PAST") ? "block" : "none";
    if (panelIm) panelIm.style.display = (panelType === "IMAGINATION") ? "block" : "none";
    if (panelFut) panelFut.style.display = (panelType === "FUTURE") ? "block" : "none";

    if (panelType === "PAST" && collectedFragments.has("PAST")) {
      [1, 2, 3].forEach((n) => {
        const item = document.getElementById(`pastRelic${n}`);
        const st = document.getElementById(`relicState${n}`);
        if (item) item.classList.add("is-aligned");
        if (st) st.textContent = "VERIFIED ✓";
      });
      const box = document.getElementById("pastDoorCompletedBox");
      const msg = document.getElementById("pastSuccessMsg");
      const btn = document.getElementById("claimPastFragBtn");
      if (box) box.style.display = "block";
      if (msg) msg.textContent = "📁 Archive 04-A (Timeline Prime) Decrypted!";
      if (btn) btn.style.display = "none";
    }

    if (panelType === "IMAGINATION" && collectedFragments.has("IMAGINATION")) {
      const box = document.getElementById("imDoorCompletedBox");
      const msg = document.getElementById("imSuccessMsg");
      const btn = document.getElementById("claimImaginationFragBtn");
      if (box) box.style.display = "block";
      if (msg) msg.textContent = "💥 Archive 04-B (Timeline Null) Decrypted!";
      if (btn) btn.style.display = "none";
    }

    if (panelType === "FUTURE" && collectedFragments.has("FUTURE")) {
      const box = document.getElementById("futureDoorCompletedBox");
      const msg = document.getElementById("futureSuccessMsg");
      const btn = document.getElementById("claimFutureFragBtn");
      if (box) box.style.display = "block";
      if (msg) msg.textContent = "🧠 Directive 00-Zero (Memory Purge) Decrypted!";
      if (btn) btn.style.display = "none";
    }

    playCyberSfx("beep", 520, 0.18);
  }

  function closeChamber() {
    if (chamberModal) chamberModal.style.display = "none";
    if (backdrop) backdrop.style.display = "none";
  }

  if (closeModalBtn) closeModalBtn.onclick = closeChamber;
  if (openPastBtn) openPastBtn.onclick = () => openChamber("PAST");
  if (openImBtn) openImBtn.onclick = () => openChamber("IMAGINATION");
  if (openFutBtn) openFutBtn.onclick = () => openChamber("FUTURE");

  // Terminal 01: Relics
  const relicLores = {
    "1": "“CORE STATUS: 100%. Synchronization stable across all dimensional nodes. Zero casualties logged.”",
    "2": "“ARCHITECT RECORDING: The merger held. History bent to our design. Budduu is safe in this timeline.”",
    "3": "“VERIFICATION HASH: Validated under root signature key of The Architect.”"
  };

  [1, 2, 3].forEach((num) => {
    const rBtn = document.getElementById(`pastRelic${num}`);
    if (rBtn) {
      rBtn.onclick = () => {
        playCyberSfx("beep", 440 + num * 70, 0.15);
        rBtn.classList.add("is-aligned");
        const st = document.getElementById(`relicState${num}`);
        if (st) st.textContent = "VERIFIED ✓";

        doorPastRelicsAligned.add(num.toString());

        const loreBox = document.getElementById("relicLoreDisplay");
        const loreTxt = document.getElementById("relicLoreText");
        if (loreBox && loreTxt) {
          loreBox.style.display = "block";
          loreTxt.textContent = relicLores[num.toString()];
        }

        if (doorPastRelicsAligned.size >= 3 || collectedFragments.has("PAST")) {
          const compBox = document.getElementById("pastDoorCompletedBox");
          if (compBox) compBox.style.display = "block";
        }
      };
    }
  });

  const claimPastFragBtn = document.getElementById("claimPastFragBtn");
  if (claimPastFragBtn) {
    claimPastFragBtn.onclick = () => {
      collectedFragments.add("PAST");
      saveFragments();
      updateFragmentUI();
      closeChamber();
      playCyberSfx("success");
    };
  }

  // Terminal 02: Glyphs
  const imTrackValue = document.getElementById("imTrackValue");
  const imFeedback = document.getElementById("imFeedbackText");
  const imCompBox = document.getElementById("imDoorCompletedBox");

  document.querySelectorAll(".btn-imagination-rune").forEach((btn) => {
    btn.onclick = () => {
      if (isImaginationResetting || collectedFragments.has("IMAGINATION")) return;
      const glyph = btn.getAttribute("data-glyph");
      if (!glyph) return;

      doorImaginationInput.push(glyph);
      playCyberSfx("beep", 500 + doorImaginationInput.length * 50, 0.15);

      if (imTrackValue) {
        imTrackValue.textContent = doorImaginationInput.join(" ➔ ");
      }

      if (doorImaginationInput.length === imaginationTarget.length) {
        const isMatch = doorImaginationInput.every((val, idx) => val === imaginationTarget[idx]);
        if (isMatch) {
          playCyberSfx("success");
          if (imFeedback) {
            imFeedback.style.color = "var(--d7-emerald)";
            imFeedback.textContent = "Encryption bypassed. Catastrophe archive unlocked.";
          }
          if (imCompBox) imCompBox.style.display = "block";
        } else {
          isImaginationResetting = true;
          playCyberSfx("static");
          document.body.classList.add("glitch-flash");
          setTimeout(() => document.body.classList.remove("glitch-flash"), 350);

          if (imFeedback) {
            imFeedback.style.color = "var(--d7-crimson)";
            imFeedback.textContent = "Data integrity corrupted! Resetting sequence...";
          }
          doorImaginationInput = [];
          setTimeout(() => {
            if (imTrackValue) imTrackValue.textContent = "NONE";
            if (imFeedback) imFeedback.textContent = "";
            isImaginationResetting = false;
          }, 1200);
        }
      }
    };
  });

  const claimImFragBtn = document.getElementById("claimImaginationFragBtn");
  if (claimImFragBtn) {
    claimImFragBtn.onclick = () => {
      collectedFragments.add("IMAGINATION");
      saveFragments();
      updateFragmentUI();
      closeChamber();
      playCyberSfx("success");
    };
  }

  // Terminal 03: Directive 00-Zero
  document.querySelectorAll(".future-choice-btn").forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll(".future-choice-btn").forEach((b) => b.classList.remove("is-chosen"));
      btn.classList.add("is-chosen");
      playCyberSfx("beep", 620, 0.18);

      const futCompBox = document.getElementById("futureDoorCompletedBox");
      if (futCompBox) futCompBox.style.display = "block";
    };
  });

  const claimFutFragBtn = document.getElementById("claimFutureFragBtn");
  if (claimFutFragBtn) {
    claimFutFragBtn.onclick = () => {
      collectedFragments.add("FUTURE");
      saveFragments();
      updateFragmentUI();
      closeChamber();
      playCyberSfx("success");
    };
  }

  function saveFragments() {
    try {
      localStorage.setItem(DAY7_CONFIG.storageKeys.doorsFragments, JSON.stringify([...collectedFragments]));
    } catch (err) {}
  }

  if (enterMuseumBtn && lockSection) {
    enterMuseumBtn.onclick = () => {
      playCyberSfx("beep", 659.25, 0.2);
      lockSection.style.display = "block";
      lockSection.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  updateFragmentUI();
}

// ==========================================================================
// EXPERIENCE 02: THE PARADOX PROTOCOL (5-STAGE LOCK)
// ==========================================================================
function initExperience2ParadoxLock(alreadyCompleted) {
  const stageLabel = document.getElementById("lockStageLabel");
  const attemptsIcons = document.getElementById("lockAttemptsIcons");
  const attemptsBadge = document.getElementById("lockAttemptsBadge");
  const ruleInstructionText = document.getElementById("ruleInstructionText");
  const cipherLegendStrip = document.getElementById("cipherLegendStrip");
  const cipherLegendItems = document.getElementById("cipherLegendItems");
  const screenStatusText = document.getElementById("screenStatusText");
  const sequenceNodesTray = document.getElementById("sequenceNodesTray");
  const inputDotsCluster = document.getElementById("inputDotsCluster");
  const feedbackToast = document.getElementById("mysteryFeedbackToast");
  const replayBtn = document.getElementById("replaySequenceBtn");
  const clearBtn = document.getElementById("clearInputBtn");
  const hintBtn = document.getElementById("requestRiddleHintBtn");
  const hintBox = document.getElementById("riddleHintBox");
  const hintText = document.getElementById("riddleHintText");
  const hintsCountLabel = document.getElementById("hintsLeftCount");
  const successOverlay = document.getElementById("mysterySuccessOverlay");
  const damagedRecordingPath = document.getElementById("museumCompletedPath");
  const enterFinalCoreBtn = document.getElementById("enterFinalDreamBtn");
  const coreSection = document.getElementById("finalDreamSection");

  if (cipherLegendItems) {
    cipherLegendItems.innerHTML = `
      <div class="cipher-chip"><span class="chip-dot" style="background:#f04444;"></span> 1 = Crimson (Red)</div>
      <div class="cipher-chip"><span class="chip-dot" style="background:#38bdf8;"></span> 2 = Azure (Blue)</div>
      <div class="cipher-chip"><span class="chip-dot" style="background:#10b981;"></span> 3 = Emerald (Green)</div>
      <div class="cipher-chip"><span class="chip-dot" style="background:#ffb347;"></span> 4 = Amber (Yellow)</div>
    `;
  }

  function generateStageData(stage) {
    const colors = DAY7_CONFIG.colors;
    let raw = [];
    let target = [];
    let instruction = "";
    let hint = "";
    let displayType = "COLOR_FLASH";

    if (stage === 1) {
      const len = 4;
      for (let i = 0; i < len; i++) raw.push(colors[Math.floor(Math.random() * colors.length)]);
      target = [...raw];
      instruction = "PROTOCOL 01: <strong>CONTRADICTORY EVIDENCE</strong>. The Architect approved two incompatible outcomes. Memorize the telemetry flash sequence and reproduce it in <strong>exact chronological order</strong>.";
      hint = "Observe the flash sequence left to right. Forward reproduction required.";
      displayType = "COLOR_FLASH";

    } else if (stage === 2) {
      const len = 4;
      for (let i = 0; i < len; i++) raw.push(colors[Math.floor(Math.random() * colors.length)]);
      target = [...raw].reverse();
      instruction = "PROTOCOL 02: <strong>TEMPORAL INVERSION</strong>. Time is running backwards. Enter the displayed telemetry in <strong>STRICT REVERSE order</strong>.";
      hint = "Reverse required! If telemetry was Crimson then Azure, input Azure then Crimson.";
      displayType = "COLOR_FLASH";

    } else if (stage === 3) {
      const numKeys = ["1", "2", "3", "4"];
      const len = 4;
      for (let i = 0; i < len; i++) raw.push(numKeys[Math.floor(Math.random() * numKeys.length)]);
      target = raw.map((num) => DAY7_CONFIG.cipherKey[num]);
      instruction = "PROTOCOL 03: <strong>FALSE STABILITY</strong>. System reports success while timelines collide. Decode the matrix numerals into colour nodes in forward order.";
      hint = "1 = Crimson, 2 = Azure, 3 = Emerald, 4 = Amber. Read left to right.";
      displayType = "CIPHER_NUMBERS";

    } else if (stage === 4) {
      const numKeys = ["1", "2", "3", "4"];
      const len = 4;
      for (let i = 0; i < len; i++) raw.push(numKeys[Math.floor(Math.random() * numKeys.length)]);
      const converted = raw.map((num) => DAY7_CONFIG.cipherKey[num]);
      target = [...converted].reverse();
      instruction = "PROTOCOL 04: <strong>IDENTITY CONFLICT</strong>. You are logged as both creator and test subject. Translate the numerical sequence and input in <strong>REVERSE order</strong>.";
      hint = "Translate numerals with the matrix key, then enter them backwards (right to left).";
      displayType = "CIPHER_NUMBERS";

    } else if (stage === 5) {
      const numKeys = ["1", "2", "3", "4"];
      const len = 5;
      for (let i = 0; i < len; i++) raw.push(numKeys[Math.floor(Math.random() * numKeys.length)]);
      const converted = raw.map((num) => DAY7_CONFIG.cipherKey[num]);
      target = [...converted].reverse();
      instruction = "PROTOCOL 05: <strong>THE IMPOSSIBLE RULE</strong>. Final core containment! Decode the 5-glyph temporal sequence and enter the entire solution in <strong>REVERSE</strong>.";
      hint = "5-glyph sequence: Translate each numeral with the matrix and press nodes in backwards order.";
      displayType = "CIPHER_NUMBERS";
    }

    return { rawSequence: raw, targetAnswer: target, instruction, hint, displayType };
  }

  function renderStage() {
    isPuzzleAnimationBusy = true;
    playerInputSequence = [];
    currentPuzzleData = generateStageData(currentLockStage);

    if (stageLabel) stageLabel.textContent = `STAGE ${currentLockStage} / ${TOTAL_LOCK_STAGES}`;
    updateAttemptsUI();

    if (ruleInstructionText) ruleInstructionText.innerHTML = currentPuzzleData.instruction;
    if (cipherLegendStrip) {
      cipherLegendStrip.style.display = (currentPuzzleData.displayType === "CIPHER_NUMBERS") ? "block" : "none";
    }

    if (feedbackToast) feedbackToast.textContent = "";
    if (hintBox) hintBox.style.display = "none";
    if (hintBtn) hintBtn.style.display = "inline-flex";

    renderInputDots();
    renderScreenDisplay();
  }

  function updateAttemptsUI() {
    if (!attemptsIcons) return;
    let heartsStr = "";
    for (let i = 0; i < currentStageAttemptsLeft; i++) heartsStr += "❤️";
    for (let i = currentStageAttemptsLeft; i < MAX_ATTEMPTS_PER_STAGE; i++) heartsStr += "🖤";
    attemptsIcons.textContent = heartsStr;
  }

  function renderInputDots() {
    if (!inputDotsCluster) return;
    inputDotsCluster.innerHTML = "";
    const targetLen = currentPuzzleData.targetAnswer.length;
    for (let i = 0; i < targetLen; i++) {
      const dot = document.createElement("span");
      dot.className = "input-dot";
      if (i < playerInputSequence.length) {
        dot.classList.add(`filled-${playerInputSequence[i].toLowerCase()}`);
      }
      inputDotsCluster.appendChild(dot);
    }
  }

  function setRuneButtonsDisabled(disabled) {
    document.querySelectorAll(".btn-dream-rune").forEach((btn) => { btn.disabled = disabled; });
    if (replayBtn) replayBtn.disabled = disabled;
    if (clearBtn) clearBtn.disabled = disabled;
  }

  function renderScreenDisplay() {
    if (!sequenceNodesTray) return;
    sequenceNodesTray.innerHTML = "";

    if (currentPuzzleData.displayType === "CIPHER_NUMBERS") {
      if (screenStatusText) screenStatusText.textContent = "ENCRYPTED MATRIX SEQUENCE";
      currentPuzzleData.rawSequence.forEach((num) => {
        const node = document.createElement("div");
        node.className = "sequence-node node-cipher";
        node.textContent = num;
        sequenceNodesTray.appendChild(node);
      });
      isPuzzleAnimationBusy = false;
      setRuneButtonsDisabled(false);

    } else {
      if (screenStatusText) screenStatusText.textContent = "READING TEMPORAL TELEMETRY...";
      setRuneButtonsDisabled(true);

      const runes = currentPuzzleData.rawSequence;
      runes.forEach((color, idx) => {
        const node = document.createElement("div");
        node.className = `sequence-node node-${color.toLowerCase()}`;
        node.id = `seqNode_${idx}`;
        node.textContent = "⚡";
        sequenceNodesTray.appendChild(node);
      });

      let delay = 600;
      runes.forEach((color, idx) => {
        setTimeout(() => {
          const node = document.getElementById(`seqNode_${idx}`);
          if (node) {
            node.classList.add("active-flash");
            playCyberSfx("beep", 420 + idx * 80, 0.25);
          }
        }, delay);

        delay += 600;

        setTimeout(() => {
          const node = document.getElementById(`seqNode_${idx}`);
          if (node) node.classList.remove("active-flash");
        }, delay - 100);
      });

      setTimeout(() => {
        if (screenStatusText) screenStatusText.textContent = "AWAITING REGISTER INPUT";
        isPuzzleAnimationBusy = false;
        setRuneButtonsDisabled(false);
      }, delay + 200);
    }
  }

  function handleRunePress(color) {
    if (isPuzzleAnimationBusy) return;

    playCyberSfx("beep", 480 + playerInputSequence.length * 60, 0.15);
    playerInputSequence.push(color);
    renderInputDots();

    if (playerInputSequence.length === currentPuzzleData.targetAnswer.length) {
      validateSubmission();
    }
  }

  function validateSubmission() {
    isPuzzleAnimationBusy = true;
    setRuneButtonsDisabled(true);

    const isMatch = playerInputSequence.every((val, idx) => val === currentPuzzleData.targetAnswer[idx]);

    if (isMatch) {
      playCyberSfx("success");
      if (feedbackToast) {
        feedbackToast.className = "mystery-feedback-toast toast-success";
        feedbackToast.textContent = `Stage ${currentLockStage} Stabilized! Protocol locked. ✓`;
      }

      setTimeout(() => {
        if (currentLockStage < TOTAL_LOCK_STAGES) {
          currentLockStage++;
          currentStageAttemptsLeft = MAX_ATTEMPTS_PER_STAGE;
          try {
            localStorage.setItem(DAY7_CONFIG.storageKeys.ruleLockStage, currentLockStage.toString());
          } catch (err) {}
          renderStage();
        } else {
          triggerLockSuccess();
        }
      }, 1100);

    } else {
      currentStageAttemptsLeft--;
      updateAttemptsUI();

      playCyberSfx("static");
      document.body.classList.add("glitch-flash");
      setTimeout(() => document.body.classList.remove("glitch-flash"), 350);

      if (currentStageAttemptsLeft > 0) {
        if (feedbackToast) {
          feedbackToast.className = "mystery-feedback-toast toast-error";
          feedbackToast.textContent = `Protocol mismatch! Remaining fail-safes: ${currentStageAttemptsLeft}. Re-aligning...`;
        }
        setTimeout(() => {
          playerInputSequence = [];
          renderInputDots();
          isPuzzleAnimationBusy = false;
          setRuneButtonsDisabled(false);
        }, 850);

      } else {
        if (feedbackToast) {
          feedbackToast.className = "mystery-feedback-toast toast-error";
          feedbackToast.textContent = `Fail-safes exhausted! Resetting Stage ${currentLockStage} with new temporal sequence...`;
        }

        setTimeout(() => {
          currentStageAttemptsLeft = MAX_ATTEMPTS_PER_STAGE;
          renderStage();
        }, 1400);
      }
    }
  }

  function triggerLockSuccess() {
    isMysterySolved = true;
    try {
      localStorage.setItem(DAY7_CONFIG.storageKeys.lockSolved, "true");
    } catch (err) {}

    const haloBox = document.getElementById("vaultHaloBox");
    const glyph = document.getElementById("vaultStatusGlyph");
    if (haloBox) haloBox.style.boxShadow = "0 0 50px #10b981";
    if (glyph) glyph.textContent = "🔓";

    if (successOverlay) successOverlay.style.display = "flex";

    setTimeout(() => {
      if (successOverlay) successOverlay.style.display = "none";
      if (damagedRecordingPath) damagedRecordingPath.style.display = "block";
      updateJourneyProgress(75, "EXPERIENCE 03: THE LAST TIMELINE");
    }, 2400);
  }

  document.querySelectorAll(".btn-dream-rune").forEach((btn) => {
    btn.onclick = () => {
      const color = btn.getAttribute("data-color");
      if (color) handleRunePress(color);
    };
  });

  if (clearBtn) {
    clearBtn.onclick = () => {
      if (isPuzzleAnimationBusy) return;
      playerInputSequence = [];
      renderInputDots();
      playCyberSfx("beep", 320, 0.12);
    };
  }

  if (replayBtn) {
    replayBtn.onclick = () => {
      if (isPuzzleAnimationBusy) return;
      playerInputSequence = [];
      renderInputDots();
      renderScreenDisplay();
    };
  }

  if (hintBtn) {
    hintBtn.onclick = () => {
      if (hintsRemaining > 0) {
        hintsRemaining--;
        if (hintsCountLabel) hintsCountLabel.textContent = hintsRemaining;
        if (hintText) hintText.innerHTML = currentPuzzleData.hint;
        if (hintBox) hintBox.style.display = "inline-flex";
        hintBtn.style.display = "none";
        playCyberSfx("beep", 580, 0.18);
      }
    };
  }

  if (isMysterySolved && damagedRecordingPath) {
    damagedRecordingPath.style.display = "block";
  }

  // Sensory Blackout Mirror Transition into Final Stage
  if (enterFinalCoreBtn && coreSection) {
    enterFinalCoreBtn.onclick = () => {
      const mirrorOverlay = document.getElementById("blackMirrorOverlay");
      const mirrorText = document.getElementById("mirrorTerminalText");

      if (mirrorOverlay && mirrorText) {
        mirrorOverlay.style.display = "flex";
        playCyberSfx("static");
        mirrorText.innerHTML = "";

        const msg = "CORE POWER OFFLINE.<br>LOOK AT YOUR REFLECTION IN THE GLASS.<br>...ARE YOU SURE YOU ARE THE ONE WHO REMEMBERS?";
        let charIdx = 0;

        const typeInterval = setInterval(() => {
          if (charIdx < msg.length) {
            if (msg.substr(charIdx, 4) === "<br>") {
              mirrorText.innerHTML += "<br>";
              charIdx += 4;
            } else {
              mirrorText.innerHTML += msg[charIdx];
              charIdx++;
            }
            if (charIdx % 3 === 0) playCyberSfx("beep", 380, 0.05);
          } else {
            clearInterval(typeInterval);
            setTimeout(() => {
              playCyberSfx("core");
              mirrorOverlay.style.display = "none";
              coreSection.style.display = "block";
              coreSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 1200);
          }
        }, 40);

      } else {
        playCyberSfx("core");
        coreSection.style.display = "block";
        coreSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
  }

  renderStage();
}

// ==========================================================================
// EXPERIENCE 03: SINGULARITY RESONANCE DIAL & FOURTH-WALL CLIMAX
// ==========================================================================
function initExperience3LastTimeline(alreadyCompleted) {
  const portalChamber = document.getElementById("finalPortalChamber");
  const stepPortalBtn = document.getElementById("stepIntoDreamBtn");
  const stepPortalBtnText = document.getElementById("stepPortalBtnText");
  const vortexRing = document.getElementById("portalVortexRing");
  const reactorCore = document.getElementById("reactorCoreVisual");
  const letterLandscape = document.getElementById("dreamLetterLandscape");
  const continueLetterBtn = document.getElementById("continueLetterBtn");
  const actionsDock = document.getElementById("letterActionsDock");
  const completedLockup = document.getElementById("letterCompletedLockup");
  const completeDay7Btn = document.getElementById("completeDay7Btn");

  const slider = document.getElementById("singularitySlider");
  const gauge = document.getElementById("singularityGauge");
  const statusLine = document.getElementById("singularityStatusLine");
  const btnPrime = document.getElementById("btnChoosePrime");
  const btnNull = document.getElementById("btnChooseNull");

  // Singularity Dial Interaction
  function updateSingularityDial(val) {
    const num = parseFloat(val);
    if (gauge) gauge.textContent = `RESONANCE: ${num.toFixed(1)}%`;

    if (num === 50.0) {
      selectedTimelinePath = "SINGULARITY";
      if (gauge) { gauge.style.color = "var(--d7-emerald)"; gauge.textContent = "RESONANCE: 50.0% [SINGULARITY POINT]"; }
      if (statusLine) statusLine.textContent = "Status: Perfectly balanced at the Singularity Point (50.0%). Ready to execute.";
      if (reactorCore) {
        reactorCore.style.boxShadow = "0 0 45px var(--d7-emerald)";
        reactorCore.style.background = "radial-gradient(circle, #10b981 0%, #0369a1 80%)";
      }
    } else if (num < 50.0) {
      selectedTimelinePath = "PRIME";
      if (gauge) { gauge.style.color = "var(--d7-cyan)"; }
      if (statusLine) statusLine.textContent = "Status: Skewed toward Prime. Reality stable, civilian memory compromised.";
      if (reactorCore) {
        reactorCore.style.boxShadow = "0 0 45px var(--d7-cyan)";
        reactorCore.style.background = "radial-gradient(circle, #43bdf5 0%, #0369a1 80%)";
      }
    } else {
      selectedTimelinePath = "NULL";
      if (gauge) { gauge.style.color = "var(--d7-crimson)"; }
      if (statusLine) statusLine.textContent = "Status: Skewed toward Null. Total system vaporization logged.";
      if (reactorCore) {
        reactorCore.style.boxShadow = "0 0 45px var(--d7-crimson)";
        reactorCore.style.background = "radial-gradient(circle, #f04444 0%, #7f1d1d 80%)";
      }
    }

    playCyberSfx("beep", 220 + num * 6, 0.05);
  }

  if (slider) {
    slider.oninput = (e) => {
      updateSingularityDial(e.target.value);
    };
  }

  if (btnPrime) {
    btnPrime.onclick = () => {
      if (slider) slider.value = 0;
      btnPrime.classList.add("is-active");
      if (btnNull) btnNull.classList.remove("is-active");
      updateSingularityDial(0);
    };
  }

  if (btnNull) {
    btnNull.onclick = () => {
      if (slider) slider.value = 100;
      btnNull.classList.add("is-active");
      if (btnPrime) btnPrime.classList.remove("is-active");
      updateSingularityDial(100);
    };
  }

  let isPortalTransitioning = false;
  if (stepPortalBtn) {
    stepPortalBtn.onclick = () => {
      if (isPortalTransitioning) return;
      isPortalTransitioning = true;
      stepPortalBtn.disabled = true;

      playCyberSfx("core");
      let count = 3;
      if (stepPortalBtnText) stepPortalBtnText.textContent = `COLLAPSING TIMELINE MATRIX... (${count})`;

      const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          playCyberSfx("beep", 440 + count * 100, 0.15);
          if (stepPortalBtnText) stepPortalBtnText.textContent = `COLLAPSING TIMELINE MATRIX... (${count})`;
        } else {
          clearInterval(countdownInterval);
          if (stepPortalBtnText) stepPortalBtnText.textContent = "TIMELINE CONFLICT RESOLVED";
          playCyberSfx("success");

          if (vortexRing) {
            vortexRing.style.transform = "scale(2.2)";
            vortexRing.style.transition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease";
            vortexRing.style.opacity = "0";
          }

          setTimeout(() => {
            if (portalChamber) portalChamber.style.display = "none";
            if (letterLandscape) {
              letterLandscape.style.display = "block";
              letterLandscape.scrollIntoView({ behavior: "smooth", block: "start" });
              injectFourthWallData();
            }
          }, 700);
        }
      }, 700);
    };
  }

  // Inject 4th Wall Break Telemetry
  function injectFourthWallData() {
    const tsEl = document.getElementById("localLoopTimestamp");
    const pfEl = document.getElementById("clientPlatform");
    if (tsEl) tsEl.textContent = new Date().toLocaleTimeString();
    if (pfEl) {
      pfEl.textContent = (navigator.userAgentData && navigator.userAgentData.platform)
        ? navigator.userAgentData.platform
        : navigator.platform || "TERMINAL_NODE_07";
    }
  }

  for (let i = 1; i <= currentLetterParagraph; i++) {
    const para = document.getElementById(`letterPara${i}`);
    if (para) para.style.display = "block";
  }

  if (currentLetterParagraph >= totalLetterParagraphs) {
    if (actionsDock) actionsDock.style.display = "none";
    if (completedLockup) completedLockup.style.display = "block";
  }

  if (continueLetterBtn) {
    continueLetterBtn.onclick = () => {
      if (currentLetterParagraph < totalLetterParagraphs) {
        currentLetterParagraph++;
        playCyberSfx("beep", 520 + currentLetterParagraph * 50, 0.18);

        const nextPara = document.getElementById(`letterPara${currentLetterParagraph}`);
        if (nextPara) {
          nextPara.style.display = "block";
          nextPara.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

        try {
          localStorage.setItem(DAY7_CONFIG.storageKeys.letterIndex, currentLetterParagraph.toString());
        } catch (err) {}

        if (currentLetterParagraph >= totalLetterParagraphs) {
          if (actionsDock) actionsDock.style.display = "none";
          if (completedLockup) {
            completedLockup.style.display = "block";
            completedLockup.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
    };
  }

  if (completeDay7Btn) {
    completeDay7Btn.onclick = () => {
      triggerDay7Completion();
    };
  }
}

// --------------------------------------------------------------------------
// COMPLETION SCREEN
// --------------------------------------------------------------------------
function triggerDay7Completion() {
  isDay7Completed = true;
  try {
    localStorage.setItem(DAY7_CONFIG.storageKeys.completed, "true");
  } catch (err) {}

  playCyberSfx("success");
  updateJourneyProgress(100, "DAY 07 COMPLETED // CYCLE 003 PENDING");
  renderCompletionView();
}

function updateJourneyProgress(pct, stageName) {
  const fill = document.getElementById("day7ProgressFill");
  const pctEl = document.getElementById("day7ProgressPct");
  const stageEl = document.getElementById("day7CurrentStageName");

  if (fill) fill.style.width = `${pct}%`;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (stageEl && stageName) stageEl.textContent = stageName;
}

function renderCompletionView() {
  const completionScreen = document.getElementById("day7CompletionScreen");
  if (completionScreen) {
    completionScreen.style.display = "block";
    setTimeout(() => {
      completionScreen.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  }
}

// --------------------------------------------------------------------------
// NEXT DAY NAVIGATION
// --------------------------------------------------------------------------
function initNextDayNavigation() {
  const navNextBtn = document.getElementById("navNextDayBtn");
  const compDay8Btn = document.getElementById("completionDay8Btn");

  const handleNextClick = (e) => {
    const day8Data = (typeof JOURNEY_DAYS !== "undefined")
      ? JOURNEY_DAYS.find((d) => d.day === 8)
      : null;

    if (day8Data && typeof isDateUnlocked === "function" && !isDateUnlocked(day8Data.dateStr)) {
      e.preventDefault();
      if (typeof showLockModal === "function") {
        showLockModal(day8Data);
      }
    }
  };

  if (navNextBtn) navNextBtn.onclick = handleNextClick;
  if (compDay8Btn) compDay8Btn.onclick = handleNextClick;
}