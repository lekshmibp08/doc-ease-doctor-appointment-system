
export class IAppointment {
  constructor(
    public _id: string | undefined,
    public doctorId: string,
    public userId: string,
    public date: Date,
    public slotId: string,
    public timeSlotId: string,
    public time: string,
    public modeOfVisit: "Video" | "Clinic",
    public amount: number,
    public paymentId: string,
    public isPaid?: boolean,
    public isCancelled?: boolean,
    public refundAmount?: number,
    public refundStatus?: "Pending" | "Processed" | "Failed",
    public refundTransactionId?: string | null,
    public videoCallEnabled?: boolean,
    public chatEnabled?: boolean,
    public isCompleted?: boolean,
    public rating?: number, 
    public reviewMessage?: string, 
    public videoCallId?: string, 
    public isReviewed?: boolean,
    public updatedAt?: Date,
    public createdAt?: Date,

  ) {}
}
