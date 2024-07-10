document.addEventListener('DOMContentLoaded', function () {
    fetchDocuments(); // Fetch all documents when the page loads

    const form = document.querySelector('#searchForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        const documentName = formData.get('documentName');
        const startDate = formData.get('startDate');
        const endDate = formData.get('endDate');

        fetchDocuments(documentName, startDate, endDate); // Fetch documents based on filters
    });
});

function fetchDocuments(documentName = '', startDate = '', endDate = '') {
    let url = '/api/procurement';
    const params = new URLSearchParams();
    if (documentName) params.append('documentName', documentName);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    url += '?' + params.toString();

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }
            return response.json();
        })
        .then(documents => {
            renderDocuments(documents);
        })
        .catch(error => {
            console.error('Error fetching documents:', error);
        });
}

function renderDocuments(documents) {
    const resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = '';

    documents.forEach((doc) => {
        const resultItem = document.createElement('a');
        resultItem.classList.add('result-item', 'mb-3', 'p-3', 'border');
        resultItem.href = `/procurement-details?id=${doc.id}`;
        resultItem.style.display = 'block';

        const preferredLang = localStorage.getItem('preferredLanguage');
        let title, description;
        if (preferredLang === 'kaz') {
            title = doc.title_kz || doc.title_ru;
            description = doc.description_kz || doc.description_ru;
        } else {
            title = doc.title_ru;
            description = doc.description_ru;
        }

        resultItem.innerHTML = `
            <h3>${title}</h3>
            <p>${doc.date.slice(0, 10)}</p>
            <p>${description}</p>
        `;
        resultsContainer.appendChild(resultItem);
    });
}
