/* ==========================================================================
   BUDDUU — DAY 4: “HOW WELL DO YOU KNOW ME?”
   Multi-Gate Architecture:
   Gate 1 (Date Lock) → Gate 2 (Mini Maze Lock: Guide to Key 🗝️) → 10 Quiz Questions → Complete
   ========================================================================== */

/**
 * 1. 10 EDITABLE JOURNEY & BOND QUIZ QUESTIONS
 */
const quizQuestions = [
  {
    id: 1,
    question: "Budduu, hum dono ne apne liye kaun se heart colours decide kiye hain?",
    options: [
      { letter: "A", text: "Red ❤️ & Pink 🩷" },
      { letter: "B", text: "Orange 🧡 & Yellow 💛" },
      { letter: "C", text: "Blue 💙 & Green 💚" },
      { letter: "D", text: "Purple 💜 & Black 🖤" }
    ],
    correct: "B",
    explanation: "Ek Orange 🧡 heart use karega aur doosra Yellow 💛. Ye humari friendship ki special identity hai."
  },
  {
    id: 2,
    question: "Jab Tedduu tujhse koi baat kar raha ho, toh tujhe kya karna hai?",
    options: [
      { letter: "A", text: "Phone chalana hai 🧐" },
      { letter: "B", text: "Baat baad mein sunni hai" },
      { letter: "C", text: "Equal attention deni hai" },
      { letter: "D", text: "Kisi aur se baat karni hai" }
    ],
    correct: "C",
    explanation: "Humne promise kiya hai ki jab ek baat karega toh dono ek dusre ko equal attention denge."
  },
  {
    id: 3,
    question: "Hum dono ki teasing aur masti kaisi rahegi?",
    options: [
      { letter: "A", text: "Bilkul band" },
      { letter: "B", text: "Sirf online" },
      { letter: "C", text: "Sirf serious baatein" },
      { letter: "D", text: "Pehle jaisi, lekin har kisi ke saamne nahi" }
    ],
    correct: "D",
    explanation: "Hum pehle ki tarah ek dusre ko chhedenge aur sataayenge, par har kisi ke saamne nahi."
  },
  {
    id: 4,
    question: "Agar Tedduu ko kabhi feel ho ki tu use ignore kar raha hai, toh tujhe kya karna chahiye?",
    options: [
      { letter: "A", text: "Uski baat taal deni chahiye" },
      { letter: "B", text: "Uska mazaak udaana chahiye" },
      { letter: "C", text: "Uski baat sun kar misunderstanding clear karni chahiye" },
      { letter: "D", text: "Usse aur door rehna chahiye" }
    ],
    correct: "C",
    explanation: "Humne promise kiya hai ki ek dusre ko ignored feel nahi hone denge. Isliye baat clear karna important hai."
  },
  {
    id: 5,
    question: "Hum dono ne ek dusre ka saath dene ka promise kis cheez mein kiya hai?",
    options: [
      { letter: "A", text: "Sirf college mein" },
      { letter: "B", text: "Sirf jab time mile" },
      { letter: "C", text: "Sirf fun mein" },
      { letter: "D", text: "Har cheez mein" }
    ],
    correct: "D",
    explanation: "Promise hai ki hum ek dusre ka saath har cheez mein denge, khaaskar mushkil waqt mein."
  },
  {
    id: 6,
    question: "Budduu, hum dono ko ek dusre par kya rakhna hai?",
    options: [
      { letter: "A", text: "Competition" },
      { letter: "B", text: "Trust" },
      { letter: "C", text: "Doubt" },
      { letter: "D", text: "Gussa" }
    ],
    correct: "B",
    explanation: "Humne hamesha ek dusre par trust karne ka promise kiya hai."
  },
  {
    id: 7,
    question: "Tedduu ke notes mein favourite food kya likha hai?",
    options: [
      { letter: "A", text: "Burger 🍔" },
      { letter: "B", text: "Pizza 🍕" },
      { letter: "C", text: "Taharii 🍲" },
      { letter: "D", text: "Biryani 🍛" }
    ],
    correct: "C",
    explanation: "favourite food Taharii hai"
  },
  {
    id: 8,
    question: "Tedduu ki favourite movie kaunsi likhi hui hai?",
    options: [
      { letter: "A", text: "Brahmastra Part 1" },
      { letter: "B", text: "3 Idiots" },
      { letter: "C", text: "Chhichhore" },
      { letter: "D", text: "Dangal" }
    ],
    correct: "A",
    explanation: "favourite movie Brahmastra Part 1 hai"
  },
  {
    id: 9,
    question: "Tedduu ki date of birth kya hai?",
    options: [
      { letter: "A", text: "17 June 2005" },
      { letter: "B", text: "17 July 2006" },
      { letter: "C", text: "17 June 2006" },
      { letter: "D", text: "17 June 2005" }
    ],
    correct: "C",
    explanation: "Yeh toh pata hona hi cahiyee.."
  },
  {
    id: 10,
    question: "Agar Tedduu akela feel kar raha ho, toh tu kya karega?",
    options: [
      { letter: "A", text: "Use akela chhod dega" },
      { letter: "B", text: "Uski feelings samjhega aur saath dega" },
      { letter: "C", text: "Usse kahega ki drama mat kar" },
      { letter: "D", text: "Usse ignore karega" }
    ],
    correct: "B",
    explanation: "Answer toh sahi lagay hoga aapne par aap yeh karte toh ho nhi karna start karoo...."
  }
];

