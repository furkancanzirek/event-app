import { Document, Schema } from "mongoose";

export interface Reservation extends Document {
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
