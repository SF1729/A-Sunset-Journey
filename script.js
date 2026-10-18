/* ==========================================================================
   BUDDUU — Homepage Cinematic Logic, Star Canvas & Unlock State Manager
   ========================================================================== */

// 20 October 2026, 12:00 AM IST (Indian Standard Time, UTC+05:30)
const SITE_UNLOCK_TIMESTAMP = new Date("2026-10-16T00:00:00+05:30").getTime();
 
let isHomepageInitialized = false;
let countdownIntervalId = null;

document.addEventListener("DOMContentLoaded", () => {
  // Atmospheric visual effects background me active rahenge
  initStarDustCanvas();
  initMouseParallax();

  // Unlock state & countdown timer evaluate karein
  evaluateSiteUnlockState();
});

/**
 * Checks whether the current time has reached 20 October 2026, 12:00 AM IST.
 */
function evaluateSiteUnlockState() {
  const now = Date.now();
  const isUnlocked = now >= SITE_UNLOCK_TIMESTAMP;

  if (isUnlocked) {
    revealFullHomepage();
  } else {
    // Keep locked state active
    document.documentElement.classList.add("prelaunch-locked");
    document.body.classList.add("prelaunch-locked");

    // Live countdown timer start karein
    startPrelaunchCountdown();
  }
}

/**
 * Live Countdown Timer for locked prelaunch screen
 */
function startPrelaunchCountdown() {
  const daysEl = document.getElementById("timerDays");
  const hoursEl = document.getElementById("timerHours");
  const minsEl = document.getElementById("timerMinutes");
  const secsEl = document.getElementById("timerSeconds");

  function updateTimer() {
    const now = Date.now();
    const distance = SITE_UNLOCK_TIMESTAMP - now;

    // Time khatam hone par website automatically unlock ho jayegi
    if (distance <= 0) {
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
        countdownIntervalId = null;
      }
      revealFullHomepage();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, "0");
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateTimer(); // Pehle second ka delay na ho isliye immediate run
  countdownIntervalId = setInterval(updateTimer, 1000);
}

/**
 * Automatically unlocks the full homepage
 */
function revealFullHomepage() {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }

  document.documentElement.classList.remove("prelaunch-locked");
  document.body.classList.remove("prelaunch-locked");

  if (!isHomepageInitialized) {
    isHomepageInitialized = true;
    renderConnectedTimeline();
    updateJourneyProgress();
    initIntersectionReveal();
    initTimelineSpineScroll();
    initSmoothJourneyScroll();
  }
}

/**
 * High-performance ambient cosmic stardust canvas
 */
function initStarDustCanvas() {
  const canvas = document.getElementById("starsCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const starCount = window.innerWidth <= 768 ? 25 : 60;
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      velocity: Math.random() * 0.25 + 0.08,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseVal: Math.random() * Math.PI
    });
  }

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      star.y -= star.velocity;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }

      star.pulseVal += star.pulseSpeed;
      const currentAlpha = star.alpha * (0.6 + 0.4 * Math.sin(star.pulseVal));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 190, 110, ${currentAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(255, 107, 74, 0.7)";
      ctx.fill();
    });

    requestAnimationFrame(renderStars);
  }

  renderStars();
}

/**
 * Subtle Parallax for atmospheric orbs & hero stage
 */
function initMouseParallax() {
  if (window.innerWidth <= 768) return;

  const content = document.getElementById("heroParallaxContent");
  const orb1 = document.getElementById("parallaxOrb1");
  const orb2 = document.getElementById("parallaxOrb2");
  const orb3 = document.getElementById("parallaxOrb3");

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener("mousemove", (e) => {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    mouseX = (e.clientX - halfWidth) / halfWidth;
    mouseY = (e.clientY - halfHeight) / halfHeight;
  }, { passive: true });

  function renderParallax() {
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;

    if (content) {
      content.style.transform = `translate3d(${currentX * 8}px, ${currentY * 8}px, 0)`;
    }
    if (orb1) {
      orb1.style.transform = `translate3d(calc(-50% + ${currentX * -14}px), ${currentY * -14}px, 0)`;
    }
    if (orb2) {
      orb2.style.transform = `translate3d(${currentX * 12}px, ${currentY * 12}px, 0)`;
    }
    if (orb3) {
      orb3.style.transform = `translate3d(${currentX * -10}px, ${currentY * -10}px, 0)`;
    }

    requestAnimationFrame(renderParallax);
  }

  requestAnimationFrame(renderParallax);
}

