require('dotenv').config();
const express = require('express');
const path = require('path');
const { Client } = require('pg');

const app = express();
const port = 3000;

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

async function setupClient() {
    const client = new Client(dbConfig);
    await client.connect();
    return client;
}

function handleDatabaseError(res, err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal server error' });
}

// News API Endpoints

app.get('/api/news', async (req, res) => {
    const { limit } = req.query;

    try {
        const client = await setupClient();
        const result = await client.query('SELECT * FROM news ORDER BY date DESC LIMIT $1', [limit]);
        res.json(result.rows);
    } catch (err) {
        handleDatabaseError(res, err);
    }
});

app.get('/api/news/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await setupClient();
        const result = await client.query('SELECT * FROM news WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'News not found' });
        }

        const news = result.rows[0];
        res.json(news);
    } catch (err) {
        handleDatabaseError(res, err);
    }
});

app.post('/api/news', async (req, res) => {
    const {
        image,
        date,
        title_ru,
        short_description_ru,
        description_ru,
        title_kz,
        short_description_kz,
        description_kz
    } = req.body;

    console.log('Request Body:', req.body); // Debugging log

    try {
        const client = await setupClient();
        const query = `
            INSERT INTO news (image, date, title_ru, short_description_ru, description_ru, title_kz, short_description_kz, description_kz)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [image, date, title_ru, short_description_ru, description_ru, title_kz, short_description_kz, description_kz];
        const result = await client.query(query, values);

        console.log('Inserted Data:', result.rows[0]); // Debugging log

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting news:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/news/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await setupClient();
        const result = await client.query('DELETE FROM news WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'News not found' });
        }

        const deletedNews = result.rows[0];
        res.json(deletedNews);
    } catch (err) {
        handleDatabaseError(res, err);
    }
});

// Documents API Endpoints

app.get('/api/procurement', async (req, res) => {
    const { documentName, startDate, endDate } = req.query;
    let query = 'SELECT * FROM procurement';

    // Filter by document name
    if (documentName) {
        query += ` WHERE title_kz ILIKE '%${documentName}%' OR title_ru ILIKE '%${documentName}%'`;
    }

    if (startDate && endDate) {
        if (documentName) {
            query += ' AND';
        } else {
            query += ' WHERE';
        }
        query += ` date BETWEEN '${startDate}' AND '${endDate}'`;
    }

    query += ' ORDER BY date DESC';

    try {
        const client = await setupClient();
        const result = await client.query(query);
        res.json(result.rows);
    } catch (err) {
        handleDatabaseError(res, err);
    }
});

app.get('/api/procurement/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await setupClient();
        const result = await client.query('SELECT * FROM procurement WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }

        const document = result.rows[0];
        res.json(document);
    } catch (err) {
        handleDatabaseError(res, err);
    }
});

app.post('/api/procurement', async (req, res) => {
    const { title_ru, title_kz, content_ru, content_kz, date } = req.body;

    try {
        const client = await setupClient();
        const result = await client.query(
            'INSERT INTO procurement (title_ru, title_kz, content_ru, content_kz, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title_ru, title_kz, content_ru, content_kz, date]
        );

        const newDocument = result.rows[0];
        res.status(201).json(newDocument);
    } catch (err) {
        handleDatabaseError(res, err);
    }
});

app.delete('/api/procurement/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await setupClient();
        const result = await client.query('DELETE FROM procurement WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }

        const deletedDocument = result.rows[0];
        res.json(deletedDocument);
    } catch (err) {
        handleDatabaseError(res, err);
    }
});

// Serve static HTML files

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'rgp.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/anticorruption', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'anticorruption.html'));
});

app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news.html'));
});

app.get('/news-details', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news-details.html'));
});

app.get('/procurement', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'procurement.html'));
});

app.get('/procurement-details', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'procurement-details.html'));
});

app.get('/systems', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'systems.html'));
});

app.get('/vacancy', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'vacancy.html'));
});

app.get('/adminpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'adminpage.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});
