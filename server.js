const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Authorize Request Endpoint
app.get('/Api/Vrs/AuthorizeRequest', (req, res) => {
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

// Sales Registration Transactions Endpoint
app.get('/Api/Vrs/SaleData', (req, res) => {
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
