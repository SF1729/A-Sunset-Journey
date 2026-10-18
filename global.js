/* ==========================================================================
   BUDDUU — 10 DAY BIRTHDAY JOURNEY
   Global Logic, Date Calculation & Modal Controller
   ========================================================================== */

const JOURNEY_START_DATE = "2026-10-16";

const JOURNEY_DAYS = [
  { day: 1, title: "THE BEGINNING", dateStr: "2026-10-16", dateDisplay: "20 OCT 2026", fullDisplay: "20 October 2026", file: "day1.html", icon: "✨" },
  { day: 2, title: "MEMORY LANE", dateStr: "2026-10-16", dateDisplay: "21 OCT 2026", fullDisplay: "21 October 2026", file: "day2.html", icon: "📸" },
  { day: 3, title: "THE SOUNDTRACK", dateStr: "2026-10-16", dateDisplay: "22 OCT 2026", fullDisplay: "22 October 2026", file: "day3.html", icon: "🎵" },
  { day: 4, title: "HOW WELL DO YOU KNOW ME?", dateStr: "2026-10-16", dateDisplay: "23 OCT 2026", fullDisplay: "23 October 2026", file: "day4.html", icon: "💭" },
  { day: 5, title: "THE STORY WE NEVER PLANED", dateStr: "2026-10-16", dateDisplay: "24 OCT 2026", fullDisplay: "24 October 2026", file: "day5.html", icon: "🕰️" },
  { day: 6, title: "THINGS I NEVER SAID", dateStr: "2026-10-16", dateDisplay: "25 OCT 2026", fullDisplay: "25 October 2026", file: "day6.html", icon: "💌" },
  { day: 7, title: "THE DREAM WORLD", dateStr: "2026-10-16", dateDisplay: "26 OCT 2026", fullDisplay: "26 October 2026", file: "day7.html", icon: "🌅" },
  { day: 8, title: "THE FRIENDSHIP FILES", dateStr: "2026-10-16", dateDisplay: "27 OCT 2026", fullDisplay: "27 October 2026", file: "day8.html", icon: "🔍" },
  { day: 9, title: "THE FINAL ESCAPE ROOM", dateStr: "2026-10-16", dateDisplay: "28 OCT 2026", fullDisplay: "28 October 2026", file: "day9.html", icon: "🔐" },
  { day: 10, title: "THE GRAND BIRTHDAY FINALE", dateStr: "2026-10-16", dateDisplay: "29 OCT 2026", fullDisplay: "29 October 2026", file: "day10.html", icon: "🎂" }
];

/**
 * Returns the day title if unlocked, otherwise secret mystery placeholder
 */
function getDayTitle(dayData) {
  if (!dayData) return "";
  return isDateUnlocked(dayData.dateStr) ? dayData.title : "MYSTERY SURPRISE ✨";
}

/**
 * Returns the day emblem icon if unlocked, otherwise lock icon
 */
function getDayIcon(dayData) {
  if (!dayData) return "🔒";
  return isDateUnlocked(dayData.dateStr) ? dayData.icon : "🔒";
}

/**
 * Returns user's local date normalized to midnight.
 * Supports URL param override ?previewDate=YYYY-MM-DD for testing.
 */
function getNormalizedCurrentDate() {
  const params = new URLSearchParams(window.location.search);
  const preview = params.get("previewDate");
  if (preview) {
    const pDate = new Date(preview + "T00:00:00");
    if (!isNaN(pDate.getTime())) return pDate;
  }
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

/**
 * Checks if a specific date string is unlocked based on local midnight time.
 */
function isDateUnlocked(dateStr) {
  const params = new URLSearchParams(window.location.search);
  if (params.get("unlockAll") === "true") return true;

  const targetDate = new Date(dateStr + "T00:00:00");
  const today = getNormalizedCurrentDate();
  return today >= targetDate;
}

/**
 * Calculates remaining days until target date.
 */
function getDaysUntil(dateStr) {
  const targetDate = new Date(dateStr + "T00:00:00");
  const today = getNormalizedCurrentDate();
  const diffTime = targetDate - today;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Checks if target date is specifically today.
 */
function isDateToday(dateStr) {
  const targetDate = new Date(dateStr + "T00:00:00");
  const today = getNormalizedCurrentDate();
  return (
    today.getFullYear() === targetDate.getFullYear() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getDate() === targetDate.getDate()
  );
}

/**
 * Global Lock Modal System
 */
function injectGlobalLockModal() {
  if (document.getElementById("budduuLockModal")) return;

  const modalHtml = `
    <div id="budduuLockModal" class="lock-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="lock-modal-box">
        <div class="lock-modal-glow"></div>
        <div class="lock-modal-icon" aria-hidden="true">🔒</div>
        <h3 id="modalTitle" class="lock-modal-title">Not Yet, Budduu...</h3>
        <p class="lock-modal-subtitle">This little moment isn't ready yet.<br>This part of the journey is still waiting for you. ❤️</p>
        <div class="lock-modal-date-pill" id="modalUnlockDate">Unlocks 20 October 2026</div>
        <div class="lock-modal-countdown" id="modalCountdown">Only a little more...</div>
        <button type="button" class="btn btn-primary lock-modal-close-btn" id="modalCloseBtn">OKAY ❤️</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modal = document.getElementById("budduuLockModal");
  const closeBtn = document.getElementById("modalCloseBtn");

  closeBtn.addEventListener("click", closeLockModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLockModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeLockModal();
    }
  });
}

function showLockModal(dayData) {
  injectGlobalLockModal();
  const modal = document.getElementById("budduuLockModal");
  const unlockDateEl = document.getElementById("modalUnlockDate");
  const countdownEl = document.getElementById("modalCountdown");

  const daysRemaining = getDaysUntil(dayData.dateStr);

  unlockDateEl.textContent = `Unlocks: ${dayData.fullDisplay}`;
  if (daysRemaining === 1) {
    countdownEl.textContent = "Only 1 more day to wait...";
  } else if (daysRemaining > 1) {
    countdownEl.textContent = `Only ${daysRemaining} more days...`;
  } else {
    countdownEl.textContent = "Unlocking very soon...";
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLockModal() {
  const modal = document.getElementById("budduuLockModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

/**
 * Guard for individual day pages: prevents unauthorized access before unlock date.
 * Does not disclose secret title upon redirection.
 */
function guardDayPage(dayNumber) {
  const dayData = JOURNEY_DAYS.find((d) => d.day === dayNumber);
  if (!dayData) return;

  if (!isDateUnlocked(dayData.dateStr)) {
    alert(`🔒 Day ${dayNumber} unlocks on ${dayData.fullDisplay}.\nRedirecting you back to the Journey...`);
    const searchParams = window.location.search;
    window.location.replace(`index.html${searchParams}#journey`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  injectGlobalLockModal();
});
