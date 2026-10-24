/* ==========================================================================
   BUDDUU — DAY 6: “THINGS I NEVER SAID”
   Gate 1 (Date Lock) → Gate 2: THE NO-RETURN MAZE 🌑 (HARD MODE)
   7 Depth Stages • 6 clues • 3 Lives • Final Code: SHAZAN
   → Sequential Experiences:
     1. Handwritten Letter
     2. Vintage Answering Machine & Cassette Deck 🎙️📼 (Full 41-Min Tape)
     3. The 11:11 Secret Wish Capsule 🕯️✨
     4. The Heartbeat / Fingerprint Biometric Sensor 🖤⚡
     5. Will You Get Blocked? 📵
     6. The Unwritten Contract / Silent Promises 🤝📜
   ========================================================================== */

const DAY6_CONFIG = {
  day: 6,
  dateStr: "2026-10-25",
  storageKeys: {
    mazeSolved: "budduu_day6_maze_solved",
    completed: "budduu_day6_completed",
    letterRead: "budduu_day6_letter_read",
    voicePlayed: "budduu_day6_voice_played",
    wishRevealed: "budduu_day6_wish_revealed",
    heartScanned: "budduu_day6_heart_scanned",
    blockedClicked: "budduu_day6_blocked_clicked",
    promiseAccepted: "budduu_day6_promise_accepted"
  },
  finalCode: "SHAZAN"
};

// Maze State
let mazeLives = 3;
let currentMazeStage = 1;
const totalMazeStages = 7;
let collectedClues = [];

// Unlocked Content State
let isMazeSolved = false;
let readingPartIndex = 1;
const totalReadingParts = 5;
let hasReadFullLetter = false;
let hasPlayedVoiceNote = false;
let hasRevealedWish = false;
let hasCompletedHeartScan = false;
let hasClickedBlockedTest = false;
let hasAcceptedPromise = false;

// Audio Simulation & Subtitles State
let isSimulatedVoice = false;
let voiceSimInterval = null;
let voiceSimTime = 0;
const voiceSimDuration = 2465; // ~41 minutes 05 seconds

