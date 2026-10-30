/* ==========================================================================
   BUDDUU — DAY 10: “THE GRAND FINALE”
   Sequential Stage Controller, All 5 Wishes Collector & Persistent State
   Unlock: Exactly 29 October 2026, 1:00 PM Asia/Kolkata (IST, UTC+05:30)
   ========================================================================== */

(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     1. TIMEZONE-SAFE UNLOCK CONFIGURATION (1:00 PM IST = 13:00:00+05:30)
     -------------------------------------------------------------------------- */
  const DAY10_UNLOCK_ISO = "2026-10-29T13:00:00+05:30";
  const DAY10_UNLOCK_TIME_MS = new Date(DAY10_UNLOCK_ISO).getTime();

  /* --------------------------------------------------------------------------
     FUTURE GIFT UNLOCK CONFIGURATION (ASIA/KOLKATA TIMEZONE: UTC+05:30)
     -------------------------------------------------------------------------- */
  const FUTURE_GIFT_UNLOCK_ISO = "2026-11-23T18:00:00+05:30";
  const FUTURE_GIFT_UNLOCK_TIME_MS = new Date(FUTURE_GIFT_UNLOCK_ISO).getTime();

  let lockCountdownTimer = null;
  let futureGiftTimerInterval = null;
  let day10Started = false;

  /* --------------------------------------------------------------------------
     2. EDITABLE COPY & DATA STRUCTURES
     -------------------------------------------------------------------------- */
  const THREE_LETTERS_DATA = {
    thankYou: {
      badge: "ENVELOPE 01 // GRATITUDE",
      title: "Thank You For Being In My Life",
      body: [
        "Dear Budduu,",
        "Sabse pehle, dil se thank you. Zindagi me bohot log aate hain aur chale jaate hain, lekin kuch log aate hain aur hamesha ke liye apna bana lete hai or aap ussi category me aate hai, or aapki existance har moment ko special bana deti hain.",
        "Thank you for being my unscripted constant. Jab bhi mujhe kisi se bina dare, bina judge hue baat karni hoti hai, tum wahan hote ho(May be hote the but ab nhi ho 🥲😅). Har us hansi ke liye shukriya jo bina wajah shuru hui, aur har us pal ke liye jo tumhari dosti ne aasan bana diya.",
        "Har us moment ke liye jo maine aapke saath jiya hai har us pal ke liye jo maine feel kiya hai, Apki shoulder ke liye jisne mere sar ka bojh sambhala hai, Har us tount ke liye jo aapne hame mara hai ..",
        "Har us shorma date ke liye jo humne kiya hai, har us long drive ke liye jo humne kiya hai , har us letter ke liye jo aapne diya hai, har us hug ke liye jo humne maga hai ",
        "Genuinely Thanks alot for every moment that I live with you ....",
        "Ek Year me may be 2 year me mere liye meri puri duniya banna aasaan nhi tha par aapne hame har baar sambhala hai har baar Thak You So Muchhhhh....."
      ]
    },
    iHope: {
      badge: "ENVELOPE 02 // WISHES & DREAMS",
      title: "My Hopes For Your Tomorrow",
      body: [
        "Dear Budduu,",
        "Aaj tumhare birthday par meri bas yahi dua hai ki aane wala har din tumhare chehre par wahi pyari si muskaan lekar aaye jo tum mujhe dete ho.",
        "I hope you achieve every single dream you've ever whispered to the stars. I hope you find me who value your kindness, opportunities that recognize your strength, and moments that remind you of how extraordinary you truly are.",
        "I hope ke hamara jo bhi hai Friendship , Bestfriendship , Bhai Chara, Pyaar, Dosti, Takrar, and So On... As it is hi rahe hum hamesha saath rahe har muskil me har khushi me har dukh me har haasi me har gum me har jagah mai tere saath rahu jab tujhe zaruart ho mai rahu jab tujhe zarurat na ho tab bhi mai hi rahu ...",
        "Ha mana mai sar kahata hu mana ke mai over karta hu as per you thinking, Par Par Par mai pyaar bhi utna hi karta huu yaar or hope karta hu ke tu bhi utna hi kare jitna mai karta hu tujhse ....\n I Hope ke hamari dosti hamesha as it is hi rahe (AGAR AAP DISTANCE AANE PAR REBOOT NA HO TAB....)"
      ]
    },
    rememberThis: {
      badge: "ENVELOPE 03 // A TIMELESS REASSURANCE",
      title: "Remember This Whenever Life Gets Heavy",
      body: [
        "Dear Budduu,",
        "Jab bhi kabhi lagne lage ki sab kuch bohot fast chal raha hai, ya jab kabhi akelapan mehsus ho—is letter ko wapas khol kar padhna.",
        "Remember that you have a safe sanctuary in this friendship. Chahe waqt kitna bhi badal jaye, tumhare paas ek aisa dost hamesha rahega jo tumhari taang bhi khinchega aur sabse aage khade hokar tumhe cheer bhi karega. You are never alone.",
        "I am with you everywhere (Agar tu bhule na toh 🥲😅..)",
        "I Love You ... Hamesha tha hamesha hu hamesha rahugaa......"
      ]
    }
  };

  const WORLD_BEACONS_DATA = {
    dreams: {
      glyph: "🌟",
      title: "The Sky of Dreams",
      body: "Every dream you've ever held—big or small—matters. Never let the noise or rush of the world convince you that your hopes are too far away to reach."
    },
    memories: {
      glyph: "📷",
      title: "The Archive of Moments",
      body: "From inside jokes that make zero sense to anyone else, to the quiet talks that calmed anxious days. These are the treasures we keep forever."
    },
    words: {
      glyph: "✉️",
      title: "The Unspoken Honesty",
      body: "True friendship doesn't need constant reminders, If you understand that distance means no reboot. It lives in the peaceful understanding that no matter how much time passes, nothing real ever fades."
    },
    moments: {
      glyph: "🌙",
      title: "The Calm in the Chaos",
      body: "Whenever the world feels overwhelming, remember this sunset. Take a breath and know there's always a friend rooting for you, always."
    }
  };

  const FIVE_WISHES_DATA = {
    happiness: {
      title: "Happiness Star ✨",
      glyph: "✨",
      badge: "STAR 01 // HAPPINESS",
      accent: "linear-gradient(90deg, #FFB347, #FF8A4C)",
      wish: "Meri sabse pehli wish tumhari smile ke liye hai. Zindagi me chahe kitna bhi stress ho, main chahta hoon ki tumhari wo be-parwah aur khul ke hansne wali aadat kabhi na badle. Har din kisi na kisi wajah se tumhare chehre par ek sachhi khushi zaroor khile. ❤️"
    },
    peace: {
      title: "Peace Star 🕊️",
      glyph: "🕊️",
      badge: "STAR 02 // PEACE",
      accent: "linear-gradient(90deg, #60a5fa, #a78bfa)",
      wish: "Doosri wish hai tumhare sukoon ke liye. Kabhi kabhi dimag bohot thak jata hai aur dil bechain ho jata hai. Meri dua hai ki jab bhi aisi raat aaye, tumhe ek gehri shanti aur sukoon mile. Never overthink, Budduu… sab kuch hamesha theek ho jayega. 🕊️✨"
    },
    success: {
      title: "Success Star 🏆",
      glyph: "🏆",
      badge: "STAR 03 // SUCCESS",
      accent: "linear-gradient(90deg, #f59e0b, #ef4444)",
      wish: "Teesri wish tumhare har ek dream aur goal ke liye. Tum me jo dedication aur capability hai, uspar mujhe poora bharosa hai. Tum jo bhi karna chaho, usme tumhe aisi kamyabi mile jo tumhare saare efforts ko celebrate kare. You are built for greatness! 🏆⭐"
    },
    courage: {
      title: "Courage Star 🦁",
      glyph: "🦁",
      badge: "STAR 04 // COURAGE",
      accent: "linear-gradient(90deg, #ff6b4a, #ff416c)",
      wish: "Chauthi wish hai us himmat ke liye jo mushkil waqt me kaam aati hai. Jab bhi raste anjaan lagein ya koi decision lene me dar lage, ye yaad rakhna ki tum bohot strong ho. Kabhi rukna mat, kabhi darna mat… tumhara dost hamesha tumhare peeche khada hai. 🦁💪"
    },
    memories: {
      title: "Beautiful Memories Star 📸",
      glyph: "📸",
      badge: "STAR 05 // MEMORIES",
      accent: "linear-gradient(90deg, #d946ef, #ffb347)",
      wish: "Paanchvi wish hai aane wale saare khoobsurat lamhon ke liye. Aage chal kar aisi yaadein banein jinhe 10 saal baad bhi yaad karke hum dono bina wajah haste rahein. Zindagi tumhare safar ko nayi stories aur pyari yaadon se bhar de. 📸💛"
    }
  };

  const MAIN_LETTER_PARAGRAPHS = [
    "Dear Budduu, Happy Birthday! ❤️ Aaj finally 29 October aa gaya—wo din jiska countdown humne pichle 10 din se shuru kiya tha.",
    "Jab maine ye website banana shuru kiya tha, to mera ek hi maqsad tha: main chahta tha ki tumhara ye birthday sirf ek ordinary din ki tarah na guzar jaye. Har ek din, har ek unlock, aur har ek memory is baat ka reminder tha ki tum meri life me kitni zyada special ho.",
    "Hum dono ne kitne unscripted moments jiye hain—wo be-matlab ki baaton par hansna, ek doosre ki taang khinchna, aur jab life thodi tough lagti thi to bina judge kiye ek doosre ko sunna. Ye choti choti baatein hi to hamari dosti ko itna khoobsurat banati hain.",
    "Main hamesha dua karta hoon ki tumhari life me hamesha khushiyan rahein or mai bhi rahu, tumhare saare dreams poore hon, aur tumhari wo pyari si smile kabhi kam na ho. Chahe life kitni bhi busy ho jaye ya hum kitne bhi aage nikal jayein, meri taraf se ye dosti hamesha aisi hi rahegi.",
    "Thank you for being my constant, my favorite listener, and the best friend anyone could ask for. Have the happiest birthday, Budduu! 🎂✨",
    "— Tera Tedduu, Shahid 🧡"
  ];

  const OPEN_WHEN_DATA = {
    feelLow: {
      badge: "OPEN WHEN YOU FEEL LOW 🥺",
      title: "You Are Never Alone, Budduu",
      accent: "linear-gradient(90deg, #a78bfa, #c084fc)",
      body: [
        "Budduu, agar aaj ka din thoda bhari lag raha hai, toh bas ek gehri saans lo aur ye yaad rakho: tumhara har din perfect hona zaroori nahi hai. Zindagi me thoda thakna, thoda udas hona bilkul normal hai.",
        "Par ye mat bhoolna ki tum kitne strong ho, aur tumhare paas ek dost hai jo hamesha bina kisi judgement ke tumhari baat sunne ke liye ready khada hai. Tum akele nahi ho, kabhi bhi nahi. Sab theek ho jayega. 🤍"
      ]
    },
    needSmile: {
      badge: "OPEN WHEN YOU NEED A SMILE 😊",
      title: "Smile Karo Meri Nautanki!",
      accent: "linear-gradient(90deg, #fbbf24, #f59e0b)",
      body: [
        "Oye Budduu! Itna serious chehra kyun banaya hua hai? Smile karo jaldi! Agar koi funny joke nahi mil raha toh hamari purani ajeeb baatein yaad kar lo—kaise hum be-matlab ki baaton par bina ruke haste rehte the.",
        "Zindagi me chahe jitna bhi drama ho jaye, tumhari ye hansi bohot keemti hai. Haso aur thoda chill karo, meri favorite nautanki! 😂✨"
      ]
    },
    cantSleep: {
      badge: "OPEN WHEN YOU CAN'T SLEEP 🌙",
      title: "Rest Your Mind, You Did Well",
      accent: "linear-gradient(90deg, #60a5fa, #818cf8)",
      body: [
        "Raat ke 2 baj gaye aur neend nahi aa rahi? Dimag me hazaron thoughts chal rahe hain na? Phone ko thoda side rakho, aankhein band karo aur socho ki har nayi subah ek fresh restart lekar aati hai.",
        "Kal ki fikar kal par chhod do. Aaj ka din khatam ho chuka hai, and you did your best. Rest well, Budduu. Taare aur chaand guard duty par hain, aaram se so jao. 🌠😴"
      ]
    },
    achieveBig: {
      badge: "OPEN WHEN YOU ACHIEVE SOMETHING BIG 🏆",
      title: "DEKHA?! I Knew You Could Do It!",
      accent: "linear-gradient(90deg, #f59e0b, #ef4444)",
      body: [
        "DEKHA?! Mujhe pehle se pata tha ki tum kar loge! I am SO incredibly proud of you! Jab tum mehnat kar rahe the, shayad kabhi kabhi doubt hota hoga, par aaj dekho tumne prove kar diya.",
        "Is moment ko achhe se celebrate karo, treat khao, aur khud ko credit dena mat bhoolna. Tum is success ke poore haqdaar ho. Party kab de rahe ho waise? 🥳🎉"
      ]
    },
    needReminder: {
      badge: "OPEN WHEN YOU NEED A REMINDER 💛",
      title: "Just In Case You Forgot How Special You Are",
      accent: "linear-gradient(90deg, #f43f5e, #fb7185)",
      body: [
        "Just a gentle reminder, Budduu: Tum jaisa hai, bilkul perfect ho. Tumhari kindness, tumhari thoughtfulness, aur tumhari dosti bohot rare hai.",
        "Kabhi bhi kisi ke kehne par ya kisi mushkil waqt me apni worth par shaq mat karna. You matter so much to the people who love you—aur unme sabse pehla naam mera hai. Always rooting for you! 🌟"
      ]
    }
  };

  /* --------------------------------------------------------------------------
     3. CONSTANTS, STORAGE & INITIAL STATE
     -------------------------------------------------------------------------- */
  const STORAGE_KEY = "budduu_day10_state_v1";

  const DEFAULT_STATE = {
    doorUnlocked: false,
    currentExperience: 1,
    completedExperiences: [],
    recapCurrentIndex: 0,
    lettersRead: [],
    keepsakeUnboxed: false,
    worldItemsDiscovered: [],
    wishesStarsDiscovered: [],
    wishesSubmitted: {},
    allWishesMailed: false,
    letterParagraphRevealed: 0,
    songListened: false,
    candlesBlown: [],
    celebrationTriggered: false,
    openWhenRead: [],
    futureGiftRevealed: false,
    isCompleted: false
  };

  const STAGE_IDS = [
    "experienceFinalDoor",        // 1
    "experienceRecap",            // 2
    "experienceThreeLetters",     // 3
    "experienceKeepsakeGift",     // 4
    "experienceWorld",            // 5
    "experienceFiveWishes",       // 6
    "experienceMainLetter",       // 7
    "experienceOurSong",          // 8
    "experienceCelebration",      // 9
    "experienceSunsetSignoff",    // 10
    "experienceOpenWhen",         // 11
    "experienceFutureGift"        // 12
  ];

  let gameState = Object.assign({}, DEFAULT_STATE);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ambientParticlesFrame = null;
  let celebrationCanvasFrame = null;
  let isCelebrationRunning = false;
  let audioFadeInterval = null;

  let midnightCanvasFrame = null;
  let isMidnightRunning = false;
  let midnightResizeBound = false;

  let activeStarKey = null;
  let isSongScrubbing = false;

  /* --------------------------------------------------------------------------
     4. PERSISTENT STATE LOAD & SAVE
     -------------------------------------------------------------------------- */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
          gameState = Object.assign({}, DEFAULT_STATE, parsed);
          gameState.completedExperiences = Array.isArray(gameState.completedExperiences) ? gameState.completedExperiences : [];
          gameState.lettersRead = Array.isArray(gameState.lettersRead) ? gameState.lettersRead : [];
          gameState.worldItemsDiscovered = Array.isArray(gameState.worldItemsDiscovered) ? gameState.worldItemsDiscovered : [];
          gameState.wishesStarsDiscovered = Array.isArray(gameState.wishesStarsDiscovered) ? gameState.wishesStarsDiscovered : [];
          gameState.wishesSubmitted = (typeof gameState.wishesSubmitted === "object" && gameState.wishesSubmitted !== null) ? gameState.wishesSubmitted : {};
          gameState.candlesBlown = Array.isArray(gameState.candlesBlown) ? gameState.candlesBlown : [];
          gameState.openWhenRead = Array.isArray(gameState.openWhenRead) ? gameState.openWhenRead : [];
        }
      }
    } catch (err) {
      console.warn("Storage read error, using defaults:", err);
      gameState = Object.assign({}, DEFAULT_STATE);
    }

    try {
      if (localStorage.getItem("budduu_day10_lock_solved") === "true") {
        gameState.doorUnlocked = true;
      }
      if (localStorage.getItem("budduu_day10_completed") === "true") {
        gameState.doorUnlocked = true;
        gameState.isCompleted = true;
        gameState.keepsakeUnboxed = true;
        gameState.songListened = true;
      }
    } catch (e) {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      if (gameState.doorUnlocked) {
        localStorage.setItem("budduu_day10_lock_solved", "true");
      }
      if (gameState.isCompleted) {
        localStorage.setItem("budduu_day10_completed", "true");
      }
    } catch (err) {
      console.warn("Storage save error:", err);
    }
  }

  /* --------------------------------------------------------------------------
     5. TIMEZONE-SAFE UNLOCK & LIVE COUNTDOWN
     -------------------------------------------------------------------------- */
  function getDay10UnlockTimestamp() {
    if (typeof JOURNEY_DAYS !== "undefined" && Array.isArray(JOURNEY_DAYS)) {
      const d10 = JOURNEY_DAYS.find(function (item) { return item.day === 10; });
      if (d10) {
        if (typeof d10.unlockTimestamp === "number") return d10.unlockTimestamp;
        if (typeof d10.unlockIso === "string") {
          const parsed = new Date(d10.unlockIso).getTime();
          if (!isNaN(parsed)) return parsed;
        }
      }
    }
    return DAY10_UNLOCK_TIME_MS;
  }

  function formatTimeRemaining(ms) {
    if (ms <= 0) return "00h 00m 00s";
    const totalSecs = Math.floor(ms / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const pad = function (n) { return (n < 10 ? "0" : "") + n; };

    if (days > 0) {
      return days + "d " + pad(hours) + "h " + pad(mins) + "m " + pad(secs) + "s";
    }
    return pad(hours) + "h " + pad(mins) + "m " + pad(secs) + "s";
  }

  function updateCountdownPill(countdownEl, targetMs) {
    const diff = targetMs - Date.now();
    if (diff <= 0) {
      if (countdownEl) countdownEl.textContent = "✨ Unlocking your Grand Finale...";
      return false;
    }
    if (countdownEl) {
      countdownEl.textContent = "⏳ Unlocks in " + formatTimeRemaining(diff) + " (29 Oct, 1:00 PM IST)";
    }
    return true;
  }

  function startLockCountdown(targetMs) {
    if (lockCountdownTimer) {
      clearInterval(lockCountdownTimer);
      lockCountdownTimer = null;
    }

    const countdownEl = document.getElementById("dateLockCountdown");
    const isStillLocked = updateCountdownPill(countdownEl, targetMs);
    if (!isStillLocked) {
      unlockAndStartDay10();
      return;
    }

    lockCountdownTimer = setInterval(function () {
      const active = updateCountdownPill(countdownEl, targetMs);
      if (!active) {
        clearInterval(lockCountdownTimer);
        lockCountdownTimer = null;
        unlockAndStartDay10();
      }
    }, 1000);
  }

  function unlockAndStartDay10() {
    if (lockCountdownTimer) {
      clearInterval(lockCountdownTimer);
      lockCountdownTimer = null;
    }

    const dateLockedView = document.getElementById("day10DateLockedView");
    const unlockedView = document.getElementById("day10UnlockedView");

    if (dateLockedView) dateLockedView.style.display = "none";
    if (unlockedView) unlockedView.style.display = "block";

    if (!day10Started) {
      day10Started = true;
      loadState();
      initEventHandlers();
      startAmbientParticles();

      if (gameState.isCompleted) {
        showExperience("experienceSunsetSignoff", false);
      } else if (gameState.doorUnlocked) {
        showExperience(Math.max(2, gameState.currentExperience), false);
      } else {
        showExperience(1, false);
      }
    }
  }

  /* --------------------------------------------------------------------------
     6. RESILIENT STAGE CONTROLLER (1..12)
     -------------------------------------------------------------------------- */
  function showExperience(stage, shouldScroll) {
    let stageIndex = typeof stage === "number" ? stage : (STAGE_IDS.indexOf(stage) + 1);
    if (stageIndex < 1 || stageIndex > STAGE_IDS.length) return;

    const targetStageId = STAGE_IDS[stageIndex - 1];

    if (targetStageId !== "experienceOurSong") {
      pauseOurSong();
    }
    if (targetStageId !== "experienceCelebration") {
      fadeOutAudio(600);
    }
    if (targetStageId !== "experienceFutureGift") {
      stopGiftCountdownAudio();
    }

    gameState.currentExperience = stageIndex;
    if (!gameState.completedExperiences.includes(stageIndex)) {
      gameState.completedExperiences.push(stageIndex);
    }
    saveState();

    STAGE_IDS.forEach(function (id, idx) {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = (idx + 1 === stageIndex) ? "block" : "none";
      }
    });

    onEnterExperience(stageIndex);

    if (shouldScroll !== false) {
      const activeEl = document.getElementById(targetStageId);
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    }
  }

  function advanceExperience() {
    if (gameState.currentExperience < STAGE_IDS.length) {
      showExperience(gameState.currentExperience + 1, true);
    }
  }

  function onEnterExperience(stageIndex) {
    switch (stageIndex) {
      case 1: renderExperience1(); break;
      case 2: break;
      case 3: renderExperience3(); break;
      case 4: renderExperience4(); break;
      case 5: renderExperience5(); break;
      case 6: renderExperienceFiveWishes(); break;
      case 7: renderExperience6(); break;
      case 8: renderExperienceOurSong(); break;
      case 9: renderExperienceCelebration(); break;
      case 10: renderExperienceSunsetSignoff(); break;
      case 11: renderExperienceOpenWhen(); break;
      case 12: renderExperienceFutureGift(); break;
    }
  }

  /* --------------------------------------------------------------------------
     7. EXPERIENCES 1 TO 5
     -------------------------------------------------------------------------- */
  function renderExperience1() {
    const chassis = document.getElementById("goldenDoorChassis");
    const statusText = document.getElementById("finalDoorStatus");
    const quoteReveal = document.getElementById("doorEmotionalReveal");

    if (chassis && gameState.doorUnlocked) {
      chassis.classList.add("is-open");
      if (statusText) statusText.textContent = "The final door is open. Welcome to your day!";
      if (quoteReveal) quoteReveal.style.display = "block";
    }
  }

  function handleUnlockDoor() {
    const chassis = document.getElementById("goldenDoorChassis");
    const statusText = document.getElementById("finalDoorStatus");
    const quoteReveal = document.getElementById("doorEmotionalReveal");
    const btn = document.getElementById("btnUnlockFinalDoor");

    if (btn) btn.disabled = true;
    if (chassis) chassis.classList.add("is-open");
    if (quoteReveal) quoteReveal.style.display = "block";

    if (statusText) {
      statusText.textContent = "The golden key turns... Welcome to your birthday, Budduu! ❤️";
    }

    playSyntheticChime([440, 554.37, 659.25, 880]);

    gameState.doorUnlocked = true;
    saveState();

    setTimeout(function () {
      advanceExperience();
    }, 2000);
  }

  function handleReplayRecap() {
    const track = document.getElementById("recapCardsTrack");
    if (track) {
      track.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
  }

  function renderExperience3() {
    const counter = document.getElementById("lettersReadCounter");
    if (counter) {
      counter.textContent = gameState.lettersRead.length + " OF 3 LETTERS OPENED";
    }

    const flagMap = {
      thankYou: "flagThankYou",
      iHope: "flagIHope",
      rememberThis: "flagRememberThis"
    };

    const btnMap = {
      thankYou: "btnOpenLetterThankYou",
      iHope: "btnOpenLetterIHope",
      rememberThis: "btnOpenLetterRememberThis"
    };

    Object.keys(flagMap).forEach(function (key) {
      const isRead = gameState.lettersRead.includes(key);
      const flagEl = document.getElementById(flagMap[key]);
      const btnEl = document.getElementById(btnMap[key]);
      if (flagEl && isRead) flagEl.textContent = "OPENED ✓";
      if (btnEl && isRead) btnEl.classList.add("is-read");
    });

    const proceedBtn = document.getElementById("btnProceedToKeepsake");
    if (proceedBtn) {
      proceedBtn.style.display = gameState.lettersRead.length >= 3 ? "inline-block" : "none";
    }
  }

  function openLetterModal(letterKey) {
    const data = THREE_LETTERS_DATA[letterKey];
    if (!data) return;

    const overlay = document.getElementById("letterModalOverlay");
    const badge = document.getElementById("letterModalBadge");
    const title = document.getElementById("letterModalTitle");
    const body = document.getElementById("letterModalBody");

    if (badge) badge.textContent = data.badge;
    if (title) title.textContent = data.title;
    if (body) {
      body.innerHTML = "";
      data.body.forEach(function (paragraph) {
        const p = document.createElement("p");
        p.textContent = paragraph;
        body.appendChild(p);
      });
    }

    if (!gameState.lettersRead.includes(letterKey)) {
      gameState.lettersRead.push(letterKey);
      saveState();
      renderExperience3();
    }

    if (overlay) {
      overlay.style.display = "flex";
      overlay.focus();
    }
  }

  function closeLetterModal() {
    const overlay = document.getElementById("letterModalOverlay");
    if (overlay) overlay.style.display = "none";
  }

  function renderExperience4() {
    const chassis = document.getElementById("giftBoxChassis");
    const reveal = document.getElementById("giftKeepsakeReveal");
    if (gameState.keepsakeUnboxed) {
      if (chassis) chassis.style.display = "none";
      if (reveal) reveal.style.display = "block";
    }
  }

  function handleUnboxGift() {
    const chassis = document.getElementById("giftBoxChassis");
    const reveal = document.getElementById("giftKeepsakeReveal");

    playSyntheticChime([523.25, 659.25, 783.99, 1046.5]);

    if (chassis) chassis.style.display = "none";
    if (reveal) {
      reveal.style.display = "block";
      reveal.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    }

    gameState.keepsakeUnboxed = true;
    saveState();
  }

  function renderExperience5() {
    const counter = document.getElementById("worldDiscoveryCounter");
    if (counter) {
      counter.textContent = gameState.worldItemsDiscovered.length + " OF 4 OBJECTS DISCOVERED";
    }

    const items = ["dreams", "memories", "words", "moments"];
    items.forEach(function (key) {
      const capKey = key.charAt(0).toUpperCase() + key.slice(1);
      const btn = document.getElementById("worldItem" + capKey);
      const status = document.getElementById("status" + capKey);
      const isDiscovered = gameState.worldItemsDiscovered.includes(key);

      if (btn && isDiscovered) btn.classList.add("is-discovered");
      if (status && isDiscovered) status.textContent = "DISCOVERED ✓";
    });

    const isAllFour = gameState.worldItemsDiscovered.length >= 4;
    const constellation = document.getElementById("heartConstellationWrap");
    if (constellation) {
      constellation.style.display = isAllFour ? "block" : "none";
    }

    const proceedBtn = document.getElementById("btnProceedToWishes");
    if (proceedBtn) {
      proceedBtn.style.display = isAllFour ? "inline-block" : "none";
    }
  }

  function handleDiscoverWorldItem(itemKey) {
    const data = WORLD_BEACONS_DATA[itemKey];
    if (!data) return;

    const revealCard = document.getElementById("worldItemRevealCard");
    const glyph = document.getElementById("worldItemGlyph");
    const title = document.getElementById("worldItemTitle");
    const body = document.getElementById("worldItemBody");

    if (glyph) glyph.textContent = data.glyph;
    if (title) title.textContent = data.title;
    if (body) body.textContent = data.body;

    if (!gameState.worldItemsDiscovered.includes(itemKey)) {
      gameState.worldItemsDiscovered.push(itemKey);
      playSyntheticChime([587.33, 739.99]);
      saveState();
      renderExperience5();
    }

    if (revealCard) {
      revealCard.style.display = "block";
      revealCard.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
    }
  }

  /* --------------------------------------------------------------------------
     8. EXPERIENCE 6: 5 COMPULSORY WISHES COLLECTOR (ALL 5 WISHES IN 1 EMAIL)
     -------------------------------------------------------------------------- */
  function renderExperienceFiveWishes() {
    const starKeys = ["happiness", "peace", "success", "courage", "memories"];
    
    // Check kitni wishes likhi aur lock hui hain
    const submittedCount = starKeys.filter(function(k) {
      return gameState.wishesSubmitted && gameState.wishesSubmitted[k] && gameState.wishesSubmitted[k].trim().length > 0;
    }).length;

    const counter = document.getElementById("wishesStarsCounter");
    if (counter) {
      counter.textContent = submittedCount + " OF 5 WISHES LOCKED WITH LOVE ✨";
    }

    starKeys.forEach(function (key) {
      const btn = document.getElementById("starBtn_" + key);
      const status = document.getElementById("starStatus_" + key);
      const isDiscovered = gameState.wishesStarsDiscovered.includes(key);
      const isSubmitted = gameState.wishesSubmitted && gameState.wishesSubmitted[key];

      if (btn && isDiscovered) btn.classList.add("is-discovered");
      if (status) {
        if (isSubmitted) {
          status.textContent = "WISH LOCKED 💌";
          status.style.color = "#52e396";
        } else if (isDiscovered) {
          status.textContent = "WISH PENDING ✍️";
          status.style.color = "#ffb347";
        } else {
          status.textContent = "LOCKED STAR";
          status.style.color = "";
        }
      }
    });

    // Jab tak 5 wishes submit na hon, aage nahi ja sakte!
    const allFiveSubmitted = submittedCount >= 5;
    const constellation = document.getElementById("wishesHeartConstellationWrap");
    if (constellation) constellation.style.display = allFiveSubmitted ? "block" : "none";

    const proceedBtn = document.getElementById("btnProceedFromWishesToLetter");
    if (proceedBtn) {
      proceedBtn.style.display = allFiveSubmitted ? "inline-block" : "none";
      if (allFiveSubmitted) {
        proceedBtn.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
      }
    }
  }

  function openWishStarModal(starKey) {
    const data = FIVE_WISHES_DATA[starKey];
    if (!data) return;

    activeStarKey = starKey;

    const overlay = document.getElementById("wishModalOverlay");
    const badge = document.getElementById("wishModalBadge");
    const title = document.getElementById("wishModalTitle");
    const msg = document.getElementById("wishModalMessage");
    const accent = document.getElementById("wishModalTopAccent");
    const textarea = document.getElementById("budduuWishInput");
    const statusBanner = document.getElementById("wishSubmissionStatus");
    const submitBtn = document.getElementById("btnSubmitWish");
    const btnLabel = document.getElementById("btnSubmitWishLabel");

    if (badge) badge.textContent = data.badge;
    if (title) title.textContent = data.title;
    if (msg) msg.textContent = data.wish;
    if (accent) accent.style.background = data.accent;

    if (!gameState.wishesStarsDiscovered.includes(starKey)) {
      gameState.wishesStarsDiscovered.push(starKey);
      playSyntheticChime([523.25, 659.25, 783.99]);
      saveState();
    }

    if (gameState.wishesSubmitted && gameState.wishesSubmitted[starKey]) {
      textarea.value = gameState.wishesSubmitted[starKey];
      textarea.disabled = true;
      submitBtn.disabled = true;
      if (btnLabel) btnLabel.textContent = "WISH LOCKED WITH LOVE 💌";
      statusBanner.className = "wish-status-banner is-success";
      statusBanner.textContent = "✨ Yeh wish safe hai! Baaki stars ki wishes bhi zaroor likho. ❤️";
      statusBanner.style.display = "block";
    } else {
      textarea.value = "";
      textarea.disabled = false;
      submitBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = "SEND MY WISH TO THE STARS 🌟";
      statusBanner.style.display = "none";
    }

    renderExperienceFiveWishes();

    if (overlay) {
      overlay.style.display = "flex";
      overlay.focus();
    }
  }

  function closeWishStarModal() {
    const overlay = document.getElementById("wishModalOverlay");
    if (overlay) overlay.style.display = "none";
    activeStarKey = null;
    renderExperienceFiveWishes();
  }

  function handleBudduuWishFormSubmit(e) {
    e.preventDefault();
    if (!activeStarKey) return;

    const textarea = document.getElementById("budduuWishInput");
    const statusBanner = document.getElementById("wishSubmissionStatus");
    const submitBtn = document.getElementById("btnSubmitWish");
    const btnLabel = document.getElementById("btnSubmitWishLabel");

    const wishText = textarea ? textarea.value.trim() : "";

    if (!wishText || wishText.length < 2) {
      statusBanner.className = "wish-status-banner is-error";
      statusBanner.textContent = "Arey Budduu, pehle apni wish likho toh sahi! ✨";
      statusBanner.style.display = "block";
      if (textarea) textarea.focus();
      return;
    }

    submitBtn.disabled = true;
    textarea.disabled = true;
    if (btnLabel) btnLabel.textContent = "LOCKING WISH... ✨";

    // 1. Guaranteed Local Save
    if (!gameState.wishesSubmitted) gameState.wishesSubmitted = {};
    gameState.wishesSubmitted[activeStarKey] = wishText;
    saveState();

    playSyntheticChime([523.25, 659.25, 783.99, 1046.5]);

    const starKeys = ["happiness", "peace", "success", "courage", "memories"];
    const totalSubmitted = starKeys.filter(function(k) {
      return gameState.wishesSubmitted[k] && gameState.wishesSubmitted[k].trim().length > 0;
    }).length;

    // Check: Kya 5th wish complete hui?
    if (totalSubmitted === 5 && !gameState.allWishesMailed) {
      statusBanner.className = "wish-status-banner is-loading";
      statusBanner.textContent = "✨ 5/5 wishes poori ho gayi! Aasmaan tak bheji ja rahi hain... 🌠";
      statusBanner.style.display = "block";

      dispatchAllFiveWishesEmail(function() {
        statusBanner.className = "wish-status-banner is-success";
        statusBanner.textContent = "✨ Paanchon wishes aasmaan aur dil tak pahunch gayi! 💖";
        if (btnLabel) btnLabel.textContent = "ALL 5 WISHES LOCKED 💌";
        renderExperienceFiveWishes();
        setTimeout(closeWishStarModal, 1600);
      });
    } else {
      statusBanner.className = "wish-status-banner is-success";
      statusBanner.textContent = "✨ Wish lock ho gayi! (" + totalSubmitted + "/5 complete). Agla star kholo! ❤️";
      if (btnLabel) btnLabel.textContent = "WISH LOCKED 💌";
      renderExperienceFiveWishes();
      setTimeout(closeWishStarModal, 1300);
    }
  }

  // 100% RELIABLE DUAL DISPATCH ENGINE (HIDDEN FORM + AJAX FETCH)
  function dispatchAllFiveWishesEmail(callback) {
    const timeNow = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const w1 = gameState.wishesSubmitted.happiness || "Not written";
    const w2 = gameState.wishesSubmitted.peace || "Not written";
    const w3 = gameState.wishesSubmitted.success || "Not written";
    const w4 = gameState.wishesSubmitted.courage || "Not written";
    const w5 = gameState.wishesSubmitted.memories || "Not written";

    // Method A: Hidden HTML Form Submit to Hidden Iframe (Triggers FormSubmit without CORS/reload issues)
    try {
      const f1 = document.getElementById("formWishHappiness");
      const f2 = document.getElementById("formWishPeace");
      const f3 = document.getElementById("formWishSuccess");
      const f4 = document.getElementById("formWishCourage");
      const f5 = document.getElementById("formWishMemories");
      const ft = document.getElementById("formWishTime");
      const hiddenForm = document.getElementById("hiddenWishesEmailForm");

      if (f1) f1.value = w1;
      if (f2) f2.value = w2;
      if (f3) f3.value = w3;
      if (f4) f4.value = w4;
      if (f5) f5.value = w5;
      if (ft) ft.value = timeNow;

      if (hiddenForm) {
        hiddenForm.submit();
      }
    } catch (e) {
      console.warn("Hidden form dispatch notice:", e);
    }

    // Method B: Parallel AJAX Fetch POST
    fetch("https://formsubmit.co/ajax/shazan1729@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        _subject: "🎂✨ ALL 5 BIRTHDAY WISHES FROM BUDDUU! ❤️",
        _template: "table",
        _captcha: "false",
        "01_Happiness_Wish": w1,
        "02_Peace_Wish": w2,
        "03_Success_Wish": w3,
        "04_Courage_Wish": w4,
        "05_Memories_Wish": w5,
        "Submitted_At": timeNow
      })
    })
    .then(function(res) {
      if (res.ok) {
        gameState.allWishesMailed = true;
        saveState();
      }
    })
    .catch(function(err) {
      console.warn("AJAX email notice:", err);
    })
    .finally(function() {
      if (typeof callback === "function") callback();
    });
  }

  // Console Helper Shortcut
  window.showWishes = function() {
    console.table(gameState.wishesSubmitted);
    alert(JSON.stringify(gameState.wishesSubmitted, null, 2));
    return gameState.wishesSubmitted;
  };

  /* --------------------------------------------------------------------------
     9. EXPERIENCES 7 & 8: MAIN LETTER & OUR SONG
     -------------------------------------------------------------------------- */
  function renderExperience6() {
    const stream = document.getElementById("mainLetterStream");
    const actions = document.getElementById("mainLetterActions");
    const conclusion = document.getElementById("mainLetterConclusion");

    if (!stream) return;
    stream.innerHTML = "";

    const count = Math.max(1, gameState.letterParagraphRevealed);
    for (let i = 0; i < count && i < MAIN_LETTER_PARAGRAPHS.length; i++) {
      const p = document.createElement("p");
      p.textContent = MAIN_LETTER_PARAGRAPHS[i];
      stream.appendChild(p);
    }

    const isComplete = count >= MAIN_LETTER_PARAGRAPHS.length;
    if (actions) actions.style.display = isComplete ? "none" : "block";
    if (conclusion) conclusion.style.display = isComplete ? "block" : "none";
  }

  function handleContinueMainLetter() {
    const count = gameState.letterParagraphRevealed + 1;
    gameState.letterParagraphRevealed = count;
    saveState();
    renderExperience6();

    const stream = document.getElementById("mainLetterStream");
    if (stream && stream.lastElementChild) {
      stream.lastElementChild.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }

  function renderExperienceOurSong() {
    const invitationCard = document.getElementById("songInvitationCard");
    const playerContainer = document.getElementById("songPlayerContainer");

    if (gameState.songListened) {
      if (invitationCard) invitationCard.style.display = "none";
      if (playerContainer) playerContainer.style.display = "block";
    }
  }

  function revealAndPlaySong() {
    const invitationCard = document.getElementById("songInvitationCard");
    const playerContainer = document.getElementById("songPlayerContainer");
    const audio = document.getElementById("ourSongAudio");

    if (invitationCard) invitationCard.style.display = "none";
    if (playerContainer) {
      playerContainer.style.display = "block";
      playerContainer.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }

    gameState.songListened = true;
    saveState();

    if (audio) {
      fadeOutAudio(400);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            updateSongPlayerState(true);
          })
          .catch(function (err) {
            console.warn("Autoplay blocked or file load delay:", err);
            updateSongPlayerState(false);
          });
      }
    }
  }

  function toggleOurSong() {
    const audio = document.getElementById("ourSongAudio");
    if (!audio) return;

    if (audio.paused) {
      if (audio.currentTime >= audio.duration) {
        audio.currentTime = 0;
      }
      fadeOutAudio(400);
      audio.play().then(function () {
        updateSongPlayerState(true);
      }).catch(function () {
        updateSongPlayerState(false);
      });
    } else {
      audio.pause();
      updateSongPlayerState(false);
    }
  }

  function pauseOurSong() {
    const audio = document.getElementById("ourSongAudio");
    if (audio && !audio.paused) {
      audio.pause();
      updateSongPlayerState(false);
    }
  }

  function restartOurSong() {
    const audio = document.getElementById("ourSongAudio");
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().then(function () {
      updateSongPlayerState(true);
    });
  }

  function toggleMuteOurSong() {
    const audio = document.getElementById("ourSongAudio");
    const icon = document.getElementById("songMuteIcon");
    if (!audio) return;

    audio.muted = !audio.muted;
    if (icon) {
      icon.textContent = audio.muted ? "🔇" : "🔊";
    }
  }

  function updateSongPlayerState(isPlaying) {
    const icon = document.getElementById("songPlayIcon");
    const vinyl = document.getElementById("vinylRecord");
    const eq = document.getElementById("equalizerVisualizer");
    const btn = document.getElementById("btnToggleSongPlay");

    if (icon) icon.textContent = isPlaying ? "❚❚" : "▶";
    if (btn) btn.setAttribute("aria-label", isPlaying ? "Pause song" : "Play song");

    if (vinyl && !prefersReducedMotion) {
      vinyl.classList.toggle("is-spinning", isPlaying);
    }
    if (eq && !prefersReducedMotion) {
      eq.classList.toggle("is-active", isPlaying);
    }
  }

  /* --------------------------------------------------------------------------
     10. EXPERIENCES 9, 10 & 11 (CELEBRATION, SUNSET & OPEN WHEN)
     -------------------------------------------------------------------------- */
  function renderExperienceCelebration() {
    for (let i = 0; i < 10; i++) {
      const candle = document.getElementById("candle" + i);
      if (candle) {
        const isBlown = gameState.candlesBlown.includes(i);
        candle.classList.toggle("is-lit", !isBlown);
        candle.classList.toggle("is-blown", isBlown);
      }
    }

    const proceedBtn = document.getElementById("btnProceedToSunset");
    const allBlown = gameState.candlesBlown.length >= 10;
    if (proceedBtn) proceedBtn.style.display = allBlown ? "inline-block" : "none";

    if (allBlown && !isCelebrationRunning) {
      startCelebrationCanvas();
    }
  }

  function blowSingleCandle(index) {
    if (!gameState.candlesBlown.includes(index)) {
      gameState.candlesBlown.push(index);
      playPuffSound();
      saveState();
      renderExperienceCelebration();

      if (gameState.candlesBlown.length >= 10) {
        triggerGrandCelebration();
      }
    }
  }

  function blowAllCandles() {
    gameState.candlesBlown = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    playPuffSound();
    saveState();
    renderExperienceCelebration();
    triggerGrandCelebration();
  }

  function triggerGrandCelebration() {
    gameState.celebrationTriggered = true;
    saveState();
    startCelebrationCanvas();
    const proceedBtn = document.getElementById("btnProceedToSunset");
    if (proceedBtn) {
      proceedBtn.style.display = "inline-block";
      proceedBtn.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    }
  }

  function renderExperienceSunsetSignoff() {
    stopCelebrationCanvas();
    fadeOutAudio(2000);
    gameState.isCompleted = true;
    saveState();
  }

  function renderExperienceOpenWhen() {
    const counter = document.getElementById("openWhenReadCounter");
    if (counter) {
      counter.textContent = gameState.openWhenRead.length + " OF 5 ENVELOPES UNSEALED";
    }

    const moods = ["feelLow", "needSmile", "cantSleep", "achieveBig", "needReminder"];
    moods.forEach(function (mood) {
      const btn = document.getElementById("btnOpenWhen_" + mood);
      const pill = document.getElementById("statusPill_" + mood);
      const isUnsealed = gameState.openWhenRead.includes(mood);

      if (btn && isUnsealed) btn.classList.add("is-unsealed");
      if (pill && isUnsealed) pill.textContent = "UNSEALED 🤍";
    });
  }

  function openOpenWhenModal(moodKey) {
    const data = OPEN_WHEN_DATA[moodKey];
    if (!data) return;

    const overlay = document.getElementById("openWhenModalOverlay");
    const badge = document.getElementById("openWhenModalBadge");
    const title = document.getElementById("openWhenModalTitle");
    const body = document.getElementById("openWhenModalBody");
    const accent = document.getElementById("openWhenModalAccent");

    if (badge) badge.textContent = data.badge;
    if (title) title.textContent = data.title;
    if (accent) accent.style.background = data.accent;

    if (body) {
      body.innerHTML = "";
      data.body.forEach(function (paragraph) {
        const p = document.createElement("p");
        p.textContent = paragraph;
        body.appendChild(p);
      });
    }

    if (!gameState.openWhenRead.includes(moodKey)) {
      gameState.openWhenRead.push(moodKey);
      playSyntheticChime([493.88, 659.25, 987.77]);
      saveState();
      renderExperienceOpenWhen();
    }

    if (overlay) {
      overlay.style.display = "flex";
      overlay.focus();
    }
  }

  function closeOpenWhenModal() {
    const overlay = document.getElementById("openWhenModalOverlay");
    if (overlay) overlay.style.display = "none";
  }

  /* --------------------------------------------------------------------------
     11. EXPERIENCE 12: REAL GIFT COUNTDOWN AUDIO
     -------------------------------------------------------------------------- */
  function playGiftCountdownAudio() {
    const audio = document.getElementById("giftCountdownAudio");
    if (!audio) return;

    pauseOurSong();
    stopMidnightAudio();
    fadeOutAudio(300);

    if (audioFadeInterval) {
      clearInterval(audioFadeInterval);
      audioFadeInterval = null;
    }

    audio.currentTime = 0;
    audio.volume = 0.45;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          updateGiftAudioUI(true);
          hideGiftAudioNotice();
        })
        .catch(function (err) {
          console.warn("gift-countdown.mp3 autoplay delay:", err);
          updateGiftAudioUI(false);
          showGiftAudioNotice("Tap 'PLAY MUSIC 🎵' to start background music ✨");
        });
    }
  }

  function stopGiftCountdownAudio() {
    const audio = document.getElementById("giftCountdownAudio");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      updateGiftAudioUI(false);
    }
  }

  function toggleGiftCountdownAudio() {
    const audio = document.getElementById("giftCountdownAudio");
    if (!audio) return;

    if (audio.paused) {
      pauseOurSong();
      stopMidnightAudio();
      fadeOutAudio(300);

      audio.play().then(function () {
        updateGiftAudioUI(true);
        hideGiftAudioNotice();
      }).catch(function (err) {
        console.warn("Manual playback error on gift-countdown.mp3:", err);
        updateGiftAudioUI(false);
      });
    } else {
      audio.pause();
      updateGiftAudioUI(false);
    }
  }

  function toggleGiftAudioMute() {
    const audio = document.getElementById("giftCountdownAudio");
    const icon = document.getElementById("giftAudioMuteIcon");
    if (!audio) return;

    audio.muted = !audio.muted;
    if (icon) {
      icon.textContent = audio.muted ? "🔇" : "🔊";
    }
  }

  function updateGiftAudioUI(isPlaying) {
    const btn = document.getElementById("btnToggleGiftAudio");
    const label = document.getElementById("giftAudioLabel");

    if (btn) {
      btn.classList.toggle("is-playing", isPlaying);
      btn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    }
    if (label) {
      label.textContent = isPlaying ? "PAUSE MUSIC ⏸" : "PLAY MUSIC 🎵";
    }
  }

  function showGiftAudioNotice(msg) {
    const notice = document.getElementById("giftAudioNotice");
    if (notice) {
      notice.textContent = msg;
      notice.style.display = "block";
    }
  }

  function hideGiftAudioNotice() {
    const notice = document.getElementById("giftAudioNotice");
    if (notice) {
      notice.style.display = "none";
    }
  }

  function renderExperienceFutureGift() {
    checkAndRenderFutureGiftState();
    playGiftCountdownAudio();
  }

  function checkAndRenderFutureGiftState() {
    const isUnlocked = Date.now() >= FUTURE_GIFT_UNLOCK_TIME_MS;
    const lockedCard = document.getElementById("futureGiftLockedCard");
    const unlockedCard = document.getElementById("futureGiftUnlockedCard");
    const countdownEl = document.getElementById("futureGiftCountdownDisplay");

    if (isUnlocked) {
      if (futureGiftTimerInterval) {
        clearInterval(futureGiftTimerInterval);
        futureGiftTimerInterval = null;
      }
      if (lockedCard) lockedCard.style.display = "none";
      if (unlockedCard) unlockedCard.style.display = "block";

      if (!gameState.futureGiftRevealed) {
        gameState.futureGiftRevealed = true;
        saveState();
        playSyntheticChime([440, 554.37, 659.25, 880, 1108.73]);
      }
    } else {
      if (lockedCard) lockedCard.style.display = "block";
      if (unlockedCard) unlockedCard.style.display = "none";
      updateFutureGiftCountdown(countdownEl);

      if (!futureGiftTimerInterval) {
        futureGiftTimerInterval = setInterval(function () {
          updateFutureGiftCountdown(countdownEl);
        }, 1000);
      }
    }
  }

  function updateFutureGiftCountdown(countdownEl) {
    const diff = FUTURE_GIFT_UNLOCK_TIME_MS - Date.now();

    if (diff <= 0) {
      if (countdownEl) countdownEl.textContent = "00d 00h 00m 00s • UNLOCKING NOW ✨";
      checkAndRenderFutureGiftState();
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = function (n) { return (n < 10 ? "0" : "") + n; };
    const timeStr = days + "d " + pad(hours) + "h " + pad(mins) + "m " + pad(secs) + "s";

    if (countdownEl) {
      countdownEl.textContent = "⏳ " + timeStr;
    }
  }

  /* --------------------------------------------------------------------------
     12. AUDIO & WEBAUDIO SYNTHESIZER
     -------------------------------------------------------------------------- */
  function toggleAudio() {
    const audio = document.getElementById("birthdayAudio");
    const icon = document.getElementById("audioToggleIcon");
    const label = document.getElementById("audioToggleLabel");
    const btn = document.getElementById("btnToggleAudio");

    if (!audio) return;

    if (audioFadeInterval) {
      clearInterval(audioFadeInterval);
      audioFadeInterval = null;
    }

    if (audio.paused) {
      pauseOurSong();
      stopGiftCountdownAudio();
      stopMidnightAudio();
      audio.volume = 1;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            if (icon) icon.textContent = "⏸";
            if (label) label.textContent = "PAUSE MUSIC";
            if (btn) btn.setAttribute("aria-pressed", "true");
          })
          .catch(function () {
            playSyntheticChime([261.63, 329.63, 392.00, 523.25]);
            if (icon) icon.textContent = "🎵";
            if (label) label.textContent = "SYNTH PLAYING";
          });
      }
    } else {
      audio.pause();
      if (icon) icon.textContent = "🎶";
      if (label) label.textContent = "PLAY SOUNDTRACK";
      if (btn) btn.setAttribute("aria-pressed", "false");
    }
  }

  function fadeOutAudio(durationMs) {
    const audio = document.getElementById("birthdayAudio");
    if (!audio || audio.paused) return;

    if (audioFadeInterval) clearInterval(audioFadeInterval);

    const initialVolume = audio.volume || 1;
    const steps = 20;
    const stepTime = (durationMs || 2500) / steps;
    const stepDec = initialVolume / steps;

    audioFadeInterval = setInterval(function () {
      if (audio.volume > stepDec) {
        audio.volume -= stepDec;
      } else {
        clearInterval(audioFadeInterval);
        audioFadeInterval = null;
        audio.pause();
        audio.volume = initialVolume;
        const icon = document.getElementById("audioToggleIcon");
        const label = document.getElementById("audioToggleLabel");
        const btn = document.getElementById("btnToggleAudio");
        if (icon) icon.textContent = "🎶";
        if (label) label.textContent = "PLAY SOUNDTRACK";
        if (btn) btn.setAttribute("aria-pressed", "false");
      }
    }, stepTime);
  }

  function playSyntheticChime(freqs) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      const ctx = new AudioCtx();
      freqs.forEach(function (f, idx) {
        setTimeout(function () {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(f, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
          } catch (e) {}
        }, idx * 160);
      });
    } catch (e) {}
  }

  function playPuffSound() {
    playSyntheticChime([220, 160]);
  }

  /* --------------------------------------------------------------------------
     13. CELEBRATION & MIDNIGHT CANVASES
     -------------------------------------------------------------------------- */
  function startCelebrationCanvas() {
    if (isCelebrationRunning || prefersReducedMotion) return;
    const canvas = document.getElementById("celebrationCanvas");
    if (!canvas) return;

    isCelebrationRunning = true;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ["#FF416C", "#FF6B4A", "#FF8A4C", "#FFB347", "#FFF1E6", "#52E396"];
    const particles = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 3 + 2,
        vx: Math.random() * 2 - 1,
        rot: Math.random() * 360,
        vRot: Math.random() * 4 - 2
      });
    }

    function render() {
      if (!isCelebrationRunning) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach(function (p) {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.vRot;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      celebrationCanvasFrame = requestAnimationFrame(render);
    }

    render();
  }

  function stopCelebrationCanvas() {
    isCelebrationRunning = false;
    if (celebrationCanvasFrame) {
      cancelAnimationFrame(celebrationCanvasFrame);
      celebrationCanvasFrame = null;
    }
    const canvas = document.getElementById("celebrationCanvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function startAmbientParticles() {
    if (prefersReducedMotion) return;
    const canvas = document.getElementById("day10ParticlesCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    const count = window.innerWidth <= 768 ? 20 : 38;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
        vy: Math.random() * 0.35 + 0.1,
        vx: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(function (p) {
        p.y -= p.vy;
        p.x += p.vx;
        p.pulse += 0.02;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 179, 71, " + alpha + ")";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(255, 107, 74, 0.5)";
        ctx.fill();
      });

      ambientParticlesFrame = requestAnimationFrame(render);
    }

    render();
  }

  /* --------------------------------------------------------------------------
     MIDNIGHT AUDIO CONTROLLER (celeb.mp3)
     -------------------------------------------------------------------------- */
  function playMidnightAudio() {
    const audio = document.getElementById("midnightAudio");
    if (!audio) return;

    pauseOurSong();
    stopGiftCountdownAudio();
    fadeOutAudio(300);

    audio.currentTime = 0;
    audio.volume = 0.65;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          updateMidnightAudioUI(true);
        })
        .catch(function (err) {
          console.warn("celeb.mp3 autoplay policy notice:", err);
          updateMidnightAudioUI(false);
        });
    }
  }

  function stopMidnightAudio() {
    const audio = document.getElementById("midnightAudio");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      updateMidnightAudioUI(false);
    }
  }

  function toggleMidnightAudio() {
    const audio = document.getElementById("midnightAudio");
    if (!audio) return;

    if (audio.paused) {
      pauseOurSong();
      stopGiftCountdownAudio();
      fadeOutAudio(300);

      audio.play().then(function () {
        updateMidnightAudioUI(true);
      }).catch(function () {
        updateMidnightAudioUI(false);
      });
    } else {
      audio.pause();
      updateMidnightAudioUI(false);
    }
  }

  function toggleMidnightMute() {
    const audio = document.getElementById("midnightAudio");
    const icon = document.getElementById("midnightMuteIcon");
    if (!audio) return;

    audio.muted = !audio.muted;
    if (icon) {
      icon.textContent = audio.muted ? "🔇" : "🔊";
    }
  }

  function updateMidnightAudioUI(isPlaying) {
    const btn = document.getElementById("btnToggleMidnightMusic");
    const label = document.getElementById("midnightMusicLabel");
    const icon = document.getElementById("midnightMusicIcon");

    if (btn) btn.classList.toggle("is-playing", isPlaying);
    if (label) label.textContent = isPlaying ? "PAUSE MUSIC" : "PLAY CELEB MUSIC";
    if (icon) icon.textContent = isPlaying ? "⏸" : "🎵";
  }

  let rockets = [];
  let sparks = [];
  let confettiItems = [];
  let bubbles = [];

  function openMidnightSpectacular() {
    const stage = document.getElementById("grandMidnightFinale");
    if (!stage) return;

    pauseOurSong();
    stopGiftCountdownAudio();
    fadeOutAudio(300);

    stage.style.display = "flex";
    isMidnightRunning = true;
    startMidnightCanvas();
    playMidnightAudio();
  }

  function closeMidnightSpectacular() {
    const stage = document.getElementById("grandMidnightFinale");
    if (stage) stage.style.display = "none";

    isMidnightRunning = false;
    if (midnightCanvasFrame) {
      cancelAnimationFrame(midnightCanvasFrame);
      midnightCanvasFrame = null;
    }

    stopMidnightAudio();
  }

  function startMidnightCanvas() {
    const canvas = document.getElementById("midnightSpectacularCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    if (!midnightResizeBound) {
      midnightResizeBound = true;
      window.addEventListener("resize", function () {
        if (!isMidnightRunning) return;
        const c = document.getElementById("midnightSpectacularCanvas");
        if (c) {
          width = c.width = window.innerWidth;
          height = c.height = window.innerHeight;
        }
      }, { passive: true });
    }

    rockets = [];
    sparks = [];
    confettiItems = [];
    bubbles = [];

    const colors = ["#FF416C", "#FF6B4A", "#FF8A4C", "#FFB347", "#FFF1E6", "#00F5D4", "#F72585", "#7209B7"];

    for (let i = 0; i < 70; i++) {
      confettiItems.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 2.5 + 1.8,
        vx: Math.random() * 2 - 1,
        rot: Math.random() * 360,
        vRot: Math.random() * 4 - 2
      });
    }

    for (let b = 0; b < 22; b++) {
      bubbles.push({
        x: Math.random() * width,
        y: height + Math.random() * 300,
        r: Math.random() * 18 + 10,
        vy: Math.random() * 1.2 + 0.6,
        vx: Math.sin(Math.random() * Math.PI) * 0.8,
        wobble: Math.random() * Math.PI
      });
    }

    function createRocket(targetX, targetY) {
      const startX = targetX || Math.random() * (width - 200) + 100;
      const destinationY = targetY || Math.random() * (height * 0.45) + 60;
      rockets.push({
        x: startX,
        y: height,
        targetY: destinationY,
        vy: Math.random() * -4 - 10,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function explodeFirework(x, y, color) {
      const particleCount = 45;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i * (Math.PI * 2)) / particleCount;
        const speed = Math.random() * 5 + 2;
        sparks.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: color,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.012
        });
      }
    }

    let lastAutoRocket = Date.now();

    function loop() {
      if (!isMidnightRunning) return;
      ctx.clearRect(0, 0, width, height);

      if (Date.now() - lastAutoRocket > 1300) {
        createRocket();
        lastAutoRocket = Date.now();
      }

      for (let rIdx = rockets.length - 1; rIdx >= 0; rIdx--) {
        const r = rockets[rIdx];
        r.y += r.vy;

        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = r.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(r.x, r.y + 8, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#FFB347";
        ctx.fill();

        if (r.y <= r.targetY || r.vy >= 0) {
          explodeFirework(r.x, r.y, r.color);
          rockets.splice(rIdx, 1);
        }
      }

      for (let sIdx = sparks.length - 1; sIdx >= 0; sIdx--) {
        const s = sparks[sIdx];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(sIdx, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.restore();
      }

      confettiItems.forEach(function (c) {
        c.y += c.vy;
        c.x += c.vx;
        c.rot += c.vRot;

        if (c.y > height) {
          c.y = -20;
          c.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rot * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      });

      bubbles.forEach(function (b) {
        b.y -= b.vy;
        b.wobble += 0.03;
        b.x += Math.sin(b.wobble) * 0.8;

        if (b.y < -40) {
          b.y = height + 40;
          b.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 179, 71, 0.4)";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 65, 108, 0.08)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fill();
        ctx.restore();
      });

      midnightCanvasFrame = requestAnimationFrame(loop);
    }

    loop();

    const stage = document.getElementById("grandMidnightFinale");
    if (stage) {
      stage.onclick = function (e) {
        if (e.target.closest("button") || e.target.closest("a")) return;
        createRocket(e.clientX, e.clientY);
      };
    }
  }

  /* --------------------------------------------------------------------------
     14. IDEMPOTENT EVENT INITIALIZATION
     -------------------------------------------------------------------------- */
  let handlersInitialized = false;

  function initEventHandlers() {
    if (handlersInitialized) return;
    handlersInitialized = true;

    // Experience 1
    const btnUnlockDoor = document.getElementById("btnUnlockFinalDoor");
    if (btnUnlockDoor) btnUnlockDoor.addEventListener("click", handleUnlockDoor);

    // Experience 2
    const btnReplay = document.getElementById("btnReplayRecap");
    if (btnReplay) btnReplay.addEventListener("click", handleReplayRecap);

    const btnToLetters = document.getElementById("btnProceedToLetters");
    if (btnToLetters) btnToLetters.addEventListener("click", function () { showExperience("experienceThreeLetters"); });

    // Experience 3
    const btnThankYou = document.getElementById("btnOpenLetterThankYou");
    if (btnThankYou) btnThankYou.addEventListener("click", function () { openLetterModal("thankYou"); });

    const btnIHope = document.getElementById("btnOpenLetterIHope");
    if (btnIHope) btnIHope.addEventListener("click", function () { openLetterModal("iHope"); });

    const btnRemember = document.getElementById("btnOpenLetterRememberThis");
    if (btnRemember) btnRemember.addEventListener("click", function () { openLetterModal("rememberThis"); });

    const btnCloseModal = document.getElementById("btnCloseLetterModal");
    if (btnCloseModal) btnCloseModal.addEventListener("click", closeLetterModal);

    const btnToKeepsake = document.getElementById("btnProceedToKeepsake");
    if (btnToKeepsake) btnToKeepsake.addEventListener("click", function () { showExperience("experienceKeepsakeGift"); });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeLetterModal();
        closeWishStarModal();
        closeOpenWhenModal();
      }
    });

    // Experience 4
    const btnUnbox = document.getElementById("btnOpenGiftBox");
    if (btnUnbox) btnUnbox.addEventListener("click", handleUnboxGift);

    const btnToWorld = document.getElementById("btnProceedToWorld");
    if (btnToWorld) btnToWorld.addEventListener("click", function () { showExperience("experienceWorld"); });

    // Experience 5
    const beaconDreams = document.getElementById("worldItemDreams");
    if (beaconDreams) beaconDreams.addEventListener("click", function () { handleDiscoverWorldItem("dreams"); });

    const beaconMemories = document.getElementById("worldItemMemories");
    if (beaconMemories) beaconMemories.addEventListener("click", function () { handleDiscoverWorldItem("memories"); });

    const beaconWords = document.getElementById("worldItemWords");
    if (beaconWords) beaconWords.addEventListener("click", function () { handleDiscoverWorldItem("words"); });

    const beaconMoments = document.getElementById("worldItemMoments");
    if (beaconMoments) beaconMoments.addEventListener("click", function () { handleDiscoverWorldItem("moments"); });

    const btnProceedToWishes = document.getElementById("btnProceedToWishes");
    if (btnProceedToWishes) btnProceedToWishes.addEventListener("click", function () { showExperience("experienceFiveWishes"); });

    // Experience 6: Five Little Wishes
    ["happiness", "peace", "success", "courage", "memories"].forEach(function (starKey) {
      const btn = document.getElementById("starBtn_" + starKey);
      if (btn) btn.addEventListener("click", function () { openWishStarModal(starKey); });
    });

    const btnCloseWishModal = document.getElementById("btnCloseWishModal");
    if (btnCloseWishModal) btnCloseWishModal.addEventListener("click", closeWishStarModal);

    const wishForm = document.getElementById("budduuWishForm");
    if (wishForm) wishForm.addEventListener("submit", handleBudduuWishFormSubmit);

    const btnProceedToLetter = document.getElementById("btnProceedFromWishesToLetter");
    if (btnProceedToLetter) btnProceedToLetter.addEventListener("click", function () { showExperience("experienceMainLetter"); });

    // Experience 7
    const btnContinueLetter = document.getElementById("btnContinueMainLetter");
    if (btnContinueLetter) btnContinueLetter.addEventListener("click", handleContinueMainLetter);

    const btnToOurSong = document.getElementById("btnProceedToOurSong");
    if (btnToOurSong) btnToOurSong.addEventListener("click", function () { showExperience("experienceOurSong"); });

    // Experience 8
    const btnRevealSong = document.getElementById("btnRevealAndPlaySong");
    if (btnRevealSong) btnRevealSong.addEventListener("click", revealAndPlaySong);

    const btnToggleSong = document.getElementById("btnToggleSongPlay");
    if (btnToggleSong) btnToggleSong.addEventListener("click", toggleOurSong);

    const btnRestartSongEl = document.getElementById("btnRestartSong");
    if (btnRestartSongEl) btnRestartSongEl.addEventListener("click", restartOurSong);

    const btnMuteSongEl = document.getElementById("btnMuteSong");
    if (btnMuteSongEl) btnMuteSongEl.addEventListener("click", toggleMuteOurSong);

    const ourSongAudio = document.getElementById("ourSongAudio");
    const scrubSlider = document.getElementById("songScrubSlider");
    const scrubberFill = document.getElementById("songScrubberFill");
    const currentTimeEl = document.getElementById("songCurrentTime");
    const totalDurationEl = document.getElementById("songTotalDuration");

    if (ourSongAudio) {
      ourSongAudio.addEventListener("loadedmetadata", function () {
        if (totalDurationEl && !isNaN(ourSongAudio.duration)) {
          totalDurationEl.textContent = formatTime(ourSongAudio.duration);
        }
      });

      ourSongAudio.addEventListener("timeupdate", function () {
        if (!ourSongAudio.duration) return;
        const current = ourSongAudio.currentTime;
        const dur = ourSongAudio.duration;

        if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
        const percent = (current / dur) * 100;

        if (!isSongScrubbing) {
          if (scrubSlider) scrubSlider.value = percent;
          if (scrubberFill) scrubberFill.style.width = percent + "%";
        }
      });

      ourSongAudio.addEventListener("play", function () {
        updateSongPlayerState(true);
      });

      ourSongAudio.addEventListener("pause", function () {
        updateSongPlayerState(false);
      });

      ourSongAudio.addEventListener("ended", function () {
        updateSongPlayerState(false);
        const conclusion = document.getElementById("songConclusionLockup");
        if (conclusion) {
          conclusion.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
        }
      });

      ourSongAudio.addEventListener("error", function () {
        if (totalDurationEl) totalDurationEl.textContent = "5:42";
      });
    }

    if (scrubSlider && ourSongAudio) {
      const startScrub = function () { isSongScrubbing = true; };
      const stopScrub = function () {
        isSongScrubbing = false;
        if (ourSongAudio.duration) {
          const targetTime = (parseFloat(scrubSlider.value) / 100) * ourSongAudio.duration;
          ourSongAudio.currentTime = targetTime;
        }
      };

      scrubSlider.addEventListener("pointerdown", startScrub);
      scrubSlider.addEventListener("pointerup", stopScrub);
      scrubSlider.addEventListener("touchstart", startScrub, { passive: true });
      scrubSlider.addEventListener("touchend", stopScrub);

      scrubSlider.addEventListener("input", function () {
        if (!ourSongAudio.duration) return;
        const targetPercent = parseFloat(scrubSlider.value);
        if (scrubberFill) scrubberFill.style.width = targetPercent + "%";
        if (currentTimeEl) {
          const previewTime = (targetPercent / 100) * ourSongAudio.duration;
          currentTimeEl.textContent = formatTime(previewTime);
        }
      });

      scrubSlider.addEventListener("change", stopScrub);
    }

    const btnFromSongToCeleb = document.getElementById("btnProceedFromSongToCelebration");
    if (btnFromSongToCeleb) {
      btnFromSongToCeleb.addEventListener("click", function () { showExperience("experienceCelebration"); });
    }

    // Experience 9
    for (let c = 0; c < 10; c++) {
      (function (idx) {
        const candle = document.getElementById("candle" + idx);
        if (candle) {
          candle.addEventListener("click", function () { blowSingleCandle(idx); });
        }
      })(c);
    }

    const btnBlowAll = document.getElementById("btnBlowAllCandles");
    if (btnBlowAll) btnBlowAll.addEventListener("click", blowAllCandles);

    const btnAudioToggle = document.getElementById("btnToggleAudio");
    if (btnAudioToggle) btnAudioToggle.addEventListener("click", toggleAudio);

    const btnToSunset = document.getElementById("btnProceedToSunset");
    if (btnToSunset) {
      btnToSunset.addEventListener("click", function () { showExperience("experienceSunsetSignoff"); });
    }

    // Experience 10
    const btnReview = document.getElementById("btnReviewAllDays");
    if (btnReview) {
      btnReview.addEventListener("click", function () { showExperience("experienceRecap"); });
    }

    const btnGoToOpenWhen = document.getElementById("btnProceedToOpenWhen");
    if (btnGoToOpenWhen) {
      btnGoToOpenWhen.addEventListener("click", function () { showExperience("experienceOpenWhen"); });
    }

    const btnProceedToFutureGift = document.getElementById("btnProceedToFutureGift");
    if (btnProceedToFutureGift) {
      btnProceedToFutureGift.addEventListener("click", function () { showExperience("experienceFutureGift"); });
    }

    const btnLaunchMidnight = document.getElementById("btnLaunchMidnightFinale");
    if (btnLaunchMidnight) btnLaunchMidnight.addEventListener("click", openMidnightSpectacular);

    const btnCloseMidnight = document.getElementById("btnCloseMidnightFinale");
    if (btnCloseMidnight) btnCloseMidnight.addEventListener("click", closeMidnightSpectacular);

    // Experience 11
    const moods = ["feelLow", "needSmile", "cantSleep", "achieveBig", "needReminder"];
    moods.forEach(function (mood) {
      const btn = document.getElementById("btnOpenWhen_" + mood);
      if (btn) {
        btn.addEventListener("click", function () { openOpenWhenModal(mood); });
      }
    });

    const btnCloseOpenWhenModal = document.getElementById("btnCloseOpenWhenModal");
    if (btnCloseOpenWhenModal) btnCloseOpenWhenModal.addEventListener("click", closeOpenWhenModal);

    const btnBackToSunset = document.getElementById("btnBackToSunset");
    if (btnBackToSunset) {
      btnBackToSunset.addEventListener("click", function () { showExperience("experienceSunsetSignoff"); });
    }

    const btnOpenWhenToFutureGift = document.getElementById("btnOpenWhenToFutureGift");
    if (btnOpenWhenToFutureGift) {
      btnOpenWhenToFutureGift.addEventListener("click", function () { showExperience("experienceFutureGift"); });
    }

    const btnOpenWhenToMidnight = document.getElementById("btnOpenWhenToMidnight");
    if (btnOpenWhenToMidnight) btnOpenWhenToMidnight.addEventListener("click", openMidnightSpectacular);

    // Experience 12
    const btnToggleGiftAudioEl = document.getElementById("btnToggleGiftAudio");
    if (btnToggleGiftAudioEl) {
      btnToggleGiftAudioEl.addEventListener("click", toggleGiftCountdownAudio);
    }

    const btnMuteGiftAudioEl = document.getElementById("btnMuteGiftAudio");
    if (btnMuteGiftAudioEl) {
      btnMuteGiftAudioEl.addEventListener("click", toggleGiftAudioMute);
    }

    const giftCountdownAudioEl = document.getElementById("giftCountdownAudio");
    if (giftCountdownAudioEl) {
      giftCountdownAudioEl.addEventListener("error", function () {
        updateGiftAudioUI(false);
        showGiftAudioNotice("⚠️ 'gift-countdown.mp3' not found in project folder. Add the audio file to listen.");
      });
      giftCountdownAudioEl.addEventListener("play", function () {
        updateGiftAudioUI(true);
      });
      giftCountdownAudioEl.addEventListener("pause", function () {
        updateGiftAudioUI(false);
      });
    }

    const btnBackToSunsetFromGift = document.getElementById("btnBackToSunsetFromGift");
    if (btnBackToSunsetFromGift) {
      btnBackToSunsetFromGift.addEventListener("click", function () { showExperience("experienceSunsetSignoff"); });
    }

    const btnBackToSunsetFromRevealed = document.getElementById("btnBackToSunsetFromRevealed");
    if (btnBackToSunsetFromRevealed) {
      btnBackToSunsetFromRevealed.addEventListener("click", function () { showExperience("experienceSunsetSignoff"); });
    }

    const btnGiftToMidnight = document.getElementById("btnGiftToMidnight");
    if (btnGiftToMidnight) btnGiftToMidnight.addEventListener("click", openMidnightSpectacular);

    // Midnight Buttons
    const btnToggleMidnightEl = document.getElementById("btnToggleMidnightMusic");
    if (btnToggleMidnightEl) {
      btnToggleMidnightEl.addEventListener("click", toggleMidnightAudio);
    }

    const btnMuteMidnightEl = document.getElementById("btnMuteMidnightMusic");
    if (btnMuteMidnightEl) {
      btnMuteMidnightEl.addEventListener("click", toggleMidnightMute);
    }

    const midnightAudioEl = document.getElementById("midnightAudio");
    if (midnightAudioEl) {
      midnightAudioEl.addEventListener("play", function () {
        updateMidnightAudioUI(true);
      });
      midnightAudioEl.addEventListener("pause", function () {
        updateMidnightAudioUI(false);
      });
    }

    // Visibility
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (ambientParticlesFrame) cancelAnimationFrame(ambientParticlesFrame);
        if (celebrationCanvasFrame) cancelAnimationFrame(celebrationCanvasFrame);
        if (midnightCanvasFrame) cancelAnimationFrame(midnightCanvasFrame);
        
        pauseOurSong();
        stopGiftCountdownAudio();
        stopMidnightAudio();

        const bAudio = document.getElementById("birthdayAudio");
        if (bAudio && !bAudio.paused) {
          bAudio.pause();
          const icon = document.getElementById("audioToggleIcon");
          const label = document.getElementById("audioToggleLabel");
          const btn = document.getElementById("btnToggleAudio");
          if (icon) icon.textContent = "🎶";
          if (label) label.textContent = "PLAY SOUNDTRACK";
          if (btn) btn.setAttribute("aria-pressed", "false");
        }
      } else {
        const unlockTarget = getDay10UnlockTimestamp();
        if (Date.now() >= unlockTarget && !day10Started) {
          unlockAndStartDay10();
          return;
        }
        startAmbientParticles();
        if (isCelebrationRunning) startCelebrationCanvas();
        if (isMidnightRunning) startMidnightCanvas();
      }
    });
  }

  /* --------------------------------------------------------------------------
     15. BOOTSTRAP
     -------------------------------------------------------------------------- */
  function initDay10() {
    const unlockTargetMs = getDay10UnlockTimestamp();
    const isUnlocked = Date.now() >= unlockTargetMs;

    const dateLockedView = document.getElementById("day10DateLockedView");
    const unlockedView = document.getElementById("day10UnlockedView");

    if (!isUnlocked) {
      if (dateLockedView) dateLockedView.style.display = "flex";
      if (unlockedView) unlockedView.style.display = "none";
      startLockCountdown(unlockTargetMs);
      return;
    }

    unlockAndStartDay10();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDay10);
  } else {
    initDay10();
  }
})();