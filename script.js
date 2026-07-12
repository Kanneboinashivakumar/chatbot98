// ---------------- BOOT SEQUENCE ----------------
const bootLinesText = [
  "AI MESSENGER DIALER v1.2",
  "Initializing modem on COM3... OK",
  "Detecting carrier tone............ 33.6 kbps",
  "Negotiating handshake with server...",
  "  ATDT 1-800-CLAUDE-AI",
  "  CONNECT 33600",
  "Authenticating buddy list credentials...",
  "Loading buddy icons... done",
  "Checking for new IMs.......... 1 new buddy online",
];
const bootLinesEl = document.getElementById('bootlines');
const fill = document.getElementById('dialbar-fill');
const pct = document.getElementById('dialpct');
const enterBtn = document.getElementById('enterbtn');

let i = 0;
function showNextLine(){
  if(i < bootLinesText.length){
    const div = document.createElement('div');
    div.className = 'bootline';
    div.textContent = bootLinesText[i];
    if(i>0) div.classList.add('ok');
    bootLinesEl.appendChild(div);
    requestAnimationFrame(()=>div.classList.add('show'));
    i++;
    setTimeout(showNextLine, 260);
  }
}
let p = 0;
let oscPhase = 0;
showNextLine();
initStarryBg();
drawCrtOscilloscope();
const ledOh = document.getElementById('led-oh');
const ledTxrx = document.getElementById('led-txrx');
const ledCd = document.getElementById('led-cd');

const dialInterval = setInterval(()=>{
  p += Math.floor(Math.random()*9)+3;
  if(p>=100){ 
    p=100; 
    clearInterval(dialInterval); 
    enterBtn.style.display='inline-block';
    
    // LEDs post-connection
    if (ledOh) ledOh.style.background = '#ff3300';
    if (ledTxrx) ledTxrx.style.background = '#222';
    if (ledCd) {
      ledCd.style.background = '#3ad900';
      ledCd.style.boxShadow = '0 0 6px #3ad900';
    }
  } else {
    // Blinking lights during handshake
    if (ledOh) ledOh.style.background = '#ff3300';
    if (ledTxrx) {
      const active = Math.random() > 0.5;
      ledTxrx.style.background = active ? '#f0a30a' : '#222';
      ledTxrx.style.boxShadow = active ? '0 0 6px #f0a30a' : 'none';
    }
  }
  fill.style.width = p+'%';
  pct.textContent = 'Dialing... ' + p + '%' + (p>=100 ? '  — Connected at 33.6kbps' : '');
}, 220);

enterBtn.addEventListener('click', ()=>{
  const bootEl = document.getElementById('boot');
  bootEl.classList.add('fade-out');
  setTimeout(() => {
    bootEl.style.display = 'none';
  }, 800);
  
  document.getElementById('buddylist').style.display = 'flex';
  document.getElementById('buddylist').classList.add('show');
  document.getElementById('desktop-shortcuts').style.display = 'flex';
  
  // Create and unlock AudioContext synchronously
  actx = actx || new (window.AudioContext || window.webkitAudioContext)();
  unlockAudioContext(actx);
  
  // Initialize audio graph and visualizer analyser
  if (!masterGain) initAudioGraph();
  
  startTheme();
  playSignOnSound();
  resetIdleTimer();
  
  // Start canvas visualizer loop
  drawVisualizer();
  
  // Initialize draggable windows
  makeDraggable(document.getElementById('buddylist'));
  makeDraggable(document.getElementById('chatwin'));
  makeDraggable(document.getElementById('win-trash'));
  makeDraggable(document.getElementById('win-sysinfo'));
  makeDraggable(document.getElementById('win-webring'));
  makeDraggable(document.getElementById('win-docs'));
  makeDraggable(document.getElementById('win-wmp'));
  makeDraggable(document.getElementById('win-ie'));
  makeDraggable(document.getElementById('win-notepad'));
});

// ---------------- SYNTHESIZED "MIDI" BACKGROUND THEME ----------------
// Original composition, generated live with the Web Audio API — no external
// audio file, zero copyright exposure. Only starts after the Sign On click
// (a real user gesture), which also satisfies browser autoplay policy.
let actx = null;
let themeTimer = null;
let musicOn = true;
let stepCount = 0;

// Original 16-step melody (C major, cheerful/nostalgic, not any existing song)
const melody = [
  523.25, 0,      659.25, 523.25,   587.33, 0,      783.99, 0,
  659.25, 0,      523.25, 587.33,   493.88, 0,      440.00, 0
]; // C5 . E5 C5 | D5 . G5 . | E5 . C5 D5 | B4 . A4 .
// Simple root-note bassline underneath, one note per 2 steps
const bass = [130.81, 130.81, 174.61, 174.61, 196.00, 196.00, 174.61, 130.81]; // C3 C3 F3 F3 G3 G3 F3 C3

let delayNode, feedbackGain, masterGain;

