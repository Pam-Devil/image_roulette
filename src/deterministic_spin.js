const carousel = document.getElementById('carousel-container');
const runBtn = document.getElementById('run-btn');
const resetBtn = document.getElementById('reset-btn');
const addBtn = document.getElementById('add-btn');
const upload = document.getElementById('upload');

const selected_container = document.querySelector('.selected-container');

let isSpinning = false;
let currentIndex = 0;

let originalItems = [];
let TOTAL = 0;

// =========================
// CONFIG
// =========================
const EXTRA_LOOPS = 40; // densidade da fita
const DURATION = 6000;
const SPEED = 18;

// =========================
// UTILS
// =========================
function getItemHeight() {
    return originalItems[0].getBoundingClientRect().height;
}

// =========================
// BUILD / CLONE (fita longa)
// =========================
function cloneItems() {
    carousel.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < EXTRA_LOOPS; i++) {
        for (let j = 0; j < TOTAL; j++) {
            const clone = originalItems[j].cloneNode(true);
            fragment.appendChild(clone);
        }
    }

    carousel.appendChild(fragment);
}

// =========================
// SPIN
// =========================
function spin() {
    if (isSpinning || TOTAL === 0) return;

    isSpinning = true;
    runBtn.disabled = true;

    const resultIndex = Math.floor(Math.random() * TOTAL);

    const ITEM_HEIGHT = getItemHeight();
    const viewport = document.querySelector('.viewport').getBoundingClientRect();
    const centerOffset = (viewport.height / 2) - (ITEM_HEIGHT / 2);

    const totalRenderedItems = EXTRA_LOOPS * TOTAL;

    // posição final garantida dentro da fita longa
    const targetIndex = totalRenderedItems - TOTAL + resultIndex;

    const targetY = -(targetIndex * ITEM_HEIGHT) + centerOffset;

    let startTime = null;
    let currentY = 0;

    function animate(t) {
        if (!startTime) startTime = t;

        const elapsed = t - startTime;
        const progress = elapsed / DURATION;

        currentY -= SPEED;
        carousel.style.transform = `translateY(${currentY}px)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            carousel.style.transition =
                'transform 0.9s cubic-bezier(0.2, 0.9, 0.2, 1)';

            carousel.style.transform = `translateY(${targetY}px)`;

            setTimeout(() => {
                isSpinning = false;
                runBtn.disabled = false;

                const imgSrc =
                    originalItems[resultIndex].querySelector('img').src;

                const img = selected_container.querySelector('img');
                img.src = imgSrc;

                selected_container.style.visibility = 'visible';
            }, 900);
        }
    }

    requestAnimationFrame(animate);
}

// =========================
// RESET
// =========================
function reset() {
    if (isSpinning) return;

    carousel.style.transition = 'transform 0.4s ease';
    carousel.style.transform = 'translateY(0)';

    selected_container.style.visibility = 'hidden';
}

// =========================
// UPLOAD
// =========================
upload.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);

    const fragment = document.createDocumentFragment();

    files.forEach(file => {
        const card = document.createElement('div');
        card.className = 'carrousel-item';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);

        card.appendChild(img);
        fragment.appendChild(card);
    });

    carousel.innerHTML = '';
    carousel.appendChild(fragment);

    originalItems = [...document.querySelectorAll('.carrousel-item')];
    TOTAL = originalItems.length;

    cloneItems();
});

// =========================
// EVENTS
// =========================
runBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', reset);

selected_container.addEventListener('click', () => {
    selected_container.style.visibility = 'hidden';
});
// 
function toggle_add() {
    const addContainer = document.querySelector('.add-container')
    addContainer.classList.toggle('active')
}

addBtn.addEventListener("click", (e) => {
    console.log()
    toggle_add();
})
document.addEventListener("click", (e) => {

    if (e.target.id === 'add-images') {
        return;
    }
    else if (e.target.id === 'add-container') {
        toggle_add();
    }
})

/* upload.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);

    const fragment = document.createDocumentFragment();

    files.forEach(file => {
        const card = document.createElement('div');
        card.className = 'carrousel-item';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);

        card.appendChild(img);
        fragment.appendChild(card);
    });

    carousel.innerHTML = '';
    carousel.appendChild(fragment);

    originalItems = [...document.querySelectorAll('.carrousel-item')];
    TOTAL = originalItems.length;
}); */
/* 
runBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', reset);

selected_container.addEventListener('click', () => {
    selected_container.style.visibility = 'hidden';
}); */