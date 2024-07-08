const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

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

mongoose.connect('mongodb://localhost:27017/transactionsDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/transactions', async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const start = (page - 1) * perPage;

    const matchCriteria = { $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] } };

    if (search) {
        const searchRegex = new RegExp(search, 'i');
        matchCriteria.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { price: { $regex: searchRegex } }
        ];
    }

    const transactions = await Transaction.find(matchCriteria).skip(start).limit(parseInt(perPage));
    res.json(transactions);
});

app.get('/statistics', async (req, res) => {
    const { month } = req.query;
    const matchCriteria = { $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] } };

    const totalSaleAmount = await Transaction.aggregate([
        { $match: matchCriteria },
        { $group: { _id: null, totalAmount: { $sum: "$price" } } }
    ]);

    const totalSoldItems = await Transaction.countDocuments({ ...matchCriteria, sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ ...matchCriteria, sold: false });

    res.json({
        totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
        totalSoldItems,
        totalNotSoldItems
    });
});

app.get('/barchart', async (req, res) => {
    const { month } = req.query;
    const matchCriteria = { $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] } };

    const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity }
    ];

    const results = await Promise.all(priceRanges.map(async range => {
        const count = await Transaction.countDocuments({
            ...matchCriteria,
            price: { $gte: range.min, $lt: range.max === Infinity ? 1e10 : range.max }
        });
        return { range: range.range, count };
    }));

    res.json(results);
});

app.get('/piechart', async (req, res) => {
    const { month } = req.query;
    const matchCriteria = { $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] } };

    const categories = await Transaction.aggregate([
        { $match: matchCriteria },
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json(categories.map(category => ({
        category: category._id,
        count: category.count
    })));
});

app.get('/combined', async (req, res) => {
    const { month } = req.query;

    const [transactions, statistics, barChart, pieChart] = await Promise.all([
        axios.get(`http://localhost:3000/transactions?month=${month}`),
        axios.get(`http://localhost:3000/statistics?month=${month}`),
        axios.get(`http://localhost:3000/barchart?month=${month}`),
        axios.get(`http://localhost:3000/piechart?month=${month}`)
    ]);

    res.json({
        transactions: transactions.data,
        statistics: statistics.data,
        barChart: barChart.data,
        pieChart: pieChart.data
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