// ==========================================================================
// FULL 41-MINUTE SYNCHRONIZED ANSWERING MACHINE TRANSCRIPT
// ==========================================================================
const answeringMachineSubtitles = [
  { time: 0, text: "“Assalamu Alaikum my dear Budduu... aka Mr. Faizan sometimes, but maybe my Budduu. ❤️”" },
  { time: 10, text: "“Thank you mere saath jude rehne ke liye khud ki birthday celebration ke liye. 5 din poore ho gaye, ab Day 6 ki baari hai.”" },
  { time: 26, text: "“Is beech aisa kuch hua hoga ke mujhe gussa aaya ya kuch aur, but uske liye I am sorry.”" },
  { time: 42, text: "“Aur sorry bolna seekh lijiye aap bhi, kyunki galti aapki rehti hai par aapko pata nahi hota...”" },
  { time: 57, text: "“Toh is voice note me main bohot kuch bolne wala hoon... kursi ki peti baandh lijiye, mausam sudharne wala hai.”" },
  { time: 74, text: "“Sabse pehle pichle saal ke birthday ki baat karte hain... Maine first time kisi ka birthday itne ache se celebrate kiya tha.”" },
  { time: 94, text: "“Maine ye sab kiya tha for my one and only special... mera Budduu, mera Faizan, mera bhulakkad, mera sab kuch.”" },
  { time: 107, text: "“Phir aaya November aur December — ye do months sabse best the. Dono ne apni feelings ka confession kiya tha.”" },
  { time: 121, text: "“Shawarma dates, chicken dates, biryani dates, padhai, hugs, kisses aur bohot saari cheezein...”" },
  { time: 133, text: "“Phir aaya January... exams. Exams ki tension me main toh sahi tha, tu change ho gaya tha.”" },
  { time: 144, text: "“Tujhe exams ki nahi, job ki tension thi. Mujhse wo cheez tune chupayi thi.”" },
  { time: 158, text: "“January end me pata chala ke tune interview diya, select hua, ab job ke liye jana padega.”" },
  { time: 173, text: "“Kuch seconds ke liye meri duniya ruk si gayi thi... itni badi baat mujhse chupayi, aur bola bhi tab jab sab ho chuka tha.”" },
  { time: 198, text: "“Us din ke baad se meri duniya change ho gayi. Jahan din bhar 'Faizan, Budduu' karta tha, wahan main khamosh, akela ho gaya.”" },
  { time: 228, text: "“Bas ye umeed me rehta tha ke tu ek baar reply kare, call karke baat kar le... par waisa kuch hota nahi tha.”" },
  { time: 257, text: "“Phir aayi 20 February... jis din tu exam ke baad first time college aaya tha. Ek mahine se zyada time baad dekha tha tujhe.”" },
  { time: 274, text: "“Main khud ko control kar raha tha ke ro na doon... mere saamne wo insan tha jo meri poori duniya tha.”" },
  { time: 297, text: "“Aadhe-adhure jawab mile... laga theek ho jayega, par kehte hain na ek baar cheezein bigad jayein toh badi mushkil se theek hoti hain.”" },
  { time: 336, text: "“Khud ko itna akela aur kamzor paya... koi nahi tha jo mujhe sune, samjhe, jaisa hoon waisa accept kare.”" },
  { time: 360, text: "“Maine wo raasta chuna emotions suppress karne ke liye jo kabhi socha nahi tha ke life me involve karunga.”" },
  { time: 386, text: "“Maine kuch aisi cheezein ki jiska regret mujhe abhi bhi hai... First time mujhe lat lagi thi — C-grade, cigarette.”" },
  { time: 425, text: "“Nahi tha koi apna mere paas... akela kaise feel hota hai mujhe pata hai, shayad tujhe bhi pata ho.”" },
  { time: 444, text: "“Do-teen baar man me aaya tha ke khud ko khatam hi kar doon... koshish bhi ki thi par bach gaya.”" },
  { time: 475, text: "“Phir aayi March... 15, 16 ya 17 March, jis din mera volcano eruption hua — because of you and Saqib.”" },
  { time: 494, text: "“Hum dono ja rahe the, mujhe baat clear karni thi, par tu Saqib ke paas jaake baat karne khada ho gaya.”" },
  { time: 524, text: "“Mera volcano eruption hua... Auditorium ke paas, parking ke paas, tune bithaya, bohot baatein sunayi maine...”" },
  { time: 582, text: "“Baaton-baaton me bola tha maine ke cigarette shuru kar di maine... hero-giri phoo-phoo karne me nahi, dhoo-dhoo karne me hai.”" },
  { time: 602, text: "“Usi din bus stand par chhodne aaya toh tujhme sudden changes aaye. Achi baatein ki, hath milaya, ghar jaake 2-3 baar message kiya.”" },
  { time: 629, text: "“8 baje rote-rote message kiya ke 'tune cigarette kyun piya, aisa-waisa'...”" },
  { time: 638, text: "“Maine bola feelings letter me bata de, tune doosre din letter diya tha. Tujhe guilt ho raha tha.”" },
  { time: 668, text: "“Tujhe lagta tha ke tu nahi raha toh main khush rahunga ya koi aur aa jayega... aisa bilkul bhi nahi hai, for your kind information.”" },
  { time: 691, text: "“Tune job ko 1st priority se hataya: 1st pe health, 2nd pe family, 3rd pe main. Phir laga tu health pe focus kar raha hai.”" },
  { time: 713, text: "“Main ghar jaake rota tha, dua maangta tha ke uski mental state theek kar do, usko theek kar do.”" },
  { time: 737, text: "“March ka month 1 saal ke barabar tha. Sort bhi hua, Shegaon gaye the, Ramzan tha, Eid par tune photo aur voice note bheja tha.”" },
  { time: 777, text: "“Wo voice note bade ammi ne sun liye the! Phir mujhe ghar bulaye the, tune letter aur shayari dekar manaya tha.”" },
  { time: 811, text: "“Shamir ka program, dawat... bade ammi ne bola mujhse doori banao. Kyun bola mujhe nahi pata.”" },
  { time: 843, text: "“Teri koi problem thi jo tu bata nahi raha tha... 2-3 din baad poochne pe bola ke bahar samose aur paani-puri pel raha hai akele-akele!”" },
  { time: 912, text: "“Maine bola tha life me kuch bhi ho, mujhse mat chupaya kar. Main tujhe family maanta hoon toh tu bhi mujhe family maan.”" },
  { time: 941, text: "“Phir chuttiyan aayi, paper aaye... Bas good morning, good night. Message seen karke chhod dena... call gayab.”" },
  { time: 993, text: "“Tune bola tha week me ek baar call karenge, par tera call ek hi baar aaya, wo bhi miss call ke baad.”" },
  { time: 1019, text: "“Maine aur khud ko akela feel kiya aur wahi cheez ki side gaya... is baar intensely kiya, jiska regret hai.”" },
  { time: 1042, text: "“College start hua, mere birthday ke din 17 June 2024: bolne ke baad bhi koi voice note, video ya virtual cheez nahi mili, bohot hurt hua.”" },
  { time: 1098, text: "“12:00 AM par message aur chota passage diya tha jo acha laga tha, galtiyan maaf ki thi par bhoola nahi tha.”" },
  { time: 1124, text: "“Birthday ke din 1-2 months baad dekha toh toote udd gaye... kya ye wahi Faizan hai, mera Budduu jisko main jaanta tha?”" },
  { time: 1154, text: "“Gaur se dekhiye is shakhs ko... personality bhool chuka hai, saari yaadein bhool chuka hai jo saath bitayi thi.”" },
  { time: 1175, text: "“Kuch bolo toh 'It is what it is'... ajeeb sa ban gaya tha.”" },
  { time: 1189, text: "“Koshish karta raha ke realize ho ke cheezein badal chuki hain... June khatam hua, July aaya, baat karne ka time nahi tha.”" },
  { time: 1223, text: "“College me strangers ki tarah baithe rehte the, ajeeb awkwardness.”" },
  { time: 1241, text: "“August me bhi koshish ki purana Budduu wapas aaye... par tu nayi personality me aur main purana Budduu wapas laane me laga raha.”" },
  { time: 1271, text: "“September me letter bataya toh bola 'ye maine likha hai? tere bhoot ne likha tha kya?'... sanskaar naam ki cheez nahi, chabra ban gaya tha.”" },
  { time: 1351, text: "“Ulta jawab dena, baat ghumana... saamne wale ki feelings hurt ho jati hain.”" },
  { time: 1385, text: "“Maine umeed chhod diya tha ke tu change hoga... socha mera Budduu permanently kho diya hai.”" },
  { time: 1412, text: "“September me lamba message bheja: 'I want Shazan back'... pehle jaisi bonding nahi rahi.”" },
  { time: 1456, text: "“Umeed chhod diya tha ke mera Faizan wapas aayega... phir se hum OG Shazan bankar rahenge, late night talks karenge jo main miss karta hoon.”" },
  { time: 1500, text: "“Ab aisi situation hai ke main kuch bolu toh tu kuch aur matlab nikalta hai, misunderstanding, hesitation over the top.”" },
  { time: 1529, text: "“Mujhe lagta hai tujhe awkward feel hoga, bacchkan harkatein lagengi... dil me dar baith gaya ke main tere liye important nahi hoon.”" },
  { time: 1576, text: "“Tune feel karwa diya ke main replaceable hoon... jab teri life me koi aayega toh main replace ho jaunga.”" },
  { time: 1615, text: "“Ye dar sirf tu hi door kar sakta hai... kya mujhe phir se old wala Shahid banna chahiye? Kya purane Faizan ke saath waisa hi rehna chahiye?”" },
  { time: 1669, text: "“Rahi baat awkwardness ki — kisses, hugs casual hain, head-on, hath pakadna, kandhe pe sar rakhna...”" },
  { time: 1713, text: "“Uske saath doosri cheezein bhi khatam ho gayi jo bond ko special banati thi, jo tension nikaal deti thi.”" },
  { time: 1740, text: "“Sar se sar maarna, lecture me hath pakadna, kandhe par sar rakhna jo feel karwata tha ke iske aage jannat kya hai...”" },
  { time: 1776, text: "“Ye sab milke banta tha SHAZAN — Shahid + Faizan = SHAZAN. Jo is 2024 me cheen liya mujhse.”" },
  { time: 1805, text: "“Daily call, daily text, nok-jhok, letters, ghumna, romantic baatein... sab miss kar raha hoon teri awkwardness ki wajah se.”" },
  { time: 1858, text: "“Main bas itna chahta hoon ke life me main tujhe khou na. Jo bond maine tere saath share kiya, wo main kisi aur ke saath nahi maan sakta.”" },
  { time: 1904, text: "“Agar tu meri life se gaya toh ya toh main barbaad ho jaunga, robot ban jaunga without feelings, ya depression me chala jaunga.”" },
  { time: 1921, text: "“Jo Shahid tere saath bana, jo life jiya, wo main kabhi nahi jee paunga.”" },
  { time: 1943, text: "“Wo old vibes, old baatein nahi aa rahi... lagta hai tu bas formality kar raha hai.”" },
  { time: 1984, text: "“Week me ek-do baar deep baat honi chahiye, na ki sirf college aur lectures ki casual baatein.”" },
  { time: 2025, text: "“Aisa lagta hai I am less important for you, you take me for granted always... and I hate that feeling.”" },
  { time: 2060, text: "“Jab main gayab hota hoon 2-3 din, dekhne ke liye ke kitna farak padta hai... pata chalta hai ghanta farak padta hai!”" },
  { time: 2086, text: "“Din bhar me message nahi aata, call nahi aata... bas gusse me emoji bhejti hai, par ye nahi poochti kya hua.”" },
  { time: 2116, text: "“Main chahta hoon SHAZAN forever rahe... mera sabse best person mujhse door na jaye.”" },
  { time: 2150, text: "“Meri ek wish hai, 11:11 WISH... Main chahta hoon ke tu meri life me hamesha rahe, meri life ka part rahe.”" },
  { time: 2172, text: "“Main tere bacchon ka best uncle banu, tu mere bacchon ka best uncle bane!”" },
  { time: 2191, text: "“Saath me ghar ka toh pata nahi, par saath me job possible ho sake toh please possible kar dena.”" },
  { time: 2210, text: "“Maine imagination world me sab socha tha... June me jo changes aaye usse sab bikhar gaya, bohot dard hua tha.”" },
  { time: 2259, text: "“Problem ye hai ke tu bas tere hi baare me soch raha hai, list me mujhe kahi nahi rakha.”" },
  { time: 2304, text: "“Main chahta hoon tera birthday bohot ache se manau, bina cheezein ruin kiye. Chahta hoon ye birthday bohot memorable rahe.”" },
  { time: 2344, text: "“Ek baar mujhe khud se gale lagakar dekh... bas ek baar hug kar, tujhe sab pata chal jayega mere par kya beetti hai.”" },
  { time: 2375, text: "“Day 6 voice note for my Budduu. Day 7, 8, 9, 10 ke liye prepare raho — grand celebration!”" },
  { time: 2396, text: "“Stay tuned, stay forever. Love you my brother, my Budduu. ❤️”" },
  { time: 2404, text: "“Mujhe jo pyaar tujhse hua hai, wo pyaar main zindagi me kabhi kisi se nahi kar paunga.”" },
  { time: 2431, text: "“Please mere pyaar ki value kar le, mujhe samajh le... Thank you for listening, see you soon tomorrow. Love you, bye bye. Your Tedduu signing off. 🎙️🧡”" }
];

