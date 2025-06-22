export type Articulo = {
    Id: number;
    Titulo: string;
    Descripcion: string;
    Precio_uni: number;
    Tipo: "Hotel" | "Vuelo" | "Excursion" | "Auto";
    UnidadMedida: "Noche" | "Fijo" | "Dia" | "Hora" | "Persona";
}