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
                newsItem.innerHTML = `
                    <a href="#">
                        <img src="${news.image}" alt="News Image">
                        <div class="news-item-content">
                            <h3 class="news-item-title">${news.title}</h3>
                            <p class="news-item-date">${news.date}</p>
                            <p class="news-item-description">${news.description}</p>
                        </div>
                    </a>
                `;
                newsContainer.appendChild(newsItem);
            });

            // Optionally, you can add pagination controls here
            // Example: createPaginationControls(page, totalPages);
        })
        .catch(error => {
            console.error('Error fetching news:', error);
        });
}

// Example pagination control functions
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
