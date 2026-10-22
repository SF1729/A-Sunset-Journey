/* ==========================================================================
   BUDDUU — DAY 5: “THE STORY WE NEVER PLANNED”
   High-Polish Sequential Controller (Streamlined 4-Step Journey)
   ========================================================================== */

const DAY5_CONFIG = {
  day: 5,
  dateStr: "2026-10-24",
  storageKeys: {
    lockSolved: "budduu_day5_lock_solved",
    step: "budduu_day5_step",
    completed: "budduu_day5_completed",
    storybook: "budduu_day5_storybook_state",
    detours: "budduu_day5_detours_state",
    scrapbook: "budduu_day5_scrapbook_state"
  },
  storybookClues: [
    {
      chapter: 1,
      title: "The Beginning We Didn't Notice ⚡🧪",
      prompt: "“Before we became Budduu and Tedduu, there was a practical, a little argument, and a first impression neither of us expected...”",
      answers: ["physics", "electronics", "practical", "electric wires", "current", "khizar", "shazan"],
      hint: "Which two practicals started that first heated conversation? ⚡"
    },
    {
      chapter: 2,
      title: "The Little Things That Stayed 💭💔",
      prompt: "“One taunt may have sounded like a joke to you, but its words stayed with me long after that day...”",
      answers: ["voice box", "voice", "computer lab", "shoe rack", "change it", "hurt", "tount"],
      hint: "Remember what was said near the shoe rack about my voice. 💭"
    },
    {
      chapter: 3,
      title: "Somewhere Along the Way 🫂❤️‍🩹",
      prompt: "“In a crowded queue, a simple sentence made me see a different side of you...”",
      answers: ["tension mat le", "sambhal lunga", "examination fees", "queue", "dhakka", "care", "mai hu na"],
      hint: "What did you say when I was pushed in the examination-fees queue? 🫂"
    },
    {
      chapter: 4,
      title: "A Day to Remember 🎬🏍️",
      prompt: "“One bike ride, a white hoodie, and my first cinema experience became a memory I still carry...”",
      answers: ["14 september 2025", "demon slayer", "infinity castle", "miraj cinemas", "white hoodie", "first movie", "bike ride"],
      hint: "Which anime movie did we watch together on our first cinema trip? 🎬"
    },
    {
      chapter: 5,
      title: "The Biryani Date 🍗🎂",
      prompt: "“On my birthday, between college worries and hall-ticket tension, you turned a simple meal into a memory...”",
      answers: ["17 june 2025", "biryani", "birthday", "hall ticket", "biryani date", "june 17"],
      hint: "What did you take me to eat on my birthday amid hall-ticket tension? 🍗"
    },
    {
      chapter: 6,
      title: "The Letter 💌🥹",
      prompt: "“You asked me for something sweet without a birthday, a celebration, or any special reason...”",
      answers: ["letter", "love letter", "a letter", "pyaara sa letter", "words", "write for me"],
      hint: "What did you ask me to write for you with no special occasion? 💌"
    },
    {
      chapter: 7,
      title: "The First Kiss 💛",
      prompt: "“You opened your heart, shared your fears and feelings, then left me with two words I still remember...”",
      answers: ["i love you bro", "i love you brooo", "confession", "first kiss", "november december 2025", "love you", "love"],
      hint: "After your confession, what did you whisper when you kissed my hand? 💛"
    },
    {
      chapter: 8,
      title: "Before Our Story Fades… ❤️‍🩹🌅",
      prompt: "“We have eight chapters of memories, but the next page needs both of us to choose honesty, care, and a fresh beginning...”",
      answers: ["shazan", "#shazan", "friendship", "fresh start", "together", "another chance", "restart"],
      hint: "What is the name of our bond that I hope we can rebuild together? ❤️‍🩹"
    }
  ],
  detoursClues: [
    {
      detour: 1,
      title: "The Sudden Turn",
      answers: ["turn", "sudden", "unplanned", "cross", "bypass"],
      hint: "The direction we took unexpectedly (e.g. mai kyu du )."
    },
    {
      detour: 2,
      title: "The Midnight Viewpoint",
      answers: ["midnight", "stars", "night", "3am", "skyline"],
      hint: "The hour when the sky and conversations were quietest (e.g. Chal Chala ve)."
    },
    {
      detour: 3,
      title: "The Rainstorm Shelter",
      answers: ["rain", "storm", "shelter", "calm", "safe"],
      hint: "What falling from the sky made us stand closer? (e.g. Meow Gop Gop Gop ...)."
    },
    {
      detour: 4,
      title: "The Golden Horizon",
      answers: ["horizon", "gold", "golden", "sunrise", "sunset", "home"],
      hint: "The warm view at the end of the road (e.g. Asan lag raha tha na )."
    }
  ],
  scrapbookTargetSequence: [1, 2, 3, 4, 5]
};

// State Variables
let outerAngle = 180;
let middleAngle = 90;
let innerAngle = 0;
let isRingLockSolved = false;

// Sequential Progression: 1: Storybook -> 2: Detours -> 3: Scrapbook -> 4: Receipt -> 5: Completed
let currentStep = 1;

