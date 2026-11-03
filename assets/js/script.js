document.addEventListener('DOMContentLoaded', () => {
    // --- Audio Player Setup ---
    const playlist = [
        {
            title: "Shape of My Heart",
            artist: "Backstreet Boys",
            src: "assets/audio/shape_of_my_heart.mp3"
        },
        {
            title: "My Love",
            artist: "Westlife",
            src: "assets/audio/my_love.mp3"
        },
        {
            title: "Angel Baby",
            artist: "Troye Sivan",
            src: "assets/audio/angel_baby.mp3"
        }
    ];

    let currentTrackIndex = 0;
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = playlist[currentTrackIndex].src;
    let isPlaying = false;

    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressBarBg = document.getElementById('progress-bar-bg');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const albumVinyl = document.getElementById('album-vinyl');
    const floatingPill = document.getElementById('audio-floating-pill');
    const floatingDisk = document.getElementById('floating-disk');
    const floatingLabel = document.getElementById('floating-label');
    const trackItems = document.querySelectorAll('.track-item');

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function loadTrack(index) {
        currentTrackIndex = index;
        audio.src = playlist[index].src;
        trackTitle.textContent = playlist[index].title;
        trackArtist.textContent = playlist[index].artist;
        floatingLabel.textContent = playlist[index].title;

        trackItems.forEach((item, idx) => {
            if (idx === index) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.log("Audio play blocked:", e));
        }
    }

    audio.addEventListener('play', () => {
        isPlaying = true;
        playBtn.innerHTML = '⏸';
        albumVinyl.classList.add('playing');
        floatingDisk.classList.add('spinning');
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
        playBtn.innerHTML = '▶';
        albumVinyl.classList.remove('playing');
        floatingDisk.classList.remove('spinning');
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            progressBarFill.style.width = pct + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
            durationEl.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener('ended', () => {
        nextTrack();
    });

    progressBarBg.addEventListener('click', (e) => {
        const rect = progressBarBg.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (audio.duration) {
            audio.currentTime = pos * audio.duration;
        }
    });

    function nextTrack() {
        const nextIdx = (currentTrackIndex + 1) % playlist.length;
        loadTrack(nextIdx);
        audio.play().catch(() => {});
    }

    function prevTrack() {
        const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(prevIdx);
        audio.play().catch(() => {});
    }

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    floatingPill.addEventListener('click', togglePlay);

    trackItems.forEach((item) => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.getAttribute('data-index'));
            loadTrack(idx);
            audio.play().catch(() => {});
        });
    });

    // --- Screen Navigation ---
    const loadingScreen = document.getElementById('loading-screen');
    const passcodeScreen = document.getElementById('passcode-screen');
    const giftScreen = document.getElementById('gift-screen');
    const mainScreen = document.getElementById('main-screen');

    // Hide Loading screen after 1.6s
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            passcodeScreen.classList.add('active');
        }, 800);
    }, 1600);

    // --- Passcode Logic ---
    const SECRET_PIN = "041103";
    let enteredPin = "";
    const dots = document.querySelectorAll('.pin-dots .dot');
    const keys = document.querySelectorAll('.key-btn');
    const pinContainer = document.querySelector('.pin-dots');
    const passcodeError = document.getElementById('passcode-error');

    function updateDots() {
        dots.forEach((dot, idx) => {
            if (idx < enteredPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    function handlePinInput(val) {
        passcodeError.style.opacity = '0';
        if (val === 'backspace') {
            enteredPin = enteredPin.slice(0, -1);
            updateDots();
            return;
        }
        if (val === 'clear') {
            enteredPin = "";
            updateDots();
            return;
        }

        if (enteredPin.length < 6) {
            enteredPin += val;
            updateDots();

            if (enteredPin.length === 6) {
                if (enteredPin === SECRET_PIN) {
                    // Correct PIN!
                    setTimeout(() => {
                        passcodeScreen.classList.remove('active');
                        setTimeout(() => {
                            giftScreen.classList.add('active');
                        }, 300);
                    }, 400);
                } else {
                    // Wrong PIN!
                    setTimeout(() => {
                        pinContainer.classList.add('shake');
                        passcodeError.textContent = "Kode salah, coba lagi yaa sayang 💗";
                        passcodeError.style.opacity = '1';
                        setTimeout(() => {
                            pinContainer.classList.remove('shake');
                            enteredPin = "";
                            updateDots();
                        }, 500);
                    }, 300);
                }
            }
        }
    }

    keys.forEach(key => {
        key.addEventListener('click', () => {
            const val = key.getAttribute('data-key');
            handlePinInput(val);
        });
    });

    // Keyboard support for desktop testing
    window.addEventListener('keydown', (e) => {
        if (!passcodeScreen.classList.contains('active')) return;
        if (e.key >= '0' && e.key <= '9') {
            handlePinInput(e.key);
        } else if (e.key === 'Backspace') {
            handlePinInput('backspace');
        }
    });

    // --- Gift Box Logic ---
    const giftBoxContainer = document.getElementById('gift-box-container');
    const giftModal = document.getElementById('gift-modal');
    const openCelebrationBtn = document.getElementById('open-celebration-btn');

    let giftOpened = false;
    giftBoxContainer.addEventListener('click', () => {
        if (giftOpened) return;
        giftOpened = true;
        giftBoxContainer.classList.add('gift-opened');

        // Confetti burst
        fireConfetti();

        // Show Modal
        setTimeout(() => {
            giftModal.classList.add('active');
        }, 700);
    });

    openCelebrationBtn.addEventListener('click', () => {
        giftModal.classList.remove('active');
        giftScreen.classList.remove('active');
        mainScreen.classList.add('active');
        floatingPill.style.display = 'flex';

        // Start background music automatically upon opening gift
        audio.play().catch(e => console.log("Audio play gesture error:", e));

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Simple confetti generator
    function fireConfetti() {
        const colors = ['#f472b6', '#ec4899', '#fda4af', '#fff', '#fbbf24', '#c084fc'];
        for (let i = 0; i < 70; i++) {
            const conf = document.createElement('div');
            conf.style.position = 'fixed';
            conf.style.zIndex = '999';
            conf.style.width = Math.random() * 8 + 6 + 'px';
            conf.style.height = Math.random() * 8 + 6 + 'px';
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            conf.style.top = '50%';
            conf.style.left = '50%';
            conf.style.pointerEvents = 'none';

            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 220 + 80;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance - 60;

            conf.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
            document.body.appendChild(conf);

            requestAnimationFrame(() => {
                conf.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 720}deg) scale(0)`;
                conf.style.opacity = '0';
            });

            setTimeout(() => conf.remove(), 1100);
        }
    }

    // --- Digital Bouquet Messages ---
    const flowerItems = document.querySelectorAll('.flower-item');
    const bouquetMsgText = document.getElementById('bouquet-msg-text');

    flowerItems.forEach(item => {
        item.addEventListener('click', () => {
            flowerItems.forEach(f => f.classList.remove('selected'));
            item.classList.add('selected');
            const msg = item.getAttribute('data-message');

            bouquetMsgText.style.opacity = '0';
            bouquetMsgText.style.transform = 'translateY(6px)';
            setTimeout(() => {
                bouquetMsgText.textContent = `"${msg}"`;
                bouquetMsgText.style.opacity = '1';
                bouquetMsgText.style.transform = 'translateY(0)';
            }, 200);
        });
    });

    // --- Jar of Notes Logic ---
    const jarReasons = [
        "Kamu adalah wanita pertama yang bisa bikin ak berfikir 'Oh ini rasanya dicintai dengan tulus' 🤍",
        "Senyum kamu bikin aku mendadak gila, krna gatahan wehh manis buanget pollll 🫠✨",
        "Kmu kadang menjengkelkan, tapi aku cinta itu (tapi jan sering sering yaa, bocilll wkwkw) 😜",
        "Bareng kamu aku belajar banyakkk banget tentang apapun 📖🤍",
        "Dengan kamu aku merasa hidup aku lebih bermakna dan ada tujuan (nikahin kamuuu hwhwhw) 💍👰🏻‍♀️"
    ];

    let lastReasonIndex = -1;
    const jarWrap = document.getElementById('jar-graphic-wrap');
    const shakeJarBtn = document.getElementById('shake-jar-btn');
    const noteRevealText = document.getElementById('note-reveal-text');

    function shakeJar() {
        jarWrap.classList.add('shaking');
        noteRevealText.style.opacity = '0';
        noteRevealText.style.transform = 'scale(0.95)';

        let newIdx;
        do {
            newIdx = Math.floor(Math.random() * jarReasons.length);
        } while (newIdx === lastReasonIndex && jarReasons.length > 1);
        lastReasonIndex = newIdx;

        setTimeout(() => {
            jarWrap.classList.remove('shaking');
            noteRevealText.textContent = jarReasons[newIdx];
            noteRevealText.style.opacity = '1';
            noteRevealText.style.transform = 'scale(1)';
        }, 600);
    }

    shakeJarBtn.addEventListener('click', shakeJar);
    jarWrap.addEventListener('click', shakeJar);

    // --- Lightbox Modal for Photos ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const polaroidCards = document.querySelectorAll('.polaroid-card');

    polaroidCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            lightboxImg.src = img.src;
            lightboxModal.classList.add('active');
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.remove('active');
        }
    });
});
