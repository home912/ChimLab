// Переменная для хранения предыдущей позиции прокрутки
let prevScrollpos = window.scrollY;

// Обработчик события прокрутки
window.onscroll = function () {
  // Текущая позиция прокрутки
  const currentScrollPos = window.scrollY;

  // Получаем элемент навигационной панели
  const navbar = document.getElementById("navbar");
  const myBtn = document.getElementById("myBtn");

  // Проверяем, скроллим ли вверх или вниз
  if (prevScrollpos > currentScrollPos) {
    // Если скроллим вверх, показываем навигационную панель
    navbar.style.top = "0";
    if (myBtn) {
      myBtn.style.display = "block";
    }
  } else {
    // Если скроллим вниз, скрываем навигационную панель
    navbar.style.top = "-60px";
  }

  // Обновляем позицию предыдущей прокрутки
  prevScrollpos = currentScrollPos;

  // Показываем или скрываем кнопку "Наверх" в зависимости от текущей позиции
  if (currentScrollPos > 0) {
    if (myBtn) {
      myBtn.style.display = "block";
    }
  } else {
    if (myBtn) {
      myBtn.style.display = "none";
    }
  }
};

/* функция открытия меню-бургер */
$(document).ready(function () {
  $('.header-burger').click(function (event) {
    $('.header-burger, .header-menu').toggleClass('active');
    $('body').toggleClass('lock');
  });
});


// Функция для открытия модального окна
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
    document.body.classList.add('no-scroll'); // Блокировка прокрутки
  }
}

// Функция для закрытия модального окна
function closeModal(modal) {
  modal.style.display = 'none';
  document.body.classList.remove('no-scroll'); // Разрешение прокрутки
}

// Добавление обработчиков событий для кнопок и закрытия
document.querySelectorAll('.openFigure').forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-id');
    openModal(modalId);
  });
});

document.querySelectorAll('.modal-wrapper').forEach(modal => {
  // Закрытие при клике на крестик
  modal.querySelector('.close').addEventListener('click', () => {
    closeModal(modal);
  });

  // Закрытие при клике вне модального окна
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});







function createMoleculeScene(containerId, moleculeCreator) {
  // Создаем новую сцену в Three.js, которая будет содержать все объекты
  const scene = new THREE.Scene();
  // Устанавливаем фоновый цвет сцены (светло-серый цвет)
  scene.background = new THREE.Color(0xf0f0f0);

  // Определяем соотношение сторон для камеры, основываясь на размере окна браузера
  const aspectRatio = window.innerWidth / window.innerHeight;
  // Создаем перспективную камеру для визуализации 3D-сцены
  // Параметры: угол обзора (75 градусов), соотношение сторон, ближняя и дальняя границы видимости
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

  // Создаем рендерер с антиалиасингом для сглаживания краев объектов
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  // Задаем размеры для рендерера (40% от ширины и высоты окна браузера)
  renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4);

  // Находим элемент контейнера в DOM с заданным ID и классом '.molecule-view'
  const container = document.getElementById(containerId).querySelector('.molecule-view');
  // Добавляем элемент канвы (canvas), созданный рендерером, в этот контейнер
  container.appendChild(renderer.domElement);

  // Создаем контролы для навигации камеры с помощью мыши
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Добавляем фоновый источник света, который равномерно освещает всю сцену
  const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Белый свет с интенсивностью 1
  scene.add(ambientLight);

  // Добавляем полусферический источник света для имитации естественного освещения
  // Верхний свет — белый, нижний (направленный вниз) — сероватый, интенсивность 0.8
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
  scene.add(hemisphereLight);

  // Вызов переданной функции для добавления молекул в текущую сцену
  moleculeCreator(scene);

  // Устанавливаем начальное положение камеры, чтобы она смотрела на сцену с некоторого расстояния
  camera.position.z = 5;

  // Функция для анимации сцены (обновление рендера каждый кадр)
  function animate() {
    requestAnimationFrame(animate); // Запрос на выполнение следующего кадра анимации
    controls.update();              // Обновляем контролы камеры
    renderer.render(scene, camera); // Рендерим сцену с текущей позиции камеры
  }

  // Запускаем анимацию
  animate();
}

