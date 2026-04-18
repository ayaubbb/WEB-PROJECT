const API_BASE = 'http://127.0.0.1:8000';

function getAuthHeaders() {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function showCanteenNotification(message, type = 'error') {
    const oldNote = document.querySelector('.canteen-notification');
    if (oldNote) oldNote.remove();

    const note = document.createElement('div');
    note.className = `canteen-notification canteen-notification--${type}`;
    note.textContent = message;
    
    const header = document.querySelector('.canteen-header');
    header.insertAdjacentElement('afterend', note);

    setTimeout(() => note.remove(), 4000);
}

export const initCanteenPage = async () => {
    const dateInput = document.getElementById('booking-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    await renderTableMap();
    await renderTableBookings();
    
    document.getElementById('meal-time-select').addEventListener('change', renderTableMap);
    document.getElementById('booking-date').addEventListener('change', renderTableMap);

    setInterval(async () => {
        await renderTableMap(true); 
        await renderTableBookings();
    }, 5000);

    initTableBookingForm();
};

export async function renderTableMap(isAutoUpdate = false) {
    const mapGrid = document.getElementById('table-map-grid');
    const tableSelect = document.getElementById('table-select');
    const mealTime = document.getElementById('meal-time-select').value;
    const date = document.getElementById('booking-date').value;

    if (!mapGrid) return;

    try {
        const res = await fetch(`${API_BASE}/api/canteen/tables/?date=${date}&meal_time=${mealTime}`, {
            headers: getAuthHeaders()
        });
        const tables = await res.json();

        const currentSelectedId = tableSelect.value;

        mapGrid.innerHTML = ''; 
        tableSelect.innerHTML = '<option value="">— select a table —</option>';

        tables.forEach(table => {
            const freeSeats = table.seats - table.current_occupancy;
            const isFull = table.is_full;

            const box = document.createElement('div');
            const isSelected = table.id.toString() === currentSelectedId;
            box.className = `canteen-box ${isFull ? 'busy' : 'available'} ${isSelected ? 'selected' : ''}`;
            
            box.innerHTML = `
                <span>Table ${table.table_number}</span>
                <small>Available: ${freeSeats} / ${table.seats} seats</small>
            `;

            if (!isFull) {
                box.onclick = () => {
                    tableSelect.value = table.id;
                    document.querySelectorAll('.canteen-box').forEach(b => b.classList.remove('selected'));
                    box.classList.add('selected');
                };

                const opt = document.createElement('option');
                opt.value = table.id;
                opt.textContent = `Table ${table.table_number} (${freeSeats} seats left)`;
                if (isSelected) opt.selected = true;
                tableSelect.appendChild(opt);
            }
            mapGrid.appendChild(box);
        });
    } catch (err) { 
        if (!isAutoUpdate) console.error("Update failed", err);
    }
}

async function renderTableBookings() {
    const tbody = document.getElementById('table-bookings-body');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE}/api/canteen/book/`, { headers: getAuthHeaders() });
        const bookings = await res.json();
        if (!bookings.length) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px;">No bookings</td></tr>';
            return;
        }
        tbody.innerHTML = bookings.map(b => `
            <tr>
                <td>Table ${b.table_number}</td>
                <td>${b.booking_date}</td>
                <td>${b.meal_time}</td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

function initTableBookingForm() {
    const form = document.getElementById('canteen-booking-form');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const tableId = document.getElementById('table-select').value;
        const bookingDate = document.getElementById('booking-date').value;

        if (!tableId) {
            showCanteenNotification("Please select a table on the map!");
            return;
        }

        const selectedDate = new Date(bookingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showCanteenNotification("Booking date cannot be in the past!");
            return;
        }

        const payload = {
            table_id: parseInt(tableId),
            booking_date: bookingDate,
            meal_time: document.getElementById('meal-time-select').value
        };

        try {
            const res = await fetch(`${API_BASE}/api/canteen/book/`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                showCanteenNotification("Confirmed!", "success");
                await renderTableMap(); 
                await renderTableBookings(); 
                //form.reset();
                document.getElementById('booking-date').value = new Date().toISOString().split('T')[0];
            } else {
                showCanteenNotification(data.detail || data.error || "Error during booking");
            }
        } catch (err) {
            showCanteenNotification("Server error. Try again.");
        }
    };
}