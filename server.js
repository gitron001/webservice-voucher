const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Customer = require('./models/customer');

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

// Authorize Request Route
app.post('/Api/Vrs/AuthorizeRequest', async (req, res) => {
    const params = { ...req.query, ...req.body };
    const { userName, password, datetime, deviceId, tagId, docType, configBits, companyId, stationId } = params;

    console.log('AuthorizeRequest received:', params);

    if (!userName || !password || !datetime || !deviceId || !tagId || !companyId || !stationId) {
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

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
