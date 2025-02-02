document.getElementById('loginContainer').style.display = 'flex';

const initialBalance = 5000;
const accounts = [
    { "username": "Xeanti", "password": "Xeanti" },
    { "username": "Sir Ian", "password": "Sir Ian" },
    { "username": "keth", "password": "keth1" },
    { "username": "User1", "password": "Pass1" },
    { "username": "user2", "password": "pass2" },
    { "username": "user3", "password": "pass3" }

];

let currentUser = null;
let balance = 0;
let dailyWithdrawal = 0;
const MAX_BALANCE = 10000000;
const MAX_DAILY_WITHDRAWAL = 100000;
const MIN_DEPOSIT = 100;
const MIN_WITHDRAWAL = 500;
const balanceElement = document.getElementById('balance');
const transactionHistoryElement = document.getElementById('transactionHistory');
const transactionAmountInput = document.getElementById('transactionAmount');

window.onload = function () {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        currentUser = storedUser;
        const storedBalance = localStorage.getItem(`balance_${currentUser}`);
        balance = storedBalance ? parseFloat(storedBalance) : initialBalance;
        updateBalance();
        loadUserTransactions();
    }
};

document.getElementById('username').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        login();
    }
});

document.getElementById('password').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        login();
    }
});

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
        alert('Login successful!');
        localStorage.setItem('loggedInUser', username);
        currentUser = username;
        
        const storedBalance = localStorage.getItem(`balance_${currentUser}`);
        balance = storedBalance ? parseFloat(storedBalance) : initialBalance;
        
        document.getElementById('loginContainer').style.display = 'none';
        updateBalance();
        loadUserTransactions();
    } else {
        alert('Invalid username or password');
    }
}

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
        if (amount < MIN_WITHDRAWAL) {
            alert(`Minimum withdrawal amount is ₱${MIN_WITHDRAWAL}.`);
            return;
        }
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
    localStorage.setItem(`balance_${currentUser}`, balance.toFixed(2));
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
    if (!currentUser) return;

    let transactions = localStorage.getItem(`transactions_${currentUser}`);
    transactions = transactions ? JSON.parse(transactions) : [];
    transactions.push({ type, amount });
    localStorage.setItem(`transactions_${currentUser}`, JSON.stringify(transactions));
}

function loadUserTransactions() {
    transactionHistoryElement.innerHTML = "";
    const storedTransactions = localStorage.getItem(`transactions_${currentUser}`);

    if (storedTransactions) {
        const transactions = JSON.parse(storedTransactions);
        transactions.forEach(({ type, amount }) => {
            addTransactionToHistory(type, amount, false);
        });
    }
}

transactionAmountInput.maxLength = 8;
