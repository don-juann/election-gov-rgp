document.addEventListener('DOMContentLoaded', function () {
    fetchNews(1); // Fetch news for the first page initially
});

function fetchNews(page) {
    const limit = 3; // Number of news items per page
    const url = `/api/news?page=${page}&limit=${limit}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }
            return response.json();
        })
        .then(newsData => {
            const newsContainer = document.getElementById('news-field');
            newsContainer.innerHTML = '';

            newsData.forEach(news => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('news-item');

                const preferredLang = localStorage.getItem('preferredLanguage');
                if (preferredLang === 'kaz') {
                    title = news.title_kz || news.title; 
                    description = news.description_kz 
                    short_description = news.short_description_kz
                } else if (preferredLang === 'rus') {
                    title = news.title_ru || news.title;
                    description = news.description_ru
                    short_description = news.short_description_ru
                }

                newsItem.innerHTML = `
                    <a href="#">
                        <img src="${news.image}" alt="News Image">
                        <div class="news-item-content">
                            <h3 class="news-item-title">${title}</h3>
                            <p class="news-item-date">${news.date.slice(0, 10)}</p>
                            <p class="news-item-description">${short_description}</p>
                        </div>
                    </a>
                `;
                newsContainer.appendChild(newsItem);
            });

            // Assuming you have a function to create pagination controls
            // createPaginationControls(page, totalPages);
        })
        .catch(error => {
            console.error('Error fetching news:', error);
        });
}


function createPaginationControls(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchNews(currentPage - 1);
        }
    });
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            fetchNews(currentPage + 1);
        }
    });
    paginationContainer.appendChild(nextButton);
}
