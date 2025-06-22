// server/utils/jwt.ts

import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config';

// Define el payload que ESPERAS recibir para generar el token
interface GenerateTokenPayload {
    id: number;
    email: string;
    role: string; // Recibimos el rol de la BD ('user' o 'admin')
}

export function generateToken(payload: GenerateTokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
        // Construimos el payload JWT
        const jwtPayload = {
            id: payload.id,
            email: payload.email,
            isAdmin: payload.role === 'admin' // Si el rol es 'admin', isAdmin es true, de lo contrario, false
        };

        jwt.sign(
            jwtPayload, // Usamos el payload que acabamos de construir
            TOKEN_SECRET,
            { expiresIn: '4h' }, // El token expirará en 1 hora
            (err, token) => {
                if (err) {
                    console.error("Error al generar token:", err);
                    reject(err);
                } else if (token) {
                    resolve(token);
                } else {
                    reject(new Error('Failed to generate token. Token was undefined.'));
                }
            }
        );
    });
}