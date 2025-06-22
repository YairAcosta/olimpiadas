import { Request, Response } from "express";
import { db } from '../db';
import { RowDataPacket } from "mysql2";

export default class articulosController {
    static async verArticulosPorTipo(req: Request, res: Response): Promise<void> {
        const { tipo } = req.params;

        // Validar el tipo para asegurar que solo se pasen valores esperados
        const tiposPermitidos = ['Hotel', 'Vuelo', 'Excursion', 'Auto'];
        if (!tiposPermitidos.includes(tipo)) {
            res.status(400).json({ message: "Tipo de artículo inválido. Tipos permitidos: Hotel, Vuelo, Excursion, Auto." });
            return;
        }

        try {
            const [rows] = await db.query<RowDataPacket[]>(
                'SELECT Id, Titulo, Descripcion, Precio_uni, Tipo, UnidadMedida FROM Articulos WHERE Tipo = ?',
                [tipo]
            );

            if (rows.length === 0) {
                res.status(404).json({ message: `No se encontraron artículos del tipo "${tipo}".` });
                return;
            }

            res.status(200).json(rows);

        } catch (error) {
            console.error(`Error al obtener artículos por tipo (${tipo}):`, error);
            res.status(500).json({ message: "Error interno del servidor al obtener los artículos por tipo." });
        }
    }
}