// Audio Web Synth
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

function playAnsweringMachineBeep() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    if (!audioCtx) audioCtx = new AudioCtxClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(850, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.65);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.65);
  } catch (e) {}
}

function playHeartbeatSound() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    if (!audioCtx) audioCtx = new AudioCtxClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(80, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.12);
    gain1.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start();
    osc1.stop(audioCtx.currentTime + 0.12);

    setTimeout(() => {
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(70, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(25, audioCtx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start();
      osc2.stop(audioCtx.currentTime + 0.15);
    }, 140);
  } catch (e) {}
}

function playStampSlamSound() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    if (!audioCtx) audioCtx = new AudioCtxClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);

    setTimeout(() => {
      playToneSound(659.25, "triangle", 0.5, 0.12);
    }, 120);
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
  initDay6Flow();
});

function initDay6Flow() {
  const day6Data = (typeof JOURNEY_DAYS !== "undefined")
    ? JOURNEY_DAYS.find((d) => d.day === DAY6_CONFIG.day)
    : { day: 6, dateStr: DAY6_CONFIG.dateStr };

  const dateLockedView = document.getElementById("day6DateLockedView");
  const gameLockedView = document.getElementById("day6GameLockedView");
  const unlockedView = document.getElementById("day6UnlockedView");

  const isDateReady = (typeof isDateUnlocked === "function") 
    ? isDateUnlocked(day6Data.dateStr) 
    : true;

  if (!isDateReady) {
    if (dateLockedView) dateLockedView.style.display = "flex";
    if (gameLockedView) gameLockedView.style.display = "none";
    if (unlockedView) unlockedView.style.display = "none";

    const daysRemaining = (typeof getDaysUntil === "function") ? getDaysUntil(day6Data.dateStr) : 0;
    const countdownEl = document.getElementById("dateLockCountdown");
    if (countdownEl) {
      countdownEl.textContent = daysRemaining > 0 
        ? `Unlocks in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} (25 October 2026)`
        : "Unlocks on 25 October 2026";
    }
    return;
  }

  if (dateLockedView) dateLockedView.style.display = "none";

  try {
    if (localStorage.getItem(DAY6_CONFIG.storageKeys.mazeSolved) === "true") {
      isMazeSolved = true;
    }
    if (localStorage.getItem(DAY6_CONFIG.storageKeys.completed) === "true") {
      isMazeSolved = true;
      hasReadFullLetter = true;
      hasPlayedVoiceNote = true;
      hasRevealedWish = true;
      hasCompletedHeartScan = true;
      hasClickedBlockedTest = true;
      hasAcceptedPromise = true;
    }
    if (localStorage.getItem(DAY6_CONFIG.storageKeys.letterRead) === "true") {
      hasReadFullLetter = true;
    }
    if (localStorage.getItem(DAY6_CONFIG.storageKeys.voicePlayed) === "true") {
      hasPlayedVoiceNote = true;
    }
    if (localStorage.getItem(DAY6_CONFIG.storageKeys.wishRevealed) === "true") {
      hasRevealedWish = true;
    }
    if (localStorage.getItem(DAY6_CONFIG.storageKeys.heartScanned) === "true") {
      hasCompletedHeartScan = true;
    }
    if (localStorage.getItem(DAY6_CONFIG.storageKeys.blockedClicked) === "true") {
      hasClickedBlockedTest = true;
    }
    if (localStorage.getItem(DAY6_CONFIG.storageKeys.promiseAccepted) === "true") {
      hasAcceptedPromise = true;
    }
  } catch (err) {}

  initDay6AmbientParticles();
  initNextDayNavigation();

  if (!isMazeSolved) {
    if (gameLockedView) gameLockedView.style.display = "flex";
    if (unlockedView) unlockedView.style.display = "none";
    initNoReturnMaze();
    return;
  }

  launchActualDay6Content();
}

