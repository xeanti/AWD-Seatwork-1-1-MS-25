document.getElementById('loginContainer').style.display = 'flex';

const initialBalance = 5000; // Set the initial balance
const accounts = [
    { username: 'Sir', password: 'Sir1' },
    { username: 'Xeanti', password: 'Xeanti__' },
    { username: 'user3', password: 'pass3' }
];

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
        alert('Login successful!');
        localStorage.setItem('balance', initialBalance); // Store the initial balance
        document.getElementById('loginContainer').style.display = 'none'; // Hide login
    } else {
        alert('Invalid username or password');
    }
}