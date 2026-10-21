/* ==========================================================================
   BUDDUU — DAY 3: “THE SOUNDTRACK”
   With Live Synced Lyrics, Spotify-Style Wrapped & VIP Concert Ticket
   ========================================================================== */

/**
 * 1. EDITABLE SONG DATA
 */
const songData = {
  title: "Budduu🥭 x Tedduu🍊",
  artist: "Tedduu • For Budduu",
  audio: "song.mp3",
  cover: "album.jpg",
  puzzleImg: "puzzle.jpg"
};

/**
 * 2. SYNCHRONIZED LYRICS WITH TIMESTAMPS
 */
const songLyricsTimeline = [
  { time: 14, text: "Haal-e-dil ko sukoon chahiye..." },
  { time: 20, text: "Poori ik aarzoo chahiye" },
  { time: 28, text: "Jaise pehle kabhi kuch bhi chaaha nahi" },
  { time: 36, text: "Waise hi kyun chahiye..." },
  { time: 43, text: "Dil ko teri maujoodgi ka ehsaas yun chahiye" },
  { time: 49, text: "Tu chahiye, tu chahiye, shaam-o-subah tu chahiye ❤️" },
  { time: 57, text: "Tu chahiye, tu chahiye, har martaba tu chahiye" },
  { time: 64, text: "Jitni dafa zidd ho meri..." },
  { time: 71, text: "Utni dafa tu chahiye 🧡" },
  { time: 78, text: "♫ (Soulful Music Interlude) ♫" },
  { time: 118, text: "Koi aur dooja kyun mujhe na tere siva chahiye" },
  { time: 127, text: "Har safar mein mujhe tu hi rehnuma chahiye" },
  { time: 134, text: "Jeene ko bas mujhe tu hi meherbaan chahiye" },
  { time: 144, text: "Seene mein agar tu dard hai, na koi dawa chahiye" },
  { time: 152, text: "Tu lahoo ki tarah ragon mein ravaan chahiye" },
  { time: 159, text: "Anjaam jo chaahe mera ho, aagaaz yun chahiye" },
  { time: 166, text: "Tu chahiye, tu chahiye, shaam-o-subah tu chahiye" },
  { time: 173, text: "Tu chahiye, tu chahiye, har martaba tu chahiye" },
  { time: 181, text: "Jitni dafa zidd ho meri..." },
  { time: 188, text: "Utni dafa tu chahiye 🧡" },
  { time: 195, text: "♫ (Harmonic Strings & Sunset Echoes) ♫" },
  { time: 209, text: "Mere zakhmon ko teri chhuwan chahiye" },
  { time: 216, text: "Meri shamma ko teri agan chahiye" },
  { time: 224, text: "Mere khwaab ke aashiyane mein tu chahiye" },
  { time: 231, text: "Main kholun jo aankhein sarhaane bhi tu chahiye..." },
  { time: 246, text: "Tu chahiye, tu chahiye, shaam-o-subah tu chahiye" },
  { time: 253, text: "Tu chahiye, tu chahiye, har martaba tu chahiye" },
  { time: 261, text: "Jitni dafa zidd ho meri... utni dafa tu chahiye ❤️" }
];

/**
 * 3. EDITABLE ROMANTIC LETTER
 */
const songMessageParagraphs = [
  "Some songs are just songs.",
  "And then there are songs that carry a person, a moment, and a feeling that never fades.",
  "I don't know exactly when this one became part of our story...",
  "but now whenever it plays, it brings me right back to you. <span class=\"letter-heart\">❤️</span>",
  "Thank you for being my favorite melody."
];

// Interactive Flow State
let isGameSolved = false;
let hasPlayedAudio = false;
let hasRevealedMessage = false;
let hasClaimedTicket = false;

// Audio & Visualizer State
let audioCtx = null;
let analyserNode = null;
let audioSourceNode = null;
let isAudioContextConnected = false;
let visualizerAnimationFrame = null;

// Photo Puzzle State
let puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let puzzleMoves = 0;
let puzzleResolvedImgUrl = "puzzle.jpg";

// Web Audio API Synthesizer Chimes
function playStampChime() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    const ctx = new AudioCtxClass();
    
    // Low stamp thud
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(140, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.2);

    // High celebratory chime
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain2.gain.setValueAtTime(0.12, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.6);
    }, 120);
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
  initDay3Flow();
});

