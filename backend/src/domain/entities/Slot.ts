export class TimeSlot {
  constructor(
    public time: string,
    public status: "Not Booked" | "Booked",
    public isAvailable: boolean,
    public _id?: string
  ) {}
}
export class Slot {
  constructor(
    public _id: string | undefined,
    public doctorId: string,
    public date: Date,
    public timeSlots: TimeSlot[]
  ) {}
}