// Day 4 Interactive Flow State
let isMazeSolved = false;

// 10-Question Quiz State
let currentQuestionIndex = 0;
let userScore = 0;
let isCurrentQuestionAnswered = false;

let hasCompletedQuiz = false;
let hasRevealedScore = false;
let hasSubmittedSecret = false;

document.addEventListener("DOMContentLoaded", () => {
  initDay4Flow();
});

/**
 * Main Flow Controller: Gate 1 (Date Lock) → Gate 2 (Mini Maze Lock) → Day 4 Content
 */
function initDay4Flow() {
  const day4Data = (typeof JOURNEY_DAYS !== "undefined")
    ? JOURNEY_DAYS.find((d) => d.day === 4)
    : { day: 4, dateStr: "2026-10-23" };

  const dateLockedView = document.getElementById("day4DateLockedView");
  const gameLockedView = document.getElementById("day4GameLockedView");
  const unlockedView = document.getElementById("day4UnlockedView");

  // GATE 1: Check Date Lock (Unlocks on 2026-10-23)
  const isDateReady = (typeof isDateUnlocked === "function") 
    ? isDateUnlocked(day4Data.dateStr) 
    : true;

  if (!isDateReady) {
    if (dateLockedView) dateLockedView.style.display = "flex";
    if (gameLockedView) gameLockedView.style.display = "none";
    if (unlockedView) unlockedView.style.display = "none";

    const daysRemaining = (typeof getDaysUntil === "function") ? getDaysUntil(day4Data.dateStr) : 0;
    const countdownEl = document.getElementById("dateLockCountdown");
    if (countdownEl) {
      countdownEl.textContent = daysRemaining > 0 
        ? `Unlocks in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} (23 October 2026)`
        : "Unlocks on 23 October 2026";
    }
    return;
  }

  // Date has arrived: hide Gate 1
  if (dateLockedView) dateLockedView.style.display = "none";

  // Check persistent storage
  try {
    if (localStorage.getItem("budduu_day4_lock_solved") === "true") {
      isMazeSolved = true;
    }
    if (localStorage.getItem("budduu_day4_completed") === "true") {
      isMazeSolved = true;
      hasCompletedQuiz = true;
      hasRevealedScore = true;
      hasSubmittedSecret = true;
    }
  } catch (err) {}

  initDay4AmbientParticles();
  initNextDayNavigation();

  // GATE 2: Mini Maze Lock
  if (!isMazeSolved) {
    if (gameLockedView) gameLockedView.style.display = "flex";
    if (unlockedView) unlockedView.style.display = "none";
    initMiniMazeLock();
    return;
  }

  // BOTH GATES PASSED: Launch Actual Day 4 Content
  launchActualDay4Content();
}

/**
 * Ambient Sunset Micro Dust Particles
 */