/**
 * Main Flow Controller: Gate 1 → Gate 2 → Actual Day 3
 */
function initDay3Flow() {
  const day3Data = (typeof JOURNEY_DAYS !== "undefined")
    ? JOURNEY_DAYS.find((d) => d.day === 3)
    : { day: 3, dateStr: "2026-10-22" };

  const dateLockedView = document.getElementById("day3DateLockedView");
  const gameLockedView = document.getElementById("day3GameLockedView");
  const unlockedView = document.getElementById("day3UnlockedView");

  // GATE 1: Check Date Lock
  const isDateReady = (typeof isDateUnlocked === "function") 
    ? isDateUnlocked(day3Data.dateStr) 
    : true;

  if (!isDateReady) {
    if (dateLockedView) dateLockedView.style.display = "flex";
    if (gameLockedView) gameLockedView.style.display = "none";
    if (unlockedView) unlockedView.style.display = "none";

    const daysRemaining = (typeof getDaysUntil === "function") ? getDaysUntil(day3Data.dateStr) : 0;
    const countdownEl = document.getElementById("dateLockCountdown");
    if (countdownEl) {
      countdownEl.textContent = daysRemaining > 0 
        ? `Unlocks in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} (22 October 2026)`
        : "Unlocks on 22 October 2026";
    }
    return;
  }

  if (dateLockedView) dateLockedView.style.display = "none";

  // Check persistent storage
  try {
    if (localStorage.getItem("budduu_day3_lock_solved") === "true") {
      isGameSolved = true;
    }
    if (localStorage.getItem("budduu_day3_ticket_claimed") === "true") {
      hasClaimedTicket = true;
    }
    if (localStorage.getItem("budduu_day3_completed") === "true") {
      isGameSolved = true;
      hasPlayedAudio = true;
      hasRevealedMessage = true;
      hasClaimedTicket = true;
    }
  } catch (err) {}

  initDay3Particles();
  initNextDayNavigation();

  // GATE 2: Photo Puzzle
  if (!isGameSolved) {
    if (gameLockedView) gameLockedView.style.display = "flex";
    if (unlockedView) unlockedView.style.display = "none";
    initPhotoMemoryPuzzle();
    return;
  }

  launchActualDay3Content();
}

/**
 * Ambient Particles Canvas
 */
function initDay3Particles() {
  const canvas = document.getElementById("day3ParticlesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  const screenWidth = window.innerWidth;
  const count = screenWidth <= 768 ? 20 : 36;
  const particles = [];
  const musicalSymbols = ["♪", "♫", "✨", "✦", "♩", "🧡"];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * screenWidth,
      y: Math.random() * window.innerHeight,
      symbol: musicalSymbols[Math.floor(Math.random() * musicalSymbols.length)],
      size: Math.random() * 12 + 11,
      speedY: Math.random() * 0.35 + 0.15,
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.45 + 0.2,
      pulse: Math.random() * Math.PI
    });
  }

  function render() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < -30) {
        p.y = h + 20;
        p.x = Math.random() * w;
      }

      p.pulse += 0.025;
      const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

      ctx.fillStyle = `rgba(255, 179, 71, ${alpha})`;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.symbol, p.x, p.y);
    });

    requestAnimationFrame(render);
  }

  render();
}

/**
 * ==========================================================================
 * GATE 2: PHOTO PUZZLE CONTROLLER
 * ==========================================================================
 */
