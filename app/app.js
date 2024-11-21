// Importar módulos Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js';
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4FmKe7ei-mcKH4flhnXq9TtwmxfUeq5k",
  authDomain: "b-code-881b2.firebaseapp.com",
  databaseURL: "https://b-code-881b2-default-rtdb.firebaseio.com",
  projectId: "b-code-881b2",
  storageBucket: "b-code-881b2.firebasestorage.app",
  messagingSenderId: "199379425544",
  appId: "1:199379425544:web:2e9ac129c58ca9ee37b4bd",
  measurementId: "G-9FEKL6WX7C"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

// Estado global do usuário
let currentUser = null;

// Função para renderizar o perfil do usuário
function renderProfile(userData) {
    const profileDisplay = document.getElementById('profile-display');
    profileDisplay.innerHTML = `
        <div class="relative">
            <img src="${userData.banner || 'https://via.placeholder.com/1000x200'}" alt="Banner" class="banner mb-4">
            <img src="${userData.profilePic || 'https://via.placeholder.com/150'}" alt="Profile Picture" class="profile-pic absolute bottom-0 left-4 border-4 border-white dark:border-gray-800">
        </div>
        <div class="mt-4">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${userData.fullName}</h2>
            <p class="text-gray-600 dark:text-gray-400">@${userData.username}</p>
        </div>
        <p class="mt-4 text-gray-700 dark:text-gray-300">${userData.bio}</p>
        <div class="mt-4 flex items-center text-gray-600 dark:text-gray-400">
            <i class="fas fa-map-marker-alt mr-2"></i>
            <span>${userData.location}</span>
        </div>
        <div class="mt-2 flex items-center text-gray-600 dark:text-gray-400">
            <i class="fas fa-envelope mr-2"></i>
            <span>${userData.email}</span>
        </div>
        <div class="mt-2 flex items-center text-gray-600 dark:text-gray-400">
            <i class="fas fa-globe mr-2"></i>
            <a href="${userData.website}" target="_blank" class="text-blue-500 hover:underline">${userData.website}</a>
        </div>
        <div class="mt-6 stats-grid">
            <div class="stat-item">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">${userData.followers}</h3>
                <p class="text-gray-600 dark:text-gray-400">Seguidores</p>
            </div>
            <div class="stat-item">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">${userData.following}</h3>
                <p class="text-gray-600 dark:text-gray-400">Seguindo</p>
            </div>
            <div class="stat-item">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">${userData.projects.length}</h3>
                <p class="text-gray-600 dark:text-gray-400">Projetos</p>
            </div>
        </div>
        <div class="mt-6">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Projetos em Destaque</h3>
            <ul class="list-disc list-inside">
                ${userData.projects.map(project => `
                    <li class="text-gray-700 dark:text-gray-300">
                        ${project.name} - <span class="text-yellow-500">${project.stars} <i class="fas fa-star"></i></span>
                        <span class="text-gray-500">${project.forks} <i class="fas fa-code-branch"></i></span>
                    </li>
                `).join('')}
            </ul>
        </div>
        <div class="mt-6">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Atividades Recentes</h3>
            <div class="chart-container">
                <canvas id="activityChart"></canvas>
            </div>
        </div>
        <button id="edit-profile" class="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Editar Perfil
        </button>
    `;

    // Criar gráfico de atividades
    const ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Contribuições',
                data: [12, 19, 3, 5, 2, 3],
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

    // Adicionar evento ao botão de edição
    document.getElementById('edit-profile').addEventListener('click', () => {
        document.getElementById('profile-display').classList.add('hidden');
        renderEditForm(userData);
    });
}

