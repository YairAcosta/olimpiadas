import { ZodSchema } from 'zod';

export const validateSchema = (schema: ZodSchema) => {
    return (req: any, res: any, next: any) => {
        try {
            schema.parse(req.body);
            next(); // solo llama al siguiente middleware/controlador
        } catch (error: any) {
            res.status(400).json({
                message: "Error de validación",
                errors: error.errors.map((err: any) => err.message),
            });
            console.error("Errores de validación:", error.errors.map((err: any) => err.message));
        }
    };
};