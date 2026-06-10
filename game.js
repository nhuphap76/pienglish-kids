// ============================================================
// PIENGLISH KIDS — game.js hoàn chỉnh
// Pi Auth + Game RPG Mèo Con phiêu lưu
// ============================================================

// ============ KHỞI TẠO PI SDK ============
// Kiểm tra có Pi SDK không
const IS_PI_BROWSER = typeof window.Pi !== 'undefined';

if (IS_PI_BROWSER) {
  Pi.init({ version: "2.0", sandbox: true });
} else {
  window.Pi = {
    init: () => {},
    authenticate: () => Promise.resolve({
      user: { username: "hienhuy76" }
    })
  };
}

// ============ BIẾN TOÀN CỤC ============
const G = {
  hp: 100, maxHp: 100, lv: 1, exp: 0, pi: 0,
  cleared: [], stars: {}, current: null,
  wIdx: 0, revealed: false, answered: false,
  correct: 0, total: 0, eHp: 100,
  piUsername: null
};

// ============ PI AUTH — ĐĂNG NHẬP ============
async function loginWithPi() {
  showLoading("Đang kết nối Pi...");
  try {
    const auth = await Pi.authenticate(
      ['username'],
      handleIncompletePayment
    );
    G.piUsername = auth.user.username;
    startGame(G.piUsername);
  } catch (error) {
    G.piUsername = "hienhuy76";
    startGame(G.piUsername);
  }
}

function handleIncompletePayment(payment) {
  console.log("Payment bỏ qua:", payment);
}

function showLoading(msg) {
  const btn = document.getElementById('btnLogin');
  if (btn) btn.textContent = msg;
}

function showError(msg) {
  const btn = document.getElementById('btnLogin');
  if (btn) {
    btn.textContent = msg;
    setTimeout(() => btn.textContent = 'Thử lại', 2000);
  }
}

function startGame(username) {
  const login = document.getElementById('loginScreen');
  const game  = document.getElementById('gameScreen');
  if (login) login.style.display = 'none';
  if (game)  game.style.display  = 'block';
  initGameMap();
}

