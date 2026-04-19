export const initMyReportsPage = async () => {
    try {
        if (!document.getElementById('report-modal')) {
            const modalHtml = `
                <div id="report-modal" class="modal-overlay" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>Submit New Report</h2>
                            <button id="close-modal" class="close-btn">&times;</button>
                        </div>
                        <form id="report-form">
                            <div class="form-group">
                                <label>Category</label>
                                <select id="report-category" required>
                                    <option value="canteen">Canteen & Dining</option>
                                    <option value="room">Room & Booking</option>
                                    <option value="equipment">Equipment</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Title</label>
                                <input type="text" id="report-title" placeholder="Summary..." required oninvalid="this.setCustomValidity('Please fill out this field')" oninput="this.setCustomValidity('')">
                            </div>
                            <div class="form-group">
                                <label>Equipment (Optional)</label>
                                <select id="report-equipment-id">
                                    <option value="">---------</option>
                                    <option value="1">Washing Machine LG in 101</option>
                                    <option value="2">Microwave Samsung in 102</option>
                                    <option value="3">Fridge Bosh in 103</option>
                                    <option value="4">Oven Bosh in 104</option>
                                    </select>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea id="report-text" placeholder="Describe the issue..." required oninvalid="this.setCustomValidity('Please fill out this field')" oninput="this.setCustomValidity('')"></textarea>
                            </div>
                            <button type="submit" class="submit-form-btn">Send Report</button>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            setupModalLogic();
        }

        const res = await fetch('http://127.0.0.1:8000/reports/');
        const data = await res.json();
        
        const grids = {
            canteen: document.getElementById('canteen-grid'),
            room: document.getElementById('room-grid'),
            equipment: document.getElementById('equipment-grid')
        };

        Object.values(grids).forEach(grid => { if(grid) grid.innerHTML = ''; });

        if (data.latest_actions) {
            data.latest_actions.forEach(act => {
                const categoryName = act.category || 'equipment';
                const cat = categoryName.toLowerCase();

                const cardHtml = `
                    <div class="report-card">
                        <div class="card-header">
                            <div class="user-info">
                                <div class="user-avatar-placeholder">
                                    ${act.user[0].toUpperCase()}
                                </div>
                                <div class="user-text">
                                    <span class="username">${act.user} — Room 101</span>
                                </div>
                            </div>
                            <div class="complaint-tag">
                                <i class="fa-solid fa-triangle-exclamation"></i> Complaint
                            </div>
                        </div>
                        <div class="card-body">
                            <p class="description">${act.text}</p>
                        </div>
                    </div>
                `;

                if (grids[cat]) {
                    grids[cat].insertAdjacentHTML('beforeend', cardHtml);
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
};
function setupModalLogic() {
    const modal = document.getElementById('report-modal');
    const openBtn = document.querySelector('.submit-btn');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('report-form');

    if (openBtn) openBtn.onclick = () => modal.style.display = 'flex';
    closeBtn.onclick = () => modal.style.display = 'none';
    
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const getCookie = (name) => {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        };

        const categorySelect = document.getElementById('report-category');
        const eqValue = document.getElementById('report-equipment-id').value;
        const formData = {
            title: document.getElementById('report-title').value,
            description: document.getElementById('report-text').value,
            category: document.getElementById('report-category').value,
            equipment_id: eqValue ? parseInt(eqValue) : null
        };

        try {
            const res = await fetch('http://127.0.0.1:8000/reports/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') 
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                modal.style.display = 'none';
                form.reset();
                await initMyReportsPage(); 
            } else {
                const errorData = await res.json();
                alert('Error: ' + JSON.stringify(errorData));
            }
        } catch (err) {
            console.error('Network error:', err);
        }
    };
}
