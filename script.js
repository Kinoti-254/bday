const targetDate = "2026-02-07T00:00:00+03:00";
const namePlaceholder = "[Name]";
let hasUnlocked = false;
let musicArmed = false;
let prePlayTriggered = false;

const nameSpan = document.getElementById("name");
if (nameSpan && nameSpan.textContent.trim() === "[Name]") {
  nameSpan.textContent = namePlaceholder;
}

const countdownNote = document.getElementById("countdown-note");
const countdownTease = document.getElementById("countdown-tease");
const heroKickerPre = document.getElementById("hero-kicker-pre");
const heroKickerPost = document.getElementById("hero-kicker-post");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const lockPanel = document.getElementById("lock-panel");
const soundPrompt = document.getElementById("sound-prompt");
const soundToggle = document.getElementById("sound-toggle");
const lyricsTitleEl = document.getElementById("lyrics-title");
const lyricsLinesEl = document.getElementById("lyrics-lines");

function lockSite() {
  document.body.classList.add("locked");
  if (lockPanel) {
    lockPanel.setAttribute("aria-hidden", "false");
  }
}

function unlockSite() {
  document.body.classList.remove("locked");
  if (lockPanel) {
    lockPanel.setAttribute("aria-hidden", "true");
  }
}

function triggerUnlockEffects() {
  document.body.classList.add("unlock-burst");
  document.body.classList.add("unlocked");
  setTimeout(() => document.body.classList.remove("unlock-burst"), 1600);
  sprinkleConfetti();
  if (!prePlayTriggered) {
    startBirthdayAudio();
  }
}

function updateCountdown() {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();

  if (Number.isNaN(target.getTime())) {
    countdownNote.textContent = "Add a valid date in script.js to start the countdown.";
    if (countdownTease) {
      countdownTease.hidden = true;
    }
    if (heroKickerPre && heroKickerPost) {
      heroKickerPre.hidden = false;
      heroKickerPost.hidden = true;
    }
    return;
  }

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    countdownNote.textContent = "It is today! Finally 20 years old, Happy birthday my Love. I'm so proud of you, I Love you ????. Thou little??, I hope you like it??. Enjoy :)";
    if (countdownTease) {
      countdownTease.hidden = true;
    }
    if (heroKickerPre && heroKickerPost) {
      heroKickerPre.hidden = true;
      heroKickerPost.hidden = false;
    }
    if (!hasUnlocked) {
      unlockSite();
      stopWaitingMusic();
      triggerUnlockEffects();
      hasUnlocked = true;
    }
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
  countdownNote.textContent = "Counting down to the big moment.";
  if (countdownTease) {
    countdownTease.hidden = false;
  }
  if (heroKickerPre && heroKickerPost) {
    heroKickerPre.hidden = false;
    heroKickerPost.hidden = true;
  }
  if (!hasUnlocked) {
    lockSite();
    autoStartWaitingAudio();
    if (activeAudio && !activeAudio.paused) {
      activeAudio.pause();
      inactiveAudio.pause();
      updatePlayLabel();
    }
  }

}

const starsContainer = document.getElementById("stars");
if (starsContainer) {
  for (let i = 0; i < 45; i += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    starsContainer.appendChild(star);
  }
}

