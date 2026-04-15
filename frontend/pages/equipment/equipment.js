export async function renderEquipment() {
    const list = document.getElementById('equipment-list');
    if (!list) return;

    const token = localStorage.getItem('access_token');

    try {
        const res = await fetch('http://localhost:8000/equipment/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error('Failed to fetch equipment');

        const data = await res.json();

        list.innerHTML = data.map(item => `
            <tr>
                <td><input type="checkbox"></td>
                <td>${item.name}</td>
                <td>${item.location || 'N/A'}</td>
                <td>
                    <span class="status-dot" style="background:${item.status === 'Functional' ? '#4caf50' : (item.status === 'Under Repair' ? '#ffb300' : '#e53935')};"></span>
                    ${item.status}
                </td>
                <td>
                    <button class="btn-outline report-btn" data-id="${item.id}">Report Issue</button>
                </td>
            </tr>
        `).join('');

        // Используем делегирование событий на список, чтобы не вешать много обработчиков
        list.onclick = (e) => {
            const btn = e.target.closest('.report-btn');
            if (!btn) return;

            // Убираем активный класс у всех кнопок в этом списке
            list.querySelectorAll('.report-btn').forEach(b => b.classList.remove('active-report'));
            
            // Добавляем класс нажатой кнопке
            btn.classList.add('active-report');
            
            console.log("Issue reported for ID:", btn.getAttribute('data-id'));
        };

    } catch (err) {
        console.error("Equipment error:", err);
        list.innerHTML = '<tr><td colspan="5" style="text-align:center;">Error loading data</td></tr>';
    }
}