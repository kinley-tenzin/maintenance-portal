// Utility to generate rooms for a block
export default function generateRooms(prefix, blocks = 4, roomsPerBlock = 12) {
  const rooms = [];
  for (let block = 1; block <= blocks; block++) {
    for (let num = 1; num <= roomsPerBlock; num++) {
      rooms.push({
        id: rooms.length + 1,
        name: `${prefix}${block}-${String(num).padStart(2, '0')}`,
        hasComplaint: false,
        complaints: [],
      });
    }
  }
  return rooms;
}

let roomsData = [];
let selectedRoomId = null;

function createRoomCards() {
  if (typeof window === 'undefined') return;
  const grid = document.getElementById('roomGrid');
  if (!grid) return;
  grid.innerHTML = roomsData.map(room => `
      <div class="cursor-pointer transform transition-all duration-200 hover:scale-105"
           onclick="openComplaintForm(${room.id})"
           id="room-${room.id}">
          <div class="aspect-square rounded-lg ${room.hasComplaint ? 'bg-secondary/20' : 'bg-white'} 
               shadow-sm border border-gray-200 flex items-center justify-center">
              <i class="ri-home-4-line text-4xl ${room.hasComplaint ? 'text-secondary' : 'text-gray-400'}"></i>
          </div>
          <div class="mt-2 flex items-center justify-between">
              <p class="font-medium text-white">${room.name}</p>
              ${room.hasComplaint ? 
                  `<span class="text-xs text-white bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      ${room.complaints.length} issue${room.complaints.length > 1 ? 's' : ''}
                  </span>` : ''}
          </div>
      </div>
  `).join('');
}

function openComplaintForm(roomId) {
  if (typeof window === 'undefined') return;
  selectedRoomId = roomId;
  const room = roomsData.find(r => r.id === roomId);
  const selectedRoomEl = document.getElementById('selectedRoom');
  const complaintFormEl = document.getElementById('complaintForm');
  const overlayEl = document.getElementById('overlay');
  const complaintTextEl = document.getElementById('complaintText');
  if (selectedRoomEl) selectedRoomEl.textContent = room ? room.name : `Room ${roomId}`;
  if (complaintFormEl) complaintFormEl.style.display = 'block';
  if (overlayEl) overlayEl.style.display = 'block';
  if (complaintTextEl) complaintTextEl.value = '';
}

function closeComplaintForm() {
  if (typeof window === 'undefined') return;
  const complaintFormEl = document.getElementById('complaintForm');
  const overlayEl = document.getElementById('overlay');
  if (complaintFormEl) complaintFormEl.style.display = 'none';
  if (overlayEl) overlayEl.style.display = 'none';
  selectedRoomId = null;
}

function submitComplaint() {
  if (typeof window === 'undefined') return;
  const complaintTextEl = document.getElementById('complaintText');
  if (!complaintTextEl) return;
  const complaintText = complaintTextEl.value.trim();
  if (!complaintText) return;

  const room = roomsData.find(r => r.id === selectedRoomId);
  if (room) {
      room.hasComplaint = true;
      room.complaints.push({
          text: complaintText,
          date: new Date().toISOString()
      });
      createRoomCards();
      closeComplaintForm();
  }
}

// When DOM is ready
if (typeof window !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("roomGrid");
    if (grid) {
        const hostelPrefix = grid.dataset.hostel || "RKA";  // Default fallback
        roomsData = generateRooms(hostelPrefix);
        createRoomCards();
    }
  });
}
