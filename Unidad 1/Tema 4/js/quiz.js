const questions = [
    {
      q: "1. ¿Qué es el levantamiento de requerimientos de datos?",
      options: [
        "El proceso de identificar, recopilar, documentar y validar la información que debe almacenar un sistema",
        "La implementación física de la base de datos en un SGBD",
        "La redacción de código para la interfaz de usuario",
        "La instalación de servidores para almacenar datos"
      ],
      correct: 0
    },
    {
      q: "2. ¿En qué se diferencia principalmente el levantamiento de requerimientos de datos del levantamiento de requerimientos funcionales?",
      options: [
        "Los requerimientos de datos se enfocan en la información necesaria, mientras que los funcionales describen qué debe hacer el sistema",
        "No hay diferencia, son lo mismo",
        "Los requerimientos funcionales solo definen la seguridad",
        "Los de datos son más técnicos y no requieren usuarios"
      ],
      correct: 0
    },
    {
      q: "3. ¿Qué técnica es la más adecuada para recolectar información de un gran número de usuarios de forma estandarizada?",
      options: ["Entrevistas individuales","Cuestionarios/encuestas","Talleres JAD","Observación directa"],
      correct: 1
    },
    {
      q: "4. ¿Qué técnica permite acelerar el consenso entre varios interesados mediante sesiones colaborativas?",
      options: ["Entrevistas","Análisis de documentos","JAD (talleres grupales)","Cuestionarios"],
      correct: 2
    },
    {
      q: "5. ¿Cuál de las siguientes es una característica de un buen requerimiento de datos?",
      options: ["Vago y amplio","Ambiguo","Claro, específico, atómico y verificable","Imposible de verificar"],
      correct: 2
    },
    {
      q: "6. Clasifica: 'El sistema debe gestionar información de proveedores.'",
      options: ["Entidad","Atributo","Relación/Regla","Restricción"],
      correct: 0
    },
    {
      q: "7. Clasifica: 'Cada proveedor debe tener un NIT único registrado en el sistema.'",
      options: ["Entidad","Atributo","Relación/Regla","Restricción"],
      correct: 3
    },
    {
      q: "8. Clasifica: 'De cada proveedor se debe guardar nombre, teléfono y ciudad.'",
      options: ["Entidad","Atributo","Relación/Regla","Restricción"],
      correct: 1
    },
    {
      q: "9. Clasifica: 'Un proveedor puede suministrar muchos productos, pero cada producto proviene de un único proveedor.'",
      options: ["Entidad","Atributo","Relación/Regla","Restricción"],
      correct: 2
    },
    {
      q: "10. ¿Qué técnica es especialmente útil para detectar necesidades de información que los usuarios no mencionan explícitamente?",
      options: ["Cuestionarios","Observación directa","Solo entrevistas","Solo análisis de documentos"],
      correct: 1
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
