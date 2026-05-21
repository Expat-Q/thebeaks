/* ═══════════════════════════════════════════════════════
   BEAKS NFT PUZZLE — JavaScript
   Author: ExpatQ3
═══════════════════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────────────────
//  Auth State
// ──────────────────────────────────────────────────────
let playerHandle = ''; // Manually entered X handle

// ──────────────────────────────────────────────────────
//  State
// ──────────────────────────────────────────────────────
let selectedImg     = null;
let selectedArtist  = '';
let tiles           = [];
let gridSize        = 3; // Default size: 3 (3x3 - Easy) or 4 (4x4 - Challenge)
let emptyTileIndex  = 8;
let timerInterval   = null;
let secondsLeft     = 180;
let gameStarted     = false;
let showNumbers     = false;

// ──────────────────────────────────────────────────────
//  Level Data & Lore (GTD System)
// ──────────────────────────────────────────────────────
const LEVELS = [
    {
        id: 1,
        title: "LEVEL 1: THE AWAKENING",
        levelLore: "In the beginning, there was only the void. The first Beaks emerged from the digital ether, forming a chaotic but powerful flock. Your journey begins here, where the fundamentals of existence are drawn in stippled reality. Prove your worth by reassembling these foundational artifacts.",
        gridSize: 3,
        timeLimit: 180,
        unlocked: true,
        arts: [
            { name: 'Dima Kashtalyan', file: 'assets/1st collection.jpg', lore: "The genesis piece. Forged in the fiery stipples of creation, this beak emerged from the ash to lead the flock." },
            { name: '2nd Collection', file: 'assets/2nd collection.jpg', lore: "The second wave. A deeper descent into the surreal world of pointillism." },
            { name: '3rd Collection', file: 'assets/3rd collection.jpg', lore: "The third evolution. Where art meets the infinite complexity of the metaverse." },
            { name: 'Art Piece I', file: 'assets/art 1.jpg', lore: "A raw study in stippled form. The foundation upon which all Beaks are built." },
            { name: 'Art Piece II', file: 'assets/art 2.jpg', lore: "Light and shadow dance in pointillism harmony." },
            { name: 'Art Piece III', file: 'assets/art 3.jpg', lore: "The third canvas speaks of transformation and rebirth." },
            { name: 'Art Piece IV', file: 'assets/art 4.jpg', lore: "A meditation on form and void, rendered in a thousand dots." },
            { name: 'Yo', file: 'assets/yo.jpg', lore: "A declaration of presence in the digital frontier." }
        ]
    },
    {
        id: 2,
        title: "LEVEL 2: THE PILGRIMAGE",
        levelLore: "Having mastered the basics, you enter the treacherous midlands. The flock has scattered, their forms becoming more complex and abstract. Time moves differently here. Only those with true vision can navigate the visual static to find the hidden patterns.",
        gridSize: 3,
        timeLimit: 150,
        unlocked: false,
        arts: [
            { name: 'ANYA MISAAKI', file: 'assets/ANYA MISAAKI.jpg', lore: "A silent watcher from the digital canopy, preserving the ancient secrets of the ExpatQ3 realm." },
            { name: 'AURORA', file: 'assets/AURORA.jpg', lore: "Born under the neon lights of the metaverse, Aurora guides lost players through the grid." },
            { name: 'CITYBOY', file: 'assets/CITYBOY.jpg', lore: "A true native of the blockchain streets. The Cityboy never sleeps, constantly hunting for alpha." },
            { name: 'Ashley', file: 'assets/Ashley.jpg', lore: "Quiet determination meets artistic brilliance. Ashley's piece whispers of hidden depths." },
            { name: 'Miss Ayo', file: 'assets/miss ayo.jpg', lore: "Grace under pressure. Miss Ayo's presence commands respect on the leaderboard." },
            { name: 'Sharu DS', file: 'assets/sharu DS.jpg', lore: "A digital sculptor of rare form. Every dot is placed with surgical precision." },
            { name: 'dhirajleg', file: 'assets/@dhirajleg.jpg', lore: "A cartographer of the metaverse, mapping uncharted territories in ink and pixel." },
            { name: 'lucas950825', file: 'assets/@lucas950825.jpg', lore: "Numbers hold meaning. This cryptographer embeds secrets within every stipple." }
        ]
    },
    {
        id: 3,
        title: "LEVEL 3: THE TRIAL",
        levelLore: "The grid expands. What was once a 3x3 challenge becomes a 4x4 labyrinth of fragmented art. The Trial separates the casual players from the true believers. Your pattern recognition must evolve or you will be consumed by the complexity.",
        gridSize: 4,
        timeLimit: 180,
        unlocked: false,
        arts: [
            { name: 'DR TIM', file: 'assets/DR TIM.jpg', lore: "The mad scientist of the flock. DR TIM experiments with on-chain mechanics that defy logic." },
            { name: 'IAMJAY', file: 'assets/IAMJAY.jpg', lore: "A master of stealth and strategy. When IAMJAY appears, the meta is about to shift." },
            { name: 'IEATDED', file: 'assets/IEATDED.jpg', lore: "A scavenger of dead projects, recycling liquidity into pure, unadulterated art." },
            { name: 'JUST-ROB', file: 'assets/JUST-ROB.jpg', lore: "No complex mechanics. Just raw, unfiltered dedication to the ExpatQ3 ecosystem." },
            { name: 'Rafiki web3', file: 'assets/Rafiki web3.jpg', lore: "The wise elder. Rafiki holds the keys to the GTD spots for those worthy of solving the puzzle." },
            { name: 'batt004', file: 'assets/@batt004.jpg', lore: "Charged with creative energy, batt004 powers through the grid with electric precision." },
            { name: 'valkiz_jr', file: 'assets/@valkiz_jr.jpg', lore: "A rising star in the flock, earning their stripes one solved puzzle at a time." },
            { name: 'verah_tee', file: 'assets/@verah_tee.jpg', lore: "Elegance in every dot. Verah's art transcends the digital and touches the soul." }
        ]
    },
    {
        id: 4,
        title: "LEVEL 4: THE CRUCIBLE",
        levelLore: "The crucible burns away the unworthy. Time is your enemy now — 150 seconds to reconstruct masterpieces fragmented into 16 pieces. Every second wasted is a step closer to failure. Only the sharpest minds survive the crucible.",
        gridSize: 4,
        timeLimit: 150,
        unlocked: false,
        arts: [
            { name: 'VICTORX', file: 'assets/VICTORX.jpg', lore: "Victory is not an option, it is a state of being. The apex predator of the puzzle grid." },
            { name: 'collcool_sneh', file: 'assets/collcool_sneh.jpg', lore: "Cool under pressure. Can you beat the clock before the colors fade into the blockchain?" },
            { name: 'dark_jesus', file: 'assets/dark_jesus.jpg', lore: "A savior to some, a final boss to others. The ultimate test of your pointillism reconstruction skills." },
            { name: 'erfan5427', file: 'assets/erfan5427.jpeg', lore: "An enigma wrapped in code. Only the fastest solvers can uncover the true identity of erfan5427." },
            { name: 'prateek', file: 'assets/prateek.jpg', lore: "The final sentinel. Defeat this puzzle to claim your rightful place on the GTD leaderboard." },
            { name: '0x_Castar', file: 'assets/@0x_Castar.jpeg', lore: "Cast from the forge of decentralization, 0x_Castar guards the path to the final level." },
            { name: 'T0kenPrince', file: 'assets/@T0kenPrince.jpeg', lore: "Royalty of the token realm. The Prince demands perfection from those who dare challenge him." },
            { name: 'Uchenna603', file: 'assets/@Uchenna603.jpeg', lore: "A warrior of the digital plains. Uchenna603 fights with patience and precision." }
        ]
    },
    {
        id: 5,
        title: "LEVEL 5: THE ASCENSION",
        levelLore: "The apex of your journey. These legendary artifacts contain the pure, unfiltered essence of ExpatQ3. The time constraint is brutal, the pieces are fragmented, and only the elite will secure their Guaranteed Mint spot. Do you have what it takes to ascend?",
        gridSize: 4,
        timeLimit: 120,
        unlocked: false,
        arts: [
            { name: 'AVolcans', file: 'assets/@AVolcans.jpg', lore: "Erupting with creative force, AVolcans reshapes the landscape of digital art." },
            { name: 'Calopo', file: 'assets/@Calopo_.jpeg', lore: "A master of color and chaos, Calopo's work demands absolute focus to reconstruct." },
            { name: 'MynddNFT', file: 'assets/@MynddNFT.png', lore: "Mind over matter. MynddNFT's art challenges the very perception of digital reality." },
            { name: 'Pauline Fathima', file: 'assets/@Pauline_Fathima.jpg', lore: "Grace and power in every stroke. The final guardian before ascension." },
            { name: 'Yizzz_web3', file: 'assets/@Yizzz_web3.jpg', lore: "The web3 native. Born in the blockchain, destined to guard its most precious art." },
            { name: 'bitartixt', file: 'assets/@bitartixt.jpeg', lore: "Where bits become art. The ultimate fusion of technology and creativity." },
            { name: 'dejiiszn', file: 'assets/@dejiiszn.png', lore: "Season after season, dejiiszn delivers masterpieces that defy reconstruction." },
            { name: 'mr_wayne_2', file: 'assets/@mr_wayne_2.jpeg', lore: "The dark knight of the puzzle grid. Solve his riddle or be forever lost." },
            { name: 'ccshark64', file: 'assets/@ccshark64.webp', lore: "A predator of the digital deep. ccshark64 circles the leaderboard waiting for the worthy." }
        ]
    }
];

// We will track the currently selected level globally
let currentLevelData = LEVELS[0];

// ──────────────────────────────────────────────────────
//  DOM Refs
// ──────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const SCREENS = {
    flip:       $('book-flip-screen'),
    video:      $('video-screen'),
    intro:      $('intro-screen'),
    map:        $('map-screen'),
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
    try {
        if (!audioCtx && AudioCtx) audioCtx = new AudioCtx();
    } catch(e) {
        console.warn('Audio initialization failed or not supported:', e);
    }
}

function playFlipSound() {
    initAudio();
    if (!audioCtx) return;
    try {
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
    } catch(e) {
        console.warn('Audio playback failed', e);
    }
}

// ──────────────────────────────────────────────────────
//  Screen Manager
// ──────────────────────────────────────────────────────
function showScreen(key) {
    Object.values(SCREENS).forEach(s => s.classList.add('hidden'));
    if (SCREENS[key]) {
        SCREENS[key].classList.remove('hidden');
        SCREENS[key].scrollTop = 0;
    }
    // Hide sidebar on transition
    const sidebar = document.querySelector('.panel-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-active');
}

// ──────────────────────────────────────────────────────
//  Phase 0: Book Flip
// ──────────────────────────────────────────────────────
const FLIP_PAGES = document.querySelectorAll('.flip-page');

let bookFlipInterval;
let bookFlipTimeout;

function startBookFlip() {
    let idx = 0;
    // flip each page at 550ms — slightly slower as requested
    bookFlipInterval = setInterval(() => {
        if (idx < FLIP_PAGES.length) {
            // Sound removed per user request
            FLIP_PAGES[idx].classList.add('flipped');
            idx++;
        } else {
            clearInterval(bookFlipInterval);
            bookFlipTimeout = setTimeout(goToVideo, 800);
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
    if (bookFlipInterval) clearInterval(bookFlipInterval);
    if (bookFlipTimeout) clearTimeout(bookFlipTimeout);
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
//  Phase 2: Landing & Navigation
// ──────────────────────────────────────────────────────
$('start-btn').onclick = async () => {
    const btn = $('start-btn');
    btn.textContent = 'SYNCING...';
    btn.disabled = true;

    try {
        if (playerHandle) {
            const res = await fetch(`/api/leaderboard?username=${encodeURIComponent(playerHandle)}`);
            if (res.ok) {
                const data = await res.json();
                const levelReached = data.level_reached || 1;
                // Unlock levels based on synced progress
                LEVELS.forEach(l => {
                    if (l.id <= levelReached) l.unlocked = true;
                });
            }
        }
    } catch (e) {
        console.error("Sync error:", e);
    }

    btn.textContent = 'ENTER ART STUDIO';
    btn.disabled = false;
    
    buildMap();
    showScreen('map');
};

// Back Buttons Navigation
$('back-to-flip-btn').onclick = () => {
    dom.introVideo.pause();
    showScreen('flip');
};

$('back-to-video-btn').onclick = () => {
    showScreen('video');
    dom.introVideo.currentTime = 0;
    dom.introVideo.play().catch(() => {});
};

$('back-to-home-from-map-btn').onclick = () => {
    showScreen('intro');
};

$('back-to-map-btn').onclick = () => {
    showScreen('map');
};

// ──────────────────────────────────────────────────────
//  Map Building Logic
// ──────────────────────────────────────────────────────
function buildMap() {
    const container = $('map-nodes-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Draw SVG Path
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "map-path");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    
    const positions = [
        { x: 15, y: 85 },
        { x: 45, y: 70 },
        { x: 80, y: 55 },
        { x: 55, y: 35 },
        { x: 35, y: 15 }
    ];
    
    const path = document.createElementNS(svgNS, "path");
    const d = `M ${positions[0].x} ${positions[0].y} C 30 80, 35 75, ${positions[1].x} ${positions[1].y} C 60 65, 70 60, ${positions[2].x} ${positions[2].y} C 75 45, 65 40, ${positions[3].x} ${positions[3].y} C 50 30, 40 20, ${positions[4].x} ${positions[4].y}`;
    path.setAttribute("d", d);
    svg.appendChild(path);
    container.appendChild(svg);
    
    // Create Nodes
    LEVELS.forEach((lvl, index) => {
        const node = document.createElement('button');
        node.className = 'map-node';
        node.setAttribute('data-level-id', lvl.id);
        node.type = 'button';
        
        if (lvl.unlocked) {
            node.classList.add('unlocked');
            const isHighestUnlocked = (index === LEVELS.length - 1) || !LEVELS[index + 1].unlocked;
            if (isHighestUnlocked) node.classList.add('active-glow');
            node.textContent = lvl.id;
        } else {
            node.classList.add('locked');
            node.textContent = '🔒';
            node.disabled = true;
        }
        
        node.style.left = positions[index].x + '%';
        node.style.top = positions[index].y + '%';
        
        // Label below node
        const label = document.createElement('span');
        label.className = 'map-node-label';
        label.textContent = lvl.title;
        node.appendChild(label);
        
        container.appendChild(node);
    });
    
    // Event delegation on the container
    container.onclick = function(e) {
        const node = e.target.closest('.map-node');
        if (!node) return;
        const levelId = parseInt(node.getAttribute('data-level-id'));
        const lvl = LEVELS.find(l => l.id === levelId);
        if (!lvl || !lvl.unlocked) return;
        
        console.log('Level clicked:', lvl.title);
        currentLevelData = lvl;
        showLevelLore(lvl);
    };
}

function showLevelLore(lvl) {
    const modal = $('level-lore-modal');
    if (!modal) {
        console.error('level-lore-modal not found, proceeding directly to gallery');
        buildGallery();
        showScreen('setup');
        return;
    }
    $('lore-modal-title').textContent = lvl.title;
    $('lore-modal-text').textContent = lvl.levelLore;
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.classList.remove('hidden');
}

$('proceed-to-gallery-btn').onclick = () => {
    const modal = $('level-lore-modal');
    modal.classList.add('hidden');
    modal.style.display = '';
    modal.style.opacity = '';
    modal.style.pointerEvents = '';
    buildGallery();
    showScreen('setup');
};

// ──────────────────────────────────────────────────────
//  Phase 3: Gallery
// ──────────────────────────────────────────────────────
function isMobile() {
    return window.innerWidth <= 768;
}

function buildGallery() {
    // 1. Build Artwork Grid for Current Level
    dom.galleryGrid.innerHTML = '';
    currentLevelData.arts.forEach(art => {
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
        item.addEventListener('click', () => selectArt(art.file, art.name, item, art.lore));
        dom.galleryGrid.appendChild(item);
    });

    // Reset selection when changing levels
    selectArt(null, null, null, null);
    
    // Update Level Info Box in Sidebar
    const infoBox = document.getElementById('level-info-box');
    if (infoBox) {
        infoBox.classList.remove('hidden');
        document.getElementById('level-info-title').textContent = currentLevelData.title;
        document.getElementById('level-info-desc').textContent = `${currentLevelData.gridSize}x${currentLevelData.gridSize} Grid • ${currentLevelData.timeLimit}s Time Limit`;
    }
}

let currentLore = ""; // Track lore of selected art

function selectArt(file, name, el, lore) {
    document.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('selected'));
    if (el) el.classList.add('selected');

    currentLore = lore || "";

    selectedImg    = file;
    selectedArtist = name;

    dom.selectionStatus.textContent = 'Art staged for authentication ✓';

    if (file) {
        dom.previewImg.src = file;
        dom.previewImg.classList.remove('hidden');
        dom.targetPreview.src = file;
    } else {
        dom.previewImg.src = '';
        dom.previewImg.classList.add('hidden');
        dom.targetPreview.src = '';
    }

    dom.gameArtistName.textContent = name || '';
    dom.launchBtn.disabled = !file;

    // On mobile, show the sidebar as a full-screen preview page only if a specific art is selected
    if (isMobile() && file) {
        const sidebar = document.querySelector('.panel-sidebar');
        sidebar.classList.add('mobile-active');
    }
}

// ──────────────────────────────────────────────────────
//  Auth & Leaderboard Handlers
// ──────────────────────────────────────────────────────
// X handle input logic (on intro screen)
const handleInput = document.getElementById('x-handle-input');
const startBtn = $('start-btn');
if (handleInput) {
    startBtn.style.display = 'none';
    handleInput.addEventListener('input', () => {
        const val = handleInput.value.trim().replace('@', '');
        if (val.length >= 2) {
            startBtn.style.display = '';
            playerHandle = val;
        } else {
            startBtn.style.display = 'none';
            playerHandle = '';
        }
    });
}

const leaderboardBtn = document.getElementById('leaderboard-btn');
const closeLbBtn = document.getElementById('close-leaderboard-btn');
const lbModal = document.getElementById('leaderboard-modal');

if (leaderboardBtn && lbModal) {
    leaderboardBtn.addEventListener('click', async () => {
        lbModal.classList.remove('hidden');
        await fetchLeaderboard();
    });
}
if (closeLbBtn && lbModal) {
    closeLbBtn.addEventListener('click', () => {
        lbModal.classList.add('hidden');
    });
}

async function fetchLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    
    list.innerHTML = `<div style="text-align: center; color: var(--gold); padding: 2rem;">Loading the masters...</div>`;
    
    try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
            list.innerHTML = `<div style="text-align: center; color: var(--muted); padding: 2rem;">No champions yet. Be the first!</div>`;
            return;
        }
    
    list.innerHTML = '';
    data.forEach((row, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        
        const m = Math.floor(row.total_time / 60).toString().padStart(2, '0');
        const s = (row.total_time % 60).toString().padStart(2, '0');
        
        const pfpUrl = `https://unavatar.io/twitter/${encodeURIComponent(row.username)}?fallback=https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png`;

        item.innerHTML = `
            <div class="lb-rank">#${index + 1}</div>
            <img src="${pfpUrl}" class="lb-pfp" alt="@${row.username}">
            <div class="lb-user">
                @${row.username}
                <div class="lb-level">LVL ${row.level_reached}</div>
            </div>
            <div class="lb-time">${m}:${s}</div>
        `;
        list.appendChild(item);
    });
    } catch (error) {
        console.error("Leaderboard error:", error);
        list.innerHTML = `<div style="text-align: center; color: red; padding: 2rem;">Error fetching ranks.</div>`;
    }
}

// No custom image upload or difficulty selection in GTD mode
dom.launchBtn.onclick = () => {
    if (!selectedImg) return;
    gridSize = currentLevelData.gridSize; // Apply GTD level mechanics
    showScreen('game');
    initPuzzle(selectedImg);
    shuffleBoard();
    startTimer();
};

$('replay-btn').onclick = () => showScreen('setup');
$('home-btn').onclick = () => {
    buildMap(); // Refresh map states
    showScreen('map');
};

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
        const computed = Math.floor(availWidth / gridSize);
        if (computed > 20) return computed;
    }
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tile')) || 90;
}

function initPuzzle(src) {
    dom.board.innerHTML = '';
    tiles = [];

    // Set grid columns dynamically on the board element
    dom.board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    dom.board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    const totalTiles = gridSize * gridSize;
    const emptyIdx = totalTiles - 1;

    for (let i = 0; i < totalTiles; i++) {
        const el = document.createElement('div');
        el.classList.add('tile');
        const col = i % gridSize, row = Math.floor(i / gridSize);

        if (i === emptyIdx) {
            el.classList.add('empty-slot');
            emptyTileIndex = emptyIdx;
        } else {
            el.style.backgroundImage    = `url("${src}")`;
            el.style.backgroundSize     = `${gridSize * 100}% ${gridSize * 100}%`;
            el.style.backgroundPosition = `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`;

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
    showNumbers = false;
    dom.toggleNumBtn.classList.remove('active');
    if (gridSize === 3) {
        dom.toggleNumBtn.disabled = true;
        dom.toggleNumBtn.textContent = 'SHOW NUMBERS (LOCKED - 90s)';
    } else {
        dom.toggleNumBtn.disabled = false;
        dom.toggleNumBtn.textContent = 'SHOW NUMBERS';
    }
    gameStarted = true;
}

function handleClick(t) {
    if (!gameStarted) return;
    const emptyIdx = (gridSize * gridSize) - 1;
    if (t.originalIndex === emptyIdx) return;
    if (isAdj(t.currentIndex, emptyTileIndex)) {
        swap(t);
        checkWin();
    }
}

function isAdj(a, b) {
    return Math.abs(Math.floor(a/gridSize) - Math.floor(b/gridSize)) + Math.abs(a%gridSize - b%gridSize) === 1;
}

// Target helper highlight for adjacent tiles
function updateMovableHighlights() {
    const nbrs = getNeighbors(emptyTileIndex);
    tiles.forEach(t => {
        if (nbrs.includes(t.currentIndex) && t.originalIndex !== (gridSize * gridSize) - 1) {
            t.el.classList.add('movable');
        } else {
            t.el.classList.remove('movable');
        }
    });
}

function swap(t) {
    const emptyIdx = (gridSize * gridSize) - 1;
    const empty = tiles.find(x => x.originalIndex === emptyIdx);
    const prev  = t.currentIndex;
    t.currentIndex    = emptyTileIndex;
    empty.currentIndex = prev;
    emptyTileIndex    = prev;
    renderBoard();
    updateMovableHighlights();
}

function renderBoard() {
    const sorted = [...tiles].sort((a,b) => a.currentIndex - b.currentIndex);
    dom.board.innerHTML = '';
    sorted.forEach(t => dom.board.appendChild(t.el));
}

function getNeighbors(idx) {
    const r = Math.floor(idx/gridSize), c = idx%gridSize, n = [];
    if (r > 0) n.push(idx-gridSize);
    if (r < gridSize - 1) n.push(idx+gridSize);
    if (c > 0) n.push(idx-1);
    if (c < gridSize - 1) n.push(idx+1);
    return n;
}

function shuffleBoard() {
    const emptyIdx = (gridSize * gridSize) - 1;
    tiles.forEach((t,i) => t.currentIndex = i);
    emptyTileIndex = emptyIdx;
    const shuffleSteps = gridSize === 3 ? 120 : 240;
    for (let i = 0; i < shuffleSteps; i++) {
        const nbrs = getNeighbors(emptyTileIndex);
        const pick = nbrs[Math.floor(Math.random() * nbrs.length)];
        const t    = tiles.find(x => x.currentIndex === pick);
        const emp  = tiles.find(x => x.originalIndex === emptyIdx);
        const tmp  = t.currentIndex;
        t.currentIndex   = emptyTileIndex;
        emp.currentIndex = tmp;
        emptyTileIndex   = tmp;
    }
    renderBoard();
    updateMovableHighlights();
}

function checkWin() {
    if (gameStarted && tiles.every(t => t.originalIndex === t.currentIndex)) endGame(true);
}


// ──────────────────────────────────────────────────────
//  Timer
// ──────────────────────────────────────────────────────
function startTimer() {
    clearInterval(timerInterval);
    secondsLeft = currentLevelData.timeLimit;
    tick();
    timerInterval = setInterval(tick, 1000);
}

function tick() {
    const m = Math.floor(secondsLeft/60).toString().padStart(2,'0');
    const s = (secondsLeft % 60).toString().padStart(2,'0');
    dom.timerDisplay.textContent = `${m}:${s}`;
    dom.timerDisplay.classList.toggle('danger', secondsLeft <= 30);

    // 3x3 Dynamic Lifeline Mechanic: Show Number only available when time is half
    if (gridSize === 3) {
        const halfTime = Math.floor(currentLevelData.timeLimit / 2);
        if (secondsLeft > halfTime) {
            dom.toggleNumBtn.disabled = true;
            dom.toggleNumBtn.textContent = `SHOW NUMBERS (LOCKED - ${secondsLeft - halfTime}s)`;
        } else {
            dom.toggleNumBtn.disabled = false;
            if (!showNumbers) {
                dom.toggleNumBtn.textContent = 'SHOW NUMBERS';
            } else {
                dom.toggleNumBtn.textContent = 'HIDE NUMBERS';
            }
        }
    } else {
        // 4x4: always unlocked
        dom.toggleNumBtn.disabled = false;
    }

    if (secondsLeft-- <= 0) { clearInterval(timerInterval); endGame(false); }
}

// ──────────────────────────────────────────────────────
//  Game End & Level Progression
// ──────────────────────────────────────────────────────
function endGame(win) {
    gameStarted = false;
    clearInterval(timerInterval);
    showScreen('completion');

    // Show the art they played with in the overlay
    const overlayArt = document.getElementById('overlay-art-img');
    if (overlayArt && selectedImg) overlayArt.src = selectedImg;

    if (win) {
        const elapsed = currentLevelData.timeLimit - secondsLeft;
        const m = Math.floor(elapsed/60).toString().padStart(2,'0');
        const s = (elapsed % 60).toString().padStart(2,'0');
        dom.overlayIcon.className = 'overlay-icon';
        dom.overlayIcon.textContent = '✓';
        dom.statusTitle.textContent = `${currentLevelData.title} CLEARED!`;
        
        let statusHtml = `<strong>${selectedArtist}</strong> authenticated in ${m}:${s}.<br><br>`;
        statusHtml += `<em style="color:var(--gold); font-size:0.9rem;">"${currentLore}"</em>`;
        
        // Unlock next level logic
        const nextLevelIndex = LEVELS.findIndex(l => l.id === currentLevelData.id) + 1;
        if (nextLevelIndex < LEVELS.length) {
            LEVELS[nextLevelIndex].unlocked = true;
            statusHtml += `<br><br><span style="color:#2ecc71; font-weight:bold;">🔓 LEVEL ${LEVELS[nextLevelIndex].id} UNLOCKED!</span>`;
        } else {
            statusHtml += `<br><br><span style="color:#2ecc71; font-weight:bold;">🏆 GTD MASTER RANK ACHIEVED!</span>`;
        }
        
        // Push Score to Leaderboard
        if (playerHandle) {
            const handle = playerHandle;
            fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: handle,
                    level_reached: currentLevelData.id,
                    total_time: elapsed
                })
            })
            .then(res => {
                if (!res.ok) throw new Error('Failed to save score');
                console.log("Score saved to GTD Leaderboard!");
            })
            .catch(error => {
                console.error("Error saving score:", error);
            });
        }
        
        dom.statusText.innerHTML = statusHtml;
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
            const elapsed = currentLevelData.timeLimit - secondsLeft;
            const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const s = (elapsed % 60).toString().padStart(2, '0');
            ctx.fillStyle = '#e8c16a';
            ctx.font = 'bold 28px "Courier New", monospace';
            ctx.fillText(`⏱ ${m}:${s}`, 400, 650);

            // Status
            ctx.fillStyle = '#e8c16a';
            ctx.font = 'bold 20px "Inter", sans-serif';
            ctx.fillText(`✓ ${currentLevelData.title} CLEARED`, 400, 710);

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
            ctx.fillText(`✓ ${currentLevelData.title} CLEARED`, 400, 460);
            canvas.toBlob((blob) => resolve(blob), 'image/png');
        };
        img.src = selectedImg;
    });
}

$('share-x-btn').onclick = async () => {
    const elapsed = currentLevelData.timeLimit - secondsLeft;
    const m = Math.floor(elapsed/60).toString().padStart(2,'0');
    const s = (elapsed % 60).toString().padStart(2,'0');
    const tweetText = `**${currentLevelData.title} cleared** 🔻\n\nreconstructed ${selectedArtist}'s pointillism masterpiece in exactly ${m}:${s} against the clock.\n\n"${currentLore}"\n\nbeat my time here: https://thebeaks-puzzle.vercel.app/\n\n@DKashtalyan @thebeaksart @ssheyii @MartKAD 🧩\n\nhttps://x.com/ExpatQ3/status/2056048595199987823?s=20`;


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
$('shuffle-btn').onclick = () => { shuffleBoard(); };

$('ai-help-btn').onclick = () => {
    // Instantly sort the tiles to their original positions
    tiles.forEach(t => {
        t.currentIndex = t.originalIndex;
    });
    emptyTileIndex = 15;
    renderBoard();
    
    // Slight delay to let the board render before checking win
    setTimeout(() => {
        checkWin();
    }, 100);
};

// Number toggle
dom.toggleNumBtn.addEventListener('click', () => {
    showNumbers = !showNumbers;
    dom.toggleNumBtn.textContent = showNumbers ? 'HIDE NUMBERS' : 'SHOW NUMBERS';
    dom.toggleNumBtn.classList.toggle('active', showNumbers);
    document.querySelectorAll('.tile-number').forEach(n => {
        n.style.opacity = showNumbers ? '1' : '0';
    });
});



// ──────────────────────────────────────────────────────
//  Mobile: Back to Gallery button
// ──────────────────────────────────────────────────────
$('back-to-gallery-btn').addEventListener('click', () => {
    const sidebar = document.querySelector('.panel-sidebar');
    sidebar.classList.remove('mobile-active');
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
