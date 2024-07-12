// if statement для проверки наличия ID
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('id');

    if (documentId) {
        fetchDocumentDetails(documentId);
    } else {
        console.error('Document ID is missing from the URL.');
    }
});

// Получить документ из базы данных
function fetchDocumentDetails(documentId) {
    const url = `/api/procurement/${documentId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch document details');
            }
            return response.json();
        })
        .then(documentDetails => {
            displayDocumentDetails(documentDetails);
        })
        .catch(error => {
            console.error('Error fetching document details:', error);
        });
}

// Показать документ из базы данных
function displayDocumentDetails(documentDetails) {
    const documentTitle = document.getElementById('document-title');
    const documentContent = document.getElementById('document-content');
    const documentDate = document.getElementById('document-date');

    const preferredLang = localStorage.getItem('preferredLanguage');
    let title, date, content;

    if (preferredLang === 'kaz') {
        title = documentDetails.title_kz || documentDetails.title_ru;
        content = documentDetails.content_kz || documentDetails.content_ru;
    } else {
        title = documentDetails.title_ru;
        content = documentDetails.content_ru;
    }

    documentTitle.textContent = title;
    documentDate.textContent = documentDetails.date.slice(0,10);
    documentContent.innerHTML = content;
}
