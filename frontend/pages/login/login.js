const API_BASE = 'http://127.0.0.1:8000';

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        hideError();
    });
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        return showError('Please fill in both fields.');
    }

    setLoading(true);

    try {
        const res = await fetch(`${API_BASE}/api/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.detail || 'Invalid username or password.');
        }

        const { access, refresh } = await res.json();

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('username', username);

        window.location.href = '../../index.html';

    } catch (err) {
        showError(err.message);
    } finally {
        setLoading(false);
    }
});

document.getElementById('guest-btn').addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.setItem('username', 'Guest');
    window.location.href = '../../index.html';
});

function showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    el.style.display = 'block';
}
function hideError() {
    document.getElementById('error-msg').style.display = 'none';
}
function setLoading(on) {
    const btn  = document.getElementById('login-btn');
    const text = btn.querySelector('.btn-text');
    const load = btn.querySelector('.btn-loader');
    btn.disabled  = on;
    text.style.display = on ? 'none' : 'inline';
    load.style.display = on ? 'inline' : 'none';
}

if (localStorage.getItem('access_token')) {
    window.location.href = '../../index.html';
}