/* ==========================================================================
   BUDDUU — DAY 1: “THE BEGINNING” (Enhanced Controller & Audio Engine)
   ========================================================================== */

let isGameSolved = false;
let hasWatchedIntro = false;
let hasOpenedEnvelope = false;
let hasRevealedSecret = false;
let incorrectAttempts = 0;
let currentClueStep = 1;
let soundEnabled = true;

// Web Audio API Synthesizer (Zero asset dependencies)
let audioCtx = null;
function playSynthesizedSound(type) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    if (type === "pop") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "chime") {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } else if (type === "error") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.2);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    // Audio context fallback
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initSoundToggle();
  initDay1Flow();
});

function initSoundToggle() {
  const btn = document.getElementById("soundToggleBtn");
  const icon = document.getElementById("soundIcon");
  if (!btn || !icon) return;

  btn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    icon.textContent = soundEnabled ? "🔊" : "🔇";
  });
}

/**
 * Main Controller: Orchestrates Date Lock, Game Lock, and Experience Layers
 */
function initDay1Flow() {
  // ✅ FIXED: Set correctly to 20 October 2026
  const day1DateStr = "2026-10-16";
  const dateLockedView = document.getElementById("day1DateLockedView");
  const gameLockedView = document.getElementById("day1GameLockedView");
  const unlockedView = document.getElementById("day1UnlockedView");

  // Check Date Lock
  const isDateReady = typeof isDateUnlocked === "function" 
    ? isDateUnlocked(day1DateStr) 
    : new Date().getTime() >= new Date("2026-10-20T00:00:00+05:30").getTime();

  if (!isDateReady) {
    if (dateLockedView) dateLockedView.style.display = "flex";
    if (gameLockedView) gameLockedView.style.display = "none";
    if (unlockedView) unlockedView.style.display = "none";

    const daysRemaining = typeof getDaysUntil === "function" ? getDaysUntil(day1DateStr) : 3;
    const countdownEl = document.getElementById("dateLockCountdown");
    if (countdownEl) {
      countdownEl.textContent = daysRemaining > 0 
        ? `Unlocks in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} (20 October 2026)`
        : "Unlocks on 20 October 2026";
    }
    return;
  }

  if (dateLockedView) dateLockedView.style.display = "none";

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
  } catch (err) {}

  initDay1AmbientParticles();
  initNextDayNavigation();

  if (!isGameSolved) {
    if (gameLockedView) gameLockedView.style.display = "flex";
    if (unlockedView) unlockedView.style.display = "none";
    initGameLockPuzzle();
    return;
  }

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

  const count = window.innerWidth <= 768 ? 24 : 50;
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speed: Math.random() * 0.35 + 0.12,
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
 * Golden Sunset Confetti Fireworks
 */
