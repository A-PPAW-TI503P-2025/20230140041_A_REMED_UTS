let currentRole = null;
let userCoords = { lat: null, lng: null };

document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    if (bookForm) {
        bookForm.addEventListener('submit', handleFormSubmit);
    }
});

window.login = function(role) {
    currentRole = role;
    
    const portal = document.getElementById('role-portal');
    const appContainer = document.getElementById('app-container');
    const displayRole = document.getElementById('display-role');
    const addTrigger = document.getElementById('add-trigger');
    const geoBadge = document.getElementById('geo-indicator');

    if (portal) portal.classList.add('hidden');
    if (appContainer) appContainer.classList.remove('hidden');
    if (displayRole) displayRole.innerText = `(${role.toUpperCase()})`;

    if (addTrigger) {
        addTrigger.classList.toggle('hidden', role !== 'admin');
    }

    if (role === 'user') {
        if (geoBadge) geoBadge.classList.remove('hidden');
        detectLocation();
    }

    setupTableHeader();
    fetchBooks();
};

function detectLocation() {
    const coordText = document.getElementById('coord-text');
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            userCoords.lat = pos.coords.latitude;
            userCoords.lng = pos.coords.longitude;
            if (coordText) coordText.innerText = `${userCoords.lat.toFixed(2)}, ${userCoords.lng.toFixed(2)}`;
        }, err => {
            if (coordText) coordText.innerText = "GPS Aktif (Default)";
            userCoords.lat = -6.2000;
            userCoords.lng = 106.8166;
        });
    }
}

async function fetchBooks() {
    try {
        const res = await fetch('/api/books');
        const books = await res.json();
        renderTable(books);
    } catch (err) {
        console.error("Gagal memuat buku:", err);
    }
}

function renderTable(books) {
    const body = document.getElementById('table-body');
    if (!body) return;

    body.innerHTML = books.map(book => {
        const isReady = book.stock > 0;
        return `
            <tr>
                <td><strong>${book.title}</strong></td>
                <td>${book.author}</td>
                <td>${book.stock}</td>
                <td>
                    <span style="color: ${isReady ? 'var(--success)' : 'var(--danger)'}">
                        ${isReady ? 'Tersedia' : 'Habis'}
                    </span>
                </td>
                <td>
                    ${currentRole === 'admin' ? `
                        <button class="btn-action success" onclick="prepareEdit(${book.id}, '${book.title}', '${book.author}', ${book.stock})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action" style="background: var(--danger); color:white" onclick="deleteBook(${book.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : `
                        <button class="btn-action success" onclick="borrowBook(${book.id})" ${!isReady ? 'disabled' : ''}>
                            <i class="fas fa-hand-holding"></i> Pinjam
                        </button>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

window.borrowBook = async function(bookId) {
    if (!userCoords.lat) return alert("Mencari lokasi GPS...");

    try {
        const res = await fetch('/api/borrow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-role': 'user',
                'x-user-id': '1001' 
            },
            body: JSON.stringify({
                bookId,
                latitude: userCoords.lat,
                longitude: userCoords.lng
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Berhasil meminjam buku!");
            fetchBooks();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("Terjadi kesalahan sistem");
    }
};

async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const data = {
        title: document.getElementById('inp-title').value,
        author: document.getElementById('inp-author').value,
        stock: parseInt(document.getElementById('inp-stock').value)
    };

    try {
        const res = await fetch(id ? `/api/books/${id}` : '/api/books', {
            method: id ? 'PUT' : 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-user-role': 'admin'
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            window.toggleModal();
            fetchBooks();
        }
    } catch (err) {
        alert("Gagal menyimpan data");
    }
}

window.deleteBook = async function(id) {
    if (!confirm("Hapus koleksi ini?")) return;
    try {
        await fetch(`/api/books/${id}`, { 
            method: 'DELETE',
            headers: { 'x-user-role': 'admin' }
        });
        fetchBooks();
    } catch (err) {
        alert("Gagal menghapus");
    }
};

window.prepareEdit = function(id, title, author, stock) {
    window.toggleModal('edit');
    document.getElementById('edit-id').value = id;
    document.getElementById('inp-title').value = title;
    document.getElementById('inp-author').value = author;
    document.getElementById('inp-stock').value = stock;
    document.getElementById('modal-title').innerText = "Edit Koleksi";
};

window.toggleModal = function(mode) {
    const modal = document.getElementById('form-modal');
    if (modal) modal.classList.toggle('hidden');
    if (mode === 'add') {
        document.getElementById('book-form').reset();
        document.getElementById('edit-id').value = "";
        document.getElementById('modal-title').innerText = "Tambah Koleksi Baru";
    }
};

window.logout = function() {
    location.reload();
};

function setupTableHeader() {
    const head = document.getElementById('table-head');
    if (head) {
        head.innerHTML = `<tr><th>Judul Koleksi</th><th>Penulis</th><th>Stok</th><th>Status</th><th>Aksi</th></tr>`;
    }
}