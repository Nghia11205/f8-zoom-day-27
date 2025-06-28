const players = [
    { id: 1, name: "Việt Trinh", image: "./images/img-vietrinh1.jpg" },
    { id: 2, name: "Đinh Hạ", image: "./images/img-dinha1.jpg" },
    { id: 3, name: "Isla", image: "./images/img-huyentran1.jpg" },
    { id: 4, name: "Kim Thoa", image: "./images/img-kimthoa1.jpg" },
    { id: 5, name: "Sophie", image: "./images/img-thanhtruc1.jpg" },
];

const liked = [];
const disliked = [];

let currentIndex = players.length - 1;
let startX = 0;
let isTouching = false;
let isSwiping = false;

const swipeCard = document.querySelector(".swipe-card");
const likeBtn = document.querySelector(".like-btn");
const dislikeBtn = document.querySelector(".dislike-btn");

function renderPlayers() {
    swipeCard.innerHTML = "";
    players.forEach((player, index) => {
        const card = document.createElement("div");
        card.className = "swipe-item";
        card.dataset.id = player.id;
        card.style.backgroundImage = `url(${player.image})`;
        card.style.zIndex = index;

        const name = document.createElement("span");
        name.className = "swipe-item__name";
        name.textContent = player.name;

        card.appendChild(name);
        swipeCard.appendChild(card);
    });
}

function getCurrentCard() {
    if (currentIndex < 0) return null;
    const player = players[currentIndex];
    return document.querySelector(`[data-id="${player.id}"]`);
}

function removeCurrentPlayer() {
    players.pop();
    currentIndex = players.length - 1;
}

function swipe(direction) {
    const card = getCurrentCard();
    const player = players[currentIndex];
    if (!card || !player) return;

    const isLeft = direction < 0;
    const color = isLeft ? "rgb(255, 75, 89)" : "rgb(77, 230, 126)";

    card.style.setProperty("--color", color);
    card.style.setProperty("--opacity", 0.5);
    card.style.transition = "transform 0.6s ease";
    card.style.transform = `translateX(${direction * 220}%) rotate(${
        direction * 40
    }deg)`;

    if (isLeft) {
        disliked.push(player);
    } else liked.push(player);

    card.addEventListener("transitionend", function handle() {
        card.remove();
        removeCurrentPlayer();
        isSwiping = false;
        card.removeEventListener("transitionend", handle);
    });
}

function actionButton(dx) {
    if (dx < -30) {
        dislikeBtn.classList.add("active");
        likeBtn.classList.remove("active");
    } else if (dx > 30) {
        likeBtn.classList.add("active");
        dislikeBtn.classList.remove("active");
    } else {
        likeBtn.classList.remove("active");
        dislikeBtn.classList.remove("active");
    }
}

function cardTransform(card, dx) {
    const rotation = dx / 25;
    const opacity = Math.min(Math.abs(dx) / 100, 0.8);
    const color = dx < 0 ? "rgb(255, 75, 89)" : "rgb(77, 230, 126)";

    card.style.transform = `translateX(${dx}px) rotate(${rotation}deg)`;
    card.style.setProperty("--color", color);
    card.style.setProperty("--opacity", opacity);
}

function startDrag(clientX) {
    const card = getCurrentCard();
    if (!card || isSwiping) return;
    card.style.transition = "none";
    startX = clientX;
    isTouching = true;
}

function dragMove(clientX) {
    if (!isTouching || isSwiping) return;
    const dx = clientX - startX;
    const card = getCurrentCard();
    if (!card) return;

    cardTransform(card, dx);
    actionButton(dx);
}

function endDrag(clientX) {
    if (!isTouching || isSwiping) return;
    const dx = clientX - startX;
    const card = getCurrentCard();
    if (!card) return;

    const swipeThreshold = 80;
    if (Math.abs(dx) > swipeThreshold) {
        isSwiping = true;
        swipe(dx < 0 ? -1 : 1);
    } else {
        card.style.transition = "transform 0.4s ease";
        card.style.transform = `translateX(0) rotate(0deg)`;
        card.style.setProperty("--opacity", 0);
    }

    actionButton(0);
    isTouching = false;
}

function setupTouchEvents() {
    swipeCard.ontouchstart = (event) => startDrag(event.touches[0].clientX);
    swipeCard.ontouchmove = (event) => dragMove(event.touches[0].clientX);
    swipeCard.ontouchend = (event) => endDrag(event.changedTouches[0].clientX);
}

function setupMouseEvents() {
    swipeCard.onmousedown = (event) => startDrag(event.clientX);
    swipeCard.onmousemove = (event) => dragMove(event.clientX);
    swipeCard.onmouseup = (event) => endDrag(event.clientX);
    swipeCard.onmouseleave = () => {
        if (isTouching) {
            endDrag(startX);
        }
    };
}

likeBtn.addEventListener("click", () => {
    if (isSwiping || currentIndex < 0) return;
    isSwiping = true;
    swipe(1);
});

dislikeBtn.addEventListener("click", () => {
    if (isSwiping || currentIndex < 0) return;
    isSwiping = true;
    swipe(-1);
});

renderPlayers();
setupTouchEvents();
setupMouseEvents();
