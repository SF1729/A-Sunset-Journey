/* ==========================================================================
   BUDDUU — DAY 8: “THE FRIENDSHIP FILES — CASE NO. 008”
   Gate 1 (Date Lock) → Gate 2 (Acoustic Rhythm Lock) →
   Exp 1 (UV Forensic Desk) → Exp 2 (Wiretap Radio 104.2 MHz) →
   Exp 3 (Yarn Deduction + Brass Cryptex 8-2-7) → Exp 4 (Final Dossier & Letter)
   ========================================================================== */

// 1. DATA CONFIGURATION
const evidenceData = {
  A: {
    tag: "EVIDENCE FILE A // THE PHOTOGRAPH",
    headline: "The Unplanned Snapshot 📷",
    body: "An ordinary photograph examined under forensic lighting. On the reverse side, an invisible UV watermark highlights a handwritten entry: 'No cameras were scheduled, yet this moment became unforgettable.'",
    clue: "UV Stamp Discovered: Number [ 8 ] and handwriting: 'Unscripted laughs never fade.'"
  },
  B: {
    tag: "EVIDENCE FILE B // THE CLASSIFIED NOTE",
    headline: "Intercepted Memorandum 📜",
    body: "A heavily redacted document. Under the ultraviolet spectrum, the black marker ink becomes transparent, revealing: 'Subject Budduu is an enduring source of reassurance. Time zones and silence have zero diminishing effect.'",
    clue: "UV Stamp Discovered: Number [ 2 ] and text: 'Distance never broke it.'"
  },
  C: {
    tag: "EVIDENCE FILE C // THE BRASS KEY",
    headline: "Surveillance Receiver Key 🗝️",
    body: "A vintage brass transmitter key. The microscopic ultraviolet stamping on the blade discloses a surveillance frequency: '104.2 MHz - AUDIO CARRIER ACTIVE'.",
    clue: "UV Stamp Discovered: Surveillance Radio Frequency [ 104.2 MHz ]."
  }
};

const day8LetterData = {
  paragraphs: [
    "Dear Budduu,",
    "Some friendships make ordinary days feel a little more special. The random conversations, the laughter, the unexpected moments, and all the little things we never plan become memories we carry with us.",
    "I hope there are many more moments waiting for us — more laughter, more stories, and more reasons to look back and smile.",
    "No matter how much life changes, I hope we keep finding new reasons to laugh, new memories to collect, and new stories to tell.",
    "Thank you for being such an irreplaceable part of my life.",
    "— Tera Tedduu, Shahid 🧡"
  ]
};

// 2. STATE REPOSITORY
let isRhythmLockSolved = false;
let isUVModeActive = false;
let inspectedEvidenceSet = new Set();
let isWiretapSolved = false;
let connectedYarnPins = [];
let isYarnSolved = false;
let cryptexValues = [0, 0, 0];
const targetCryptex = [8, 2, 7]; // Digits from UV Photo (8), Note (2), Wiretap (7)
let isCryptexUnlocked = false;
let hasOpenedFinalCase = false;
let currentLetterParagraph = 0;
let isLetterFullyRead = false;
let isDay8Completed = false;

// Audio context & generators
let audioCtx = null;
let staticNoiseNode = null;
let staticGainNode = null;
let isStaticPlaying = false;

document.addEventListener("DOMContentLoaded", () => {
  initDay8Flow();
});

/**
 * Main Flow Controller: Gate 1 → Gate 2 → 4 Experiences
 */
