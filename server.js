const express = require('express');
const bodyParser = require('body-parser');
const { authorizeRequest, salesRegistration } = require('./apiClient');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.status(200).send('Hello, Kumee!');
});

// Authorize Request Route
app.post('/Api/Vrs/AuthorizeRequest', (req, res) => {
    const { userName, password, datetime, deviceId, tagId, docType } = req.query;

    const responseJson = {
        ReqStatus: 1,
        ProcessStatus: 1,
        DeviceId: deviceId,
        TagId: tagId,
        LimitType: 1,
        Limit: 990.000,
        Plate: "42ABC42",
        IsError: 0,
        ResponseCode: 1
    };

    const responseString = `${deviceId}|${tagId}|1|1|Liter|990,000|42ABC42|0|1`;

    if (docType === 'json') {
        res.json(responseJson);
    } else {
        res.send(responseString);
    }
});

// Sales Registration Route
app.post('/Api/Vrs/SaleData', (req, res) => {
    const { userName, password, datetime, deviceId, tagId, systemSaleId, pumpNumber, nozzleNumber, liter, unitPrice, amount, plate, transactionNo, docType } = req.query;

    const responseJson = {
        ReqStatus: 1,
        ProcessStatus: 1,
        DeviceId: deviceId,
        TagId: tagId,
        LimitType: null,
        Limit: null,
        Plate: null,
        IsError: 0,
        ResponseCode: 1
    };

    const responseString = `${deviceId}|${tagId}|1|0|1|2`;

    if (docType === 'json') {
        res.json(responseJson);
    } else {
        res.send(responseString);
    }
});

// Test endpoints using apiClient.js functions
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
