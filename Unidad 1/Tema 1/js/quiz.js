const questions = [
    {
      q: "1. Según el texto, ¿qué es un dato?",
      options: [
        "La unidad más básica y objetiva de representación de un hecho, que por sí sola no tiene un significado completo",
        "Un conjunto de datos organizados que generan conocimiento",
        "Un reporte que se entrega al usuario final",
        "Una tabla dentro de una base de datos"
      ],
      correct: 0
    },
    {
      q: "2. ¿Cuándo surge la información según el texto?",
      options: [
        "Cuando los datos se almacenan en un archivo de texto",
        "Cuando los datos se organizan, relacionan e interpretan dentro de un contexto que les da sentido",
        "Cuando los datos se eliminan de la base de datos",
        "Cuando un dato se repite en varios archivos"
      ],
      correct: 1
    },
    {
      q: "3. Un archivo en formato JSON o XML es un ejemplo de dato:",
      options: [
        "Estructurado",
        "No estructurado",
        "Semiestructurado",
        "Relacional"
      ],
      correct: 2
    },
    {
      q: "4. ¿Cuál es la definición de base de datos según el texto?",
      options: [
        "Un software especializado que traduce instrucciones SQL",
        "Un conjunto organizado y estructurado de datos relacionados entre sí, almacenado de forma persistente y gestionado de manera eficiente",
        "Un archivo plano gestionado directamente por cada programa",
        "Un lenguaje de manipulación de datos"
      ],
      correct: 1
    },
    {
      q: "5. ¿Cuál de los siguientes era un problema del sistema de archivos tradicional?",
      options: [
        "Acceso simultáneo seguro de múltiples usuarios",
        "Redundancia de datos e inconsistencia entre archivos",
        "Integridad garantizada de la información",
        "Centralización de la información"
      ],
      correct: 1
    },
    {
      q: "6. ¿Qué es un Sistema Gestor de Bases de Datos (SGBD)?",
      options: [
        "Un archivo de texto donde se guardan los datos",
        "El software especializado que permite crear, administrar, consultar y proteger una base de datos",
        "Un tipo de dato no estructurado",
        "Un modelo de datos jerárquico en desuso"
      ],
      correct: 1
    },
    {
      q: "7. ¿Cuál de las siguientes es una función principal de un SGBD?",
      options: [
        "Generar redundancia de datos entre archivos",
        "Control de acceso concurrente para evitar inconsistencias",
        "Eliminar la necesidad de seguridad en los datos",
        "Impedir el respaldo y recuperación de información"
      ],
      correct: 1
    },
    {
      q: "8. Según la arquitectura ANSI/SPARC, ¿qué nivel describe cómo se almacenan físicamente los datos (archivos, índices)?",
      options: [
        "Nivel externo",
        "Nivel conceptual",
        "Nivel interno o físico",
        "Nivel de vistas"
      ],
      correct: 2
    },
    {
      q: "9. ¿Qué nivel de la arquitectura ANSI/SPARC describe qué datos se almacenan y sus relaciones, sin entrar en detalles físicos?",
      options: [
        "Nivel externo",
        "Nivel conceptual o lógico",
        "Nivel interno",
        "Nivel de almacenamiento"
      ],
      correct: 1
    },
    {
      q: "10. ¿Cuál de los siguientes es un ejemplo de SGBD NoSQL documental?",
      options: [
        "MySQL",
        "Oracle Database",
        "MongoDB",
        "Microsoft SQL Server"
      ],
      correct: 2
    }
  ];

  const form = document.getElementById('quizForm');

  questions.forEach((item, index) => {
    const block = document.createElement('div');
    block.className = "border border-green-100 rounded-xl p-4 bg-green-50/50";
    block.id = `question-${index}`;

    let optionsHtml = "";
    item.options.forEach((opt, i) => {
      optionsHtml += `
        <label class="flex items-start gap-3 p-2 rounded-lg hover:bg-green-100 cursor-pointer transition-colors">
          <input type="radio" name="q${index}" value="${i}" class="mt-1 accent-green-600">
          <span class="text-gray-700 text-sm md:text-base">${opt}</span>
        </label>
      `;
    });

    block.innerHTML = `
      <p class="font-semibold text-green-800 mb-3">${item.q}</p>
      <div class="space-y-1">${optionsHtml}</div>
      <p class="feedback hidden mt-3 text-sm font-medium rounded-lg px-3 py-2"></p>
    `;

    form.appendChild(block);
  });

  document.getElementById('submitBtn').addEventListener('click', () => {
    const alertMsg = document.getElementById('alertMsg');
    let missing = [];

    questions.forEach((item, index) => {
      const selected = form.querySelector(`input[name="q${index}"]:checked`);
      if (!selected) missing.push(index + 1);
    });

    if (missing.length > 0) {
      alertMsg.textContent = `Debes responder todas las preguntas antes de enviar. Faltan: ${missing.join(", ")}`;
      alertMsg.classList.remove('hidden');
      document.getElementById('scoreBox').classList.add('hidden');
      return;
    }

    alertMsg.classList.add('hidden');

    let correctCount = 0;

    questions.forEach((item, index) => {
      const selected = form.querySelector(`input[name="q${index}"]:checked`);
      const selectedValue = parseInt(selected.value);
      const feedbackEl = document.querySelector(`#question-${index} .feedback`);
      const labels = document.querySelectorAll(`#question-${index} label`);

      labels.forEach((label, i) => {
        label.classList.remove('bg-green-200', 'bg-red-200');
        if (i === item.correct) {
          label.classList.add('bg-green-200');
        } else if (i === selectedValue && selectedValue !== item.correct) {
          label.classList.add('bg-red-200');
        }
      });

      feedbackEl.classList.remove('hidden');
      if (selectedValue === item.correct) {
        correctCount++;
        feedbackEl.textContent = "✅ Correcto";
        feedbackEl.className = "feedback mt-3 text-sm font-medium rounded-lg px-3 py-2 bg-green-100 text-green-800 border border-green-300";
      } else {
        feedbackEl.textContent = `❌ Incorrecto. La respuesta correcta es: "${item.options[item.correct]}"`;
        feedbackEl.className = "feedback mt-3 text-sm font-medium rounded-lg px-3 py-2 bg-red-100 text-red-700 border border-red-300";
      }
    });

    const scoreBox = document.getElementById('scoreBox');
    const scoreText = document.getElementById('scoreText');
    scoreBox.classList.remove('hidden');
    scoreText.textContent = `Obtuviste ${correctCount} de ${questions.length} respuestas correctas.`;
  });
