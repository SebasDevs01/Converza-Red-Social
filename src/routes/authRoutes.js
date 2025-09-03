// authRoutes.js (ruta para registro y login)

import express from 'express';
import { hash, compare } from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware para parsear JSON (debe estar en tu index.js/app.js)
// app.use(express.json());

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
    }

    // Comprobar si usuario o email existen (ejemplo básico con tabla users en Supabase)
    const { data: existingUsers, error: errorCheck } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .limit(1);

    if (errorCheck) throw errorCheck;

    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: 'Usuario o email ya registrado' });
    }

    // Cifrar contraseña
    const passwordHash = await hash(password, 10);

    // Insertar nuevo usuario
    const { data, error } = await supabase.from('users').insert([
      {
        full_name: fullName,
        username,
        email,
        password_hash: passwordHash,
        bio: '',
        avatar_url: '',
        is_active: true,
      },
    ]);

    if (error) throw error;

    // Crear token (ejemplo básico, usar JWT o Supabase auth para sesión real)
    // Aquí como ejemplo el id del usuario
    const newUser = data[0];

    // Retornar éxito
    return res.status(201).json({ success: true, user: newUser, token: 'TOKEN_DE_EJEMPLO' });
  } catch (err) {
    console.error('Error en registro:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error interno' });
  }
});

// Exportar router
export default router;
