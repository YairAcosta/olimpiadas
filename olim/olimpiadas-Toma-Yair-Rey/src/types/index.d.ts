import { Request } from "express";

// Interfaz para el Payload del JWT
export interface UserPayload {
    id: number;
    email: string;
    role: string;
    iat?: number; // Campo "issued at" (fecha de emisión), añadido por JWT
    exp?: number; // Campo "expiration" (fecha de expiración), añadido por JWT
    // Puedes añadir otras propiedades que incluyas en el token (ej. isAdmin: boolean)
}

// Extensión de la Interfaz Request de Express
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

//Interfaz para la tabla de Usuario
export interface UsuarioRow {
    Dni: string;
    Nombre: string;
    Contraseña: string;
    Email: string;
    Rol: string;
}