let analyser;
function initAudioGraph(){
  masterGain = actx.createGain();
  masterGain.gain.value = 0.38; // Raised from 0.06 to 0.38 so background music is clearly audible!
  
  // Set up visualizer analyser node
  analyser = actx.createAnalyser();
  analyser.fftSize = 64; // 32 frequency bins
  masterGain.connect(analyser);
  
  delayNode = actx.createDelay();
  delayNode.delayTime.value = 0.22;
  feedbackGain = actx.createGain();
  feedbackGain.gain.value = 0.18; // gentle echo, not a wall of reverb
  
  delayNode.connect(feedbackGain);
  feedbackGain.connect(delayNode);
  masterGain.connect(delayNode);
  
  delayNode.connect(actx.destination);
  masterGain.connect(actx.destination);
}

function playTone(freq, time, dur, type, gainLevel){
  if(!freq) return; // rest
  const osc = actx.createOscillator();
  const g = actx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(gainLevel, time + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(time);
  osc.stop(time + dur + 0.03);
}

function playHat(time){
  const bufferSize = actx.sampleRate * 0.03;
  const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++){ data[i] = (Math.random()*2-1) * (1 - i/bufferSize); }
  const noise = actx.createBufferSource();
  noise.buffer = buffer;
  const hg = actx.createGain();
  hg.gain.value = 0.025;
  const hp = actx.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 6000;
  noise.connect(hp);
  hp.connect(hg);
  hg.connect(masterGain);
  noise.start(time);
}

function startTheme(){
  if(!musicOn) return;
  try{
    if(actx.state === 'suspended') actx.resume();
    const stepTime = 0.185; // ~130bpm eighth notes
    themeTimer = setInterval(()=>{
      if(!musicOn) return;
      const now = actx.currentTime + 0.05; // 50ms look-ahead buffer for mobile/scheduling safety!
      const step = stepCount % melody.length;
      playTone(melody[step], now, stepTime * 0.9, 'square', 0.05);
      if(step % 2 === 0) playTone(bass[(step/2)|0], now, stepTime * 1.8, 'triangle', 0.06);
      if(step % 2 === 1) playHat(now);
      stepCount++;
    }, stepTime * 1000);
  }catch(e){ console.warn('Web Audio not available:', e); }
}

function stopTheme(){
  clearInterval(themeTimer);
  if(actx) actx.suspend();
}

// ---------------- SYNTHESIZED IM SYSTEM SOUNDS ----------------
function playSignOnSound() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const now = actx.currentTime;
    
    // Ascending retro chime: C5, E5, G5, C6 (classic AIM style but synthesized)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = now + idx * 0.07;
      const dur = 0.15;
      
      g.gain.setValueAtTime(0.0001, startTime);
      g.gain.linearRampToValueAtTime(0.05, startTime + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
      
      osc.connect(g);
      g.connect(actx.destination);
      osc.start(startTime);
      osc.stop(startTime + dur + 0.02);
    });
  } catch (e) {
    console.warn('Sign-on sound failed:', e);
  }
}

function playMessageSound() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const now = actx.currentTime;
    
    // Retro digital notification "blip" - quick chime at 880Hz (A5) then 1320Hz (E6)
    const osc = actx.createOscillator();
    const g = actx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
    
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.07, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    
    osc.connect(g);
    g.connect(actx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  } catch (e) {
    console.warn('Message sound failed:', e);
  }
}

document.getElementById('musicToggle').addEventListener('click', (e)=>{
  musicOn = !musicOn;
  e.target.textContent = musicOn ? '[turn off music]' : '[turn on music]';
  if(musicOn){ startTheme(); } else { stopTheme(); }
});

// ---------------- BUDDY LIST -> CHAT ----------------
const buddylist = document.getElementById('buddylist');
const chatwin = document.getElementById('chatwin');
let greetingSent = false;
function openChatWindow() {
  const chatwin = document.getElementById('chatwin');
  chatwin.style.display = 'flex';
  chatwin.classList.add('show');
  chatwin.classList.remove('minimized');
  bringToFront(chatwin);
  
  // Show active task button in taskbar
  const taskChat = document.getElementById('task-chatwin');
  if (taskChat) {
    taskChat.style.display = 'flex';
    taskChat.classList.add('active');
  }
  
  if (!greetingSent && chatlog.children.length === 0) {
    greetingSent = true;
    setTimeout(() => {
      startTyping();
      setTimeout(() => {
        stopTyping();
        pushMsg('bot', "heyyy! its ur AI buddy from the future lol. ask me anything (yes this really works, its a real AI)");
        playMessageSound();
        resetIdleTimer();
      }, 1500);
    }, 800);
  } else {
    resetIdleTimer();
  }
}
document.getElementById('openChat').addEventListener('click', openChatWindow);
document.getElementById('closeChat').addEventListener('click', (e)=>{
  e.stopPropagation();
  const chatwin = document.getElementById('chatwin');
  chatwin.style.display = 'none';
  chatwin.classList.remove('show');
  const taskChat = document.getElementById('task-chatwin');
  if (taskChat) {
    taskChat.style.display = 'none';
    taskChat.classList.remove('active');
  }
});

