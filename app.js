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

app.get('/api/news', async (req, res) => {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit; 

    const client = new Client(dbConfig);
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM news ORDER BY date DESC OFFSET $1 LIMIT $2', [offset, limit]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching news:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.end();
    }
});

app.get('/api/news/:id', async (req, res) => {
    const { id } = req.params;

    const client = new Client(dbConfig);
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM news WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'News not found' });
        }

        const news = result.rows[0];
        res.json(news);
    } catch (err) {
        console.error('Error fetching news:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.end();
    }
});


// Serve static files
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