function initDay6AmbientParticles() {
  const canvas = document.getElementById("day6ParticlesCanvas");
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
 * GATE 2: THE NO-RETURN MAZE CONTROLLER
 * Stages 1 to 6 collect: ['O', 'B', 'T', 'A', 'B', 'I']
 * Stage 7: Enter Code SHAZAN
 * ==========================================================================
 */
function initNoReturnMaze() {
  const stageIndicator = document.getElementById("mazeStageIndicator");
  const feedbackToast = document.getElementById("mazeFeedbackToast");
  const successOverlay = document.getElementById("mazeSuccessOverlay");
  const codeInput = document.getElementById("mazePasswordInput");
  const terminalStatus = document.getElementById("mazeTerminalStatus");
  const submitCodeBtn = document.getElementById("mazeSubmitCodeBtn");

  const clueFragments = {
    1: "O",
    2: "B",
    3: "T",
    4: "A",
    5: "B",
    6: "I"
  };

  let mazeTransitioning = false;
  let mazeResetTimer = null;
  let exitIsOpening = false;

  function updateHUD() {
    if (stageIndicator) {
      stageIndicator.textContent = `STAGE ${currentMazeStage} / ${totalMazeStages}`;
    }

    for (let i = 1; i <= 3; i++) {
      const life = document.getElementById(`life${i}`);
      if (life) life.classList.toggle("is-lost", mazeLives < i);
    }

    for (let i = 1; i <= 6; i++) {
      const slot = document.getElementById(`clueSlot${i}`);
      if (!slot) continue;

      const fragment = collectedClues[i - 1];
      slot.textContent = fragment || "?";
      slot.classList.toggle("collected", Boolean(fragment));
    }
  }

  function updateFinalVaultPrompt() {
    const finalPanel = document.getElementById("mazeStage7");
    if (!finalPanel) return;

    const description = finalPanel.querySelector(".stage-description");
    const hint = finalPanel.querySelector(".stage-whisper-rule");
    const encrypted = collectedClues.filter(Boolean).join(" • ") || "O • B • T • A • B • I";

    if (description) {
      description.innerHTML = `Tumne chhe encrypted fragments collect kiye hain: <strong class="highlight-code">${encrypted}</strong>.<br><br>Har letter ko alphabet mein ek step peeche le jao (Shift -1). Phir un letters ko sahi order mein rearrange karke master password enter karo.`;
    }

    if (hint) {
      hint.innerHTML = `💡 <strong>Vault Hint:</strong> “Shahid + Faizan = ? (Audio note me Tedduu ne yahi naam liya tha ❤️)”`;
    }
  }

  function showStage(stageNum) {
    currentMazeStage = Math.max(1, Math.min(stageNum, totalMazeStages));
    updateHUD();

    for (let s = 1; s <= totalMazeStages; s++) {
      const panel = document.getElementById(`mazeStage${s}`);
      if (panel) {
        panel.style.display = (s === currentMazeStage) ? "flex" : "none";
        panel.classList.toggle("is-active", s === currentMazeStage);
      }
    }

    if (currentMazeStage === 7) {
      updateFinalVaultPrompt();
      if (codeInput) {
        codeInput.value = "";
        codeInput.focus();
      }
    }
  }

  function clearResetTimer() {
    if (mazeResetTimer) {
      clearTimeout(mazeResetTimer);
      mazeResetTimer = null;
    }
  }

  function resetMaze(message = "Maze restarted. Three lives restored. Read the clues carefully.") {
    clearResetTimer();
    mazeLives = 3;
    collectedClues = [];
    currentMazeStage = 1;
    mazeTransitioning = false;
    exitIsOpening = false;

    if (successOverlay) successOverlay.style.display = "none";
    if (terminalStatus) {
      terminalStatus.textContent = "";
      terminalStatus.style.color = "";
    }
    if (codeInput) codeInput.value = "";

    showStage(1);
    if (feedbackToast) feedbackToast.textContent = message;
    playToneSound(150, "sawtooth", 0.35, 0.08);
  }

  function handleMistake(btn, message = "Wrong choice! One life lost.") {
    if (mazeTransitioning || exitIsOpening) return;
    mazeLives = Math.max(0, mazeLives - 1);
    playToneSound(180, "sawtooth", 0.35, 0.1);

    if (btn) {
      btn.classList.add("shake-error");
      setTimeout(() => btn.classList.remove("shake-error"), 500);
    }

    updateHUD();

    if (mazeLives <= 0) {
      mazeTransitioning = true;
      if (feedbackToast) feedbackToast.textContent = "DEAD END! All three lives are gone. The maze is resetting...";
      if (terminalStatus) terminalStatus.textContent = "NO LIVES LEFT. RESETTING MAZE...";
      mazeResetTimer = setTimeout(() => resetMaze(), 1300);
    } else {
      const remaining = `${mazeLives} ${mazeLives === 1 ? "life" : "lives"} remaining ❤️`;
      if (feedbackToast) feedbackToast.textContent = `${message} ${remaining}`;
      if (terminalStatus && currentMazeStage === 7) {
        terminalStatus.style.color = "#ff3355";
        terminalStatus.textContent = `${message} ${remaining}`;
      }
    }
  }

  const choiceBtns = document.querySelectorAll(".maze-choice-btn[data-stage]");
  choiceBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stage = Number.parseInt(btn.dataset.stage, 10);
      const choiceType = btn.dataset.choice;

      if (mazeTransitioning || exitIsOpening || stage !== currentMazeStage || stage < 1 || stage > 6) return;

      if (choiceType === "correct") {
        const fragment = clueFragments[stage];
        if (!fragment) return;

        mazeTransitioning = true;
        collectedClues[stage - 1] = fragment;
        playToneSound(587.33, "sine", 0.2, 0.1);
        updateHUD();

        if (feedbackToast) {
          feedbackToast.textContent = `Correct choice! Encrypted fragment '${fragment}' collected. (${stage}/6) ✨`;
        }

        setTimeout(() => {
          mazeTransitioning = false;
          showStage(stage + 1);
        }, 450);
      } else {
        handleMistake(btn, "Galat raasta! One life lost.");
      }
    });
  });

  function attemptExitUnlock() {
    if (!codeInput || mazeTransitioning || exitIsOpening || currentMazeStage !== 7) return;
    const entered = codeInput.value.trim().toUpperCase().replace(/\s+/g, "");

    if (entered === DAY6_CONFIG.finalCode) {
      exitIsOpening = true;
      isMazeSolved = true;
      try {
        localStorage.setItem(DAY6_CONFIG.storageKeys.mazeSolved, "true");
      } catch (e) {}

      playToneSound(523.25, "triangle", 0.3, 0.1);
      setTimeout(() => playToneSound(659.25, "triangle", 0.35, 0.1), 150);
      setTimeout(() => playToneSound(783.99, "triangle", 0.5, 0.12), 300);

      if (terminalStatus) {
        terminalStatus.style.color = "#52e396";
        terminalStatus.textContent = "ACCESS GRANTED. VAULT OPENING...";
      }
      if (submitCodeBtn) submitCodeBtn.disabled = true;

      setTimeout(() => {
        if (successOverlay) successOverlay.style.display = "flex";
        setTimeout(() => {
          const gameView = document.getElementById("day6GameLockedView");
          if (gameView) gameView.style.display = "none";
          launchActualDay6Content();
        }, 2200);
      }, 500);
    } else {
      handleMistake(null, "Incorrect code. Fragments decode karo aur sahi order mein arrange karo.");
      if (mazeLives > 0 && terminalStatus) {
        terminalStatus.style.color = "#ff3355";
        terminalStatus.textContent = `INCORRECT CODE. ${mazeLives} ${mazeLives === 1 ? "life" : "lives"} remaining.`;
      }
      if (mazeLives > 0) {
        codeInput.value = "";
        codeInput.focus();
      }
    }
  }

  if (submitCodeBtn) submitCodeBtn.addEventListener("click", attemptExitUnlock);
  if (codeInput) {
    codeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        attemptExitUnlock();
      }
    });
  }

  if (submitCodeBtn) submitCodeBtn.disabled = false;
  updateHUD();
  showStage(1);
}