function initDay4AmbientParticles() {
  const canvas = document.getElementById("day4ParticlesCanvas");
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
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(255, 107, 74, 0.6)";
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/**
 * ==========================================================================
 * GATE 2: MINI MAZE LOCK (9x9 Grid Guide to Secret Key 🗝️)
 * ==========================================================================
 */
function initMiniMazeLock() {
  const mazeGridEl = document.getElementById("mazeGrid");
  const mazeGridFrame = document.getElementById("mazeGridFrame");
  const successOverlay = document.getElementById("mazeSuccessOverlay");

  // On-Screen D-Pad Buttons
  const btnUp = document.getElementById("dpadUp");
  const btnDown = document.getElementById("dpadDown");
  const btnLeft = document.getElementById("dpadLeft");
  const btnRight = document.getElementById("dpadRight");

  if (!mazeGridEl) return;

  // 9x9 Maze Layout (1 = Wall, 0 = Walkable Path)
  // Solvable path from (1,1) to (7,7)
  const mazeMatrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  let playerPos = { r: 1, c: 1 };
  const keyPos = { r: 7, c: 7 };
  let isLevelFinished = false;

  function renderMaze() {
    mazeGridEl.innerHTML = "";

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement("div");
        cell.className = "maze-cell";

        const isWall = mazeMatrix[r][c] === 1;
        const isPlayer = playerPos.r === r && playerPos.c === c;
        const isKey = keyPos.r === r && keyPos.c === c;

        if (isWall) {
          cell.classList.add("is-wall");
        } else {
          cell.classList.add("is-path");
        }

        if (isPlayer) {
          cell.classList.add("has-player");
          cell.textContent = "🧸"; // Cute Budduu Teddy Avatar
        } else if (isKey) {
          cell.classList.add("has-key");
          cell.textContent = "🗝️"; // Golden Secret Key
        }

        mazeGridEl.appendChild(cell);
      }
    }
  }

  function movePlayer(dr, dc) {
    if (isLevelFinished) return;

    const newR = playerPos.r + dr;
    const newC = playerPos.c + dc;

    // Check bounds & wall
    if (newR >= 0 && newR < 9 && newC >= 0 && newC < 9) {
      if (mazeMatrix[newR][newC] === 0) {
        playerPos.r = newR;
        playerPos.c = newC;
        renderMaze();

        // Check if reached Secret Key
        if (playerPos.r === keyPos.r && playerPos.c === keyPos.c) {
          handleKeyCollected();
        }
      }
    }
  }

  function handleKeyCollected() {
    isLevelFinished = true;
    isMazeSolved = true;

    try {
      localStorage.setItem("budduu_day4_lock_solved", "true");
    } catch (e) {}

    // Show Celebration Overlay
    setTimeout(() => {
      if (successOverlay) successOverlay.style.display = "flex";

      // Transition to actual content after 2.4s
      setTimeout(() => {
        const gameView = document.getElementById("day4GameLockedView");
        if (gameView) gameView.style.display = "none";
        launchActualDay4Content();
      }, 2400);
    }, 250);
  }

  // Keyboard Movement Listener
  window.addEventListener("keydown", (e) => {
    if (isLevelFinished) return;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      e.preventDefault();
      movePlayer(-1, 0);
    } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      e.preventDefault();
      movePlayer(1, 0);
    } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      e.preventDefault();
      movePlayer(0, -1);
    } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      e.preventDefault();
      movePlayer(0, 1);
    }
  });

  // Touch / Click D-Pad Listeners
  if (btnUp) btnUp.addEventListener("click", () => movePlayer(-1, 0));
  if (btnDown) btnDown.addEventListener("click", () => movePlayer(1, 0));
  if (btnLeft) btnLeft.addEventListener("click", () => movePlayer(0, -1));
  if (btnRight) btnRight.addEventListener("click", () => movePlayer(0, 1));

  // Mobile Touch Swipe Gesture Support on Maze Frame
  let touchStartX = 0;
  let touchStartY = 0;

  if (mazeGridFrame) {
    mazeGridFrame.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    mazeGridFrame.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    }, { passive: true });
  }

  function handleSwipe(startX, startY, endX, endY) {
    const diffX = endX - startX;
    const diffY = endY - startY;
    const minSwipeDist = 24;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > minSwipeDist) {
        if (diffX > 0) movePlayer(0, 1);  // Right
        else movePlayer(0, -1);           // Left
      }
    } else {
      if (Math.abs(diffY) > minSwipeDist) {
        if (diffY > 0) movePlayer(1, 0);  // Down
        else movePlayer(-1, 0);           // Up
      }
    }
  }

  renderMaze();
}

