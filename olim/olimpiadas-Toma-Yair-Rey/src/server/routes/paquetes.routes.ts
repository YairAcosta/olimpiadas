import { Router } from "express";
import PaqueteController from "../controllers/paquete.controller";
import { AuthenticateToken } from "../middleware/AuthenticateToken";

const paqueteR = Router();

paqueteR.post("/registrarPedido", AuthenticateToken, PaqueteController.registrarPedido);


export default paqueteR;
