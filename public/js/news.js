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
            renderNews(newsData);
            document.getElementById('loading-spinner').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching news:', error);
        });
}

function renderNews(newsData) {
    const newsContainer = document.getElementById('news-field');
    newsContainer.innerHTML = '';

    newsData.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');

        const preferredLang = localStorage.getItem('preferredLanguage');
        let title, description, short_description;

        // Determine the correct language based on preferredLang
        if (preferredLang === 'kaz') {
            title = news.title_kz; 
            description = news.description_kz;
            short_description = news.short_description_kz;
        } else {
            title = news.title_ru;
            description = news.description_ru;
            short_description = news.short_description_ru;
        }

        // Construct the HTML for each news item
        newsItem.innerHTML = `
            <a href="/news-details?id=${news.id}">
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
}
