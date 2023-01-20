const draggable = document.getElementById('draggable');

// Флаги, которые указывают, есть ли в контейнерах элементы
let sortedEmpty = true;
let unsortedEmpty = true;

// Координаты указателя относительно перетаскиваемого элемента, чтобы ничего не прыгало.
const cursorPosition = {
    x: 0,
    y: 0,
};

// Координаты перетаскиваемого элемента относительно страницы
const elementPosition = {
    x: 0,
    y: 0,
};

/**
 * Присваивает случайный фоновый цвет элементу.
 * @param {Element} element - созданный элемент для перетаскивания
 */
const setRandomColor = (element) => {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    element.style.background = `rgb(${r},${g},${b})`;
};

/**
 * Перемещает элемент вслед за указателем с учетом скролла
 * @param {PointerEvent} event - событие перемещения
 */
const elementDragHandler = (event) => {
    event.preventDefault();

    elementPosition.x = event.clientX - cursorPosition.x;
    elementPosition.y = event.clientY - cursorPosition.y;

    if (
        window.innerHeight + 10 < event.clientY + 10 &&
        event.clientY + window.scrollY <= document.documentElement.offsetHeight
    ) {
        window.scrollTo({
            top: window.scrollY + 150,
            behavior: 'smooth',
        });
    }

    if (window.scrollY > 0 && event.clientY < 20) {
        window.scrollTo({
            top: window.scrollY - 150,
            behavior: 'smooth',
        });
    }

    document.querySelector('.draggable-element_new').style.transform = `translate(${
        elementPosition.x + window.scrollX
    }px, ${elementPosition.y + window.scrollY}px)`;
};

/**
 * Обработчик скролла, чтобы при скролле элемент тоже смещался, а не оставался на месте.
 * @param {Event} event - событие скролла
 */
const scrollHandler = (event) => {
    event.preventDefault();
    document.querySelector('.draggable-element_new').style.transform = `translate(${
        elementPosition.x + window.scrollX
    }px, ${elementPosition.y + window.scrollY}px)`;
};

/**
 * Обработка завершения перетаскивания. Проверяет координаты завершения драгндропа, и если в этой точке находится контейнер
 * куда можно переместить элемент, то добавляет элемент в этот контейнер
 * @param {PointerEvent} event - событие pointerup
 */
const dropHandler = (event) => {
    document.removeEventListener('pointermove', elementDragHandler);
    document.removeEventListener('scroll', scrollHandler);

    // Определяем и запоминаем, что находится позади перетаскиваемого элемента
    const dragElement = document.querySelector('.draggable-element_new');
    let elementBelow = null;
    if (dragElement) {
        dragElement.hidden = true;
        elementBelow = document.elementFromPoint(event.clientX, event.clientY);
        dragElement.hidden = false;
    }

    // Получаем контейнер, если он находится позади перетаскиваемого элемента
    let closestDropTarget = null;
    if (elementBelow) {
        closestDropTarget = elementBelow.closest('.droptarget');
    }

    // Проверяем, что делать с перетаскиваемым элементом. Если сзади контейнер для перетаскивания,
    // то добавляем элемент туда, предварительно поменяв класс. Иначе удаляем элемент со страницы.
    if (dragElement && closestDropTarget && closestDropTarget === document.querySelector('.sorted')) {
        dragElement.classList.remove('draggable-element_new');
        dragElement.classList.add('draggable-element_sorted');

        if (sortedEmpty) {
            closestDropTarget.innerText = '';
            sortedEmpty = false;
        }

        dragElement.style.transform = '';
        closestDropTarget.appendChild(dragElement);
    } else if (dragElement && closestDropTarget && closestDropTarget === document.querySelector('.unsorted')) {
        dragElement.classList.remove('draggable-element_new');
        dragElement.classList.add('draggable-element_unsorted');

        if (unsortedEmpty) {
            closestDropTarget.innerText = '';
            unsortedEmpty = false;
        }

        dragElement.style.transform = '';
        dragElement.style.left = `${
            event.clientX - closestDropTarget.getBoundingClientRect().left - cursorPosition.x + 12
        }px`;
        dragElement.style.top = `${
            event.clientY - closestDropTarget.getBoundingClientRect().top - cursorPosition.y + 20
        }px`;

        closestDropTarget.appendChild(dragElement);
    } else {
        document.querySelectorAll('.draggable-element_new').forEach((item) => {
            item.remove();
        });
    }
    document.removeEventListener('pointerup', dropHandler);
};

// Вешаем обработчик pointerdown, чтобы создать элемент перетаскивания при задатии кнопки мыши или при таче.
// На созданный элемент вешаем обработчики, которые удаляем при событии pointerup.
draggable.addEventListener('pointerdown', (event) => {
    cursorPosition.x = event.clientX + window.scrollX;
    cursorPosition.y = event.clientY + window.scrollY;

    const newDragElement = document.createElement('div');
    newDragElement.classList.add('draggable-element_new');
    setRandomColor(newDragElement);
    document.body.appendChild(newDragElement);

    document.addEventListener('pointermove', elementDragHandler);
    document.addEventListener('scroll', scrollHandler);
    document.addEventListener('pointerup', dropHandler);
});
