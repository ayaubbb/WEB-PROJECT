(function () {
    const token = localStorage.getItem('access_token');
    const isGuest = localStorage.getItem('is_guest') === 'true';
    const path = window.location.pathname;

    if (!token && !isGuest) {
        if (!path.includes('login.html')) {
            window.location.replace('pages/login/login.html');
        }
    } else {
        if (path.includes('login.html')) {
            window.location.replace('../../index.html');
        }
    }
})();