const playToggle = document.getElementById("play-toggle");
const muteToggle = document.getElementById("mute-toggle");
const audioA = document.getElementById("bg-music") || new Audio();
const audioB = new Audio();
const waitingAudio = new Audio("assets/waiting.mp3");
const playlist = [
  "assets/song.mp3",
    "assets/song3.mp3",
  "assets/song4.mp3",
  "assets/song5.mp3",
  "assets/song6.mp3",
];
const crossfadeSeconds = 1;
const songOneMaxSeconds = 86;
const baseVolume = 0.6;
const fallbackLyricsTitle = "Waiting for Song 3";
const fallbackLyricsDuration = 180;
const lyricsScrollDelaySeconds = 8;
const lyricsByIndex = {
  1: {
    title: "Song 3",
    lines: [
      "[Verse 1]",
      "Maybe it's the way you say my name",
      "Maybe it's the way you play your game",
      "But it's so good, I've never known anybody like you",
      "But it's so good, I've never dreamed of nobody like you",
      "",
      "[Pre-Chorus]",
      "And I've heard of a love that comes once in a lifetime",
      "And I'm pretty sure that you are that love of mine",
      "",
      "[Chorus]",
      "'Cause I'm in a field of dandelions",
      "Wishing on every one that you'd be mine, mine",
      "And I see forever in your eyes",
      "I feel okay when I see you smile, smile",
      "",
      "[Post-Chorus]",
      "Wishing on dandelions all of the time",
      "Praying to God that one day you'll be mine",
      "Wishing on dandelions all of the time, all of the time",
      "",
      "[Verse 2]",
      "I think that you are the one for me",
      "Cause it gets so hard to breathe",
      "When you're looking at me",
      "I've never felt so alive and free",
      "When you're looking at me",
      "I've never felt so happy",
      "",
      "[Pre-Chorus]",
      "And I've heard of a love that comes once in a lifetime",
      "And I'm pretty sure that you are that love of mine",
      "",
      "[Chorus]",
      "Cause I'm in a field of dandelions",
      "Wishing on every one that you'd be mine, mine",
      "And I see forever in your eyes",
      "I feel okay when I see you smile, smile",
      "",
      "[Post-Chorus]",
      "Wishing on dandelions all of the time",
      "Praying to God that one day you'll be mine",
      "Wishing on dandelions all of the time, all of the time",
      "",
      "[Bridge]",
      "Dandelion into the wind you go",
      "Won't you let my darling know?",
      "Dandelion into the wind you go",
      "Won't you let my darling know that",
      "",
      "[Chorus]",
      "I'm in a field of dandelions",
      "Wishing on every one that you'd be mine, mine",
      "And I see forever in your eyes",
      "I feel okay when I see you smile, smile",
      "",
      "[Post-Chorus]",
      "Wishing on dandelions all of the time",
      "Praying to God that one day you'll be mine",
      "Wishing on dandelions all of the time, all of the time",
      "",
      "[Outro]",
      "I'm in a field of dandelions",
      "Wishing on every one that you'd be mine, mine"
    ],
  },
  2: {
    title: "Song 4",
    lines: [
      "VERSE 1",
      "They say the holy waters watered down and this town's lost it faith",
      "Our colors will fade Eventually",
      "So if our time is running out day after day we?ll make the mundane our masterpiece",
      "",
      "PRE",
      "Oh my my Oh my my",
      "Love I take one look at you",
      "",
      "CHORUS",
      "Taking me out of",
      "Of the ordinary I want you laying me down",
      "Til we?re dead and buried",
      "On the edge of your knife",
      "Staying drunk on your vine the",
      "Angels up in the clouds are jealous knowing we found something so out of the ordinary you got",
      "me kissing the ground of your sanctuary shatter me with your touch",
      "Oh lord return me to dust the",
      "Angels up in the clouds are jealous knowing we found",
      "",
      "VERSE 2",
      "Hopeless hallelujah",
      "Oh this side of heaven?s gates",
      "On my life",
      "How do ya Breathe and Take my breath away",
      "At your alter I will pray",
      "You?re the sculptor I?m the clay",
      "Oh my my",
      "",
      "CHORUS",
      "You?re taking me out",
      "Of the ordinary I want you laying me down",
      "Til we?re dead and buried",
      "On the edge of your knife",
      "Staying drunk on your vine",
      "The Angels up in the clouds",
      "Are jealous knowing we found something so out of the ordinary you got me kissing the ground",
      "of your sanctuary shatter me with your touch",
      "Oh lord return me to dust",
      "The Angels up in the clouds",
      "Are jealous knowing we found",
      "BRIDGE",
      "Something so heavenly",
      "Higher than ecstasy whenever your next to me",
      "Oh my my world was in black and white until I saw your light)",
      "I thought you had to die to find something so out",
      "",
      "CHORUS",
      "Of the ordinary I want you laying me down",
      "Til we?re dead and buried",
      "On the edge of your knife",
      "Staying drunk on your vine",
      "The Angels up in the clouds",
      "Are jealous knowing we found something so out of the ordinary you got me kissing the ground",
      "of your sanctuary shatter me with your touch",
      "Oh lord return me to dust",
      "The Angels up in the clouds Are jealous knowing we found"
    ],
  },
  3: {
    title: "Song 5",
    lines: [
      "Verse One",
      "I know sleep is friends with death",
      "But maybe I should get some rest",
      "Cause I?ve been out here working all damn day",
      "",
      "Blueberries and butterflies",
      "The pretty things that greet my eyes",
      "When you call and I say I?m on my way.",
      "",
      "Chorus:",
      "You and me belong together",
      "Like cold iced tea and warmer weather",
      "Where we lay out late underneath the pines",
      "And we still have fun when the sun won?t shine",
      "You and me belong together",
      "All the time",
      "",
      "Verse Two:",
      "Spilling wine and homemade drinks",
      "We throw a cheers the worries sink",
      "Damnit it so good to be alive!",
      "",
      "And we know that we don't got much",
      "But then again its just enough",
      "To always find a way for a good time.",
      "",
      "Chorus:",
      "You and me belong together",
      "Like cold iced tea and warmer weather",
      "Where we lay out late underneath the pines",
      "And we still have fun when the sun wont shine",
      "You and me belong together",
      "",
      "Bridge:",
      "This love is all we need",
      "Oh we?ve got so much you and me",
      "",
      "Chorus:",
      "You and me belong together",
      "Like cold iced tea and warmer weather",
      "Where we lay out late underneath the pines",
      "And we still have fun when the sun wont shine",
      "You and me belong together",
      "All the time",
      "",
      "It goes on and on and on",
      "It goes on and on and on",
      "it goes on and on and on"
    ],
  },
  4: {
    title: "Song 6",
    lines: [
      "If you believe",
      "You can move the highest mountains",
      "Cross the greatest oceans",
      "And walk across the water, the water",
      "",
      "You feel defeated, falling on your knees, and",
      "Looking up for some hope tonight",
      "You try to stand up, but you throw your hands up",
      "Like you no longer have the strength to fight",
      "'Cause you've seen too many sunsets",
      "Too many days ending in the darkest night",
      "But, on your own, you'll never know",
      "You'll never know",
      "",
      "Chorus:",
      "",
      "If you believe",
      "You can move the highest mountains",
      "Cross the greatest oceans",
      "Walk across the water, the water",
      "Believe you can move the highest mountains",
      "Cross the greatest oceans",
      "Walk across the water",
      "If you believe",
      "",
      "They say that all you need is faith",
      "But it's almost like you lost your way",
      "Took a few wrong turns, took a few breaks",
      "Falling behind now, looking for grace",
      "'Cause you need someone to lift you up",
      "Yeah, make right all the things you've done",
      "'Cause on your own, you'll never know",
      "You'll never know",
      "",
      "Chorus:",
      "",
      "If you believe",
      "You can move the highest mountains",
      "Cross the greatest oceans",
      "Walk across the water, the water",
      "Believe you can move the highest mountains",
      "Cross the greatest oceans",
      "Walk across the water",
      "If you believe",
      "If you believe, yeah",
      "",
      "You can do anything",
      "You can do anything",
      "You can do anything",
      "If you believe",
      "",
      "Chorus",
      "",
      "If you believe",
      "You can move the highest mountains",
      "Cross the greatest oceans",
      "Walk across the water, the water",
      "Believe you can move the highest mountains",
      "Cross the greatest oceans",
      "Walk across the water",
      "If you believe"
    ],
  },

};
let currentIndex = 0;
let activeAudio = audioA;
let inactiveAudio = audioB;
let crossfadeTimer = null;
let isCrossfading = false;
let isMuted = false;
let waitingActive = false;
let waitingAutoplayAttempted = false;
let lyricsLineEls = [];
let lyricsTrackIndex = null;
let lyricsScrollMax = 0;
let lyricsDuration = fallbackLyricsDuration;

