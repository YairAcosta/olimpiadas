// server/routes/auth.routes.ts

import { Router } from 'express';
import AuthController from '../controllers/user.controller';
// Importa el middleware de autenticación desde su ubicación correcta
import { AuthenticateToken } from '../middleware/AuthenticateToken';

const authR = Router();

// Rutas de autenticación
authR.post("/register", AuthController.register);
authR.post("/login", AuthController.login);
authR.post("/logout", AuthController.logout);

// Ruta de perfil protegida:
authR.get('/profile', AuthenticateToken, AuthController.profile);

export default authR;