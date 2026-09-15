  const questions = [
    {
      q: "1. ¿Qué describe mejor el levantamiento de requerimientos de datos?",
      options: [
        "El proceso sistemático de identificar, recopilar, documentar y validar la información que necesita un sistema",
        "La instalación del SGBD y la configuración de sus servidores",
        "La creación de las pantallas de una aplicación",
        "La escritura de consultas SQL sin consultar a los usuarios"
      ],
      correct: 0
    },
    {
      q: "2. ¿Qué pregunta forma parte del levantamiento de requerimientos de datos?",
      options: [
        "¿Qué información es relevante para el negocio y quién la utiliza?",
        "¿Qué color debe tener el logotipo de la aplicación?",
        "¿Qué lenguaje de programación debe aprender el usuario?",
        "¿Qué marca de computador debe comprar el equipo?"
      ],
      correct: 0
    },
    {
      q: "3. ¿Cuál es la diferencia principal entre los requerimientos de datos y los funcionales?",
      options: [
        "Los de datos describen qué información debe existir y cómo se relaciona; los funcionales describen qué debe hacer el sistema",
        "Los de datos solo describen la interfaz y los funcionales solo describen las tablas",
        "No existe ninguna diferencia entre ambos tipos de requerimientos",
        "Los requerimientos funcionales no necesitan validarse con los usuarios"
      ],
      correct: 0
    },
    {
      q: "4. ¿Qué técnica es útil para recolectar información de muchos usuarios de forma rápida y estandarizada?",
      options: ["Entrevistas individuales", "Cuestionarios o encuestas", "Observación directa", "Talleres JAD"],
      correct: 1
    },
    {
      q: "5. ¿Qué técnica permite descubrir necesidades que los usuarios no mencionan por considerarlas obvias?",
      options: ["Observación directa", "Cuestionarios únicamente", "Análisis de código fuente", "Diseño de la interfaz"],
      correct: 0
    },
    {
      q: "6. ¿Qué técnica revisa formularios, reportes, hojas de cálculo y manuales existentes?",
      options: ["Entrevistas", "Talleres JAD", "Análisis de documentos existentes", "Observación directa"],
      correct: 2
    },
    {
      q: "7. ¿Cuál de estas características corresponde a un buen requerimiento de datos?",
      options: ["Es vago y permite varias interpretaciones", "Es claro, específico, atómico y verificable", "Mezcla varias necesidades sin detalle", "No puede comprobarse en el diseño final"],
      correct: 1
    },
    {
      q: "8. Clasifica: 'El sistema debe gestionar información de proveedores.'",
      options: ["Entidad", "Atributo", "Relación o regla de negocio", "Restricción"],
      correct: 0
    },
    {
      q: "9. Clasifica: 'De cada proveedor se debe guardar el nombre, el teléfono y la ciudad.'",
      options: ["Entidad", "Atributo", "Relación o regla de negocio", "Restricción"],
      correct: 1
    },
    {
      q: "10. Clasifica: 'El stock de un producto no puede ser negativo.'",
      options: ["Entidad", "Atributo", "Relación o regla de negocio", "Restricción"],
      correct: 3
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
