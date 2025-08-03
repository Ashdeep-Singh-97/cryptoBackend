import express from 'express';
import Controller from '../controller/Controller.js';
import userRoutes from './userRoutes.js'

const router = express.Router();
const cryptoController = new Controller();

router.get('/coins', cryptoController.getTopCoins);
router.post('/history', cryptoController.storeHistory);
router.get('/history/:coinId', cryptoController.getCoinHistory);

router.use("/user", userRoutes);


export default router;