/**
 * Launch Actual Day 4 Content: Intro Sequence & 3 Experiences
 */
function launchActualDay4Content() {
  const unlockedView = document.getElementById("day4UnlockedView");
  if (unlockedView) unlockedView.style.display = "block";

  let alreadyCompleted = false;
  try {
    alreadyCompleted = localStorage.getItem("budduu_day4_completed") === "true";
  } catch (e) {}

  initIntroSequence(alreadyCompleted);
  initQuizExperience(alreadyCompleted);
  initSecretQuestionExperience(alreadyCompleted);

  if (alreadyCompleted) {
    hasCompletedQuiz = true;
    hasRevealedScore = true;
    hasSubmittedSecret = true;
    renderCompletionView();
  }
}

/**
 * SECTION 1: Cinematic Transition Intro
 */
function initIntroSequence(skipIntro) {
  const introStage = document.getElementById("day4IntroStage");
  const mainStage = document.getElementById("mainDay4Content");
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
      }, 1100);
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

  if (skipBtn) skipBtn.addEventListener("click", endIntro);

  setTimeout(() => {
    if (!isDismissed && tag && title) {
      tag.style.opacity = "1";
      tag.style.transform = "translateY(0)";
      title.style.opacity = "1";
      title.style.transform = "translateY(0)";
    }
  }, 500);

  setTimeout(() => {
    if (!isDismissed && line1) line1.classList.add("active");
  }, 1600);

  setTimeout(() => {
    if (!isDismissed && line1) line1.classList.remove("active");
    if (!isDismissed && line2) line2.classList.add("active");
  }, 2900);

  setTimeout(() => {
    if (!isDismissed && line2) line2.classList.remove("active");
    if (!isDismissed && line3) line3.classList.add("active");
  }, 4100);

  setTimeout(() => {
    endIntro();
  }, 5300);
}

/**
 * EXPERIENCE 1: Interactive Journey Quiz (10 Questions)
 */
function initQuizExperience(alreadyCompleted) {
  currentQuestionIndex = 0;
  userScore = 0;
  isCurrentQuestionAnswered = false;

  const dotsContainer = document.getElementById("quizStepDots");
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    quizQuestions.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.className = `step-dot ${idx === 0 ? "active" : ""}`;
      dotsContainer.appendChild(dot);
    });
  }

  if (alreadyCompleted) {
    const cardWrap = document.getElementById("quizCardWrapper");
    if (cardWrap) cardWrap.style.display = "none";
    showScoreReveal(10);
    return;
  }

  renderQuestion(0);

  const nextBtn = document.getElementById("nextQuestionBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizQuestions.length) {
        renderQuestion(currentQuestionIndex);
      } else {
        // Quiz complete -> Show Score
        hasCompletedQuiz = true;
        const cardWrap = document.getElementById("quizCardWrapper");
        if (cardWrap) cardWrap.style.display = "none";
        showScoreReveal(userScore);
      }
    });
  }
}

function renderQuestion(index) {
  isCurrentQuestionAnswered = false;
  const qData = quizQuestions[index];

  const trackerPill = document.getElementById("questionTrackerPill");
  const promptText = document.getElementById("questionPromptText");
  const optionsGrid = document.getElementById("quizOptionsGrid");
  const explanationBox = document.getElementById("quizExplanationBox");
  const actionsBar = document.getElementById("quizActionsBar");
  const stepDots = document.querySelectorAll(".step-dot");

  if (trackerPill) trackerPill.textContent = `QUESTION ${index + 1} / ${quizQuestions.length}`;
  if (promptText) promptText.textContent = qData.question;
  if (explanationBox) explanationBox.style.display = "none";
  if (actionsBar) actionsBar.style.display = "none";

  stepDots.forEach((dot, dIdx) => {
    dot.classList.toggle("active", dIdx === index);
    dot.classList.toggle("completed", dIdx < index);
  });

  if (optionsGrid) {
    optionsGrid.innerHTML = "";
    qData.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option-btn";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", "false");
      btn.innerHTML = `<span class="opt-letter">${opt.letter}</span> <span>${opt.text}</span>`;

      btn.addEventListener("click", () => handleAnswerSelect(opt.letter, btn, qData));
      optionsGrid.appendChild(btn);
    });
  }
}

