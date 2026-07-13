// Configuración básica
const MAIN_QUARTER_SECONDS = 10 * 60; // 10 minutos
const HALFTIME_SECONDS = 2 * 60; // 2 minutos entre 2.º y 3.º cuarto
const TIMEOUT_SECONDS = 60; // 1 minuto con tecla M
const TOTAL_QUARTERS = 4;

// Estado del juego
let currentQuarter = 1;
let mode = "MAIN"; // MAIN | TIMEOUT | HALFTIME
let running = false;
let intervalId = null;

let mainRemaining = MAIN_QUARTER_SECONDS;
let halftimeRemaining = HALFTIME_SECONDS;
let timeoutRemaining = TIMEOUT_SECONDS;
let savedMainRemainingForTimeout = null;

let localScore = 0;
let visitorScore = 0;
let pendingTeam = null; // "LOCAL" | "VISITOR" | null
let gameFinished = false;

// Tiempos muertos por equipo (disponible / usado)
let localTimeoutAvailable = true;
let visitorTimeoutAvailable = true;

// Elementos del DOM
const timerLabelEl = document.getElementById("timer-label");
const mainTimerEl = document.getElementById("main-timer");
const subLabelEl = document.getElementById("sub-label");
const quarterNumberEl = document.getElementById("quarter-number");
const localScoreEl = document.getElementById("local-score");
const visitorScoreEl = document.getElementById("visitor-score");
const scoreboardEl = document.querySelector(".scoreboard");
const localTimeoutCircleEl = document.getElementById("local-timeout-circle");
const visitorTimeoutCircleEl = document.getElementById("visitor-timeout-circle");

function updateTimeoutDisplay() {
  if (localTimeoutCircleEl) {
    localTimeoutCircleEl.classList.toggle(
      "timeout-circle--used",
      !localTimeoutAvailable
    );
  }
  if (visitorTimeoutCircleEl) {
    visitorTimeoutCircleEl.classList.toggle(
      "timeout-circle--used",
      !visitorTimeoutAvailable
    );
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function updateDisplay() {
  quarterNumberEl.textContent = currentQuarter;
  localScoreEl.textContent = localScore;
  visitorScoreEl.textContent = visitorScore;

  if (mode === "MAIN") {
    timerLabelEl.textContent = "Tiempo";
    mainTimerEl.textContent = formatTime(mainRemaining);
    subLabelEl.textContent = gameFinished
      ? "Finalizado"
      : `Cuarto ${currentQuarter}`;
  } else if (mode === "TIMEOUT") {
    timerLabelEl.textContent = "Minuto";
    mainTimerEl.textContent = formatTime(timeoutRemaining);
    subLabelEl.textContent = `Tiempo muerto · Cuarto ${currentQuarter}`;
  } else if (mode === "HALFTIME") {
    timerLabelEl.textContent = "Entretiempo";
    mainTimerEl.textContent = formatTime(halftimeRemaining);
    subLabelEl.textContent = "Descanso 2.º y 3.º cuarto";
  }

  scoreboardEl.classList.toggle("game-over", gameFinished);
  scoreboardEl.classList.toggle(
    "pending-team-local",
    pendingTeam === "LOCAL"
  );
  scoreboardEl.classList.toggle(
    "pending-team-visitor",
    pendingTeam === "VISITOR"
  );

  updateTimeoutDisplay();
}

function clearTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startTimer() {
  if (running || gameFinished) return;
  running = true;

  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    tick();
  }, 1000);
}

function pauseTimer() {
  running = false;
  clearTimer();
}

function setMode(newMode) {
  if (mode === newMode) return;
  pauseTimer();
  mode = newMode;
  updateDisplay();
}

function tick() {
  if (!running) return;

  if (mode === "MAIN") {
    if (mainRemaining > 0) {
      mainRemaining--;
    }
    if (mainRemaining <= 0) {
      mainRemaining = 0;
      pauseTimer();
      handleEndOfQuarter();
    }
  } else if (mode === "TIMEOUT") {
    if (timeoutRemaining > 0) {
      timeoutRemaining--;
    }
    if (timeoutRemaining <= 0) {
      timeoutRemaining = 0;
      pauseTimer();
      // Vuelve al reloj principal con el tiempo guardado
      if (savedMainRemainingForTimeout !== null) {
        mainRemaining = savedMainRemainingForTimeout;
        savedMainRemainingForTimeout = null;
      }
      setMode("MAIN");
    }
  } else if (mode === "HALFTIME") {
    if (halftimeRemaining > 0) {
      halftimeRemaining--;
    }
    if (halftimeRemaining <= 0) {
      halftimeRemaining = 0;
      pauseTimer();
      // Al terminar el entretiempo, arranca el tercer cuarto en 10:00 (pausado)
      currentQuarter = 3;
      mainRemaining = MAIN_QUARTER_SECONDS;
      setMode("MAIN");
    }
  }

  updateDisplay();
}

