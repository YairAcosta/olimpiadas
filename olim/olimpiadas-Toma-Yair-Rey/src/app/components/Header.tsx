"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  User,
  Menu,
  X,
  Plane,
  Gift,
  Car,
  Hotel,
  MountainSnow,
  ShoppingCart,
} from "lucide-react";

const Header = () => {
  const pathname = usePathname(); // Correctamente obtenido el pathname
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: "/", label: "Vuelos", icon: Plane },
    { path: "/mispaquetes", label: "Paquetes", icon: Gift },
    { path: "/articulos/autos", label: "Autos", icon: Car },
    { path: "/articulos/hoteles", label: "Hoteles", icon: Hotel },
    { path: "/articulos/excursiones", label: "Excursiones", icon: MountainSnow },
    { path: "/carrito", label: "Carrito", icon: ShoppingCart }
  ];

  return (
    <header className="bg-[#183292] text-white shadow-md px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo a la izquierda */}
        <div className="w-1/3 flex justify-start">
          <h1 className="text-2xl font-semibold">VuelaYa</h1>
        </div>

        {/* Navegación (oculta en mobile) */}
        <div className="hidden sm:flex w-1/3 justify-center">
          <nav className="flex gap-6">
            {navItems
              .filter((item) => !["/mispaquetes", "/carrito"].includes(item.path))
              .map(({ path, label, icon: Icon }) => {
                const isActive = pathname === path; // Usando 'pathname' para la navegación de escritorio
                return (
                  <Link
                    key={path}
                    href={path}
                    className={`flex flex-col items-center text-sm hover:text-cyan-300 ${
                      isActive ? "border-b-2 border-cyan-400" : ""
                    } pb-0.5`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* Íconos a la derecha + menú hamburguesa */}
        <div className="w-1/3 flex justify-end items-center gap-2">
          {/* Botón menú hamburguesa visible solo en mobile */}
          <button
            className="sm:hidden p-2 rounded-md hover:bg-white/20 transition"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Íconos visibles en desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Paquetes */}
            <Link
              href="/mispaquetes"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <Gift className="w-5 h-5" />
            </Link>

            {/* Carrito */}
            <Link
              href="/carrito"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {/* Usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
              >
                <div className="w-6 h-6">
                  <User className="w-full h-full" />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg py-2 z-50">
                  <Link
                    href="/login"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menú mobile desplegable */}
      {showMenu && (
        <nav className="sm:hidden mt-4 px-2 flex flex-col gap-4">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = pathname === path; // <-- ¡Este es el cambio clave!
            return (
              <Link
                key={path}
                href={path}
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 text-sm"
              >
                <Icon className="w-5 h-5" />
                <span
                  className={isActive ? "underline underline-offset-4" : ""}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          <div className="flex flex-col gap-2 border-t border-white/30 pt-3">
            <Link href="/login" className="text-sm hover:underline">
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-sm hover:underline">
              Registrarse
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