// ---------------- VISITOR COUNTER (Y2K hit-counter style) ----------------
// window.storage only exists inside Claude's preview sandbox. On the real
// deployment we fall back to a per-device localStorage counter so the number
// still ticks up believably instead of silently breaking.
(async ()=>{
  const el = document.getElementById('visitCounter');
  let count = null;
  try{
    const res = await window.storage.get('visitor_count', true);
    count = (parseInt(res.value, 10) || 0) + 1;
    await window.storage.set('visitor_count', String(count), true);
  }catch(e){
    try{
      count = (parseInt(localStorage.getItem('cb98_visits'), 10) || 1336) + 1;
      localStorage.setItem('cb98_visits', String(count));
    }catch(e2){
      count = 1337;
    }
  }
  el.textContent = 'Visitors: ' + String(count).padStart(6,'0');
})();

// ---------------- CHAT LOGIC ----------------
const chatlog = document.getElementById('chatlog');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const pingStat = document.getElementById('pingStat');

let history = [];

function ts(){
  const d = new Date();
  return '(' + d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) + ')';
}

function pushMsg(who, text){
  const div = document.createElement('div');
  div.className = 'msg';
  const label = who === 'user' ? 'jordan_2k6' : 'ChatBot98';
  div.innerHTML = '<span class="who ' + who + '">' + label + ':</span> ' + escapeHtml(text) + ' <span class="ts">' + ts() + '</span>';
  chatlog.appendChild(div);
  chatlog.scrollTop = chatlog.scrollHeight;
}

function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

let dotAnim;
function startTyping(){
  typingIndicator.style.display = 'block';
  pingStat.textContent = 'Sending...';
  let n = 1;
  dotAnim = setInterval(()=>{
    n = (n % 3) + 1;
    document.getElementById('dots').textContent = '.'.repeat(n);
  }, 400);
}
function stopTyping(){
  typingIndicator.style.display = 'none';
  clearInterval(dotAnim);
  pingStat.textContent = 'Idle';
}

async function sendMessage(){
  const text = msgInput.value.trim();
  if(!text) return;
  pushMsg('user', text);
  history.push({role:'user', content:text});
  msgInput.value = '';
  startTyping();
  resetIdleTimer();

  try{
    // Calls our own serverless proxy (api/chat.js) — the real model API key
    // lives server-side, never in this file.
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });
    if(!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.details || errData.error || 'proxy returned ' + response.status);
    }
    const data = await response.json();
    if(!data.reply) throw new Error('empty reply from proxy');
    stopTyping();
    pushMsg('bot', data.reply);
    playMessageSound();
    resetIdleTimer();
    history.push({role:'assistant', content:data.reply});
  }catch(err){
    stopTyping();
    const errMsg = err.message.includes('FIREWORKS_API_KEY')
      ? `*modem error* ... ${err.message}`
      : "*connection lost* ...ur message didn't send, the modem might've dropped carrier. try again in a sec.";
    pushMsg('bot', errMsg);
    playMessageSound();
    resetIdleTimer();
    console.error(err);
  }
}

sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    sendMessage();
  }
});

// ---------------- IDLE & AWAY STATE DETECTOR ----------------
const AWAY_MESSAGES = [
  "*~* eating pizza brb *~*",
  "studying for midterms... do not disturb!!",
  "listening to My Chemical Romance... standard teen angst loading...",
  "out with friends, leave a msg!",
  "offline but actually online, just dodging people"
];

let idleTimer = null;
let awayCycleInterval = null;
let currentAwayIndex = 0;
let isAway = false;
const idleThreshold = 90000; // 90 seconds of inactivity

function resetIdleTimer() {
  if (isAway) {
    isAway = false;
    const dot = document.querySelector('#openChat .dot');
    if (dot) {
      dot.className = 'dot online';
    }
    const statusEl = document.querySelector('#openChat .bl-status');
    if (statusEl) {
      statusEl.innerHTML = 'Active now &mdash; "brb, thinking..."';
    }
    clearInterval(awayCycleInterval);
  }
  clearTimeout(idleTimer);
  idleTimer = setTimeout(goAway, idleThreshold);
}

function goAway() {
  isAway = true;
  const dot = document.querySelector('#openChat .dot');
  if (dot) {
    dot.className = 'dot away';
  }
  const statusEl = document.querySelector('#openChat .bl-status');
  if (statusEl) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    statusEl.innerHTML = `Idle since ${timeStr}`;
    
    currentAwayIndex = 0;
    clearInterval(awayCycleInterval);
    awayCycleInterval = setInterval(() => {
      statusEl.innerHTML = `Away &mdash; "${AWAY_MESSAGES[currentAwayIndex]}"`;
      currentAwayIndex = (currentAwayIndex + 1) % AWAY_MESSAGES.length;
    }, 40000);
  }
}

// Hook user input to reset idle timer
msgInput.addEventListener('input', resetIdleTimer);

// ---------------- PREMIUM DESKTOP UTILITIES ----------------
let bubbleInterval = null;

function unlockAudioContext(context) {
  if (context.state === 'suspended') {
    context.resume();
  }
  const buffer = context.createBuffer(1, 1, 22050);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}

