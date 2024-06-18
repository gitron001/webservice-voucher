const sequelize = require('./database');
const Customer = require('./models/customer');
const Transaction = require('./models/transaction');
const Voucher = require('./models/voucher');

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    await sequelize.sync({ alter: true }); // use { force: true } only if you want to drop and recreate tables
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initDB();
