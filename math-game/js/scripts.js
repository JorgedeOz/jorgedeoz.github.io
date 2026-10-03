let num1, num2, correctAnswer;
let attempts = 0;
let points = 0;
let correctAnswers = 0;
let currentQuestion = 0;
let totalQuestions = 10;
let totalRounds = 0;
let cumulativePoints = 0;
let selectedTables = [];
let askedQuestions = new Set();
let roundHistory = [];
let questionLog = [];
let currentPlayer = "";
let difficultyLevel = 1;
let questionTimeLimit = 30;
let timeRemaining = 0;
let questionTimerId = null;
let questionActive = false;
let gameInProgress = false;
let setupStep = 1;
let previousSetupStep = 1;
let postRoundMode = false;
let audioCtx = null;
let audioUnlocked = false;
let currentLanguage = "en";
const HIGH_SCORE_KEY = "mathGameSessionHighScores";
let sessionHighScores = loadHighScores();
let playerRoundHistory = {};
let playerTableStats = {};
let playerCumulativePoints = {};

// Track progress per table (active player's stats object)
let tableStats = createEmptyTableStats();

const i18n = {
    en: {
    appTitle: "🎉 Fun Math Tables Game 🎉",
    playerNameLabel: "Player name:",
    playerNamePlaceholder: "Enter player name",
    difficultyLabel: "Difficulty:",
    difficulty1: "Easy",
    difficulty2: "Medium",
    difficulty3: "Hard",
    difficulty4: "Hardest",
    difficulty5: "Ultimate",
    difficulty6: "Practice",
    setupStepOneTitle: "Step 1: Player Details",
    setupStepTwoTitle: "Step 2: Choose Tables",
    setupProgressText: "Step {current} of {total}",
    languageLabel: "Language:",
    chooseTablesLabel: "Choose table(s):",
    nextSetupBtn: "➡️ Next",
    backSetupBtn: "⬅️ Back",
    selectAllTablesBtn: "Select All",
    clearAllTablesBtn: "Clear All",
    startGameBtn: "🚀 Start Game",
    clearSetupBtn: "🧹 Clear Setup",
    resetGameBtn: "🔁 Reset Game",
    newGameFromSummaryBtn: "🚀 New Game",
    resetToStep1Btn: "🔁 Reset Game",
    endSessionBtn: "🛑 End Session",
    viewTablesBtn: "📘 View Tables",
    submitAnswerBtn: "✅ Submit",
    restartRoundBtn: "🔄 Restart Round",
    answerPlaceholder: "Type answer here",
    allTablesBtn: "All Tables",
    closeModalBtn: "Close",
    modalTableTitle: "Table",
    sessionSummaryTitle: "🧾 Session Summary",
    highScoresTitle: "🥇 Session High Scores",
    roundSummaryTitle: "🏆 Round Summary",
    progressTitle: "📊 Progress Tracker",
    highScoreViewLabel: "View:",
    highScoreOptionAll: "All Players",
    highScoreOptionCurrent: "Current Player",
    clearHighScoresBtn: "Clear High Scores",
    playerNotSet: "Player: Not set",
    playerStatus: "Player: {name}",
    timerIdle: "⏱️ Time: --",
    timerActive: "⏱️ Time: {seconds}s",
    requiredTables: "Required tables: {min}{extra}",
    warningEnterName: "⚠️ Enter player name to start",
    autoAssignedPlayerName: "✨ No name entered. Using: {name}",
    warningSelectTable: "⚠️ Select at least one table",
    warningMinTables: "⚠️ Select at least {min} table(s) for this difficulty",
    warningMaxTables: "⚠️ You can select up to {max} table(s) for this difficulty",
    warningOnlyEasyTable: "⚠️ Easy allows only 1 table",
    warningDifficultyMax: "⚠️ This difficulty allows up to {max} tables",
    warningEnterNumber: "⚠️ Please enter a number",
    timeUp: "⏰ Time up! The answer was {answer}",
    noAnswer: "No answer",
    feedbackCorrect: "😀 Correct!",
    feedbackTryAgain: "❌ Try again ({left} left)",
    feedbackWrongAnswer: "😢 The answer was {answer}",
    scoreStatus: "⭐ Score: {points}/{available}",
    questionStatus: "📖 Question {current} of {total}",
    endSessionConfirm: "End session now? Current question progress will be lost.",
    endSessionMessage: "🏁 Session ended. Summary is shown below.",
    clearSetupConfirm: "Clear setup and stop current game?",
    setupCleared: "🧹 Setup cleared. Enter player name and choose tables.",
    tableOf: "Table of {n}",
    tablesList: "Tables: {list}",
    modalAllTablesTitle: "All Tables (1-10)",
    modalSelectedTablesTitle: "Selected Tables",
    noRounds: "No rounds completed yet. Start a game to see your results!",
    resultCorrect: "Correct",
    resultWrong: "Wrong",
    roundWord: "Round",
    labelPlayer: "Player",
    labelDifficulty: "Difficulty",
    labelDifficulties: "Difficulties",
    labelTable: "Table",
    labelScore: "Score",
    labelCorrect: "Correct",
    labelAvgAccuracy: "Avg Accuracy",
    headerQuestion: "Question",
    headerYourAnswer: "Your Answer",
    headerCorrectAnswer: "Correct Answer",
    headerAttempts: "Attempts",
    headerPoints: "Points",
    headerResult: "Result",
    progressLabel: "Table of {n}: {correct}/{total} correct ({accuracy}%)",
    sessionNone: "No completed rounds in this session yet.",
    latestRoundTitle: "Latest Round Result",
    cumulativePointsLabel: "Cumulative Points",
    sessionPlayers: "Players",
    sessionRounds: "Total Rounds",
    sessionPoints: "Total Points",
    sessionBest: "Best Round",
    sessionBestWithPoints: "{player} ({earned}/{max} pts)",
    notAvailable: "N/A",
    unknownDifficulty: "?",
    sessionHeaders: ["Player", "Rounds", "Earned/Max Points", "Avg Accuracy", "Difficulties"],
    highScoreNoneForPlayer: "No high scores yet for {player}.",
    highScoreNeedPlayer: "Enter/select a player name to view player scores.",
    highScoreNone: "No high scores yet. Finish a round to add one.",
    highScoreHeaders: ["#", "Player", "Points", "Accuracy", "Difficulty", "Time"],
    alertPickPlayer: "Enter/select a player name first.",
    confirmClearPlayerScores: "Clear session high scores for {player}?",
    confirmClearAllScores: "Clear all session high scores?",
    selectFirstTables: "ℹ️ Selected first {max} table(s) for this difficulty"
    },
    es: {
    appTitle: "🎉 Juego Divertido de Tablas 🎉",
    playerNameLabel: "Nombre jugador:",
    playerNamePlaceholder: "Ingresa nombre del jugador",
    difficultyLabel: "Dificultad:",
    difficulty1: "Facil",
    difficulty2: "Media",
    difficulty3: "Dificil",
    difficulty4: "Muy dificil",
    difficulty5: "Extrema",
    difficulty6: "Practica",
    setupStepOneTitle: "Paso 1: Datos del jugador",
    setupStepTwoTitle: "Paso 2: Elige tablas",
    setupProgressText: "Paso {current} de {total}",
    languageLabel: "Idioma:",
    chooseTablesLabel: "Elige tabla(s):",
    nextSetupBtn: "➡️ Siguiente",
    backSetupBtn: "⬅️ Atras",
    selectAllTablesBtn: "Seleccionar todo",
    clearAllTablesBtn: "Limpiar todo",
    startGameBtn: "🚀 Iniciar juego",
    clearSetupBtn: "🧹 Limpiar configuracion",
    resetGameBtn: "🔁 Reiniciar juego",
    newGameFromSummaryBtn: "🚀 Nuevo juego",
    resetToStep1Btn: "🔁 Reiniciar juego",
    endSessionBtn: "🛑 Terminar sesion",
    viewTablesBtn: "📘 Ver tablas",
    submitAnswerBtn: "✅ Enviar",
    restartRoundBtn: "🔄 Reiniciar ronda",
    answerPlaceholder: "Escribe tu respuesta",
    allTablesBtn: "Todas las tablas",
    closeModalBtn: "Cerrar",
    modalTableTitle: "Tabla",
    sessionSummaryTitle: "🧾 Resumen de sesion",
    highScoresTitle: "🥇 Mejores puntajes de sesion",
    roundSummaryTitle: "🏆 Resumen de ronda",
    progressTitle: "📊 Seguimiento de progreso",
    highScoreViewLabel: "Ver:",
    highScoreOptionAll: "Todos los jugadores",
    highScoreOptionCurrent: "Jugador actual",
    clearHighScoresBtn: "Limpiar mejores puntajes",
    playerNotSet: "Jugador: Sin definir",
    playerStatus: "Jugador: {name}",
    timerIdle: "⏱️ Tiempo: --",
    timerActive: "⏱️ Tiempo: {seconds}s",
    requiredTables: "Tablas requeridas: {min}{extra}",
    warningEnterName: "⚠️ Ingresa nombre del jugador para iniciar",
    autoAssignedPlayerName: "✨ No se ingreso nombre. Se usara: {name}",
    warningSelectTable: "⚠️ Selecciona al menos una tabla",
    warningMinTables: "⚠️ Selecciona al menos {min} tabla(s) para esta dificultad",
    warningMaxTables: "⚠️ Puedes seleccionar hasta {max} tabla(s) para esta dificultad",
    warningOnlyEasyTable: "⚠️ Facil permite solo 1 tabla",
    warningDifficultyMax: "⚠️ Esta dificultad permite hasta {max} tablas",
    warningEnterNumber: "⚠️ Por favor ingresa un numero",
    timeUp: "⏰ Tiempo agotado! La respuesta era {answer}",
    noAnswer: "Sin respuesta",
    feedbackCorrect: "😀 Correcto!",
    feedbackTryAgain: "❌ Intenta de nuevo ({left} restante)",
    feedbackWrongAnswer: "😢 La respuesta era {answer}",
    scoreStatus: "⭐ Puntaje: {points}/{available}",
    questionStatus: "📖 Pregunta {current} de {total}",
    endSessionConfirm: "Terminar la sesion ahora? Se perdera el progreso de la pregunta actual.",
    endSessionMessage: "🏁 Sesion terminada. El resumen se muestra abajo.",
    clearSetupConfirm: "Limpiar configuracion y detener el juego actual?",
    setupCleared: "🧹 Configuracion limpiada. Ingresa nombre y elige tablas.",
    tableOf: "Tabla del {n}",
    tablesList: "Tablas: {list}",
    modalAllTablesTitle: "Todas las tablas (1-10)",
    modalSelectedTablesTitle: "Tablas seleccionadas",
    noRounds: "Aun no hay rondas completadas. Inicia un juego para ver resultados!",
    resultCorrect: "Correcto",
    resultWrong: "Incorrecto",
    roundWord: "Ronda",
    labelPlayer: "Jugador",
    labelDifficulty: "Dificultad",
    labelDifficulties: "Dificultades",
    labelTable: "Tabla",
    labelScore: "Puntaje",
    labelCorrect: "Correctas",
    labelAvgAccuracy: "Precision promedio",
    headerQuestion: "Pregunta",
    headerYourAnswer: "Tu respuesta",
    headerCorrectAnswer: "Respuesta correcta",
    headerAttempts: "Intentos",
    headerPoints: "Puntos",
    headerResult: "Resultado",
    progressLabel: "Tabla del {n}: {correct}/{total} correctas ({accuracy}%)",
    sessionNone: "No hay rondas completadas en esta sesion.",
    latestRoundTitle: "Resultado de la ultima ronda",
    cumulativePointsLabel: "Puntos acumulados",
    sessionPlayers: "Jugadores",
    sessionRounds: "Rondas totales",
    sessionPoints: "Puntos totales",
    sessionBest: "Mejor ronda",
    sessionBestWithPoints: "{player} ({earned}/{max} pts)",
    notAvailable: "N/A",
    unknownDifficulty: "?",
    sessionHeaders: ["Jugador", "Rondas", "Puntos obtenidos/max", "Precision promedio", "Dificultades"],
    highScoreNoneForPlayer: "Aun no hay mejores puntajes para {player}.",
    highScoreNeedPlayer: "Ingresa/selecciona un jugador para ver sus puntajes.",
    highScoreNone: "Aun no hay mejores puntajes. Termina una ronda para agregar uno.",
    highScoreHeaders: ["#", "Jugador", "Puntos", "Precision", "Dificultad", "Hora"],
    alertPickPlayer: "Ingresa/selecciona primero un jugador.",
    confirmClearPlayerScores: "Limpiar mejores puntajes de sesion para {player}?",
    confirmClearAllScores: "Limpiar todos los mejores puntajes de sesion?",
    selectFirstTables: "ℹ️ Se seleccionaron las primeras {max} tabla(s) para esta dificultad"
    }
};

