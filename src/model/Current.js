import mongoose from 'mongoose';

const currentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  symbol: String,
  image: String,
  current_price: Number,
  market_cap: Number,
  price_change_percentage_24h: Number,
  last_updated: Date,
}, { timestamps: true });

export default mongoose.model('Current', currentSchema);