// Função para renderizar o formulário de edição
function renderEditForm(userData) {
    const profileEdit = document.getElementById('profile-edit');
    profileEdit.classList.remove('hidden');
    profileEdit.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Editar Perfil</h2>
        <form id="edit-form" class="space-y-4">
            <div>
                <label for="fullName" class="block text-gray-700 dark:text-gray-300">Nome Completo</label>
                <input type="text" id="fullName" name="fullName" value="${userData.fullName}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div>
                <label for="username" class="block text-gray-700 dark:text-gray-300">Nome de Usuário</label>
                <input type="text" id="username" name="username" value="${userData.username}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div>
                <label for="bio" class="block text-gray-700 dark:text-gray-300">Biografia</label>
                <textarea id="bio" name="bio" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">${userData.bio}</textarea>
            </div>
            <div>
                <label for="location" class="block text-gray-700 dark:text-gray-300">Localização</label>
                <input type="text" id="location" name="location" value="${userData.location}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div>
                <label for="email" class="block text-gray-700 dark:text-gray-300">E-mail</label>
                <input type="email" id="email" name="email" value="${userData.email}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div>
                <label for="website" class="block text-gray-700 dark:text-gray-300">Website</label>
                <input type="url" id="website" name="website" value="${userData.website}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div>
                <label for="profilePic" class="block text-gray-700 dark:text-gray-300">Foto de Perfil</label>
                <input type="file" id="profilePic" name="profilePic" accept="image/*" class="mt-1 block w-full text-gray-700 dark:text-gray-300">
            </div>
            <div>
                <label for="banner" class="block text-gray-700 dark:text-gray-300">Banner</label>
                <input type="file" id="banner" name="banner" accept="image/*" class="mt-1 block w-full text-gray-700 dark:text-gray-300">
            </div>
            <div>
                <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Salvar Alterações</button>
                <button type="button" id="cancel-edit" class="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancelar</button>
            </div>
        </form>
    `;

    // Adicionar evento ao formulário de edição
    document.getElementById('edit-form').addEventListener('submit', handleEditSubmit);

    // Adicionar evento ao botão de cancelar
    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.getElementById('profile-edit').classList.add('hidden');
        document.getElementById('profile-display').classList.remove('hidden');
    });
}

// Função para lidar com o envio do formulário de edição
async function handleEditSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Atualizar dados do usuário
    const updatedUserData = {
        fullName: formData.get('fullName'),
        username: formData.get('username'),
        bio: formData.get('bio'),
        location: formData.get('location'),
        email: formData.get('email'),
        website: formData.get('website'),
    };

    // Processar upload de imagens
    const profilePicFile = form.profilePic.files[0];
    const bannerFile = form.banner.files[0];

    if (profilePicFile) {
        const profilePicBase64 = await getBase64(profilePicFile);
        updatedUserData.profilePic = profilePicBase64;
    }

    if (bannerFile) {
        const bannerBase64 = await getBase64(bannerFile);
        updatedUserData.banner = bannerBase64;
    }

    // Atualizar dados no Firebase
    await updateUserData(updatedUserData);

    // Recarregar perfil
    loadUserProfile();
}

// Função para converter arquivo em Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Função para atualizar dados do usuário no Firebase
async function updateUserData(userData) {
    if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}`);
        await set(userRef, userData);
    }
}

// Função para carregar o perfil do usuário
function loadUserProfile() {
    if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                renderProfile(userData);
            } else {
                // Se não houver dados, criar um perfil padrão
                const defaultUserData = {
                    fullName: 'Novo Usuário',
                    username: 'novo_usuario',
                    bio: 'Olá, sou novo por aqui!',
                    location: 'Brasil',
                    email: currentUser.email,
                    website: '',
                    followers: 0,
                    following: 0,
                    projects: [],
                };
                updateUserData(defaultUserData);
                renderProfile(defaultUserData);
            }
        });
    }
}

// Observar mudanças no estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadUserProfile();
    } else {
        // Usuário não está logado, redirecionar para página de login
        window.location.href = '/login.html';
    }
});

// Adicionar botão de alternância de tema
const themeToggle = document.createElement('button');
themeToggle.classList.add('theme-toggle');
themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
document.body.appendChild(themeToggle);

// Função para alternar o tema
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Adicionar evento ao botão de alternância de tema
themeToggle.addEventListener('click', toggleTheme);

// Verificar preferência de tema salva
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

