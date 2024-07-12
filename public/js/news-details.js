document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    if (newsId) {
        fetchNewsDetails(newsId);
    } else {
        console.error('News ID is missing from the URL.');
    }
});

// Получить данные из базы данных
function fetchNewsDetails(newsId) {
    const url = `/api/news/${newsId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch news details');
            }
            return response.json();
        })
        .then(news => {
            displayNewsDetails(news);
            document.getElementById('loading-spinner').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching news details:', error);
            // Handle error (e.g., show error message to user)
        });
}

// Показать элементы новости из базы данных
function displayNewsDetails(news) {
    const newsTitle = document.getElementById('news-title');
    const newsImage = document.getElementById('news-image');
    const newsDate = document.getElementById('news-date');
    const newsDescription = document.getElementById('news-description');

    const preferredLang = localStorage.getItem('preferredLanguage');
    let title, description;

    if (preferredLang === 'kaz') {
        title = news.title_kz || news.title_ru; 
        description = news.description_kz || news.description_ru;
    } else {
        title = news.title_ru;
        description = news.description_ru;
    }

    newsTitle.textContent = title;
    newsImage.src = news.image;
    newsDate.textContent = news.date.slice(0, 10);
    newsDescription.textContent = description;
}