function initPhotoMemoryPuzzle() {
  const board = document.getElementById("puzzleBoardGrid");
  const movesEl = document.getElementById("puzzleMovesCount");
  const previewBtn = document.getElementById("previewPhotoBtn");
  const previewOverlay = document.getElementById("puzzlePreviewOverlay");
  const closePreviewBtn = document.getElementById("closePreviewBtn");
  const closePreviewBackdrop = document.getElementById("closePreviewBackdrop");
  const loveOverlay = document.getElementById("puzzleLoveOverlay");
  const continueBtn = document.getElementById("continueToSoundtrackBtn");

  if (!board) return;

  const testImg = new Image();
  testImg.src = songData.puzzleImg;
  testImg.onload = () => {
    puzzleResolvedImgUrl = songData.puzzleImg;
    setupAndRenderPuzzle();
  };
  testImg.onerror = () => {
    puzzleResolvedImgUrl = songData.cover;
    const previewImg = document.getElementById("previewImgEl");
    const thumbImg = document.getElementById("completedThumbImg");
    if (previewImg) previewImg.src = puzzleResolvedImgUrl;
    if (thumbImg) thumbImg.src = puzzleResolvedImgUrl;
    setupAndRenderPuzzle();
  };

  function setupAndRenderPuzzle() {
    puzzleMoves = 0;
    if (movesEl) movesEl.textContent = "0";

    puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    shufflePuzzleValidly(30);
    renderBoard();
  }

  function shufflePuzzleValidly(steps) {
    let emptyIdx = 8;
    let lastMoved = -1;

    for (let s = 0; s < steps; s++) {
      const neighbors = getValidNeighbors(emptyIdx).filter((idx) => idx !== lastMoved);
      const chosen = neighbors[Math.floor(Math.random() * neighbors.length)] || neighbors[0];
      
      puzzleTiles[emptyIdx] = puzzleTiles[chosen];
      puzzleTiles[chosen] = 8;
      lastMoved = chosen;
      emptyIdx = chosen;
    }
  }

  function getValidNeighbors(idx) {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const neighbors = [];

    if (row > 0) neighbors.push(idx - 3);
    if (row < 2) neighbors.push(idx + 3);
    if (col > 0) neighbors.push(idx - 1);
    if (col < 2) neighbors.push(idx + 1);

    return neighbors;
  }

  function renderBoard() {
    board.innerHTML = "";

    puzzleTiles.forEach((tileVal, currentPos) => {
      const tileDiv = document.createElement("div");
      tileDiv.className = "puzzle-tile";
      tileDiv.setAttribute("role", "button");
      tileDiv.setAttribute("tabindex", "0");

      if (tileVal === 8) {
        tileDiv.classList.add("is-empty");
        tileDiv.setAttribute("aria-label", "Empty Tile Slot");
      } else {
        const origRow = Math.floor(tileVal / 3);
        const origCol = tileVal % 3;
        const posX = origCol * 50;
        const posY = origRow * 50;

        tileDiv.style.backgroundImage = `url('${puzzleResolvedImgUrl}')`;
        tileDiv.style.backgroundSize = "300% 300%";
        tileDiv.style.backgroundPosition = `${posX}% ${posY}%`;
        tileDiv.setAttribute("aria-label", `Piece ${tileVal + 1}`);

        const badge = document.createElement("span");
        badge.className = "puzzle-tile-badge";
        badge.textContent = tileVal + 1;
        tileDiv.appendChild(badge);

        tileDiv.addEventListener("click", () => handleTileClick(currentPos));
        tileDiv.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTileClick(currentPos);
          }
        });
      }

      board.appendChild(tileDiv);
    });
  }

  function handleTileClick(clickedPos) {
    const emptyPos = puzzleTiles.indexOf(8);
    const validMoves = getValidNeighbors(emptyPos);

    if (validMoves.includes(clickedPos)) {
      puzzleTiles[emptyPos] = puzzleTiles[clickedPos];
      puzzleTiles[clickedPos] = 8;
      puzzleMoves++;
      if (movesEl) movesEl.textContent = puzzleMoves;

      renderBoard();
      checkPuzzleSolved();
    }
  }

  function checkPuzzleSolved() {
    const isSolved = puzzleTiles.every((val, idx) => val === idx);
    if (isSolved) {
      triggerPuzzleSuccess();
    }
  }

  function triggerPuzzleSuccess() {
    isGameSolved = true;
    try {
      localStorage.setItem("budduu_day3_lock_solved", "true");
    } catch (e) {}

    renderBoard();
    const allTiles = board.querySelectorAll(".puzzle-tile");
    if (allTiles[8]) {
      allTiles[8].classList.remove("is-empty");
      allTiles[8].style.backgroundImage = `url('${puzzleResolvedImgUrl}')`;
      allTiles[8].style.backgroundSize = "300% 300%";
      allTiles[8].style.backgroundPosition = "100% 100%";
    }

    setTimeout(() => {
      if (loveOverlay) loveOverlay.style.display = "flex";
    }, 450);
  }

  if (previewBtn && previewOverlay) {
    previewBtn.addEventListener("click", () => {
      previewOverlay.style.display = "flex";
    });
  }

  const hidePreview = () => {
    if (previewOverlay) previewOverlay.style.display = "none";
  };
  if (closePreviewBtn) closePreviewBtn.addEventListener("click", hidePreview);
  if (closePreviewBackdrop) closePreviewBackdrop.addEventListener("click", hidePreview);

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      if (loveOverlay) loveOverlay.style.display = "none";
      const gameLockedView = document.getElementById("day3GameLockedView");
      if (gameLockedView) gameLockedView.style.display = "none";
      launchActualDay3Content();
    });
  }
}

