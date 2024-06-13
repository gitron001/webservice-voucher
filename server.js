const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle both application/json and application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.status(200).send('Hello, world!');
});

// Authorize Request Route
app.post('/Api/Vrs/AuthorizeRequest', (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, datetime, deviceId, tagId, docType } = params;

    if (!userName || !password || !datetime || !deviceId || !tagId) {
        res.status(400).send('Missing required parameters');
        return;
    }

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
    const params = { ...req.query, ...req.body };
    const { userName, password, datetime, deviceId, tagId, systemSaleId, pumpNumber, nozzleNumber, liter, unitPrice, amount, plate, transactionNo, docType } = params;

    if (!userName || !password || !datetime || !deviceId || !tagId || !systemSaleId || !pumpNumber || !nozzleNumber || !liter || !unitPrice || !amount || !plate || !transactionNo) {
        res.status(400).send('Missing required parameters');
        return;
    }

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