function updateClock() {
  const el = document.getElementById('systray-time');
  if (el) {
    const now = new Date();
    el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
setInterval(updateClock, 1000);
updateClock();

let currentTheme = 'aero';
function setTheme(name) {
  document.body.className = '';
  document.body.classList.add('theme-' + name);
  currentTheme = name;
  
  ['xp', 'aero', 'cyber'].forEach(t => {
    const btn = document.getElementById('btn-theme-' + t);
    if (btn) {
      if (t === name) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
  
  createAeroBubbles();
  startXpBackground();
  updateAeroDroplets();
  updatePortalIcons(name);
  if (name === 'cyber') {
    initCyberCanvas();
  }
}

function createAeroBubbles() {
  clearInterval(bubbleInterval);
  const existing = document.getElementById('aero-bubbles');
  if (existing) existing.remove();
  
  if (document.body.classList.contains('theme-aero')) {
    const container = document.createElement('div');
    container.id = 'aero-bubbles';
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);
    
    bubbleInterval = setInterval(() => {
      if (!document.body.classList.contains('theme-aero')) {
        clearInterval(bubbleInterval);
        container.remove();
        return;
      }
      const bubble = document.createElement('div');
      bubble.style.width = (Math.random() * 25 + 8) + 'px';
      bubble.style.height = bubble.style.width;
      bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 40%, rgba(0,180,255,0.2) 70%, rgba(255,255,255,0) 100%)';
      bubble.style.border = '1px solid rgba(255,255,255,0.55)';
      bubble.style.borderRadius = '50%';
      bubble.style.position = 'absolute';
      bubble.style.bottom = '-40px';
      bubble.style.left = Math.random() * 100 + 'vw';
      bubble.style.opacity = Math.random() * 0.5 + 0.2;
      bubble.style.boxShadow = 'inset -2px -2px 5px rgba(0,0,0,0.05), 0 4px 10px rgba(0,100,255,0.1)';
      
      const duration = Math.random() * 8 + 6;
      bubble.style.transition = `transform ${duration}s linear, opacity ${duration}s ease-in-out`;
      container.appendChild(bubble);
      
      setTimeout(() => {
        bubble.style.transform = `translateY(-110vh) translateX(${(Math.random() * 100 - 50)}px)`;
        bubble.style.opacity = '0';
      }, 50);
      
      setTimeout(() => {
        bubble.remove();
      }, duration * 1000 + 100);
    }, 800);
  }
}

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  
  // 1. Buddy List Visualizer
  const canvas = document.getElementById('visualizer');
  if (canvas) {
    drawVisualizerCanvas(canvas);
  }
  
  // 2. WMP Visualizer
  const wmpCanvas = document.getElementById('wmp-visualizer');
  const wmpWin = document.getElementById('win-wmp');
  if (wmpCanvas && wmpWin && wmpWin.style.display !== 'none') {
    drawVisualizerCanvas(wmpCanvas);
  }
}

function drawVisualizerCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  
  if (!analyser || !musicOn) {
    ctx.strokeStyle = currentTheme === 'cyber' ? '#ff007f' : (currentTheme === 'aero' ? '#00d2ff' : '#3ad900');
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    return;
  }
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  
  const barWidth = (width / bufferLength) * 1.4;
  let barHeight;
  let x = 0;
  
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    const activeColor = currentTheme === 'cyber' ? '#ff007f' : (currentTheme === 'aero' ? '#00d2ff' : '#3ad900');
    ctx.fillStyle = activeColor;
    const drawHeight = (barHeight / 255) * height * 0.85 + 2;
    ctx.fillRect(x, height - drawHeight, barWidth - 1, drawHeight);
    x += barWidth;
  }
}

function toggleWindow(id) {
  const win = document.getElementById(id);
  const taskBtn = document.getElementById('task-' + id);
  if (win.style.display === 'none' || win.classList.contains('minimized') || !win.classList.contains('show')) {
    win.style.display = 'flex';
    win.classList.add('show');
    win.classList.remove('minimized');
    if (taskBtn) taskBtn.classList.add('active');
    bringToFront(win);
  } else {
    win.style.display = 'none';
    win.classList.remove('show');
    win.classList.add('minimized');
    if (taskBtn) taskBtn.classList.remove('active');
  }
}

let maxZ = 30;
function bringToFront(win) {
  maxZ++;
  win.style.zIndex = maxZ;
}

function closeWindow(id) {
  const win = document.getElementById(id);
  win.style.display = 'none';
  win.classList.remove('show');
  const taskBtn = document.getElementById('task-' + id);
  if (taskBtn) {
    taskBtn.style.display = 'none';
    taskBtn.classList.remove('active');
  }
}

function openRecycleBin() {
  const win = document.getElementById('win-trash');
  win.style.display = 'flex';
  win.classList.add('show');
  win.classList.remove('minimized');
  const taskBtn = document.getElementById('task-win-trash');
  if (taskBtn) {
    taskBtn.style.display = 'flex';
    taskBtn.classList.add('active');
  }
  bringToFront(win);
}

