const draggable = document.getElementById('draggable');

// Флаги, которые указывают, есть ли в контейнерах элементы
let sortedEmpty = true;
let unsortedEmpty = true;

// Координаты курсора относительно перетаскиваемого элемента, чтобы ничего не прыгало.
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
 * Перемещает элемент вслед за курсором с учетом скролла
 * @param {MouseEvent} event - событие перемещения мыши
 */
const elementDragHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();

    elementPosition.x = event.clientX + window.pageXOffset - cursorPosition.x;
    elementPosition.y = event.clientY + window.pageYOffset - cursorPosition.y;

    document.querySelector(
        '.draggable-element_new',
    ).style.transform = `translate(${elementPosition.x}px, ${elementPosition.y}px)`;
};

/**
 * Обработчик скролла, чтобы при скролле элемент тоже смещался, а не оставался на месте.
 * @param {Event} event - событие скролла
 */
const scrollHandler = (event) => {
    document.querySelector('.draggable-element_new').style.transform = `translate(${
        elementPosition.x + window.pageXOffset
    }px, ${elementPosition.y + window.pageYOffset}px)`;
};

/**
 * Обработка отпускания кнопки мыши. Проверяет где отпустили мышь, и если в этой точке находится контейнер
 * куда можно переместить элемент, то добавляет элемент в этот контейнер
 * @param {MouseEvent} event - событие mouseup
 */
const dropHandler = (event) => {
    try {
        document.removeEventListener('mousemove', elementDragHandler);
        document.removeEventListener('scroll', scrollHandler);

        // Определяем и запоминаем, что находится позади перетаскиваемого элемента
        const target = event.target;
        target.hidden = true;
        const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
        target.hidden = false;

        // Получаем контейнер, если он находится позади перетаскиваемого элемента
        let closestDropTarget = null;
        if (elementBelow) {
            closestDropTarget = elementBelow.closest('.droptarget');
        }

        // Проверяем, что делать с перетаскиваемым элементом. Если сзади контейнер для перетаскивания,
        // то добавляем элемент туда, предварительно поменяв класс. Иначе удаляем элемент со страницы.
        if (closestDropTarget && closestDropTarget === document.querySelector('.sorted')) {
            target.classList.remove('draggable-element_new');
            target.classList.add('draggable-element_sorted');

            if (sortedEmpty) {
                closestDropTarget.innerText = '';
                sortedEmpty = false;
            }

            target.style.transform = '';
            closestDropTarget.appendChild(target);
        } else if (closestDropTarget && closestDropTarget === document.querySelector('.unsorted')) {
            target.classList.remove('draggable-element_new');
            target.classList.add('draggable-element_unsorted');

            if (unsortedEmpty) {
                closestDropTarget.innerText = '';
                unsortedEmpty = false;
            }

            target.style.transform = '';
            target.style.left = `${
                event.clientX - closestDropTarget.getBoundingClientRect().left - cursorPosition.x + 12
            }px`;
            target.style.top = `${
                event.clientY - closestDropTarget.getBoundingClientRect().top - cursorPosition.y + 20
            }px`;

            closestDropTarget.appendChild(target);
        } else {
            document.querySelectorAll('.draggable-element_new').forEach((item) => {
                item.remove();
            });
        }
        document.removeEventListener('mouseup', dropHandler);
    } catch (err) {
        console.log(err);
    }
};

// Вешаем обработчик зажатия кнопки мыши, чтобы создать элемент перетаскивания.
// На созданный элемент вешаем обработчики, которые удаляем при отпускании мыши.
draggable.addEventListener('mousedown', (event) => {
    cursorPosition.x = event.clientX + window.pageXOffset;
    cursorPosition.y = event.clientY + window.pageYOffset;

    const newDragElement = document.createElement('div');
    newDragElement.classList.add('draggable-element_new');
    setRandomColor(newDragElement);
    document.body.appendChild(newDragElement);

    document.addEventListener('mousemove', elementDragHandler);
    document.addEventListener('scroll', scrollHandler);
    document.addEventListener('mouseup', dropHandler);
});
