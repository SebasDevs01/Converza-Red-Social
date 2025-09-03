# Converza - Red Social MVP

Red social desarrollada con arquitectura MVP (Modelo Vista Presentador) utilizando Node.js, Express, Supabase y Bootstrap 5.

## Características Principales

- ✅ Sistema de autenticación completo (registro/login)
- ✅ Gestión de perfiles de usuario
- ✅ Publicaciones con texto e imágenes
- ✅ Sistema de likes y comentarios
- ✅ Seguimiento entre usuarios
- ✅ Chat en tiempo real
- ✅ Búsqueda de usuarios
- ✅ Sistema de notificaciones
- ✅ Diseño responsive con Bootstrap 5

## Arquitectura MVP

### Modelo (Model)
- `UserModel.js` - Gestión de usuarios
- `PostModel.js` - Gestión de publicaciones
- `FollowModel.js` - Gestión de seguimientos
- `ChatModel.js` - Gestión de mensajes

### Vista (View)
- HTML templates con Bootstrap 5
- CSS personalizado con animaciones
- JavaScript para interactividad

### Presentador (Presenter)
- `AuthPresenter.js` - Lógica de autenticación
- `UserPresenter.js` - Lógica de usuarios
- `PostPresenter.js` - Lógica de publicaciones
- `FollowPresenter.js` - Lógica de seguimientos
- `ChatPresenter.js` - Lógica de chat

## Configuración

1. **Configurar Supabase:**
   - Haz clic en "Connect to Supabase" en la esquina superior derecha
   - Las migraciones se aplicarán automáticamente

2. **Variables de entorno:**
   - Copia `.env.example` a `.env`
   - Configura las variables de Supabase

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Ejecutar la aplicación:**
   ```bash
   npm run dev
   ```

## Estructura de Base de Datos

### Tablas Principales

- **users**: Información de usuarios
- **posts**: Publicaciones de usuarios
- **follows**: Relaciones de seguimiento
- **post_likes**: Likes de publicaciones
- **post_comments**: Comentarios de publicaciones
- **messages**: Mensajes de chat
- **notifications**: Notificaciones del sistema

### Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Políticas de acceso granular
- Autenticación JWT
- Validación de datos en el servidor

## Funcionalidades por Implementar (Futuras Versiones)

- [ ] Historias temporales
- [ ] Videollamadas
- [ ] Grupos de chat
- [ ] Sistema de reportes
- [ ] Analytics del usuario
- [ ] API REST completa
- [ ] Aplicación móvil
- [ ] Push notifications

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: Supabase (PostgreSQL)
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript
- **Tiempo Real**: Socket.IO
- **Autenticación**: JWT
- **Arquitectura**: MVP (Modelo Vista Presentador)