function initDay8Flow() {
  const day8Data = (typeof JOURNEY_DAYS !== "undefined")
    ? JOURNEY_DAYS.find((d) => d.day === 8)
    : { day: 8, dateStr: "2026-10-27" };

  const dateLockedView = document.getElementById("day8DateLockedView");
  const rhythmLockView = document.getElementById("day8RhythmLockView");
  const unlockedView = document.getElementById("day8UnlockedView");

  // GATE 1: Date Lock Verification
  const isDateReady = (typeof isDateUnlocked === "function") 
    ? isDateUnlocked(day8Data.dateStr) 
    : true;

  if (!isDateReady) {
    if (dateLockedView) dateLockedView.style.display = "flex";
    if (rhythmLockView) rhythmLockView.style.display = "none";
    if (unlockedView) unlockedView.style.display = "none";

    const daysRemaining = (typeof getDaysUntil === "function") ? getDaysUntil(day8Data.dateStr) : 0;
    const countdownEl = document.getElementById("dateLockCountdown");
    if (countdownEl) {
      countdownEl.textContent = daysRemaining > 0 
        ? `Unlocks in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} (27 October 2026)`
        : "Unlocks on 27 October 2026";
    }
    return;
  }

  if (dateLockedView) dateLockedView.style.display = "none";

  // Check persistent storage
  try {
    if (localStorage.getItem("budduu_day8_lock_solved") === "true") {
      isRhythmLockSolved = true;
    }
    if (localStorage.getItem("budduu_day8_completed") === "true") {
      isRhythmLockSolved = true;
      inspectedEvidenceSet = new Set(["A", "B", "C"]);
      isWiretapSolved = true;
      isYarnSolved = true;
      isCryptexUnlocked = true;
      hasOpenedFinalCase = true;
      isLetterFullyRead = true;
      isDay8Completed = true;
    }
  } catch (err) {}

  initDay8AmbientParticles();
  initNextDayNavigation();

  // GATE 2: Rhythm Lock
  if (!isRhythmLockSolved) {
    if (rhythmLockView) rhythmLockView.style.display = "flex";
    if (unlockedView) unlockedView.style.display = "none";
    initRhythmTapLock();
    return;
  }

  // BOTH GATES PASSED: Launch Main Journey
  launchActualDay8Content();
}

/**
 * Ambient Particles Canvas
 */
function initDay8AmbientParticles() {
  const canvas = document.getElementById("day8ParticlesCanvas");
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

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.28 + 0.08,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.6 + 0.2,
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
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 179, 71, ${alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(255, 107, 74, 0.6)";
      ctx.fill();
    });
    requestAnimationFrame(render);
  }
  render();
}

/**
 * Web Audio Synthesizer Helpers
 */
