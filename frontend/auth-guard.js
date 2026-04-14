(function () {
    const token    = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    const isLoginPage = window.location.pathname.includes('login.html');
    if (!token && !username) {
        if (!isLoginPage) {
            window.location.replace('pages/login/login.html');
        }
    } else {
        if (isLoginPage) {
            window.location.replace('/index.html');
        }
    }
})();