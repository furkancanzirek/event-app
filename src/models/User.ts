import { Schema, model, models } from "mongoose";
import { ReservationDocument } from "./Reservation";

export interface UserDocument {
  email: string;
  password?: string;
  name: string;
  phone: string;
  image?: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  reservations?: ReservationDocument[]; 
}

const UserSchema = new Schema<UserDocument>({
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      select: false,
    },
    name: {
      type: String,
      required: [true, "Fullname is required"],
      minLength: [3, "fullname must be at least 3 characters"],
      maxLength: [25, "fullname must be at most 25 characters"],
    },
    phone: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: "",
    },
    reservations: [{
      type: Schema.Types.ObjectId,
      ref: 'Reservation',
    }]
  },
  {
    timestamps: true,
  }
);

const User = models.User || model<UserDocument>('User', UserSchema);
export default User;