function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playSynthTone(freq = 580, duration = 0.12, type = "sine") {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playMechanicalClack() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

/**
 * ==========================================================================
 * GATE 2: ACOUSTIC RHYTHM TAP LOCK
 * ==========================================================================
 */
function initRhythmTapLock() {
  const listenBtn = document.getElementById("listenRhythmBtn");
  const tapPad = document.getElementById("rhythmTapPad");
  const waveform = document.getElementById("waveformDisplay");
  const statusLabel = document.getElementById("rhythmStatusLabel");
  const feedback = document.getElementById("rhythmFeedbackToast");
  const progressCaption = document.getElementById("tapProgressCaption");
  const successOverlay = document.getElementById("rhythmSuccessOverlay");
  const openCaseBtn = document.getElementById("openCaseFileBtn");

  const leds = [
    document.getElementById("ledBeat0"),
    document.getElementById("ledBeat1"),
    document.getElementById("ledBeat2"),
    document.getElementById("ledBeat3"),
    document.getElementById("ledBeat4")
  ];

  const targetBeatsCount = 5;
  const demoBeatTimings = [0, 350, 1050, 1400, 2100];
  const targetIntervals = [350, 700, 350, 700];
  const totalDemoDuration = 2100;
  const targetFractions = targetIntervals.map(dt => dt / totalDemoDuration);
  const fractionTolerance = 0.12;

  let isDemoPlaying = false;
  let userTaps = [];

  function playDemo() {
    if (isDemoPlaying) return;
    isDemoPlaying = true;
    userTaps = [];
    if (progressCaption) progressCaption.textContent = "0 / 5 BEATS";

    if (listenBtn) listenBtn.disabled = true;
    if (tapPad) tapPad.disabled = true;
    if (waveform) waveform.classList.add("is-playing");
    if (statusLabel) statusLabel.textContent = "TRANSMITTING FREQUENCY... LISTEN CLOSELY";
    if (feedback) feedback.textContent = "";

    leds.forEach(led => led && led.classList.remove("beat-flash", "beat-filled"));

    demoBeatTimings.forEach((timing, index) => {
      setTimeout(() => {
        playSynthTone(index === targetBeatsCount - 1 ? 740 : 540, 0.14);
        if (leds[index]) {
          leds[index].classList.add("beat-flash");
          setTimeout(() => leds[index].classList.remove("beat-flash"), 240);
        }
      }, timing);
    });

    setTimeout(() => {
      isDemoPlaying = false;
      if (listenBtn) {
        listenBtn.disabled = false;
        listenBtn.querySelector("span").textContent = "REPLAY RHYTHM";
      }
      if (tapPad) tapPad.disabled = false;
      if (waveform) waveform.classList.remove("is-playing");
      if (statusLabel) statusLabel.textContent = "YOUR TURN: REPEAT THE 5-BEAT PATTERN";
    }, totalDemoDuration + 400);
  }

  function handleTap() {
    if (isDemoPlaying || isRhythmLockSolved) return;
    playSynthTone(640, 0.08);

    const now = performance.now();
    userTaps.push(now);
    const count = userTaps.length;

    if (tapPad) {
      tapPad.classList.add("active-press");
      setTimeout(() => tapPad.classList.remove("active-press"), 120);
    }

    if (leds[count - 1]) leds[count - 1].classList.add("beat-filled");
    if (progressCaption) progressCaption.textContent = `${count} / 5 BEATS`;

    if (count === targetBeatsCount) {
      validateRhythm();
    }
  }

  function validateRhythm() {
    if (tapPad) tapPad.disabled = true;
    const intervals = [];
    for (let i = 1; i < userTaps.length; i++) {
      intervals.push(userTaps[i] - userTaps[i - 1]);
    }
    const totalDuration = intervals.reduce((a, b) => a + b, 0);

    let match = true;
    if (totalDuration < 1000 || totalDuration > 5200) {
      match = false;
    } else {
      for (let i = 0; i < intervals.length; i++) {
        const fraction = intervals[i] / totalDuration;
        if (Math.abs(fraction - targetFractions[i]) > fractionTolerance) {
          match = false;
          break;
        }
      }
    }

    if (match) {
      isRhythmLockSolved = true;
      try { localStorage.setItem("budduu_day8_lock_solved", "true"); } catch (e) {}
      leds.forEach(led => led && led.classList.add("beat-flash"));
      if (statusLabel) statusLabel.textContent = "ACCESS GRANTED • FREQUENCY VERIFIED";
      setTimeout(() => {
        if (successOverlay) successOverlay.style.display = "flex";
      }, 500);
    } else {
      if (feedback) feedback.textContent = "Rhythm mismatch. Notice the pause between beat 2 & 3.";
      if (statusLabel) statusLabel.textContent = "MISMATCH • TRY AGAIN OR PRESS 'REPLAY RHYTHM'";
      setTimeout(() => {
        userTaps = [];
        if (progressCaption) progressCaption.textContent = "0 / 5 BEATS";
        leds.forEach(led => led && led.classList.remove("beat-filled", "beat-flash"));
        if (tapPad) tapPad.disabled = false;
      }, 900);
    }
  }

  if (listenBtn) listenBtn.addEventListener("click", playDemo);
  if (tapPad) {
    tapPad.addEventListener("click", handleTap);
    tapPad.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleTap();
      }
    });
  }

  if (openCaseBtn) {
    openCaseBtn.addEventListener("click", () => {
      const rhythmView = document.getElementById("day8RhythmLockView");
      if (rhythmView) rhythmView.style.display = "none";
      launchActualDay8Content();
    });
  }
}

/**
 * ==========================================================================
 * MAIN STAGE LAUNCHER
 * ==========================================================================
 */
function launchActualDay8Content() {
  const unlockedView = document.getElementById("day8UnlockedView");
  if (unlockedView) unlockedView.style.display = "block";

  let alreadyCompleted = false;
  try {
    alreadyCompleted = localStorage.getItem("budduu_day8_completed") === "true";
  } catch (e) {}

  initInvestigationBriefing(alreadyCompleted);
  initExperience1ForensicDesk(alreadyCompleted);
  initExperience2Wiretap(alreadyCompleted);
  initExperience3YarnAndCryptex(alreadyCompleted);
  initExperience4FinalCase(alreadyCompleted);

  if (alreadyCompleted) {
    updateOverallProgress(4);
    renderCompletionView();
  }
}