function launchActualDay6Content() {
  const gameLockedView = document.getElementById("day6GameLockedView");
  if (gameLockedView) gameLockedView.style.display = "none";

  const unlockedView = document.getElementById("day6UnlockedView");
  if (unlockedView) unlockedView.style.display = "block";

  let alreadyCompleted = false;
  try {
    alreadyCompleted = localStorage.getItem(DAY6_CONFIG.storageKeys.completed) === "true";
  } catch (e) {}

  initIntroSequence(alreadyCompleted);
  initExperienceLetterReading(alreadyCompleted);
  initExperienceVintageAnsweringMachine(alreadyCompleted);
  initExperienceWishCapsule(alreadyCompleted);
  initExperienceBiometricHeart(alreadyCompleted);
  initExperienceBlockedTest(alreadyCompleted);
  initExperienceSilentPromises(alreadyCompleted);

  updateDay6Progress();

  if (alreadyCompleted) {
    renderCompletionView();
  }
}

function updateDay6Progress() {
  const fill = document.getElementById("day6ProgressFill");
  const pctText = document.getElementById("day6ProgressPct");
  const badge = document.getElementById("day6StepBadge");

  let completedSteps = 1;
  if (hasReadFullLetter) completedSteps++;
  if (hasPlayedVoiceNote) completedSteps++;
  if (hasRevealedWish) completedSteps++;
  if (hasCompletedHeartScan) completedSteps++;
  if (hasClickedBlockedTest) completedSteps++;
  if (hasAcceptedPromise) completedSteps++;

  const pct = Math.min(Math.round((completedSteps / 7) * 100), 100);
  if (fill) fill.style.width = `${pct}%`;
  if (pctText) pctText.textContent = `${pct}%`;
  if (badge) badge.textContent = `STEP ${Math.min(completedSteps, 7)} / 7`;
}

