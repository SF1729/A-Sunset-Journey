/* ==========================================================================
   BUDDUU — DAY 8: “THE FRIENDSHIP FILES — CASE NO. 008”
   Gate 1 (Date Lock) → Gate 2 (Rhythm Tap Lock 🎵) → 3 Core Experiences → Complete
   ========================================================================== */

/**
 * ==========================================================================
 * 1. EDITABLE EVIDENCE, PUZZLE DATA & PERSONAL LETTER
 * ==========================================================================
 */

// Experience 1: The Evidence Room Items
const evidenceData = {
  A: {
    tag: "EVIDENCE FILE A // THE PHOTOGRAPH",
    headline: "The Unplanned Snapshot 📷",
    body: "An ordinary photograph taken without posing or preparation. When examined closely through the magnifying lens, a hidden handwritten annotation appears on the back: 'We laughed so hard here that we completely forgot whatever we were stressed about.'",
    clue: "Clue #1: Every laugh started unscripted."
  },
  B: {
    tag: "EVIDENCE FILE B // THE CLASSIFIED NOTE",
    headline: "Intercepted Memorandum 📜",
    body: "A folded memorandum found tucked between old notebook pages. It reads: 'Subject Budduu has consistently proven to be a reliable source of peace, even on the most chaotic days. Distance, time gaps, or silence never changed that.'",
    clue: "Clue #2: No silence or distance ever broke it."
  },
  C: {
    tag: "EVIDENCE FILE C // THE MYSTERIOUS OBJECT",
    headline: "The Cipher Key 🗝️",
    body: "A heavy brass key bearing a tiny stamped inscription. The engraving translates to: 'A friendship built on honesty doesn't come with an expiration date. It's meant to outlast the years.'",
    clue: "Clue #3: The bond has no expiration date."
  }
};

// Experience 2: Deduction Puzzle Data
const deductionPuzzleData = {
  question: "What single truth is proven by all three pieces of evidence?",
  options: [
    { text: "A. It was just a lucky coincidence.", correct: false },
    { text: "B. UNBREAKABLE BOND: Built to last forever.", correct: true },
    { text: "C. It was an unsolved mystery.", correct: false },
    { text: "D. Time changes everything eventually.", correct: false }
  ],
  correctKeyword: "UNBREAKABLE BOND",
  hint: "Look for the answer that proves this friendship has no expiration date."
};

// Experience 3: The Personal Letter (Editable)
const day8LetterData = {
  paragraphs: [
    "Dear Budduu,",
    "Some friendships make ordinary days feel a little more special. The random conversations, the laughter, the unexpected moments, and all the little things we never plan become memories we carry with us.",
    "I hope there are many more moments waiting for us — more laughter, more stories, and more reasons to look back and smile.",
    "No matter how much life changes, I hope we keep finding new reasons to laugh, new memories to collect, and new stories to tell.",
    "Thank you for being a part of my life.",
    "— Tera Tedduu, Shahid 🧡"
  ]
};

/**
 * ==========================================================================
 * 2. RHYTHM LOCK TIMING PATTERN SPECIFICATION
 * ==========================================================================
 * Deterministic 5-beat rhythm:
 * Beat 1 at 0ms
 * Beat 2 at 350ms   (interval 1: 350ms - short)
 * Beat 3 at 1050ms  (interval 2: 700ms - long)
 * Beat 4 at 1400ms  (interval 3: 350ms - short)
 * Beat 5 at 2100ms  (interval 4: 700ms - long)
 * Target intervals: [350, 700, 350, 700]
 */
const targetBeatsCount = 5;
const demoBeatTimings = [0, 350, 1050, 1400, 2100]; // in ms
const targetIntervals = [350, 700, 350, 700];
const totalDemoDuration = 2100;

// Relative interval fractions for tempo-independent validation:
// 350/2100 = 0.1667, 700/2100 = 0.3333, etc.
const targetFractions = targetIntervals.map(dt => dt / totalDemoDuration);
const fractionTolerance = 0.11; // Generous human timing tolerance

let isRhythmDemoPlaying = false;
let userTapTimestamps = [];
let audioCtx = null;

// Progress Tracking States
let isRhythmLockSolved = false;
let collectedEvidenceSet = new Set();
let isCluesPuzzleSolved = false;
let hasOpenedFinalCase = false;
let currentLetterParagraph = 0;
let isLetterFullyRead = false;
let isDay8Completed = false;

document.addEventListener("DOMContentLoaded", () => {
  initDay8Flow();
});