// Функция для создания атомов с контуром
function createAtomWithOutline(position, color, outlineColor, size, scene) {
  // Создаем группу для объединения атома и его контура
  const group = new THREE.Group();

  // Создаем геометрию сферы для атома (атома) с заданным размером
  // 32, 32 — это количество сегментов по ширине и высоте для более плавного отображения
  const geometry = new THREE.SphereGeometry(size, 32, 32);

  // Создаем материал для атома с использованием цвета, который передан в параметрах
  const material = new THREE.MeshPhongMaterial({ color: color });

  // Создаем сетку (mesh) для атома, используя геометрию и материал
  const sphere = new THREE.Mesh(geometry, material);

  // Добавляем созданный атом в группу
  group.add(sphere);

  // Создаем геометрию для контура атома, чуть большего размера (увеличенного на 10%)
  const outlineGeometry = new THREE.SphereGeometry(size * 1.1, 32, 32);

  // Создаем материал для контура атома. Используем `MeshBasicMaterial`, чтобы он не реагировал на освещение.
  // Также устанавливаем параметр `side: THREE.BackSide`, чтобы отрисовывать внутреннюю часть контура,
  // тем самым создавая эффект оболочки вокруг атома
  const outlineMaterial = new THREE.MeshBasicMaterial({ color: outlineColor, side: THREE.BackSide });

  // Создаем сетку (mesh) для контура с использованием геометрии и материала
  const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);

  // Добавляем созданный контур в группу
  group.add(outline);

  // Устанавливаем позицию группы (атом + контур) на заданные координаты
  group.position.set(position.x, position.y, position.z);

  // Добавляем всю группу в сцену
  scene.add(group);

  // Возвращаем группу для дальнейшего использования
  return group;
}


// Функция для создания связи между двумя атомами
function createBond(startAtom, endAtom, radius, scene) {
  // Получаем позиции начального и конечного атомов
  const startPosition = startAtom.position.clone();
  const endPosition = endAtom.position.clone();

  // Вычисляем вектор направления от начального атома к конечному
  const direction = new THREE.Vector3().subVectors(endPosition, startPosition);

  // Определяем расстояние между атомами
  const distance = direction.length();

  // Нормализуем вектор направления (делаем его единичным)
  direction.normalize();

  // Создаем геометрию цилиндра, который будет служить связью между атомами
  // `radius` — радиус цилиндра (толщина связи)
  // `distance` — длина цилиндра, равная расстоянию между атомами
  // `32` — количество сегментов цилиндра для плавности
  const geometry = new THREE.CylinderGeometry(radius, radius, distance, 32);

  // Создаем простой материал для связи черного цвета
  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

  // Создаем сетку (mesh) для связи с использованием геометрии и материала
  const bond = new THREE.Mesh(geometry, material);

  // Устанавливаем позицию связи между атомами:
  // Перемещаем её в среднюю точку между начальным и конечным атомами
  bond.position.copy(startPosition).add(direction.clone().multiplyScalar(distance / 2));

  // Устанавливаем правильную ориентацию связи:
  // Вращаем цилиндр, чтобы он был направлен от одного атома к другому
  // Для этого используем метод `quaternion.setFromUnitVectors`, который преобразует единичный вектор (0, 1, 0) 
  // в требуемый вектор направления (направление связи)
  bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  // Добавляем связь в сцену
  scene.add(bond);
}


// Функции для создания молекул
function createWaterMolecule(scene) {
  const oxygen = createAtomWithOutline(new THREE.Vector3(0, 0, 0), 0xff0000, 0x000000, 0.8, scene);
  const hydrogen1 = createAtomWithOutline(new THREE.Vector3(1.5, 1, 0), 0xffffff, 0x000000, 0.5, scene);
  const hydrogen2 = createAtomWithOutline(new THREE.Vector3(1.5, -1, 0), 0xffffff, 0x000000, 0.5, scene);
  createBond(oxygen, hydrogen1, 0.1, scene);
  createBond(oxygen, hydrogen2, 0.1, scene);
}