function initIntroSequence(skipIntro) {
  const introStage = document.getElementById("day6IntroStage");
  const mainStage = document.getElementById("mainDay6Content");
  const skipBtn = document.getElementById("skipIntroBtn");

  const tag = document.getElementById("introTag");
  const title = document.getElementById("introTitle");
  const line1 = document.getElementById("introLine1");
  const line2 = document.getElementById("introLine2");

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

  if (skipBtn) skipBtn.addEventListener("click", endIntro);

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
  }, 3200);

  setTimeout(() => {
    endIntro();
  }, 4800);
}

function initExperienceLetterReading(alreadyCompleted) {
  const keepReadingBtn = document.getElementById("keepReadingBtn");
  const progressPill = document.getElementById("readingProgressPill");
  const actionBar = document.getElementById("keepReadingActionBar");

  if (alreadyCompleted || hasReadFullLetter) {
    for (let i = 1; i <= totalReadingParts; i++) {
      const part = document.getElementById(`letterPart${i}`);
      if (part) part.style.display = "flex";
    }
    if (progressPill) progressPill.textContent = "LETTER — 5 / 5";
    if (actionBar) actionBar.style.display = "none";
    hasReadFullLetter = true;
    return;
  }

  if (!keepReadingBtn) return;

  keepReadingBtn.addEventListener("click", () => {
    readingPartIndex++;

    const nextPart = document.getElementById(`letterPart${readingPartIndex}`);
    if (nextPart) {
      nextPart.style.display = "flex";
      nextPart.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    if (progressPill) {
      progressPill.textContent = `LETTER — ${readingPartIndex} / ${totalReadingParts}`;
    }

    if (readingPartIndex >= totalReadingParts) {
      hasReadFullLetter = true;
      try {
        localStorage.setItem(DAY6_CONFIG.storageKeys.letterRead, "true");
      } catch (e) {}
      if (actionBar) actionBar.style.display = "none";
      updateDay6Progress();
      checkDay6Completion();
    }
  });
}

/**
 * ==========================================================================
 * EXPERIENCE 2: VINTAGE ANSWERING MACHINE (41-MIN RECORDING & SUBTITLES)
 * ==========================================================================
 */
function initExperienceVintageAnsweringMachine(alreadyCompleted) {
  const audio = document.getElementById("voiceAudio");
  const playBtn = document.getElementById("voicePlayBtn");
  const playIcon = document.getElementById("voicePlayIcon");
  const playLabel = document.getElementById("voicePlayLabel");
  const scrubBar = document.getElementById("voiceScrubBar");
  const scrubFill = document.getElementById("voiceScrubFill");
  const timeDigits = document.getElementById("deckTimeDigits");
  const deckLed = document.getElementById("deckLed");
  const deckStatus = document.getElementById("deckStatusText");
  const cassetteChassis = document.getElementById("cassetteChassis");
  const transcriptLine = document.getElementById("transcriptTypedLine");

  const muteBtn = document.getElementById("voiceMuteBtn");
  const muteIcon = document.getElementById("voiceMuteIcon");
  const volumeSlider = document.getElementById("voiceVolumeSlider");

  if (!playBtn) return;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  if (audio) {
    audio.addEventListener("error", () => {
      isSimulatedVoice = true;
    });
  }

  function updateTranscriptSubtitles(currentTime) {
    if (!transcriptLine) return;
    let activeText = "";
    for (let i = 0; i < answeringMachineSubtitles.length; i++) {
      if (currentTime >= answeringMachineSubtitles[i].time) {
        activeText = answeringMachineSubtitles[i].text;
      } else {
        break;
      }
    }
    if (activeText && transcriptLine.textContent !== activeText) {
      transcriptLine.style.opacity = "0";
      setTimeout(() => {
        transcriptLine.textContent = activeText;
        transcriptLine.style.opacity = "1";
      }, 150);
    }
  }

  function setDeckUIPlaying(isPlaying) {
    if (isPlaying) {
      if (cassetteChassis) cassetteChassis.classList.add("is-playing");
      if (deckLed) deckLed.classList.add("active");
      if (deckStatus) deckStatus.textContent = "● PLAYING CASSETTE ";
      if (playBtn) playBtn.classList.add("playing");
      if (playIcon) playIcon.textContent = "❚❚";
      if (playLabel) playLabel.textContent = "PAUSE TAPE";
    } else {
      if (cassetteChassis) cassetteChassis.classList.remove("is-playing");
      if (deckLed) deckLed.classList.remove("active");
      if (deckStatus) deckStatus.textContent = "STANDBY // READY";
      if (playBtn) playBtn.classList.remove("playing");
      if (playIcon) playIcon.textContent = "▶";
      if (playLabel) playLabel.textContent = "PLAY TAPE";
    }
  }

  function startSimulatedPlayback() {
    setDeckUIPlaying(true);
    playAnsweringMachineBeep();

    if (voiceSimInterval) clearInterval(voiceSimInterval);
    voiceSimInterval = setInterval(() => {
      voiceSimTime += 1;
      if (voiceSimTime >= voiceSimDuration) {
        voiceSimTime = 0;
        stopSimulatedPlayback();
        if (timeDigits) timeDigits.textContent = "00:00";
        if (scrubFill) scrubFill.style.width = "0%";
        return;
      }
      if (timeDigits) timeDigits.textContent = formatTime(voiceSimTime);
      const pct = (voiceSimTime / voiceSimDuration) * 100;
      if (scrubFill) scrubFill.style.width = `${pct}%`;
      updateTranscriptSubtitles(voiceSimTime);
    }, 1000);
  }

  function stopSimulatedPlayback() {
    if (voiceSimInterval) {
      clearInterval(voiceSimInterval);
      voiceSimInterval = null;
    }
    setDeckUIPlaying(false);
  }

  function togglePlay() {
    if (audio && !isSimulatedVoice) {
      if (audio.paused) {
        playAnsweringMachineBeep();
        setTimeout(() => {
          audio.play().then(() => {
            setDeckUIPlaying(true);
          }).catch(() => {
            isSimulatedVoice = true;
            startSimulatedPlayback();
          });
        }, 400);
      } else {
        audio.pause();
        setDeckUIPlaying(false);
      }
    } else {
      if (voiceSimInterval) {
        stopSimulatedPlayback();
      } else {
        startSimulatedPlayback();
      }
    }

    if (!hasPlayedVoiceNote) {
      hasPlayedVoiceNote = true;
      try {
        localStorage.setItem(DAY6_CONFIG.storageKeys.voicePlayed, "true");
      } catch (e) {}
      updateDay6Progress();
      checkDay6Completion();
    }
  }

  playBtn.addEventListener("click", togglePlay);

  if (audio) {
    audio.addEventListener("timeupdate", () => {
      if (isSimulatedVoice) return;
      const current = audio.currentTime;
      const total = audio.duration || voiceSimDuration;
      if (timeDigits) timeDigits.textContent = formatTime(current);

      if (!isNaN(total) && total > 0) {
        const pct = (current / total) * 100;
        if (scrubFill) scrubFill.style.width = `${pct}%`;
      }
      updateTranscriptSubtitles(current);
    });

    audio.addEventListener("ended", () => {
      setDeckUIPlaying(false);
    });
  }

  function seekDeck(e) {
    if (!scrubBar) return;
    const rect = scrubBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekPct = Math.min(Math.max(clickX / width, 0), 1);

    if (audio && !isSimulatedVoice && !isNaN(audio.duration) && audio.duration > 0) {
      audio.currentTime = seekPct * audio.duration;
    } else {
      voiceSimTime = Math.floor(seekPct * voiceSimDuration);
      if (timeDigits) timeDigits.textContent = formatTime(voiceSimTime);
      if (scrubFill) scrubFill.style.width = `${seekPct * 100}%`;
      updateTranscriptSubtitles(voiceSimTime);
    }
  }

  if (scrubBar) scrubBar.addEventListener("click", seekDeck);

  if (volumeSlider && audio) {
    volumeSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      audio.volume = val;
      audio.muted = (val === 0);
      if (muteIcon) muteIcon.textContent = (audio.muted || val === 0) ? "🔇" : "🔊";
    });
  }

  if (muteBtn && audio) {
    muteBtn.addEventListener("click", () => {
      audio.muted = !audio.muted;
      if (muteIcon) muteIcon.textContent = audio.muted ? "🔇" : "🔊";
    });
  }
}

