const slideshowInner = document.querySelector(".slideshow-container .inner");
const slides = document.querySelectorAll(".slide");
const control = document.querySelector(".controls");
let isAnimating = false;
const slideshow = document.querySelector(".slideshow-container");
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
let old = 1;
let current = 1;
firstClone.classList.add("isClone");
lastClone.classList.add("isClone");

slideshowInner.appendChild(firstClone);
slideshowInner.insertBefore(lastClone, slides[0]);
let currentIndex = 1;
updatePosition(true);
let eventType = "";
control.onclick = function (event) {
    const crlBtn = event.target.closest(".btn");
    if (!crlBtn || isAnimating) return;
    isAnimating = true; // Khi chuyen slide ngan hanh dong khac xay ra tren slideshow
    if (crlBtn.classList.contains("prev")) {
        old = currentIndex;
        currentIndex--;
        current = currentIndex;
        eventType = "prev";
    }
    if (crlBtn.classList.contains("next")) {
        old = currentIndex;
        currentIndex++;
        current = currentIndex;
        eventType = "next";
    }
    updatePosition();
};

function updatePosition(instant = false) {
    const offset = `-${currentIndex * 100}%`;
    slideshowInner.style.transition = instant ? "none" : "0.5s ease";
    slideshowInner.style.translate = offset;
}
const dots = document.querySelectorAll(".dot");
slideshowInner.ontransitionend = function (event) {
    const slides = document.querySelectorAll(".slide");
    if (slides[currentIndex].classList.contains("isClone")) {
        slideshowInner.style.transition = "none";
        if (currentIndex === slides.length - 1) {
            currentIndex = 1;
        } else if (currentIndex === 0) {
            currentIndex = slides.length - 2;
        }
        requestAnimationFrame(() => updatePosition(true));
    }

    const dotIndex = (currentIndex - 1 + dots.length) % dots.length;
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[dotIndex].classList.add("active");

    isAnimating = false;
    slideshow.dispatchEvent(
        new CustomEvent(`slideshow:change`, {
            detail: {
                direction: eventType,
                old: slides[old],
                current: slides[current],
            },
        })
    );
};

// hover vào thì dừng auto slide
let autoSlideInterval = setInterval(() => {
    if (isAnimating) return;
    old = currentIndex;
    current = currentIndex + 1;
    eventType = "next";
    isAnimating = true;
    currentIndex++;
    updatePosition();
}, 4000);
slideshow.addEventListener("mouseenter", () => {
    clearInterval(autoSlideInterval);
});

slideshow.addEventListener("mouseleave", () => {
    // Gán vào để lần sau có thể clear được
    autoSlideInterval = setInterval(() => {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex++;
        updatePosition();
    }, 4000);
});

slideshow.addEventListener("slideshow:change", (event) => {
    const target = event.detail;
    console.log(`Direction: ${target.direction}`);
    console.log("OldElement:");
    console.log(target.old);
    console.log("CurrentElement:");
    console.log(target.current);
});
