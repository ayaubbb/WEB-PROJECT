document.addEventListener('DOMContentLoaded', () => {
    let pageInterval;
    const username = localStorage.getItem('username') || 'Guest';


    const sidebarName = document.getElementById('username-display');
    const headerName = document.getElementById('header-username-display');
    const userAvatar = document.getElementById('user-avatar');

    if (sidebarName) sidebarName.textContent = username;
    if (headerName) headerName.textContent = username;
    
    if (userAvatar) {
        userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=26a69a&color=fff&rounded=true`;
    }

    const loadPage = async (pageName) => {
        const contentArea = document.getElementById('page-content');
        if (pageInterval) {
            clearInterval(pageInterval);
        }

        try {
            const res = await fetch(`pages/${pageName}/${pageName}.html`);
            if (!res.ok) throw new Error('not found');
            
            contentArea.innerHTML = await res.text();
            
            if (pageName === 'rooms') {
                const { initRoomsPage } = await import('./pages/rooms/rooms.js');
                await initRoomsPage();
            } else if (pageName === 'equipment') {
                const { renderEquipment } = await import('./pages/equipment/equipment.js');
                renderEquipment(); 
                pageInterval = setInterval(() => {
                    if (document.getElementById('equipment-list')) renderEquipment();
                }, 5000);
            } else if (pageName === 'canteen') {
                const { renderTables } = await import('./pages/canteen/canteen.js');
                renderTables();
                pageInterval = setInterval(() => {
                    if (document.querySelector('.tables-layout')) renderTables();
                }, 5000);
            } else if (pageName === 'dashboard') {
                const { initDashboardPage } = await import('./pages/dashboard/dashboard.js');
                await initDashboardPage();
            } else if (pageName === 'my_reports') { 
                const { initMyReportsPage } = await import('./pages/my_reports/my_reports.js');
                await initMyReportsPage();
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
            
            if (['support', 'rooms', 'dashboard', 'canteen', 'equipment', 'my_reports'].includes(page)) {
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
    
    
loadPage('dashboard');


function showDbDetails(type) {
    const details = document.getElementById('db-details');
    const title = document.getElementById('db-chart-name');
    
    if (details) details.classList.remove('db-hidden');
    
    if (type === 'rooms') title.innerText = 'Room Availability Overview';
    if (type === 'canteen') title.innerText = 'Canteen Usage Statistics';
    if (type === 'reports') title.innerText = 'Equipment Issue History';

    document.querySelectorAll('.db-card').forEach(c => c.classList.remove('active'));
    event.currentTarget.classList.add('active');
}
});