function openSystemInfo() {
  const win = document.getElementById('win-sysinfo');
  win.style.display = 'flex';
  win.classList.add('show');
  win.classList.remove('minimized');
  const taskBtn = document.getElementById('task-win-sysinfo');
  if (taskBtn) {
    taskBtn.style.display = 'flex';
    taskBtn.classList.add('active');
  }
  bringToFront(win);
}

function openWebring() {
  const win = document.getElementById('win-webring');
  win.style.display = 'flex';
  win.classList.add('show');
  win.classList.remove('minimized');
  const taskBtn = document.getElementById('task-win-webring');
  if (taskBtn) {
    taskBtn.style.display = 'flex';
    taskBtn.classList.add('active');
  }
  bringToFront(win);
}

function emptyTrash() {
  const table = document.getElementById('trash-table');
  if (table) table.style.display = 'none';
  const msg = document.getElementById('trash-empty-msg');
  if (msg) msg.style.display = 'block';
  const icon = document.getElementById('trash-icon');
  if (icon) icon.textContent = '🗑️';
  const desktopIcon = document.getElementById('trash-icon-desktop');
  if (desktopIcon) desktopIcon.textContent = '🗑️';
  playTrashSound();
}

function playTrashSound() {
  try {
    if (!actx) return;
    const now = actx.currentTime;
    const bufferSize = actx.sampleRate * 0.25; // 250ms
    const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const noise = actx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = actx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    const gainNode = actx.createGain();
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(actx.destination);
    
    noise.start(now);
  } catch (e) {
    console.warn('Trash sound failed:', e);
  }
}

function makeDraggable(win) {
  const titlebar = win.querySelector('.titlebar');
  if (!titlebar) return;
  
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  titlebar.onmousedown = dragMouseDown;
  titlebar.ontouchstart = dragTouchStart;
  
  function dragMouseDown(e) {
    e = e || window.event;
    if (e.target.tagName === 'SPAN' || e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    bringToFront(win);
  }
  
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    win.style.top = (win.offsetTop - pos2) + "px";
    win.style.left = (win.offsetLeft - pos1) + "px";
    win.style.margin = "0";
  }
  
  function dragTouchStart(e) {
    if (e.target.tagName === 'SPAN' || e.target.tagName === 'BUTTON') return;
    const touch = e.touches[0];
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementTouchDrag;
    bringToFront(win);
  }
  
  function elementTouchDrag(e) {
    const touch = e.touches[0];
    pos1 = pos3 - touch.clientX;
    pos2 = pos4 - touch.clientY;
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    win.style.top = (win.offsetTop - pos2) + "px";
    win.style.left = (win.offsetLeft - pos1) + "px";
    win.style.margin = "0";
  }
  
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }
}

function initStarryBg() {
  const container = document.createElement('div');
  container.className = 'stars-container';
  const bootEl = document.getElementById('boot');
  if (bootEl) bootEl.appendChild(container);
  
  // Create twinkling stars
  for (let s = 0; s < 45; s++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = (Math.random() * 3 + 1) + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDelay = Math.random() * 3 + 's';
    container.appendChild(star);
  }
  
  // Floating space emojis
  const emojis = ['🪐', '🛸', '☄️', '🌍', '🌟', '🚀', '👾'];
  for (let e = 0; e < 10; e++) {
    const obj = document.createElement('div');
    obj.className = 'floating-object';
    obj.textContent = emojis[e % emojis.length];
    obj.style.left = Math.random() * 90 + 'vw';
    obj.style.top = Math.random() * 90 + 'vh';
    obj.style.animationDelay = (Math.random() * -12) + 's';
    const dur = Math.random() * 10 + 15;
    obj.style.animationDuration = dur + 's';
    container.appendChild(obj);
  }
}