/**
 * ==========================================================================
 * EXPERIENCE 3: THE 11:11 SECRET WISH CAPSULE 🕯️✨
 * ==========================================================================
 */
function initExperienceWishCapsule(alreadyCompleted) {
  const revealBtn = document.getElementById("revealWishBtn");
  const actionWrap = document.getElementById("wishActionWrap");
  const revealedCard = document.getElementById("revealedWishCard");

  if (!revealBtn) return;

  if (alreadyCompleted || hasRevealedWish) {
    if (actionWrap) actionWrap.style.display = "none";
    if (revealedCard) revealedCard.style.display = "block";
    hasRevealedWish = true;
    return;
  }

  revealBtn.addEventListener("click", () => {
    hasRevealedWish = true;
    try {
      localStorage.setItem(DAY6_CONFIG.storageKeys.wishRevealed, "true");
    } catch (e) {}

    playToneSound(587.33, "triangle", 0.35, 0.1);
    setTimeout(() => playToneSound(880, "sine", 0.6, 0.12), 150);

    if (actionWrap) actionWrap.style.display = "none";
    if (revealedCard) {
      revealedCard.style.display = "block";
      revealedCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    updateDay6Progress();
    checkDay6Completion();
  });
}

/**
 * ==========================================================================
 * EXPERIENCE 4: THE HEARTBEAT / BIOMETRIC FINGERPRINT SENSOR 🖤⚡
 * ==========================================================================
 */
function initExperienceBiometricHeart(alreadyCompleted) {
  const pad = document.getElementById("fingerprintSensorPad");
  const ringFill = document.getElementById("scannerRingFill");
  const statusHeadline = document.getElementById("scannerStatusHeadline");
  const pctIndicator = document.getElementById("scannerPctIndicator");
  const decodedModal = document.getElementById("confessionDecodedModal");

  if (!pad) return;

  if (alreadyCompleted || hasCompletedHeartScan) {
    if (statusHeadline) statusHeadline.textContent = "HEART SYNCHRONIZED ✓";
    if (pctIndicator) pctIndicator.textContent = "SCAN COMPLETE • 100%";
    if (ringFill) ringFill.style.strokeDashoffset = "0";
    if (decodedModal) decodedModal.style.display = "block";
    hasCompletedHeartScan = true;
    return;
  }

  const maxDashOffset = 452;
  const requiredHoldTimeMs = 3000;
  let holdStartTime = 0;
  let holdInterval = null;
  let heartbeatAudioInterval = null;
  let isScanning = false;

  function startHoldScan(e) {
    if (hasCompletedHeartScan || isScanning) return;
    if (e.cancelable) e.preventDefault();

    isScanning = true;
    holdStartTime = Date.now();
    pad.classList.add("is-holding");

    playHeartbeatSound();
    heartbeatAudioInterval = setInterval(playHeartbeatSound, 750);

    holdInterval = setInterval(() => {
      const elapsed = Date.now() - holdStartTime;
      const progress = Math.min(elapsed / requiredHoldTimeMs, 1);
      const pct = Math.round(progress * 100);

      const offset = maxDashOffset - (progress * maxDashOffset);
      if (ringFill) ringFill.style.strokeDashoffset = offset.toString();

      if (statusHeadline) statusHeadline.textContent = "READING UNSPOKEN EMOTIONS...";
      if (pctIndicator) pctIndicator.textContent = `SCANNING • ${pct}%`;

      if (progress >= 1) {
        completeBiometricScan();
      }
    }, 40);
  }

  function cancelHoldScan() {
    if (!isScanning || hasCompletedHeartScan) return;
    isScanning = false;
    pad.classList.remove("is-holding");

    clearInterval(holdInterval);
    clearInterval(heartbeatAudioInterval);

    if (ringFill) ringFill.style.strokeDashoffset = maxDashOffset.toString();
    if (statusHeadline) statusHeadline.textContent = "[ SCAN INTERRUPTED • HOLD 3 SECONDS ]";
    if (pctIndicator) pctIndicator.textContent = "RESET • 0%";

    playToneSound(180, "sawtooth", 0.25, 0.08);
  }

  function completeBiometricScan() {
    isScanning = false;
    hasCompletedHeartScan = true;
    pad.classList.remove("is-holding");

    clearInterval(holdInterval);
    clearInterval(heartbeatAudioInterval);

    try {
      localStorage.setItem(DAY6_CONFIG.storageKeys.heartScanned, "true");
    } catch (e) {}

    playToneSound(523.25, "triangle", 0.3, 0.1);
    setTimeout(() => playToneSound(659.25, "triangle", 0.35, 0.1), 140);
    setTimeout(() => playToneSound(783.99, "sine", 0.55, 0.12), 280);

    if (ringFill) {
      ringFill.style.strokeDashoffset = "0";
      ringFill.style.stroke = "#52e396";
    }
    if (statusHeadline) statusHeadline.textContent = "BIOMETRIC LOCKED & VERIFIED ✓";
    if (pctIndicator) pctIndicator.textContent = "AUTHENTICATED • 100%";

    setTimeout(() => {
      if (decodedModal) {
        decodedModal.style.display = "block";
        decodedModal.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 450);

    updateDay6Progress();
    checkDay6Completion();
  }

  pad.addEventListener("pointerdown", startHoldScan);
  pad.addEventListener("pointerup", cancelHoldScan);
  pad.addEventListener("pointerleave", cancelHoldScan);
  pad.addEventListener("pointercancel", cancelHoldScan);

  pad.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && !isScanning && !hasCompletedHeartScan) {
      e.preventDefault();
      startHoldScan(e);
    }
  });

  pad.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      cancelHoldScan();
    }
  });
}

