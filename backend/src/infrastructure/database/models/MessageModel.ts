import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "../../../domain/entities/Message";

export interface IMessageDocument extends Omit<IMessage, "_id">, Document { }


const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: false },
  imageUrl: { type: String, required: false }, 
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.model<IMessageDocument>("Message", MessageSchema);
