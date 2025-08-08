import mongoose, { Schema, Document } from 'mongoose';

export interface IErrorLog extends Document {
  message: string;
  stack?: string;
  statusCode: number;
  path: string;
  method: string;
  timestamp: Date;
}

const errorLogSchema = new Schema<IErrorLog>({
  message: { type: String, required: true },
  stack: { type: String },
  statusCode: { type: Number, default: 500 },
  path: { type: String },
  method: { type: String },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7,
  },
});

export const ErrorLogModel = mongoose.model<IErrorLog>('ErrorLog', errorLogSchema);
