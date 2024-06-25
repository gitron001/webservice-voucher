const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

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

// Function to parse configuration bits
const parseConfigBits = (configBits) => {
    return {
        pomperCard: configBits[0] === '1',
        discountCard: configBits[1] === '1',
        customerCard: configBits[2] === '1',
        vehicleIdentification: configBits[3] === '1',
        carPlate: configBits[4] === '1',
        carKm: configBits[5] === '1',
        cardPinCode: configBits[6] === '1',
        preset: configBits[7] === '1',
        prepayment: configBits[8] === '1',
        voucher: configBits[9] === '1'
    };
};

// Authorize Request Route
app.post('/Api/Vrs/AuthorizeRequest', (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, datetime, deviceId, tagId, docType, configBits, companyId, stationId } = params;

    console.log('AuthorizeRequest received:', params);

    if (!userName || !password || !datetime || !deviceId || !tagId || !companyId || !stationId) {
        res.status(400).send('Missing required parameters');
        return;
    }

    const config = configBits ? parseConfigBits(configBits) : {};
    console.log('Parsed Config Bits:', config);

    // Validate required data fields based on configBits
    if (config.vehicleIdentification && !params.vehicleIdentificationTag) {
        res.status(400).send('Missing vehicle identification tag');
        return;
    }

    if (config.carPlate && !params.carPlate) {
        res.status(400).send('Missing car plate number');
        return;
    }

    if (config.prepayment && !params.prepayment) {
        res.status(400).send('Missing prepayment');
        return;
    }

    const responseJson = {
        ReqStatus: 1,
        ProcessStatus: 1,
        DeviceId: deviceId,
        TagId: tagId,
        LimitType: 1,
        Limit: 990.000,
        Plate: "42ABC42", // Placeholder value
        IsError: 0,
        ResponseCode: 1
    };

    const responseString = `${deviceId}|${tagId}|1|1|Liter|990,000|42ABC42|0|1`; // Placeholder value

    if (docType === 'json') {
        console.log('Sending JSON response:', responseJson);
        res.json(responseJson);
    } else {
        console.log('Sending string response:', responseString);
        res.send(responseString);
    }
});

// Sales Registration Route
app.post('/Api/Vrs/SaleData', (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, datetime, deviceId, tagId, systemSaleId, pumpNumber, nozzleNumber, liter, unitPrice, amount, plate, transactionNo, docType, companyId, stationId } = params;

    console.log('SaleData received:', params);

    if (!userName || !password || !datetime || !deviceId || !tagId || !systemSaleId || !pumpNumber || !nozzleNumber || !liter || !unitPrice || !amount || !plate || !transactionNo || !companyId || !stationId) {
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
});

// Voucher Write Request Route
app.post('/Api/Vrs/VoucherWriteRequest', (req, res) => {
    const { userName, password, companyId, stationId, deviceId, barCode, amount } = req.query;

    console.log('VoucherWriteRequest received:', req.query);

    console.log('Missing parameter:', {
        userName: !!userName,
        password: !!password,
        companyId: !!companyId,
        stationId: !!stationId,
        deviceId: !!deviceId,
        barCode: !!barCode,
        amount: !!amount,
    });

    if (!userName || !password || !companyId || !stationId || !deviceId || !barCode || !amount) {
        res.status(400).send('Missing required parameters');
        return;
    }

    // Generate a random transaction number as a placeholder
    const transNo = Math.floor(Math.random() * 1000000); 

    res.status(200).send(`${deviceId}|${barCode}|1|`); // 1 = OK
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
