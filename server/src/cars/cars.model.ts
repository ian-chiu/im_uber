import * as mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  eta: { type: Date, default: null },
});

export const CarSchema = new mongoose.Schema({
  driver: { type: String, required: true },
  departure_time: { type: Date, required: true },
  stops: [stopSchema],
  license_plate: { type: String, required: true, unique: true },
  passengers: [String],
  gps_position: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  seats: { type: Number, required: true },
});

export interface Car extends mongoose.Document {
  driver: string;
  departure_time: Date;
  stops: { stopName: string; eta: Date | null }[];
  license_plate: string;
  passengers: string[];
  gps_position: { latitude: number; longitude: number };
  seats: number;
}