/**
 * Updates dynamic timeline progress based on current local date
 */
function updateJourneyProgress() {
  const headlineEl = document.getElementById("progressStatusText");
  const fillEl = document.getElementById("progressBarFill");
  const hintEl = document.getElementById("progressHintText");
  const pillEl = document.getElementById("progressPercentagePill");

  if (!headlineEl || !fillEl || !hintEl || !pillEl || typeof JOURNEY_DAYS === "undefined") return;

  const today = typeof getNormalizedCurrentDate === "function" 
    ? getNormalizedCurrentDate() 
    : new Date();

  const firstDay = new Date(JOURNEY_DAYS[0].dateStr + "T00:00:00");
  const finalDay = new Date(JOURNEY_DAYS[JOURNEY_DAYS.length - 1].dateStr + "T00:00:00");

  let percentage = 0;
  let headline = "";
  let hint = "";

  if (today < firstDay) {
    headline = "THE JOURNEY BEGINS SOON";
    const daysLeft = Math.ceil((firstDay - today) / (1000 * 60 * 60 * 24));
    hint = `Sunset begins in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} on 20 October 2026 ❤️`;
    percentage = 0;
  } else if (today > finalDay) {
    headline = "THE JOURNEY IS COMPLETE ❤️";
    hint = "Budduu's special birthday journey is forever unlocked.";
    percentage = 100;
  } else {
    let currentDayNumber = 1;
    JOURNEY_DAYS.forEach((item) => {
      if (typeof isDateUnlocked === "function" && isDateUnlocked(item.dateStr)) {
        currentDayNumber = item.day;
      }
    });

    percentage = currentDayNumber * 10;
    headline = `DAY ${currentDayNumber} OF 10`;
    hint = `${percentage}% of Budduu's sunset story has been revealed.`;
  }

  setTimeout(() => {
    fillEl.style.width = `${percentage}%`;
  }, 400);

  headlineEl.textContent = headline;
  hintEl.textContent = hint;
  pillEl.textContent = `${percentage}%`;
}

/**
 * Builds the connected 10-day timeline
 */