/**
 * Main Flow Controller: Gate 1 (Date Lock) → Gate 2 (Rhythm Lock) → Experiences
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

  // Date passed: hide Gate 1
  if (dateLockedView) dateLockedView.style.display = "none";

  // Check persistent storage
  try {
    if (localStorage.getItem("budduu_day8_lock_solved") === "true") {
      isRhythmLockSolved = true;
    }
    if (localStorage.getItem("budduu_day8_completed") === "true") {
      isRhythmLockSolved = true;
      collectedEvidenceSet = new Set(["A", "B", "C"]);
      isCluesPuzzleSolved = true;
      hasOpenedFinalCase = true;
      isLetterFullyRead = true;
      isDay8Completed = true;
    }
  } catch (err) {}

  initDay8AmbientParticles();
  initNextDayNavigation();

  // GATE 2: Rhythm Tap Lock
  if (!isRhythmLockSolved) {
    if (rhythmLockView) rhythmLockView.style.display = "flex";
    if (unlockedView) unlockedView.style.display = "none";
    initRhythmTapLock();
    return;
  }

  // BOTH GATES PASSED: Launch Actual Day 8 Content
  launchActualDay8Content();
}

/**
 * Ambient Amber Dust Particles Canvas
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

  const count = window.innerWidth <= 768 ? 20 : 38;
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
 * Web Audio API synthesizer for acoustic beats (graceful fallback)
 */
function playSynthBeep(freq = 580, duration = 0.12) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

/**
 * ==========================================================================
 * GATE 2: RHYTHM TAP LOCK CONTROLLER
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

  // Demonstration Playback
  function playDemoRhythm() {
    if (isRhythmDemoPlaying) return;
    isRhythmDemoPlaying = true;
    userTapTimestamps = [];
    updateUserTapUI(0);

    if (listenBtn) listenBtn.disabled = true;
    if (tapPad) tapPad.disabled = true;
    if (waveform) waveform.classList.add("is-playing");
    if (statusLabel) statusLabel.textContent = "PLAYING DEMONSTRATION... LISTEN CLOSELY";
    if (feedback) feedback.textContent = "";

    // Clear LEDs
    leds.forEach(led => {
      if (led) {
        led.classList.remove("beat-flash", "beat-filled");
      }
    });

    demoBeatTimings.forEach((timing, index) => {
      setTimeout(() => {
        playSynthBeep(index === targetBeatsCount - 1 ? 720 : 560, 0.14);
        if (leds[index]) {
          leds[index].classList.add("beat-flash");
          setTimeout(() => {
            leds[index].classList.remove("beat-flash");
          }, 240);
        }
      }, timing);
    });

    // End of playback
    setTimeout(() => {
      isRhythmDemoPlaying = false;
      if (listenBtn) {
        listenBtn.disabled = false;
        listenBtn.querySelector("span").textContent = "REPLAY RHYTHM";
      }
      if (tapPad) tapPad.disabled = false;
      if (waveform) waveform.classList.remove("is-playing");
      if (statusLabel) statusLabel.textContent = "YOUR TURN: REPEAT THE RHYTHM (5 BEATS)";
    }, totalDemoDuration + 400);
  }

  if (listenBtn) {
    listenBtn.addEventListener("click", playDemoRhythm);
  }

  // User Tap Handler
  function handleUserTap() {
    if (isRhythmDemoPlaying || isRhythmLockSolved) return;

    // Trigger synth beep on user tap
    playSynthBeep(640, 0.08);

    const now = performance.now();
    userTapTimestamps.push(now);
    const tapCount = userTapTimestamps.length;

    // Tap Visual Feedback
    if (tapPad) {
      tapPad.classList.add("active-press");
      setTimeout(() => tapPad.classList.remove("active-press"), 140);
    }

    // Flash corresponding LED
    const currentIndex = tapCount - 1;
    if (leds[currentIndex]) {
      leds[currentIndex].classList.add("beat-filled");
    }

    updateUserTapUI(tapCount);

    if (tapCount === targetBeatsCount) {
      validateUserRhythm();
    }
  }

  function updateUserTapUI(count) {
    if (progressCaption) {
      progressCaption.textContent = `${count} / ${targetBeatsCount} BEATS`;
    }
  }

  function validateUserRhythm() {
    if (tapPad) tapPad.disabled = true;

    // Calculate user intervals
    const userIntervals = [];
    for (let i = 1; i < userTapTimestamps.length; i++) {
      userIntervals.push(userTapTimestamps[i] - userTapTimestamps[i - 1]);
    }

    const userTotalDuration = userIntervals.reduce((a, b) => a + b, 0);

    // Sanity check total duration (between 1.0s and 5.0s)
    let isPatternMatched = true;

    if (userTotalDuration < 1000 || userTotalDuration > 5000) {
      isPatternMatched = false;
    } else {
      // Relative fraction comparison:
      for (let i = 0; i < userIntervals.length; i++) {
        const userFraction = userIntervals[i] / userTotalDuration;
        const targetFraction = targetFractions[i];
        if (Math.abs(userFraction - targetFraction) > fractionTolerance) {
          isPatternMatched = false;
          break;
        }
      }
    }

    if (isPatternMatched) {
      // SUCCESS!
      isRhythmLockSolved = true;
      try {
        localStorage.setItem("budduu_day8_lock_solved", "true");
      } catch (e) {}

      leds.forEach(led => led && led.classList.add("beat-flash"));
      if (statusLabel) statusLabel.textContent = "ACCESS GRANTED • FREQUENCY VERIFIED";
      if (feedback) feedback.textContent = "";

      setTimeout(() => {
        if (successOverlay) successOverlay.style.display = "flex";
      }, 500);

    } else {
      // MISMATCH
      if (feedback) {
        feedback.textContent = "Rhythm mismatch. Listen again and follow the gaps between the beats.";
      }
      if (statusLabel) statusLabel.textContent = "MISMATCH • TAP 'REPLAY RHYTHM' OR TRY AGAIN";

      setTimeout(() => {
        userTapTimestamps = [];
        updateUserTapUI(0);
        leds.forEach(led => {
          if (led) led.classList.remove("beat-filled", "beat-flash");
        });
        if (tapPad) tapPad.disabled = false;
      }, 900);
    }
  }

  // Tap Pad interaction (mouse, touch & keyboard space/enter)
  if (tapPad) {
    tapPad.addEventListener("click", handleUserTap);
    tapPad.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleUserTap();
      }
    });
  }

  // Transition to Experience 1
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
 * LAUNCH ACTUAL DAY 8 CONTENT
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
  initExperience1EvidenceRoom(alreadyCompleted);
  initExperience2ConnectClues(alreadyCompleted);
  initExperience3FinalCase(alreadyCompleted);

  if (alreadyCompleted) {
    renderCompletionView();
  }
}

/**
 * ==========================================================================
 * INVESTIGATION BRIEFING INTRO
 * ==========================================================================
 */
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
        }, 800);
      }
    });
  }
}

