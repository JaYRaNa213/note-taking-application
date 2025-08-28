import { Schema, model, Types } from 'mongoose';

const noteSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: '' },
  body: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default model('Note', noteSchema);
