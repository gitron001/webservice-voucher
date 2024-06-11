const express = require('express');
const bodyParser = require('body-parser');
const { authorizeRequest, salesRegistration } = require('./apiClient');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/test-authorize', async (req, res) => {
    try {
        const data = await authorizeRequest();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error testing authorize request');
    }
});

app.get('/test-sales', async (req, res) => {
    try {
        const data = await salesRegistration();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error testing sales registration');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
