const API_BASE = 'http://127.0.0.1:8000';

export const initRoomsPage = async () => {
    const username = localStorage.getItem('username') || 'Guest';
    const nameInput = document.getElementById('booking-name');
    if (nameInput) nameInput.value = username;

    await renderRoomsMap();
    await renderBookingsTable();
    initBookingForm(username);
};

function getAuthHeaders() {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

async function renderRoomsMap() {
    const mapGrid    = document.getElementById('dynamic-map-grid');
    const roomSelect = document.getElementById('room-select');
    if (!mapGrid) return;

    const currentSelectedId = roomSelect.value;
    mapGrid.innerHTML = '<div class="map-loading">Loading rooms...</div>';

    try {
        const res = await fetch(`${API_BASE}/rooms/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rooms = await res.json();

        mapGrid.innerHTML    = '';
        roomSelect.innerHTML = '<option value="">— select a room —</option>';

        const COLS = 6;
        for (let i = 0; i < rooms.length; i += COLS) {
            const row = document.createElement('div');
            row.className = 'map-row';

            rooms.slice(i, i + COLS).forEach(room => {
                const occupied = room.current_occupancy || 0;
                const total = room.capacity || 1;
                const isFull = occupied >= total;

                const box = document.createElement('div');
                box.className = `room-box ${isFull ? 'busy' : 'available'}`;
                
                box.innerHTML = `
                    <span>${room.name}</span>
                    <small>${isFull ? 'Occupied' : 'Available: ' + occupied + ' / ' + total}</small>
                `;

                const opt = document.createElement('option');
                opt.value = room.id;
                opt.textContent = `${room.name} (${total - occupied} seats left)`;
                if (isFull) opt.disabled = true; 
                roomSelect.appendChild(opt);

                if (!isFull) {
                    box.title = 'Click to select this room';
                    box.addEventListener('click', () => {
                        roomSelect.value = room.id;
                        document.querySelectorAll('.room-box').forEach(b => b.classList.remove('selected'));
                        box.classList.add('selected');
                    });
                }

                row.appendChild(box);
            });

            mapGrid.appendChild(row);
        }
    } catch (err) {
        mapGrid.innerHTML = `<div class="map-error">Failed to load rooms: ${err.message}</div>`;
        console.error('rooms fetch:', err);
    }
}

async function renderBookingsTable() {
    const tbody = document.getElementById('bookings-log-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#94a3b8">Loading...</td></tr>';

    try {
        const res = await fetch(`${API_BASE}/bookings/`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const bookings = await res.json();

        if (!bookings.length) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#94a3b8">No bookings yet</td></tr>';
            return;
        }

        tbody.innerHTML = bookings.map(b => `
            <tr>
                <td>Room ${b.room_name || b.room}</td>
                <td>${b.user_name || b.user}</td>
                <td>${fmt(b.start_time)}</td>
                <td>${fmt(b.end_time)}</td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#ef4444">Error: ${err.message}</td></tr>`;
    }
}

function initBookingForm(username) {
    const form = document.getElementById('main-booking-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!localStorage.getItem('access_token')) {
            return showNotification('Please log in to create a booking.', 'error');
        }

        const roomId   = document.getElementById('room-select')?.value;
        const checkIn  = document.getElementById('check-in')?.value;
        const checkOut = document.getElementById('check-out')?.value;

        if (!roomId || !checkIn || !checkOut) {
            return showNotification('Please fill in all fields.', 'error');
        }
        if (new Date(checkIn) >= new Date(checkOut)) {
            return showNotification('Check-out must be after check-in.', 'error');
        }

        const payload = {
            room_id:    parseInt(roomId),
            start_time: checkIn,
            end_time:   checkOut
        };

        try {
            const res = await fetch(`${API_BASE}/bookings/`, {
                method:  'POST',
                headers: getAuthHeaders(),
                body:    JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                let errorMessage = errData.error || errData.detail || "Server error";
                if (typeof errData === 'object' && !errData.error && !errData.detail) {
                    errorMessage = Object.values(errData).flat().join(' | ');
                }

                throw new Error(errorMessage);
            }

            showNotification('Booking confirmed!', 'success');
            form.reset();
            document.getElementById('booking-name').value = username;

            await renderRoomsMap();
            await renderBookingsTable();

        } catch (err) {
            showNotification(`Error: ${err.message}`, 'error');
        }
    });
}

function fmt(dt) {
    if (!dt) return '—';
    return dt.replace('T', ' ').slice(0, 16);
}

function showNotification(msg, type = 'info') {
    document.querySelector('.rooms-notification')?.remove();
    const div = document.createElement('div');
    div.className = `rooms-notification rooms-notification--${type}`;
    div.textContent = msg;
    document.querySelector('.rooms-container')?.prepend(div);
    setTimeout(() => div.remove(), 4000);
}