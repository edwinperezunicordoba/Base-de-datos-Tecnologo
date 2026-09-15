  const pairBank2 = [
    { id: "entrevistas", term: "Entrevistas", def: "Conversaciones con interesados clave para indagar en profundidad sobre sus necesidades de información" },
    { id: "cuestionarios", term: "Cuestionarios o encuestas", def: "Instrumentos escritos para recolectar información de muchos usuarios de forma estandarizada" },
    { id: "observacion", term: "Observación directa", def: "Presenciar procesos reales para detectar necesidades que los usuarios no mencionan explícitamente" },
    { id: "documentos", term: "Análisis de documentos", def: "Revisar formularios, reportes y hojas de cálculo para identificar los datos utilizados" },
    { id: "entidad", term: "Requerimiento de entidad", def: "Identifica los objetos o conceptos sobre los que el sistema debe almacenar información" },
    { id: "atributo", term: "Requerimiento de atributo", def: "Especifica las características o datos concretos que se necesitan de una entidad" },
    { id: "relacion", term: "Relación o regla de negocio", def: "Describe cómo se conectan las entidades y qué reglas aplican a esa conexión" },
    { id: "restriccion", term: "Requerimiento de restricción", def: "Expresa reglas o límites que los datos deben cumplir siempre" }
  ];

  const PAIRS_TO_USE2 = 8;

  let activePairs2 = [];
  let selectedConcept2 = null;
  let selectedDef2 = null;
  let matched2 = new Set();

  function shuffle2(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildGame2() {
    activePairs2 = shuffle2(pairBank2).slice(0, PAIRS_TO_USE2);
    selectedConcept2 = null;
    selectedDef2 = null;
    matched2 = new Set();

    const conceptsShuffled = shuffle2(activePairs2);
    const defsShuffled = shuffle2(activePairs2);

    const colConcepts = document.getElementById('colConcepts2');
    const colDefs = document.getElementById('colDefs2');
    colConcepts.innerHTML = "";
    colDefs.innerHTML = "";

    conceptsShuffled.forEach(pair => {
      const btn = document.createElement('button');
      btn.type = "button";
      btn.dataset.id = pair.id;
      btn.textContent = pair.term;
      btn.className = "concept-item w-full text-left px-4 py-3 rounded-xl border-2 border-green-300 bg-green-50 text-green-900 font-medium text-sm transition-colors duration-200 hover:bg-green-100";
      btn.addEventListener('click', () => onSelectConcept2(pair.id, btn));
      colConcepts.appendChild(btn);
    });

    defsShuffled.forEach(pair => {
      const btn = document.createElement('button');
      btn.type = "button";
      btn.dataset.id = pair.id;
      btn.textContent = pair.def;
      btn.className = "def-item w-full text-left px-4 py-3 rounded-xl border-2 border-green-200 bg-white text-gray-700 text-sm transition-colors duration-200 hover:bg-green-50";
      btn.addEventListener('click', () => onSelectDef2(pair.id, btn));
      colDefs.appendChild(btn);
    });

    document.getElementById('feedbackMsg2').classList.add('hidden');
    clearSvg2();
    updateProgress2();
  }

  function clearSelectionStyles2() {
    document.querySelectorAll('.concept-item, .def-item').forEach(el => {
      if (!el.classList.contains('locked')) {
        el.classList.remove('ring-4', 'ring-green-400', 'ring-red-400');
      }
    });
  }

  function onSelectConcept2(id, el) {
    if (el.classList.contains('locked')) return;
    clearSelectionStyles2();
    selectedConcept2 = { id, el };
    el.classList.add('ring-4', 'ring-green-400');
    if (selectedDef2) tryMatch2();
  }

  function onSelectDef2(id, el) {
    if (el.classList.contains('locked')) return;
    clearSelectionStyles2();
    if (selectedConcept2) selectedConcept2.el.classList.add('ring-4', 'ring-green-400');
    selectedDef2 = { id, el };
    el.classList.add('ring-4', 'ring-green-400');
    if (selectedConcept2) tryMatch2();
  }

  function showFeedback2(correct, text) {
    const box = document.getElementById('feedbackMsg2');
    box.textContent = text;
    box.className = correct
      ? "mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-300"
      : "mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-red-100 text-red-700 border border-red-300";
    box.classList.remove('hidden');
  }

  function tryMatch2() {
    const conceptEl = selectedConcept2.el;
    const defEl = selectedDef2.el;

    if (selectedConcept2.id === selectedDef2.id) {
      conceptEl.classList.remove('ring-4', 'ring-green-400');
      defEl.classList.remove('ring-4', 'ring-green-400');
      conceptEl.classList.add('locked', 'bg-green-500', 'text-white', 'border-green-500');
      defEl.classList.add('locked', 'bg-green-500', 'text-white', 'border-green-500');
      matched2.add(selectedConcept2.id);
      drawLine2(conceptEl, defEl);
      showFeedback2(true, "✅ Correcto, esos conceptos coinciden.");
      updateProgress2();

      if (matched2.size === activePairs2.length) {
        showFeedback2(true, "🎉 ¡Completaste todas las relaciones correctamente!");
      }
    } else {
      conceptEl.classList.add('ring-4', 'ring-red-400');
      defEl.classList.add('ring-4', 'ring-red-400');
      showFeedback2(false, "❌ No están de acuerdo, ese concepto y esa definición no coinciden. Intenta de nuevo.");
      setTimeout(() => {
        conceptEl.classList.remove('ring-4', 'ring-red-400');
        defEl.classList.remove('ring-4', 'ring-red-400');
      }, 700);
    }

    selectedConcept2 = null;
    selectedDef2 = null;
  }

  function updateProgress2() {
    document.getElementById('progress2').textContent =
      `${matched2.size}/${activePairs2.length} relaciones correctas`;
  }

  function clearSvg2() {
    document.getElementById('linesSvg2').innerHTML = "";
  }

  function drawLine2(elA, elB) {
    const svg = document.getElementById('linesSvg2');
    const containerRect = svg.getBoundingClientRect();
    const rectA = elA.getBoundingClientRect();
    const rectB = elB.getBoundingClientRect();

    const x1 = rectA.right - containerRect.left;
    const y1 = rectA.top + rectA.height / 2 - containerRect.top;
    const x2 = rectB.left - containerRect.left;
    const y2 = rectB.top + rectB.height / 2 - containerRect.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#10b981");
    line.setAttribute("stroke-width", "2.5");
    line.setAttribute("stroke-linecap", "round");
    svg.appendChild(line);
  }

  document.getElementById('newGameBtn2').addEventListener('click', buildGame2);

  buildGame2();