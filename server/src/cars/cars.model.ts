import * as mongoose from 'mongoose';

export const CarSchema = new mongoose.Schema(
  {
    driver: {
      type: String,
      required: true,
    },
    departure_time: {
      type: Date,
      required: true,
    },
    stops: [
      {
        type: String,
        required: true,
      },
    ],
    license_plate: {
      type: String,
      required: true,
      unique: true,
    },
    passengers: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

export interface Car extends mongoose.Document {
  driver: string;
  departure_time: Date;
  stops: string[];
  license_plate: string;
  passengers: string[];
}