/**
 * Launch Actual Day 3 Content
 */
function launchActualDay3Content() {
  const unlockedView = document.getElementById("day3UnlockedView");
  if (unlockedView) unlockedView.style.display = "block";

  let alreadyCompleted = false;
  try {
    alreadyCompleted = localStorage.getItem("budduu_day3_completed") === "true";
  } catch (e) {}

  initIntroSequence(alreadyCompleted);
  initMusicPlayer();
  initSongMessageReveal();
  initConcertTicketExperience();
  updateProgressHUD();

  if (alreadyCompleted) {
    hasPlayedAudio = true;
    hasRevealedMessage = true;
    hasClaimedTicket = true;
    renderCompletionView();
  }
}

function updateProgressHUD() {
  let step = 1; // Puzzle solved
  if (hasPlayedAudio) step++;
  if (hasRevealedMessage) step++;
  if (hasClaimedTicket) step++;

  const pct = Math.min(step * 25, 100);
  const fill = document.getElementById("journeyProgressFill");
  const pctText = document.getElementById("journeyProgressPct");
  const badge = document.getElementById("day3StepBadge");

  if (fill) fill.style.width = `${pct}%`;
  if (pctText) pctText.textContent = `${pct}%`;
  if (badge) badge.textContent = `DAY 03 / 10 • ${pct}%`;
}

/**
 * Cinematic Intro Sequence
 */
