// server/controllers/auth.controller.ts

import { Request, Response } from "express";
import { db } from '../db';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/jwt"; // Tu función para generar el token

interface UsuarioRow extends RowDataPacket {
    Id: number;
    Dni: string;
    Nombre: string;
    Contraseña: string;
    Email: string;
    Rol: string;
}

export default class AuthController {
    // Función para generar código de paquete (se mantiene)
    private static generarCodigoPaquete(): string {
        const letras = Math.random().toString(36).substring(2, 5).toUpperCase();
        const numeros = Math.floor(100 + Math.random() * 900);
        return `PKG-${letras}${numeros}`;
    }

    // --- Controlador de Registro ---
    static async register(req: Request, res: Response): Promise<void> {
        const { Dni, Nombre, Contraseña, Email } = req.body;

        try {
            const [existingUsers] = await db.query<UsuarioRow[]>(
                "SELECT Id FROM usuario WHERE Dni = ? OR Email = ?",
                [Dni, Email]
            );
            if (existingUsers.length > 0) {
                res.status(409).json({ message: "El DNI o Email ya está registrado." });
                return;
            }

            const hashedPassword = await bcrypt.hash(Contraseña, 10);
            const defaultRole = 'user';

            const [result] = await db.query(
                "INSERT INTO usuario (Dni, Nombre, Contraseña, Email, Rol) VALUES (?, ?, ?, ?, ?)",
                [Dni, Nombre, hashedPassword, Email, defaultRole]
            );

            const insertResult = result as ResultSetHeader;
            const idUsuario = insertResult.insertId;

            await db.query(`
                INSERT INTO paquete (id_user, id_estado, codigo)
                VALUES (?, (SELECT Id FROM estado_paq WHERE Nombre = 'armando'), ?)
                `, [idUsuario, AuthController.generarCodigoPaquete()]);

            const token = await generateToken({ id: idUsuario, email: Email, role: defaultRole });

            res.cookie("jwt", token, { // Nombre de la cookie: 'jwt'
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', // 'Lax' o 'Strict' es mejor que 'None' para seguridad CSRF
                maxAge: 3600000, // 1 hora
                path: '/',
            });

            // RESPUESTA JSON SIN EL TOKEN EN EL CUERPO
            res.status(201).json({
                message: 'Usuario registrado correctamente',
                user: {
                    Id: idUsuario,
                    Dni,
                    Nombre,
                    Email,
                    Rol: defaultRole,
                },
            });

        } catch (error: any) {
            console.error("Error al registrar usuario:", error);
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(409).json({ message: "El DNI o Email ya está registrado.", error: error.message });
                return
            }
            res.status(500).json({ message: "Error interno del servidor al registrar usuario", error: error.message });
        }
    }

    // --- Controlador de Login ---
    static async login(req: Request, res: Response): Promise<void> {
        const { Email, Contraseña } = req.body;

        try {
            const [rows] = await db.query<UsuarioRow[]>(
                "SELECT Id, Dni, Nombre, Contraseña, Email, Rol FROM usuario WHERE Email = ?",
                [Email]
            );

            const user = rows[0];
            if (!user) {
                res.status(401).json({ message: "Credenciales inválidas (email no encontrado)." });
                return;
            }

            const isMatch = await bcrypt.compare(Contraseña, user.Contraseña);
            if (!isMatch) {
                res.status(401).json({ message: "Credenciales inválidas (contraseña incorrecta)." });
                return;
            }

            const token = await generateToken({
                id: user.Id,
                email: user.Email,
                role: user.Rol,
            });

            res.cookie("jwt", token, { // Nombre de la cookie: 'jwt'
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', // 'Lax' o 'Strict' es mejor que 'None'
                maxAge: 3600000, // 1 hora
                path: '/',
            });

            // RESPUESTA JSON SIN EL TOKEN EN EL CUERPO
            res.status(200).json({
                message: "Login exitoso",
                user: {
                    Id: user.Id,
                    Dni: user.Dni,
                    Nombre: user.Nombre,
                    Email: user.Email,
                    Rol: user.Rol,
                },
            });
        } catch (error: any) {
            console.error("Error al logear usuario:", error.message);
            console.error(error.stack);
            res.status(500).json({ message: "Error interno del servidor al logear usuario", error: error.message });
        }
    }

    // --- Controlador de Logout ---
    static async logout(req: Request, res: Response): Promise<void> {
        res.cookie("jwt", "none", { // Sobrescribe la cookie 'jwt' con un valor 'none'
            expires: new Date(Date.now() + 10 * 1000), // Expira en 10 segundos para borrarla rápidamente
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        res.status(200).json({ message: "Logout exitoso" });
    }

    // --- Controlador de Perfil ---
    // req: Request ahora incluye req.user debido a la declaración global
    static async profile(req: Request, res: Response): Promise<void> {
        // req.user estará disponible gracias al middleware y la declaración global
        if (!req.user?.id) {
            // Esto no debería suceder si el middleware está correctamente implementado
            res.status(401).json({ message: "Usuario no autenticado o ID de usuario no disponible." });
            return;
        }

        const userId = req.user.id;

        try {
            const [rows] = await db.query<UsuarioRow[]>(
                `SELECT Id, Dni, Nombre, Email, Rol FROM usuario WHERE Id = ?`,
                [userId]
            );

            const UserFound = rows[0];
            if (!UserFound) {
                res.status(404).json({ message: "Usuario no encontrado." });
                return;
            }

            res.status(200).json({
                message: "Perfil de usuario obtenido correctamente",
                user: {
                    Id: UserFound.Id,
                    Dni: UserFound.Dni,
                    Nombre: UserFound.Nombre,
                    Email: UserFound.Email,
                    Rol: UserFound.Rol,
                }
            });
        } catch (error) {
            console.error("Error al obtener perfil de usuario:", error);
            res.status(500).json({ message: "Error interno del servidor." });
        }
    }
}