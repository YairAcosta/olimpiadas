import z from 'zod'

export const UserRegister = z.object({
    Dni: z.string({
        required_error: "El DNI es requerido",
        invalid_type_error: "El DNI es inválido",
    }).regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos numéricos"),

    Nombre: z.string({
        required_error: "El Nombre es requerido",
        invalid_type_error: "El Nombre no puede ser numérico",
    }).min(1, "El Nombre no puede estar vacío"),

    Email: z.string({
        required_error: "El Email es requerido",
        invalid_type_error: "El Email no es válido",
    }).email("Formato de Email inválido"),

    Contraseña: z.string({
        required_error: "La Contraseña es requerida",
        invalid_type_error: "La Contraseña no es válida",
    }).min(6, "La Contraseña debe tener al menos 6 caracteres"),
})

export const UserLogin = z.object({
    Email: z.string({
        required_error: "El Email es requerido",
        invalid_type_error: "El Email no es válido",
    }).email("Formato de Email inválido"),

    Contraseña: z.string({
        required_error: "La Contraseña es requerida",
        invalid_type_error: "La Contraseña no es válida",
    }).min(6, "La Contraseña debe tener al menos 6 caracteres"),
})

export type formRegister = z.infer<typeof UserRegister>
export type formLogin = z.infer<typeof UserLogin>
