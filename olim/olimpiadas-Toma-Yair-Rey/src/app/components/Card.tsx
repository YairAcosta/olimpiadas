// src/app/components/Card.tsx
import { motion } from "framer-motion";
import { Articulo } from "@/src/types/Articulos";
import { useCart } from "@/src/context/cartContext";
import toast from "react-hot-toast";

type CardProps = {
  articulo: Articulo;
};

export default function Card({ articulo }: CardProps) {
  const { Titulo, Descripcion, Precio_uni, Tipo, UnidadMedida } = articulo;
  const { addToCart } = useCart();

  const getPrecioUnidadTexto = (unidad: Articulo["UnidadMedida"]) => {
    switch (unidad) {
      case "Noche":
        return " / Noche";
      case "Dia":
        return " / Día";
      case "Hora":
        return " / Hora";
      case "Persona":
        return " / Persona";
      case "Fijo":
      default:
        return "";
    }
  };

  const handleAddToCart = () => {
    addToCart(articulo);
    // Cambia el alert() por un toast
    toast.success(`${Titulo} agregado al carrito!`, {
      position: "bottom-right",
      duration: 2000,
      style: {
        background: "#802afc",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#802afc",
      },
    });
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-54 h-64 bg-gradient-to-br from-[#f0faff] to-[#bad5ee] rounded-2xl overflow-hidden transition-all duration-500 shadow-md border border-white/20 hover:shadow-xl hover:border-violet-400 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none" />

      <div className="absolute -inset-2 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.3)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full p-5 gap-3">
        <div className="w-full h-24 rounded-xl bg-gradient-to-br from-violet-300 to-violet-500 relative overflow-hidden">
          <span className="absolute top-2 left-2 bg-white/70 text-violet-800 text-xs font-semibold px-2 py-0.5 rounded-full z-20 capitalize">
            {Tipo}
          </span>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0%,transparent_30%),repeating-linear-gradient(45deg,rgba(139,92,246,0.1)_0px,rgba(139,92,246,0.1)_2px,transparent_2px,transparent_4px)] opacity-50" />
        </div>

        <div className="flex flex-col gap-1 flex-grow">
          <p className="text-slate-800 font-bold text-sm group-hover:text-violet-600 transition-all">
            {Titulo}
          </p>
          <p className="text-slate-800 text-xs opacity-70 group-hover:opacity-100 group-hover:translate-x-[2px] transition-all line-clamp-2">
            {Descripcion}
          </p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-slate-800 font-bold text-sm group-hover:text-violet-600 transition-all">
            ARS{" "}
            {Precio_uni.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            {getPrecioUnidadTexto(UnidadMedida)}{" "}
          </p>

          <button
            onClick={handleAddToCart}
            className="w-7 h-7 cursor-pointer bg-violet-600 rounded-full flex items-center justify-center text-white hover:shadow-[0_0_0_4px_rgba(124,58,237,0.2)] transition-all"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="2"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <path d="M4 12H20M12 4V20" />
            </motion.svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
