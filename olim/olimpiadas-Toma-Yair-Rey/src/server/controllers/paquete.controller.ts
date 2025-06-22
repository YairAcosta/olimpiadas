// server/controllers/PaqueteController.ts

import { Request, Response } from "express";
import { db } from "../db";

export default class PaqueteController {
    static async registrarPedido(req: Request, res: Response) {
        const userId = req.user?.id;
        const { articulosIds, adultos, menores } = req.body;

        if (!Array.isArray(articulosIds) || articulosIds.length === 0) {
            res.status(400).json({ message: "No se enviaron IDs de artículos." });
            return;
        }

        // Validar adultos y menores globales
        if (typeof adultos !== 'number' || adultos < 0 || typeof menores !== 'number' || menores < 0) {
            res.status(400).json({ message: "Las cantidades de adultos y menores deben ser números no negativos." });
            return;
        }
        if (adultos === 0 && menores === 0) {
            res.status(400).json({ message: "Debe haber al menos un adulto o un menor en el pedido." });
            return;
        }


        const connection = await db.getConnection();
        await connection.beginTransaction(); // Comienzo

        try {
            const [[estadoArmando]]: any = await connection.query(
                "SELECT Id, Nombre FROM estado_paq WHERE Nombre = 'armando'"
            );
            const [[estadoPendiente]]: any = await connection.query(
                "SELECT Id, Nombre FROM estado_paq WHERE Nombre = 'pendiente'"
            );

            if (!estadoArmando || !estadoPendiente) {
                throw new Error("Estados 'armando' o 'pendiente' no encontrados.");
            }

            const [[paqueteActual]]: any = await connection.query(
                "SELECT Id, codigo FROM paquete WHERE id_user = ? AND id_estado = ?",
                [userId, estadoArmando.Id]
            );

            if (!paqueteActual) {
                throw new Error("No se encontró paquete 'armando' para el usuario.");
            }

            const idPaqueteActual = paqueteActual.Id;

            // CAMBIO CRUCIAL: Ahora iteramos sobre los IDs y usamos los adultos/menores GLOBALES
            for (const id_art of articulosIds) {
                if (typeof id_art !== "number") {
                    throw new Error(`El id_art '${id_art}' debe ser un número.`);
                }

                await connection.query(
                    "INSERT INTO part_paq (id_paquete, id_art, adultos, menores) VALUES (?, ?, ?, ?)",
                    [idPaqueteActual, id_art, adultos, menores] // Usamos las variables globales de adultos y menores
                );
            }

            await connection.query(
                "UPDATE paquete SET id_estado = ? WHERE Id = ?",
                [estadoPendiente.Id, idPaqueteActual]
            );

            const codigoNuevo =
                "PKG-" +
                Math.random()
                    .toString(36)
                    .substring(2, 5)
                    .toUpperCase() +
                Math.floor(100 + Math.random() * 900);

            const [insertPaq]: any = await connection.query(
                "INSERT INTO paquete (id_user, id_estado, codigo) VALUES (?, ?, ?)",
                [userId, estadoArmando.Id, codigoNuevo]
            );

            const nuevoPaqueteId = insertPaq.insertId;

            await connection.commit();

            res.status(201).json({
                message: "Pedido registrado correctamente.",
                paqueteProcesado: {
                    id: idPaqueteActual,
                    codigo: paqueteActual.codigo,
                    articulosIds,
                    adultos,
                    menores
                },
                nuevoPaquete: {
                    id: nuevoPaqueteId,
                    codigo: codigoNuevo,
                    estado: estadoArmando.Nombre,
                },
            });
        } catch (error: any) {
            await connection.rollback();
            console.error("Error en registrarPedido:", error);
            res.status(500).json({ error: error.message || "Error interno al registrar pedido.", });
        } finally {
            connection.release();
        }
    }

}