// ============ DỮ LIỆU ZONES ============
const ZONES = [
  {
    id: 0, name: 'Rừng Xanh', icon: '🌲',
    bg: 'linear-gradient(135deg,#1a3a1a,#2d5a27)',
    topic: 'Animals',
    enemy: { sprite: '🐗', name: 'Lợn Rừng' },
    words: [
      { en: 'DOG',      vn: 'Con chó',   emoji: '🐶', ipa: '/dɒɡ/' },
      { en: 'CAT',      vn: 'Con mèo',   emoji: '🐱', ipa: '/kæt/' },
      { en: 'BIRD',     vn: 'Con chim',  emoji: '🐦', ipa: '/bɜːrd/' },
      { en: 'FISH',     vn: 'Con cá',    emoji: '🐟', ipa: '/fɪʃ/' },
      { en: 'RABBIT',   vn: 'Con thỏ',   emoji: '🐰', ipa: '/ˈræbɪt/' },
      { en: 'ELEPHANT', vn: 'Con voi',   emoji: '🐘', ipa: '/ˈelɪfənt/' },
    ],
    req: 0, pi: 0.003
  },
  {
    id: 1, name: 'Vườn Trái Cây', icon: '🍎',
    bg: 'linear-gradient(135deg,#3a1520,#6B2040)',
    topic: 'Fruits',
    enemy: { sprite: '👺', name: 'Khổng Lồ' },
    words: [
      { en: 'APPLE',      vn: 'Quả táo',    emoji: '🍎', ipa: '/ˈæpəl/' },
      { en: 'BANANA',     vn: 'Quả chuối',  emoji: '🍌', ipa: '/bəˈnɑːnə/' },
      { en: 'ORANGE',     vn: 'Quả cam',    emoji: '🍊', ipa: '/ˈɒrɪndʒ/' },
      { en: 'GRAPE',      vn: 'Quả nho',    emoji: '🍇', ipa: '/ɡreɪp/' },
      { en: 'MANGO',      vn: 'Xoài',       emoji: '🥭', ipa: '/ˈmæŋɡoʊ/' },
      { en: 'STRAWBERRY', vn: 'Dâu tây',    emoji: '🍓', ipa: '/ˈstrɔːbəri/' },
    ],
    req: 1, pi: 0.004
  },
  {
    id: 2, name: 'Lâu Đài Màu Sắc', icon: '🏰',
    bg: 'linear-gradient(135deg,#1a1a4a,#2a2a8a)',
    topic: 'Colors',
    enemy: { sprite: '🧙', name: 'Phù Thủy' },
    words: [
      { en: 'RED',    vn: 'Màu đỏ',         emoji: '🔴', ipa: '/rɛd/' },
      { en: 'BLUE',   vn: 'Màu xanh dương', emoji: '🔵', ipa: '/bluː/' },
      { en: 'GREEN',  vn: 'Màu xanh lá',    emoji: '🟢', ipa: '/ɡriːn/' },
      { en: 'YELLOW', vn: 'Màu vàng',       emoji: '🟡', ipa: '/ˈjeloʊ/' },
      { en: 'PINK',   vn: 'Màu hồng',       emoji: '🩷', ipa: '/pɪŋk/' },
      { en: 'PURPLE', vn: 'Màu tím',        emoji: '🟣', ipa: '/ˈpɜːrpəl/' },
    ],
    req: 2, pi: 0.005
  },
  {
    id: 3, name: 'Ngọn Núi Số', icon: '⛰️',
    bg: 'linear-gradient(135deg,#2a1a0a,#5a3a10)',
    topic: 'Numbers',
    enemy: { sprite: '🐲', name: 'Rồng Đá' },
    words: [
      { en: 'ONE',   vn: 'Số một',  emoji: '1️⃣', ipa: '/wʌn/' },
      { en: 'TWO',   vn: 'Số hai',  emoji: '2️⃣', ipa: '/tuː/' },
      { en: 'THREE', vn: 'Số ba',   emoji: '3️⃣', ipa: '/θriː/' },
      { en: 'FOUR',  vn: 'Số bốn',  emoji: '4️⃣', ipa: '/fɔːr/' },
      { en: 'FIVE',  vn: 'Số năm',  emoji: '5️⃣', ipa: '/faɪv/' },
      { en: 'TEN',   vn: 'Số mười', emoji: '🔟', ipa: '/tɛn/' },
    ],
    req: 3, pi: 0.006
  },
  {
    id: 4, name: 'Làng Gia Đình', icon: '🏡',
    bg: 'linear-gradient(135deg,#2a1a3a,#4a2a6a)',
    topic: 'Family',
    enemy: { sprite: '👹', name: 'Ác Thần' },
    words: [
      { en: 'MOM',     vn: 'Mẹ',           emoji: '👩', ipa: '/mɒm/' },
      { en: 'DAD',     vn: 'Bố',           emoji: '👨', ipa: '/dæd/' },
      { en: 'SISTER',  vn: 'Chị/Em gái',   emoji: '👧', ipa: '/ˈsɪstər/' },
      { en: 'BROTHER', vn: 'Anh/Em trai',  emoji: '👦', ipa: '/ˈbrʌðər/' },
      { en: 'GRANDMA', vn: 'Bà',           emoji: '👵', ipa: '/ˈɡrænmɑː/' },
      { en: 'GRANDPA', vn: 'Ông',          emoji: '👴', ipa: '/ˈɡrænpɑː/' },
    ],
    req: 4, pi: 0.007
  },
  {
    id: 5, name: 'Biển Cơ Thể', icon: '🌊',
    bg: 'linear-gradient(135deg,#0a1a3a,#0a3a5a)',
    topic: 'Body',
    enemy: { sprite: '🦑', name: 'Bạch Tuộc' },
    words: [
      { en: 'HEAD',  vn: 'Cái đầu',   emoji: '🗣️', ipa: '/hɛd/' },
      { en: 'EYES',  vn: 'Đôi mắt',   emoji: '👀', ipa: '/aɪz/' },
      { en: 'NOSE',  vn: 'Cái mũi',   emoji: '👃', ipa: '/noʊz/' },
      { en: 'MOUTH', vn: 'Miệng',     emoji: '👄', ipa: '/maʊθ/' },
      { en: 'HAND',  vn: 'Bàn tay',   emoji: '✋', ipa: '/hænd/' },
      { en: 'FOOT',  vn: 'Bàn chân',  emoji: '🦶', ipa: '/fʊt/' },
    ],
    req: 5, pi: 0.008
  },
];

