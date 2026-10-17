/* ==========================================================================
   BUDDUU — DAY 1: “THE BEGINNING”
   Multi-Gate Architecture:
   Gate 1 (Date Lock) → Gate 2 (Game Lock: MEMORY) → 3 Day 1 Experiences → Complete
   ========================================================================== */

// Tracking variables for Day 1 state
let isGameSolved = false;
let hasWatchedIntro = false;
let hasOpenedEnvelope = false;
let hasRevealedSecret = false;
let incorrectAttempts = 0;
let currentClueStep = 1;

document.addEventListener("DOMContentLoaded", () => {
  initDay1Flow();
});

/**
 * Main Controller: Orchestrates Date Lock, Game Lock, and Experience Layers
 */
function initDay1Flow() {
  const day1Data = JOURNEY_DAYS.find((d) => d.day === 1);
  if (!day1Data) return;

  const dateLockedView = document.getElementById("day1DateLockedView");
  const gameLockedView = document.getElementById("day1GameLockedView");
  const unlockedView = document.getElementById("day1UnlockedView");

  // GATE 1: Check Date Lock (Unlocks on 2026-10-20)
  const isDateReady = isDateUnlocked(day1Data.dateStr);

  if (!isDateReady) {
    // Show Date Lock Screen
    if (dateLockedView) dateLockedView.style.display = "flex";
    if (gameLockedView) gameLockedView.style.display = "none";
    if (unlockedView) unlockedView.style.display = "none";

    const daysRemaining = getDaysUntil(day1Data.dateStr);
    const countdownEl = document.getElementById("dateLockCountdown");
    if (countdownEl) {
      countdownEl.textContent = daysRemaining > 0 
        ? `Unlocks in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} (20 October 2026)`
        : "Unlocks on 20 October 2026";
    }
    return;
  }

  // Hide Gate 1 because date has arrived
  if (dateLockedView) dateLockedView.style.display = "none";

  // Check persistent storage for Gate 2 and completion
  try {
    if (localStorage.getItem("budduu_day1_lock_solved") === "true") {
      isGameSolved = true;
    }
    if (localStorage.getItem("budduu_day1_completed") === "true") {
      isGameSolved = true;
      hasWatchedIntro = true;
      hasOpenedEnvelope = true;
      hasRevealedSecret = true;
    }
  } catch (err) {
    // Storage access fallback
  }

  initDay1AmbientParticles();
  initNextDayNavigation();

  // GATE 2: Game Lock (Active until puzzle is solved)
  if (!isGameSolved) {
    if (gameLockedView) gameLockedView.style.display = "flex";
    if (unlockedView) unlockedView.style.display = "none";
    initGameLockPuzzle();
    return;
  }

  // BOTH GATES PASSED: Launch Actual Day 1 Experiences
  launchActualDay1Content();
}

/**
 * Ambient Sunset Particle Canvas
 */