function tr(key, vars = {}) {
    const langPack = i18n[currentLanguage] || i18n.en;
    const fallback = i18n.en[key];
    const value = langPack[key] ?? fallback ?? key;
    if (typeof value !== "string") {
    return value;
    }
    return value.replace(/\{(\w+)\}/g, (_, token) => {
    return Object.prototype.hasOwnProperty.call(vars, token) ? vars[token] : `{${token}}`;
    });
}

function applyStaticTranslations() {
    document.getElementById("appTitle").textContent = tr("appTitle");
    document.getElementById("playerNameLabel").textContent = tr("playerNameLabel");
    document.getElementById("playerName").placeholder = tr("playerNamePlaceholder");
    document.getElementById("difficultyLabel").textContent = tr("difficultyLabel");
    document.getElementById("difficultyOption1").textContent = tr("difficulty1");
    document.getElementById("difficultyOption2").textContent = tr("difficulty2");
    document.getElementById("difficultyOption3").textContent = tr("difficulty3");
    document.getElementById("difficultyOption4").textContent = tr("difficulty4");
    document.getElementById("difficultyOption5").textContent = tr("difficulty5");
    document.getElementById("difficultyOption6").textContent = tr("difficulty6");
    document.getElementById("setupStepOneTitle").textContent = tr("setupStepOneTitle");
    document.getElementById("setupStepTwoTitle").textContent = tr("setupStepTwoTitle");
    document.getElementById("languageLabel").textContent = tr("languageLabel");
    document.getElementById("chooseTablesLabel").textContent = tr("chooseTablesLabel");
    document.getElementById("nextSetupBtn").textContent = tr("nextSetupBtn");
    document.getElementById("backSetupBtn").textContent = tr("backSetupBtn");
    document.getElementById("selectAllTablesBtn").textContent = tr("selectAllTablesBtn");
    document.getElementById("clearAllTablesBtn").textContent = tr("clearAllTablesBtn");
    document.getElementById("startGameBtn").textContent = tr("startGameBtn");
    document.getElementById("clearSetupBtn").textContent = tr("clearSetupBtn");
    document.getElementById("resetGameBtn").textContent = tr("resetGameBtn");
    document.getElementById("newGameFromSummaryBtn").textContent = tr("newGameFromSummaryBtn");
    document.getElementById("resetToStep1Btn").textContent = tr("resetToStep1Btn");
    document.getElementById("endSessionBtn").textContent = tr("endSessionBtn");
    document.getElementById("viewTable").textContent = tr("viewTablesBtn");
    document.getElementById("submitAnswer").textContent = tr("submitAnswerBtn");
    document.getElementById("restart").textContent = tr("restartRoundBtn");
    document.getElementById("answer").placeholder = tr("answerPlaceholder");
    document.getElementById("allTablesBtn").textContent = tr("allTablesBtn");
    document.getElementById("closeModalBtn").textContent = tr("closeModalBtn");
    document.getElementById("tableModalTitle").textContent = tr("modalTableTitle");
    document.getElementById("sessionSummaryTitle").textContent = tr("sessionSummaryTitle");
    document.getElementById("highScoresTitle").textContent = tr("highScoresTitle");
    document.getElementById("highScoreViewLabel").textContent = tr("highScoreViewLabel");
    document.getElementById("highScoreOptionAll").textContent = tr("highScoreOptionAll");
    document.getElementById("highScoreOptionCurrent").textContent = tr("highScoreOptionCurrent");
    document.getElementById("clearHighScoresBtn").textContent = tr("clearHighScoresBtn");
    document.getElementById("roundSummaryTitle").textContent = tr("roundSummaryTitle");
    document.getElementById("progressTitle").textContent = tr("progressTitle");
    updateSetupProgress();

    for (let i = 1; i <= 10; i++) {
    const label = document.getElementById(`tableOptionLabel${i}`);
    if (label) {
        label.textContent = tr("tableOf", { n: i });
    }
    }

    updatePlayerStatus(!currentPlayer);
    updateTimerDisplay();
}

