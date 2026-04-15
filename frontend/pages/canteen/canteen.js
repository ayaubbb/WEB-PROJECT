let selectedTableId = null;
const API_BASE = 'http://localhost:8000';

export async function renderTables() {
    const container = document.querySelector('.tables-layout');
    const tableSelect = document.getElementById('table-select'); // Наш новый селект
    const confirmBtn = document.querySelector('.btn-primary.full-width');
    
    if (!container || !tableSelect) return;

    const token = localStorage.getItem('access_token');

    try {
        const res = await fetch(`${API_BASE}/api/canteen/tables/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to fetch tables');
        const tables = await res.json();

        // Очищаем старые данные
        container.innerHTML = '';
        tableSelect.innerHTML = '<option value="">— select a table —</option>';

        tables.forEach(table => {
            const isAvailable = table.is_available;
            const statusClass = isAvailable ? 'available' : 'occupied';
            const tableNum = table.table_number;
            const seatsCount = table.seats;

            // 1. Создаем визуальный квадратик стола
            const box = document.createElement('div');
            box.className = `table-item ${statusClass} ${selectedTableId == table.id ? 'selected-table' : ''}`;
            box.style.cssText = "display: flex; flex-direction: column; line-height: 1.2; text-align: center;";
            box.innerHTML = `
                <span style="font-size: 16px; font-weight: 700;">${tableNum}</span>
                <small style="font-size: 11px; opacity: 0.9;">
                    ${isAvailable ? seatsCount + ' seats' : 'Occupied'}
                </small>
            `;

            if (isAvailable) {
                // Клик по квадратику выбирает значение в селекте
                box.addEventListener('click', () => {
                    tableSelect.value = table.id; // Меняем значение в выпадающем списке
                    selectedTableId = table.id;
                    
                    document.querySelectorAll('.table-item').forEach(b => b.classList.remove('selected-table'));
                    box.classList.add('selected-table');
                });

                // 2. Добавляем опцию в выпадающий список (Select)
                const opt = document.createElement('option');
                opt.value = table.id;
                opt.textContent = `${tableNum} (${seatsCount} seats)`;
                tableSelect.appendChild(opt);
            }

            container.appendChild(box);
        });

        // Слушатель для самого Селекта (если менять через список, а не кликом)
        tableSelect.onchange = () => {
            selectedTableId = tableSelect.value;
            document.querySelectorAll('.table-item').forEach(b => b.classList.remove('selected-table'));
            const selectedBox = container.querySelector(`[data-id="${selectedTableId}"]`);
            if (selectedBox) selectedBox.classList.add('selected-table');
        };

        // Логика кнопки Confirm (та же, что была раньше)
        // ... (твой код fetch POST для бронирования) ...

    } catch (err) {
        console.error("Canteen error:", err);
        container.innerHTML = '<p>Error loading table layout</p>';
    }
}