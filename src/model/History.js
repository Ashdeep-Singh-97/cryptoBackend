import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: String,
  image: String,
  current_price: Number,
  market_cap: Number,
  price_change_percentage_24h: Number,
  last_updated: Date,
}, { timestamps: true });

export default mongoose.model('History', historySchema);
