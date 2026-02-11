import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true, index: true },
  isAvailable: { type: Boolean, default: true },
  moodTags: [{ type: String, enum: ['Tired', 'Celebrating', 'Healthy', 'Lazy', 'Hungover'] }],
  ingredients: [{
    name: { type: String },
    origin: { type: String }
  }]
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;