// Web Audio API Synthesizer
let audioCtx = null;

function playToneSound(freq, type = "sine", duration = 0.15, gainVal = 0.08) {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    if (!audioCtx) audioCtx = new AudioCtxClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function normalizeAnswer(input) {
  if (typeof input !== "string") return "";
  return input.trim().toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
}

function getStoredJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    return fallback;
  }
}

function setStoredJSON(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {}
}

document.addEventListener("DOMContentLoaded", () => {
  initDay5Flow();
});

function initDay5Flow() {
  const day5Data = (typeof JOURNEY_DAYS !== "undefined")
    ? JOURNEY_DAYS.find((d) => d.day === DAY5_CONFIG.day)
    : { day: 5, dateStr: DAY5_CONFIG.dateStr };

  const dateLockedView = document.getElementById("day5DateLockedView");
  const gameLockedView = document.getElementById("day5GameLockedView");
  const unlockedView = document.getElementById("day5UnlockedView");

  const isDateReady = (typeof isDateUnlocked === "function")
    ? isDateUnlocked(day5Data.dateStr)
    : true;

  if (!isDateReady) {
    if (dateLockedView) dateLockedView.style.display = "flex";
    if (gameLockedView) gameLockedView.style.display = "none";
    if (unlockedView) unlockedView.style.display = "none";

    const daysRemaining = (typeof getDaysUntil === "function") ? getDaysUntil(day5Data.dateStr) : 0;
    const countdownEl = document.getElementById("dateLockCountdown");
    if (countdownEl) {
      countdownEl.textContent = daysRemaining > 0
        ? `Unlocks in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} (24 October 2026)`
        : "Unlocks on 24 October 2026";
    }
    return;
  }

  if (dateLockedView) dateLockedView.style.display = "none";

  try {
    if (localStorage.getItem(DAY5_CONFIG.storageKeys.lockSolved) === "true") {
      isRingLockSolved = true;
    }
    const savedStep = parseInt(localStorage.getItem(DAY5_CONFIG.storageKeys.step), 10);
    if (!isNaN(savedStep) && savedStep >= 1 && savedStep <= 5) {
      currentStep = savedStep;
    }
    if (localStorage.getItem(DAY5_CONFIG.storageKeys.completed) === "true") {
      isRingLockSolved = true;
      currentStep = 5;
    }
  } catch (err) {}

  initDay5AmbientParticles();
  initNextDayNavigation();

  if (!isRingLockSolved) {
    if (gameLockedView) gameLockedView.style.display = "flex";
    if (unlockedView) unlockedView.style.display = "none";
    initRotatingRingLock();
    return;
  }

  launchActualDay5Content();
}