function updateOverallProgress(stageNumber) {
  const badge = document.getElementById("caseStageBadge");
  const fill = document.getElementById("caseStageFill");
  const percent = document.getElementById("caseStagePercent");

  const pct = Math.min(100, stageNumber * 25);
  if (badge) badge.textContent = `STAGE ${stageNumber} / 4 • ${pct}%`;
  if (fill) fill.style.width = `${pct}%`;
  if (percent) percent.textContent = `${pct}%`;
}

function initInvestigationBriefing(skipIntro) {
  const briefingStage = document.getElementById("investigationBriefingStage");
  const mainStage = document.getElementById("mainInvestigationStage");
  const beginBtn = document.getElementById("beginInvestigationBtn");

  if (skipIntro) {
    if (briefingStage) briefingStage.style.display = "none";
    if (mainStage) {
      mainStage.style.display = "block";
      mainStage.classList.add("visible");
    }
    return;
  }

  if (beginBtn) {
    beginBtn.addEventListener("click", () => {
      if (briefingStage) {
        briefingStage.classList.add("fade-out");
        setTimeout(() => {
          briefingStage.style.display = "none";
          if (mainStage) {
            mainStage.style.display = "block";
            setTimeout(() => mainStage.classList.add("visible"), 40);
          }
        }, 700);
      }
    });
  }
}

/**
 * ==========================================================================
 * EXPERIENCE 1: THE FORENSIC EVIDENCE DESK (UV BLACKLIGHT)
 * ==========================================================================
 */
function initExperience1ForensicDesk(alreadyCompleted) {
  const uvBtn = document.getElementById("uvToggleBtn");
  const uvBtnText = document.getElementById("uvBtnText");
  const boardFrame = document.getElementById("evidenceBoardFrame");
  const beamMask = document.getElementById("uvBeamMask");
  const evidenceCards = document.querySelectorAll(".evidence-pin-card");
  const counterBadge = document.getElementById("evidenceCounterBadge");
  const overlay = document.getElementById("inspectionOverlay");
  const modalTag = document.getElementById("modalEvidenceTag");
  const modalHeadline = document.getElementById("modalEvidenceHeadline");
  const modalBody = document.getElementById("modalEvidenceBody");
  const modalClueText = document.getElementById("modalClueText");
  const closeBtn = document.getElementById("closeInspectionBtn");
  const completionGate = document.getElementById("evidenceCompletionGate");
  const btnGoToRadio = document.getElementById("btnGoToRadioWiretap");
  const wiretapSection = document.getElementById("wiretapRadioSection");

  if (alreadyCompleted) {
    evidenceCards.forEach(c => c.classList.add("is-inspected"));
    document.getElementById("statusPillA").textContent = "INSPECTED ✓";
    document.getElementById("statusPillB").textContent = "INSPECTED ✓";
    document.getElementById("statusPillC").textContent = "INSPECTED ✓";
    if (counterBadge) counterBadge.textContent = "EVIDENCE INSPECTED: 3 / 3";
    if (completionGate) completionGate.style.display = "block";
    if (wiretapSection) wiretapSection.style.display = "block";
    return;
  }

  // Toggle Forensic UV Torch
  if (uvBtn) {
    uvBtn.addEventListener("click", () => {
      isUVModeActive = !isUVModeActive;
      playSynthTone(isUVModeActive ? 880 : 440, 0.15, "triangle");

      if (isUVModeActive) {
        boardFrame.classList.add("uv-mode-active");
        uvBtn.classList.add("uv-active");
        uvBtnText.textContent = "DEACTIVATE UV LIGHT";
      } else {
        boardFrame.classList.remove("uv-mode-active");
        uvBtn.classList.remove("uv-active");
        uvBtnText.textContent = "ACTIVATE UV FORENSIC LIGHT";
      }
    });
  }

  // Track UV Torch Spotlight on Cursor / Touch
  if (boardFrame && beamMask) {
    const handleMove = (e) => {
      if (!isUVModeActive) return;
      const rect = boardFrame.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      beamMask.style.setProperty("--uv-x", `${x}px`);
      beamMask.style.setProperty("--uv-y", `${y}px`);
    };

    boardFrame.addEventListener("mousemove", handleMove);
    boardFrame.addEventListener("touchmove", handleMove, { passive: true });
  }

  // Card Inspection
  evidenceCards.forEach((card) => {
    const key = card.dataset.evidence;
    const inspectAction = () => {
      const data = evidenceData[key];
      if (!data) return;

      inspectedEvidenceSet.add(key);
      card.classList.add("is-inspected");
      const pill = document.getElementById(`statusPill${key}`);
      if (pill) pill.textContent = "INSPECTED ✓";

      playSynthTone(720, 0.1);

      if (modalTag) modalTag.textContent = data.tag;
      if (modalHeadline) modalHeadline.textContent = data.headline;
      if (modalBody) modalBody.innerHTML = `<p>${data.body}</p>`;
      if (modalClueText) modalClueText.textContent = data.clue;

      if (overlay) overlay.style.display = "flex";

      if (counterBadge) {
        counterBadge.textContent = `EVIDENCE INSPECTED: ${inspectedEvidenceSet.size} / 3`;
      }

      if (inspectedEvidenceSet.size === 3 && completionGate) {
        completionGate.style.display = "block";
        completionGate.scrollIntoView({ behavior: "smooth", block: "center" });
        updateOverallProgress(1);
      }
    };

    card.addEventListener("click", inspectAction);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        inspectAction();
      }
    });
  });

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }

  if (btnGoToRadio && wiretapSection) {
    btnGoToRadio.addEventListener("click", () => {
      wiretapSection.style.display = "block";
      wiretapSection.scrollIntoView({ behavior: "smooth", block: "start" });
      startRadioStaticSound();
      updateOverallProgress(2);
    });
  }
}

