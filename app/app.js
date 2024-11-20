// Firebase configuration
const firebaseConfig = {
    // Your Firebase configuration here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// DOM Elements
const profilePicture = document.getElementById('profile-picture');
const username = document.getElementById('username');
const bio = document.getElementById('bio');
const profileStatus = document.getElementById('profile-status');
const editProfileBtn = document.getElementById('edit-profile');
const themeToggle = document.getElementById('theme-toggle');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings');
const userUid = document.getElementById('user-uid');
const recentProjects = document.getElementById('recent-projects');

// Firebase Auth
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadUserData(user.uid);
    } else {
        // Redirect to login page
        window.location.href = 'login.html';
    }
});

// Load user data from Firebase
function loadUserData(uid) {
    const userRef = firebase.database().ref('users/' + uid);
    userRef.on('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            profilePicture.src = userData.profile_picture || 'https://via.placeholder.com/100';
            username.textContent = userData.username || 'Usuário';
            bio.textContent = userData.bio || 'Sem biografia';
            profileStatus.textContent = userData.public ? 'Perfil Público' : 'Perfil Privado';
            userUid.textContent = uid;
            loadRecentProjects(userData.projects);
            createStatsChart(userData.stats);
        }
    });
}

// Load recent projects
function loadRecentProjects(projects) {
    if (projects && Object.keys(projects).length > 0) {
        recentProjects.innerHTML = '';
        Object.entries(projects).slice(0, 5).forEach(([id, project]) => {
            const li = document.createElement('li');
            li.textContent = project.name;
            recentProjects.appendChild(li);
        });
    } else {
        recentProjects.innerHTML = '<li>Nenhum projeto recente</li>';
    }
}

// Create stats chart
function createStatsChart(stats) {
    if (stats) {
        const ctx = document.getElementById('stats-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(stats),
                datasets: [{
                    label: 'Atividade',
                    data: Object.values(stats),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Edit profile
editProfileBtn.addEventListener('click', () => {
    window.location.href = 'editprofile.html';
});

// Settings modal
document.getElementById('theme-toggle').addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    settingsModal.classList.add('flex');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
    settingsModal.classList.remove('flex');
});

// Settings actions
document.getElementById('change-theme').addEventListener('click', () => {
    // Implement theme change logic
});

document.getElementById('manage-notifications').addEventListener('click', () => {
    // Implement notifications management logic
});

document.getElementById('connect-socials').addEventListener('click', () => {
    // Implement social media connection logic
});

document.getElementById('change-password').addEventListener('click', () => {
    // Implement password change logic
});

document.getElementById('enable-2fa').addEventListener('click', () => {
    // Implement 2FA activation logic
});

document.getElementById('delete-account').addEventListener('click', () => {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Esta ação não pode ser desfeita!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir conta'
    }).then((result) => {
        if (result.isConfirmed) {
            // Implement account deletion logic
        }
    });
});

document.getElementById('export-data').addEventListener('click', () => {
    // Implement data export logic
});

// Mobile menu toggle
document.getElementById('menu-toggle').addEventListener('click', () => {
    const sidebar = document.querySelector('aside');
    sidebar.classList.toggle('hidden');
});
