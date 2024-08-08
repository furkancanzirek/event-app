import { Schema, model, models } from "mongoose";

export interface EventDocument {
  title: string;
  date: Date;
  location: string;
  description?: string;
  capacity: number;
  seatsOccupied: number;
  createdAt: Date;
  updatedAt: Date;
  imgUrl: string;
  price: number;
  _id: string;
}

const EventSchema = new Schema<EventDocument>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    description: {
      type: String,
      default: "",
    },
    capacity: {
      type: Number,
      required: [true, "Event capacity is required"],
    },
    seatsOccupied: {
      type: Number,
      required: [true, "Available seats are required"],
    },
    price: {
      type: Number,
      required: [true, "Event price is required"],
    },
    imgUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Event = models.Event || model<EventDocument>("Event", EventSchema);
export default Event;
