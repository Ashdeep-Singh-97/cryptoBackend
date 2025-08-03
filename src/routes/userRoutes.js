import express from "express";
import UserController from "../controller/UserController.js";
import {protect} from '../middlewares/auth.js';

const router = express.Router();
const Controller = new UserController();

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.post("/logout", Controller.logout);
router.get("/verify", protect, Controller.verify);

export default router;