/**
 * ==========================================================================
 * EXPERIENCE 2: THE WIRETAP RADIO TUNER (AUDIO DECODING)
 * ==========================================================================
 */
function startRadioStaticSound() {
  if (isStaticPlaying || isWiretapSolved) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // White noise
    }

    staticNoiseNode = ctx.createBufferSource();
    staticNoiseNode.buffer = buffer;
    staticNoiseNode.loop = true;

    staticGainNode = ctx.createGain();
    staticGainNode.gain.setValueAtTime(0.08, ctx.currentTime);

    staticNoiseNode.connect(staticGainNode);
    staticGainNode.connect(ctx.destination);

    staticNoiseNode.start();
    isStaticPlaying = true;
  } catch (e) {}
}

function stopRadioStaticSound() {
  if (staticGainNode && audioCtx) {
    try {
      staticGainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (staticNoiseNode) staticNoiseNode.stop();
        isStaticPlaying = false;
      }, 500);
    } catch (e) {}
  }
}

function initExperience2Wiretap(alreadyCompleted) {
  const slider = document.getElementById("radioFreqSlider");
  const freqDisplay = document.getElementById("radioFreqDisplay");
  const needle = document.getElementById("radioDialNeedle");
  const fill = document.getElementById("radioSignalFill");
  const percentText = document.getElementById("radioSignalPercent");
  const statusDot = document.getElementById("radioStatusDot");
  const transcript = document.getElementById("radioTranscriptText");
  const solvedBlock = document.getElementById("wiretapSolvedBlock");
  const btnGoToYarn = document.getElementById("btnGoToYarnBoard");
  const yarnSection = document.getElementById("yarnCryptexSection");

  const targetFreq = 104.2;

  if (alreadyCompleted) {
    if (slider) slider.value = "104.2";
    if (freqDisplay) freqDisplay.textContent = "104.2 MHz";
    if (needle) needle.style.left = "81%";
    if (fill) fill.style.width = "100%";
    if (percentText) percentText.textContent = "100%";
    if (statusDot) statusDot.className = "terminal-status-light locked-green";
    if (transcript) {
      transcript.innerHTML = "<strong style='color:#52e396;'>TRANSMISSION CLEAR:</strong> 'Subject Budduu verified. The final Cryptex tumbler digit is confirmed: <strong>[ 7 ]</strong>.'";
    }
    if (solvedBlock) solvedBlock.style.display = "block";
    if (yarnSection) yarnSection.style.display = "block";
    return;
  }

  if (slider) {
    slider.addEventListener("input", (e) => {
      if (isWiretapSolved) return;
      startRadioStaticSound();

      const val = parseFloat(e.target.value);
      if (freqDisplay) freqDisplay.textContent = `${val.toFixed(1)} MHz`;

      // Position needle (scale from 88 to 108)
      const ratio = (val - 88.0) / (108.0 - 88.0);
      const needlePos = 8 + ratio * 84;
      if (needle) needle.style.left = `${needlePos}%`;

      // Distance from target
      const delta = Math.abs(val - targetFreq);

      // Signal Strength percentage
      let strength = Math.max(8, Math.round((1 - Math.min(delta, 6) / 6) * 100));
      if (fill) fill.style.width = `${strength}%`;
      if (percentText) percentText.textContent = `${strength}%`;

      // Adjust static noise level
      if (staticGainNode && audioCtx) {
        const noiseLevel = Math.max(0.005, (delta / 5) * 0.1);
        staticGainNode.gain.setValueAtTime(noiseLevel, audioCtx.currentTime);
      }

      // Check Match (within 0.1 MHz)
      if (delta <= 0.15) {
        isWiretapSolved = true;
        stopRadioStaticSound();
        playSynthTone(1046, 0.35, "sine"); // Harmonic unlock chime

        if (fill) fill.style.width = "100%";
        if (percentText) percentText.textContent = "100%";
        if (statusDot) statusDot.className = "terminal-status-light locked-green";

        if (transcript) {
          transcript.innerHTML = "<strong style='color:#52e396;'>AUDIO CARRIER LOCKED:</strong> 'Surveillance log intercepted. Subject Budduu verified. The 3rd Cryptex digit is <strong>[ 7 ]</strong>.'";
        }

        if (solvedBlock) {
          solvedBlock.style.display = "block";
          solvedBlock.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        if (statusDot) statusDot.className = "terminal-status-light blinking-amber";
        if (transcript) {
          transcript.textContent = `[STATIC: ${(100 - strength)}%] ...sshhhhh... carrier wave out of phase... target is 104.2 MHz...`;
        }
      }
    });
  }

  if (btnGoToYarn && yarnSection) {
    btnGoToYarn.addEventListener("click", () => {
      yarnSection.style.display = "block";
      yarnSection.scrollIntoView({ behavior: "smooth", block: "start" });
      updateOverallProgress(3);
    });
  }
}

/**
 * ==========================================================================
 * EXPERIENCE 3: RED THREAD BOARD + BRASS CRYPTEX LOCK
 * ==========================================================================
 */
function initExperience3YarnAndCryptex(alreadyCompleted) {
  const pinNodes = document.querySelectorAll(".yarn-pin-node");
  const pinsPill = document.getElementById("yarnPinsConnectedPill");
  const yarnFeedback = document.getElementById("yarnFeedbackToast");
  const cryptexVault = document.getElementById("brassCryptexVault");
  const unlockCryptexBtn = document.getElementById("btnUnlockCryptex");
  const cryptexFeedback = document.getElementById("cryptexFeedbackToast");
  const finalCaseSection = document.getElementById("finalCaseFileSection");

  if (alreadyCompleted) {
    pinNodes.forEach(node => {
      if (node.dataset.genuine === "true") node.classList.add("node-connected");
    });
    if (pinsPill) pinsPill.textContent = "PINS CONNECTED: 3 / 3 (VERIFIED)";
    if (cryptexVault) cryptexVault.style.display = "block";
    targetCryptex.forEach((val, i) => {
      const el = document.getElementById(`dialVal${i}`);
      if (el) el.textContent = val;
    });
    if (finalCaseSection) finalCaseSection.style.display = "block";
    return;
  }

  // Part A: Interactive Yarn Pinning
  pinNodes.forEach((node) => {
    node.addEventListener("click", () => {
      if (isYarnSolved) return;

      const isGenuine = node.dataset.genuine === "true";
      const pinId = node.dataset.pinId;

      if (!isGenuine) {
        // Red Herring Decoy clicked!
        playSynthTone(220, 0.25, "sawtooth");
        node.classList.add("node-snapped");
        if (yarnFeedback) {
          yarnFeedback.textContent = "Thread Snapped! Decoy distraction detected. Focus on unbreakable truths.";
        }
        setTimeout(() => node.classList.remove("node-snapped"), 600);
        return;
      }

      // Genuine Pin
      if (!connectedYarnPins.includes(pinId)) {
        connectedYarnPins.push(pinId);
        node.classList.add("node-connected");
        playSynthTone(440 + connectedYarnPins.length * 150, 0.15, "triangle");

        if (pinsPill) {
          pinsPill.textContent = `PINS CONNECTED: ${connectedYarnPins.length} / 3`;
        }

        if (yarnFeedback) yarnFeedback.textContent = "";

        if (connectedYarnPins.length === 3) {
          isYarnSolved = true;
          if (yarnFeedback) {
            yarnFeedback.innerHTML = "<strong style='color:#52e396;'>DEDUCTION VERIFIED!</strong> The thread points directly to the Brass Cryptex.";
          }
          if (cryptexVault) {
            cryptexVault.style.display = "block";
            cryptexVault.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
    });
  });

  // Part B: Brass Cryptex Dial Rotations
  const dialButtons = document.querySelectorAll(".dial-arrow-btn");
  dialButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isCryptexUnlocked) return;
      const dialIdx = parseInt(btn.dataset.dial, 10);
      const dir = btn.dataset.dir;

      playMechanicalClack();

      if (dir === "up") {
        cryptexValues[dialIdx] = (cryptexValues[dialIdx] + 1) % 10;
      } else {
        cryptexValues[dialIdx] = (cryptexValues[dialIdx] - 1 + 10) % 10;
      }

      const valEl = document.getElementById(`dialVal${dialIdx}`);
      if (valEl) valEl.textContent = cryptexValues[dialIdx];
    });
  });

  // Test Cryptex Code
  if (unlockCryptexBtn) {
    unlockCryptexBtn.addEventListener("click", () => {
      if (isCryptexUnlocked) return;

      const isMatch = (
        cryptexValues[0] === targetCryptex[0] &&
        cryptexValues[1] === targetCryptex[1] &&
        cryptexValues[2] === targetCryptex[2]
      );

      if (isMatch) {
        isCryptexUnlocked = true;
        playSynthTone(880, 0.4, "sine");
        setTimeout(() => playSynthTone(1320, 0.5, "sine"), 200);

        if (cryptexFeedback) {
          cryptexFeedback.innerHTML = "<strong style='color:#52e396;'>TUMBLERS RELEASED!</strong> The brass lock opened.";
        }
        unlockCryptexBtn.disabled = true;
        unlockCryptexBtn.classList.add("is-unlocked");
        unlockCryptexBtn.querySelector("span").textContent = "VAULT UNLOCKED ✓";

        if (finalCaseSection) {
          finalCaseSection.style.display = "block";
          finalCaseSection.scrollIntoView({ behavior: "smooth", block: "start" });
          updateOverallProgress(4);
        }
      } else {
        playSynthTone(180, 0.3, "sawtooth");
        if (cryptexFeedback) {
          cryptexFeedback.textContent = "The tumblers resisted. Review clues: Photo UV digit, Note UV digit, and Radio audio log.";
        }
      }
    });
  }
}

