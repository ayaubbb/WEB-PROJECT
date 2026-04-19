export const initDashboardPage = async () => {
    try {
        const res = await fetch('http://127.0.0.1:8000/dashboard-stats/');
        const data = await res.json();
        
        // Обновление статистики
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

        // Обновление лога действий
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

        const infoData = {
            rooms: `
                <div class="info-wrapper">
                    <div class="info-card highlight-teal">
                        <div class="card-header-inner">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                            <span>Available Hours</span>
                        </div>
                        <p class="hero-text">08:00 — 23:00</p>
                        <div class="status-badge">Daily Access</div>
                    </div>
                    <div class="info-card highlight-red">
                        <div class="card-header-inner">
                            <i class="fa-solid fa-headset"></i>
                            <span>Support Only</span>
                        </div>
                        <p class="card-desc">Self-cancellation is <strong>disabled</strong> to prevent booking abuse. Please contact the administrator.</p>
                    </div>
                    <div class="info-card full-width info-banner">
                        <i class="fa-solid fa-hourglass-half"></i>
                        <span><strong>Advanced Booking Required:</strong> Please ensure all reservations are made <strong>prior</strong> to your intended start time to guarantee system confirmation.</span>
                    </div>
                </div>`,
            canteen: `
                <div class="info-wrapper">
                    <div class="schedule-container">
                        <div class="schedule-card">
                            <div class="meal-icon">🍳</div>
                            <div class="meal-info">
                                <span class="meal-name">Breakfast</span>
                                <span class="meal-time">06:30 – 09:00</span>
                            </div>
                        </div>
                        <div class="schedule-card">
                            <div class="meal-icon">🍱</div>
                            <div class="meal-info">
                                <span class="meal-name">Lunch</span>
                                <span class="meal-time">11:00 – 13:00</span>
                            </div>
                        </div>
                        <div class="schedule-card">
                            <div class="meal-icon">🍕</div>
                            <div class="meal-info">
                                <span class="meal-name">Dinner</span>
                                <span class="meal-time">17:00 – 19:00</span>
                            </div>
                        </div>
                    </div>
                </div>`,
            reports: `
                <div class="info-wrapper">
                    <div class="report-steps-v2">
                        <div class="step-v2">
                            <div class="step-icon-v2"><i class="fa-solid fa-pen-to-square"></i></div>
                            <div class="step-text-v2">
                                <strong>Simple Reporting</strong>
                                <span>Just tell us what’s broken (e.g. "Microwave") and describe the issue.</span>
                            </div>
                        </div>
                        <div class="step-v2 urgent-v2">
                            <div class="step-icon-v2"><i class="fa-solid fa-bolt-lightning"></i></div>
                            <div class="step-text-v2">
                                <strong>Safety First</strong>
                                <span>For leaks or electrical issues, contact Security or Staff immediately.</span>
                            </div>
                        </div>
                    </div>
                    <div class="info-card full-width feedback-banner">
                        <div class="feedback-content">
                            <i class="fa-solid fa-comment-dots"></i>
                            <span><strong>We value your feedback!</strong> Tell us how we can make the dorm better.</span>
                        </div>
                    </div>
                </div>`
        };
        const cards = document.querySelectorAll('.stat-card');
        const detailTitle = document.getElementById('details-title');
        const infoContentArea = document.getElementById('info-content-area');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                const type = card.getAttribute('data-type');
                const label = card.querySelector('.card-label').textContent;
                
                if (detailTitle) detailTitle.textContent = label;
                
                if (infoContentArea && infoData[type]) {
                    infoContentArea.innerHTML = infoData[type];
                }
            });
        });

        if (cards.length > 0) {
            cards[0].click(); 
        }

    } catch (err) {
        console.error("Error:", err);
    }
};

