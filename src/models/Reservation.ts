import { Schema, model, models } from "mongoose";
import { UserDocument } from "./User"; 
import { EventDocument } from "./Event";

export interface ReservationDocument {
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<ReservationDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User reference is required"],
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, "Event reference is required"],
  },
}, {
  timestamps: true,
});


const Reservation = models.Reservation || model<ReservationDocument>('Reservation', ReservationSchema);
export default Reservation;
