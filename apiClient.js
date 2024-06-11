const axios = require('axios');

const authorizeRequest = async () => {
    try {
        const response = await axios.post(
            'https://api.yourwebsite.se/Api/Vrs/AuthorizeRequest',
            {},
            {
                params: {
                    userName: 'petrodemo',
                    password: '1234',
                    datetime: '2018-01-08T09:36:24',
                    deviceId: '123456789',
                    tagId: '123456',
                    docType: 'json'
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic cGV0cm9kZW1vOjEyMzQ='
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Authorize Request Error:', error);
        throw error;
    }
};

const salesRegistration = async () => {
    try {
        const response = await axios.post(
            'https://api.yourwebsite.se/Api/Vrs/SaleData',
            {},
            {
                params: {
                    userName: 'petrodemo',
                    password: '1234',
                    datetime: '2018-01-08T11:30:50',
                    deviceId: '123456789',
                    tagId: '123456',
                    systemSaleId: '1481C47D-FCD8-44CA-916C-F4FAF985CE41',
                    pumpNumber: 1,
                    nozzleNumber: 2,
                    liter: 2,
                    unitPrice: '2,3',
                    amount: '4,6',
                    plate: '42AAA42',
                    transactionNo: 3,
                    docType: 'json'
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic cGV0cm9kZW1vOjEyMzQ='
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Sales Registration Error:', error);
        throw error;
    }
};

module.exports = { authorizeRequest, salesRegistration };
