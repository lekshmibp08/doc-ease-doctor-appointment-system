import mongoose, { Model, Document } from "mongoose";
import { IAppointment } from "../../../domain/entities/Appoinment";

const appointmentSchema = new mongoose.Schema<IAppointment>({
    doctorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Doctor", 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    slotId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Slot", 
        required: true 
    },
    timeSlotId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    modeOfVisit: { 
        type: String, 
        enum: ["Video", "Clinic"], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    paymentId: { 
        type: String, 
        required: true 
    },
    isPaid: { 
        type: Boolean, 
        default: true 
    },
    isCancelled: { 
        type: Boolean, 
        default: false 
    },
    refundAmount: { 
        type: Number, 
        default: 0 
    },
    videoCallEnabled: { 
        type: Boolean, 
        default: false 
    },
    chatEnabled: { 
        type: Boolean, 
        default: false 
    },
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
    rating: { 
        type: Number, 
        min: 1, 
        max: 5 
    },
    reviewMessage: { 
        type: String 
    },
    videoCallId: { 
        type: String 
    },
    isReviewed: {
        type: Boolean,
        default: false
    }
},  
{ 
    timestamps: true 
});

const AppointmentModel: Model<IAppointment> = mongoose.model<IAppointment>("Appointment", appointmentSchema);
export default AppointmentModel;