function setLanguage(languageCode) {
    currentLanguage = languageCode === "es" ? "es" : "en";
    document.documentElement.lang = currentLanguage;
    applyStaticTranslations();
    updateDifficultyHint();
    updateStatus();
    updateRoundSummary();
    updateProgress();
    renderSessionSummary();
    renderHighScores();
}

function createEmptyTableStats() {
    const stats = {};
    for (let i = 1; i <= 10; i++) {
    stats[i] = { correct: 0, total: 0 };
    }
    return stats;
}

function ensurePlayerData(playerName) {
    if (!playerRoundHistory[playerName]) {
    playerRoundHistory[playerName] = [];
    }
    if (!playerTableStats[playerName]) {
    playerTableStats[playerName] = createEmptyTableStats();
    }
    if (typeof playerCumulativePoints[playerName] !== "number") {
    playerCumulativePoints[playerName] = 0;
    }
}

function setActivePlayer(playerName) {
    if (!playerName) {
    return;
    }
    ensurePlayerData(playerName);
    currentPlayer = playerName;
    roundHistory = playerRoundHistory[playerName];
    tableStats = playerTableStats[playerName];
    cumulativePoints = playerCumulativePoints[playerName];
    updatePlayerStatus();
}

function toggleResultsPanels(show) {
    document.getElementById("resultsPanels").style.display = show ? "flex" : "none";
}

function updateViewTableVisibility() {
    const level = getActiveDifficultyLevel();
    const hideViewTable = level === 3 || level === 5;
    const shouldShow = !gameInProgress && setupStep === 2 && !hideViewTable;
    document.getElementById("viewTable").style.display = shouldShow ? "inline-block" : "none";
}

function updateSetupStepUI() {
    const showSetup = !gameInProgress;
    const stepOne = document.getElementById("setupStepOne");
    const stepTwo = document.getElementById("setupStepTwo");
    const setupActions = document.getElementById("setupActions");
    const showSetupPanels = showSetup && !postRoundMode;

    document.getElementById("tableSelector").style.display = showSetupPanels ? "block" : "none";
    setupActions.style.display = showSetupPanels ? "inline-flex" : "none";

    if (!showSetupPanels) {
    return;
    }

    stepOne.style.display = setupStep === 1 ? "block" : "none";
    stepTwo.style.display = setupStep === 2 ? "block" : "none";

    if (setupStep !== previousSetupStep) {
    animateSetupStep(setupStep === 1 ? stepOne : stepTwo, setupStep > previousSetupStep ? "forward" : "back");
    }

    document.getElementById("nextSetupBtn").style.display = setupStep === 1 ? "inline-block" : "none";
    document.getElementById("backSetupBtn").style.display = setupStep === 2 ? "inline-block" : "none";
    document.getElementById("startGameBtn").style.display = setupStep === 2 ? "inline-block" : "none";
    updateSetupProgress();
    updateViewTableVisibility();
    previousSetupStep = setupStep;
}

function updateSetupProgress() {
    const progressText = document.getElementById("setupProgressText");
    const dot1 = document.getElementById("setupProgressDot1");
    const dot2 = document.getElementById("setupProgressDot2");
    const progressWrap = document.getElementById("setupProgress");
    const showSetup = !gameInProgress && !postRoundMode;

    if (progressWrap) {
    progressWrap.style.display = showSetup ? "flex" : "none";
    }
    if (!progressText || !dot1 || !dot2) {
    return;
    }

    progressText.textContent = tr("setupProgressText", { current: setupStep, total: 2 });
    dot1.classList.toggle("active", setupStep === 1);
    dot2.classList.toggle("active", setupStep === 2);
}

