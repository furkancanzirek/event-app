import { Schema, Document } from "mongoose";

export interface Payment extends Document {
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  amount: number;
  cardLast4Digits?: string;
  paymentStatus: "success" | "pending" | "failed";
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
