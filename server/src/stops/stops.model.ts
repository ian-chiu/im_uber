import * as mongoose from 'mongoose';

export const StopSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (v: any) {
          return Array.isArray(v) && v.length == 2;
        },
        message: (props) => `${props.value} must be an array of two numbers`,
      },
    },
  },
});

StopSchema.index({ location: '2dsphere' });

// Stop interface
export interface Stop extends mongoose.Document {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}