function applyAudioDefaults(audio) {
  if (!audio) return;
  audio.preload = "auto";
  audio.loop = false;
  audio.volume = baseVolume;
  audio.muted = isMuted;
}

applyAudioDefaults(audioA);
applyAudioDefaults(audioB);
applyAudioDefaults(waitingAudio);
waitingAudio.loop = true;

if (activeAudio) {
  activeAudio.src = playlist[currentIndex];
}

function nextTrackIndex(index) {
  if (playlist.length <= 1) return 0;
  if (index === playlist.length - 1) {
    return Math.min(1, playlist.length - 1);
  }
  return index + 1;
}

function updatePlayLabel() {
  if (!playToggle) return;
  const isWaitingMode = !hasUnlocked;
  const isPlaying = isWaitingMode ? !waitingAudio.paused : !activeAudio.paused;
  playToggle.textContent = isPlaying ? "Pause the song" : "Play the song";
  playToggle.setAttribute("aria-pressed", String(isPlaying));
}

function clearLyrics() {
  if (!lyricsTitleEl || !lyricsLinesEl) return;
  lyricsTitleEl.textContent = fallbackLyricsTitle;
  lyricsLinesEl.innerHTML = "";
  lyricsLineEls = [];
  lyricsTrackIndex = null;
  lyricsScrollMax = 0;
  lyricsDuration = fallbackLyricsDuration;
}