function initDay1AmbientParticles() {
  const canvas = document.getElementById("day1ParticlesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const count = window.innerWidth <= 768 ? 22 : 48;
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * Math.PI
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speed;
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      p.pulse += 0.02;
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
 * GATE 2: Mystery Puzzle Interaction ("MEMORY")
 */
function initGameLockPuzzle() {
  const revealBtn = document.getElementById("revealNextClueBtn");
  const clueActionsWrap = document.getElementById("clueActionsWrap");
  const clue2 = document.getElementById("clueCard2");
  const clue3 = document.getElementById("clueCard3");
  const choicesPanel = document.getElementById("puzzleChoicesPanel");
  const choiceChips = document.querySelectorAll(".choice-chip");
  const feedbackToast = document.getElementById("puzzleFeedbackToast");
  const hintWrapper = document.getElementById("puzzleHintWrapper");
  const requestHintBtn = document.getElementById("requestHintBtn");
  const hintMessageBox = document.getElementById("hintMessageBox");
  const successOverlay = document.getElementById("puzzleSuccessOverlay");
  const gameCard = document.querySelector(".game-puzzle-card");

  if (!revealBtn) return;

  // Progressive Clue Reveals
  revealBtn.addEventListener("click", () => {
    if (currentClueStep === 1) {
      currentClueStep = 2;
      clue2.style.display = "block";
      setTimeout(() => clue2.classList.add("is-visible"), 40);
      revealBtn.querySelector("span").textContent = "REVEAL FINAL CLUE";
    } else if (currentClueStep === 2) {
      currentClueStep = 3;
      clue3.style.display = "block";
      setTimeout(() => clue3.classList.add("is-visible"), 40);
      clueActionsWrap.style.display = "none";
      choicesPanel.style.display = "block";
      choicesPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  // Optional Hint handler
  if (requestHintBtn) {
    requestHintBtn.addEventListener("click", () => {
      requestHintBtn.style.display = "none";
      hintMessageBox.style.display = "inline-flex";
    });
  }

  // Answer Choices Evaluation
  choiceChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const selected = chip.dataset.answer;

      if (selected === "MEMORY") {
        // CORRECT ANSWER
        isGameSolved = true;
        try {
          localStorage.setItem("budduu_day1_lock_solved", "true");
        } catch (e) {}

        feedbackToast.textContent = "";
        successOverlay.style.display = "flex";

        setTimeout(() => {
          document.getElementById("day1GameLockedView").style.display = "none";
          launchActualDay1Content();
        }, 2100);

      } else {
        // INCORRECT ANSWER
        incorrectAttempts++;

        // Trigger gentle shake animation
        if (gameCard) {
          gameCard.classList.remove("shake");
          void gameCard.offsetWidth; // reflow
          gameCard.classList.add("shake");
        }

        feedbackToast.textContent = "Not quite... think about what remains even after the moment is gone. 👀";

        if (incorrectAttempts >= 2 && hintWrapper) {
          hintWrapper.style.display = "block";
        }
      }
    });
  });
}

/**
 * Launches the 3 Original Day 1 Experiences in order
 */
function launchActualDay1Content() {
  const unlockedView = document.getElementById("day1UnlockedView");
  if (unlockedView) unlockedView.style.display = "block";

  // Check if previously completed
  let alreadyCompleted = false;
  try {
    alreadyCompleted = localStorage.getItem("budduu_day1_completed") === "true";
  } catch (e) {}

  initExperience1CinematicOpening(alreadyCompleted);
  initExperience2Envelope(alreadyCompleted);
  initExperience3HiddenMessage(alreadyCompleted);

  if (alreadyCompleted) {
    renderCompletionView();
  }
}

/**
 * EXPERIENCE 1: Fullscreen 5-7 Second Cinematic Sunset Opening
 */
function initExperience1CinematicOpening(skipIntro) {
  const introStage = document.getElementById("cinematicIntro");
  const mainStage = document.getElementById("mainDay1Content");
  const skipBtn = document.getElementById("skipIntroBtn");

  const line1 = document.getElementById("introLine1");
  const line2 = document.getElementById("introLine2");
  const line3 = document.getElementById("introLine3");
  const line4 = document.getElementById("introLine4");

  let isDismissed = false;

  function endIntro() {
    if (isDismissed) return;
    isDismissed = true;
    hasWatchedIntro = true;

    if (introStage) {
      introStage.classList.add("fade-out");
      setTimeout(() => {
        introStage.style.display = "none";
      }, 1200);
    }

    if (mainStage) {
      mainStage.classList.add("visible");
    }

    evaluateDay1Completion();
  }

  if (skipIntro) {
    if (introStage) introStage.style.display = "none";
    if (mainStage) mainStage.classList.add("visible");
    hasWatchedIntro = true;
    return;
  }

  if (skipBtn) skipBtn.addEventListener("click", endIntro);

  // Progressive Sequential Timeline
  setTimeout(() => { if (!isDismissed && line1) line1.classList.add("active"); }, 700);
  setTimeout(() => {
    if (!isDismissed && line1) line1.classList.remove("active");
    if (!isDismissed && line2) line2.classList.add("active");
  }, 2300);
  setTimeout(() => {
    if (!isDismissed && line2) line2.classList.remove("active");
    if (!isDismissed && line3) line3.classList.add("active");
  }, 3800);
  setTimeout(() => {
    if (!isDismissed && line3) line3.classList.remove("active");
    if (!isDismissed && line4) line4.classList.add("active");
  }, 5100);

  setTimeout(() => { endIntro(); }, 6600);
}

/**
 * EXPERIENCE 2: Interactive Tactile Envelope & Letter
 */
function initExperience2Envelope(alreadyCompleted) {
  const envelope = document.getElementById("interactiveEnvelope");
  const hintText = document.getElementById("envelopeHintText");
  const letterBlocks = document.querySelectorAll(".letter-block");
  const personalTouch = document.getElementById("personalTouchSection");

  if (!envelope) return;

  function openEnvelope() {
    if (hasOpenedEnvelope) return;
    hasOpenedEnvelope = true;

    envelope.classList.add("opened");
    envelope.setAttribute("aria-expanded", "true");

    if (hintText) {
      hintText.textContent = "A sunset letter penned for Budduu 🌅";
      hintText.style.color = "var(--color-coral)";
    }

    letterBlocks.forEach((block, idx) => {
      setTimeout(() => {
        block.classList.add("revealed");
      }, 700 + idx * 280);
    });

    const revealTeaserDelay = 700 + letterBlocks.length * 280 + 350;
    setTimeout(() => {
      if (personalTouch) {
        personalTouch.style.display = "block";
        personalTouch.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      evaluateDay1Completion();
    }, revealTeaserDelay);
  }

  if (alreadyCompleted) {
    envelope.classList.add("opened");
    envelope.setAttribute("aria-expanded", "true");
    letterBlocks.forEach((block) => block.classList.add("revealed"));
    if (personalTouch) personalTouch.style.display = "block";
    hasOpenedEnvelope = true;
    return;
  }

  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });
}

