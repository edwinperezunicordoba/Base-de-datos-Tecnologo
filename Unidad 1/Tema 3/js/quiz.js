const questions = [
    {
      q: "1. ¿Qué cardinalidad expresa que un DEPARTAMENTO tiene muchos EMPLEADOS y cada EMPLEADO pertenece a un único DEPARTAMENTO?",
      options: ["1:1","1:N","N:M","Recursiva"],
      correct: 1
    },
    {
      q: "2. En formato (mínimo, máximo), ¿cómo se expresa que un USUARIO puede no tener listas de reproducción y cada LISTA debe pertenecer a un usuario?",
      options: ["(1,1) desde USUARIO hacia LISTA","(0,N) desde USUARIO hacia LISTA","(1,N) desde LISTA hacia USUARIO","(0,1) desde LISTA hacia USUARIO"],
      correct: 1
    },
    {
      q: "3. ¿Cuál de estas propiedades debe tener una clave primaria?",
      options: ["Unicidad y puede ser nula","No nulidad y unicidad","Puede repetirse y ser nula","Ser sólo un atributo compuesto"],
      correct: 1
    },
    {
      q: "4. ¿Qué es una clave candidata?",
      options: ["Cualquier conjunto de atributos que identifica registros (superclave)","Una superclave mínima sin atributos innecesarios","La clave foránea que referencia otra tabla","Un atributo derivado"],
      correct: 1
    },
    {
      q: "5. ¿Qué es una clave foránea (FK)?",
      options: ["Un atributo que calcula valores derivados","Un atributo que referencia la clave primaria de otra entidad","Una clave primaria alternativa","Una restricción de dominio"],
      correct: 1
    },
    {
      q: "6. ¿Qué tipo de restricción se viola si se registra un PEDIDO con código de cliente que no existe?",
      options: ["Integridad de entidad","Integridad referencial","Restricción de dominio","Restricción de unicidad"],
      correct: 1
    },
    {
      q: "7. ¿Qué restricción se estaría violando si se guarda 'X' en un campo que solo acepta 'M' o 'F'?",
      options: ["Integridad referencial","Integridad de entidad","Restricción de dominio","Restricción de unicidad"],
      correct: 2
    },
    {
      q: "8. ¿Cuál es la cardinalidad típica entre ESTUDIANTE y CURSO cuando un estudiante puede matricularse en muchos cursos y cada curso puede tener muchos estudiantes?",
      options: ["1:1","1:N","N:M","Unaria"],
      correct: 2
    },
    {
      q: "9. ¿Qué indica la participación mínima igual a 1 para una entidad en una relación?",
      options: ["Que la participación es opcional","Que la participación es obligatoria para cada ocurrencia","Que la cardinalidad máxima es 1","Que siempre hay una relación ternaria"],
      correct: 1
    },
    {
      q: "10. ¿Por qué a menudo se recomienda usar una clave sustituta (surrogate key) como PK?",
      options: ["Porque los atributos naturales nunca cambian","Porque es más fácil garantizar unicidad y evitar cambios en claves naturales","Porque impide relaciones N:M","Porque reemplaza la necesidad de claves foráneas"],
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
