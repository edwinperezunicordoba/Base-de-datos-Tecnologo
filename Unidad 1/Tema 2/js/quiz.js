const questions = [
    {
      q: "1. ¿Qué describe principalmente el modelo entidad-relación?",
      options: [
        "Cómo se almacenan físicamente los datos en un SGBD específico",
        "La estructura lógica de la base de datos mediante entidades, atributos y relaciones",
        "El lenguaje SQL necesario para consultar la base de datos",
        "Las reglas de seguridad y acceso del sistema"
      ],
      correct: 1
    },
    {
      q: "2. En el modelo E-R, ¿qué representa una entidad?",
      options: [
        "Una característica o propiedad de un dato",
        "Un conjunto de objetos similares del dominio del problema",
        "Una operación que transforma datos",
        "Un tipo de relación entre tablas"
      ],
      correct: 1
    },
    {
      q: "3. ¿Cuál de estas opciones es un ejemplo de entidad débil?",
      options: [
        "CLIENTE",
        "PRODUCTO",
        "CUOTA de un préstamo",
        "PAÍS"
      ],
      correct: 2
    },
    {
      q: "4. ¿Cuál es la diferencia principal entre el modelo entidad-relación y el modelo relacional?",
      options: [
        "El modelo E-R es físico y el relacional es conceptual",
        "El modelo E-R describe el diseño conceptual sin preocuparse por la implementación física",
        "El modelo E-R usa SQL y el relacional no",
        "No hay diferencia; son nombres del mismo modelo"
      ],
      correct: 1
    },
    {
      q: "5. ¿Qué tipo de atributo puede dividirse en partes más pequeñas con significado propio?",
      options: [
        "Atributo simple",
        "Atributo compuesto",
        "Atributo monovaluado",
        "Atributo derivado"
      ],
      correct: 1
    },
    {
      q: "6. ¿Cuál de los siguientes es un atributo multivaluado?",
      options: [
        "Fecha de nacimiento",
        "Número de documento",
        "Números de teléfono de una persona",
        "Género"
      ],
      correct: 2
    },
    {
      q: "7. En una relación E-R, ¿qué es un atributo de relación?",
      options: [
        "Un atributo que describe la relación entre entidades y no pertenece solo a una entidad",
        "Un atributo que identifica de manera única a una entidad",
        "Un atributo que se deriva de otro atributo dentro de la misma entidad",
        "Un atributo que representa una entidad débil"
      ],
      correct: 0
    },
    {
      q: "8. Una relación binaria conecta: ",
      options: [
        "Dos entidades distintas",
        "Tres entidades simultáneamente",
        "Una sola entidad consigo misma",
        "Ninguna entidad"
      ],
      correct: 0
    },
    {
      q: "9. En el caso de una clínica veterinaria, ¿qué podría ser una entidad?",
      options: [
        "Cita médica",
        "Dueño",
        "Mascota",
        "Todas las anteriores"
      ],
      correct: 3
    },
    {
      q: "10. ¿Qué elemento del modelo E-R se dibuja habitualmente como un rombo?",
      options: [
        "Entidad",
        "Atributo",
        "Relación",
        "Clave primaria"
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
