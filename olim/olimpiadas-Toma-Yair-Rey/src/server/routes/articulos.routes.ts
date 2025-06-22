import { Router } from "express";
import articulosController from "../controllers/articulos.controller";

const articuloR = Router();

articuloR.get("/verArticulos/:tipo", articulosController.verArticulosPorTipo);

export default articuloR;
