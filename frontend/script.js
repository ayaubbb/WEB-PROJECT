document.addEventListener('DOMContentLoaded', () => {
    let pageInterval;
    const username = localStorage.getItem('username') || 'Guest';

    let selectedTableId = null;

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
            pageInterval = null;
        }

        try {
            const res = await fetch(`pages/${pageName}/${pageName}.html`);
            if (!res.ok) throw new Error('not found');
            
            contentArea.innerHTML = await res.text();

            if (pageName === 'rooms') {
                const { initRoomsPage } = await import('./pages/rooms/rooms.js');
                await initRoomsPage();
            } else if (pageName === 'equipment') {
                renderEquipment();
                pageInterval = setInterval(() => {
                    if (document.getElementById('equipment-list')) renderEquipment();
                }, 5000);
            } else if (pageName === 'canteen') {
                renderTables();
                pageInterval = setInterval(() => {
                    if (document.querySelector('.tables-layout')) renderTables();
                }, 5000);
            }
        } catch (err) {
            contentArea.innerHTML = '<h2>Page not found</h2>';
            console.error(err);
        }
    };

    function renderEquipment() {
        const list = document.getElementById('equipment-list');
        if (!list) return;

        const data = [
            { name: 'Washing Machine #1', loc: 'Room 101', status: 'Functional', color: '#4caf50' },
            { name: 'Dryer #1', loc: 'Room 101', status: 'Under Repair', color: '#ffb300' },
            { name: 'Dryer #2', loc: 'Room 101', status: 'Under Repair', color: '#ffb300' },
            { name: 'Microwave #1', loc: 'Canteen', status: 'Faulty', color: '#e53935' }
        ];

        list.innerHTML = data.map(item => `
            <tr>
                <td><input type="checkbox"></td>
                <td>${item.name}</td>
                <td>${item.loc}</td>
                <td>
                    <span class="status-dot" style="background:${item.color};"></span>
                    ${item.status}
                </td>
                <td>
                    <button class="btn-outline report-btn">Report Issue</button>
                </td>
            </tr>
        `).join('');

        const buttons = list.querySelectorAll('.report-btn');
        buttons.forEach(btn => {
            btn.onclick = () => {
                buttons.forEach(b => b.classList.remove('active-report'));
                
                btn.classList.add('active-report');
                
                console.log("Issue reported for equipment");
            };
        });
    }
    function renderTables() {
    const container = document.querySelector('.tables-layout');
    if (!container) return;

    const tables = [
        { id: 1, status: 'available' },
        { id: 2, status: 'available' },
        { id: 3, status: 'available' },
        { id: 4, status: 'occupied' },
        { id: 5, status: 'available' },
        { id: 6, status: 'occupied' },
        { id: 7, status: 'available' },
        { id: 8, status: 'available' }
    ];
    container.innerHTML = tables.map(table => `
        <div class="table-item ${table.status}" 
                 data-id="${table.id}" 
                 title="${table.status === 'available' ? 'Click to select this table' : 'Occupied'}">
                ${table.status.charAt(0).toUpperCase() + table.status.slice(1)}
            </div>
    `).join('');

    if (!container.dataset.hasListener) {
            container.onclick = (e) => {
                const item = e.target.closest('.table-item');
                if (!item || item.classList.contains('occupied')) return;

                selectedTableId = item.getAttribute('data-id');

                container.querySelectorAll('.table-item').forEach(t => t.classList.remove('selected-table'));
                item.classList.add('selected-table');

                console.log("Selected table №:", selectedTableId);
            };
            container.dataset.hasListener = "true";
        }
    }

    
    
    const menuItems = document.querySelectorAll('.menu-item');
    const pageTitle = document.getElementById('page-title');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            
            if (['support', 'rooms', 'dashboard', 'canteen', 'equipment'].includes(page)) {
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
            window.location.href = '/pages/login/login.html';
        });
    }
    
    

});