function initDay5AmbientParticles() {
  const canvas = document.getElementById("day5ParticlesCanvas");
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
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(255, 107, 74, 0.6)";
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

function initRotatingRingLock() {
  const ringOuter = document.getElementById("ringOuter");
  const ringMiddle = document.getElementById("ringMiddle");
  const ringInner = document.getElementById("ringInner");

  const btnOuter = document.getElementById("rotateOuterBtn");
  const btnMiddle = document.getElementById("rotateMiddleBtn");
  const btnInner = document.getElementById("rotateInnerBtn");

  const statusToast = document.getElementById("ringStatusToast");
  const successOverlay = document.getElementById("ringSuccessOverlay");

  function applyRotations() {
    if (ringOuter) ringOuter.style.transform = `rotate(${outerAngle}deg)`;
    if (ringMiddle) ringMiddle.style.transform = `rotate(${middleAngle}deg)`;
    if (ringInner) ringInner.style.transform = `rotate(${innerAngle}deg)`;
    checkRingAlignment();
  }

  function rotateOuter(e) {
    if (e) e.stopPropagation();
    outerAngle += 90;
    playToneSound(300, "sine", 0.08, 0.05);
    if (ringOuter) ringOuter.style.transform = `rotate(${outerAngle}deg)`;
    checkRingAlignment();
  }

  function rotateMiddle(e) {
    if (e) e.stopPropagation();
    middleAngle += 90;
    playToneSound(380, "sine", 0.08, 0.05);
    if (ringMiddle) ringMiddle.style.transform = `rotate(${middleAngle}deg)`;
    checkRingAlignment();
  }

  function rotateInner(e) {
    if (e) e.stopPropagation();
    innerAngle += 90;
    playToneSound(460, "sine", 0.08, 0.05);
    if (ringInner) ringInner.style.transform = `rotate(${innerAngle}deg)`;
    checkRingAlignment();
  }

  if (btnOuter) btnOuter.onclick = rotateOuter;
  if (btnMiddle) btnMiddle.onclick = rotateMiddle;
  if (btnInner) btnInner.onclick = rotateInner;

  if (ringOuter) ringOuter.onclick = rotateOuter;
  if (ringMiddle) ringMiddle.onclick = rotateMiddle;
  if (ringInner) ringInner.onclick = rotateInner;

  function checkRingAlignment() {
    const normOuter = ((outerAngle % 360) + 360) % 360;
    const normMiddle = ((middleAngle % 360) + 360) % 360;
    const normInner = ((innerAngle % 360) + 360) % 360;

    const isOuterAligned = (normOuter === 0);
    const isMiddleAligned = (normMiddle === 270);
    const isInnerAligned = (normInner === 180);

    const matchCount = [isOuterAligned, isMiddleAligned, isInnerAligned].filter(Boolean).length;

    if (matchCount === 3) {
      triggerRingSuccess();
    } else if (matchCount === 2) {
      if (statusToast) statusToast.textContent = "Two hearts aligned! Just one more turn... ✨";
    } else if (matchCount === 1) {
      if (statusToast) statusToast.textContent = "One heart locked at the pointer! 💖";
    } else {
      if (statusToast) statusToast.textContent = "Rotate rings to align all 3 hearts at the top pointer.";
    }
  }

  function triggerRingSuccess() {
    if (isRingLockSolved) return;
    isRingLockSolved = true;

    try {
      localStorage.setItem(DAY5_CONFIG.storageKeys.lockSolved, "true");
    } catch (e) {}

    playToneSound(523.25, "triangle", 0.3, 0.1);
    setTimeout(() => playToneSound(659.25, "triangle", 0.4, 0.1), 150);
    setTimeout(() => playToneSound(783.99, "triangle", 0.5, 0.12), 300);

    if (statusToast) statusToast.textContent = "ALIGNED! Unlocking Chapter 5... 🧡";

    setTimeout(() => {
      if (successOverlay) successOverlay.style.display = "flex";
      setTimeout(() => {
        const gameView = document.getElementById("day5GameLockedView");
        if (gameView) gameView.style.display = "none";
        launchActualDay5Content();
      }, 2300);
    }, 350);
  }

  applyRotations();
}

function launchActualDay5Content() {
  const unlockedView = document.getElementById("day5UnlockedView");
  if (unlockedView) unlockedView.style.display = "block";

  const isIntroSkipped = currentStep > 1;
  initIntroSequence(isIntroSkipped);

  updateProgressState(currentStep);
  initExperience1Storybook();
  initExperience2JourneyMap();
  initExperience3Scrapbook();
  initExperience4Receipt();
  initReplayFeature();

  if (currentStep >= 5) {
    renderCompletionView(false);
  }
}

/**
 * 4 Sequential Steps Progress Handler
 */
function updateProgressState(step) {
  const badge = document.getElementById("stepIndicatorBadge");
  const fill = document.getElementById("journeyProgressFill");
  const pctText = document.getElementById("journeyPercentageText");

  const sections = [
    { el: document.getElementById("chapterBookSection"), step: 1 },
    { el: document.getElementById("detourMapSection"), step: 2 },
    { el: document.getElementById("scrapbookSection"), step: 3 },
    { el: document.getElementById("receiptSection"), step: 4 }
  ];

  const pct = Math.min(step * 25, 100);
  if (fill) fill.style.width = `${pct}%`;
  if (pctText) pctText.textContent = `${pct}%`;
  if (badge) badge.textContent = step <= 4 ? `STEP ${step} / 4` : `ALL 4 COMPLETED (50%)`;

  sections.forEach((item) => {
    if (!item.el) return;
    if (step >= item.step) {
      item.el.classList.remove("is-locked");
      item.el.classList.add("is-active");
    } else {
      item.el.classList.add("is-locked");
      item.el.classList.remove("is-active");
    }
  });

  try {
    localStorage.setItem(DAY5_CONFIG.storageKeys.step, step.toString());
  } catch (e) {}
}

function advanceToNextStep(nextStep, targetSectionId) {
  if (currentStep < nextStep) {
    currentStep = nextStep;
    updateProgressState(currentStep);

    playToneSound(587.33, "sine", 0.2, 0.1);
    setTimeout(() => playToneSound(880, "triangle", 0.4, 0.12), 150);

    setTimeout(() => {
      const nextTarget = document.getElementById(targetSectionId);
      if (nextTarget) {
        nextTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 550);
  }
}

function initIntroSequence(skipIntro) {
  const introStage = document.getElementById("day5IntroStage");
  const mainStage = document.getElementById("mainDay5Content");
  const skipBtn = document.getElementById("skipIntroBtn");

  const tag = document.getElementById("introTag");
  const title = document.getElementById("introTitle");
  const line1 = document.getElementById("introLine1");
  const line2 = document.getElementById("introLine2");
  const line3 = document.getElementById("introLine3");

  let isDismissed = false;

  function endIntro() {
    if (isDismissed) return;
    isDismissed = true;

    if (introStage) {
      introStage.classList.add("fade-out");
      setTimeout(() => {
        introStage.style.display = "none";
      }, 1000);
    }

    if (mainStage) {
      mainStage.classList.add("visible");
    }
  }

  if (skipIntro) {
    if (introStage) introStage.style.display = "none";
    if (mainStage) mainStage.classList.add("visible");
    return;
  }

  if (skipBtn) skipBtn.onclick = endIntro;

  setTimeout(() => {
    if (!isDismissed && tag && title) {
      tag.style.opacity = "1";
      tag.style.transform = "translateY(0)";
      title.style.opacity = "1";
      title.style.transform = "translateY(0)";
    }
  }, 400);

  setTimeout(() => {
    if (!isDismissed && line1) line1.classList.add("active");
  }, 1500);

  setTimeout(() => {
    if (!isDismissed && line1) line1.classList.remove("active");
    if (!isDismissed && line2) line2.classList.add("active");
  }, 3000);

  setTimeout(() => {
    if (!isDismissed && line2) line2.classList.remove("active");
    if (!isDismissed && line3) line3.classList.add("active");
  }, 4400);

  setTimeout(() => {
    endIntro();
  }, 5800);
}

/**
 * ==========================================================================
 * STEP 1: 📖 STORYBOOK
 * ==========================================================================
 */
function initExperience1Storybook() {
  const TOTAL_CHAPTERS = 8;
  const defaultState = {
    currentViewingChapter: 1,
    unlockedChapters: [1],
    solvedClues: [],
    turnedPages: [],
    completed: false
  };

  const storybookState = getStoredJSON(DAY5_CONFIG.storageKeys.storybook, defaultState);

  if (!Array.isArray(storybookState.unlockedChapters) || !storybookState.unlockedChapters.includes(1)) {
    storybookState.unlockedChapters = [1];
  }
  if (!Array.isArray(storybookState.solvedClues)) storybookState.solvedClues = [];
  if (!Array.isArray(storybookState.turnedPages)) storybookState.turnedPages = [];

  function saveStorybookState() {
    setStoredJSON(DAY5_CONFIG.storageKeys.storybook, storybookState);
  }

  function updateStorybookProgressUI() {
    const textEl = document.getElementById("storybookProgressText");
    const fillEl = document.getElementById("storybookProgressFill");
    const count = storybookState.turnedPages.length;
    const pct = Math.min((count / TOTAL_CHAPTERS) * 100, 100);

    if (textEl) {
      textEl.textContent = count >= TOTAL_CHAPTERS
        ? `All ${TOTAL_CHAPTERS} Chapters Completed`
        : `Chapter ${Math.min(count + 1, TOTAL_CHAPTERS)} of ${TOTAL_CHAPTERS} Unlocked`;
    }
    if (fillEl) fillEl.style.width = `${Math.max(pct, 12.5)}%`;
  }

  function renderChapterView(chapterNum) {
    storybookState.currentViewingChapter = chapterNum;
    saveStorybookState();

    for (let c = 1; c <= TOTAL_CHAPTERS; c++) {
      const pageEl = document.getElementById(`chapterPage${c}`);
      if (!pageEl) continue;

      if (c === chapterNum) {
        pageEl.classList.remove("is-locked");
        pageEl.classList.add("is-active");
      } else {
        pageEl.classList.remove("is-active");
        pageEl.classList.add("is-locked");
      }

      applyChapterState(c);
    }
  }

  function applyChapterState(c) {
    const isUnlocked = storybookState.unlockedChapters.includes(c);
    const isClueSolved = storybookState.solvedClues.includes(c);
    const isPageTurned = storybookState.turnedPages.includes(c);

    const badgeEl = document.getElementById(`chapterStatusBadge${c}`);
    const clueBoxEl = document.getElementById(`clueBoxChapter${c}`);
    const mediaContainerEl = document.getElementById(`mediaContainerChapter${c}`);
    const turnWrapperEl = document.getElementById(`turnActionWrapper${c}`);
    const messageEl = document.getElementById(`messageParchmentChapter${c}`);
    const nextBtnEl = document.getElementById(`nextChapterBtn${c}`);
    const finishBtnEl = document.getElementById("finishStorybookBtn");

    if (!isUnlocked) {
      if (badgeEl) badgeEl.textContent = "LOCKED";
      if (clueBoxEl) clueBoxEl.style.display = "block";
      if (mediaContainerEl) mediaContainerEl.style.display = "none";
      if (turnWrapperEl) turnWrapperEl.style.display = "none";
      if (messageEl) messageEl.style.display = "none";
      if (nextBtnEl) nextBtnEl.disabled = true;
      return;
    }

    if (!isClueSolved) {
      if (badgeEl) badgeEl.textContent = "SEALED BY A CLUE";
      if (clueBoxEl) clueBoxEl.style.display = "block";
      if (mediaContainerEl) mediaContainerEl.style.display = "none";
      if (turnWrapperEl) turnWrapperEl.style.display = "none";
      if (messageEl) messageEl.style.display = "none";
      if (nextBtnEl) nextBtnEl.disabled = true;
    } else if (!isPageTurned) {
      if (badgeEl) badgeEl.textContent = "IMAGE REVEALED";
      if (clueBoxEl) clueBoxEl.style.display = "none";
      if (mediaContainerEl) mediaContainerEl.style.display = "block";
      if (turnWrapperEl) turnWrapperEl.style.display = "block";
      if (messageEl) messageEl.style.display = "none";
      if (nextBtnEl) nextBtnEl.disabled = true;
    } else {
      if (badgeEl) badgeEl.textContent = "UNVEILED";
      if (clueBoxEl) clueBoxEl.style.display = "none";
      if (mediaContainerEl) mediaContainerEl.style.display = "block";
      if (turnWrapperEl) turnWrapperEl.style.display = "none";
      if (messageEl) messageEl.style.display = "block";
      if (nextBtnEl) nextBtnEl.disabled = false;
      if (finishBtnEl && c === TOTAL_CHAPTERS) finishBtnEl.disabled = false;
    }
  }

  DAY5_CONFIG.storybookClues.forEach((cfg) => {
    const c = cfg.chapter;
    const clueBox = document.getElementById(`clueBoxChapter${c}`);
    const solveBtn = document.getElementById(`solveClueBtn${c}`);
    const turnBtn = document.getElementById(`turnPageBtn${c}`);
    const prevBtn = document.getElementById(`prevChapterBtn${c}`);
    const nextBtn = document.getElementById(`nextChapterBtn${c}`);

    if (clueBox && !clueBox.querySelector(".clue-inline-form")) {
      const form = document.createElement("div");
      form.className = "clue-inline-form";
      form.style.marginTop = "12px";
      form.innerHTML = `
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <input type="text" class="clue-input-field" placeholder="Enter clue word..." style="padding: 8px 14px; border-radius: 9999px; border: 1px solid rgba(138,90,43,0.4); background: #ffffff; color: #240a10; font-family: inherit; font-size: 0.85rem; outline: none; max-width: 200px;" aria-label="Answer for Chapter ${c}">
          <button type="button" class="btn btn-secondary btn-submit-clue" style="padding: 8px 18px; font-size: 0.78rem;">Submit</button>
        </div>
        <p class="clue-feedback-msg" style="font-size: 0.8rem; margin-top: 8px; font-style: italic; min-height: 18px; color: #8c2d3a;" aria-live="polite"></p>
      `;
      clueBox.appendChild(form);

      const inputEl = form.querySelector(".clue-input-field");
      const submitBtn = form.querySelector(".btn-submit-clue");
      const feedbackEl = form.querySelector(".clue-feedback-msg");

      function attemptSolve() {
        const val = normalizeAnswer(inputEl ? inputEl.value : "");
        const isMatch = cfg.answers.some((ans) => val.includes(normalizeAnswer(ans)));

        if (isMatch) {
          playToneSound(587.33, "sine", 0.25, 0.1);
          if (feedbackEl) {
            feedbackEl.style.color = "#2b8a3e";
            feedbackEl.textContent = "✨ Seal Broken! The memory awakens...";
          }

          if (!storybookState.solvedClues.includes(c)) {
            storybookState.solvedClues.push(c);
          }
          saveStorybookState();

          setTimeout(() => {
            applyChapterState(c);
            updateStorybookProgressUI();
          }, 650);
        } else {
          playToneSound(220, "sawtooth", 0.2, 0.08);
          if (feedbackEl) {
            feedbackEl.style.color = "#8c2d3a";
            feedbackEl.textContent = `Incorrect seal. Hint: ${cfg.hint}`;
          }
          if (inputEl) inputEl.focus();
        }
      }

      if (submitBtn) submitBtn.onclick = attemptSolve;
      if (inputEl) {
        inputEl.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            attemptSolve();
          }
        };
      }

      if (solveBtn) {
        solveBtn.onclick = () => {
          if (inputEl && inputEl.value.trim().length > 0) {
            attemptSolve();
          } else if (inputEl) {
            inputEl.focus();
            if (feedbackEl) feedbackEl.textContent = `Hint: ${cfg.hint}`;
          }
        };
      }
    }

    if (turnBtn) {
      turnBtn.onclick = () => {
        playToneSound(523.25, "triangle", 0.3, 0.1);
        if (!storybookState.turnedPages.includes(c)) {
          storybookState.turnedPages.push(c);
        }
        if (c < TOTAL_CHAPTERS && !storybookState.unlockedChapters.includes(c + 1)) {
          storybookState.unlockedChapters.push(c + 1);
        }
        saveStorybookState();
        applyChapterState(c);
        updateStorybookProgressUI();
      };
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (c > 1) {
          playToneSound(400, "sine", 0.08, 0.04);
          renderChapterView(c - 1);
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (c < TOTAL_CHAPTERS && storybookState.turnedPages.includes(c)) {
          playToneSound(440, "sine", 0.08, 0.04);
          renderChapterView(c + 1);
        }
      };
    }
  });

  const finishBtn = document.getElementById("finishStorybookBtn");
  if (finishBtn) {
    finishBtn.onclick = () => {
      storybookState.completed = true;
      saveStorybookState();
      playToneSound(659.25, "triangle", 0.4, 0.12);
      advanceToNextStep(2, "detourMapSection");
    };
  }

  const initialChapter = Math.min(Math.max(storybookState.currentViewingChapter || 1, 1), TOTAL_CHAPTERS);
  renderChapterView(initialChapter);
  updateStorybookProgressUI();
}

/**
 * ==========================================================================
 * STEP 2: 🌅 JOURNEY MAP DETOURS
 * ==========================================================================
 */
function initExperience2JourneyMap() {
  const TOTAL_DETOURS = 4;
  const defaultDetours = {
    discovered: [],
    unlocked: [1]
  };

  const detourState = getStoredJSON(DAY5_CONFIG.storageKeys.detours, defaultDetours);
  if (!Array.isArray(detourState.discovered)) detourState.discovered = [];
  if (!Array.isArray(detourState.unlocked) || !detourState.unlocked.includes(1)) {
    detourState.unlocked = [1];
  }

  function saveDetourState() {
    setStoredJSON(DAY5_CONFIG.storageKeys.detours, detourState);
  }

  function updateMapProgressUI() {
    const textEl = document.getElementById("mapProgressText");
    const fillEl = document.getElementById("mapProgressFill");
    const completionBar = document.getElementById("detourCompletionBar");
    const count = detourState.discovered.length;
    const pct = (count / TOTAL_DETOURS) * 100;

    if (textEl) textEl.textContent = `${count} / ${TOTAL_DETOURS} Detours Discovered`;
    if (fillEl) fillEl.style.width = `${pct}%`;

    if (count >= TOTAL_DETOURS && completionBar) {
      completionBar.style.display = "block";
    }
  }

  function renderDetourCard(d) {
    const isUnlocked = detourState.unlocked.includes(d);
    const isDiscovered = detourState.discovered.includes(d);

    const cardEl = document.getElementById(`detourCard${d}`);
    const pinEl = document.getElementById(`detourPin${d}`);
    const stateTagEl = document.getElementById(`detourStateTag${d}`);
    const revealEl = document.getElementById(`detourReveal${d}`);
    const exploreBtnEl = document.getElementById(`exploreRouteBtn${d}`);

    if (pinEl) {
      if (isDiscovered || isUnlocked) {
        pinEl.classList.remove("pin-locked");
        pinEl.classList.add("pin-active");
      } else {
        pinEl.classList.add("pin-locked");
        pinEl.classList.remove("pin-active");
      }
    }

    if (cardEl) {
      if (isUnlocked || isDiscovered) {
        cardEl.classList.remove("is-locked");
        cardEl.classList.add("is-active");
      } else {
        cardEl.classList.add("is-locked");
        cardEl.classList.remove("is-active");
      }
    }

    if (stateTagEl) {
      stateTagEl.textContent = isDiscovered
        ? "DISCOVERED PATH"
        : (isUnlocked ? "OPEN FOR DISCOVERY" : "LOCKED PATH");
    }

    if (exploreBtnEl) exploreBtnEl.disabled = !isUnlocked;
    if (revealEl) revealEl.style.display = isDiscovered ? "block" : "none";
  }

  DAY5_CONFIG.detoursClues.forEach((cfg) => {
    const d = cfg.detour;
    const clueBox = document.getElementById(`detourClueBox${d}`);
    const exploreBtn = document.getElementById(`exploreRouteBtn${d}`);
    const pinBtn = document.getElementById(`detourPin${d}`);

    if (clueBox && !clueBox.querySelector(".detour-inline-form")) {
      const form = document.createElement("div");
      form.className = "detour-inline-form";
      form.style.marginTop = "10px";
      form.style.width = "100%";
      form.innerHTML = `
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <input type="text" class="detour-input-field" placeholder="Answer secret word..." style="padding: 6px 12px; border-radius: 9999px; border: 1px solid rgba(255,179,71,0.3); background: rgba(0,0,0,0.5); color: #fff; font-family: inherit; font-size: 0.8rem; outline: none; flex: 1; min-width: 140px;" aria-label="Answer for Detour ${d}">
          <button type="button" class="btn btn-secondary btn-submit-detour" style="padding: 6px 14px; font-size: 0.75rem;">Unlock</button>
        </div>
        <p class="detour-feedback-msg" style="font-size: 0.78rem; margin-top: 6px; font-style: italic; min-height: 16px; color: #ffb347;" aria-live="polite"></p>
      `;
      clueBox.appendChild(form);

      const inputEl = form.querySelector(".detour-input-field");
      const submitBtn = form.querySelector(".btn-submit-detour");
      const feedbackEl = form.querySelector(".detour-feedback-msg");

      function attemptSolveDetour() {
        if (!detourState.unlocked.includes(d)) {
          if (feedbackEl) feedbackEl.textContent = `Unlock previous detours first!`;
          return;
        }

        const val = normalizeAnswer(inputEl ? inputEl.value : "");
        const isMatch = cfg.answers.some((ans) => val.includes(normalizeAnswer(ans)));

        if (isMatch) {
          playToneSound(600, "sine", 0.3, 0.1);
          if (feedbackEl) {
            feedbackEl.style.color = "#52e396";
            feedbackEl.textContent = "✨ Route charted! Memory unlocked.";
          }

          if (!detourState.discovered.includes(d)) {
            detourState.discovered.push(d);
          }
          if (d < TOTAL_DETOURS && !detourState.unlocked.includes(d + 1)) {
            detourState.unlocked.push(d + 1);
          }
          saveDetourState();

          setTimeout(() => {
            renderDetourCard(d);
            if (d < TOTAL_DETOURS) renderDetourCard(d + 1);
            updateMapProgressUI();
          }, 500);
        } else {
          playToneSound(240, "sawtooth", 0.2, 0.08);
          if (feedbackEl) {
            feedbackEl.style.color = "#ff6b4a";
            feedbackEl.textContent = `Incorrect path. Hint: ${cfg.hint}`;
          }
          if (inputEl) inputEl.focus();
        }
      }

      if (submitBtn) submitBtn.onclick = attemptSolveDetour;
      if (inputEl) {
        inputEl.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            attemptSolveDetour();
          }
        };
      }

      if (exploreBtn) {
        exploreBtn.onclick = () => {
          if (inputEl && inputEl.value.trim().length > 0) {
            attemptSolveDetour();
          } else if (inputEl) {
            inputEl.focus();
            if (feedbackEl) feedbackEl.textContent = `Hint: ${cfg.hint}`;
          }
        };
      }

      if (pinBtn) {
        pinBtn.onclick = () => {
          const card = document.getElementById(`detourCard${d}`);
          if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
          if (inputEl && detourState.unlocked.includes(d) && !detourState.discovered.includes(d)) {
            inputEl.focus();
          }
        };
      }
    }
  });

  // Finish Detours -> DIRECTLY advances to Step 3 (Scrapbook)
  const finishBtn = document.getElementById("finishDetoursBtn");
  if (finishBtn) {
    finishBtn.onclick = () => {
      playToneSound(700, "triangle", 0.35, 0.12);
      advanceToNextStep(3, "scrapbookSection");
    };
  }

  for (let d = 1; d <= TOTAL_DETOURS; d++) {
    renderDetourCard(d);
  }
  updateMapProgressUI();
}