function drawCrtOscilloscope() {
  const canvas = document.getElementById('crt-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  requestAnimationFrame(drawCrtOscilloscope);
  
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = 'rgba(0, 10, 2, 0.25)'; // slight phosphor trace effect!
  ctx.fillRect(0, 0, w, h);
  
  ctx.strokeStyle = '#00ff66';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00ff66';
  ctx.shadowBlur = 6;
  
  ctx.beginPath();
  
  for (let x = 0; x < w; x++) {
    const progress = p / 100;
    let y = h / 2;
    
    if (p < 100) {
      // Jagged glitchy wave during handshake dialing
      const baseFreq = x * 0.08 + oscPhase;
      const noise = (Math.sin(baseFreq) * Math.cos(x * 0.02 - oscPhase * 0.4)) * 12;
      const staticGlitch = (Math.random() - 0.5) * (5 * (1 - progress));
      y += noise + staticGlitch;
    } else {
      // Beautiful harmonic sine wave when connected
      y += Math.sin(x * 0.06 + oscPhase) * 14;
    }
    
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  
  ctx.stroke();
  ctx.shadowBlur = 0; // reset
  
  oscPhase += (p < 100) ? 0.24 : 0.08;
}

// ---------------- RETRO WORKSPACE FUNCTIONS & ANIMATIONS ----------------

let xpInterval = null;
function startXpBackground() {
  clearInterval(xpInterval);
  const oldElements = document.querySelectorAll('.xp-bubble, .xp-cloud');
  oldElements.forEach(el => el.remove());
  
  if (currentTheme !== 'xp') return;
  
  const bg = document.getElementById('desktop-bg');
  if (!bg) return;
  
  // Create 3 fluffy slow clouds
  for (let i = 0; i < 3; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'xp-cloud';
    cloud.style.top = (Math.random() * 35) + 'vh';
    cloud.style.left = (Math.random() * 100) + 'vw';
    cloud.style.animationDelay = (Math.random() * -50) + 's';
    bg.appendChild(cloud);
  }
  
  // Periodically spawn bubbles (Y2K pop aesthetic!)
  xpInterval = setInterval(() => {
    if (currentTheme !== 'xp') {
      clearInterval(xpInterval);
      return;
    }
    const bubble = document.createElement('div');
    bubble.className = 'xp-bubble';
    bubble.style.width = (Math.random() * 35 + 8) + 'px';
    bubble.style.height = bubble.style.width;
    bubble.style.left = (Math.random() * 100) + 'vw';
    
    const delay = Math.random() * 4;
    bubble.style.animationDelay = delay + 's';
    const dur = Math.random() * 6 + 10;
    bubble.style.animationDuration = dur + 's';
    bg.appendChild(bubble);
    
    setTimeout(() => bubble.remove(), (dur + delay) * 1000);
  }, 1500);
}

let cyberCanvas = null;
let cyberCtx = null;
let cyberAnimFrame = null;
let gridY = 0;

// Sphere 3D projection points
const spherePoints = [];
for (let lat = 0; lat <= 9; lat++) {
  const theta = (lat * Math.PI) / 9;
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  for (let lon = 0; lon < 12; lon++) {
    const phi = (lon * 2 * Math.PI) / 12;
    const x = 110 * sinTheta * Math.cos(phi);
    const y = 110 * sinTheta * Math.sin(phi);
    const z = 110 * cosTheta;
    spherePoints.push({ x, y, z });
  }
}

let angleX = 0, angleY = 0;

function initCyberCanvas() {
  cyberCanvas = document.getElementById('cyber-canvas');
  if (!cyberCanvas) return;
  cyberCtx = cyberCanvas.getContext('2d');
  
  function resize() {
    if (cyberCanvas) {
      cyberCanvas.width = window.innerWidth;
      cyberCanvas.height = window.innerHeight;
    }
  }
  window.removeEventListener('resize', resize);
  window.addEventListener('resize', resize);
  resize();
  
  const columns = Math.floor(window.innerWidth / 20) + 1;
  const drops = Array(columns).fill(0).map(() => Math.random() * -100);
  
  if (cyberAnimFrame) cancelAnimationFrame(cyberAnimFrame);
  
  function draw() {
    if (currentTheme !== 'cyber') return;
    
    cyberCtx.fillStyle = 'rgba(5, 2, 12, 0.08)';
    cyberCtx.fillRect(0, 0, cyberCanvas.width, cyberCanvas.height);
    
    // Draw matrix falling code
    cyberCtx.fillStyle = '#00ffcc';
    cyberCtx.font = '10px monospace';
    for (let i = 0; i < drops.length; i++) {
      const char = String.fromCharCode(Math.floor(Math.random() * 33) + 33);
      const x = i * 20;
      const y = drops[i] * 12;
      
      cyberCtx.fillText(char, x, y);
      
      if (y > cyberCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    
    // Draw rotating 3D wireframe sphere (center-right area)
    angleX += 0.008;
    angleY += 0.012;
    const radX = angleX;
    const radY = angleY;
    
    const centerX = cyberCanvas.width * 0.75;
    const centerY = cyberCanvas.height * 0.5;
    
    const projected = spherePoints.map(p => {
      // Rotate Y
      let x1 = p.x * Math.cos(radY) - p.z * Math.sin(radY);
      let z1 = p.x * Math.sin(radY) + p.z * Math.cos(radY);
      // Rotate X
      let y2 = p.y * Math.cos(radX) - z1 * Math.sin(radX);
      let z2 = p.y * Math.sin(radX) + z1 * Math.cos(radX);
      
      const dist = 280;
      const scale = dist / (dist + z2);
      return {
        x: centerX + x1 * scale,
        y: centerY + y2 * scale
      };
    });
    
    cyberCtx.strokeStyle = 'rgba(0, 255, 204, 0.45)';
    cyberCtx.lineWidth = 1;
    
    // Draw latitudinal lines
    for (let lat = 0; lat <= 9; lat++) {
      cyberCtx.beginPath();
      for (let lon = 0; lon < 12; lon++) {
        const idx = lat * 12 + lon;
        const nextIdx = lat * 12 + ((lon + 1) % 12);
        cyberCtx.moveTo(projected[idx].x, projected[idx].y);
        cyberCtx.lineTo(projected[nextIdx].x, projected[nextIdx].y);
      }
      cyberCtx.stroke();
    }
    
    // Draw longitudinal lines
    for (let lon = 0; lon < 12; lon++) {
      cyberCtx.beginPath();
      for (let lat = 0; lat < 9; lat++) {
        const idx = lat * 12 + lon;
        const nextIdx = (lat + 1) * 12 + lon;
        cyberCtx.moveTo(projected[idx].x, projected[idx].y);
        cyberCtx.lineTo(projected[nextIdx].x, projected[nextIdx].y);
      }
      cyberCtx.stroke();
    }
    
    // Target Crosshair
    cyberCtx.strokeStyle = 'rgba(0, 255, 204, 0.25)';
    cyberCtx.beginPath();
    cyberCtx.arc(centerX, centerY, 140, 0, Math.PI * 2);
    cyberCtx.moveTo(centerX - 160, centerY);
    cyberCtx.lineTo(centerX + 160, centerY);
    cyberCtx.moveTo(centerX, centerY - 160);
    cyberCtx.lineTo(centerX, centerY + 160);
    cyberCtx.stroke();
    
    // HUD Stats
    cyberCtx.fillStyle = 'rgba(0, 255, 204, 0.75)';
    cyberCtx.font = '10px monospace';
    cyberCtx.fillText("SYSTEM STATUS: COMPILED OK", 30, cyberCanvas.height - 80);
    cyberCtx.fillText("DECENTRALIZED ENCRYPTION: ACTIVE", 30, cyberCanvas.height - 65);
    cyberCtx.fillText("IP CORRELATION RANGE: 192.168.1.98", 30, cyberCanvas.height - 50);
    cyberCtx.fillText("YOU HAVE BEEN HACKED! /L3-g97", 30, cyberCanvas.height - 35);
    
    // Draw oscillating vector wireframe lines (from bottom to top)
    cyberCtx.strokeStyle = 'rgba(191, 0, 255, 0.35)';
    cyberCtx.lineWidth = 1.5;
    cyberCtx.beginPath();
    gridY += 0.03;
    for (let x = 0; x < cyberCanvas.width; x += 15) {
      const wave = Math.sin(x * 0.006 + gridY) * Math.cos(x * 0.003 - gridY) * 110;
      const y = cyberCanvas.height / 2 + wave;
      if (x === 0) cyberCtx.moveTo(x, y);
      else cyberCtx.lineTo(x, y);
    }
    cyberCtx.stroke();
    
    cyberAnimFrame = requestAnimationFrame(draw);
  }
  draw();
}

let waterTime = 0;
function animateWaterRipple() {
  if (currentTheme === 'aero') {
    const turb = document.querySelector('#water-filter feTurbulence');
    if (turb) {
      waterTime += 0.004;
      const baseVal = 0.012 + Math.sin(waterTime) * 0.003;
      turb.setAttribute('baseFrequency', `${baseVal} ${baseVal * 1.35}`);
    }
  }
  requestAnimationFrame(animateWaterRipple);
}
requestAnimationFrame(animateWaterRipple);

function openTextFile(filename) {
  const title = document.getElementById('notepad-title');
  const content = document.getElementById('notepad-content');
  const win = document.getElementById('win-notepad');
  
  title.textContent = "Notepad - " + filename;
  
  let text = "";
  if (filename === 'secrets.txt') {
    text = "=== CLASSIFIED HACKATHON DIARY ===\n\nDate: March 14, 2006\n\nPlan: Build the ultimate Y2K/Frutiger Aero chatbot portal to win first place.\nStatus: Core features complete. Visual styling set to maximum nostalgia.\n\nSound card: ONLINE (Message chimes active)\nBackground system: ACTIVE (Water ripples & matrix code)\nStart sequence: Dialing handshakes lock successfully.\nScanlines: Active on Cyber mode.";
  } else if (filename === 'music_list.txt') {
    text = "=== RETRO SOUNDTRACK PLAYLIST ===\n\nTracks currently programmed into the synthesizer:\n\n1. ai_messenger_theme.mid (Original Chiptune Theme)\n2. dialup_negotiation.wav (Handshake Noise Remix)\n3. startup_chime.wav (Ascending Sign On Chime)\n4. crunch_trash.wav (Recycle bin empty sound)";
  } else if (filename === 'hackathon_goals.txt') {
    text = "=== HACKATHON GOALS & CHECKLIST ===\n\n[x] Block 1: Proxy chat to deepseek model\n[x] Block 2: Web Audio API chiptune synthesizer\n[x] Block 3: Responsive layouts & draggable windows\n[x] Block 4: Vercel serverless functions deployment\n[x] Block 5: Liquid water ripples & floating Y2K bubbles\n[x] Block 6: Windows Media Player dashboard widgets";
  }
  
  content.value = text;
  
  win.style.display = 'flex';
  win.classList.add('show');
  win.classList.remove('minimized');
  
  const taskBtn = document.getElementById('task-win-notepad');
  if (taskBtn) {
    taskBtn.style.display = 'flex';
    taskBtn.classList.add('active');
  }
  bringToFront(win);
}

function runIeSearch() {
  const query = document.getElementById('ie-search-input').value.toLowerCase().trim();
  const resultsDiv = document.getElementById('ie-search-results');
  
  let html = "";
  if (query.includes('webring') || query.includes('neocities') || query.includes('design') || query.includes('site')) {
    html = `<div style="margin-bottom:12px;">
              <a href="https://www.cameronsworld.net" target="_blank" style="color:blue; font-weight:bold; text-decoration:underline;">Cameron's World</a><br>
              <span style="color:green; font-size:10px;">http://www.cameronsworld.net</span><br>
              <span style="color:#333;">The ultimate web collage of the 90s Geocities archive. Beautiful designs.</span>
            </div>
            <div style="margin-bottom:12px;">
              <a href="https://melonking.net" target="_blank" style="color:blue; font-weight:bold; text-decoration:underline;">MelonLand Webring</a><br>
              <span style="color:green; font-size:10px;">http://melonking.net</span><br>
              <span style="color:#333;">A cozy, artistic community portal reviving the original fun of personal websites.</span>
            </div>
            <div style="margin-bottom:12px;">
              <a href="https://bedr00mz.neocities.org" target="_blank" style="color:blue; font-weight:bold; text-decoration:underline;">Bedr00mz</a><br>
              <span style="color:green; font-size:10px;">http://bedr00mz.neocities.org</span><br>
              <span style="color:#333;">Glitchy 90s underground visual aesthetic. Great space/CRT monitor elements.</span>
            </div>`;
  } else if (query.includes('chatbot') || query.includes('messenger') || query.includes('ai') || query.includes('portal')) {
    html = `<div style="margin-bottom:12px;">
              <strong style="color:#333; font-size:13px;">ChatBot98 (AI Assistant) is Online</strong><br>
              <span style="color:#666;">Open the <strong>ChatGPT Portal</strong> shortcut on your desktop workspace to send a message directly to the future!</span>
            </div>`;
  } else if (query === "") {
    html = `<div style="color:#666; font-size:11px;">Please type a query to search. Try "webring" or "chatbot".</div>`;
  } else {
    html = `<div style="color:#c00; font-weight:bold; margin-bottom:6px;">No exact matches found for "${query}"</div>
            <div style="color:#555; font-size:11px;">Suggestions:<br>
            - Try searching for "webring" to list handpicked Geocities galleries.<br>
            - Try searching for "chatbot" to find chatbot portal information.</div>`;
  }
  
  resultsDiv.innerHTML = html;
}

// Synchronize theme state with WMP Play/Pause button
const wmpPlayBtn = document.getElementById('wmp-play-btn');
if (wmpPlayBtn) {
  wmpPlayBtn.addEventListener('click', () => {
    musicOn = !musicOn;
    wmpPlayBtn.textContent = musicOn ? '⏸' : '▶';
    const toggleBtn = document.getElementById('musicToggle');
    if (toggleBtn) {
      toggleBtn.textContent = musicOn ? '[turn off music]' : '[turn on music]';
    }
    if (musicOn) { startTheme(); } else { stopTheme(); }
  });
}

// Volume slider binding
const wmpVolSlider = document.getElementById('wmp-vol');
if (wmpVolSlider) {
  wmpVolSlider.addEventListener('input', (e) => {
    const val = e.target.value / 100;
    if (typeof masterGain !== 'undefined' && masterGain) {
      masterGain.gain.setValueAtTime(val * 0.15, actx.currentTime);
    }
  });
}

// Track progress tracker update
let wmpProgressInterval = setInterval(() => {
  const fill = document.getElementById('wmp-progress-fill');
  const timeLabel = document.getElementById('wmp-time');
  if (!fill || !timeLabel || !musicOn || !actx) return;
  
  const totalSec = 90;
  const currentSec = Math.floor(actx.currentTime) % totalSec;
  const pct = (currentSec / totalSec) * 100;
  fill.style.width = pct + '%';
  
  const m = Math.floor(currentSec / 60);
  const s = currentSec % 60;
  timeLabel.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
}, 1000);

function updateAeroDroplets() {
  document.querySelectorAll('.aero-droplet').forEach(d => d.remove());
  if (currentTheme !== 'aero') return;
  document.querySelectorAll('.win').forEach(win => {
    for (let d = 0; d < 4; d++) {
      const drop = document.createElement('div');
      drop.className = 'aero-droplet';
      drop.style.top = (Math.random() * 70 + 15) + '%';
      drop.style.left = (Math.random() * 80 + 10) + '%';
      const size = (Math.random() * 6 + 5) + 'px';
      drop.style.width = size;
      drop.style.height = size;
      win.appendChild(drop);
    }
  });
}

function updatePortalIcons(theme) {
  const iconEl = document.getElementById('portal-icon-desktop');
  if (iconEl) {
    if (theme === 'xp') iconEl.innerHTML = '🌻'; // ICQ Daisy
    else if (theme === 'aero') iconEl.innerHTML = '🔮'; // Glossy Glass Orb
    else if (theme === 'cyber') iconEl.innerHTML = '💀'; // Glowing hacker skull
  }
}

// Set initial theme
setTheme('aero');