(function () {
    const token    = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    if (!token && !username) {
        window.location.replace('/pages/login/login.html');
    }
})();