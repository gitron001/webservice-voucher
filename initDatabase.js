const sequelize = require('./database');
const Customer = require('./models/customer');
const Transaction = require('./models/transaction');
const Voucher = require('./models/voucher');

const initDB = async () => {
  try {
    await sequelize.sync({ alter: true }); // use { force: true } only if you want to drop and recreate tables
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
};

initDB();
