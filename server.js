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
app.post('/Api/Vrs/WelcomeRequest', (req, res) => {
    const { userName, password, companyId, stationId, deviceId } = req.query;

    console.log('WelcomeRequest received:', req.query);

    if (!userName || !password || !companyId || !stationId || !deviceId) {
        return res.status(400).send('Missing required parameters');
    }

    // Sending a simple welcome response
    const responseString = `${deviceId}|0|1`;
    sendResponse(res, responseString);
});

// Authorize Card Request Route
app.post('/Api/Vrs/AuthorizeCardRequest', async (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, companyId, stationId, datetime, deviceId, tagId } = params;

    console.log('AuthorizeCardRequest received:', params);

    if (!userName || !password || !companyId || !stationId || !datetime || !deviceId || !tagId) {
        return res.status(400).send('Missing required parameters');
    }

    try {
        const customer = await Customer.findOne({ where: { cardNumber: tagId } });
        if (!customer) {
            return sendResponse(res, `${deviceId}|${tagId}|1|0|0|0|0|0|0`);
        }

        const responseString = `${deviceId}|${tagId}|1|1|Liter|990.000|${customer.vehiclePlate}|31|1`;
        sendResponse(res, responseString);

    } catch (error) {
        console.error('Error processing AuthorizeCardRequest:', error);
        res.status(500).send('Internal server error');
    }
});

// Authorize Tag Request Route (similar to AuthorizeCardRequest)
app.post('/Api/Vrs/AuthorizeTagRequest', async (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, companyId, stationId, datetime, deviceId, tagId } = params;

    console.log('AuthorizeTagRequest received:', params);

    if (!userName || !password || !companyId || !stationId || !datetime || !deviceId || !tagId) {
        return res.status(400).send('Missing required parameters');
    }

    try {
        const customer = await Customer.findOne({ where: { cardNumber: tagId } });
        if (!customer) {
            return sendResponse(res, `${deviceId}|${tagId}|1|0|0|0|0|0|0`);
        }

        const responseString = `${deviceId}|${tagId}|1|1|Liter|990.000|${customer.vehiclePlate}|31|1`;
        sendResponse(res, responseString);

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
