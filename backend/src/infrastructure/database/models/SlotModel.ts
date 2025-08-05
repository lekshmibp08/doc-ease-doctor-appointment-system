import mongoose, { Schema, Document, Types } from "mongoose";


export interface ISlotDocument extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  doctorId: Types.ObjectId;
  date: Date;
  timeSlots: {
    time: string;
    status: string;
    isAvailable: boolean;
    _id: Types.ObjectId
  }[];
}

const SlotSchema: Schema = new Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  timeSlots: [
    {
      time: { type: String, required: true },
      status: { type: String, enum: ["Not Booked", "Booked"], default: "Not Booked" },
      isAvailable: { type: Boolean, default: false },
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    },
  ],
});

export default mongoose.model<ISlotDocument>("Slot", SlotSchema);


