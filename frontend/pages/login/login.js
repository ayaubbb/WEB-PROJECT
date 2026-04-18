const API_BASE = 'http://127.0.0.1:8000';

// Логика переключения табов (уже была у тебя)
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        hideError();
    });
});

// ОБРАБОТКА ЛОГИНА
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) return showError('Please fill in both fields.');

    setLoading(true);
    try {
        const res = await fetch(`${API_BASE}/api/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) throw new Error('Invalid username or password.');

        const { access, refresh } = await res.json();

        // Чистим старое и ставим новое
        localStorage.clear(); 
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('username', username);
        localStorage.setItem('is_guest', 'false'); // Обязательно false

        window.location.replace('../../index.html');
    } catch (err) {
        showError(err.message);
    } finally {
        setLoading(false);
    }
});

// ВХОД КАК ГОСТЬ
document.getElementById('guest-btn').addEventListener('click', () => {
    localStorage.clear(); // Стираем всё старое
    localStorage.setItem('username', 'Guest');
    localStorage.setItem('is_guest', 'true'); // СТАВИМ МЕТКУ ГОСТЯ
    window.location.replace('../../index.html');
});

function showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    el.style.display = 'block';
}
function hideError() {
    const el = document.getElementById('error-msg');
    if(el) el.style.display = 'none';
}
function setLoading(on) {
    const btn = document.getElementById('login-btn');
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const load = btn.querySelector('.btn-loader');
    btn.disabled = on;
    if(text) text.style.display = on ? 'none' : 'inline';
    if(load) load.style.display = on ? 'inline' : 'none';
}