function updateLyricsScrollMetrics() {
  if (!lyricsLinesEl) return;
  lyricsLinesEl.scrollTop = 0;
  const scrollHeight = lyricsLinesEl.scrollHeight;
  const clientHeight = lyricsLinesEl.clientHeight;
  lyricsScrollMax = Math.max(0, scrollHeight - clientHeight);
  lyricsDuration = Number.isFinite(activeAudio?.duration) ? activeAudio.duration : fallbackLyricsDuration;
}

function setLyricsForTrack(index) {
  if (!lyricsTitleEl || !lyricsLinesEl) return;
  const data = lyricsByIndex[index];
  if (!data || !Array.isArray(data.lines) || data.lines.length === 0) {
    clearLyrics();
    return;
  }

  lyricsTitleEl.textContent = data.title || `Song ${index + 1}`;
  lyricsLinesEl.innerHTML = "";
  lyricsLineEls = data.lines.map((line) => {
    const el = document.createElement("div");
    el.className = "lyric-line";
    el.textContent = line;
    lyricsLinesEl.appendChild(el);
    return el;
  });

  lyricsTrackIndex = index;
  requestAnimationFrame(updateLyricsScrollMetrics);
}

function syncLyricsWithAudio() {
  if (!activeAudio || lyricsTrackIndex !== currentIndex) return;
  if (!lyricsLineEls.length || !lyricsLinesEl) return;
  const time = activeAudio.currentTime;
  const duration = Number.isFinite(lyricsDuration) && lyricsDuration > 0 ? lyricsDuration : fallbackLyricsDuration;
  const adjustedTime = Math.max(0, time - lyricsScrollDelaySeconds);
  const adjustedDuration = Math.max(1, duration - lyricsScrollDelaySeconds);
  const progress = Math.min(1, Math.max(0, adjustedTime / adjustedDuration));
  lyricsLinesEl.scrollTop = lyricsScrollMax * progress;
}

function clearCrossfadeTimer() {
  if (crossfadeTimer) {
    clearTimeout(crossfadeTimer);
    crossfadeTimer = null;
  }
}