function animateSetupStep(stepElement, direction) {
    if (!stepElement) {
    return;
    }
    stepElement.classList.remove("setup-step-anim-forward", "setup-step-anim-back");
    void stepElement.offsetWidth;
    stepElement.classList.add(direction === "back" ? "setup-step-anim-back" : "setup-step-anim-forward");
}

function goToTableStep() {
    setupStep = 2;
    updateSetupStepUI();
}

function goToPlayerStep() {
    setupStep = 1;
    updateSetupStepUI();
}

function updateActionButtons() {
    const hasCompletedRounds = Array.isArray(roundHistory) && roundHistory.length > 0;
    const showPostRoundActions = postRoundMode && hasCompletedRounds;
    document.getElementById("clearSetupBtn").style.display = showPostRoundActions ? "inline-block" : "none";
    document.getElementById("resetGameBtn").style.display = showPostRoundActions ? "inline-block" : "none";
    document.getElementById("gameControlActions").style.display = (showPostRoundActions || gameInProgress) ? "inline-flex" : "none";
    document.getElementById("endRoundActions").style.display = postRoundMode ? "inline-flex" : "none";
    updateSetupStepUI();
    updateViewTableVisibility();
}

function resetToStepOne() {
    postRoundMode = false;
    resetGame();
    const playerNameInput = document.getElementById("playerName");
    if (playerNameInput) {
    playerNameInput.focus();
    }
}

function startNewGameFromResults() {
    postRoundMode = false;
    gameInProgress = false;
    questionActive = false;
    clearQuestionTimer();
    setupStep = 2;
    updateSetupStepUI();
    updateActionButtons();
    updateGameInfoVisibility();
    updateTimerDisplay();
    toggleResultsPanels(false);
    document.getElementById("question").textContent = "";
    document.getElementById("answer").style.display = "none";
    document.getElementById("submitAnswer").style.display = "none";
    document.getElementById("restart").style.display = "none";
    const difficultySelect = document.getElementById("difficultyLevel");
    if (difficultySelect) {
    difficultySelect.focus();
    }
}

function updateGameInfoVisibility() {
    const showGameInfo = gameInProgress;
    document.getElementById("playerStatus").style.display = showGameInfo ? "block" : "none";
    document.getElementById("round").style.display = showGameInfo ? "block" : "none";
    document.getElementById("score").style.display = showGameInfo ? "block" : "none";
    document.getElementById("timer").style.display = showGameInfo ? "block" : "none";
}

function getDifficultySeconds(level) {
    if (level === 2) {
    return 20;
    }
    if (level === 3) {
    return 10;
    }
    if (level === 4) {
    return 5;
    }
    if (level === 5) {
    return 5;
    }
    if (level === 6) {
    return 60;
    }
    return 30;
}

function getTableSelectionLimit(level) {
    if (level === 1) {
    return 1;
    }
    if (level === 2) {
    return 3;
    }
    if (level === 3) {
    return 5;
    }
    if (level === 4) {
    return 7;
    }
    if (level === 5) {
    return 10;
    }
    if (level === 6) {
    return 10;
    }
    return 10;
}

function getMinimumTableSelection(level) {
    if (level === 1) {
    return 1;
    }
    if (level === 2) {
    return 1;
    }
    if (level === 3) {
    return 3;
    }
    if (level === 4) {
    return 5;
    }
    if (level === 5) {
    return 10;
    }
    if (level === 6) {
    return 1;
    }
    return 10;
}

function updateDifficultyHint() {
    const level = getActiveDifficultyLevel();
    const minTables = getMinimumTableSelection(level);
    const maxTables = getTableSelectionLimit(level);
    const extra = minTables !== maxTables ? `-${maxTables}` : "";
    document.getElementById("difficultyHint").textContent = tr("requiredTables", { min: minTables, extra: extra });
}

function getActiveDifficultyLevel() {
    return parseInt(document.getElementById("difficultyLevel").value, 10) || 1;
}

function getDifficultyLabel(level) {
    const normalizedLevel = Number(level);
    if (normalizedLevel >= 1 && normalizedLevel <= 6) {
    return tr(`difficulty${normalizedLevel}`);
    }
    return tr("unknownDifficulty");
}

function generateFriendlyPlayerName() {
    const prefixes = [
    "Happy", "Bright", "Super", "Clever", "Brave", "Sunny", "Rapid", "Kind", "Lucky", "Mighty"
    ];
    const suffixes = [
    "Panda", "Tiger", "Dolphin", "Falcon", "Koala", "Lion", "Otter", "Fox", "Eagle", "Bear"
    ];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const randomNumber = Math.floor(Math.random() * 90) + 10;
    return `${randomPrefix} ${randomSuffix} ${randomNumber}`;
}

function enforceTableSelectionLimit(changedOption = null) {
    const currentLevel = getActiveDifficultyLevel();
    const maxTables = getTableSelectionLimit(currentLevel);
    const selectedOptions = Array.from(document.querySelectorAll(".table-option:checked"));

    if (selectedOptions.length <= maxTables) {
    return true;
    }

    if (changedOption && changedOption.checked) {
    changedOption.checked = false;
    } else {
    while (selectedOptions.length > maxTables) {
        const removed = selectedOptions.pop();
        removed.checked = false;
    }
    }

    document.getElementById("feedback").textContent =
    currentLevel === 1 ? tr("warningOnlyEasyTable") : tr("warningDifficultyMax", { max: maxTables });
    return false;
}

function updateTimerDisplay() {
    if (!questionActive) {
    document.getElementById("timer").textContent = tr("timerIdle");
    return;
    }
    document.getElementById("timer").textContent = tr("timerActive", { seconds: timeRemaining });
}

function getAudioContext() {
    if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return null;
    }
    audioCtx = new AudioContextClass();
    }
    return audioCtx;
}

function unlockAudioContext() {
    const ctx = getAudioContext();
    if (!ctx || audioUnlocked) {
    return;
    }

    const primeIfRunning = () => {
    if (!ctx || ctx.state !== "running" || audioUnlocked) {
        return;
    }
    audioUnlocked = true;

    // Prime iOS Safari audio pipeline with an inaudible tone.
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.02);
    };

    if (ctx.state === "running") {
    primeIfRunning();
    return;
    }

    ctx.resume().then(primeIfRunning).catch(() => {
    // Resume can fail when not triggered by a trusted user gesture.
    });
}

function registerAudioUnlockHandlers() {
    const events = ["touchstart", "pointerdown", "keydown"];
    const onFirstGesture = () => {
    unlockAudioContext();
    if (!audioUnlocked) {
        return;
    }
    events.forEach((eventName) => {
        window.removeEventListener(eventName, onFirstGesture);
    });
    };

    events.forEach((eventName) => {
    window.addEventListener(eventName, onFirstGesture, { passive: true });
    });
}

function playTone(ctx, frequency, startOffset, duration, type, gainValue) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const startTime = ctx.currentTime + startOffset;
    const endTime = startTime + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(gainValue, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime + 0.02);
}