function initIntroSequence(skipIntro) {
  const introStage = document.getElementById("soundtrackIntroStage");
  const mainStage = document.getElementById("mainDay3Content");
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

  if (skipBtn) skipBtn.addEventListener("click", endIntro);

  setTimeout(() => {
    if (!isDismissed && tag && title) {
      tag.style.opacity = "1";
      tag.style.transform = "translateY(0)";
      tag.style.filter = "blur(0)";
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
 * EXPERIENCE 1: HARDWARE AUDIO PLAYER + LIVE SYNCED LYRICS
 * ==========================================================================
 */
function initMusicPlayer() {
  const audio = document.getElementById("soundtrackAudio");
  const playBtn = document.getElementById("masterPlayBtn");
  const playSymbol = document.getElementById("playSymbol");
  const progressBarTrack = document.getElementById("progressBarTrack");
  const progressBarCurrent = document.getElementById("progressBarCurrent");
  const currentTimeLabel = document.getElementById("currentTimeLabel");
  const totalDurationLabel = document.getElementById("totalDurationLabel");
  const volumeSlider = document.getElementById("volumeSlider");
  const muteBtn = document.getElementById("muteToggleBtn");
  const volumeIcon = document.getElementById("volumeIcon");

  const trackTitle = document.getElementById("trackTitleText");
  const trackArtist = document.getElementById("trackArtistText");
  const albumCoverImg = document.getElementById("albumCoverImg");
  const albumArtWrap = document.getElementById("albumArtWrap");
  const playerCardWrapper = document.getElementById("playerCardWrapper");
  const lyricsContainer = document.getElementById("lyricsScrollContainer");

  if (trackTitle) trackTitle.textContent = songData.title;
  if (trackArtist) trackArtist.textContent = songData.artist;
  if (albumCoverImg) albumCoverImg.src = songData.cover;
  
  if (audio) {
    audio.src = songData.audio;
    audio.load();
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  let activeLyricIdx = -1;
  const lyricLineEls = [];

  if (lyricsContainer) {
    lyricsContainer.innerHTML = "";
    songLyricsTimeline.forEach((item, index) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = "lyric-line-item";
      lineDiv.textContent = item.text;
      lineDiv.setAttribute("data-time", item.time);
      lineDiv.setAttribute("role", "button");
      lineDiv.setAttribute("tabindex", "0");

      lineDiv.addEventListener("click", () => {
        audio.currentTime = item.time;
        if (audio.paused) {
          audio.play().then(() => setPlayingUIState(true));
        }
      });

      lyricsContainer.appendChild(lineDiv);
      lyricLineEls.push(lineDiv);
    });
  }

  function updateSyncedLyrics(currentTime) {
    if (!lyricLineEls.length) return;

    let currentIdx = -1;
    for (let i = 0; i < songLyricsTimeline.length; i++) {
      if (currentTime >= songLyricsTimeline[i].time) {
        currentIdx = i;
      } else {
        break;
      }
    }

    if (currentIdx !== activeLyricIdx) {
      activeLyricIdx = currentIdx;

      lyricLineEls.forEach((el, idx) => {
        el.classList.remove("is-active", "is-passed");
        if (idx === currentIdx) {
          el.classList.add("is-active");
          const offsetTop = el.offsetTop - lyricsContainer.offsetTop - (lyricsContainer.clientHeight / 2) + (el.clientHeight / 2);
          lyricsContainer.scrollTo({ top: offsetTop, behavior: "smooth" });
        } else if (idx < currentIdx) {
          el.classList.add("is-passed");
        }
      });
    }
  }

  audio.addEventListener("loadedmetadata", () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      totalDurationLabel.textContent = formatTime(audio.duration);
    }
  });

  function togglePlay() {
    setupAudioContext();

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setPlayingUIState(true);
        }).catch((err) => {
          console.warn("Audio play blocked by browser:", err);
        });
      }
    } else {
      audio.pause();
      setPlayingUIState(false);
    }

    hasPlayedAudio = true;
    updateProgressHUD();
    checkDay3Completion();
  }

  function setPlayingUIState(isPlaying) {
    if (isPlaying) {
      playBtn.classList.add("playing");
      playBtn.setAttribute("aria-label", "Pause Track");
      playSymbol.textContent = "❚❚";
      if (albumArtWrap) albumArtWrap.classList.add("is-spinning");
      if (playerCardWrapper) playerCardWrapper.classList.add("is-active-glow");
      document.body.classList.add("is-audio-playing");
      setVisualizerState(true);
    } else {
      playBtn.classList.remove("playing");
      playBtn.setAttribute("aria-label", "Play Track");
      playSymbol.textContent = "▶";
      if (albumArtWrap) albumArtWrap.classList.remove("is-spinning");
      if (playerCardWrapper) playerCardWrapper.classList.remove("is-active-glow");
      document.body.classList.remove("is-audio-playing");
      setVisualizerState(false);
    }
  }

  playBtn.addEventListener("click", togglePlay);

  audio.addEventListener("timeupdate", () => {
    const current = audio.currentTime;
    const total = audio.duration;
    currentTimeLabel.textContent = formatTime(current);

    if (!isNaN(total) && total > 0) {
      const pct = (current / total) * 100;
      progressBarCurrent.style.width = `${pct}%`;
      progressBarTrack.setAttribute("aria-valuenow", Math.round(pct));
    }

    updateSyncedLyrics(current);
  });

  audio.addEventListener("ended", () => {
    setPlayingUIState(false);
  });

  // Scrubber drag & seek
  let isDraggingScrubber = false;

  function updateScrubPos(clientX) {
    const rect = progressBarTrack.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const width = rect.width;
    const seekPct = Math.min(Math.max(clickX / width, 0), 1);

    if (!isNaN(audio.duration) && audio.duration > 0) {
      audio.currentTime = seekPct * audio.duration;
      currentTimeLabel.textContent = formatTime(audio.currentTime);
      progressBarCurrent.style.width = `${seekPct * 100}%`;
    }
  }

  progressBarTrack.addEventListener("pointerdown", (e) => {
    isDraggingScrubber = true;
    progressBarTrack.setPointerCapture(e.pointerId);
    updateScrubPos(e.clientX);
  });

  progressBarTrack.addEventListener("pointermove", (e) => {
    if (isDraggingScrubber) updateScrubPos(e.clientX);
  });

  const stopScrubDrag = (e) => {
    if (isDraggingScrubber) {
      isDraggingScrubber = false;
      try { progressBarTrack.releasePointerCapture(e.pointerId); } catch (err) {}
    }
  };

  progressBarTrack.addEventListener("pointerup", stopScrubDrag);
  progressBarTrack.addEventListener("pointercancel", stopScrubDrag);

  // Volume Controller
  volumeSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    audio.muted = (val === 0);
    updateVolumeIcon(val, audio.muted);
  });

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    if (audio.muted) {
      updateVolumeIcon(0, true);
    } else {
      updateVolumeIcon(audio.volume, false);
    }
  });

  function updateVolumeIcon(vol, isMuted) {
    if (isMuted || vol === 0) {
      volumeIcon.textContent = "🔇";
    } else if (vol < 0.5) {
      volumeIcon.textContent = "🔉";
    } else {
      volumeIcon.textContent = "🔊";
    }
  }

  window.addEventListener("beforeunload", () => {
    if (!audio.paused) audio.pause();
  });

  initVisualizerCanvas();
}

