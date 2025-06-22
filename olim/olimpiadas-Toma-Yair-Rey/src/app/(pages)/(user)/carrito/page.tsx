// src/app/carrito/page.tsx
"use client";
import { motion } from "framer-motion";
import { useCart } from "@/src/context/cartContext";
import { Articulo } from "@/src/types/Articulos";
import { registerPedidoRQ } from "@/src/app/api/auth";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useAuth } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
const Carrito = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [adultosPedido, setAdultosPedido] = useState<number>(1);
  const [menoresPedido, setMenoresPedido] = useState<number>(0);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

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

  const total = cartItems.reduce(
    (acc: number, item) =>
      acc +
      (typeof item.Precio_uni === "string"
        ? parseFloat(item.Precio_uni)
        : item.Precio_uni),
    0
  );

  const handleRegistrarPedido = async () => {
    // Verifica si la autenticación está todavía en curso
    if (loading) {
      //
      alert("Verificando sesión. Por favor, espera un momento.");
      return;
    }

    if (!isAuthenticated) {
      alert("Debes iniciar sesión para registrar un pedido.");
      router.push("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert(
        "Tu carrito está vacío. Agrega artículos antes de registrar un pedido."
      );
      return;
    }

    const articulosIds = cartItems.map((item) => item.Id);

    if (adultosPedido < 0 || menoresPedido < 0) {
      alert("El número de adultos y menores no puede ser negativo.");
      return;
    }
    if (adultosPedido === 0 && menoresPedido === 0) {
      alert("Debe haber al menos un adulto o un menor en el pedido.");
      return;
    }

    console.log("Registrando pedido con IDs de artículos:", articulosIds);
    console.log("Adultos del pedido:", adultosPedido);
    console.log("Menores del pedido:", menoresPedido);

    try {
      const response = await registerPedidoRQ({
        articulosIds: articulosIds,
        adultos: adultosPedido,
        menores: menoresPedido,
      });
      console.log("Pedido registrado con éxito:", response.data);
      alert("Pedido registrado con éxito. Tu carrito se ha vaciado.");
      clearCart();
      setAdultosPedido(1);
      setMenoresPedido(0);
    } catch (error) {
      console.error("Error al registrar pedido:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const errorData = axiosError.response.data as {
            message?: string;
            error?: string;
          };
          alert(
            `Error al registrar pedido: ${
              errorData.message ||
              errorData.error ||
              "Mensaje de error desconocido del servidor."
            }`
          );
        } else if (axiosError.request) {
          alert("Error de red: No se recibió respuesta del servidor.");
        } else {
          alert(`Error: ${axiosError.message}`);
        }
      } else {
        alert("Ocurrió un error inesperado al registrar el pedido.");
      }
    }
  };

  return (
    <>
      <section className="bg-white px-4 sm:px-6 py-6 text-center font-sans max-w-7xl mx-auto">
        <h2 className="text-lg sm:text-xl text-gray-800 font-medium mb-4">
          Artículos en tu carrito
        </h2>

        <div className="flex justify-end mb-4 gap-2">
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="w-full cursor-pointer sm:w-auto text-sm px-4 py-2 border border-red-300 rounded-full text-red-700 hover:bg-red-600 hover:text-white transition"
            >
              Vaciar Carrito
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-center mb-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item.Id}
                  className="relative w-full max-w-xs h-64 bg-gradient-to-br from-[#f0faff] to-[#bad5ee] rounded-2xl overflow-hidden transition-all duration-400 shadow-md border border-white/20 hover:shadow-xl hover:border-violet-400 group"
                  whileHover={{ y: -10, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none" />
                  <div className="absolute -inset-2 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.3)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full p-5 gap-3">
                    <div className="w-full h-24 rounded-xl bg-gradient-to-br from-violet-300 to-violet-500 relative overflow-hidden">
                      <span className="absolute top-2 left-2 bg-white/70 text-violet-800 text-xs font-semibold px-2 py-0.5 rounded-full z-20 capitalize">
                        {item.Tipo}
                      </span>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0%,transparent_30%),repeating-linear-gradient(45deg,rgba(139,92,246,0.1)_0px,rgba(139,92,246,0.1)_2px,transparent_2px,transparent_4px)] opacity-50" />
                    </div>

                    <div className="flex flex-col gap-1 flex-grow">
                      <p className="text-slate-800 font-bold text-sm group-hover:text-violet-600 transition-all">
                        {item.Titulo}
                      </p>
                      <p className="text-slate-800 text-xs opacity-70 group-hover:opacity-100 group-hover:translate-x-[2px] transition-all line-clamp-2">
                        {item.Descripcion}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-slate-800 font-bold text-sm group-hover:text-violet-600 transition-all">
                        ARS{" "}
                        {item.Precio_uni.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        {getPrecioUnidadTexto(item.UnidadMedida)}{" "}
                      </p>

                      <button
                        onClick={() => removeFromCart(item.Id)}
                        className="w-7 h-7 cursor-pointer bg-red-400 rounded-full flex items-center justify-center text-white hover:shadow-[0_0_0_4px_rgba(239,68,68,0.2)] transition-all"
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
                          <path d="M6 12L18 12" />
                        </motion.svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* NUEVO: Inputs globales para adultos y menores del pedido */}
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="adultos"
                  className="font-semibold text-gray-700"
                >
                  Adultos que viajan:
                </label>
                <input
                  type="number"
                  id="adultos"
                  min="1"
                  value={adultosPedido}
                  onChange={(e) =>
                    setAdultosPedido(
                      Math.max(1, parseInt(e.target.value, 10) || 1)
                    )
                  }
                  className="w-20 text-center border rounded-md px-2 py-1 text-gray-800"
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="menores"
                  className="font-semibold text-gray-700"
                >
                  Menores que viajan:
                </label>
                <input
                  type="number"
                  id="menores"
                  min="0"
                  value={menoresPedido}
                  onChange={(e) =>
                    setMenoresPedido(
                      Math.max(0, parseInt(e.target.value, 10) || 0)
                    )
                  }
                  className="w-20 text-center border rounded-md px-2 py-1 text-gray-800"
                />
              </div>
            </div>
          </>
        )}

        {cartItems.length > 0 && (
          <div className="mt-8 flex flex-col items-end gap-4">
            <button
              onClick={handleRegistrarPedido}
              className="w-full cursor-pointer sm:w-auto text-sm px-6 py-2 font-bold border border-green-800 text-green-800 rounded-full hover:bg-green-800 hover:text-white transition shadow-md"
            >
              Registrar Pedido
            </button>
            <div className="text-right font-bold text-lg text-gray-800">
              Total del Carrito: ARS{" "}
              {total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-4 sm:hidden">
          <button className="rounded-full border border-gray-300 p-2 hover:bg-gray-100"></button>
        </div>
      </section>
    </>
  );
};

export default Carrito;