// ============ ÂMTHANH ============
const AC = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq, dur, type, vol) {
  try {
    const o = AC.createOscillator(), g = AC.createGain();
    o.connect(g); g.connect(AC.destination);
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.3, AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
    o.start(); o.stop(AC.currentTime + dur);
  } catch(e) {}
}

function sndMove()    { beep(440, 0.12, 'triangle', 0.25); setTimeout(() => beep(550, 0.1, 'triangle', 0.2), 80); }
function sndCorrect() { [523,659,784,1047].forEach((f,i) => setTimeout(() => beep(f, 0.15, 'sine', 0.3), i*80)); setTimeout(() => speak('Correct! Well done!'), 200); }
function sndWrong()   { beep(220, 0.15, 'sawtooth', 0.3); setTimeout(() => beep(180, 0.2, 'sawtooth', 0.25), 100); setTimeout(() => speak('Try again next time!'), 200); }
function sndWin()     { [523,587,659,784,880,1047].forEach((f,i) => setTimeout(() => beep(f, 0.18, 'sine', 0.35), i*100)); }

function speak(txt) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(txt);
  u.lang = 'en-US'; u.rate = 0.85; u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

// ============ TIỆN ÍCH ============
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function updateHud() {
  const nameEl = document.querySelector('.player-name');
  if (nameEl) nameEl.textContent = G.piUsername || 'Mèo Con';
  const lvEl = document.getElementById('mapLv');
  if (lvEl) lvEl.textContent = G.lv;
  const expEl = document.getElementById('mapExp');
  if (expEl) expEl.textContent = G.exp;
  const hpEl = document.getElementById('mapHP');
  if (hpEl) hpEl.textContent = G.hp;
  const piEl = document.getElementById('mapPi');
  if (piEl) piEl.textContent = G.pi.toFixed(3);
}

// ============ BẢN ĐỒ ============
function initGameMap() {
  updateHud();
  renderZones();
  showScreen('mapScreen');
}

function showMap() {
  updateHud();
  renderZones();
  showScreen('mapScreen');
}

function renderZones() {
  const grid = document.getElementById('zonesGrid');
  if (!grid) return;
  grid.innerHTML = ZONES.map(z => {
    const cleared = G.cleared.includes(z.id);
    const locked  = G.cleared.length < z.req;
    const cur     = !cleared && !locked;
    const stars   = G.stars[z.id] || 0;
    return `
      <div class="zone-card ${cleared ? 'zcleared' : locked ? 'zlocked' : cur ? 'zcurrent' : ''}"
           style="background:${z.bg}"
           onclick="${!locked ? `startZone(${z.id})` : ''}">
        <span class="zone-icon">${z.icon}</span>
        <div class="zone-name">${z.name}</div>
        <div class="zone-topic">${z.topic}</div>
        <div class="zone-stars">${cleared ? '⭐'.repeat(stars) + '☆'.repeat(3-stars) : '⬜⬜⬜'}</div>
        ${cleared ? '<div class="zone-clear-badge">✅</div>' : ''}
        ${cur ? '<div class="zone-go-badge">GO!</div>' : ''}
        ${locked ? `<div class="zone-lock"><span>🔒</span><div>Cần ${z.req} vùng trước</div></div>` : ''}
      </div>`;
  }).join('');
}

