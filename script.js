// Storage Key
const STORAGE_KEY = "blue_bloom_users";

// Default dummy data if localStorage is empty
const initialUsers = [
    { id: 1, name: "Maria Clara", email: "maria@example.com" },
    { id: 2, name: "Juan Dela Cruz", email: "juan@example.com" }
];

// Initialize Users
function getUsers() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
        return initialUsers;
    }
    return JSON.parse(data);
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    renderUsers();
}

// Render Users to Table
function renderUsers() {
    const users = getUsers();
    const tbody = document.getElementById("usersTableBody");
    const searchVal = document.getElementById("searchInput").value.toLowerCase().trim();

    // Filter by search
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchVal) || 
        user.email.toLowerCase().includes(searchVal)
    );

    // Update Badges & Counters
    const total = users.length;
    document.getElementById("navTotalUsers").innerText = total;
    document.getElementById("statTotalUsers").innerText = total;
    document.getElementById("badgeTotalUsers").innerText = `${total} total users`;
    document.getElementById("showingCount").innerText = `Showing ${filteredUsers.length} user(s)`;

    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <div class="empty-icon">☁</div>
                    <h3>No users found!</h3>
                    <p>Click "Add New User" or try a different search. ♡</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredUsers.map(user => {
        const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";
        return `
            <tr>
                <td><span class="id-badge">${user.id}</span></td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${initial}</div>
                        <div>
                            <div class="user-name">${escapeHtml(user.name)}</div>
                            <div class="user-role">Registered user</div>
                        </div>
                    </div>
                </td>
                <td class="email-cell">${escapeHtml(user.email)}</td>
                <td>
                    <span class="status-badge">
                        <span class="status-dot"></span> Active
                    </span>
                </td>
                <td>
                    <div class="actions">
                        <button class="btn btn-edit" onclick="showEditForm(${user.id})">✎ Edit</button>
                        <button class="btn btn-delete" onclick="deleteUser(${user.id})">♡ Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

// Navigation View Switcher
function showView(view) {
    const dashboardView = document.getElementById("view-dashboard");
    const formView = document.getElementById("view-form");

    if (view === "dashboard") {
        dashboardView.style.display = "block";
        formView.style.display = "none";
        renderUsers();
    } else if (view === "form") {
        dashboardView.style.display = "none";
        formView.style.display = "block";
    }
}

// Open Create Form
function showCreateForm() {
    document.getElementById("userId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("errorMessage").style.display = "none";

    document.getElementById("formTitle").innerHTML = 'Add a New <span>User!</span> ♡';
    document.getElementById("formSubtitle").innerText = 'Fill in the details below to create a new user record.';
    document.getElementById("formHeader").innerText = 'User Information ♡';
    document.getElementById("formHeaderSub").innerText = 'Please complete both fields.';
    document.getElementById("submitBtn").innerText = '＋ Save User';

    showView("form");
}

// Open Edit Form
function showEditForm(id) {
    const users = getUsers();
    const user = users.find(u => u.id === id);

    if (!user) return;

    document.getElementById("userId").value = user.id;
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("errorMessage").style.display = "none";

    document.getElementById("formTitle").innerHTML = 'Edit <span>User Details</span> ♡';
    document.getElementById("formSubtitle").innerText = 'Update the user\'s information below.';
    document.getElementById("formHeader").innerText = `Edit User #${user.id}`;
    document.getElementById("formHeaderSub").innerText = 'Review the details before saving.';
    document.getElementById("submitBtn").innerText = '✓ Save Changes';

    showView("form");
}

// Handle Add / Edit Submit
function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("userId").value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const errorMsg = document.getElementById("errorMessage");

    if (!name || !email) {
        errorMsg.innerText = "Please fill in all fields.";
        errorMsg.style.display = "block";
        return;
    }

    if (!validateEmail(email)) {
        errorMsg.innerText = "Please enter a valid email address.";
        errorMsg.style.display = "block";
        return;
    }

    let users = getUsers();

    if (id) {
        // Edit existing user
        users = users.map(u => u.id == id ? { ...u, name, email } : u);
    } else {
        // Add new user
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.unshift({ id: newId, name, email });
    }

    saveUsers(users);
    showView("dashboard");
}

// Delete User
function deleteUser(id) {
    if (confirm("Are you sure you want to delete this user?")) {
        let users = getUsers();
        users = users.filter(u => u.id !== id);
        saveUsers(users);
    }
}

// Email Validation Helper
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Utility to Escape HTML (Prevent XSS)
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Real-time Search Listener
document.getElementById("searchInput").addEventListener("input", renderUsers);

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    renderUsers();
});