/**
 * ==========================================================================
 * EXPERIENCE 4: THE FINAL CASE FILE & PERSONAL LETTER
 * ==========================================================================
 */
function initExperience4FinalCase(alreadyCompleted) {
  const sealedStage = document.getElementById("sealedCaseStage");
  const revealedStage = document.getElementById("caseRevealedStage");
  const openConfidentialBtn = document.getElementById("btnOpenConfidential");
  const waxSeal = document.getElementById("packetWaxSeal");
  const letterStream = document.getElementById("letterProseStream");
  const continueBtn = document.getElementById("btnContinueLetter");
  const continueDock = document.getElementById("letterContinueDock");
  const caseClosedLockup = document.getElementById("caseClosedLockup");
  const completeDay8Btn = document.getElementById("btnCompleteDay8");

  if (alreadyCompleted) {
    if (sealedStage) sealedStage.style.display = "none";
    if (revealedStage) revealedStage.style.display = "block";
    if (letterStream) {
      letterStream.innerHTML = "";
      day8LetterData.paragraphs.forEach((p, idx) => {
        const line = document.createElement("p");
        line.className = "letter-typed-line" + (idx === day8LetterData.paragraphs.length - 1 ? " letter-signoff" : "");
        line.textContent = p;
        letterStream.appendChild(line);
      });
    }
    if (continueDock) continueDock.style.display = "none";
    if (caseClosedLockup) caseClosedLockup.style.display = "block";
    return;
  }

  function handleOpenSecretFile() {
    if (hasOpenedFinalCase) return;
    hasOpenedFinalCase = true;

    playSynthTone(587, 0.2);
    setTimeout(() => playSynthTone(880, 0.4), 160);

    if (sealedStage) {
      sealedStage.style.opacity = "0";
      sealedStage.style.transition = "opacity 0.6s ease";
      setTimeout(() => {
        sealedStage.style.display = "none";
        if (revealedStage) {
          revealedStage.style.display = "block";
          revealedStage.scrollIntoView({ behavior: "smooth", block: "start" });
          revealNextLetterParagraph();
        }
      }, 600);
    }
  }

  if (openConfidentialBtn) openConfidentialBtn.addEventListener("click", handleOpenSecretFile);
  if (waxSeal) waxSeal.addEventListener("click", handleOpenSecretFile);

  function revealNextLetterParagraph() {
    if (!letterStream) return;

    if (currentLetterParagraph < day8LetterData.paragraphs.length) {
      const pText = day8LetterData.paragraphs[currentLetterParagraph];
      const isSignoff = currentLetterParagraph === day8LetterData.paragraphs.length - 1;

      const pEl = document.createElement("p");
      pEl.className = "letter-typed-line" + (isSignoff ? " letter-signoff" : "");
      pEl.textContent = pText;
      letterStream.appendChild(pEl);

      playSynthTone(400 + currentLetterParagraph * 80, 0.08, "triangle");

      currentLetterParagraph++;

      if (currentLetterParagraph >= day8LetterData.paragraphs.length) {
        isLetterFullyRead = true;
        if (continueDock) continueDock.style.display = "none";
        if (caseClosedLockup) caseClosedLockup.style.display = "block";
      }
    }
  }

  if (continueBtn) continueBtn.addEventListener("click", revealNextLetterParagraph);

  if (completeDay8Btn) {
    completeDay8Btn.addEventListener("click", () => {
      checkDay8Completion();
    });
  }
}