// ============ CHIẾN ĐẤU ============
function startZone(id) {
  G.current  = ZONES[id];
  G.wIdx     = 0; G.revealed = false; G.answered = false;
  G.correct  = 0; G.total    = 0;     G.eHp      = 100;

  const lbl = document.getElementById('battleLabel');
  if (lbl) lbl.textContent = G.current.icon + ' ' + G.current.name;
  const es  = document.getElementById('enemySprite');
  if (es)  es.textContent = G.current.enemy.sprite;
  const en  = document.getElementById('enemyName');
  if (en)  en.textContent = G.current.enemy.name;
  const lb  = document.getElementById('lvupBanner');
  if (lb)  lb.className = 'lvup';

  loadWord();
  showScreen('battleScreen');
}

function loadWord() {
  const w = G.current.words[G.wIdx];
  G.revealed = false; G.answered = false;

  const em = document.getElementById('wEmoji');   if (em) em.textContent = w.emoji;
  const en = document.getElementById('wEn');      if (en) en.textContent = w.en;
  const ip = document.getElementById('wIpa');     if (ip) ip.textContent = w.ipa;
  const rv = document.getElementById('wordReveal'); if (rv) rv.style.display = 'none';
  const qb = document.getElementById('quizBox');  if (qb) qb.style.display = 'none';
  const fx = document.getElementById('fxEl');     if (fx) fx.className = 'fxbar';
  const bn = document.getElementById('btnNext');  if (bn) bn.style.display = 'none';
  const lb = document.getElementById('lvupBanner'); if (lb) lb.className = 'lvup';

  updateBattleProg();
  speak(w.en);
}

function flipCard() {
  if (G.revealed) return;
  G.revealed = true;
  const rv = document.getElementById('wordReveal');
  if (rv) rv.style.display = 'block';
  const vn = document.getElementById('wVn');
  if (vn) vn.textContent = G.current.words[G.wIdx].vn;
  setTimeout(showQuiz, 500);
}

function showQuiz() {
  const z = G.current, w = z.words[G.wIdx];
  const others = z.words.filter((_, i) => i !== G.wIdx).sort(() => Math.random() - 0.5).slice(0, 3);
  const opts   = [w, ...others].sort(() => Math.random() - 0.5);
  const qViet  = Math.random() > 0.5;

  const qQ = document.getElementById('quizQ');
  if (qQ) qQ.textContent = qViet
    ? `Nghĩa tiếng Việt của "${w.en}" là gì?`
    : `Từ tiếng Anh của "${w.vn}" là gì?`;

  const qG = document.getElementById('quizGrid');
  if (qG) qG.innerHTML = opts.map(o =>
    `<button class="qopt" onclick="answerQ('${o.en}','${w.en}')">${qViet ? o.vn : o.en}</button>`
  ).join('');

  const qb = document.getElementById('quizBox');
  if (qb) qb.style.display = 'block';
}

function answerQ(chosen, correct) {
  if (G.answered) return;
  G.answered = true; G.total++;
  const ok = chosen === correct;
  if (ok) { G.correct++; G.eHp = Math.max(0, G.eHp - Math.round(100 / G.current.words.length)); }
  else    { G.hp = Math.max(0, G.hp - 8); }

  document.querySelectorAll('.qopt').forEach(b => {
    b.classList.add('disabled');
    const wObj = G.current.words.find(w => w.en === correct);
    const correctTxt = document.getElementById('quizQ').textContent.includes('Việt') ? wObj.vn : correct;
    if (b.textContent.trim() === correctTxt || b.textContent.trim() === correct) b.classList.add('hit');
    else if (b.textContent.trim() === chosen || (G.current.words.find(w => w.en === chosen) || {}).vn === b.textContent.trim()) b.classList.add('miss');
  });

  const fx = document.getElementById('fxEl');
  if (fx) {
    fx.className = 'fxbar show ' + (ok ? 'win' : 'lose');
    fx.textContent = ok
      ? '✅ Chính xác! Mèo Con tấn công!'
      : '❌ Sai rồi! Quái vật phản công! -8HP';
  }
  ok ? sndCorrect() : sndWrong();
  updateBattleProg();
  const bn = document.getElementById('btnNext');
  if (bn) bn.style.display = 'block';
}

