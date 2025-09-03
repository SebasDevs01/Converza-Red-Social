// Variables globales
let currentUser = null;
let socket = null;

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const token = localStorage.getItem('authToken');
    
    if (token) {
        validateToken(token);
    } else {
        showAuthModal();
    }
}

// Autenticación
function showAuthModal() {
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('content-area').innerHTML = getAuthHTML();
}

function getAuthHTML() {
    return `
        <div class="row justify-content-center min-vh-100 align-items-center">
            <div class="col-md-6 col-lg-4">
                <div class="card shadow-lg glass-effect">
                    <div class="card-body p-4">
                        <div class="text-center mb-4">
                            <h2 class="text-gradient mb-3">
                                <i class="fas fa-comments"></i> Converza
                            </h2>
                            <p class="text-muted">Conecta con amigos y comparte momentos</p>
                        </div>
                        
                        <ul class="nav nav-tabs nav-fill mb-3" id="authTabs">
                            <li class="nav-item">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#loginTab">
                                    Iniciar Sesión
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#registerTab">
                                    Registrarse
                                </button>
                            </li>
                        </ul>
                        
                        <div class="tab-content">
                            <div class="tab-pane fade show active" id="loginTab">
                                <form id="loginForm">
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" id="loginEmail" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Contraseña</label>
                                        <input type="password" class="form-control" id="loginPassword" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">
                                        <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
                                    </button>
                                </form>
                            </div>
                            
                            <div class="tab-pane fade" id="registerTab">
                                <form id="registerForm">
                                    <div class="mb-3">
                                        <label class="form-label">Nombre Completo</label>
                                        <input type="text" class="form-control" id="registerFullName" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Nombre de Usuario</label>
                                        <input type="text" class="form-control" id="registerUsername" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" id="registerEmail" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Contraseña</label>
                                        <input type="password" class="form-control" id="registerPassword" required>
                                    </div>
                                    <button type="submit" class="btn btn-success w-100">
                                        <i class="fas fa-user-plus me-2"></i>Registrarse
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Eventos de autenticación
document.addEventListener('submit', function(e) {
    if (e.target.id === 'loginForm') {
        e.preventDefault();
        handleLogin();
    } else if (e.target.id === 'registerForm') {
        e.preventDefault();
        handleRegister();
    } else if (e.target.id === 'newPostForm') {
        e.preventDefault();
        handleCreatePost();
    }
});

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('authToken', result.token);
            currentUser = result.user;
            initializeMainApp();
            showNotification('¡Bienvenido de vuelta!', 'success');
        } else {
            showNotification(result.message, 'danger');
        }
    } catch (error) {
        showNotification('Error de conexión', 'danger');
    }
}

async function handleRegister() {
    const fullName = document.getElementById('registerFullName').value;
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName, username, email, password })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('authToken', result.token);
            currentUser = result.user;
            initializeMainApp();
            showNotification('¡Cuenta creada exitosamente!', 'success');
        } else {
            showNotification(result.message, 'danger');
        }
    } catch (error) {
        showNotification('Error de conexión', 'danger');
    }
}

async function validateToken(token) {
    try {
        const response = await fetch('/api/users/profile/' + getUserIdFromToken(token), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const result = await response.json();
            currentUser = result.data;
            initializeMainApp();
        } else {
            localStorage.removeItem('authToken');
            showAuthModal();
        }
    } catch (error) {
        localStorage.removeItem('authToken');
        showAuthModal();
    }
}

function getUserIdFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    } catch (error) {
        return null;
    }
}

function initializeMainApp() {
    document.getElementById('navbar').style.display = 'block';
    updateNavbar();
    initializeSocket();
    showHome();
}

function updateNavbar() {
    document.getElementById('navbarAvatar').src = currentUser.avatar_url || 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=150';
    document.getElementById('navbarUsername').textContent = currentUser.username;
    
    // Actualizar sidebar
    document.getElementById('sidebarAvatar').src = currentUser.avatar_url || 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=150';
    document.getElementById('sidebarName').textContent = currentUser.full_name;
    document.getElementById('sidebarUsername').textContent = '@' + currentUser.username;
}

function initializeSocket() {
    socket = io();
    socket.emit('join_chat', currentUser.id);
    
    socket.on('receive_message', (message) => {
        // Manejar mensaje recibido
        showNotification(`Nuevo mensaje de ${message.senderName}`, 'info');
    });
}

// Navegación
function showHome() {
    document.getElementById('content-area').innerHTML = getHomeHTML();
    loadFeedPosts();
}

function showProfile() {
    document.getElementById('content-area').innerHTML = getProfileHTML();
    loadUserProfile(currentUser.id);
}

function showExplore() {
    document.getElementById('content-area').innerHTML = getExploreHTML();
}

function showChat() {
    document.getElementById('content-area').innerHTML = getChatHTML();
    loadConversations();
}

// Templates HTML
function getHomeHTML() {
    return `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3><i class="fas fa-home me-2"></i>Inicio</h3>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#postModal">
                    <i class="fas fa-plus me-2"></i>Nueva Publicación
                </button>
            </div>
            
            <div id="feedPosts">
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </div>
        </div>
        
        <button class="fab" data-bs-toggle="modal" data-bs-target="#postModal">
            <i class="fas fa-plus"></i>
        </button>
    `;
}

function getProfileHTML() {
    return `
        <div class="fade-in">
            <div class="profile-header">
                <div class="container text-center">
                    <img src="${currentUser.avatar_url}" alt="Avatar" class="profile-avatar mb-3">
                    <div class="profile-info">
                        <h2>${currentUser.full_name}</h2>
                        <p class="mb-2">@${currentUser.username}</p>
                        <p class="mb-3">${currentUser.bio || 'Sin biografía'}</p>
                        <div class="row">
                            <div class="col">
                                <strong id="profileFollowers">0</strong>
                                <div>Seguidores</div>
                            </div>
                            <div class="col">
                                <strong id="profileFollowing">0</strong>
                                <div>Siguiendo</div>
                            </div>
                            <div class="col">
                                <strong id="profilePosts">0</strong>
                                <div>Publicaciones</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="container mt-4">
                <div class="row">
                    <div class="col-lg-8 mx-auto">
                        <div class="d-flex justify-content-center mb-4">
                            <button class="btn btn-outline-primary me-2">
                                <i class="fas fa-edit me-2"></i>Editar Perfil
                            </button>
                            <button class="btn btn-outline-secondary">
                                <i class="fas fa-cog me-2"></i>Configuración
                            </button>
                        </div>
                        
                        <div id="userPosts">
                            <div class="loading">
                                <div class="spinner"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getExploreHTML() {
    return `
        <div class="fade-in">
            <h3><i class="fas fa-search me-2"></i>Explorar</h3>
            
            <div class="mb-4">
                <div class="input-group">
                    <input type="text" class="form-control" id="searchUsers" placeholder="Buscar usuarios...">
                    <button class="btn btn-outline-primary" onclick="searchUsers()">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            
            <div id="searchResults">
                <div class="text-center text-muted">
                    <i class="fas fa-search fa-3x mb-3"></i>
                    <p>Busca usuarios para conectar</p>
                </div>
            </div>
        </div>
    `;
}

function getChatHTML() {
    return `
        <div class="fade-in">
            <h3><i class="fas fa-envelope me-2"></i>Mensajes</h3>
            
            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">Conversaciones</h6>
                        </div>
                        <div class="card-body p-0" id="conversationsList">
                            <div class="loading">
                                <div class="spinner"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-body text-center text-muted">
                            <i class="fas fa-comment fa-3x mb-3"></i>
                            <p>Selecciona una conversación para comenzar</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Funciones de carga de datos
async function loadFeedPosts() {
    try {
        const response = await fetch('/api/posts/feed', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        const result = await response.json();

        if (result.success) {
            displayPosts(result.data);
        } else {
            document.getElementById('feedPosts').innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                    <p>Error al cargar publicaciones</p>
                </div>
            `;
        }
    } catch (error) {
        document.getElementById('feedPosts').innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-wifi fa-3x mb-3"></i>
                <p>Error de conexión</p>
            </div>
        `;
    }
}

function displayPosts(posts) {
    const container = document.getElementById('feedPosts');
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-newspaper fa-3x mb-3"></i>
                <p>No hay publicaciones aún. ¡Sé el primero en publicar!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post-card card mb-4 hover-scale">
            <div class="post-header">
                <img src="${post.user.avatar_url}" alt="Avatar" class="post-avatar">
                <div>
                    <h6 class="mb-0">${post.user.full_name}</h6>
                    <small class="text-muted">@${post.user.username} • ${formatDate(post.created_at)}</small>
                </div>
            </div>
            
            <div class="post-content">
                <p>${post.content}</p>
                ${post.image_url ? `<img src="${post.image_url}" alt="Post image" class="post-image">` : ''}
            </div>
            
            <div class="post-actions">
                <button class="post-action" onclick="likePost('${post.id}')">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes?.[0]?.count || 0}</span>
                </button>
                <button class="post-action" onclick="toggleComments('${post.id}')">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments?.[0]?.count || 0}</span>
                </button>
                <button class="post-action">
                    <i class="fas fa-share"></i>
                    Compartir
                </button>
            </div>
        </div>
    `).join('');
}