function launchConfettiCelebration() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#ff416c", "#ff6b4a", "#ffb347", "#ffe082", "#ffffff"];
  const pieces = [];

  for (let i = 0; i < 75; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height * 0.65,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let frames = 0;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frames++;

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4;
      p.rotation += p.rotSpeed;
      if (frames > 40) p.opacity -= 0.02;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(p.opacity, 0);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (frames < 90) {
      requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  updateConfetti();
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

  revealBtn.addEventListener("click", () => {
    playSynthesizedSound("pop");
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

  if (requestHintBtn) {
    requestHintBtn.addEventListener("click", () => {
      playSynthesizedSound("pop");
      requestHintBtn.style.display = "none";
      hintMessageBox.style.display = "inline-flex";
    });
  }

  choiceChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const selected = chip.dataset.answer;

      if (selected === "MEMORY") {
        isGameSolved = true;
        playSynthesizedSound("chime");
        launchConfettiCelebration();

        try {
          localStorage.setItem("budduu_day1_lock_solved", "true");
        } catch (e) {}

        feedbackToast.textContent = "";
        successOverlay.style.display = "flex";

        setTimeout(() => {
          document.getElementById("day1GameLockedView").style.display = "none";
          launchActualDay1Content();
        }, 2200);

      } else {
        incorrectAttempts++;
        playSynthesizedSound("error");

        chip.classList.add("chip-error");
        setTimeout(() => chip.classList.remove("chip-error"), 500);

        if (gameCard) {
          gameCard.classList.remove("shake");
          void gameCard.offsetWidth;
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
 * Launches the 3 Day 1 Experiences
 */
function launchActualDay1Content() {
  const unlockedView = document.getElementById("day1UnlockedView");
  if (unlockedView) unlockedView.style.display = "block";

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
 * EXPERIENCE 1: Fullscreen Cinematic Sunset Opening
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

  setTimeout(() => { if (!isDismissed && line1) line1.classList.add("active"); }, 700);
  setTimeout(() => {
    if (!isDismissed && line1) line1.classList.remove("active");
    if (!isDismissed && line2) line2.classList.add("active");
  }, 2200);
  setTimeout(() => {
    if (!isDismissed && line2) line2.classList.remove("active");
    if (!isDismissed && line3) line3.classList.add("active");
  }, 3700);
  setTimeout(() => {
    if (!isDismissed && line3) line3.classList.remove("active");
    if (!isDismissed && line4) line4.classList.add("active");
  }, 5000);

  setTimeout(() => { endIntro(); }, 6600);
}

/**
 * EXPERIENCE 2: Envelope Click -> Letter Reveals (Clean & Smooth)
 */
/**
 * EXPERIENCE 2: Interactive Tactile Envelope & Letter (Full Open & Close Support)
 */
function initExperience2Envelope(alreadyCompleted) {
  const envelope = document.getElementById("interactiveEnvelope");
  const parchment = document.getElementById("parchmentContainer");
  const hintText = document.getElementById("envelopeHintText");
  const toggleBtn = document.getElementById("envelopeToggleBtn");
  const toggleText = document.getElementById("envelopeToggleText");
  const toggleIcon = document.getElementById("envelopeToggleIcon");
  const closeTopBtn = document.getElementById("letterCloseTopBtn");
  const closeBottomBtn = document.getElementById("letterCloseBottomBtn");
  const letterBlocks = document.querySelectorAll(".letter-block");
  const personalTouch = document.getElementById("personalTouchSection");

  if (!envelope || !parchment) return;

  let isLetterOpen = false;

  function openLetter() {
    isLetterOpen = true;
    hasOpenedEnvelope = true;

    envelope.classList.add("opened");
    envelope.setAttribute("aria-expanded", "true");

    if (toggleBtn) {
      toggleBtn.style.display = "inline-flex";
      toggleText.textContent = "LETTER BAND KAREIN (FOLD)";
      toggleIcon.textContent = "📁";
    }

    if (hintText) {
      hintText.textContent = "Letter khula hua hai. Band karne ke liye dobara tap karein 💛";
      hintText.style.color = "var(--color-gold, #ffb347)";
    }

    playSynthesizedSound("chime");
    if (!alreadyCompleted) {
      launchConfettiCelebration();
    }

    parchment.classList.add("is-open");

    // Smooth reveal of blocks
    letterBlocks.forEach((block) => block.classList.add("revealed"));

    setTimeout(() => {
      parchment.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);

    // Show Next teaser after reading starts
    if (personalTouch) {
      personalTouch.style.display = "block";
    }
    evaluateDay1Completion();
  }

  function closeLetter() {
    isLetterOpen = false;

    envelope.classList.remove("opened");
    envelope.setAttribute("aria-expanded", "false");

    parchment.classList.remove("is-open");

    if (toggleBtn) {
      toggleText.textContent = "LETTER DOBARA KHOLEN (OPEN)";
      toggleIcon.textContent = "💌";
    }

    if (hintText) {
      hintText.textContent = "Letter wapas envelope me rakh diya gaya hai. Padhne ke liye tap karein 🌅";
      hintText.style.color = "var(--color-coral, #ff6b4a)";
    }

    playSynthesizedSound("pop");

    setTimeout(() => {
      envelope.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  }

  function toggleLetter() {
    if (!isLetterOpen) {
      openLetter();
    } else {
      closeLetter();
    }
  }

  // Envelope Click / Tap
  envelope.addEventListener("click", toggleLetter);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleLetter();
    }
  });

  // Dedicated Close / Toggle Buttons
  if (toggleBtn) toggleBtn.addEventListener("click", toggleLetter);
  if (closeTopBtn) closeTopBtn.addEventListener("click", closeLetter);
  if (closeBottomBtn) closeBottomBtn.addEventListener("click", closeLetter);

  // If already completed in previous session, show toggle button ready
  if (alreadyCompleted) {
    hasOpenedEnvelope = true;
    openLetter();
  }
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
    playSynthesizedSound("chime");
    launchConfettiCelebration();
    revealBtn.style.display = "none";
    secretCard.style.display = "block";
    hasRevealedSecret = true;
    evaluateDay1Completion();
  });
}

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

function initNextDayNavigation() {
  const navNextBtn = document.getElementById("navNextDayBtn");
  const compNextBtn = document.getElementById("completionNextDayBtn");

  const handleNextClick = (e) => {
    if (typeof isDateUnlocked === "function" && !isDateUnlocked("2026-10-21")) {
      e.preventDefault();
      if (typeof showLockModal === "function") {
        showLockModal({ day: 2, dateStr: "2026-10-21", dateDisplay: "21 Oct" });
      } else {
        alert("Day 2 unlocks on 21 October 2026! 🌅");
      }
    }
  };

  if (navNextBtn) navNextBtn.addEventListener("click", handleNextClick);
  if (compNextBtn) compNextBtn.addEventListener("click", handleNextClick);
}