function handleAnswerSelect(selectedLetter, clickedBtn, qData) {
  if (isCurrentQuestionAnswered) return;
  isCurrentQuestionAnswered = true;

  const allOptionBtns = document.querySelectorAll(".quiz-option-btn");
  allOptionBtns.forEach(btn => btn.disabled = true);

  const isCorrect = selectedLetter === qData.correct;
  if (isCorrect) {
    userScore++;
    clickedBtn.classList.add("is-correct");
  } else {
    clickedBtn.classList.add("is-wrong");
    // Highlight the correct answer for learning
    allOptionBtns.forEach(btn => {
      const letterSpan = btn.querySelector(".opt-letter");
      if (letterSpan && letterSpan.textContent === qData.correct) {
        btn.classList.add("is-correct");
      }
    });
  }

  // Show explanation toast
  const explanationBox = document.getElementById("quizExplanationBox");
  const icon = document.getElementById("explanationIcon");
  const verdict = document.getElementById("explanationVerdict");
  const detail = document.getElementById("explanationDetail");
  const actionsBar = document.getElementById("quizActionsBar");

  if (icon) {
    icon.textContent = isCorrect ? "✓" : "✕";
    icon.style.color = isCorrect ? "#52e396" : "#ff6b8b";
  }
  if (verdict) {
    verdict.textContent = isCorrect ? "Sahi Jawab! ❤️" : "Arey re! Yeh tha sahi answer:";
    verdict.style.color = isCorrect ? "#52e396" : "#ff6b8b";
  }
  if (detail) detail.textContent = qData.explanation;

  if (explanationBox) explanationBox.style.display = "flex";
  if (actionsBar) actionsBar.style.display = "flex";
}

/**
 * EXPERIENCE 2: Score Reveal (Tally out of 10)
 */
function showScoreReveal(score) {
  hasRevealedScore = true;
  const scoreSection = document.getElementById("scoreSection");
  const scoreVal = document.getElementById("scoreDynamicVal");
  const verdictQuote = document.getElementById("scoreVerdictQuote");
  const secretSection = document.getElementById("secretSection");

  if (!scoreSection) return;

  scoreSection.style.display = "block";
  scoreSection.scrollIntoView({ behavior: "smooth", block: "center" });

  // Animate number counting upward
  let currentVal = 0;
  const counterInterval = setInterval(() => {
    if (currentVal <= score) {
      if (scoreVal) scoreVal.textContent = currentVal;
      currentVal++;
    } else {
      clearInterval(counterInterval);
    }
  }, 100);

  // Dynamic Verdict Quote
  if (verdictQuote) {
    if (score >= 9) {
      verdictQuote.textContent = "“Incredible! You remember every tiny detail of this journey. You are pure magic, Budduu. 👀❤️”";
    } else if (score >= 7) {
      verdictQuote.textContent = "“Pretty amazing! You have an incredible memory for our story. ❤️”";
    } else if (score >= 5) {
      verdictQuote.textContent = "“Not bad at all! But hey, looks like we need to make even more memories together.”";
    } else {
      verdictQuote.textContent = "“Koi baat nahi... iska matlab hume pichle saare moments phir se saath me jeene padenge! 👀❤️”";
    }
  }

  // Unlock Experience 3 (Secret Question)
  setTimeout(() => {
    if (secretSection) secretSection.style.display = "block";
  }, 1400);
}

/**
 * EXPERIENCE 3: Secret Question & Direct Gmail Dispatch to shazan1729@gmail.com
 */