async function handleCreatePost() {
    const content = document.getElementById('postContent').value;
    const imageUrl = document.getElementById('postImage').value;

    if (!content && !imageUrl) {
        showNotification('Debes agregar contenido o una imagen', 'warning');
        return;
    }

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ content, imageUrl })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('newPostForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('postModal')).hide();
            showNotification('¡Publicación creada!', 'success');
            loadFeedPosts();
        } else {
            showNotification(result.message, 'danger');
        }
    } catch (error) {
        showNotification('Error de conexión', 'danger');
    }
}

async function searchUsers() {
    const query = document.getElementById('searchUsers').value;
    
    if (query.length < 2) {
        showNotification('Ingresa al menos 2 caracteres', 'warning');
        return;
    }

    try {
        const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        const result = await response.json();

        if (result.success) {
            displaySearchResults(result.data);
        } else {
            showNotification(result.message, 'danger');
        }
    } catch (error) {
        showNotification('Error de conexión', 'danger');
    }
}

function displaySearchResults(users) {
    const container = document.getElementById('searchResults');
    
    if (users.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-user-times fa-3x mb-3"></i>
                <p>No se encontraron usuarios</p>
            </div>
        `;
        return;
    }

    container.innerHTML = users.map(user => `
        <div class="user-search-item">
            <img src="${user.avatar_url}" alt="Avatar" class="user-search-avatar">
            <div class="flex-grow-1">
                <h6 class="mb-0">${user.full_name}</h6>
                <small class="text-muted">@${user.username}</small>
            </div>
            <button class="btn btn-outline-primary btn-sm" onclick="followUser('${user.id}')">
                <i class="fas fa-user-plus me-1"></i>Seguir
            </button>
        </div>
    `).join('');
}

async function loadUserProfile(userId) {
    // Implementar carga de perfil de usuario
    console.log('Cargando perfil de usuario:', userId);
}

async function loadConversations() {
    // Implementar carga de conversaciones
    console.log('Cargando conversaciones');
}

async function likePost(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        const result = await response.json();

        if (result.success) {
            showNotification('¡Me gusta!', 'success');
            loadFeedPosts(); // Recargar posts
        } else {
            showNotification(result.message, 'danger');
        }
    } catch (error) {
        showNotification('Error de conexión', 'danger');
    }
}

async function followUser(userId) {
    try {
        const response = await fetch(`/api/follow/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        const result = await response.json();

        if (result.success) {
            showNotification('¡Ahora sigues a este usuario!', 'success');
        } else {
            showNotification(result.message, 'danger');
        }
    } catch (error) {
        showNotification('Error de conexión', 'danger');
    }
}

function logout() {
    localStorage.removeItem('authToken');
    currentUser = null;
    if (socket) socket.disconnect();
    showAuthModal();
    showNotification('Sesión cerrada', 'info');
}

// Utilidades
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show notification`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function toggleComments(postId) {
    // Implementar toggle de comentarios
    console.log('Toggle comentarios para post:', postId);
}

// Eventos de teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.id === 'searchUsers') {
        searchUsers();
    }
});