function playSound(kind) {
    const ctx = getAudioContext();
    if (!ctx) {
    return;
    }
    if (ctx.state !== "running") {
    return;
    }

    if (kind === "success") {
    playTone(ctx, 660, 0, 0.12, "sine", 0.09);
    playTone(ctx, 880, 0.13, 0.14, "sine", 0.1);
    return;
    }

    if (kind === "wrong") {
    playTone(ctx, 240, 0, 0.2, "triangle", 0.08);
    return;
    }

    if (kind === "failed") {
    playTone(ctx, 320, 0, 0.12, "sawtooth", 0.09);
    playTone(ctx, 250, 0.12, 0.12, "sawtooth", 0.085);
    playTone(ctx, 180, 0.24, 0.16, "sawtooth", 0.08);
    return;
    }

    if (kind === "roundComplete") {
    playTone(ctx, 523, 0, 0.12, "sine", 0.1);
    playTone(ctx, 659, 0.12, 0.12, "sine", 0.1);
    playTone(ctx, 784, 0.24, 0.16, "sine", 0.11);
    return;
    }

    if (kind === "tick") {
    playTone(ctx, 980, 0, 0.035, "square", 0.04);
    }
}

function clearQuestionTimer() {
    if (questionTimerId) {
    clearInterval(questionTimerId);
    questionTimerId = null;
    }
}

function startQuestionTimer() {
    clearQuestionTimer();
    timeRemaining = questionTimeLimit;
    updateTimerDisplay();

    questionTimerId = setInterval(() => {
    if (!questionActive) {
        clearQuestionTimer();
        return;
    }
    timeRemaining--;
    updateTimerDisplay();
    if (timeRemaining > 0) {
        playSound("tick");
    }
    if (timeRemaining <= 0) {
        handleTimeUp();
    }
    }, 1000);
}

function handleTimeUp() {
    if (!questionActive) {
    return;
    }
    questionActive = false;
    clearQuestionTimer();
    playSound("failed");
    document.getElementById("feedback").textContent = tr("timeUp", { answer: correctAnswer });

    tableStats[num1].total++;
    questionLog.push({
    prompt: `${num1} × ${num2}`,
    userAnswer: tr("noAnswer"),
    correctAnswer: correctAnswer,
    isCorrect: false,
    attempts: attempts,
    earnedPoints: 0
    });

    updateStatus();
    updateProgress();
    setTimeout(newQuestion, 1200);
}

function startGame() {
    postRoundMode = false;
    const playerInput = document.getElementById("playerName");
    let playerName = playerInput.value.trim();
    if (!playerName) {
    playerName = generateFriendlyPlayerName();
    playerInput.value = playerName;
    document.getElementById("feedback").textContent = tr("autoAssignedPlayerName", { name: playerName });
    }

    setActivePlayer(playerName);
    unlockAudioContext();
    difficultyLevel = parseInt(document.getElementById("difficultyLevel").value, 10) || 1;
    questionTimeLimit = getDifficultySeconds(difficultyLevel);
    selectedTables = getSelectedTables();
    const maxTables = getTableSelectionLimit(difficultyLevel);
    const minTables = getMinimumTableSelection(difficultyLevel);
    if (selectedTables.length === 0) {
    document.getElementById("feedback").textContent = tr("warningSelectTable");
    return;
    }
    if (selectedTables.length < minTables) {
    document.getElementById("feedback").textContent = tr("warningMinTables", { min: minTables });
    return;
    }
    if (selectedTables.length > maxTables) {
    document.getElementById("feedback").textContent = tr("warningMaxTables", { max: maxTables });
    return;
    }
    totalQuestions = selectedTables.length * 10;
    gameInProgress = true;
    points = 0;
    correctAnswers = 0;
    currentQuestion = 0;
    askedQuestions.clear();
    questionLog = [];
    updateSetupStepUI();
    document.getElementById("endSessionBtn").style.display = "inline-block";
    document.getElementById("restart").style.display = "none";
    updateActionButtons();
    updateGameInfoVisibility();
    toggleResultsPanels(false);
    document.getElementById("answer").style.display = "block";
    document.getElementById("submitAnswer").style.display = "block";
    newQuestion();
}

function newQuestion() {
    if (currentQuestion >= totalQuestions) {
    endRound();
    return;
    }
    
    // Generate unique question not asked in this round
    let questionKey;
    let maxAttempts = 100;
    let attemptCount = 0;
    
    do {
    num1 = selectedTables[Math.floor(Math.random() * selectedTables.length)];
    num2 = Math.floor(Math.random() * 10) + 1;
    questionKey = `${num1}x${num2}`;
    attemptCount++;
    } while (askedQuestions.has(questionKey) && attemptCount < maxAttempts);
    
    askedQuestions.add(questionKey);
    correctAnswer = num1 * num2;
    attempts = 0;
    questionActive = true;
    currentQuestion++;
    document.getElementById("question").textContent = `${num1} × ${num2} = ?`;
    document.getElementById("feedback").textContent = "";
    document.getElementById("answer").value = "";
    document.getElementById("answer").focus();
    startQuestionTimer();
    updateStatus();
}

function checkAnswer() {
    if (!questionActive) {
    return;
    }
    const userAnswer = parseInt(document.getElementById("answer").value);
    if (Number.isNaN(userAnswer)) {
    document.getElementById("feedback").textContent = tr("warningEnterNumber");
    return;
    }
    tableStats[num1].total++;

    if (userAnswer === correctAnswer) {
    questionActive = false;
    clearQuestionTimer();
    playSound("success");
    const earnedPoints = 3 - attempts;
    document.getElementById("feedback").textContent = tr("feedbackCorrect");
    questionLog.push({
        prompt: `${num1} × ${num2}`,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: true,
        attempts: attempts + 1,
        earnedPoints: earnedPoints
    });
    correctAnswers++;
    points += earnedPoints;
    tableStats[num1].correct++;
    setTimeout(newQuestion, 1000);
    } else {
    attempts++;
    if (attempts < 3) {
        playSound("wrong");
        document.getElementById("feedback").textContent = tr("feedbackTryAgain", { left: 3 - attempts });
        document.getElementById("answer").value = "";
        document.getElementById("answer").focus();
    } else {
        questionActive = false;
        clearQuestionTimer();
        playSound("failed");
        document.getElementById("feedback").textContent = tr("feedbackWrongAnswer", { answer: correctAnswer });
        questionLog.push({
        prompt: `${num1} × ${num2}`,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: false,
        attempts: attempts,
        earnedPoints: 0
        });
        setTimeout(newQuestion, 1500);
    }
    }
    updateStatus();
    updateProgress();
}

function updateStatus() {
    const pointsAvailable = currentQuestion * 3;
    document.getElementById("score").textContent = tr("scoreStatus", { points: points, available: pointsAvailable });
    document.getElementById("round").textContent = tr("questionStatus", { current: currentQuestion, total: totalQuestions });
}

