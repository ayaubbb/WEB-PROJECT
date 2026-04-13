document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username') || 'Guest';

    const sidebarName = document.getElementById('username-display');
    const headerName = document.querySelector('username-display');
    const userAvatar = document.getElementById('user-avatar');

    if (sidebarName) sidebarName.textContent = username;
    if (headerName) headerName.textContent = username;
    
    if (userAvatar) {
        userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=26a69a&color=fff&rounded=true`;
    }

    const loadPage = async (pageName) => {
        const contentArea = document.getElementById('page-content');
        try {
            const res = await fetch(`pages/${pageName}/${pageName}.html`);
            if (!res.ok) throw new Error('not found');
            
            contentArea.innerHTML = await res.text();

            if (pageName === 'rooms') {
                const { initRoomsPage } = await import('./pages/rooms/rooms.js');
                await initRoomsPage();
            }
        } catch (err) {
            contentArea.innerHTML = '<h2>Page not found</h2>';
            console.error(err);
        }
    };

    const menuItems = document.querySelectorAll('.menu-item');
    const pageTitle = document.getElementById('page-title');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            
            if (['support', 'rooms', 'dashboard'].includes(page)) {
                loadPage(page);
            }
            
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            pageTitle.textContent = item.textContent.trim();
        });
    });
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'pages/login/login.html';
        });
    }
});