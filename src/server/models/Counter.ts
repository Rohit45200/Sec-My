import mongoose, { Document, Schema } from 'mongoose';

export interface ICounter {
  _id: string; // e.g., 'TS26-CSE', 'TS26-IT', etc.
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const CounterModel = mongoose.models.Counter || mongoose.model<ICounter>('Counter', counterSchema);