function endRound() {
    totalRounds++;
    gameInProgress = false;
    questionActive = false;
    clearQuestionTimer();
    cumulativePoints += points;
    playerCumulativePoints[currentPlayer] = cumulativePoints;
    
    // Save round summary
    const roundData = {
    roundNumber: roundHistory.length + 1,
    player: currentPlayer,
    difficultyLevel: difficultyLevel,
    table: describeSelectedTables(selectedTables),
    points: points,
    pointsAvailable: totalQuestions * 3,
    correctAnswers: correctAnswers,
    totalQuestions: totalQuestions,
    percentage: Math.round((correctAnswers / totalQuestions) * 100),
    questionsAsked: Array.from(askedQuestions),
    questions: questionLog.slice()
    };
    roundHistory.push(roundData);
    updateHighScores(roundData);
    updateRoundSummary();
    renderSessionSummary();
    playSound("roundComplete");
    
    document.getElementById("question").textContent = "";
    document.getElementById("feedback").textContent = "";
    document.getElementById("score").textContent = "";
    document.getElementById("round").textContent = "";
    postRoundMode = true;
    setupStep = 2;
    updateSetupStepUI();
    document.getElementById("resetGameBtn").style.display = "inline-block";
    document.getElementById("endSessionBtn").style.display = "none";
    document.getElementById("restart").style.display = "inline-block";
    updateActionButtons();
    updateGameInfoVisibility();
    toggleResultsPanels(true);
    document.getElementById("answer").style.display = "none";
    document.getElementById("submitAnswer").style.display = "none";
    updateTimerDisplay();

    const resultsSection = document.getElementById("resultsPanels");
    if (resultsSection) {
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function endSession() {
    if (questionActive) {
    const confirmEnd = window.confirm(tr("endSessionConfirm"));
    if (!confirmEnd) {
        return;
    }
    }

    gameInProgress = false;
    questionActive = false;
    clearQuestionTimer();
    document.getElementById("question").textContent = "";
    document.getElementById("answer").style.display = "none";
    document.getElementById("submitAnswer").style.display = "none";
    document.getElementById("restart").style.display = "none";
    postRoundMode = true;
    setupStep = 2;
    updateSetupStepUI();
    document.getElementById("resetGameBtn").style.display = "none";
    document.getElementById("endSessionBtn").style.display = "none";
    document.getElementById("score").textContent = "";
    document.getElementById("round").textContent = "";
    updateActionButtons();
    updateGameInfoVisibility();
    updateTimerDisplay();

    renderSessionSummary();
    toggleResultsPanels(true);
    document.getElementById("feedback").textContent = tr("endSessionMessage");

    const resultsSection = document.getElementById("resultsPanels");
    if (resultsSection) {
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function restartGame() {
    gameInProgress = true;
    postRoundMode = false;
    questionActive = false;
    clearQuestionTimer();
    points = 0;
    correctAnswers = 0;
    currentQuestion = 0;
    askedQuestions.clear();
    questionLog = [];
    updateSetupStepUI();
    document.getElementById("restart").style.display = "none";
    document.getElementById("endSessionBtn").style.display = "inline-block";
    updateActionButtons();
    updateGameInfoVisibility();
    toggleResultsPanels(false);
    document.getElementById("answer").style.display = "block";
    document.getElementById("submitAnswer").style.display = "block";
    newQuestion();
}

function resetGame() {
    gameInProgress = false;
    postRoundMode = false;
    questionActive = false;
    clearQuestionTimer();
    points = 0;
    correctAnswers = 0;
    currentQuestion = 0;
    totalQuestions = 10;
    totalRounds = 0;
    cumulativePoints = 0;
    selectedTables = [];
    askedQuestions.clear();
    questionLog = [];
    roundHistory = [];
    if (currentPlayer) {
    playerRoundHistory[currentPlayer] = [];
    playerTableStats[currentPlayer] = createEmptyTableStats();
    playerCumulativePoints[currentPlayer] = 0;
    roundHistory = playerRoundHistory[currentPlayer];
    tableStats = playerTableStats[currentPlayer];
    } else {
    tableStats = createEmptyTableStats();
    }

    setupStep = 1;
    updateSetupStepUI();
    document.getElementById("resetGameBtn").style.display = "none";
    document.getElementById("endSessionBtn").style.display = "none";
    document.getElementById("restart").style.display = "none";
    updateActionButtons();
    updateGameInfoVisibility();
    toggleResultsPanels(false);
    document.getElementById("answer").style.display = "none";
    document.getElementById("submitAnswer").style.display = "none";
    document.getElementById("question").textContent = "";
    document.getElementById("feedback").textContent = "";
    document.getElementById("score").textContent = "";
    document.getElementById("round").textContent = "";
    updateTimerDisplay();
    updatePlayerStatus(true);

    document.querySelectorAll(".table-option").forEach((opt) => {
    opt.checked = false;
    });

    updateProgress();
    updateRoundSummary();
    renderSessionSummary();
    renderHighScores();
}

function clearSetup() {
    if (questionActive) {
    const confirmClear = window.confirm(tr("clearSetupConfirm"));
    if (!confirmClear) {
        return;
    }
    }

    resetGame();

    document.getElementById("playerName").value = "";
    document.getElementById("difficultyLevel").value = "1";
    document.querySelectorAll(".table-option").forEach((opt) => {
    opt.checked = false;
    });

    currentPlayer = "";
    roundHistory = [];
    tableStats = createEmptyTableStats();
    cumulativePoints = 0;

    const highScoreFilter = document.getElementById("highScoreFilter");
    if (highScoreFilter) {
    highScoreFilter.value = "all";
    }

    setupStep = 1;
    updateDifficultyHint();
    updateActionButtons();
    updateGameInfoVisibility();
    updatePlayerStatus(true);
    updateRoundSummary();
    updateProgress();
    renderHighScores();
    document.getElementById("feedback").textContent = tr("setupCleared");
    setTimeout(() => {
    document.getElementById("feedback").textContent = "";
    }, 2000);
}

function updateRoundSummary() {
    const summaryList = document.getElementById("summaryList");
    summaryList.innerHTML = "";
    
    // Display rounds in reverse order (newest first)
    for (let i = roundHistory.length - 1; i >= 0; i--) {
    const round = roundHistory[i];
    const roundDiv = document.createElement("div");
    roundDiv.className = "round-item";

    const tableRows = round.questions.map((item) => {
        const resultClass = item.isCorrect ? "qa-result-correct" : "qa-result-wrong";
        const resultText = item.isCorrect ? tr("resultCorrect") : tr("resultWrong");
        const rowClass = item.attempts >= 2 ? "qa-row-multiple-attempts" : "";
        return `
        <tr class="${rowClass}">
            <td>${item.prompt}</td>
            <td>${item.userAnswer}</td>
            <td>${item.correctAnswer}</td>
            <td>${item.attempts}</td>
            <td>${item.earnedPoints}</td>
            <td class="${resultClass}">${resultText}</td>
        </tr>
        `;
    }).join("");
    
    roundDiv.innerHTML = `
        <h3>${tr("roundWord")} ${round.roundNumber}</h3>
        <p><strong>${tr("labelPlayer")}:</strong> ${round.player}</p>
        <p><strong>${tr("labelDifficulty")}:</strong> ${getDifficultyLabel(round.difficultyLevel)}</p>
        <p><strong>${tr("labelTable")}:</strong> ${round.table}</p>
        <p><strong>${tr("labelScore")}:</strong> ${round.points}/${round.pointsAvailable || (round.totalQuestions * 3)}</p>
        <p><strong>${tr("labelCorrect")}:</strong> ${round.correctAnswers}/${round.totalQuestions} (${round.percentage}%)</p>
        <table class="qa-table">
        <thead>
            <tr>
            <th>${tr("headerQuestion")}</th>
            <th>${tr("headerYourAnswer")}</th>
            <th>${tr("headerCorrectAnswer")}</th>
            <th>${tr("headerAttempts")}</th>
            <th>${tr("headerPoints")}</th>
            <th>${tr("headerResult")}</th>
            </tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
        </table>
    `;
    
    summaryList.appendChild(roundDiv);
    }
    
    if (roundHistory.length === 0) {
    summaryList.innerHTML = `<p style='text-align: center; color: #999;'>${tr("noRounds")}</p>`;
    }
}

function updateProgress() {
    const progressList = document.getElementById("progressList");
    progressList.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
    const stat = tableStats[i];
    const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;

    const container = document.createElement("div");
    container.className = "progress-container";

    const label = document.createElement("div");
    label.className = "progress-label";
    label.textContent = tr("progressLabel", {
        n: i,
        correct: stat.correct,
        total: stat.total,
        accuracy: accuracy
    });

    const bar = document.createElement("div");
    bar.className = "progress-bar";

    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = accuracy + "%";
    fill.textContent = accuracy + "%";

    bar.appendChild(fill);
    container.appendChild(label);
    container.appendChild(bar);
    progressList.appendChild(container);
    }
}

function renderSessionSummary() {
    const summaryEl = document.getElementById("sessionSummaryContent");
    const playerNames = Object.keys(playerRoundHistory);
    const playersWithRounds = playerNames.filter((name) => {
    return Array.isArray(playerRoundHistory[name]) && playerRoundHistory[name].length > 0;
    });

    if (playersWithRounds.length === 0) {
    summaryEl.innerHTML = `<p style='text-align: center; color: #777;'>${tr("sessionNone")}</p>`;
    return;
    }

    const bestRound = sessionHighScores.length > 0 ? sessionHighScores[0] : null;
    let latestRound = null;

    if (currentPlayer && Array.isArray(playerRoundHistory[currentPlayer]) && playerRoundHistory[currentPlayer].length > 0) {
    latestRound = playerRoundHistory[currentPlayer][playerRoundHistory[currentPlayer].length - 1];
    } else {
    const fallbackPlayer = playersWithRounds[0];
    const fallbackRounds = playerRoundHistory[fallbackPlayer] || [];
    latestRound = fallbackRounds[fallbackRounds.length - 1] || null;
    }

    const latestPlayerRounds = latestRound ? (playerRoundHistory[latestRound.player] || []) : [];
    const latestPlayerAvgAccuracy = latestPlayerRounds.length > 0
    ? Math.round(latestPlayerRounds.reduce((acc, item) => acc + item.percentage, 0) / latestPlayerRounds.length)
    : 0;
    const latestPlayerDifficulties = latestRound
    ? Array.from(new Set(latestPlayerRounds.map((item) => {
        return getDifficultyLabel(item.difficultyLevel);
    }))).join(", ")
    : tr("notAvailable");

    const latestResultMarkup = latestRound ? `
    <div class="session-latest-result">
        <div class="session-latest-title">${tr("latestRoundTitle")}</div>
        <div class="session-latest-columns">
        <div class="session-latest-column">
            <div class="session-latest-item"><strong>${tr("labelPlayer")}:</strong> ${latestRound.player}</div>
            <div class="session-latest-item"><strong>${tr("labelScore")}:</strong> <span class="session-score-chip">${latestRound.points}/${latestRound.pointsAvailable || (latestRound.totalQuestions * 3)}</span></div>
            <div class="session-latest-item"><strong>${tr("labelAvgAccuracy")}:</strong> ${latestPlayerAvgAccuracy}%</div>
            <div class="session-best-line"><strong>${tr("sessionBest")}:</strong> ${bestRound ? `${bestRound.player} (${bestRound.points}/${typeof bestRound.pointsAvailable === "number" ? bestRound.pointsAvailable : "?"} pts) - ${getDifficultyLabel(bestRound.difficultyLevel)}` : tr("notAvailable")}</div>
        </div>
        <div class="session-latest-column">
            <div class="session-latest-item"><strong>${tr("labelDifficulties")}:</strong> ${latestPlayerDifficulties}</div>
            <div class="session-latest-item"><strong>${tr("labelCorrect")}:</strong> ${latestRound.correctAnswers}/${latestRound.totalQuestions} (${latestRound.percentage}%)</div>
            <div class="session-latest-item"><strong>${tr("sessionRounds")}:</strong> ${(playerRoundHistory[latestRound.player] || []).length}</div>
        </div>
        </div>
    </div>
    ` : "";

    summaryEl.innerHTML = `
    ${latestResultMarkup}
    `;
}

const answerInput = document.getElementById("answer");

// Keep answer input strictly digits, including paste/autofill scenarios.
answerInput.addEventListener("input", function(event) {
    event.target.value = event.target.value.replace(/\D+/g, "");
});

// Allow Enter key to submit
answerInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
    checkAnswer();
    }
});

