document.addEventListener('DOMContentLoaded', function () {
    const addNewsForm = document.getElementById('addNewsForm');
    const addDocumentForm = document.getElementById('addDocumentForm');

    // Создать новость и добавить в базу данных
    addNewsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addNewsForm);
        const newsData = {
            title_ru: formData.get('title_ru'),
            title_kz: formData.get('title_kz'),
            description_ru: formData.get('description_ru'),
            description_kz: formData.get('description_kz'),
            short_description_ru: formData.get('short_description_ru'),
            short_description_kz: formData.get('short_description_kz'),
            image: formData.get('image'),
            date: formData.get('date')
        };
    
        fetch('/api/news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('News added:', data);
            fetchExistingNews();
            addNewsForm.reset();
        })
        .catch(error => {
            console.error('Error adding news:', error);
        });
    });

    // Создать документ и добавить в базу данных
    addDocumentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addDocumentForm);
        const documentData = {
            title_ru: formData.get('title_ru'),
            title_kz: formData.get('title_kz'),
            content_ru: formData.get('content_ru'),
            content_kz: formData.get('content_kz'),
            date: formData.get('date')
        };
    
        fetch('/api/procurement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(documentData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Document added:', data);
            fetchExistingDocuments();
            addDocumentForm.reset();
        })
        .catch(error => {
            console.error('Error adding document:', error);
        });
    });
    
    // Поставить текущее время на соотвествующие поля
    function setCurrentDateTimeLocal() {
        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

        document.getElementById('newsDate').value = currentDateTime;
        document.getElementById('documentDate').value = currentDateTime;
    }

    setCurrentDateTimeLocal();

    fetchExistingNews();
    fetchExistingDocuments(); 
});


// Получить существующие новости
function fetchExistingNews() {
    const limit = 10; // Adjust the limit as needed
    fetch(`/api/news?limit=${limit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayExistingNews(data);
        })
        .catch(error => {
            console.error('Error fetching existing news:', error);
        });
}

// Получить существующие документы
function fetchExistingDocuments() {
    fetch('/api/procurement')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayExistingDocuments(data);
        })
        .catch(error => {
            console.error('Error fetching existing documents:', error);
        });
}

// Показать существующие новости
function displayExistingNews(newsData) {
    const existingNewsContainer = document.getElementById('existingNews');
    existingNewsContainer.innerHTML = '';

    newsData.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.innerHTML = `
            <br>
            <h4>ID: ${news.id}</h4>
            <p>Название (RU): ${news.title_ru}</p>
            <p>Название (KZ): ${news.title_kz}</p>
            <p>Описание (RU): ${news.description_ru}</p>
            <p>Описание (KZ): ${news.description_kz}</p>
            <p>Дата: ${news.date}<p>
            <button onclick="deleteNews('${news.id}')">Удалить</button>
            <br>
            <hr>
        `;
        existingNewsContainer.appendChild(newsItem);
    });
}

// Показать существующие документы
function displayExistingDocuments(documentsData) {
    const existingDocumentsContainer = document.getElementById('existingDocuments');
    existingDocumentsContainer.innerHTML = '';

    documentsData.forEach(doc => {
        const documentItem = document.createElement('div');
        documentItem.innerHTML = `
            <br>
            <h4>ID: ${doc.id}</h4>
            <p>Название (RU): ${doc.title_ru}</p>
            <p>Название (KZ): ${doc.title_kz}</p>
            <p>Содержание (RU): ${doc.content_ru}</p>
            <p>Содержание (KZ): ${doc.content_kz}</p>
            <p>Дата: ${doc.date}</p>
            <button onclick="deleteDocument('${doc.id}')">Удалить</button>
            <br>
            <hr>
        `;
        existingDocumentsContainer.appendChild(documentItem);
    });
}

//Удалить новость по id
function deleteNews(newsId) {
    if (confirm('Вы действительно хотите удалить эту новость?')) {
        fetch(`/api/news/${newsId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('News deleted:', data);
            fetchExistingNews();
        })
        .catch(error => {
            console.error('Error deleting news:', error);
        });
    }
}

//Удалить документ по id
function deleteDocument(documentId) {
    if (confirm('Вы действительно хотите удалить этот документ?')) {
        fetch(`/api/procurement/${documentId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Document deleted:', data);
            fetchExistingDocuments();
        })
        .catch(error => {
            console.error('Error deleting document:', error);
        });
    }
}
