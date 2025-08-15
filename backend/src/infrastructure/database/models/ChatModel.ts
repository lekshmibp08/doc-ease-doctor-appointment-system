import mongoose, { Document } from "mongoose";
import { IChat } from "../../../domain/entities/chat";

export interface IChatDocument extends Omit<Document, '_id'>, IChat {}

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IChatDocument>("Chat", ChatSchema);