/**
 * ==========================================================================
 * STEP 3: 🎞️ THE BEAUTIFUL ACCIDENT (DIGITAL SCRAPBOOK)
 * ==========================================================================
 */
function initExperience3Scrapbook() {
  const tray = document.getElementById("scrapbookPiecesTray");
  const shuffleBtn = document.getElementById("shuffleFragmentsBtn");
  const verifyBtn = document.getElementById("verifyFragmentsBtn");
  const proceedBtn = document.getElementById("proceedToReceiptBtn");
  const hiddenReveal = document.getElementById("scrapbookHiddenReveal");

  const defaultScrapbook = {
    solved: false,
    order: [3, 1, 5, 2, 4]
  };

  const scrapbookState = getStoredJSON(DAY5_CONFIG.storageKeys.scrapbook, defaultScrapbook);

  function saveScrapbookState() {
    setStoredJSON(DAY5_CONFIG.storageKeys.scrapbook, scrapbookState);
  }

  function getCurrentDOMOrder() {
    if (!tray) return [];
    const items = Array.from(tray.querySelectorAll(".scrapbook-fragment-item"));
    return items.map((el) => parseInt(el.getAttribute("data-sequence"), 10)).filter((n) => !isNaN(n));
  }

  function applyOrderToDOM(seqArray) {
    if (!tray || !Array.isArray(seqArray)) return;
    seqArray.forEach((seq) => {
      const item = tray.querySelector(`.scrapbook-fragment-item[data-sequence="${seq}"]`);
      if (item) tray.appendChild(item);
    });
  }

  if (tray) {
    tray.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-fragment-move");
      if (!btn) return;

      const item = btn.closest(".scrapbook-fragment-item");
      if (!item) return;

      const direction = btn.getAttribute("data-direction");
      if (direction === "up") {
        const prev = item.previousElementSibling;
        if (prev && prev.classList.contains("scrapbook-fragment-item")) {
          playToneSound(450, "sine", 0.08, 0.04);
          tray.insertBefore(item, prev);
          scrapbookState.order = getCurrentDOMOrder();
          saveScrapbookState();
        }
      } else if (direction === "down") {
        const next = item.nextElementSibling;
        if (next && next.classList.contains("scrapbook-fragment-item")) {
          playToneSound(380, "sine", 0.08, 0.04);
          tray.insertBefore(next, item);
          scrapbookState.order = getCurrentDOMOrder();
          saveScrapbookState();
        }
      }
    });
  }

  if (shuffleBtn) {
    shuffleBtn.onclick = () => {
      playToneSound(300, "sawtooth", 0.1, 0.05);
      const shuffled = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
      scrapbookState.order = shuffled;
      applyOrderToDOM(shuffled);
      saveScrapbookState();
    };
  }

  if (verifyBtn) {
    verifyBtn.onclick = () => {
      const current = getCurrentDOMOrder();
      const target = DAY5_CONFIG.scrapbookTargetSequence;
      const isCorrect = current.length === target.length && current.every((val, idx) => val === target[idx]);

      if (isCorrect) {
        scrapbookState.solved = true;
        saveScrapbookState();

        playToneSound(523.25, "triangle", 0.3, 0.1);
        setTimeout(() => playToneSound(659.25, "triangle", 0.4, 0.1), 150);
        setTimeout(() => playToneSound(880, "triangle", 0.5, 0.12), 300);

        if (hiddenReveal) {
          hiddenReveal.style.display = "block";
          setTimeout(() => {
            hiddenReveal.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 350);
        }
      } else {
        playToneSound(220, "sawtooth", 0.25, 0.08);
        const feedback = document.querySelector(".scrapbook-instruction-text");
        if (feedback) {
          feedback.textContent = "Almost! Think about how our thoughts naturally flowed from beginning to end.";
          setTimeout(() => {
            feedback.textContent = "Use the reorder controls on each piece to assemble our moments into their true heartfelt sequence.";
          }, 4000);
        }
      }
    };
  }

  // Proceed to Step 4 (Thermal Receipt)
  if (proceedBtn) {
    proceedBtn.onclick = () => {
      playToneSound(784, "sine", 0.3, 0.1);
      advanceToNextStep(4, "receiptSection");
    };
  }

  if (Array.isArray(scrapbookState.order) && scrapbookState.order.length > 0) {
    applyOrderToDOM(scrapbookState.order);
  }
  if (scrapbookState.solved && hiddenReveal) {
    hiddenReveal.style.display = "block";
  }
}