/**
 * ==========================================================================
 * EXPERIENCE 1: THE EVIDENCE ROOM (INSPECTION DRAWER)
 * ==========================================================================
 */
function initExperience1EvidenceRoom(alreadyCompleted) {
  const evidenceCards = document.querySelectorAll(".evidence-pin-card");
  const counterBadge = document.getElementById("evidenceCounterBadge");
  const overlay = document.getElementById("inspectionOverlay");
  const modalTag = document.getElementById("modalEvidenceTag");
  const modalHeadline = document.getElementById("modalEvidenceHeadline");
  const modalBody = document.getElementById("modalEvidenceBody");
  const modalClueText = document.getElementById("modalClueText");
  const closeBtn = document.getElementById("closeInspectionBtn");
  const completionGate = document.getElementById("evidenceCompletionGate");
  const btnGoToConnect = document.getElementById("btnGoToConnectClues");
  const connectCluesSection = document.getElementById("connectCluesSection");

  if (alreadyCompleted) {
    evidenceCards.forEach(card => card.classList.add("is-collected"));
    document.getElementById("statusPillA").textContent = "COLLECTED ✓";
    document.getElementById("statusPillB").textContent = "COLLECTED ✓";
    document.getElementById("statusPillC").textContent = "COLLECTED ✓";
    if (counterBadge) counterBadge.textContent = "EVIDENCE COLLECTED: 3 / 3";
    if (completionGate) completionGate.style.display = "block";
    if (connectCluesSection) connectCluesSection.style.display = "block";
    return;
  }

  function updateEvidenceUI() {
    if (counterBadge) {
      counterBadge.textContent = `EVIDENCE COLLECTED: ${collectedEvidenceSet.size} / 3`;
    }

    if (collectedEvidenceSet.size === 3 && completionGate) {
      completionGate.style.display = "block";
      completionGate.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  evidenceCards.forEach((card) => {
    const key = card.dataset.evidence; // 'A', 'B', 'C'

    const handleInspect = () => {
      const data = evidenceData[key];
      if (!data) return;

      collectedEvidenceSet.add(key);
      card.classList.add("is-collected");

      // Update Card Status Pill
      const pill = document.getElementById(`statusPill${key}`);
      if (pill) pill.textContent = "COLLECTED ✓";

      // Populate Inspection Modal
      if (modalTag) modalTag.textContent = data.tag;
      if (modalHeadline) modalHeadline.textContent = data.headline;
      if (modalBody) modalBody.innerHTML = `<p>${data.body}</p>`;
      if (modalClueText) modalClueText.textContent = data.clue;

      if (overlay) overlay.style.display = "flex";
      updateEvidenceUI();
    };

    card.addEventListener("click", handleInspect);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleInspect();
      }
    });
  });

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }

  if (btnGoToConnect && connectCluesSection) {
    btnGoToConnect.addEventListener("click", () => {
      connectCluesSection.style.display = "block";
      connectCluesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

/**
 * ==========================================================================
 * EXPERIENCE 2: CONNECT THE CLUES
 * ==========================================================================
 */
function initExperience2ConnectClues(alreadyCompleted) {
  const board = document.getElementById("clueConnectionBoard");
  const optionsGrid = document.getElementById("deductionOptionsGrid");
  const feedback = document.getElementById("cluesPuzzleFeedback");
  const hintDock = document.getElementById("cluesHintDock");
  const hintBtn = document.getElementById("requestClueHintBtn");
  const hintText = document.getElementById("clueHintText");
  const solvedBanner = document.getElementById("cluesSolvedBanner");
  const btnUnlockFinal = document.getElementById("btnUnlockFinalFile");
  const finalCaseSection = document.getElementById("finalCaseFileSection");

  let wrongDeductionAttempts = 0;

  if (alreadyCompleted) {
    if (board) board.classList.add("is-connected");
    if (solvedBanner) solvedBanner.style.display = "block";
    if (finalCaseSection) finalCaseSection.style.display = "block";
    return;
  }

  // Populate Deduction Options
  if (optionsGrid) {
    optionsGrid.innerHTML = "";
    deductionPuzzleData.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "deduction-chip-btn";
      btn.textContent = opt.text;

      btn.addEventListener("click", () => {
        if (isCluesPuzzleSolved) return;

        if (opt.correct) {
          isCluesPuzzleSolved = true;
          btn.classList.add("is-correct");
          if (board) board.classList.add("is-connected");
          if (feedback) feedback.textContent = "";

          // Disable options
          optionsGrid.querySelectorAll("button").forEach(b => b.disabled = true);

          if (solvedBanner) {
            solvedBanner.style.display = "block";
            solvedBanner.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          wrongDeductionAttempts++;
          btn.classList.add("is-wrong");
          setTimeout(() => btn.classList.remove("is-wrong"), 500);

          if (feedback) {
            feedback.textContent = "The clues don't point to that. Review all three evidence cards.";
          }

          if (wrongDeductionAttempts >= 2 && hintDock) {
            hintDock.style.display = "block";
          }
        }
      });

      optionsGrid.appendChild(btn);
    });
  }

  if (hintBtn && hintText) {
    hintBtn.addEventListener("click", () => {
      hintBtn.style.display = "none";
      hintText.style.display = "block";
    });
  }

  if (btnUnlockFinal && finalCaseSection) {
    btnUnlockFinal.addEventListener("click", () => {
      finalCaseSection.style.display = "block";
      finalCaseSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

/**
 * ==========================================================================
 * EXPERIENCE 3: THE FINAL CASE FILE & PERSONAL LETTER
 * ==========================================================================
 */
function initExperience3FinalCase(alreadyCompleted) {
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

  // Open Confidential File (Stage A -> Stage B)
  function handleOpenSecretFile() {
    if (hasOpenedFinalCase) return;
    hasOpenedFinalCase = true;

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

  // Staged Progressive Letter Line Reveal
  function revealNextLetterParagraph() {
    if (!letterStream) return;

    if (currentLetterParagraph < day8LetterData.paragraphs.length) {
      const pText = day8LetterData.paragraphs[currentLetterParagraph];
      const isSignoff = currentLetterParagraph === day8LetterData.paragraphs.length - 1;

      const pEl = document.createElement("p");
      pEl.className = "letter-typed-line" + (isSignoff ? " letter-signoff" : "");
      pEl.textContent = pText;
      letterStream.appendChild(pEl);

      currentLetterParagraph++;

      if (currentLetterParagraph >= day8LetterData.paragraphs.length) {
        isLetterFullyRead = true;
        if (continueDock) continueDock.style.display = "none";
        if (caseClosedLockup) caseClosedLockup.style.display = "block";
      }
    }
  }

  if (continueBtn) {
    continueBtn.addEventListener("click", revealNextLetterParagraph);
  }

  if (completeDay8Btn) {
    completeDay8Btn.addEventListener("click", () => {
      checkDay8Completion();
    });
  }
}

/**
 * ==========================================================================
 * DAY 8 COMPLETION CRITERIA & COMPLETION SCREEN RENDER
 * ==========================================================================
 */
function checkDay8Completion() {
  if (
    isRhythmLockSolved &&
    collectedEvidenceSet.size >= 3 &&
    isCluesPuzzleSolved &&
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
    }, 450);
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