function createMethaneMolecule(scene) {
  const carbon = createAtomWithOutline(new THREE.Vector3(0, 0, 0), 0x000000, 0xffffff, 0.8, scene);
  const hydrogen1 = createAtomWithOutline(new THREE.Vector3(1, 1, 0), 0xffffff, 0x000000, 0.5, scene);
  const hydrogen2 = createAtomWithOutline(new THREE.Vector3(1, -1, 0), 0xffffff, 0x000000, 0.5, scene);
  const hydrogen3 = createAtomWithOutline(new THREE.Vector3(-1, 1, 0), 0xffffff, 0x000000, 0.5, scene);
  const hydrogen4 = createAtomWithOutline(new THREE.Vector3(-1, -1, 0), 0xffffff, 0x000000, 0.5, scene);

  createBond(carbon, hydrogen1, 0.1, scene);
  createBond(carbon, hydrogen2, 0.1, scene);
  createBond(carbon, hydrogen3, 0.1, scene);
  createBond(carbon, hydrogen4, 0.1, scene);
}

function createEthyleneMolecule(scene) {
  const carbon1 = createAtomWithOutline(new THREE.Vector3(0, 0, 0), 0x000000, 0xffffff, 0.8, scene);
  const carbon2 = createAtomWithOutline(new THREE.Vector3(1.2, 0, 0), 0x000000, 0xffffff, 0.8, scene);

  const hydrogen1 = createAtomWithOutline(new THREE.Vector3(-1.5, 1, 0), 0xffffff, 0x000000, 0.5, scene);
  const hydrogen2 = createAtomWithOutline(new THREE.Vector3(-1.5, -1, 0), 0xffffff, 0x000000, 0.5, scene);
  const hydrogen3 = createAtomWithOutline(new THREE.Vector3(2.8, 1, 0), 0xffffff, 0x000000, 0.5, scene);
  const hydrogen4 = createAtomWithOutline(new THREE.Vector3(2.8, -1, 0), 0xffffff, 0x000000, 0.5, scene);

  createBond(carbon1, hydrogen1, 0.1, scene);
  createBond(carbon1, hydrogen2, 0.1, scene);
  createBond(carbon2, hydrogen3, 0.1, scene);
  createBond(carbon2, hydrogen4, 0.1, scene);

  createBond(carbon1, carbon2, 0.1, scene); // Двойная связь
}

function createAcetyleneMolecule(scene) {
  const carbon1 = createAtomWithOutline(new THREE.Vector3(0, 0, 0), 0x000000, 0xffffff, 0.7, scene);
  const carbon2 = createAtomWithOutline(new THREE.Vector3(1.2, 0, 0), 0x000000, 0xffffff, 0.7, scene);

  const hydrogen1 = createAtomWithOutline(new THREE.Vector3(-1.5, 0, 0), 0xffffff, 0x000000, 0.5, scene);
  const hydrogen2 = createAtomWithOutline(new THREE.Vector3(2.8, 0, 0), 0xffffff, 0x000000, 0.5, scene);

  createBond(carbon1, hydrogen1, 0.1, scene);
  createBond(carbon2, hydrogen2, 0.1, scene);
  createBond(carbon1, carbon2, 0.1, scene); // Тройная связь
}

function createBenzeneMolecule(scene) {
  const carbons = [];
  const hydrogenPositions = [];
  const angleOffset = Math.PI / 3; // 60 градусов
  const carbonSize = 0.2; // Уменьшенный размер углерода
  const hydrogenSize = 0.15; // Уменьшенный размер водорода
  const bondLength = 1; // Длина связи

  // Создаем углероды в форме шестиугольника
  for (let i = 0; i < 6; i++) {
    const angle = i * angleOffset;
    const carbon = createAtomWithOutline(
      new THREE.Vector3(Math.cos(angle) * bondLength, Math.sin(angle) * bondLength, 0),
      0x000000, 0xffffff, carbonSize, scene // Уменьшен размер углерода
    );
    carbons.push(carbon);
  }

  // Создаем связи между углеродами
  for (let i = 0; i < 6; i++) {
    createBond(carbons[i], carbons[(i + 1) % 6], 0.1, scene); // Связи между углеродами
  }


  // Создаем водороды на внешней стороне молекулы
  for (let i = 0; i < 6; i++) {
    const angle = i * angleOffset;
    const hydrogenPosition = new THREE.Vector3(Math.cos(angle) * (bondLength + 0.4), Math.sin(angle) * (bondLength + 0.4), 0);
    createAtomWithOutline(hydrogenPosition, 0xffffff, 0x000000, hydrogenSize, scene); // Уменьшен размер водородов
  }
}