function initExperienceBlockedTest(alreadyCompleted) {
  const linkBtn = document.getElementById("blockedTestLinkBtn");
  if (!linkBtn) return;

  linkBtn.addEventListener("click", () => {
    hasClickedBlockedTest = true;
    try {
      localStorage.setItem(DAY6_CONFIG.storageKeys.blockedClicked, "true");
    } catch (e) {}

    updateDay6Progress();
    checkDay6Completion();
  });
}

/**
 * ==========================================================================
 * EXPERIENCE 6: THE UNWRITTEN CONTRACT / SILENT PROMISES 🤝📜
 * ==========================================================================
 */
function initExperienceSilentPromises(alreadyCompleted) {
  const acceptBtn = document.getElementById("acceptPromiseBtn");
  const stampSeal = document.getElementById("promiseStampSeal");
  const actionContainer = document.getElementById("promiseActionContainer");
  const acceptedBanner = document.getElementById("promiseAcceptedBanner");

  if (!acceptBtn) return;

  if (alreadyCompleted || hasAcceptedPromise) {
    if (stampSeal) stampSeal.style.display = "block";
    if (actionContainer) actionContainer.style.display = "none";
    if (acceptedBanner) acceptedBanner.style.display = "block";
    return;
  }

  acceptBtn.addEventListener("click", () => {
    hasAcceptedPromise = true;
    try {
      localStorage.setItem(DAY6_CONFIG.storageKeys.promiseAccepted, "true");
    } catch (e) {}

    playStampSlamSound();

    if (stampSeal) stampSeal.style.display = "block";
    if (actionContainer) actionContainer.style.display = "none";

    setTimeout(() => {
      if (acceptedBanner) acceptedBanner.style.display = "block";
    }, 450);

    updateDay6Progress();
    checkDay6Completion();
  });
}

function checkDay6Completion() {
  if (
    isMazeSolved && 
    hasReadFullLetter && 
    hasPlayedVoiceNote && 
    hasRevealedWish && 
    hasCompletedHeartScan && 
    hasClickedBlockedTest && 
    hasAcceptedPromise
  ) {
    try {
      localStorage.setItem(DAY6_CONFIG.storageKeys.completed, "true");
    } catch (e) {}

    renderCompletionView();
  }
}

function renderCompletionView() {
  const compSection = document.getElementById("day6CompletionSection");
  if (compSection && compSection.style.display === "none") {
    compSection.style.display = "block";
    setTimeout(() => {
      compSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 450);
  }
}

function initNextDayNavigation() {
  const navNextBtn = document.getElementById("navNextDayBtn");
  const compNextBtn = document.getElementById("completionNextDayBtn");

  const handleNextClick = (e) => {
    const day7Data = (typeof JOURNEY_DAYS !== "undefined")
      ? JOURNEY_DAYS.find((d) => d.day === 7)
      : null;

    if (day7Data && typeof isDateUnlocked === "function" && !isDateUnlocked(day7Data.dateStr)) {
      e.preventDefault();
      if (typeof showLockModal === "function") showLockModal(day7Data);
    }
  };

  if (navNextBtn) navNextBtn.addEventListener("click", handleNextClick);
  if (compNextBtn) compNextBtn.addEventListener("click", handleNextClick);
}