function initSecretQuestionExperience(alreadyCompleted) {
  const openBtn = document.getElementById("openSecretBtn");
  const gateIntro = document.getElementById("secretGateIntro");
  const formBox = document.getElementById("secretRevealedForm");
  const form = document.getElementById("secretInputForm");
  const textarea = document.getElementById("secretAnswerInput");
  const submitBtn = document.getElementById("submitSecretBtn");
  const submitBtnText = document.getElementById("submitBtnText");
  const savedToast = document.getElementById("secretSavedToast");

  if (!openBtn) return;

  // Restore stored answer if already answered earlier
  let savedAnswer = "";
  try {
    savedAnswer = localStorage.getItem("budduu_day4_secret_answer") || "";
  } catch (e) {}

  if (alreadyCompleted || savedAnswer) {
    if (gateIntro) gateIntro.style.display = "none";
    if (formBox) formBox.style.display = "block";
    if (savedAnswer && textarea) {
      textarea.value = savedAnswer;
      textarea.disabled = true;
      if (submitBtn) submitBtn.style.display = "none";
      if (savedToast) savedToast.style.display = "block";
      hasSubmittedSecret = true;
    }
  }

  openBtn.addEventListener("click", () => {
    if (gateIntro) gateIntro.style.display = "none";
    if (formBox) formBox.style.display = "block";
    if (textarea) textarea.focus();
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const answer = textarea ? textarea.value.trim() : "";
      if (!answer) return;

      // 1. Show romantic sending state on the button
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnText) submitBtnText.textContent = "SENDING TO SHAZAN... 💌";

      // 2. Local Storage me backup save karein
      try {
        localStorage.setItem("budduu_day4_secret_answer", answer);
      } catch (err) {}

      // 3. Send email directly to shazan1729@gmail.com via FormSubmit AJAX API
      try {
        await fetch("https://formsubmit.co/ajax/shazan1729@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            _subject: "💌 Budduu's Day 4 Secret Memory Answer!",
            _captcha: "false", // Disables captcha for seamless delivery
            from_name: "Budduu",
            question: "If you could keep just ONE memory from this entire journey forever, which one would you choose?",
            budduu_answer: answer,
            date_submitted: new Date().toLocaleString()
          })
        });
      } catch (networkError) {
        // Network issue hone par bhi locally safe rahega
        console.warn("Email delivery queued locally:", networkError);
      }

      // 4. Update UI to success toast
      if (textarea) textarea.disabled = true;
      if (submitBtn) submitBtn.style.display = "none";
      if (savedToast) savedToast.style.display = "block";

      hasSubmittedSecret = true;
      checkDay4Completion();
    });
  }
}

/**
 * Completion Criteria:
 * 1. Mini Maze Lock Solved
 * 2. All 10 Quiz questions completed
 * 3. Score revealed
 * 4. Secret question opened and saved
 */
function checkDay4Completion() {
  if (isMazeSolved && hasCompletedQuiz && hasRevealedScore && hasSubmittedSecret) {
    try {
      localStorage.setItem("budduu_day4_completed", "true");
    } catch (e) {}

    renderCompletionView();
  }
}

function renderCompletionView() {
  const compSection = document.getElementById("day4CompletionSection");
  if (compSection && compSection.style.display === "none") {
    compSection.style.display = "block";
    setTimeout(() => {
      compSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 450);
  }
}

/**
 * Enforces Day 5 date guard on Next Day navigation
 */
function initNextDayNavigation() {
  const navNextBtn = document.getElementById("navNextDayBtn");
  const compNextBtn = document.getElementById("completionNextDayBtn");

  const handleNextClick = (e) => {
    const day5Data = (typeof JOURNEY_DAYS !== "undefined")
      ? JOURNEY_DAYS.find((d) => d.day === 5)
      : null;

    if (day5Data && typeof isDateUnlocked === "function" && !isDateUnlocked(day5Data.dateStr)) {
      e.preventDefault();
      if (typeof showLockModal === "function") showLockModal(day5Data);
    }
  };

  if (navNextBtn) navNextBtn.addEventListener("click", handleNextClick);
  if (compNextBtn) compNextBtn.addEventListener("click", handleNextClick);
}
