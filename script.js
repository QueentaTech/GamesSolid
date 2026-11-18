const textDisplay = document.getElementById('text-to-type');
const inputArea = document.getElementById('inputArea');
const startButton = document.getElementById('Start-button');
const timerDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('word-per-minute');
const accuracyDisplay = document.getElementById('accuracy');
const scoreDisplay = document.getElementById('score');
const comboDisplay = document.getElementById('combo');
const ratingDisplay = document.getElementById('rating');
const challengeNumberDisplay = document.getElementById('challenge-number');
const progressBar = document.getElementById('progress-bar');

const challenges = [
    'Kucing oren itu tidur nyenyak di atas tumpukan buku.',
    'Jangan lupa membawa botol minum saat pergi berpetualang.',
    'Langit sore berwarna jingga seperti lukisan yang indah.',
    'Robot kecil itu menari mengikuti irama musik ceria.',
    'Semangkuk bakso hangat selalu cocok dinikmati saat hujan.',
    'Seekor kupu-kupu hinggap di bunga berwarna ungu.',
    'Ayo kejar mimpi dan jangan takut mencoba hal baru!',
    'Pesawat kertas itu terbang jauh melewati jendela.',
    'Rina menemukan harta karun di balik pohon mangga.',
    'Bintang-bintang bersinar terang menemani malam ini.'
];

const testDuration = 60;
let currentChallenge = '';
let lastChallenge = '';
let timeLeft = testDuration;
let timerInterval = null;
let testStarted = false;
let challengeNumber = 1;
let score = 0;
let combo = 0;
let completedCharacters = 0;
let completedTypedCharacters = 0;
let startTime = 0;

function chooseChallenge() {
    const options = challenges.filter((challenge) => challenge !== lastChallenge);
    currentChallenge = options[Math.floor(Math.random() * options.length)];
    lastChallenge = currentChallenge;
    renderChallenge();
}

function renderChallenge() {
    const typedText = inputArea.value;
    textDisplay.replaceChildren();

    for (let i = 0; i < currentChallenge.length; i++) {
        const character = document.createElement('span');
        character.textContent = currentChallenge[i];
        if (i < typedText.length) {
            character.className = typedText[i] === currentChallenge[i] ? 'correct' : 'incorrect';
        } else {
            character.className = 'pending';
        }
        textDisplay.appendChild(character);
    }

    progressBar.style.width = `${Math.min(100, (typedText.length / currentChallenge.length) * 100)}%`;
}

function updateStats() {
    const typedText = inputArea.value;
    let correctCharacters = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentChallenge[i]) correctCharacters++;
    }

    const totalTyped = completedTypedCharacters + typedText.length;
    const totalCorrect = completedCharacters + correctCharacters;
    const elapsedMinutes = Math.max((Date.now() - startTime) / 60000, 1 / 60000);
    wpmDisplay.textContent = Math.round((totalCorrect / 5) / elapsedMinutes);
    accuracyDisplay.textContent = totalTyped ? Math.round((totalCorrect / totalTyped) * 100) : 100;
    renderChallenge();

    if (typedText === currentChallenge) completeChallenge();
}

function completeChallenge() {
    completedCharacters += currentChallenge.length;
    completedTypedCharacters += currentChallenge.length;
    combo++;
    score += 100 + Math.min(combo * 10, 100);
    scoreDisplay.textContent = score;
    comboDisplay.textContent = combo;
    challengeNumber++;
    challengeNumberDisplay.textContent = challengeNumber;
    ratingDisplay.textContent = combo > 1
        ? `Mantap! ${combo} combo berturut-turut. Lanjutkan! 🔥`
        : 'Tantangan selesai! Lanjut ke kalimat berikutnya 🚀';
    inputArea.value = '';
    chooseChallenge();
    updateStats();
}

function endTest() {
    clearInterval(timerInterval);
    timerInterval = null;
    testStarted = false;
    inputArea.disabled = true;
    startButton.innerHTML = 'Main Lagi <span>↻</span>';
    ratingDisplay.textContent = `Waktu habis! Skor akhir kamu ${score}. Hebat, coba pecahkan rekor! 🎉`;
}

function startTest() {
    if (testStarted) return;

    clearInterval(timerInterval);
    timeLeft = testDuration;
    challengeNumber = 1;
    score = 0;
    combo = 0;
    completedCharacters = 0;
    completedTypedCharacters = 0;
    lastChallenge = '';
    testStarted = true;
    startTime = Date.now();

    timerDisplay.textContent = timeLeft;
    scoreDisplay.textContent = '0';
    comboDisplay.textContent = '0';
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100';
    challengeNumberDisplay.textContent = challengeNumber;
    inputArea.value = '';
    inputArea.disabled = false;
    startButton.innerHTML = 'Mulai Ulang <span>↻</span>';
    ratingDisplay.textContent = 'Ketik secepat dan setepat mungkin!';
    chooseChallenge();
    inputArea.focus();

    timerInterval = setInterval(() => {
        timeLeft = Math.max(0, testDuration - Math.floor((Date.now() - startTime) / 1000));
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) endTest();
    }, 250);
}

inputArea.addEventListener('input', () => {
    if (!testStarted) return;
    updateStats();
});

startButton.addEventListener('click', () => {
    if (testStarted) {
        startTest();
    } else {
        startTest();
    }
});

chooseChallenge();