/**
 * ==========================================================================
 * EXPERIENCE 2: VISUALIZER
 * ==========================================================================
 */
function setupAudioContext() {
  if (isAudioContextConnected || window.location.protocol === "file:") return;

  const audio = document.getElementById("soundtrackAudio");
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (AudioContextClass && audio) {
    try {
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === "suspended") audioCtx.resume();

      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 128;

      audioSourceNode = audioCtx.createMediaElementSource(audio);
      audioSourceNode.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);

      isAudioContextConnected = true;
    } catch (e) {
      isAudioContextConnected = false;
    }
  }
}

function initVisualizerCanvas() {
  const canvas = document.getElementById("musicVisualizerCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const isMobile = window.innerWidth <= 768;
  const barCount = isMobile ? 32 : 54;
  const simulatedHeights = new Array(barCount).fill(6);

  let isPlaying = false;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 120;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  window.setVisualizerState = (playing) => {
    isPlaying = playing;
    const dot = document.getElementById("visualizerLiveDot");
    if (dot) {
      if (playing) {
        dot.textContent = "● PLAYING";
        dot.classList.add("live");
      } else {
        dot.textContent = "● IDLE";
        dot.classList.remove("live");
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  };

  function draw() {
    visualizerAnimationFrame = requestAnimationFrame(draw);

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    let dataArray = null;
    let hasLiveAudioData = false;

    if (isAudioContextConnected && analyserNode && isPlaying) {
      dataArray = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteFrequencyData(dataArray);
      hasLiveAudioData = true;
    }

    const gap = 3;
    const totalGap = gap * (barCount - 1);
    const barWidth = Math.max((width - totalGap) / barCount, 2);

    for (let i = 0; i < barCount; i++) {
      let targetHeight = 6;

      if (isPlaying) {
        if (hasLiveAudioData && dataArray) {
          const freqIndex = Math.floor((i / barCount) * dataArray.length);
          const rawVal = dataArray[freqIndex] || 0;
          targetHeight = Math.max((rawVal / 255) * (height - 24), 8);
        } else {
          const time = Date.now() * 0.004;
          const sine = Math.sin(time + i * 0.28);
          const cosine = Math.cos(time * 0.7 + i * 0.16);
          targetHeight = 12 + Math.abs(sine * 50) + Math.abs(cosine * 40);
        }
      } else {
        targetHeight = 6;
      }

      simulatedHeights[i] += (targetHeight - simulatedHeights[i]) * 0.25;

      const x = i * (barWidth + gap);
      const bHeight = simulatedHeights[i];
      const y = height - bHeight - 8;

      const barGradient = ctx.createLinearGradient(0, height, 0, y);
      barGradient.addColorStop(0, "#FF416C");
      barGradient.addColorStop(0.5, "#FF6B4A");
      barGradient.addColorStop(0.85, "#FFB347");
      barGradient.addColorStop(1, "#D946EF");

      ctx.fillStyle = barGradient;
      ctx.shadowBlur = isPlaying ? 10 : 0;
      ctx.shadowColor = "rgba(255, 107, 74, 0.7)";

      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, barWidth, bHeight, [4, 4, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, bHeight);
      }
      ctx.fill();
    }
  }

  draw();
}

/**
 * ==========================================================================
 * EXPERIENCE 3: SONG MESSAGE REVEAL
 * ==========================================================================
 */
function initSongMessageReveal() {
  const btn = document.getElementById("revealMessageBtn");
  const letterBox = document.getElementById("revealedSongLetter");
  const paragraphsList = document.getElementById("messageParagraphsList");
  const statusPrompt = document.getElementById("messageStatusPrompt");
  const actionWrap = document.getElementById("messageActionWrap");

  if (!btn || !letterBox || !paragraphsList) return;

  btn.addEventListener("click", () => {
    actionWrap.style.display = "none";
    if (statusPrompt) statusPrompt.textContent = "A melody etched in words... 🧡";

    paragraphsList.innerHTML = "";
    letterBox.style.display = "block";

    songMessageParagraphs.forEach((text, index) => {
      const p = document.createElement("p");
      p.className = "message-block-item";
      p.innerHTML = text;
      paragraphsList.appendChild(p);

      setTimeout(() => {
        p.classList.add("is-revealed");
      }, 350 + index * 450);
    });

    hasRevealedMessage = true;
    updateProgressHUD();
    checkDay3Completion();
  });
}

/**
 * ==========================================================================
 * EXPERIENCE 5: VIP CONCERT TICKET CLAIM & CONFETTI CELEBRATION
 * ==========================================================================
 */
function initConcertTicketExperience() {
  const claimBtn = document.getElementById("claimTicketBtn");
  const stampOverlay = document.getElementById("ticketStampOverlay");
  const actionBox = document.getElementById("ticketActionBox");
  const claimedBanner = document.getElementById("ticketClaimedBanner");

  if (!claimBtn) return;

  if (hasClaimedTicket) {
    if (stampOverlay) stampOverlay.style.display = "block";
    if (actionBox) actionBox.style.display = "none";
    if (claimedBanner) claimedBanner.style.display = "block";
    return;
  }

  claimBtn.addEventListener("click", () => {
    hasClaimedTicket = true;
    try {
      localStorage.setItem("budduu_day3_ticket_claimed", "true");
    } catch (e) {}

    // 1. Play stamp thud & celebration chime
    playStampChime();

    // 2. Animate Rubber Stamp Slam
    if (stampOverlay) stampOverlay.style.display = "block";
    if (actionBox) actionBox.style.display = "none";

    // 3. Fire Confetti
    launchTicketConfetti();

    // 4. Reveal celebration banner
    setTimeout(() => {
      if (claimedBanner) claimedBanner.style.display = "block";
    }, 500);

    updateProgressHUD();
    checkDay3Completion();
  });
}

/**
 * Confetti Canvas Generator (Lightweight, pure JS, no external libraries)
 */
function launchTicketConfetti() {
  const canvas = document.getElementById("day3ConfettiCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ["#ff416c", "#ff6b4a", "#ffb347", "#52e396", "#ffd700", "#ffffff"];
  const pieces = [];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2,
      w: Math.random() * 9 + 5,
      h: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      gravity: 0.38,
      opacity: 1
    });
  }

  let frame = 0;
  function updateConfetti() {
    ctx.clearRect(0, 0, width, height);

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rot += p.rotSpeed;
      p.opacity -= 0.009;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frame++;
    if (frame < 120) {
      requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  requestAnimationFrame(updateConfetti);
}

/**
 * Completion Criteria
 */
function checkDay3Completion() {
  if (isGameSolved && hasPlayedAudio && hasRevealedMessage && hasClaimedTicket) {
    try {
      localStorage.setItem("budduu_day3_completed", "true");
    } catch (e) {}

    renderCompletionView();
  }
}

function renderCompletionView() {
  const compSection = document.getElementById("day3CompletionSection");
  if (compSection && compSection.style.display === "none") {
    compSection.style.display = "block";
    setTimeout(() => {
      compSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 550);
  }
}

/**
 * Navigation Guard for Day 4
 */
function initNextDayNavigation() {
  const navNextBtn = document.getElementById("navNextDayBtn");
  const compNextBtn = document.getElementById("completionNextDayBtn");

  const handleNextClick = (e) => {
    const day4Data = (typeof JOURNEY_DAYS !== "undefined")
      ? JOURNEY_DAYS.find((d) => d.day === 4)
      : null;

    if (day4Data && typeof isDateUnlocked === "function" && !isDateUnlocked(day4Data.dateStr)) {
      e.preventDefault();
      if (typeof showLockModal === "function") showLockModal(day4Data);
    }
  };

  if (navNextBtn) navNextBtn.addEventListener("click", handleNextClick);
  if (compNextBtn) compNextBtn.addEventListener("click", handleNextClick);
}