function renderConnectedTimeline() {
  const container = document.getElementById("timelineCardsContainer");
  if (!container || typeof JOURNEY_DAYS === "undefined") return;

  container.innerHTML = "";
  const today = typeof getNormalizedCurrentDate === "function" 
    ? getNormalizedCurrentDate() 
    : new Date();

  JOURNEY_DAYS.forEach((item, index) => {
    const isUnlocked = typeof isDateUnlocked === "function" ? isDateUnlocked(item.dateStr) : false;
    const isToday = typeof isDateToday === "function" ? isDateToday(item.dateStr) : false;
    const targetDate = new Date(item.dateStr + "T00:00:00");
    const isCompleted = isUnlocked && !isToday && today > targetDate;

    const isLeft = index % 2 === 0;

    const row = document.createElement("div");
    row.className = `timeline-row ${isLeft ? 'left-aligned' : 'right-aligned'} ${isToday ? 'is-current' : ''}`;

    const node = document.createElement("div");
    node.className = "timeline-center-node";
    node.setAttribute("aria-hidden", "true");
    row.appendChild(node);

    const wrapper = document.createElement("div");
    wrapper.className = "timeline-card-wrapper";
    wrapper.dataset.revealIndex = index;

    const card = document.createElement(isUnlocked ? "a" : "div");
    card.className = `timeline-journey-card ${isUnlocked ? 'is-unlocked' : 'is-locked'} ${isToday ? 'is-current' : ''} ${item.day === 1 ? 'is-day-one' : ''}`;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Day 0${item.day}: ${item.title}. ${isUnlocked ? "Unlocked" : "Locked"}`);

    if (isUnlocked) {
      card.href = item.file;
    } else {
      card.addEventListener("click", () => typeof showLockModal === "function" && showLockModal(item));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (typeof showLockModal === "function") showLockModal(item);
        }
      });
    }

    let statusBadgeHtml = "";
    let arrowIndicatorHtml = "";

    if (isUnlocked) {
      if (isToday) {
        statusBadgeHtml = `<span class="card-status-tag tag-current">CURRENT ✨</span>`;
        arrowIndicatorHtml = `<span class="card-arrow-cue">OPEN →</span>`;
      } else if (isCompleted) {
        statusBadgeHtml = `<span class="card-status-tag tag-completed">✓ COMPLETED</span>`;
        arrowIndicatorHtml = `<span class="card-arrow-cue">VISIT →</span>`;
      } else {
        statusBadgeHtml = `<span class="card-status-tag tag-unlocked">UNLOCKED</span>`;
        arrowIndicatorHtml = `<span class="card-arrow-cue">EXPLORE →</span>`;
      }
    } else {
      statusBadgeHtml = `<span class="card-status-tag tag-locked">🔒 LOCKED &bull; ${item.dateDisplay}</span>`;
      arrowIndicatorHtml = `<span class="card-arrow-cue" aria-hidden="true">🔒</span>`;
    }

    const starterBadgeHtml = item.day === 1 
      ? `<span class="day-starter-badge">THE JOURNEY STARTS HERE</span>` 
      : "";

    card.innerHTML = `
      ${starterBadgeHtml}
      <div class="card-header-line">
        <span class="card-numeral-pill">DAY 0${item.day}</span>
        <span class="card-emblem-icon" aria-hidden="true">${isUnlocked ? item.icon : "🔒"}</span>
      </div>
      <div class="card-center-body">
        <h3 class="card-story-title">${item.title}</h3>
        <span class="card-date-badge">${item.dateDisplay}</span>
      </div>
      <div class="card-status-footer">
        ${statusBadgeHtml}
        ${arrowIndicatorHtml}
      </div>
    `;

    wrapper.appendChild(card);
    row.appendChild(wrapper);
    container.appendChild(row);

    if (item.day === 3 || item.day === 6 || item.day === 9) {
      const sep = document.createElement("div");
      sep.className = "timeline-mid-separator";
      sep.setAttribute("aria-hidden", "true");
      sep.innerHTML = `
        <span class="sep-line"></span>
        <span class="sep-sparkle">✦</span>
        <span class="sep-line"></span>
      `;
      container.appendChild(sep);
    }
  });
}

/**
 * Scroll Reveal Animation with IntersectionObserver
 */
function initIntersectionReveal() {
  const cards = document.querySelectorAll(".timeline-card-wrapper");
  if (!cards.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    cards.forEach((card) => card.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.revealIndex, 10) || 0;
        const staggerDelay = (index % 2) * 80;

        setTimeout(() => {
          entry.target.classList.add("is-revealed");
        }, staggerDelay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  });

  cards.forEach((card) => observer.observe(card));
}

/**
 * Dynamically fills the glowing spine as the user scrolls down the timeline
 */
function initTimelineSpineScroll() {
  const timeline = document.getElementById("journeyTimeline");
  const glow = document.getElementById("timelineSpineGlow");
  if (!timeline || !glow) return;

  window.addEventListener("scroll", () => {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const totalHeight = rect.height;
      const visibleScrolled = windowHeight - rect.top;
      const percentage = Math.min(Math.max((visibleScrolled / totalHeight) * 100, 0), 100);
      glow.style.height = `${percentage}%`;
    }
  }, { passive: true });
}

/**
 * Smooth Journey CTA scroll
 */
function initSmoothJourneyScroll() {
  const startBtn = document.getElementById("startJourneyBtn");
  const scrollCue = document.querySelector(".hero-scroll-cue");

  const scrollToJourney = (e) => {
    e.preventDefault();
    const journeyEl = document.getElementById("journey");
    if (journeyEl) {
      journeyEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (startBtn) startBtn.addEventListener("click", scrollToJourney);
  if (scrollCue) scrollCue.addEventListener("click", scrollToJourney);
}
