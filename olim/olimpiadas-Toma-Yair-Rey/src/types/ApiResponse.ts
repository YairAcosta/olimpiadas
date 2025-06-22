export interface UserApiResponse {
    Id: number;
    Dni: string;
    Nombre: string;
    Email: string;
    Rol: string;
}

export interface RegisterPedidoPayload {
    articulosIds: number[]; // Array de IDs de los artículos
    adultos: number;       // Cantidad global de adultos
    menores: number;       // Cantidad global de menores
}