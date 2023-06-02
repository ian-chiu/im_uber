import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['passenger', 'driver'],
      default: 'passenger', // default role is 'passenger'
    },
  },
  { timestamps: true },
);

// User interface
export interface User extends mongoose.Document {
  _id: string;
  username: string;
  password: string;
  role: string;
}
