(function () {
    const token = localStorage.getItem('access_token');
    const isGuest = localStorage.getItem('is_guest') === 'true';
    const path = window.location.pathname;

    // Если нет ни токена, ни гостя — гоним на логин (если мы еще не там)
    if (!token && !isGuest) {
        if (!path.includes('login.html')) {
            window.location.replace('pages/login/login.html');
        }
    } else {
        // Если человек УЖЕ вошел, и случайно забрел на страницу логина — вернем его в дешборд
        if (path.includes('login.html')) {
            window.location.replace('../../index.html');
        }
    }
})();