function nextWord() {
  G.wIdx++;
  if (G.wIdx >= G.current.words.length) endZone();
  else loadWord();
}

function updateBattleProg() {
  const total = G.current.words.length;
  const pct   = Math.round((G.wIdx / total) * 100);
  const pf    = document.getElementById('progFill');  if (pf) pf.style.width = pct + '%';
  const pt    = document.getElementById('progTxt');   if (pt) pt.textContent = G.wIdx + '/' + total;
  const hb    = document.getElementById('heroBar');   if (hb) hb.style.width = Math.max(0, Math.round(G.hp / G.maxHp * 100)) + '%';
  const eb    = document.getElementById('enemyBar');  if (eb) eb.style.width = Math.max(0, G.eHp) + '%';
}

// ============ KẾT THÚC ZONE ============
function gainExp(amt) {
  G.exp += amt;
  while (G.exp >= 100 * G.lv) {
    G.exp -= 100 * G.lv; G.lv++; G.maxHp += 20; G.hp = Math.min(G.hp + 20, G.maxHp);
    const lb = document.getElementById('lvupBanner');
    if (lb) { lb.className = 'lvup show'; document.getElementById('lvupSub').textContent = `Lên Level ${G.lv}! HP tối đa +20!`; }
    setTimeout(() => { const l = document.getElementById('lvupBanner'); if(l) l.className = 'lvup'; }, 2500);
  }
}

function endZone() {
  const z   = G.current;
  const acc = G.total > 0 ? Math.round(G.correct / G.total * 100) : 0;
  const stars     = acc >= 90 ? 3 : acc >= 60 ? 2 : 1;
  const piEarned  = parseFloat((z.pi * stars / 3).toFixed(4));
  const expEarned = 40 * stars;

  G.pi += piEarned;
  G.stars[z.id] = Math.max(G.stars[z.id] || 0, stars);
  if (!G.cleared.includes(z.id)) G.cleared.push(z.id);
  gainExp(expEarned);
  sndWin();
  setTimeout(() => speak(stars === 3 ? 'Excellent! You are amazing!' : stars === 2 ? 'Good job! Keep it up!' : 'Keep trying, you can do it!'), 400);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('vTrophy',  stars === 3 ? '🏆' : stars === 2 ? '🥈' : '🥉');
  set('vTitle',   stars === 3 ? 'Xuất sắc! 🎉' : stars === 2 ? 'Tốt lắm! 👍' : 'Cố gắng hơn! 💪');
  set('vSub',     `Đã giải phóng "${z.name}"!`);
  set('vStars',   '⭐'.repeat(stars) + '☆'.repeat(3 - stars));
  set('rwScore',  G.correct + '/' + G.total);
  set('rwAcc',    acc + '%');
  set('rwPi',     '+' + piEarned + 'π');
  set('rwExp',    '+' + expEarned + ' EXP');

  const nextZone = ZONES.find(zz => zz.id === z.id + 1);
  const btnNZ    = document.getElementById('btnNextZone');
  if (btnNZ) btnNZ.style.display = nextZone ? 'block' : 'none';

  showScreen('victoryScreen');
}

function goNextZone() {
  const next = G.current.id + 1;
  if (next < ZONES.length) startZone(next);
}

// ============ KHỞI ĐỘNG ============
// Hàm này được gọi từ startGame() sau khi đăng nhập Pi thành công
function initGameMap() {
  updateHud();
  renderZones();
  showScreen('mapScreen');
}
