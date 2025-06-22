import app from "./server";
import { db } from "./db";

async function startServer() {
    try {
        // Testea la conexión
        await db.getConnection();
        console.log("Conectado a la base de datos");

        app.listen(8000, () => {
            console.log(" Server: http://localhost:8000");
        });
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1);
    }
}

startServer();
