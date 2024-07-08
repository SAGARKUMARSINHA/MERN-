const mongoose = require('mongoose');
const axios = require('axios');

const transactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    sold: Boolean,
    category: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);

async function initDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/transactionsDB', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);

        console.log('Database initialized with seed data');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initDatabase();
