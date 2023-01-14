const draggable = document.getElementById('draggable');
let target = '';
let elementBelow = null;
let sortedEmpty = true;
let unsortedEmpty = true;
const cursorPosition = {
    x: 0,
    y: 0,
};
const elementPosition = {
    x: 0,
    y: 0,
};

const setRandomColor = (element) => {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    element.style.background = `rgb(${r},${g},${b})`;
};

const elementDragHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();
    elementPosition.x = event.clientX + window.pageXOffset - cursorPosition.x;
    elementPosition.y = event.clientY + window.pageYOffset - cursorPosition.y;

    document.querySelector(
        '.draggable-element_new',
    ).style.transform = `translate(${elementPosition.x}px, ${elementPosition.y}px)`;
};

const elementScrollHandler = (event) => {
    document.querySelector('.draggable-element_new').style.transform = `translate(${
        elementPosition.x + window.pageXOffset
    }px, ${elementPosition.y + window.pageYOffset}px)`;
};

const mouseUpHandler = (event) => {
    document.removeEventListener('mousemove', elementDragHandler);
    document.removeEventListener('scroll', elementScrollHandler);

    target = event.target;
    target.hidden = true;
    elementBelow = document.elementFromPoint(event.clientX, event.clientY).closest('.droptarget');
    target.hidden = false;

    if (elementBelow === document.querySelector('.sorted')) {
        target.classList.remove('draggable-element_new');
        target.classList.add('draggable-element_sorted');
        if (sortedEmpty) {
            elementBelow.innerText = '';
            sortedEmpty = false;
        }
        target.style.transform = '';
        elementBelow.appendChild(target);
    } else if (elementBelow === document.querySelector('.unsorted')) {
        target.classList.remove('draggable-element_new');
        target.classList.add('draggable-element_unsorted');
        if (unsortedEmpty) {
            elementBelow.innerText = '';
            unsortedEmpty = false;
        }
        target.style.transform = '';
        target.style.left = `${event.clientX - elementBelow.getBoundingClientRect().left - cursorPosition.x + 20}px`;
        target.style.top = `${event.clientY - elementBelow.getBoundingClientRect().top - cursorPosition.y + 20}px`;
        elementBelow.appendChild(target);
    } else {
        document.querySelectorAll('.draggable-element_new').forEach((item) => {
            item.remove();
        });
    }
    document.removeEventListener('mouseup', mouseUpHandler);
};

draggable.addEventListener('mousedown', (event) => {
    cursorPosition.x = event.clientX + window.pageXOffset;
    cursorPosition.y = event.clientY + window.pageYOffset;
    const newDragElement = document.createElement('div');
    newDragElement.classList.add('draggable-element_new');
    setRandomColor(newDragElement);
    document.body.appendChild(newDragElement);

    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('mousemove', elementDragHandler);
    document.addEventListener('scroll', elementScrollHandler);
});
