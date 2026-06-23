const carousel = document.getElementById('carousel-container');
const runBtn = document.getElementById('run-btn');
const resetBtn = document.getElementById('reset-btn');
const addBtn = document.getElementById('add-btn');
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

function fakeSpin(duration = 2000) {
    const start = performance.now();

    function animate(t) {
        const elapsed = t - start;
        const progress = elapsed / duration;

        const speed = 10; // px por frame (ou baseado em tempo)
        const y = -progress * speed * duration;

        carousel.style.transform = `translateY(${y}px)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Removemos a função fakeSpin antiga que usava requestAnimationFrame

function realSpin() {
    return new Promise((resolve) => {
        // 1. Sorteia o item (0 a TOTAL - 1)
        const randomIndex = Math.floor(Math.random() * TOTAL);
        
        // Pegamos a altura de um item para calcular as voltas
        const itemHeight = getItemHeight();
        
        // 2. Calcula a posição do item original centralizado no viewport
        const viewportHeight = document.querySelector('.viewport').offsetHeight;
        const offset = (viewportHeight / 2) - (itemHeight / 2);
        const baseTargetY = -(randomIndex * itemHeight) + offset;

        // 3. O SEGREDO: Adicionamos o deslocamento das "voltas extras" (as cópias que você criou)
        // Isso faz o carrossel rodar várias vezes antes de parar no item certo.
        const voltasEmPixels = extraVoltas * (TOTAL * itemHeight);
        const finalTargetY = baseTargetY - voltasEmPixels;

        // Limpa transições anteriores e força o carrossel a começar do zero (topo)
        carousel.style.transition = 'none';
        carousel.style.transform = 'translateY(0px)';
        
        // Força um reflow no navegador para que ele entenda que voltou ao zero antes de animar
        carousel.offsetHeight; 

        // 4. Aplica a animação completa (Giro Fake + Parada Real tudo junto!)
        // Use a sua curva cubic-bezier aqui para dar o efeito de desaceleração de slot machine
        carousel.style.transition = 'transform 3.5s cubic-bezier(0.1, 0.8, 0.1, 1)';
        carousel.style.transform = `translateY(${finalTargetY}px)`;

        setTimeout(() => {
            resolve(randomIndex);
        }, 3500); // Tempo total da animação (ajuste se quiser mais rápido)
    });
}

async function spin() {
    if (isSpinning) return;

    // Se não houver itens carregados, não faz nada
    if (originalItems.length === 0) return; 

    isSpinning = true;

    // Agora o realSpin cuida de todo o show visual
    const index = await realSpin();

    currentIndex = index;
    isSpinning = false;

    console.log("selected: ", currentIndex);
    const itemSorteado = originalItems[currentIndex];
    const imgSrc = itemSorteado.querySelector('img').src;

    const selectedContainer = document.querySelector('.selected-container');
    const selectedImg = selectedContainer.querySelector('img');

    selectedImg.src = imgSrc;
    selectedContainer.style.visibility = 'visible';
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