function scheduleCrossfade() {
  if (!activeAudio || playlist.length <= 1) return;
  if (currentIndex !== 0) {
    clearCrossfadeTimer();
    return;
  }
  clearCrossfadeTimer();
  const duration = activeAudio.duration;
  let remaining = Number.isFinite(duration) ? duration - activeAudio.currentTime : Number.POSITIVE_INFINITY;

  if (currentIndex === 0) {
    const remainingToMax = songOneMaxSeconds - activeAudio.currentTime;
    if (Number.isFinite(remainingToMax)) {
      remaining = Math.min(remaining, remainingToMax);
    }
    if (!Number.isFinite(remaining) || remaining <= 0) return;
    const delay = Math.max(0, remaining * 1000);
    crossfadeTimer = setTimeout(() => startCrossfade(true), delay);
    return;
  }

  if (!Number.isFinite(remaining) || remaining <= 0) return;
  if (remaining <= crossfadeSeconds) {
    crossfadeTimer = setTimeout(() => startCrossfade(false), 0);
    return;
  }
  const delay = Math.max(0, (remaining - crossfadeSeconds) * 1000);
  crossfadeTimer = setTimeout(() => startCrossfade(false), delay);
}

function startCrossfade(forceCut = false) {
  if (isCrossfading || !activeAudio || playlist.length <= 1) return;
  const nextIndex = nextTrackIndex(currentIndex);
  if (nextIndex === currentIndex) return;

  isCrossfading = true;
  inactiveAudio.src = playlist[nextIndex];
  inactiveAudio.currentTime = 0;
  inactiveAudio.volume = 0;
  inactiveAudio.muted = isMuted;

  inactiveAudio
    .play()
    .then(() => {
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / (crossfadeSeconds * 1000), 1);
        if (!forceCut) {
          activeAudio.volume = baseVolume * (1 - progress);
        }
        inactiveAudio.volume = baseVolume * progress;

        if (progress < 1) {
          requestAnimationFrame(step);
          return;
        }

        activeAudio.pause();
        activeAudio.currentTime = 0;
        activeAudio.volume = baseVolume;

        const oldActive = activeAudio;
        activeAudio = inactiveAudio;
        inactiveAudio = oldActive;
        currentIndex = nextIndex;
        isCrossfading = false;
        scheduleCrossfade();
        updatePlayLabel();
        setLyricsForTrack(currentIndex);
      }

      if (forceCut) {
        activeAudio.volume = 0;
      }

      requestAnimationFrame(step);
    })
    .catch(() => {
      isCrossfading = false;
    });
}

function hardSwitchToNext() {
  if (!activeAudio || playlist.length <= 1) return;
  const nextIndex = nextTrackIndex(currentIndex);
  if (nextIndex === currentIndex) return;
  activeAudio.src = playlist[nextIndex];
  activeAudio.currentTime = 0;
  activeAudio.volume = baseVolume;
  activeAudio.muted = isMuted;
  activeAudio
    .play()
    .then(() => {
      currentIndex = nextIndex;
      scheduleCrossfade();
      updatePlayLabel();
      setLyricsForTrack(currentIndex);
    })
    .catch(() => {
      updatePlayLabel();
    });
}

function attachAudioHandlers(audio) {
  if (!audio) return;
  audio.addEventListener("ended", () => {
    if (audio !== activeAudio) return;
    if (!isCrossfading) {
      hardSwitchToNext();
    }
  });
  audio.addEventListener("loadedmetadata", () => {
    if (audio === activeAudio) {
      scheduleCrossfade();
      if (lyricsTrackIndex === currentIndex && lyricsLineEls.length) {
        updateLyricsScrollMetrics();
        syncLyricsWithAudio();
      }
    }
  });
  audio.addEventListener("play", () => {
    if (audio === activeAudio) {
      scheduleCrossfade();
      if (lyricsTrackIndex !== currentIndex) {
        setLyricsForTrack(currentIndex);
      }
    }
  });
  audio.addEventListener("pause", () => {
    if (audio === activeAudio) {
      clearCrossfadeTimer();
      isCrossfading = false;
    }
  });
  audio.addEventListener("timeupdate", () => {
    if (audio === activeAudio) {
      if (currentIndex === 0 && !isCrossfading && audio.currentTime >= songOneMaxSeconds) {
        startCrossfade(true);
        return;
      }
      syncLyricsWithAudio();
    }
  });
}

attachAudioHandlers(audioA);
attachAudioHandlers(audioB);

