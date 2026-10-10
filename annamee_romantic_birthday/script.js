// ANNAMEE'S ROMANTIC BIRTHDAY WEBSITE
// Customize the default birthday date and letter in index.html / this file.
// This is a front-end surprise page; the password or personal content is not secure/private.

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const toast = (message) => {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
};

// Gentle reveal-on-scroll animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealObserver.observe(el));

// Birthday countdown: set a date here, or use the date picker on the page.
// Default date is October 12 of the current year; if passed, it counts down to next year.
const dateInput = $('#birthdayDate');
const nowAtLoad = new Date();
let birthdayTarget = new Date(nowAtLoad.getFullYear(), 9, 12, 0, 0, 0);
if (birthdayTarget <= nowAtLoad) birthdayTarget.setFullYear(birthdayTarget.getFullYear() + 1);
dateInput.value = `${birthdayTarget.getFullYear()}-${String(birthdayTarget.getMonth()+1).padStart(2,'0')}-${String(birthdayTarget.getDate()).padStart(2,'0')}`;

function updateCountdown() {
  const chosen = dateInput.value ? new Date(`${dateInput.value}T00:00:00`) : birthdayTarget;
  let diff = chosen.getTime() - Date.now();
  if (diff <= 0) {
    $('#countdownCaption').textContent = 'Today is your special day ♡';
    $('#days').textContent = '00'; $('#hours').textContent = '00'; $('#minutes').textContent = '00'; $('#seconds').textContent = '00';
    return;
  }
  $('#countdownCaption').textContent = 'Until your special day';
  const days = Math.floor(diff / 86400000); diff %= 86400000;
  const hours = Math.floor(diff / 3600000); diff %= 3600000;
  const minutes = Math.floor(diff / 60000); diff %= 60000;
  const seconds = Math.floor(diff / 1000);
  $('#days').textContent = String(days).padStart(2,'0');
  $('#hours').textContent = String(hours).padStart(2,'0');
  $('#minutes').textContent = String(minutes).padStart(2,'0');
  $('#seconds').textContent = String(seconds).padStart(2,'0');
}
dateInput.addEventListener('change', updateCountdown);
updateCountdown();
setInterval(updateCountdown, 1000);

// Optional soundtrack: place a royalty-free or personally owned music.mp3 next to index.html.
// Browsers generally require the visitor to tap Play before audio can start.
const audio = $('#birthdayAudio');
const musicToggle = $('#musicToggle');
musicToggle.addEventListener('click', async () => {
  if (audio.paused) {
    try {
      await audio.play();
      musicToggle.setAttribute('aria-pressed', 'true');
      $('#musicLabel').textContent = 'Pause soundtrack';
      toast('A little music for your moment ♫');
    } catch (e) {
      toast('Add your own music.mp3 beside index.html to play a song.');
    }
  } else {
    audio.pause();
    musicToggle.setAttribute('aria-pressed', 'false');
    $('#musicLabel').textContent = 'Play our soundtrack';
  }
});

// Photo memories: locally selected photos are displayed, not uploaded anywhere.
$('#photoUpload').addEventListener('change', (event) => {
  const files = [...event.target.files].filter(file => file.type.startsWith('image/')).slice(0, 6);
  if (!files.length) return;
  const grid = $('#photoGrid');
  grid.innerHTML = '';
  files.forEach((file, index) => {
    const card = document.createElement('div');
    card.className = `photo-card has-photo photo-${index + 1}`;
    const img = document.createElement('img');
    img.alt = `Memory ${index + 1}`;
    img.src = URL.createObjectURL(file);
    const caption = document.createElement('small');
    caption.textContent = ['a moment to keep ♡', 'my happy place ✦', 'you + me', 'the little things', 'one for the scrapbook', 'a day worth remembering'][index];
    card.append(img, caption);
    grid.appendChild(card);
  });
  if (event.target.files.length > 6) toast('Showing the first 6 photos ♡');
  else toast('Your memories are in place ♡');
});

// Candles can be tapped individually or blown out together.
let candlesBlown = 0;
$$('.candle').forEach(candle => candle.addEventListener('click', (event) => {
  event.stopPropagation();
  if (!candle.classList.contains('lit')) return;
  candle.classList.remove('lit');
  candlesBlown++;
  if (candlesBlown === 5) {
    $('#cakeInstruction').textContent = 'All the candles are out — make your biggest wish! ♡';
    burstConfetti(65);
    $('#cakeMessage').textContent = 'May every wish find its way to you, Annamee.';
  } else {
    $('#cakeInstruction').textContent = `${5 - candlesBlown} little flame${5-candlesBlown===1?'':'s'} left. Make a wish!`;
  }
}));
function blowAllCandles() {
  $$('.candle').forEach(c => c.classList.remove('lit'));
  candlesBlown = 5;
  $('#cakeInstruction').textContent = 'All the candles are out — make your biggest wish! ♡';
  $('#cakeMessage').textContent = 'May every wish find its way to you, Annamee.';
  burstConfetti(65);
}
$('#blowAll').addEventListener('click', blowAllCandles);
$('#cutCake').addEventListener('click', () => {
  $('#cake').classList.add('cut');
  $('#cakeMessage').textContent = 'A sweet slice for the sweetest soul. Happy birthday, Annamee! ♡';
  $('#cakeInstruction').textContent = 'Cake officially served with extra love.';
  burstConfetti(45);
});

// Love letter unfolds with a gentle envelope animation.
$('#openLetter').addEventListener('click', () => {
  const wrap = $('#letterWrap');
  const isOpen = wrap.classList.toggle('open');
  $('#openLetter').innerHTML = isOpen ? 'Fold your letter <span>♡</span>' : 'Open your letter <span>♡</span>';
  $('#letterHint').textContent = isOpen ? 'Keep this close for a day when you need a reminder.' : 'Tap the button to unfold your letter.';
  if (isOpen) {
    setTimeout(() => $('#letterPaper').scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
    burstConfetti(24);
  }
});

// Confetti burst. No libraries needed.
function burstConfetti(count = 55) {
  const layer = $('#confettiLayer');
  const colors = ['#f47769', '#f7b27d', '#e6c98f', '#d87887', '#fff0d7', '#c69a5d'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.4 + Math.random() * 2.2}s`;
    piece.style.animationDelay = `${Math.random() * .45}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    piece.style.width = `${5 + Math.random() * 6}px`;
    piece.style.height = `${8 + Math.random() * 9}px`;
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 5200);
  }
}
$('#celebrateButton').addEventListener('click', () => {
  burstConfetti(120);
  toast('A million tiny wishes for you, Annamee. ♡');
});

// Clicking the hero gift scrolls the visitor into the experience.
$('.gift-wrap').addEventListener('click', () => {
  burstConfetti(30);
  $('#surprise').scrollIntoView({ behavior: 'smooth' });
  toast('Surprise, birthday girl! 🎂');
});
