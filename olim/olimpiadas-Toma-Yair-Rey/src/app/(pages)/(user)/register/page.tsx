"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { formRegister, UserRegister } from "@/src/server/schemas/user.schema";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import { registerRQ } from "@/src/app/api/auth";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); // Login del contexto (para actualizar el estado del frontend)
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formRegister>({ resolver: zodResolver(UserRegister) });

  const handleFormSubmit = async (data: formRegister) => {
    try {
      // Usamos registerRQ: envía datos al backend y espera la cookie httpOnly en la respuesta.
      const response = await registerRQ(data);

      console.log("Usuario registrado (response data):", response.data);

      // Si el registro fue exitoso, el backend  envió la cookie httpOnly.
      // Ahora, llamamos a login() del AuthContext. Esto disparará checkAuth()
      // para obtener los datos del usuario (vía la cookie recién establecida)
      // y actualizar el estado global del frontend.
      await login();

      alert("Registro exitoso. ¡Bienvenido!");
      router.push("/"); // Redirige a la página principal
    } catch (error: any) {
      console.error(
        "Error al registrar:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Ocurrió un error al registrar");
    }
  };

  const inputClass =
    "mt-1 block w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none";

  return (
    <main className="bg-[#F2F2F2] min-h-screen flex flex-col items-center pt-10 pb-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Registrarse</h1>
        <p className="text-gray-600 text-sm mt-1">
          Ingresa tus datos para crear una cuenta
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 px-8 py-10">
        <form className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre y Apellido
            </label>
            <input
              {...register("Nombre")}
              placeholder="Juan Pérez"
              className={`${inputClass} ${
                errors.Nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Nombre && (
              <p className="text-sm text-red-600">{errors.Nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DNI
            </label>
            <input
              {...register("Dni")}
              placeholder="47898456"
              inputMode="numeric"
              className={`${inputClass} ${
                errors.Dni ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Dni && (
              <p className="text-sm text-red-600">{errors.Dni.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("Email")}
              placeholder="ejemplo@gmail.com"
              type="email"
              className={`${inputClass} ${
                errors.Email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.Email && (
              <p className="text-sm text-red-600">{errors.Email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="Contraseña"
              className="block text-sm font-medium text-gray-700 mb-1 ms-1"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="Contraseña"
                type={showPassword ? "text" : "password"}
                {...register("Contraseña")}
                placeholder="••••••••"
                className={`w-full border ${
                  errors.Contraseña ? "border-red-500" : "border-gray-300"
                } rounded-xl px-4 py-2.5 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer top-1/2 right-4 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.Contraseña && (
              <p className="text-sm text-red-600 mt-1">
                {errors.Contraseña.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
          >
            Registrarme
          </button>
        </form>
      </div>
    </main>
  );
}