// Initialize progress display and round summary
updateProgress();
updateRoundSummary();
renderHighScores();
renderSessionSummary();
updateDifficultyHint();
updateActionButtons();
updateGameInfoVisibility();

document.getElementById("difficultyLevel").addEventListener("change", function() {
    updateDifficultyHint();
    enforceTableSelectionLimit();
    updateActionButtons();
});

document.getElementById("languageSelector").addEventListener("change", function(event) {
    setLanguage(event.target.value);
});

document.querySelectorAll(".table-option").forEach((opt) => {
    opt.addEventListener("change", function(event) {
    enforceTableSelectionLimit(event.target);
    });
});

document.getElementById("playerName").addEventListener("input", function(event) {
    const typedName = event.target.value.trim();
    const highScoreFilter = document.getElementById("highScoreFilter");
    if (!typedName) {
    if (highScoreFilter) {
        highScoreFilter.value = "all";
    }
    updatePlayerStatus(true);
    roundHistory = [];
    tableStats = createEmptyTableStats();
    cumulativePoints = 0;
    updateActionButtons();
    updateRoundSummary();
    updateProgress();
    renderHighScores();
    return;
    }
    if (highScoreFilter) {
    highScoreFilter.value = "current";
    }
    setActivePlayer(typedName);
    updateActionButtons();
    updateRoundSummary();
    updateProgress();
    renderHighScores();
});

