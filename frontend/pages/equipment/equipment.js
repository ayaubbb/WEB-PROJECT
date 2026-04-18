export async function renderEquipment() {
  const list = document.getElementById('equipment-list');
  if (!list) return;

  await loadEquipment(list);
  await loadRooms();  // ← добавь это

  const submitBtn = document.getElementById('eq-submit');
  if (submitBtn) {
    submitBtn.onclick = async () => {
      const name = document.getElementById('eq-name').value.trim();
      const room = document.getElementById('eq-room').value;
      const isWorking = document.getElementById('eq-status').value === 'true';
      const msg = document.getElementById('eq-message');

      if (!name || !room) {
        msg.style.color = '#e53935';
        msg.textContent = 'Please fill in all fields!';
        return;
      }

      try {
        const res = await fetch('http://localhost:8000/equipment/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, room: parseInt(room), is_working: isWorking })
        });

        if (res.ok) {
          msg.style.color = '#26a69a';
          msg.textContent = 'Equipment added successfully!';
          document.getElementById('eq-name').value = '';
          document.getElementById('eq-room').value = '';
          await loadEquipment(list);
        } else {
          const err = await res.json();
          msg.style.color = '#e53935';
          msg.textContent = 'Error: ' + JSON.stringify(err);
        }
      } catch (err) {
        console.error(err);
      }
    };
  }
}

async function loadRooms() {
  const select = document.getElementById('eq-room');
  if (!select) return;

  try {
    const res = await fetch('http://localhost:8000/rooms/');
    const rooms = await res.json();

    select.innerHTML = '<option value="">— select room —</option>';
    rooms.forEach(room => {
      const opt = document.createElement('option');
      opt.value = room.id;
      opt.textContent = `Room ${room.number}`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Rooms load error:', err);
  }
}

async function loadEquipment(list) {
  try {
    const res = await fetch('http://localhost:8000/equipment/');
    const data = await res.json();

    list.innerHTML = data.map(item => {
      const statusText = item.is_working ? 'Functional' : 'Faulty';
      const statusColor = item.is_working ? '#4caf50' : '#e53935';
      return `
        <tr>
          <td>${item.name}</td>
          <td>Room ${item.room_number}</td>
          <td>
            <span class="status-dot" style="background:${statusColor};"></span>
            ${statusText}
          </td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error('Equipment error:', err);
    list.innerHTML = '<tr><td colspan="3" style="text-align:center;">Error loading data</td></tr>';
  }
}