// models/Log.ts
import mongoose, { Schema, Document } from "mongoose";

interface ILog extends Document {
  userId?: string; // optional field
  method: string;
  url: string;
  headers: string;
  body: string;
  responseStatus: number;
  responseBody: string;
  responseTime: string;
  createdAt: Date;
  ipAddress: string;
  userAgent: string;
  queryParameters: string;
}

const LogSchema: Schema = new Schema({
  userId: { type: String, default: null }, 
  method: { type: String, required: true },
  url: { type: String, required: true },
  headers: { type: String },
  body: { type: String },
  responseStatus: { type: Number },
  responseBody: { type: String },
  responseTime: { type: String },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  queryParameters: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);
