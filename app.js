const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '..')));

app.use('/css', express.static(path.join(__dirname, 'css')));

app.use('/js', express.static(path.join(__dirname, 'js')));

app.use('/source', express.static(path.join(__dirname, 'source')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main', 'rgp.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'main', 'about.html'));
});

app.get('/anticorruption', (req, res) => {
    res.sendFile(path.join(__dirname, 'main', 'anticorruption.html'));
});

app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, 'main', 'news.html'));
});

app.get('/procurement', (req, res) => {
    res.sendFile(path.join(__dirname, 'main', 'procurement.html'));
});

app.get('/systems', (req, res) => {
    res.sendFile(path.join(__dirname, 'main', 'systems.html'));
});

app.get('/vacancy', (req, res) => {
    res.sendFile(path.join(__dirname, 'main', 'vacancy.html'));
});

// app.get('/api/news', (req, res) => {
//     res.json({ news: 'This is some news data' });
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});