// Инициализация всех сцен
createMoleculeScene('molecule1-container', createWaterMolecule);
createMoleculeScene('molecule2-container', createMethaneMolecule);
createMoleculeScene('molecule3-container', createEthyleneMolecule);
createMoleculeScene('molecule4-container', createAcetyleneMolecule);
createMoleculeScene('molecule5-container', createBenzeneMolecule);

// Инициализация слайдера
$(document).ready(function () {
  $('.slider').slick({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  });
});




const questions = [
  { question: "Что происходит при образовании ионной связи?", answers: ["Один атом отдает электрон другому.", "Атомы делятся электронами.", "Атомы объединяются в кристаллическую решетку."], correct: 0 },
  { question: "Как называется связь между атомами с одинаковой электроотрицательностью?", answers: ["Полярная ковалентная.", "Неполярная ковалентная.", "Ионная."], correct: 1 },
  { question: "Какая из перечисленных молекул образована ионной связью?", answers: ["H₂O (вода)", "CO₂ (углекислый газ)", "NaCl (поваренная соль)"], correct: 2 },
  { question: "Что представляет собой водородная связь?", answers: ["Притяжение между положительно заряженными атомами.", "Связь между атомом водорода и электроотрицательным атомом.", "Передача электрона от одного атома к другому."], correct: 1 },
  { question: "Какая связь существует между атомами углерода в алкенах?", answers: ["Одинарная ковалентная", "Двойная ковалентная", "Ионная"], correct: 1 },
  { question: "Какой тип связи возникает при создании молекулы кислорода (O₂)?", answers: ["Ионная связь", "Двойная ковалентная связь", "Металлическая связь"], correct: 1 },
  { question: "Что удерживает атомы в кристалле алюминия?", answers: ["Ковалентная связь", "Ионная связь", "Металлическая связь"], correct: 2 },
  { question: "Какая связь возникает между молекулами воды, создавая её особые свойства?", answers: ["Металлическая связь", "Ионная связь", "Водородная связь"], correct: 2 },
  { question: "Какая из этих молекул образована ковалентной связью?", answers: ["NaCl (поваренная соль)", "CH₄ (метан)", "MgO (оксид магния)"], correct: 1 },
  { question: "Какая связь характерна для молекул, имеющих диполи?", answers: ["Ионная связь", "Полярная ковалентная связь", "Металлическая связь"], correct: 1 },
  { question: "Какая связь характерна для образования белковых молекул?", answers: ["Пептидная связь", "Ионная связь", "Водородная связь"], correct: 0 },
  { question: "Что происходит с электронами при образовании металлической связи?", answers: ["Электроны обмениваются между атомами.", "Электроны свободно перемещаются между атомами.", "Электроны полностью передаются от одного атома другому."], correct: 1 },
  { question: "Какая связь возникает между атомами углерода в алканах?", answers: ["Двойная ковалентная", "Неполярная одинарная ковалентная", "Ионная"], correct: 1 },
  { question: "Какой тип связи характерен для молекулы аммиака (NH₃)?", answers: ["Ионная", "Полярная ковалентная", "Металлическая"], correct: 1 },
  { question: "Что образуется при разрыве ковалентной связи?", answers: ["Ионы", "Радикалы", "Протон"], correct: 1 }
];

let currentQuestionIndex = 0;
let score = 0;
let answersLog = [];  // Сохраняет информацию о каждом ответе пользователя

