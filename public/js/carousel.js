// Карусель
document.addEventListener('DOMContentLoaded', function () {
    var myCarousel = new bootstrap.Carousel(document.getElementById('carousel'), {
        interval: 8000,
        wrap: true
    });
});
