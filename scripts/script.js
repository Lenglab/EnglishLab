let topicsByGrade = {};
let currentGrade = ''; // Variable para guardar el grado actual seleccionado
let currentPeriod = '1'; // Variable para guardar el periodo actual seleccionado

fetch('db/data.json')  // Aquí 'topics.json' es el archivo donde están los datos
  .then(response => response.json())
  .then(data => {
    topicsByGrade = data; // Asignar los datos cargados a topicsByGrade
})
  .catch(error => {
    console.error("Error al cargar el archivo JSON:", error);
});

function showGrade(grade) {
  document.getElementById("main-menu").style.display = "none";
  const gradeMenu = document.getElementById("grade-menu");
  gradeMenu.style.display = "flex";
  document.getElementById("grade-title").textContent = `Temas de grado ${capitalize(grade)}`;

  // Guardar el grado seleccionado para usarlo más tarde
  currentGrade = grade;
  
  // Mostrar los temas para el primer periodo por defecto
  showPeriod('1');
}

function goBack() {
  document.getElementById("grade-menu").style.display = "none";
  document.getElementById("main-menu").style.display = "flex";
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function showPeriod(period) {
  currentPeriod = period; // Guardar el periodo seleccionado
  
  const periodButtons = document.querySelectorAll('.period');
  periodButtons.forEach(button => {
    button.classList.remove('selected'); // Eliminar la clase 'selected' de todos los botones
  });

  // Añadir la clase 'selected' al botón clickeado
  document.querySelector(`.period[onclick="showPeriod('${period}')"]`).classList.add('selected');

  const topicsList = document.getElementById("topics-list");
  topicsList.innerHTML = ""; // Limpiar la lista de temas

  // Verificar si existen datos para el grado y periodo seleccionados
  if (topicsByGrade[currentGrade] && topicsByGrade[currentGrade][`periodo${period}`]) {
    const periodo = topicsByGrade[currentGrade][`periodo${period}`]; // Obtener los temas del periodo seleccionado

    // Iterar sobre los temas y crear los botones
    for (const key in periodo) {
      if (periodo.hasOwnProperty(key)) {
        const topic = periodo[key]; // Obtener el objeto del tema
        const button = document.createElement("button");
        button.textContent = topic.title; // Usar el título del tema

        button.addEventListener('click', () => {

          const selectedTopicData = {
            grade: currentGrade,
            period: currentPeriod,
            topicKey: key
          };
          localStorage.setItem('selectedTopic', JSON.stringify(selectedTopicData))
          window.location.href = 'temas.html';
        });

        topicsList.appendChild(button);
      }
    }
  }
}

// Selecciona todos los botones period
const periodButtons = document.querySelectorAll('.period');

// Añadir el evento click a cada botón
periodButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Llamar a showPeriod cuando se hace click en un periodo
    const period = button.getAttribute('onclick').match(/'(\d)'/)[1]; // Extraer el periodo (1, 2, 3)
    showPeriod(period);
  });
});