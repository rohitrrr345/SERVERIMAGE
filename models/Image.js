import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },  // Adding required to ensure the title is always provided
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Ensure user is always required
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  views: { type: Number, default: 0 },
});

// Ensure mongoose creates the model if it doesn't already exist
const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

export default Image;