/**
 * ==========================================================================
 * STEP 4: 🧾 THERMAL RECEIPT — FIXED VERSION
 * ==========================================================================
 */

function initExperience4Receipt() {
  const printBtn = document.getElementById("printReceiptBtn");
  const wrapper = document.getElementById("receiptPaperWrapper");

  if (!printBtn || !wrapper) return;

  // Restore completed state when the page is reopened.
  const isCompleted = (() => {
    try {
      return localStorage.getItem(
        DAY5_CONFIG.storageKeys.completed
      ) === "true";
    } catch (error) {
      return false;
    }
  })();

  if (isCompleted || currentStep >= 5) {
    wrapper.style.display = "flex";
    printBtn.disabled = true;

    if (typeof renderCompletionView === "function") {
      renderCompletionView(false);
    }

    return;
  }

  // Prevent duplicate event handlers on reinitialization.
  printBtn.onclick = null;
  printBtn.disabled = false;

  printBtn.onclick = () => {
    // The previous experiences must be completed first.
    if (currentStep < 4) return;

    // Prevent multiple clicks while the receipt is revealing.
    if (printBtn.dataset.printing === "true") return;

    printBtn.dataset.printing = "true";
    printBtn.disabled = true;

    // Thermal printer sound effect.
    if (typeof playToneSound === "function") {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          try {
            playToneSound(
              400 + i * 35,
              "square",
              0.05,
              0.04
            );
          } catch (error) {
            // Sound failure should not block receipt reveal.
          }
        }, i * 130);
      }
    }

    // Reveal the receipt.
    wrapper.style.display = "flex";

    // Complete the final experience.
    currentStep = 5;

    if (typeof updateProgressState === "function") {
      updateProgressState(5);
    }

    // Save progress safely.
    try {
      localStorage.setItem(
        DAY5_CONFIG.storageKeys.step,
        "5"
      );

      localStorage.setItem(
        DAY5_CONFIG.storageKeys.completed,
        "true"
      );
    } catch (error) {
      // The current session can still complete without storage.
    }

    // Show the completion section.
    renderCompletionView(true);
  };
}


