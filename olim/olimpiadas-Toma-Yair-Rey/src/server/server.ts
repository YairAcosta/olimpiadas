import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from 'cors'
import cookieParser from "cookie-parser";
import session from 'express-session';
import authR from './routes/user.routes'
import articuloR from "./routes/articulos.routes";
import paqueteR from "./routes/paquetes.routes";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Ruta /api funcionando!");
});


app.use(session({
  secret: 'tu_secreto_super_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true si usás https
    maxAge: 1000 * 60 * 60 * 24 // 1 día
  }
}));


app.use("/api/usuario", authR)
app.use("/api/articulo", articuloR)
app.use("/api/paquete", paqueteR)

export default app;

