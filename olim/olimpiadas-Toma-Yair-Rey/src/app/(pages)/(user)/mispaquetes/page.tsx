"use client";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const Paquete = () => {
  const destinos = [
    {
      id: 1,
      titulo: "Argentina ➜ Brasil, Rio de Janeiro",
      auto: "Auto ➜ Auto Mediano",
      hotel: "Hotel ➜ Miramar Hotel by Windsor",
      excursion: "Excursiones ➜ Cristo redentor",
      dias: "7 DÍAS",
      precio: "1.500.000",
      imagen: "/rio.jpg",
    },
    {
      id: 2,
      titulo: "Argentina ➜ Brasil, Rio de Janeiro",
      auto: "Auto ➜ Auto Medanos",
      hotel: "Hotel ➜ Atlântico Prime",
      excursion: "Excursiones ➜ Cristo redentor",
      dias: "7 DÍAS",
      precio: "1.500.000",
      imagen: "/rio.jpg",
    },
    {
      id: 3,
      titulo: "Argentina ➜ Brasil, Rio de Janeiro",
      auto: "Auto ➜ Auto Económico",
      hotel: "Hotel ➜ Rio Othon Palace",
      excursion: "Excursiones ➜ Cristo redentor",
      dias: "7 DÍAS",
      precio: "1.500.000",
      imagen: "/rio.jpg",
    },
  ];

  return (
    <>
      <section className="bg-white px-4 sm:px-6 py-6 text-center font-sans">
        <h2 className="text-base sm:text-lg text-gray-800 font-normal mb-6">
          Tu próximo destino, en paquete y al mejor precio
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {destinos.map((destino) => (
            <motion.div
              key={destino.id}
              className="min-w-[250px] max-w-[250px] bg-white border border-blue-600 rounded-md shadow-sm overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img
                src={destino.imagen}
                alt="Destino"
                className="w-full h-[140px] object-cover"
              />
              <div className="p-3 text-left text-sm text-gray-700 leading-tight space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-yellow-500">★ ★ ★ ★ ★</div>
                  <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                    {destino.dias}
                  </span>
                </div>
                <p>
                  <b>{destino.titulo}</b>
                </p>
                <p>{destino.auto}</p>
                <p>{destino.hotel}</p>
                <p>{destino.excursion}</p>
                <p>
                  <b>Precio Total = {destino.precio}</b>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Paquete;
