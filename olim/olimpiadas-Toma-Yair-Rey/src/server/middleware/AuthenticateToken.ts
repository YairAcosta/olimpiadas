// server/middlewares/authenticate.middleware.ts

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { TOKEN_SECRET } from "../config";

export const AuthenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        res.status(401).json({ message: "No autorizado. No se proporcionó token de sesión." });
        return;
    }

    if (!TOKEN_SECRET) {
        console.error('Error: TOKEN_SECRET no está definido en la configuración.');
        res.status(500).json({ message: 'Error interno del servidor.' });
        return
    }

    jwt.verify(token, TOKEN_SECRET, (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
            console.error("Error al verificar token:", err);
            res.status(403).json({ message: "Token no válido o expirado." });
            return;
        }
        // Asignamos el payload decodificado a req.user.
        // TypeScript ahora sabe que req.user puede existir y tiene el tipo UserPayload
        req.user = decoded;
        next();
    });
};