/**
 * Completion Criteria & View
 */
function checkDay8Completion() {
  if (
    isRhythmLockSolved &&
    inspectedEvidenceSet.size >= 3 &&
    isWiretapSolved &&
    isYarnSolved &&
    isCryptexUnlocked &&
    hasOpenedFinalCase &&
    isLetterFullyRead
  ) {
    isDay8Completed = true;
    try {
      localStorage.setItem("budduu_day8_completed", "true");
    } catch (e) {}
    renderCompletionView();
  }
}

function renderCompletionView() {
  const completionScreen = document.getElementById("day8CompletionScreen");
  if (completionScreen) {
    completionScreen.style.display = "block";
    setTimeout(() => {
      completionScreen.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
  }
}

/**
 * Navigation Guard for Day 9
 */
function initNextDayNavigation() {
  const navNextBtn = document.getElementById("navNextDayBtn");
  const compDay9Btn = document.getElementById("completionDay9Btn");

  const handleNextClick = (e) => {
    const day9Data = (typeof JOURNEY_DAYS !== "undefined")
      ? JOURNEY_DAYS.find((d) => d.day === 9)
      : null;

    if (day9Data && typeof isDateUnlocked === "function" && !isDateUnlocked(day9Data.dateStr)) {
      e.preventDefault();
      if (typeof showLockModal === "function") showLockModal(day9Data);
    }
  };

  if (navNextBtn) navNextBtn.addEventListener("click", handleNextClick);
  if (compDay9Btn) compDay9Btn.addEventListener("click", handleNextClick);
}
