import cron from 'node-cron';
import CryptoController from '../controller/Controller.js';

const cryptoController = new CryptoController();

export const scheduleCryptoJob = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Cron Running');
    cryptoController.storeHistoryCron();
  });
};
