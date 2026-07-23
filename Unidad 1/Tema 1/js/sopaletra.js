// Banco de palabras (sin tildes/espacios) relacionadas con el texto
  const wordBank = [
    "DATO","INFORMACION","SGBD","SQL","TABLA","CONSULTA","INTEGRIDAD",
    "SEGURIDAD","RESPALDO","RELACIONAL","MONGODB","REDIS","NEO4J",
    "ESQUEMA","LLAVE","CONCURRENCIA","METADATOS","NOSQL","CASSANDRA",
    "JERARQUICO","JSON","ORACLE","MYSQL","REDUNDANCIA","ARCHIVO"
  ];

  const GRID_SIZE = 15;
  const WORDS_TO_USE = 10;

  const directions = [
    {dr:0,dc:1}, {dr:0,dc:-1},
    {dr:1,dc:0}, {dr:-1,dc:0},
    {dr:1,dc:1}, {dr:1,dc:-1},
    {dr:-1,dc:1}, {dr:-1,dc:-1}
  ];

  let grid = [];
  let placedWords = [];
  let foundWords = new Set();
  let isSelecting = false;
  let startCell = null;
  let currentPath = [];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickWords() {
    return shuffle(wordBank).slice(0, WORDS_TO_USE);
  }

  function createEmptyGrid(size) {
    return Array.from({length: size}, () => Array(size).fill(null));
  }

  function fits(g, word, row, col, dir, size) {
    for (let i = 0; i < word.length; i++) {
      const r = row + dir.dr * i;
      const c = col + dir.dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) return false;
      const cell = g[r][c];
      if (cell !== null && cell !== word[i]) return false;
    }
    return true;
  }

  function placeWord(g, word, size) {
    let attempts = 0;
    while (attempts < 300) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (fits(g, word, row, col, dir, size)) {
        const cells = [];
        for (let i = 0; i < word.length; i++) {
          const r = row + dir.dr * i;
          const c = col + dir.dc * i;
          g[r][c] = word[i];
          cells.push({row: r, col: c});
        }
        return cells;
      }
    }
    return null;
  }

  function buildPuzzle() {
    const size = GRID_SIZE;
    let words = pickWords();
    let attemptGrid, attemptPlaced;

    // Intentar colocar todas las palabras; si alguna no cabe, reintenta
    let success = false;
    let tries = 0;
    while (!success && tries < 10) {
      tries++;
      attemptGrid = createEmptyGrid(size);
      attemptPlaced = [];
      success = true;
      for (const w of words.sort((a,b)=>b.length-a.length)) {
        const cells = placeWord(attemptGrid, w, size);
        if (!cells) { success = false; break; }
        attemptPlaced.push({ word: w, cells });
      }
    }

    grid = attemptGrid;
    placedWords = attemptPlaced;

    // Rellenar espacios vacíos con letras aleatorias
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === null) {
          grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    foundWords = new Set();
    renderGrid();
    renderWordList();
    updateProgress();
  }

  function renderGrid() {
    const gridEl = document.getElementById('grid');
    gridEl.innerHTML = "";
    gridEl.style.gridTemplateColumns = `repeat(${GRID_SIZE}, minmax(0, 1fr))`;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = document.createElement('div');
        cell.textContent = grid[r][c];
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.className = "letter-cell w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm font-semibold text-green-900 bg-white border border-green-100 cursor-pointer";
        gridEl.appendChild(cell);
      }
    }
  }

  function renderWordList() {
    const list = document.getElementById('wordList');
    list.innerHTML = "";
    placedWords.forEach(pw => {
      const li = document.createElement('li');
      li.id = `word-${pw.word}`;
      li.textContent = pw.word;
      li.className = "transition-colors duration-200";
      list.appendChild(li);
    });
  }

  function updateProgress() {
    document.getElementById('progress').textContent =
      `${foundWords.size}/${placedWords.length} encontradas`;
  }

  function getCellEl(row, col) {
    return document.querySelector(`.letter-cell[data-row="${row}"][data-col="${col}"]`);
  }

  function clearTempHighlight() {
    document.querySelectorAll('.letter-cell.temp-selected').forEach(el => {
      el.classList.remove('temp-selected', 'bg-green-300');
    });
  }

  function highlightPath(path) {
    clearTempHighlight();
    path.forEach(({row, col}) => {
      const el = getCellEl(row, col);
      if (el && !el.classList.contains('found-cell')) {
        el.classList.add('temp-selected', 'bg-green-300');
      }
    });
  }

  function getPath(start, end) {
    const dr = end.row - start.row;
    const dc = end.col - start.col;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    if (steps === 0) return [start];

    const stepDr = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepDc = dc === 0 ? 0 : dc / Math.abs(dc);

    // Solo válido si es línea recta: horizontal, vertical o diagonal
    if (Math.abs(dr) !== 0 && Math.abs(dc) !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;

    const path = [];
    for (let i = 0; i <= steps; i++) {
      path.push({ row: start.row + stepDr * i, col: start.col + stepDc * i });
    }
    return path;
  }

  function wordFromPath(path) {
    return path.map(p => grid[p.row][p.col]).join("");
  }

  function checkSelection(path) {
    const forward = wordFromPath(path);
    const backward = forward.split("").reverse().join("");

    const match = placedWords.find(pw =>
      !foundWords.has(pw.word) && (pw.word === forward || pw.word === backward)
    );

    if (match) {
      foundWords.add(match.word);
      path.forEach(({row, col}) => {
        const el = getCellEl(row, col);
        el.classList.remove('temp-selected', 'bg-green-300');
        el.classList.add('found-cell', 'bg-green-500', 'text-white');
      });
      const li = document.getElementById(`word-${match.word}`);
      li.classList.add('line-through', 'text-green-500');
      updateProgress();
    } else {
      clearTempHighlight();
    }
  }

  function cellFromPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    if (el && el.classList.contains('letter-cell')) {
      return { row: parseInt(el.dataset.row), col: parseInt(el.dataset.col) };
    }
    return null;
  }

  function initEvents() {
    const gridEl = document.getElementById('grid');

    gridEl.addEventListener('mousedown', (e) => {
      const cell = cellFromPoint(e.clientX, e.clientY);
      if (!cell) return;
      isSelecting = true;
      startCell = cell;
      currentPath = [cell];
      highlightPath(currentPath);
    });

    document.addEventListener('mousemove', (e) => {
      if (!isSelecting) return;
      const cell = cellFromPoint(e.clientX, e.clientY);
      if (!cell) return;
      const path = getPath(startCell, cell);
      if (path) {
        currentPath = path;
        highlightPath(path);
      }
    });

    document.addEventListener('mouseup', () => {
      if (isSelecting) {
        checkSelection(currentPath);
        isSelecting = false;
      }
    });

    // Soporte táctil (móvil)
    gridEl.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const cell = cellFromPoint(touch.clientX, touch.clientY);
      if (!cell) return;
      isSelecting = true;
      startCell = cell;
      currentPath = [cell];
      highlightPath(currentPath);
    });

    document.addEventListener('touchmove', (e) => {
      if (!isSelecting) return;
      const touch = e.touches[0];
      const cell = cellFromPoint(touch.clientX, touch.clientY);
      if (!cell) return;
      const path = getPath(startCell, cell);
      if (path) {
        currentPath = path;
        highlightPath(path);
      }
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', () => {
      if (isSelecting) {
        checkSelection(currentPath);
        isSelecting = false;
      }
    });
  }

  document.getElementById('newGameBtn').addEventListener('click', buildPuzzle);

  buildPuzzle();
  initEvents();