const axios = require('axios');
const Transaction = require('../models/Transaction');

const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.deleteMany({});
        await Transaction.insertMany(response.data);
        res.status(200).send('Database initialized with seed data.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const listTransactions = async (req, res) => {
    const { month, search = '', page = 1, per_page = 10 } = req.query;
    const regex = new RegExp(search, 'i');
    const filter = { 
        dateOfSale: { $regex: new RegExp(`-${month.padStart(2, '0')}-`, 'i') }, 
        $or: [
            { title: regex },
            { description: regex },
            { price: regex }
        ]
    };
    const transactions = await Transaction.find(filter)
        .skip((page - 1) * per_page)
        .limit(parseInt(per_page));
    res.json(transactions);
};

const getStatistics = async (req, res) => {
    const { month } = req.query;
    const regex = new RegExp(`-${month.padStart(2, '0')}-`, 'i');
    const totalSaleAmount = await Transaction.aggregate([
        { $match: { dateOfSale: { $regex: regex } } },
        { $group: { _id: null, totalAmount: { $sum: '$price' } } }
    ]);
    const soldItemsCount = await Transaction.countDocuments({ dateOfSale: { $regex: regex }, sold: true });
    const notSoldItemsCount = await Transaction.countDocuments({ dateOfSale: { $regex: regex }, sold: false });

    res.json({
        totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
        soldItemsCount,
        notSoldItemsCount
    });
};

const getBarChart = async (req, res) => {
    const { month } = req.query;
    const regex = new RegExp(`-${month.padStart(2, '0')}-`, 'i');
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
    const barData = await Promise.all(priceRanges.map(async range => {
        const count = await Transaction.countDocuments({
            dateOfSale: { $regex: regex },
            price: { $gte: range.min, $lte: range.max }
        });
        return { range: range.range, count };
    }));
    res.json(barData);
};

const getPieChart = async (req, res) => {
    const { month } = req.query;
    const regex = new RegExp(`-${month.padStart(2, '0')}-`, 'i');
    const pieData = await Transaction.aggregate([
        { $match: { dateOfSale: { $regex: regex } } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json(pieData);
};

const getCombinedData = async (req, res) => {
    const { month } = req.query;
    const statistics = await getStatistics({ query: { month } });
    const barChart = await getBarChart({ query: { month } });
    const pieChart = await getPieChart({ query: { month } });
    res.json({
        statistics: statistics.data,
        barChart: barChart.data,
        pieChart: pieChart.data
    });
};

module.exports = {
    initializeDatabase,
    listTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData
};
