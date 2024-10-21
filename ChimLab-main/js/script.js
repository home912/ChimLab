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
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const aspectRatio = window.innerWidth / window.innerHeight; // Получаем текущее соотношение сторон окна
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4); // Устанавливаем размер канвы


  const container = document.getElementById(containerId).querySelector('.molecule-view');
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
  scene.add(hemisphereLight);

  moleculeCreator(scene); // Функция, которая добавляет молекулы в сцену

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

// Функция для создания атомов с контуром
function createAtomWithOutline(position, color, outlineColor, size, scene) {
  const group = new THREE.Group();
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshPhongMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  group.add(sphere);

  const outlineGeometry = new THREE.SphereGeometry(size * 1.1, 32, 32);
  const outlineMaterial = new THREE.MeshBasicMaterial({ color: outlineColor, side: THREE.BackSide });
  const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
  group.add(outline);

  group.position.set(position.x, position.y, position.z);
  scene.add(group);

  return group;
}

// Функция для создания связи между атомами
function createBond(startAtom, endAtom, radius, scene) {
  const startPosition = startAtom.position.clone();
  const endPosition = endAtom.position.clone();
  const direction = new THREE.Vector3().subVectors(endPosition, startPosition);
  const distance = direction.length();
  direction.normalize();

  const geometry = new THREE.CylinderGeometry(radius, radius, distance, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const bond = new THREE.Mesh(geometry, material);

  // Расположение и вращение для правильной ориентации
  bond.position.copy(startPosition).add(direction.clone().multiplyScalar(distance / 2));
  bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

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

document.getElementById("start-test-btn").addEventListener("click", function () {
  this.style.display = "none";
  document.getElementById("quiz").style.display = "block";
  showQuestion();
});

document.getElementById("next-btn").addEventListener("click", function () {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    const answerIndex = parseInt(selectedAnswer.value);
    if (answerIndex === questions[currentQuestionIndex].correct) {
      score += 100 / questions.length;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }
});

function showQuestion() {
  const questionContainer = document.getElementById("question");
  const answersContainer = document.getElementById("answers");
  const nextBtn = document.getElementById("next-btn");

  questionContainer.textContent = questions[currentQuestionIndex].question;
  answersContainer.innerHTML = '';

  questions[currentQuestionIndex].answers.forEach((answer, index) => {
    const answerLabel = document.createElement('label');
    answerLabel.innerHTML = `
          <input type="radio" name="answer" value="${index}">
          ${answer}
      `;
    answersContainer.appendChild(answerLabel);
    answersContainer.appendChild(document.createElement('br'));
  });

  nextBtn.style.display = "block";
}

function showResult() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("score").textContent = Math.round(score);
}
