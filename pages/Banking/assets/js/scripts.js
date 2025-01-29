let balance = 0;
let dailyWithdrawal = 0;
const MAX_BALANCE = 10000000;
const MAX_DAILY_WITHDRAWAL = 100000;
const MIN_DEPOSIT = 100;
const balanceElement = document.getElementById('balance');
const transactionHistoryElement = document.getElementById('transactionHistory');
const transactionAmountInput = document.getElementById('transactionAmount');

window.onload = function () {
    const storedBalance = localStorage.getItem('balance');
    const storedTransactions = localStorage.getItem('transactions');
    const storedDailyWithdrawal = localStorage.getItem('dailyWithdrawal');

    if (storedBalance) {
        balance = parseFloat(storedBalance);
    } else {
        balance = 5000;
        localStorage.setItem('balance', balance.toFixed(2));
    }
    
    updateBalance();

    if (storedDailyWithdrawal) {
        dailyWithdrawal = parseFloat(storedDailyWithdrawal);
    }

    if (storedTransactions) {
        const transactions = JSON.parse(storedTransactions);
        transactions.forEach(({ type, amount }) => {
            addTransactionToHistory(type, amount, false);
        });
    }
};

function handleTransaction(type) {
    const amount = parseFloat(transactionAmountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    if (type === 'deposit') {
        if (amount < MIN_DEPOSIT) {
            alert(`Minimum deposit amount is ₱${MIN_DEPOSIT}.`);
            return;
        }
        if (balance + amount > MAX_BALANCE) {
            alert(`Maximum balance limit of ₱${MAX_BALANCE} exceeded.`);
            return;
        }
        balance += amount;
        addTransactionToHistory('deposit', amount);
    }

    if (type === 'withdraw') {
        if (amount > balance) {
            alert('Insufficient balance!');
            return;
        }
        if (dailyWithdrawal + amount > MAX_DAILY_WITHDRAWAL) {
            alert(`Maximum withdrawal limit of ₱${MAX_DAILY_WITHDRAWAL} per day exceeded.`);
            return;
        }

        balance -= amount;
        dailyWithdrawal += amount;
        localStorage.setItem('dailyWithdrawal', dailyWithdrawal.toFixed(2));
        addTransactionToHistory('withdrawal', amount);
    }

    updateBalance();
    transactionAmountInput.value = '';
}

function updateBalance() {
    balanceElement.textContent = balance.toFixed(2);
    localStorage.setItem('balance', balance.toFixed(2));
}

function addTransactionToHistory(type, amount, save = true) {
    const transactionElement = document.createElement('div');
    transactionElement.classList.add('transaction', type);
    transactionElement.innerHTML = `
        <span>${type === 'deposit' ? 'Deposit' : 'Withdrawal'}</span>
        <span>₱${amount.toFixed(2)}</span>
    `;
    transactionHistoryElement.appendChild(transactionElement);

    if (save) {
        saveTransactionToLocalStorage(type, amount);
    }
}

function saveTransactionToLocalStorage(type, amount) {
    let transactions = localStorage.getItem('transactions');
    transactions = transactions ? JSON.parse(transactions) : [];
    transactions.push({ type, amount });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

transactionAmountInput.maxLength = 8;