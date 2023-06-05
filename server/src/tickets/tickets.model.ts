import * as mongoose from 'mongoose';

export const TicketSchema = new mongoose.Schema(
  {
    passenger: {
      type: String,
      ref: 'User',
      required: true,
      unique: true,
    },
    car_id: {
      type: String,
      ref: 'Car',
      required: true,
    },
    boardingStop: {
      type: String,
      required: true,
    },
    destinationStop: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export interface Ticket extends mongoose.Document {
  passenger: string;
  car_id: string;
  boardingStop: string;
  destinationStop: string;
  price: number;
}