function handleEndOfQuarter() {
  if (currentQuarter === 1 || currentQuarter === 3) {
    // Pasa al siguiente cuarto (2 o 4)
    currentQuarter++;
    mainRemaining = MAIN_QUARTER_SECONDS;
    updateDisplay();
    // Queda pausado, se inicia con P
  } else if (currentQuarter === 2) {
    // Después del segundo cuarto: entretiempo de 2 minutos
    halftimeRemaining = HALFTIME_SECONDS;
    setMode("HALFTIME");
    // Se inicia/pausa con la barra espaciadora
  } else if (currentQuarter === 4) {
    // Fin del partido
    gameFinished = true;
    updateDisplay();
  }
}

function resetAll() {
  clearTimer();
  currentQuarter = 1;
  mainRemaining = MAIN_QUARTER_SECONDS;
  halftimeRemaining = HALFTIME_SECONDS;
  timeoutRemaining = TIMEOUT_SECONDS;
  savedMainRemainingForTimeout = null;
  localScore = 0;
  visitorScore = 0;
  pendingTeam = null;
  running = false;
  gameFinished = false;
  localTimeoutAvailable = true;
  visitorTimeoutAvailable = true;
  mode = "MAIN";
  updateDisplay();
}

function handleTimeoutToggle() {
  if (gameFinished) return;

  // Si ya estamos en minuto, M vuelve al tiempo de juego
  if (mode === "TIMEOUT") {
    pauseTimer();
    if (savedMainRemainingForTimeout !== null) {
      mainRemaining = savedMainRemainingForTimeout;
      savedMainRemainingForTimeout = null;
    }
    setMode("MAIN");
    return;
  }

  // Solo desde el reloj principal: entrar al minuto
  if (mode !== "MAIN") return;

  savedMainRemainingForTimeout = mainRemaining;
  timeoutRemaining = TIMEOUT_SECONDS;
  pauseTimer();
  setMode("TIMEOUT");
  startTimer();
}

function handleSpacebar() {
  // Solo controla el entretiempo
  if (mode === "HALFTIME") {
    if (running) {
      pauseTimer();
    } else {
      startTimer();
    }
  }
}

function addPoints(team, value) {
  if (![1, 2, 3].includes(value)) return;

  if (team === "LOCAL") {
    localScore += value;
  } else if (team === "VISITOR") {
    visitorScore += value;
  }
  updateDisplay();
}

function handleKeyDown(e) {
  const key = e.key;

  if (key === "p" || key === "P") {
    if (running) {
      pauseTimer();
    } else {
      // Solo arranca si hay un reloj que tenga sentido arrancar
      if (!gameFinished) {
        startTimer();
      }
    }
    return;
  }

  if (key === "r" || key === "R") {
    resetAll();
    return;
  }

  if (key === "l" || key === "L") {
    pendingTeam = "LOCAL";
    updateDisplay();
    return;
  }

  if (key === "v" || key === "V") {
    pendingTeam = "VISITOR";
    updateDisplay();
    return;
  }

  if (key === "m" || key === "M") {
    handleTimeoutToggle();
    return;
  }

  if (key === "t" || key === "T") {
    if (pendingTeam === "LOCAL") {
      localTimeoutAvailable = !localTimeoutAvailable;
    } else if (pendingTeam === "VISITOR") {
      visitorTimeoutAvailable = !visitorTimeoutAvailable;
    }
    updateTimeoutDisplay();
    return;
  }

  if (key === " " || key === "Spacebar") {
    // Entretiempo
    e.preventDefault();
    handleSpacebar();
    return;
  }

  if (["1", "2", "3"].includes(key) && pendingTeam) {
    const value = parseInt(key, 10);
    addPoints(pendingTeam, value);
    pendingTeam = null;
    updateDisplay();
  }
}

// Inicializar
resetAll();
window.addEventListener("keydown", handleKeyDown);
