import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },  
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  views: { type: Number, default: 0 },
});

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

export default Image;
