const express = require('express');
const bodyParser = require('body-parser');
const Customer = require('./models/customer');
const Transaction = require('./models/transaction');
const Voucher = require('./models/voucher');

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
app.post('/Api/Vrs/AuthorizeRequest', async (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, datetime, deviceId, tagId, docType } = params;

    console.log('AuthorizeRequest received:', params);

    if (!userName || !password || !datetime || !deviceId || !tagId) {
        res.status(400).send('Missing required parameters');
        return;
    }

    try {
        const customer = await Customer.findOne({ where: { cardNumber: tagId } });
        if (!customer) {
            res.status(404).send('Customer not found');
            return;
        }

        const responseJson = {
            ReqStatus: 1,
            ProcessStatus: 1,
            DeviceId: deviceId,
            TagId: tagId,
            LimitType: 1,
            Limit: 990.000,
            Plate: customer.vehiclePlate,
            IsError: 0,
            ResponseCode: 1
        };

        const responseString = `${deviceId}|${tagId}|1|1|Liter|990,000|${customer.vehiclePlate}|0|1`;

        if (docType === 'json') {
            console.log('Sending JSON response:', responseJson);
            res.json(responseJson);
        } else {
            console.log('Sending string response:', responseString);
            res.send(responseString);
        }
    } catch (error) {
        console.error('Error processing AuthorizeRequest:', error);
        res.status(500).send('Internal server error');
    }
});

// Sales Registration Route
app.post('/Api/Vrs/SaleData', async (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, datetime, deviceId, tagId, systemSaleId, pumpNumber, nozzleNumber, liter, unitPrice, amount, plate, transactionNo, docType } = params;

    console.log('SaleData received:', params);

    if (!userName || !password || !datetime || !deviceId || !tagId || !systemSaleId || !pumpNumber || !nozzleNumber || !liter || !unitPrice || !amount || !plate || !transactionNo) {
        res.status(400).send('Missing required parameters');
        return;
    }

    try {
        const transaction = await Transaction.create({
            stationID: userName, // assuming userName is stationID, update as needed
            pumpNo: pumpNumber,
            nozzleNo: nozzleNumber,
            liters: liter,
            amount: amount,
            price: unitPrice,
            pumpTransNo: transactionNo,
            transTimedate: datetime,
            transUnique: systemSaleId,
            plate: plate,
            rfidCard: tagId,
            vrsTag: tagId
        });

        const responseJson = {
            ReqStatus: 1,
            ProcessStatus: 1,
            DeviceId: deviceId,
            TagId: tagId,
            LimitType: null,
            Limit: null,
            Plate: plate,
            IsError: 0,
            ResponseCode: 1
        };

        const responseString = `${deviceId}|${tagId}|1|0|1|2`;

        if (docType === 'json') {
            console.log('Sending JSON response:', responseJson);
            res.json(responseJson);
        } else {
            console.log('Sending string response:', responseString);
            res.send(responseString);
        }
    } catch (error) {
        console.error('Error processing SaleData:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
