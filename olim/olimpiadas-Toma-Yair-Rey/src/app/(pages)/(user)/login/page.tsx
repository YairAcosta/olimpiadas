// src/app/(pages)/(user)/login/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserLogin, formLogin } from "@/src/server/schemas/user.schema";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/src/context/authContext";
import { loginRQ } from "@/src/app/api/auth";

function LoginEmpresa() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); // Login del contexto (para actualizar el estado del frontend)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formLogin>({
    resolver: zodResolver(UserLogin),
  });

  const onSubmit = async (data: formLogin) => {
    setLoading(true);
    setError("");

    try {
      // Usamos loginRQ: envía datos al backend y espera la cookie httpOnly en la respuesta.
      const response = await loginRQ(data);

      console.log("Login exitoso (response data):", response.data);

      // Si el login fue exitoso, el backend ya envió la cookie httpOnly.
      // Ahora, llamamos a login() del AuthContext. Esto disparará checkAuth()
      // para obtener los datos del usuario (vía la cookie recién establecida)
      // y actualizar el estado global del frontend.
      await login();

      alert("Inicio de sesión exitoso. ¡Bienvenido!");
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      console.error(
        "Error al iniciar sesión:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="bg-[#F2F2F2] min-h-screen flex flex-col items-center pt-10 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">¡Bienvenido!</h1>
          <p className="text-gray-600 text-sm mt-1">
            Ingresa tus datos para iniciar sesión
          </p>
        </div>

        <div className="flex w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center space-y-6">
            <h2 className=" text-3xl font-bold text-blue-800 text-center">
              Iniciar Sesión
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 text-sm p-2 rounded-md text-center">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700 mb-1 ms-1"
                >
                  Correo electrónico
                </label>
                <input
                  id="Email"
                  type="email"
                  {...register("Email")}
                  placeholder="empresa@correo.com"
                  className={`w-full border ${
                    errors.Email ? "border-red-500" : "border-gray-300"
                  } rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition`}
                />
                {errors.Email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.Email.message}
                  </p>
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
                disabled={loading}
                className="w-full cursor-pointer bg-blue-800 mt-5 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200 disabled:opacity-50"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <div className="text-center text-sm text-gray-500">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="text-blue-800 hover:underline font-medium"
                >
                  Regístrate aquí
                </Link>
              </div>
            </form>
          </div>

          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br rounded-r-3xl overflow-hidden shadow-lg items-center justify-center"></div>
        </div>
      </main>
    </>
  );
}

export default LoginEmpresa;