/**
 * EXPERIENCE 3: Hidden Message Teaser
 */
function initExperience3HiddenMessage(alreadyCompleted) {
  const revealBtn = document.getElementById("revealHiddenBtn");
  const secretCard = document.getElementById("hiddenSecretCard");

  if (!revealBtn || !secretCard) return;

  if (alreadyCompleted) {
    revealBtn.style.display = "none";
    secretCard.style.display = "block";
    hasRevealedSecret = true;
    return;
  }

  revealBtn.addEventListener("click", () => {
    revealBtn.style.display = "none";
    secretCard.style.display = "block";
    hasRevealedSecret = true;
    evaluateDay1Completion();
  });
}

/**
 * Evaluates completion conditions:
 * 1. Game Solved
 * 2. Cinematic Opening completed
 * 3. Envelope Opened
 * 4. Hidden Message Revealed
 */
function evaluateDay1Completion() {
  if (isGameSolved && hasWatchedIntro && hasOpenedEnvelope && hasRevealedSecret) {
    try {
      localStorage.setItem("budduu_day1_completed", "true");
    } catch (e) {}

    renderCompletionView();
  }
}

function renderCompletionView() {
  const completionSection = document.getElementById("completionSection");
  if (completionSection) {
    completionSection.style.display = "block";
    setTimeout(() => {
      completionSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 450);
  }
}

/**
 * Navigation guard respecting global date lock for Day 2
 */
function initNextDayNavigation() {
  const navNextBtn = document.getElementById("navNextDayBtn");
  const compNextBtn = document.getElementById("completionNextDayBtn");

  const handleNextClick = (e) => {
    const day2Data = JOURNEY_DAYS.find((d) => d.day === 2);
    if (day2Data && !isDateUnlocked(day2Data.dateStr)) {
      e.preventDefault();
      showLockModal(day2Data);
    }
  };

  if (navNextBtn) navNextBtn.addEventListener("click", handleNextClick);
  if (compNextBtn) compNextBtn.addEventListener("click", handleNextClick);
}