/**
 * ==========================================================================
 * COMPLETION VIEW
 * ==========================================================================
 */

function renderCompletionView(smoothScroll = true) {
  const compSection = document.getElementById(
    "day5CompletionSection"
  );

  if (!compSection) return;

  compSection.style.display = "block";

  if (smoothScroll) {
    setTimeout(() => {
      compSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 500);
  }
}


/**
 * ==========================================================================
 * REPLAY FEATURE — RESET DAY 5
 * ==========================================================================
 */

function initReplayFeature() {
  const replayBtn = document.getElementById(
    "replayChapterBtn"
  );

  if (!replayBtn) return;

  replayBtn.onclick = () => {
    try {
      const keys = DAY5_CONFIG.storageKeys;

      localStorage.removeItem(keys.step);
      localStorage.removeItem(keys.completed);
      localStorage.removeItem(keys.storybook);
      localStorage.removeItem(keys.detours);
      localStorage.removeItem(keys.scrapbook);
    } catch (error) {
      // Reload even if localStorage is unavailable.
    }

    // Reset in-memory progress.
    currentStep = 1;

    location.reload();
  };
}


/**
 * ==========================================================================
 * NEXT-DAY NAVIGATION — DATE LOCK
 * ==========================================================================
 */

function initNextDayNavigation() {
  const navNextBtn = document.getElementById(
    "navNextDayBtn"
  );

  const compNextBtn = document.getElementById(
    "completionNextDayBtn"
  );

  const handleNextClick = (event) => {
    const day6Data =
      typeof JOURNEY_DAYS !== "undefined"
        ? JOURNEY_DAYS.find((day) => day.day === 6)
        : null;

    if (
      day6Data &&
      typeof isDateUnlocked === "function" &&
      !isDateUnlocked(day6Data.dateStr)
    ) {
      event.preventDefault();

      if (typeof showLockModal === "function") {
        showLockModal(day6Data);
      }
    }
  };

  if (navNextBtn) {
    navNextBtn.onclick = handleNextClick;
  }

  if (compNextBtn) {
    compNextBtn.onclick = handleNextClick;
  }
}