function setMuted(muted) {
  isMuted = muted;
  if (audioA) audioA.muted = muted;
  if (audioB) audioB.muted = muted;
  if (waitingAudio) waitingAudio.muted = muted;
  muteToggle?.setAttribute("aria-pressed", String(muted));
  if (muteToggle) {
    muteToggle.textContent = muted ? "Unmute" : "Mute";
  }
}

function playWaitingMusic() {
  if (!waitingAudio) return Promise.resolve(false);
  return waitingAudio
    .play()
    .then(() => {
      waitingActive = true;
      updatePlayLabel();
      return true;
    })
    .catch(() => {
      waitingActive = false;
      return false;
    });
}

function stopWaitingMusic() {
  if (!waitingAudio) return;
  waitingAudio.pause();
  waitingAudio.currentTime = 0;
  waitingActive = false;
}

function autoStartWaitingAudio() {
  if (waitingAutoplayAttempted || hasUnlocked) return;
  waitingAutoplayAttempted = true;
  setMuted(false);
  playWaitingMusic().then((played) => {
    if (!played) {
      soundPrompt?.classList.add("show");
      if (soundToggle) {
        soundToggle.textContent = "Tap to start music";
      }
    }
  });
}

function tryPlayMusic() {
  if (!activeAudio) return Promise.resolve(false);
  return activeAudio
    .play()
    .then(() => {
      updatePlayLabel();
      scheduleCrossfade();
      return true;
    })
    .catch(() => false);
}

function armMusicOnInteraction() {
  if (musicArmed) return;
  musicArmed = true;

  const handler = () => {
    setMuted(false);
    tryPlayMusic().then((played) => {
      if (played) {
        musicArmed = false;
      }
    });
  };

  window.addEventListener("pointerdown", handler, { once: true });
  window.addEventListener("keydown", handler, { once: true });
}

function startBirthdayAudio() {
  if (!activeAudio || prePlayTriggered) return;
  prePlayTriggered = true;

  stopWaitingMusic();
  if (soundToggle) {
    soundToggle.textContent = "Tap for sound";
  }
  setMuted(false);
  tryPlayMusic().then((played) => {
    if (played) {
      soundPrompt?.classList.remove("show");
      setLyricsForTrack(currentIndex);
      return;
    }

    setMuted(true);
    tryPlayMusic().then((mutedPlayed) => {
      if (mutedPlayed) {
        soundPrompt?.classList.add("show");
      } else {
        soundPrompt?.classList.add("show");
        armMusicOnInteraction();
      }
    });
  });
}

playToggle?.addEventListener("click", async () => {
  if (!activeAudio) return;
  const isWaitingMode = !hasUnlocked;

  if (isWaitingMode) {
    if (waitingAudio.paused) {
      try {
        await playWaitingMusic();
      } catch (error) {
        console.warn("Audio playback blocked.");
      }
    } else {
      waitingAudio.pause();
      updatePlayLabel();
    }
    return;
  }

  if (activeAudio.paused) {
    try {
      await tryPlayMusic();
    } catch (error) {
      console.warn("Audio playback blocked.");
    }
  } else {
    activeAudio.pause();
    inactiveAudio.pause();
    updatePlayLabel();
  }
});

muteToggle?.addEventListener("click", () => {
  setMuted(!isMuted);
  if (!isMuted) {
    soundPrompt?.classList.remove("show");
  }
});

updatePlayLabel();

updateCountdown();
setInterval(updateCountdown, 1000);

