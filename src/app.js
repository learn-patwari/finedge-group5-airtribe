const express = require('express');
const transactionRoute = require('./routes/transactionRoute');
const analyticsRoute = require('./routes/analyticsRoute');
const aiRoute = require('./routes/aiRoute');
const budgetRoute = require('./routes/budgetRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Register routes
app.use('/transactions', transactionRoute);
app.use('/analytics', analyticsRoute);
app.use('/ai', aiRoute);
app.use('/budgets', budgetRoute);

app.get('/health', (req, res) => {
  res.send('Up and Running');
});

module.exports = app;
