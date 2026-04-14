export const initDashboardPage = async () => {
    try {
        const res = await fetch('http://127.0.0.1:8000/dashboard-stats/');
        const data = await res.json();
        
        const roomsVal = document.getElementById('stat-rooms');
        if (roomsVal) roomsVal.textContent = data.active_bookings;
        
        const canteenVal = document.getElementById('stat-canteen');
        if (canteenVal) {
            canteenVal.textContent = data.canteen_percent + '%';
            const bar = document.getElementById('bar-canteen');
            if (bar) bar.style.width = data.canteen_percent + '%';
        }

        const reportsVal = document.getElementById('stat-reports');
        if (reportsVal) reportsVal.textContent = data.open_reports;

        const actionsContainer = document.getElementById('actions-log'); 
        if (actionsContainer && data.latest_actions) {
            actionsContainer.innerHTML = data.latest_actions.map(act => `
                <div class="action-item" style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                    <div class="action-avatar" style="width: 35px; height: 35px; background: #e0f2f1; color: #26a69a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">
                        ${act.user[0].toUpperCase()}
                    </div>
                    <div class="action-info">
                        <p style="margin: 0; font-size: 14px; color: #334155;">
                            <strong style="color: #1e293b;">${act.user}</strong> ${act.text}
                        </p>
                        <small style="color: #94a3b8; font-size: 12px;">${act.time}</small>
                    </div>
                </div>
            `).join('');
        }

        const cards = document.querySelectorAll('.stat-card');
        const detailTitle = document.getElementById('details-title');
        const chartContainer = document.getElementById('dynamic-chart');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                const type = card.getAttribute('data-type');
                
                const label = card.querySelector('.card-label').textContent;
                if (detailTitle) detailTitle.textContent = label;

                renderSimpleChart(chartContainer, data.charts[type]);
            });
        });

        if (cards.length > 0) {
            cards[0].click(); 
        }

    } catch (err) {
        console.error("Error:", err);
    }
};

function renderSimpleChart(container, heights) {
    if (!container) return;
    container.innerHTML = ''; 

    if (!heights || heights.length === 0) {
        container.innerHTML = '<div class="chart-empty-msg">No data available</div>';
        return;
    }

    const realMax = Math.max(...heights);
    const maxValForScale = realMax < 10 ? 10 : realMax;

    container.innerHTML = heights.map(h => {
        const barHeight = (h / maxValForScale) * 100;
        return `
            <div class="bar-group" style="
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: flex-end; /* Выравниваем всё по низу */
                gap: 8px; 
                height: 100%; /* ТЕПЕРЬ ОБЕРТКА ЗАНИМАЕТ ВСЮ ВЫСОТУ */
                flex: 1; /* Распределяем их равномерно */
            ">
                <span style="font-size: 12px; color: #94a3b8; font-weight: bold;">${h}</span>
                <div style="
                    height: ${barHeight}%; 
                    width: 45px; 
                    background: linear-gradient(180deg, #26a69a 0%, #80cbc4 100%); 
                    border-radius: 6px 6px 0 0;
                    transition: all 0.5s ease;
                "></div>
            </div>
        `;
    }).join('');

    // Настраиваем сам контейнер
    container.style.display = 'flex';
    container.style.alignItems = 'flex-end'; // Контейнер держит всё внизу
    container.style.justifyContent = 'space-around';
    container.style.height = '200px'; 
    container.style.padding = '20px 10px 10px 10px';
}