soundToggle?.addEventListener("click", () => {
  setMuted(false);
  const isWaitingMode = !hasUnlocked;
  if (isWaitingMode) {
    waitingAutoplayAttempted = true;
    playWaitingMusic();
  } else if (activeAudio && activeAudio.paused) {
    tryPlayMusic();
  }
  if (soundToggle) {
    soundToggle.textContent = "Tap for sound";
  }
  soundPrompt?.classList.remove("show");
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const galleryImages = document.querySelectorAll(".gallery-item img");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const initialVisibleCount = 30;
const bookLeftImg = document.getElementById("book-left-img");
const bookRightImg = document.getElementById("book-right-img");
const bookLeftCaption = document.getElementById("book-left-caption");
const bookRightCaption = document.getElementById("book-right-caption");
const bookPrev = document.getElementById("book-prev");
const bookNext = document.getElementById("book-next");
const bookProgress = document.getElementById("book-progress");
const bookPages = document.getElementById("memory-book-pages");
const pageTurn = document.getElementById("page-turn");
const turnFrontImg = document.getElementById("turn-front-img");
const turnBackImg = document.getElementById("turn-back-img");
const bookImages = Array.from({ length: 70 }, (_, i) => `assets/image${i + 31}.jpeg`);
const bookCaptions = Array.from({ length: 70 }, (_, i) => `Pg ${i + 31}`);
let bookIndex = 0;
let isMobileBook = false;
let bookStep = 2;
let isTurningPage = false;

function openLightbox(img) {
  if (!lightbox || !lightboxImage || !img) return;
  const caption =
    img.closest("figure")?.querySelector("figcaption")?.textContent?.trim() || img.alt || "Memory";
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt || "Memory";
  if (lightboxCaption) {
    lightboxCaption.textContent = caption;
  }
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
}

galleryImages.forEach((img) => {
  img.decoding = "async";
  img.addEventListener("click", () => openLightbox(img));
});

galleryItems.forEach((item, index) => {
  if (index >= initialVisibleCount) {
    item.classList.add("is-hidden");
  }
});

function detectBookLayout() {
  return window.matchMedia("(max-width: 900px)").matches;
}

function updateBookLayout() {
  isMobileBook = detectBookLayout();
  bookStep = isMobileBook ? 1 : 2;
  renderBook();
}

function renderBook() {
  if (!bookLeftImg || !bookRightImg) return;
  const leftIndex = bookIndex;
  const rightIndex = bookIndex + 1;
  const total = bookImages.length;

  if (leftIndex < total) {
    bookLeftImg.src = bookImages[leftIndex];
    bookLeftImg.alt = bookCaptions[leftIndex];
    if (bookLeftCaption) {
      bookLeftCaption.textContent = bookCaptions[leftIndex];
    }
  }

  if (!isMobileBook && rightIndex < total) {
    bookRightImg.src = bookImages[rightIndex];
    bookRightImg.alt = bookCaptions[rightIndex];
    if (bookRightCaption) {
      bookRightCaption.textContent = bookCaptions[rightIndex];
    }
    bookRightImg.style.visibility = "visible";
  } else {
    bookRightImg.removeAttribute("src");
    if (bookRightCaption) {
      bookRightCaption.textContent = "";
    }
    bookRightImg.style.visibility = "hidden";
  }

  if (bookProgress) {
    const displayRight = !isMobileBook && rightIndex < total ? rightIndex + 1 : leftIndex + 1;
    bookProgress.textContent = `Page ${leftIndex + 1}${displayRight !== leftIndex + 1 ? `?${displayRight}` : ""} of ${total}`;
  }

  if (bookPrev) {
    bookPrev.disabled = leftIndex <= 0;
  }
  if (bookNext) {
    const maxIndex = Math.max(0, total - bookStep);
    bookNext.disabled = leftIndex >= maxIndex;
  }
}

function triggerBookFlip(direction) {
  if (!bookPages || !pageTurn || isTurningPage) return;
  isTurningPage = true;
  bookPages.classList.remove("is-turning-forward", "is-turning-back");
  if (direction === "back") {
    bookPages.classList.add("is-turning-back");
  } else {
    bookPages.classList.add("is-turning-forward");
  }
  setTimeout(() => {
    bookPages.classList.remove("is-turning-forward", "is-turning-back");
    isTurningPage = false;
  }, 1200);
}

bookPrev?.addEventListener("click", () => {
  const nextIndex = Math.max(0, bookIndex - bookStep);
  if (nextIndex === bookIndex) return;
  if (!isMobileBook && turnFrontImg && turnBackImg) {
    turnFrontImg.src = bookImages[bookIndex + 1] || "";
    turnBackImg.src = bookImages[nextIndex + 1] || "";
  }
  bookIndex = nextIndex;
  renderBook();
  triggerBookFlip("back");
});

bookNext?.addEventListener("click", () => {
  const maxIndex = Math.max(0, bookImages.length - bookStep);
  const nextIndex = Math.min(maxIndex, bookIndex + bookStep);
  if (nextIndex === bookIndex) return;
  if (!isMobileBook && turnFrontImg && turnBackImg) {
    turnFrontImg.src = bookImages[bookIndex + 1] || "";
    turnBackImg.src = bookImages[nextIndex + 1] || "";
  }
  bookIndex = nextIndex;
  renderBook();
  triggerBookFlip("forward");
});

bookLeftImg?.addEventListener("click", () => openLightbox(bookLeftImg));
bookRightImg?.addEventListener("click", () => openLightbox(bookRightImg));

updateBookLayout();
window.addEventListener("resize", () => {
  updateBookLayout();
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

const memorySection = document.getElementById("memories");
const hiddenMemory = document.getElementById("hidden-memory");

memorySection?.addEventListener("dblclick", () => {
  if (!hiddenMemory) return;
  hiddenMemory.classList.remove("hidden");
  hiddenMemory.scrollIntoView({ behavior: "smooth", block: "center" });
});

const mapPins = document.querySelectorAll(".map-pin");
const mapTitle = document.querySelector("#map-caption .map-title");
const mapNote = document.querySelector("#map-caption .map-note");

function updateMapCaption(pin) {
  if (!mapTitle || !mapNote || !pin) return;
  const title = pin.getAttribute("data-title") || "A favorite place";
  const note = pin.getAttribute("data-note") || "Add your memory here.";
  mapTitle.textContent = title;
  mapNote.textContent = note;
}

mapPins.forEach((pin, index) => {
  if (index === 0) {
    updateMapCaption(pin);
  }

  pin.addEventListener("click", () => {
    mapPins.forEach((item) => item.classList.remove("active"));
    pin.classList.add("active");
    updateMapCaption(pin);
  });
});

const hiddenStar = document.getElementById("hidden-star");
const secretNote = document.getElementById("secret-note");
const closeSecret = document.getElementById("close-secret");

function openSecret() {
  secretNote?.classList.add("show");
  secretNote?.setAttribute("aria-hidden", "false");
}

function closeSecretNote() {
  secretNote?.classList.remove("show");
  secretNote?.setAttribute("aria-hidden", "true");
}

hiddenStar?.addEventListener("click", openSecret);
closeSecret?.addEventListener("click", closeSecretNote);
secretNote?.addEventListener("click", (event) => {
  if (event.target === secretNote) {
    closeSecretNote();
  }
});

const letterLines = document.querySelectorAll("#letter p");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        letterLines.forEach((line, index) => {
          setTimeout(() => line.classList.add("visible"), index * 260);
        });
      }
    });
  },
  { threshold: 0.4 }
);

const letter = document.getElementById("letter");
if (letter) {
  observer.observe(letter);
}

const konami = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let konamiIndex = 0;

window.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key === konami[konamiIndex]) {
    konamiIndex += 1;
    if (konamiIndex === konami.length) {
      openSecret();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function sprinkleConfetti() {
  const confettiCount = 35;
  for (let i = 0; i < confettiCount; i += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.left = `${10 + Math.random() * 80}%`;
    confetti.style.background = Math.random() > 0.5 ? "#ffb34d" : "#ff6f91";
    confetti.style.animationDelay = `${Math.random()}s`;
    document.body.appendChild(confetti);

    confetti.addEventListener("animationend", () => {
      confetti.remove();
    });
  }
}

const confettiStyle = document.createElement("style");
confettiStyle.textContent = `
.confetti {
  position: fixed;
  top: -10px;
  width: 10px;
  height: 16px;
  border-radius: 4px;
  opacity: 0.9;
  animation: fall 2.6s ease-in forwards;
  z-index: 15;
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(110vh) rotate(220deg);
  }
}
`;

document.head.appendChild(confettiStyle);

