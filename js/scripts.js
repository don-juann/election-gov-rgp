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

// Анимация текста
document.addEventListener('DOMContentLoaded', function() {
     const headings = document.querySelectorAll('.fancy h1');
     
     headings.forEach((heading, index) => {
         let text = heading.textContent.trim();
         heading.textContent = '';
 
         for (let i = 0; i < text.length; i++) {
             const span = document.createElement('span');
             span.textContent = text[i];
             heading.appendChild(span);
         }
     });
 
     function fadeInHeading() {
         headings.forEach((heading, index) => {
             const spans = heading.querySelectorAll('span');
             spans.forEach((span, index) => {
                 setTimeout(() => {
                     span.style.opacity = 1;
                 }, index * 50); 
             });
         });
     }
 
     setTimeout(fadeInHeading, 500);
 });
 