// Функция для показа вопроса с номером
function showQuestion() {
  const questionContainer = document.getElementById("question-container");
  const questionElem = document.getElementById("question");
  const answersElem = document.getElementById("answers");

  // Очистка предыдущих ответов
  answersElem.innerHTML = "";

  // Текущий вопрос
  const currentQuestion = questions[currentQuestionIndex];

  // Отображаем номер вопроса и сам вопрос
  questionElem.innerText = `Вопрос ${currentQuestionIndex + 1}/${questions.length}: ${currentQuestion.question}`;

  // Отображаем варианты ответов как радиокнопки
  currentQuestion.answers.forEach((answer, index) => {
    const label = document.createElement("label");
    const radio = document.createElement("input");

    radio.type = "radio";
    radio.name = "answer"; // Все радиокнопки должны иметь одно имя для группировки
    radio.value = index; // Значение будет индекс ответа
    radio.classList.add("answer-radio");

    label.appendChild(radio);
    label.appendChild(document.createTextNode(answer));
    answersElem.appendChild(label);
    answersElem.appendChild(document.createElement("br")); // Переход на новую строку
  });

  // Показать кнопку "Показать результат", если это последний вопрос
  document.getElementById("next-btn").innerHTML = currentQuestionIndex === questions.length - 1 ? "Показать результат <span class='btnarrow'>▶▶</span>" : "Следующий вопрос <span class='btnarrow'>▶▶</span>";
  document.getElementById("next-btn").style.display = "block"; // Показываем кнопку
}

// Обработка выбора ответа
function selectAnswer() {
  const currentQuestion = questions[currentQuestionIndex];
  const selectedRadio = document.querySelector('input[name="answer"]:checked'); // Получаем выбранный элемент

  if (!selectedRadio) return; // Если ничего не выбрано, ничего не делаем

  const selectedAnswer = parseInt(selectedRadio.value); // Получаем значение радиокнопки
  const isCorrect = selectedAnswer === currentQuestion.correct;

  if (isCorrect) score += 1;

  // Сохранение результата ответа
  answersLog.push({
    question: currentQuestion.question,
    selectedAnswer: currentQuestion.answers[selectedAnswer],
    correctAnswer: currentQuestion.answers[currentQuestion.correct],
    isCorrect: isCorrect
  });

  // Переход к следующему вопросу или к результатам
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex += 1;
    showQuestion();
  } else {
    showResults();
  }
}

// Отображение результатов
function showResults() {
  const quizElem = document.getElementById("quiz");
  const resultElem = document.getElementById("result");
  const scoreElem = document.getElementById("score");
  const resultDetails = document.createElement("div");

  // Скрываем тест и показываем результаты
  quizElem.style.display = "none";
  resultElem.style.display = "block";

  // Подсчет баллов
  scoreElem.innerText = Math.round((score / questions.length) * 100);

  // Отображение каждого вопроса с правильными и неправильными ответами
  answersLog.forEach((log, index) => {
    const questionResult = document.createElement("p");
    const symbol = log.isCorrect ? "✔️" : "❌";
    questionResult.innerHTML = `<strong>${index + 1}. ${log.question}</strong><br>
          Ваш ответ: ${log.selectedAnswer} ${symbol}<br>
          Правильный ответ: ${log.correctAnswer}`;
    resultDetails.appendChild(questionResult);
  });
  resultElem.appendChild(resultDetails);
}

// Обработчик для кнопки "Начать тест"
document.getElementById("start-test-btn").addEventListener("click", function () {
  this.style.display = "none";
  document.getElementById("quiz").style.display = "block";
  showQuestion();
});

// Обновите обработчик для кнопки "Следующий вопрос"
document.getElementById("next-btn").addEventListener("click", selectAnswer);

google.load("visualization", "1", { packages: ["corechart"] });
google.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Возраст', 'Мужчины', 'Женщины'],
    ['< 18', 21, 40],
    ['18-35', 59, 75],
    ['35 >', 29, 11]
  ]);
  var options = {
    title: 'По возрасту',
    hAxis: { title: 'Возраст' },
    vAxis: { title: 'Количество людей' }
  };
  var chart = new google.visualization.ColumnChart(document.getElementById('views'));
  chart.draw(data, options);
}

