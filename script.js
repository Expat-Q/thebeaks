/* ═══════════════════════════════════════════════════════
   BEAKS NFT PUZZLE — JavaScript
   Author: ExpatQ3
═══════════════════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────────────────
//  State
// ──────────────────────────────────────────────────────
let selectedImg     = null;
let selectedArtist  = '';
let tiles           = [];
let emptyTileIndex  = 15;
let timerInterval   = null;
let secondsLeft     = 180;
let gameStarted     = false;
let aiRunning       = false;
let showNumbers     = false;

// ──────────────────────────────────────────────────────
//  Gallery Data  (AI-generated files excluded)
// ──────────────────────────────────────────────────────
const GALLERY = [
    { name: 'Dima Kashtalyan',    file: 'assets/1st collection.jpg' },
    { name: 'Dima Kashtalyan',    file: 'assets/2nd collection.jpg' },
    { name: 'Dima Kashtalyan',    file: 'assets/3rd collection.jpg' },
    { name: '@0x_Castar',         file: 'assets/@0x_Castar.jpeg'    },
    { name: '@AVolcans',          file: 'assets/@AVolcans.jpg'       },
    { name: '@Calopo_',           file: 'assets/@Calopo_.jpeg'       },
    { name: '@MynddNFT',          file: 'assets/@MynddNFT.png'       },
    { name: '@Natt_369_',         file: 'assets/@Natt_369_.gif'      },
    { name: '@Pauline_Fathima',   file: 'assets/@Pauline_Fathima.jpg'},
    { name: '@T0kenPrince',       file: 'assets/@T0kenPrince.jpeg'   },
    { name: '@Uchenna603',        file: 'assets/@Uchenna603.jpeg'    },
    { name: '@Yizzz_web3',        file: 'assets/@Yizzz_web3.jpg'     },
    { name: '@batt004',           file: 'assets/@batt004.jpg'        },
    { name: '@bitartixt',         file: 'assets/@bitartixt.jpeg'     },
    { name: '@ccshark64',         file: 'assets/@ccshark64.webp'     },
    { name: '@dejiiszn',          file: 'assets/@dejiiszn.png'       },
    { name: '@dhirajleg',         file: 'assets/@dhirajleg.jpg'      },
    { name: '@lucas950825',       file: 'assets/@lucas950825.jpg'    },
    { name: '@mr_wayne_2',        file: 'assets/@mr_wayne_2.jpeg'    },
    { name: '@valkiz_jr',         file: 'assets/@valkiz_jr.jpg'      },
    { name: '@verah_tee',         file: 'assets/@verah_tee.jpg'      },
    { name: 'ANYA MISAAKI',       file: 'assets/ANYA MISAAKI.jpg'    },
    { name: 'AURORA',             file: 'assets/AURORA.jpg'          },
    { name: 'Ashley',             file: 'assets/Ashley.jpg'          },
    { name: 'CITYBOY',            file: 'assets/CITYBOY.jpg'         },
    { name: 'DR TIM',             file: 'assets/DR TIM.jpg'          },
    { name: 'IAMJAY',             file: 'assets/IAMJAY.jpg'          },
    { name: 'IEATDED',            file: 'assets/IEATDED.jpg'         },
    { name: 'JUST-ROB',           file: 'assets/JUST-ROB.jpg'        },
    { name: 'Rafiki web3',        file: 'assets/Rafiki web3.jpg'     },
    { name: 'VICTORX',            file: 'assets/VICTORX.jpg'         },
    { name: 'collcool_sneh',      file: 'assets/collcool_sneh.jpg'   },
    { name: 'dark_jesus',         file: 'assets/dark_jesus.jpg'      },
    { name: 'erfan5427',          file: 'assets/erfan5427.jpeg'      },
    { name: 'miss ayo',           file: 'assets/miss ayo.jpg'        },
    { name: 'prateek',            file: 'assets/prateek.jpg'         },
    { name: 'sharu DS',           file: 'assets/sharu DS.jpg'        },
    { name: 'yo',                 file: 'assets/yo.jpg'              },
];

// ──────────────────────────────────────────────────────
//  DOM Refs
// ──────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const SCREENS = {
    flip:       $('book-flip-screen'),
    video:      $('video-screen'),
    intro:      $('intro-screen'),
    setup:      $('setup-screen'),
    game:       $('game-screen'),
    completion: $('message'),
};

const dom = {
    board:              $('puzzle-board'),
    targetPreview:      $('target-preview'),
    timerDisplay:       $('timer'),
    galleryGrid:        $('gallery-container'),
    previewImg:         $('setup-preview-img'),
    previewPlaceholder: $('preview-placeholder'),
    artistDisplay:      $('artist-display'),
    artistNameVal:      $('artist-name-val'),
    gameArtistName:     $('game-artist-name'),
    selectionStatus:    $('selection-status'),
    launchBtn:          $('launch-game-btn'),
    statusTitle:        $('status-title'),
    statusText:         $('status-text'),
    overlayIcon:        $('overlay-icon'),
    introVideo:         $('intro-video'),
    toggleNumBtn:       $('toggle-numbers-btn'),
};

// ──────────────────────────────────────────────────────
//  Audio — Web Audio API flip sound
// ──────────────────────────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
}

function playFlipSound() {
    initAudio();
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.12, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
        // White noise with fast decay — sounds like a page flip
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;
    src.connect(filter);
    filter.connect(audioCtx.destination);
    src.start();
}

// ──────────────────────────────────────────────────────
//  Screen Manager
// ──────────────────────────────────────────────────────
function showScreen(key) {
    Object.values(SCREENS).forEach(s => s.classList.add('hidden'));
    SCREENS[key].classList.remove('hidden');
    // scroll to top for scrollable screens
    SCREENS[key].scrollTop = 0;
}

// ──────────────────────────────────────────────────────
//  Phase 0: Book Flip
// ──────────────────────────────────────────────────────
const FLIP_PAGES = document.querySelectorAll('.flip-page');

function startBookFlip() {
    let idx = 0;
    // flip each page at 550ms — slightly slower as requested
    const interval = setInterval(() => {
        if (idx < FLIP_PAGES.length) {
            // Sound removed per user request
            FLIP_PAGES[idx].classList.add('flipped');
            idx++;
        } else {
            clearInterval(interval);
            setTimeout(goToVideo, 800);
        }
    }, 550);
}

// Tap-to-start: wait for user gesture before playing audio & starting flip
const tapStart = $('tap-start');
if (tapStart) {
    tapStart.addEventListener('click', () => {
        initAudio();
        tapStart.style.opacity = '0';
        tapStart.style.pointerEvents = 'none';
        setTimeout(() => { tapStart.remove(); }, 400);
        startBookFlip();
    }, { once: true });
}

$('skip-flip-btn').onclick = () => {
    if (tapStart && tapStart.parentNode) tapStart.remove();
    goToVideo();
};

// ──────────────────────────────────────────────────────
//  Phase 1: Video
// ──────────────────────────────────────────────────────
function goToVideo() {
    showScreen('video');
    dom.introVideo.muted = false;     // sound ON
    dom.introVideo.play().catch(() => {
        // autoplay blocked — just skip
        showScreen('intro');
    });
}

dom.introVideo.addEventListener('ended', () => showScreen('intro'));
$('skip-video-btn').onclick = () => { dom.introVideo.pause(); showScreen('intro'); };

// Ensure video plays with sound after user has interacted
dom.introVideo.muted = false;

// ──────────────────────────────────────────────────────
//  Phase 2: Landing
// ──────────────────────────────────────────────────────
$('start-btn').onclick = () => showScreen('setup');

// ──────────────────────────────────────────────────────
//  Phase 3: Gallery
// ──────────────────────────────────────────────────────
function isMobile() {
    return window.innerWidth <= 768;
}

function buildGallery() {
    dom.galleryGrid.innerHTML = '';
    GALLERY.forEach(art => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = art.file;
        img.alt = art.name;
        img.className = 'gallery-item-img';

        const label = document.createElement('div');
        label.className = 'gallery-item-name';
        label.textContent = art.name;

        item.appendChild(img);
        item.appendChild(label);
        item.addEventListener('click', () => selectArt(art.file, art.name, item));
        dom.galleryGrid.appendChild(item);
    });
}

function selectArt(file, name, el) {
    document.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('selected'));
    if (el) el.classList.add('selected');

    selectedImg    = file;
    selectedArtist = name;

    dom.previewImg.src = file;
    dom.previewImg.classList.remove('hidden');
    dom.previewPlaceholder.style.display = 'none';
    dom.artistNameVal.textContent = name;
    dom.artistDisplay.classList.remove('hidden');
    dom.selectionStatus.textContent = 'Art staged for authentication ✓';

    dom.targetPreview.src    = file;
    dom.gameArtistName.textContent = name;
    dom.launchBtn.disabled   = false;

    // On mobile, show the sidebar as a full-screen preview page
    if (isMobile()) {
        const sidebar = document.querySelector('.panel-sidebar');
        sidebar.classList.add('mobile-active');
    }
}

// Image upload
$('image-upload').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => selectArt(ev.target.result, 'Guest: ' + file.name.replace(/\.[^.]+$/, ''));
    reader.readAsDataURL(file);
});

dom.launchBtn.onclick = () => {
    if (!selectedImg) return;
    showScreen('game');
    initPuzzle(selectedImg);
    shuffleBoard();
    startTimer();
};

$('replay-btn').onclick = () => showScreen('setup');

// ──────────────────────────────────────────────────────
//  Phase 4: Puzzle Engine
// ──────────────────────────────────────────────────────
function getTileSize() {
    // Dynamically compute tile size based on available width
    const gameInner = document.querySelector('.game-inner');
    if (gameInner) {
        // For desktop, puzzle-area is inside game-body which shares space with target
        const puzzleWrap = document.querySelector('.puzzle-wrap');
        const containerWidth = puzzleWrap ? puzzleWrap.clientWidth : gameInner.clientWidth;
        const availWidth = containerWidth - 16 - 12; // padding + gaps
        const computed = Math.floor(availWidth / 4);
        if (computed > 20) return computed;
    }
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tile')) || 90;
}

function initPuzzle(src) {
    dom.board.innerHTML = '';
    tiles = [];

    for (let i = 0; i < 16; i++) {
        const el = document.createElement('div');
        el.classList.add('tile');
        const col = i % 4, row = Math.floor(i / 4);

        if (i === 15) {
            el.classList.add('empty-slot');
            emptyTileIndex = 15;
        } else {
            el.style.backgroundImage    = `url("${src}")`;
            el.style.backgroundSize     = `400% 400%`;
            el.style.backgroundPosition = `${(col / 3) * 100}% ${(row / 3) * 100}%`;

            // Number overlay
            const num = document.createElement('span');
            num.className = 'tile-number';
            num.textContent = i + 1;
            num.style.opacity = showNumbers ? '1' : '0';
            el.appendChild(num);
        }

        const tileObj = { el, originalIndex: i, currentIndex: i };
        el.addEventListener('click', () => handleClick(tileObj));
        tiles.push(tileObj);
        dom.board.appendChild(el);
    }
    gameStarted = true;
}

function handleClick(t) {
    if (aiRunning || !gameStarted) return;
    if (t.originalIndex === 15) return;
    if (isAdj(t.currentIndex, emptyTileIndex)) {
        swap(t);
        checkWin();
    }
}

function isAdj(a, b) {
    return Math.abs(Math.floor(a/4) - Math.floor(b/4)) + Math.abs(a%4 - b%4) === 1;
}

function swap(t) {
    const empty = tiles.find(x => x.originalIndex === 15);
    const prev  = t.currentIndex;
    t.currentIndex    = emptyTileIndex;
    empty.currentIndex = prev;
    emptyTileIndex    = prev;
    renderBoard();
}

function renderBoard() {
    const sorted = [...tiles].sort((a,b) => a.currentIndex - b.currentIndex);
    dom.board.innerHTML = '';
    sorted.forEach(t => dom.board.appendChild(t.el));
}

function getNeighbors(idx) {
    const r = Math.floor(idx/4), c = idx%4, n = [];
    if (r > 0) n.push(idx-4);
    if (r < 3) n.push(idx+4);
    if (c > 0) n.push(idx-1);
    if (c < 3) n.push(idx+1);
    return n;
}

function shuffleBoard() {
    tiles.forEach((t,i) => t.currentIndex = i);
    emptyTileIndex = 15;
    for (let i = 0; i < 240; i++) {
        const nbrs = getNeighbors(emptyTileIndex);
        const pick = nbrs[Math.floor(Math.random() * nbrs.length)];
        const t    = tiles.find(x => x.currentIndex === pick);
        const emp  = tiles.find(x => x.originalIndex === 15);
        const tmp  = t.currentIndex;
        t.currentIndex   = emptyTileIndex;
        emp.currentIndex = tmp;
        emptyTileIndex   = tmp;
    }
    renderBoard();
}

function checkWin() {
    if (gameStarted && tiles.every(t => t.originalIndex === t.currentIndex)) endGame(true);
}

// ──────────────────────────────────────────────────────
//  Timer
// ──────────────────────────────────────────────────────
function startTimer() {
    clearInterval(timerInterval);
    secondsLeft = 180;
    tick();
    timerInterval = setInterval(tick, 1000);
}

function tick() {
    const m = Math.floor(secondsLeft/60).toString().padStart(2,'0');
    const s = (secondsLeft % 60).toString().padStart(2,'0');
    dom.timerDisplay.textContent = `${m}:${s}`;
    dom.timerDisplay.classList.toggle('danger', secondsLeft <= 30);
    if (secondsLeft-- <= 0) { clearInterval(timerInterval); endGame(false); }
}

// ──────────────────────────────────────────────────────
//  Game End
// ──────────────────────────────────────────────────────
function endGame(win) {
    gameStarted = false;
    clearInterval(timerInterval);
    showScreen('completion');

    // Show the art they played with in the overlay
    const overlayArt = document.getElementById('overlay-art-img');
    if (overlayArt && selectedImg) overlayArt.src = selectedImg;

    if (win) {
        const elapsed = 180 - secondsLeft;
        const m = Math.floor(elapsed/60).toString().padStart(2,'0');
        const s = (elapsed % 60).toString().padStart(2,'0');
        dom.overlayIcon.className = 'overlay-icon';
        dom.overlayIcon.textContent = '✓';
        dom.statusTitle.textContent = 'AUTHENTICATED';
        dom.statusText.textContent  = `${selectedArtist}'s masterpiece restored in ${m}:${s}.`;
    } else {
        dom.overlayIcon.className = 'overlay-icon fail';
        dom.overlayIcon.textContent = '✕';
        dom.statusTitle.textContent = 'TIME EXPIRED';
        dom.statusText.textContent  = 'The authentication window closed. Try again.';
    }
}

// ──────────────────────────────────────────────────────
//  Share to X (with art image)
// ──────────────────────────────────────────────────────
function generateShareCard() {
    return new Promise((resolve) => {
        const canvas = document.getElementById('share-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 800;

        // Background
        ctx.fillStyle = '#07070a';
        ctx.fillRect(0, 0, 800, 800);

        // Gold border
        ctx.strokeStyle = '#e8c16a';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 760, 760);

        // Load art image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            // Draw art centered
            const artSize = 400;
            const artX = (800 - artSize) / 2;
            const artY = 140;

            // Art border glow
            ctx.shadowColor = '#e8c16a';
            ctx.shadowBlur = 30;
            ctx.fillStyle = '#111';
            ctx.fillRect(artX - 4, artY - 4, artSize + 8, artSize + 8);
            ctx.shadowBlur = 0;

            ctx.drawImage(img, artX, artY, artSize, artSize);

            // Gold border around art
            ctx.strokeStyle = '#e8c16a';
            ctx.lineWidth = 3;
            ctx.strokeRect(artX - 2, artY - 2, artSize + 4, artSize + 4);

            // Title
            ctx.fillStyle = '#e8c16a';
            ctx.font = 'bold 36px "Playfair Display", serif';
            ctx.textAlign = 'center';
            ctx.fillText('THE BEAKS', 400, 80);

            // Subtitle
            ctx.fillStyle = '#888';
            ctx.font = '18px "Inter", sans-serif';
            ctx.fillText('NFT Art Puzzle', 400, 115);

            // Artist
            ctx.fillStyle = '#f2f2f5';
            ctx.font = 'bold 24px "Inter", sans-serif';
            ctx.fillText(`🎨 ${selectedArtist}`, 400, 600);

            // Time
            const elapsed = 180 - secondsLeft;
            const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const s = (elapsed % 60).toString().padStart(2, '0');
            ctx.fillStyle = '#e8c16a';
            ctx.font = 'bold 28px "Courier New", monospace';
            ctx.fillText(`⏱ ${m}:${s}`, 400, 650);

            // Status
            ctx.fillStyle = '#e8c16a';
            ctx.font = 'bold 20px "Inter", sans-serif';
            ctx.fillText('✓ AUTHENTICATED', 400, 710);

            // Footer
            ctx.fillStyle = '#555';
            ctx.font = '14px "Inter", sans-serif';
            ctx.fillText('Created by ExpatQ3', 400, 760);

            canvas.toBlob((blob) => resolve(blob), 'image/png');
        };
        img.onerror = () => {
            // Fallback: just text card without image
            ctx.fillStyle = '#e8c16a';
            ctx.font = 'bold 36px serif';
            ctx.textAlign = 'center';
            ctx.fillText('THE BEAKS', 400, 300);
            ctx.fillStyle = '#f2f2f5';
            ctx.font = '24px sans-serif';
            ctx.fillText(`🎨 ${selectedArtist}`, 400, 400);
            ctx.fillText('✓ AUTHENTICATED', 400, 460);
            canvas.toBlob((blob) => resolve(blob), 'image/png');
        };
        img.src = selectedImg;
    });
}

$('share-x-btn').onclick = async () => {
    const elapsed = 180 - secondsLeft;
    const m = Math.floor(elapsed/60).toString().padStart(2,'0');
    const s = (elapsed % 60).toString().padStart(2,'0');
    const tweetText = `I just authenticated ${selectedArtist}'s Beaks NFT artwork in ${m}:${s}! 🎨\n\nPlay here: https://thebeaks-puzzle.vercel.app/\n\n@DKashtalyan @thebeaksart @ssheyii @MartKAD\n\n#TheBeaks #NFT #PuzzleChallenge`;

    let imageCopied = false;
    try {
        const blob = await generateShareCard();
        if (blob && navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            imageCopied = true;
            showToast("🎨 Branded share card copied! Just paste (Ctrl+V) on X to attach.");
        }
    } catch (e) {
        console.warn("Could not copy image to clipboard: ", e);
    }

    // Redirect to X
    setTimeout(() => {
        const text = encodeURIComponent(tweetText);
        window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
    }, imageCopied ? 1800 : 0);
};

function showToast(msg) {
    let toast = document.getElementById('custom-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        toast.style.background = 'rgba(232, 193, 106, 0.95)';
        toast.style.color = '#0b0c10';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '30px';
        toast.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        toast.style.fontSize = '0.9rem';
        toast.style.fontWeight = 'bold';
        toast.style.boxShadow = '0 10px 30px rgba(232, 193, 106, 0.4)';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toast.style.pointerEvents = 'none';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    // Trigger transition reflow
    toast.offsetHeight; 
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 3200);
}


// ──────────────────────────────────────────────────────
//  Controls
// ──────────────────────────────────────────────────────
$('shuffle-btn').onclick = () => { shuffleBoard(); startTimer(); };

// Number toggle
dom.toggleNumBtn.addEventListener('click', () => {
    showNumbers = !showNumbers;
    dom.toggleNumBtn.textContent = showNumbers ? 'HIDE NUMBERS' : 'SHOW NUMBERS';
    dom.toggleNumBtn.classList.toggle('active', showNumbers);
    document.querySelectorAll('.tile-number').forEach(n => {
        n.style.opacity = showNumbers ? '1' : '0';
    });
});

// AI Assist (teleport solve — visually animated)
$('ai-bot-btn').addEventListener('click', async () => {
    if (aiRunning) return;
    aiRunning = true;
    $('ai-bot-btn').textContent = 'SOLVING…';
    $('ai-bot-btn').disabled = true;

    for (let target = 0; target < 16; target++) {
        const correct = tiles.find(t => t.originalIndex === target);
        if (correct.currentIndex !== target) {
            const occupant = tiles.find(t => t.currentIndex === target);
            const oldPos   = correct.currentIndex;
            correct.currentIndex  = target;
            occupant.currentIndex = oldPos;
            if (correct.originalIndex  === 15) emptyTileIndex = correct.currentIndex;
            if (occupant.originalIndex === 15) emptyTileIndex = occupant.currentIndex;
            renderBoard();
            await new Promise(r => setTimeout(r, 55));
        }
    }

    $('ai-bot-btn').textContent = 'AI ASSIST';
    $('ai-bot-btn').disabled = false;
    aiRunning = false;
    checkWin();
});

// ──────────────────────────────────────────────────────
//  Mobile: Back to Gallery button
// ──────────────────────────────────────────────────────
$('back-to-gallery-btn').addEventListener('click', () => {
    const sidebar = document.querySelector('.panel-sidebar');
    sidebar.classList.remove('mobile-active');
});

// Recalc tile sizes on resize
window.addEventListener('resize', () => {
    if (gameStarted && selectedImg) {
        initPuzzle(selectedImg);
    }
});

// ──────────────────────────────────────────────────────
//  Hero Carousel — cycles through 3 collection images
// ──────────────────────────────────────────────────────
function startHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;
    let current = 0;
    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 3000);
}

// ──────────────────────────────────────────────────────
//  Boot — gallery ready, show flip screen, wait for tap
// ──────────────────────────────────────────────────────
buildGallery();
showScreen('flip');
startHeroCarousel();
// startBookFlip() is triggered by the tapStart click listener above
