// Переменная для хранения предыдущей позиции прокрутки
let prevScrollpos = window.scrollY;

// Обработчик события прокрутки
window.onscroll = function () {
  const currentScrollPos = window.scrollY; // Текущая позиция прокрутки
  const navbar = document.getElementById("navbar");
  const myBtn = document.getElementById("myBtn");

  // Если прокрутка вверх, показываем навигационную панель и кнопку
  if (prevScrollpos > currentScrollPos) {
    navbar.style.top = "0";
    if (myBtn) {
      myBtn.style.display = "block";
    }
  } else {
    // Прокрутка вниз, скрываем панель
    navbar.style.top = "-60px";
  }

  // Обновляем позицию предыдущей прокрутки для последующих сравнений
  prevScrollpos = currentScrollPos;

  // Показываем или скрываем кнопку "Наверх"
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

// Открытие меню-бургер по клику
$(document).ready(function () {
  $('.header-burger').click(function (event) {
    // Переключение класса "active" у бургер-меню и самого меню
    $('.header-burger, .header-menu').toggleClass('active');
    // Блокировка прокрутки страницы при открытом меню
    $('body').toggleClass('lock');
  });
});

// Функция открытия модального окна по его ID
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block'; // Отображение модального окна
    document.body.classList.add('no-scroll'); // Блокировка прокрутки страницы
  }
}

// Функция закрытия модального окна
function closeModal(modal) {
  modal.style.display = 'none'; // Скрытие модального окна
  document.body.classList.remove('no-scroll'); // Разблокировка прокрутки
}

// Обработчики событий для открытия модальных окон по кнопкам
document.querySelectorAll('.openFigure').forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-id'); // Получение ID модального окна
    openModal(modalId);
  });
});

// Обработчики событий для закрытия модальных окон
document.querySelectorAll('.modal-wrapper').forEach(modal => {
  modal.querySelector('.close').addEventListener('click', () => {
    closeModal(modal);
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal); // Закрытие при клике вне содержимого окна
    }
  });
});

// Функция создания сцены с молекулой в Three.js
function createMoleculeScene(containerId, moleculeCreator) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0); // Установка цвета фона сцены

  const aspectRatio = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000); // Камера с перспективой
  const renderer = new THREE.WebGLRenderer({ antialias: true }); // Рендер с сглаживанием
  renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4);

  // Добавление рендера в контейнер для отображения сцены
  const container = document.getElementById(containerId).querySelector('.molecule-view');
  container.appendChild(renderer.domElement);

  // Управление вращением и масштабированием с помощью мыши
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Освещение сцены
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
  scene.add(hemisphereLight);

  // Вызов функции для создания молекулы
  moleculeCreator(scene);

  camera.position.z = 5; // Установка позиции камеры

  // Функция анимации сцены
  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Обновление управления
    renderer.render(scene, camera); // Рендеринг сцены
  }

  animate(); // Запуск анимации
}

// Функция создания атома с контуром
function createAtomWithOutline(position, color, outlineColor, size, scene) {
  const group = new THREE.Group(); // Группа для атома и его контура

  // Основная сфера атома
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshPhongMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  group.add(sphere);

  // Контур атома (более крупная сфера)
  const outlineGeometry = new THREE.SphereGeometry(size * 1.1, 32, 32);
  const outlineMaterial = new THREE.MeshBasicMaterial({ color: outlineColor, side: THREE.BackSide });
  const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
  group.add(outline);

  // Установка позиции группы атома
  group.position.set(position.x, position.y, position.z);
  scene.add(group);

  return group;
}

// Функция создания связи между двумя атомами
function createBond(startAtom, endAtom, radius, scene) {
  const startPosition = startAtom.position.clone();
  const endPosition = endAtom.position.clone();
  const direction = new THREE.Vector3().subVectors(endPosition, startPosition);
  const distance = direction.length();
  direction.normalize();

  // Создание цилиндра для связи между атомами
  const geometry = new THREE.CylinderGeometry(radius, radius, distance, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const bond = new THREE.Mesh(geometry, material);

  // Установка позиции и ориентации цилиндра
  bond.position.copy(startPosition).add(direction.clone().multiplyScalar(distance / 2));
  bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  scene.add(bond);
}

// Функции для создания конкретных молекул
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

// Пример создания молекул этилена, ацетилена и бензола - аналогично другим
function createEthyleneMolecule(scene) {
  const carbon1 = createAtomWithOutline(new THREE.Vector3(0, 0, 0), 0x000000, 0xffffff, 0.8, scene);
  const carbon2 = createAtomWithOutline(new THREE.Vector3(1.2, 0, 0), 0x000000, 0xffffff, 0.8, scene);

  // Связи между атомами
  createBond(carbon1, carbon2, 0.15, scene);
}

// Инициализация всех сцен с разными молекулами
createMoleculeScene('molecule1-container', createWaterMolecule);
createMoleculeScene('molecule2-container', createMethaneMolecule);
createMoleculeScene('molecule3-container', createEthyleneMolecule);

// Инициализация слайдера для изображений с помощью библиотеки slick
$(document).ready(function () {
  $('.slider').slick({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  });
});

// Тест на знание химии (вопросы и ответы)
const questions = [
  {
    question: "Какой химический элемент обозначается символом 'H'?",
    options: ["Водород", "Гелий", "Азот", "Кислород"],
    correctAnswer: 0
  },
];

// Отображение текущего вопроса
function showQuestion() {
  const question = questions[currentQuestionIndex];
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  questionEl.textContent = question.question;
  optionsEl.innerHTML = "";
}

// Отображение результата теста
function showResult() {
  const resultEl = document.getElementById("result");
  resultEl.innerHTML = `Ваш результат: ${score} из ${questions.length}`;
}