function updatePlayerStatus(reset = false) {
    const status = document.getElementById("playerStatus");
    if (reset) {
    status.textContent = tr("playerNotSet");
    return;
    }
    status.textContent = currentPlayer ? tr("playerStatus", { name: currentPlayer }) : tr("playerNotSet");
}

function loadHighScores() {
    const raw = sessionStorage.getItem(HIGH_SCORE_KEY);
    if (!raw) {
    return [];
    }
    try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
    return [];
    }
}

function saveHighScores() {
    sessionStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(sessionHighScores));
}

function updateHighScores(roundData) {
    const entry = {
    player: roundData.player,
    points: roundData.points,
    pointsAvailable: roundData.pointsAvailable,
    difficultyLevel: roundData.difficultyLevel,
    percentage: roundData.percentage,
    tables: roundData.table,
    roundNumber: roundData.roundNumber,
    timestamp: new Date().toLocaleTimeString(currentLanguage)
    };

    sessionHighScores.push(entry);
    sessionHighScores.sort((a, b) => {
    if (b.points !== a.points) {
        return b.points - a.points;
    }
    return b.percentage - a.percentage;
    });
    sessionHighScores = sessionHighScores.slice(0, 10);
    saveHighScores();
    renderHighScores();
}

function renderHighScores() {
    const filter = document.getElementById("highScoreFilter")?.value || "all";
    const list = document.getElementById("highScoreList");
    const visibleScores = filter === "current"
    ? sessionHighScores.filter((item) => item.player === currentPlayer)
    : sessionHighScores;

    if (visibleScores.length === 0) {
    if (filter === "current" && currentPlayer) {
        list.innerHTML = `<p style='text-align: center; color: #777;'>${tr("highScoreNoneForPlayer", { player: currentPlayer })}</p>`;
    } else if (filter === "current") {
        list.innerHTML = `<p style='text-align: center; color: #777;'>${tr("highScoreNeedPlayer")}</p>`;
    } else {
        list.innerHTML = `<p style='text-align: center; color: #777;'>${tr("highScoreNone")}</p>`;
    }
    return;
    }

    const highScoreHeaders = tr("highScoreHeaders");

    const rows = visibleScores.map((item, index) => {
    return `
        <tr>
        <td>${index + 1}</td>
        <td>${item.player}</td>
        <td>${item.points}</td>
        <td>${item.percentage}%</td>
        <td>${getDifficultyLabel(item.difficultyLevel)}</td>
        <td>${item.timestamp}</td>
        </tr>
    `;
    }).join("");

    list.innerHTML = `
    <table class="highscore-table">
        <thead>
        <tr>
            <th>${highScoreHeaders[0]}</th>
            <th>${highScoreHeaders[1]}</th>
            <th>${highScoreHeaders[2]}</th>
            <th>${highScoreHeaders[3]}</th>
            <th>${highScoreHeaders[4]}</th>
            <th>${highScoreHeaders[5]}</th>
        </tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
    </table>
    `;
}

function clearHighScores() {
    const filter = document.getElementById("highScoreFilter")?.value || "all";
    if (filter === "current") {
    if (!currentPlayer) {
        window.alert(tr("alertPickPlayer"));
        return;
    }
    const confirmedCurrent = window.confirm(tr("confirmClearPlayerScores", { player: currentPlayer }));
    if (!confirmedCurrent) {
        return;
    }
    sessionHighScores = sessionHighScores.filter((item) => item.player !== currentPlayer);
    saveHighScores();
    renderHighScores();
    return;
    }

    const confirmed = window.confirm(tr("confirmClearAllScores"));
    if (!confirmed) {
    return;
    }
    sessionHighScores = [];
    saveHighScores();
    renderHighScores();
}

function openTableModal() {
    const selected = getSelectedTables();
    renderTableModal(selected);
    document.getElementById("tableModal").style.display = "flex";
}

function showAllTablesInModal() {
    renderTableModal("all");
}

function renderTableModal(selected) {
    const grid = document.getElementById("tableModalGrid");
    grid.innerHTML = "";

    if (selected === "all" || selected.length === 0) {
    document.getElementById("tableModalTitle").textContent = tr("modalAllTablesTitle");
    for (let t = 1; t <= 10; t++) {
        const header = document.createElement("div");
        header.className = "table-group-title";
        header.textContent = tr("tableOf", { n: t });
        grid.appendChild(header);

        for (let i = 1; i <= 10; i++) {
        const item = document.createElement("div");
        item.className = "table-grid-item";
        item.textContent = `${t} × ${i} = ${t * i}`;
        grid.appendChild(item);
        }
    }
    } else if (selected.length === 1) {
    const tableNumber = selected[0];
    document.getElementById("tableModalTitle").textContent = tr("tableOf", { n: tableNumber });

    for (let i = 1; i <= 10; i++) {
        const item = document.createElement("div");
        item.className = "table-grid-item";
        item.textContent = `${tableNumber} × ${i} = ${tableNumber * i}`;
        grid.appendChild(item);
    }
    } else {
    document.getElementById("tableModalTitle").textContent = tr("modalSelectedTablesTitle");
    selected.forEach((tableNumber) => {
        const header = document.createElement("div");
        header.className = "table-group-title";
        header.textContent = tr("tableOf", { n: tableNumber });
        grid.appendChild(header);

        for (let i = 1; i <= 10; i++) {
        const item = document.createElement("div");
        item.className = "table-grid-item";
        item.textContent = `${tableNumber} × ${i} = ${tableNumber * i}`;
        grid.appendChild(item);
        }
    });
    }
}

function getSelectedTables() {
    return Array.from(document.querySelectorAll(".table-option:checked")).map((opt) => {
    return parseInt(opt.value);
    });
}

function describeSelectedTables(tables) {
    if (tables.length === 1) {
    return tr("tableOf", { n: tables[0] });
    }
    return tr("tablesList", { list: tables.join(", ") });
}

function selectAllTables() {
    const maxTables = getTableSelectionLimit(getActiveDifficultyLevel());
    let selectedCount = 0;
    document.querySelectorAll(".table-option").forEach((opt) => {
    if (selectedCount < maxTables) {
        opt.checked = true;
        selectedCount++;
    } else {
        opt.checked = false;
    }
    });

    if (maxTables < 10) {
    document.getElementById("feedback").textContent = tr("selectFirstTables", { max: maxTables });
    }
}

function clearAllTables() {
    document.querySelectorAll(".table-option").forEach((opt) => {
    opt.checked = false;
    });
}

function closeTableModal() {
    document.getElementById("tableModal").style.display = "none";
}

function handleModalBackdrop(event) {
    if (event.target.id === "tableModal") {
    closeTableModal();
    }
}

registerAudioUnlockHandlers();
document.getElementById("languageSelector").value = "es";
setLanguage("es");