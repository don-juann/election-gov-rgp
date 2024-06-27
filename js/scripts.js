// Кнопка НАВЕРХ
window.addEventListener("scroll", function () {
    let scrollToTopButton = document.querySelector(".scrollTop");

    if (window.scrollY > 600) {
         scrollToTopButton.style.display = "block";
    } else {
         scrollToTopButton.style.display = "none";
    }
});

function scrollToTop() {
    window.scrollTo({
         top: 0,
         behavior: "smooth"
    });
}

// Адаптивность
function handleViewportWidth() {
    const headerTitle = document.getElementById('headerTitle');
    const viewportWidth = window.innerWidth;

    const thresholdWidth = 900; 

    if (viewportWidth < thresholdWidth) {
        headerTitle.style.display = 'none';
    } else {
        headerTitle.style.display = 'block';
    }
}

window.addEventListener('resize', handleViewportWidth);
window.addEventListener('DOMContentLoaded', handleViewportWidth);


// Карусель
var myCarousel = new bootstrap.Carousel(document.getElementById('carousel'), {
    interval: 8000,
    wrap: true
});