const carousel = document.getElementById('carousel-container');
const runBtn = document.getElementById('run-btn');
const resetBtn = document.getElementById('reset-btn');
const addBtn = document.getElementById('add-btn');
''
const upload = document.getElementById('upload');

const selected_container = document.querySelector('.selected-container')

let isSpinning = false;
let currentIndex = 0;

// Captura os originais ANTES de clonar
let originalItems = [...document.querySelectorAll('.carrousel-item')];
let TOTAL = originalItems.length;

console.log(TOTAL)

const extraVoltas = 5;

function getItemHeight() {
    return originalItems[0].getBoundingClientRect().height;
}

function cloneItems() {
    // 3 cópias extras = 4x o conteúdo no DOM
    for (let i = 0; i < extraVoltas + 1; i++) {
        originalItems.forEach(item => {
            carousel.appendChild(item.cloneNode(true));
        });
    }
}

function getItemOffsets() {
    return originalItems.map(item => item.offsetTop);
}


function spin() {
    if (isSpinning) return;

    if (document.querySelectorAll('.carrousel-item').length === 0) return;
    isSpinning = true;
    runBtn.disabled = true;
    const offsets = getItemOffsets();
    const viewportHeight = document.querySelector('.viewport').getBoundingClientRect().height;
    const ITEM_HEIGHT = getItemHeight();
    const randomIndex = Math.floor(Math.random() * TOTAL);

    const itemTop = offsets[randomIndex];
    const itemHeight = originalItems[randomIndex].getBoundingClientRect().height;
    const offset = (viewportHeight / 2) - (itemHeight / 2); // centraliza
    // quanto precisa rolar no total pra chegar nesse item (passando pelas cópias)
    const totalDOMHeight = carousel.getBoundingClientRect().height;
    const extraScroll = totalDOMHeight / 4; // 1 volta completa pelos clones
    const endY = -(extraScroll + itemTop) + offset;

    carousel.style.transition = 'none';
    carousel.style.transform = `translateY(${-(randomIndex * ITEM_HEIGHT) + offset}px)`;

    requestAnimationFrame(() => requestAnimationFrame(() => {
        const duration = 8000;
        let startTime = null;
        const startY = 0;

        // 3 voltas completas antes de parar
        const minLoops = 3;
        const loopDistance = TOTAL / ITEM_HEIGHT;

        const targetY = -(itemTop + minLoops * loopDistance) + offset;
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 8);
            const currentY = startY + (targetY - startY) * eased;
            carousel.style.transform = `translateY(${currentY}px)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Snap invisível para o item original correspondente
                // snap para o offsetTop real do item nos originais
                carousel.style.transform = `translateY(${targetY}px)`;
                currentIndex = randomIndex;
                isSpinning = false;
                runBtn.disabled = false;
                const itemSorteado = originalItems[randomIndex];
                const imgSrc = itemSorteado.querySelector('img').src;

                const selectedContainer = document.querySelector('.selected-container');
                const selectedImg = selectedContainer.querySelector('img');

                selectedImg.src = imgSrc;
                selectedContainer.style.visibility = 'visible';
            }
        }

        requestAnimationFrame(animate);
    }));
}

function spin2() {
    if (isSpinning) return;

    if (document.querySelectorAll('.carrousel-item').length === 0) return;
    isSpinning = true;
    runBtn.disabled = true;
    const offsets = getItemOffsets();
    const viewportHeight = document.querySelector('.viewport').getBoundingClientRect().height;
    const ITEM_HEIGHT = getItemHeight();
    const randomIndex = Math.floor(Math.random() * TOTAL);

    const itemTop = offsets[randomIndex];
    const itemHeight = originalItems[randomIndex].getBoundingClientRect().height;
    const offset = (viewportHeight / 2) - (itemHeight / 2); // centraliza
    // quanto precisa rolar no total pra chegar nesse item (passando pelas cópias)
    const totalDOMHeight = carousel.getBoundingClientRect().height;
    const extraScroll = totalDOMHeight / 4; // 1 volta completa pelos clones
    const endY = -(extraScroll + itemTop) + offset;

    carousel.style.transition = 'none';
    carousel.style.transform = `translateY(${-(randomIndex * ITEM_HEIGHT) + offset}px)`;

    requestAnimationFrame(() => requestAnimationFrame(() => {
        const duration = 8000;
        let startTime = null;
        const startY = 0;
        const targetY = -(itemTop) + offset;
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 8);
            const currentY = startY + (targetY - startY) * eased;
            carousel.style.transform = `translateY(${currentY}px)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Snap invisível para o item original correspondente
                // snap para o offsetTop real do item nos originais
                carousel.style.transform = `translateY(${targetY}px)`;
                currentIndex = randomIndex;
                isSpinning = false;
                runBtn.disabled = false;
                const itemSorteado = originalItems[randomIndex];
                const imgSrc = itemSorteado.querySelector('img').src;

                const selectedContainer = document.querySelector('.selected-container');
                const selectedImg = selectedContainer.querySelector('img');

                selectedImg.src = imgSrc;
                selectedContainer.style.visibility = 'visible';
            }
        }

        requestAnimationFrame(animate);
    }));
}

function reset() {
    if (isSpinning) return;
    carousel.style.transition = 'transform 0.4s ease';
    carousel.style.transform = 'translateY(0)';
    currentIndex = 0; document.querySelector('.selected-container').style.visibility = 'hidden';
    setTimeout(() => { carousel.style.transition = 'none'; }, 400);
}

runBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', reset);
selected_container.addEventListener("click", () => {
    selected_container.style.visibility = 'hidden';

})

document.addEventListener("click", (e) => {

    if (e.target.id === 'add-images') {
        return;
    }
    else if (e.target.id === 'add-container') {
        toggle_add();
    }
})
addBtn.addEventListener("click", (e) => {
    console.log()
    toggle_add();
})

upload.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);

    console.dir(files)

    const fragment = create_list(files);

    carousel.innerHTML = '';

    carousel.appendChild(fragment);

    originalItems = [...document.querySelectorAll('.carrousel-item')]
    TOTAL = originalItems.length;
    cloneItems();
})

function toggle_add() {
    const addContainer = document.querySelector('.add-container')
    addContainer.classList.toggle('active')
}

function create_list(files) {
    const fragment = document.createDocumentFragment();

    files.forEach(file => {
        const card = document.createElement('div');
        card.className = 'carrousel-item';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file)

        card.appendChild(img)

        fragment.appendChild(card);
    })

    return fragment

}
