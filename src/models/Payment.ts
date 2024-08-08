import { Schema, model, models } from "mongoose";
import { SchemaDefinitionProperty } from "mongoose";

export interface PaymentDocument {
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

const PaymentSchema = new Schema<PaymentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    cardLast4Digits: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment =
  models.Payment || model<PaymentDocument>("Payment", PaymentSchema);
export default Payment;
