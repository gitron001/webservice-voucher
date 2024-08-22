const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Customer = require('./models/customer');
const Transaction = require('./models/transaction');
const Voucher = require('./models/voucher');

const app = express();
const port = process.env.PORT || 3000; // Listen on port 3000

// Middleware to handle sessions, cookies, and CORS
app.use(cookieParser());
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(cors());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Middleware to handle both application/json and application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.status(200).send('Hello, world!');
});

// Middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next();
});

// Helper function to send the appropriate response
const sendResponse = (res, responseString) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(responseString);
};

// Welcome Request Route
app.post('/Api/Vrs/WelcomeRequest', async (req, res) => {
    const { userName, password, companyId, stationId, deviceId } = req.query;

    console.log('WelcomeRequest received:', req.query);

    if (!userName || !password || !companyId || !stationId || !deviceId) {
        return res.status(400).send('Missing required parameters');
    }

    try {
        const customer = await Customer.findOne({ where: { stationId: stationId } });

        let response;
        if (customer && customer.disable) {
            response = `${deviceId}|0|1|IFZBB`;
        } else {
            response = `${deviceId}|0|1`;
        }

        res.send(response);
    } catch (error) {
        console.error('Error processing WelcomeRequest:', error);
        res.status(500).send('Internal server error');
    }
});

// Authorize Card Request Route
app.post('/Api/Vrs/AuthorizeCardRequest', async (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, companyId, stationId, datetime, deviceId, cardId } = params;

    console.log('AuthorizeCardRequest received:', params);

    if (!userName || !password || !datetime || !deviceId || !cardId || !companyId || !stationId) {
        res.status(400).send('Missing required parameters');
        return;
    }

    try {
        const customer = await Customer.findOne({ where: { cardNumber: cardId } });

        if (!customer) {
            // Respond with an error if the customer is not found
            return res.status(200).send(`${deviceId}|${cardId}|0|1|Liter|0.00||0|1`);
        }

        const discount = 10; // Example discount value, adjust as needed

        const responseString = `${deviceId}|${cardId}|1|1|Liter|990.00|${customer.vehiclePlate}|31|${discount}|0`;

        res.status(200).send(responseString);
    } catch (error) {
        console.error('Error processing AuthorizeCardRequest:', error);
        res.status(500).send('Internal server error');
    }
});

// Authorize Tag Request Route
app.post('/Api/Vrs/AuthorizeTagRequest', async (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, companyId, stationId, datetime, deviceId, tagId } = params;

    console.log('AuthorizeTagRequest received:', params);

    if (!userName || !password || !datetime || !deviceId || !tagId || !companyId || !stationId) {
        res.status(400).send('Missing required parameters');
        return;
    }

    try {
        const customer = await Customer.findOne({ where: { cardNumber: tagId } });

        if (!customer) {
            // Respond with an error if the customer is not found
            return res.status(200).send(`${deviceId}|${tagId}|0|1|Liter|0.00||0|1`);
        }

        const discount = 10; // Example discount value, adjust as needed

        const responseString = `${deviceId}|${tagId}|1|1|Liter|990.00|${customer.vehiclePlate}|31|${discount}|0`;

        res.status(200).send(responseString);
    } catch (error) {
        console.error('Error processing AuthorizeTagRequest:', error);
        res.status(500).send('Internal server error');
    }
});

// Sale Data Route
app.post('/Api/Vrs/SaleData', async (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, companyId, stationId, datetime, deviceId, tagId, systemSaleId, pumpNumber, nozzleNumber, liter, unitPrice, amount, plate, transactionNo } = params;

    console.log('SaleData received:', params);

    if (!userName || !password || !companyId || !stationId || !datetime || !deviceId || !tagId || !systemSaleId || !pumpNumber || !nozzleNumber || !liter || !unitPrice || !amount || !plate || !transactionNo) {
        return res.status(400).send('Missing required parameters');
    }

    try {
        await Transaction.create({
            stationID: stationId,
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

        const responseString = `${deviceId}|${tagId}|1|0|1|2`;
        sendResponse(res, responseString);

    } catch (error) {
        console.error('Error processing SaleData:', error);
        res.status(500).send('Internal server error');
    }
});

// Voucher Write Request Route
app.post('/Api/Vrs/VoucherWriteRequest', async (req, res) => {
    const { userName, password, companyId, stationId, deviceId, barCode, amount } = req.query;

    console.log('VoucherWriteRequest received:', req.query);

    if (!userName || !password || !companyId || !stationId || !deviceId || !barCode || !amount) {
        return res.status(400).send('Missing required parameters');
    }

    try {
        const existingVoucher = await Voucher.findOne({ where: { barCode: barCode } });
        if (existingVoucher) {
            return sendResponse(res, `${deviceId}|${barCode}|${amount}|0|0`);
        }

        await Voucher.create({
            stationID: stationId,
            transNo: Math.floor(Math.random() * 1000000),
            barCode: barCode,
            amount: amount,
            status: 1 // valid
        });

        sendResponse(res, `${deviceId}|${barCode}|${amount}|0|1`);

    } catch (error) {
        console.error('Error processing VoucherWriteRequest:', error);
        res.status(500).send('Internal server error');
    }
});

// Voucher Read Request Route
app.post('/Api/Vrs/VoucherReadRequest', async (req, res) => {
    const { userName, password, companyId, stationId, deviceId, barCode } = req.query;

    console.log('VoucherReadRequest received:', req.query);

    if (!userName || !password || !companyId || !stationId || !deviceId || !barCode) {
        return res.status(400).send('Missing required parameters');
    }

    try {
        const voucher = await Voucher.findOne({ where: { barCode: barCode } });

        if (!voucher) {
            return sendResponse(res, `${deviceId}|${barCode}|0.00|1|0`);
        }

        sendResponse(res, `${deviceId}|${barCode}|${voucher.amount}|0|1`);

    } catch (error) {
        console.error('Error processing VoucherReadRequest:', error);
        res.status(500).send('Internal server error');
    }
});

// Voucher Clear Request Route
app.post('/Api/Vrs/VoucherClearRequest', async (req, res) => {
    const { userName, password, companyId, stationId, deviceId, barCode } = req.query;

    console.log('VoucherClearRequest received:', req.query);

    if (!userName || !password || !companyId || !stationId || !deviceId || !barCode) {
        return res.status(400).send('Missing required parameters');
    }

    try {
        const voucher = await Voucher.findOne({ where: { barCode: barCode } });

        if (!voucher) {
            return sendResponse(res, `${deviceId}|${barCode}|0.00|1|0`);
        }

        voucher.status = 2;  // Mark as used or deleted
        voucher.amount = 0.00; // Set amount to zero as per the client's instructions
        await voucher.save();

        sendResponse(res, `${deviceId}|${barCode}|0.00|0|1`);

    } catch (error) {
        console.error('Error processing VoucherClearRequest:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
