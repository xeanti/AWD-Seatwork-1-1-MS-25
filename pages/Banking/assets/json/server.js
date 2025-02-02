const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const accounts = JSON.parse(fs.readFileSync('accounts.json', 'utf8'));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
        res.json({ success: true, message: "Login successful!", balance: 5000 });
    } else {
        res.status(401).json({ success: false, message: "Invalid username or password" });
    }
});

app.post('/transaction', (req, res) => {
    const { username, type, amount } = req.body;

    if (!username || !type || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid transaction data." });
    }

    const account = accounts.find(acc => acc.username === username);
    if (!account) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    if (type === 'withdraw' && amount < 500) {
        return res.status(400).json({ success: false, message: "Minimum withdrawal amount is ₱500." });
    }

    if (!account.transactions) {
        account.transactions = [];
    }

    account.transactions.push({ type, amount });
    fs.writeFileSync('accounts.json', JSON.stringify(accounts, null, 2));

    res.json({ success: true, message: "Transaction recorded.", transactions: account.transactions });
});

app.get('/transactions/:username', (req, res) => {
    const { username } = req.params;
    const account = accounts.find(acc => acc.username === username);

    if (!account) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, transactions: account.transactions || [] });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
