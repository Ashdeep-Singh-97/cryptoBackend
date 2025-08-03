import axios from 'axios';
import Current from '../model/Current.js';
import History from '../model/History.js';

class CryptoController {
  constructor() {
    this.getTopCoins = this.getTopCoins.bind(this);
    this.storeHistory = this.storeHistory.bind(this);
    this.getCoinHistory = this.getCoinHistory.bind(this);
  }
  fetchTopCoinsFromAPI = async () => {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
      },
    });
    return data;
  }

  storeHistoryHelper = async (data) => {
    await History.insertMany(data);
  }

  async getTopCoins(req, res) {
    try {
      const data = await this.fetchTopCoinsFromAPI();

      await Current.deleteMany({});
      await Current.insertMany(data);

      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching coins:', error.message);
      res.status(500).json({ message: 'Failed to fetch crypto data' });
    }
  }

  async storeHistory(req, res) {
    try {
      const data = req.body;

      await this.storeHistoryHelper(data);

      res.status(200).json({ message: "Saved Successfully" });
    } catch (error) {
      console.error('Error inserting in History:', error.message);
      res.status(500).json({ message: 'Failed to store crypto data' });
    }
  }

  async getCoinHistory(req, res) {
    try {
      const { coinId } = req.params;

      const history = await History.find({ symbol: coinId.toLowerCase() })
        .sort({ createdAt: 1 });

      res.json(history);
    } catch (error) {
      console.error('Error getting a coin History:', error.message);
      res.status(500).json({ message: 'Failed to get a coin history' });
    }
  }

  async storeHistoryCron() {
    try {
      const data = await this.fetchTopCoinsFromAPI();

      await this.storeHistoryHelper(data);
      console.log('Cron data stored successfully');
    } catch (error) {
      console.error('Cron job failed:', error.message);
    }
  }
}

export default CryptoController;
