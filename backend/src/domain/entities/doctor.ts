export class Doctor {
  constructor(
    public fullName: string,
    public email: string,
    public password: string,
    public role: "doctor",
    public isApproved: boolean,
    public isBlocked: boolean,
    public _id?: string, 
    public profilePicture?: string,
    public mobileNumber?: string,
    public registerNumber?: string,
    public isRejected?: boolean,
    public specialization?: string,
    public qualification?: string,
    public fee?: number,
    public gender?: string,
    public experience?: number,
    public modesOfConsultation?: ("Video" | "Clinic")[],
    public gallery?: string[],
    public documents?: string[],
    public locationCoordinates?: { latitude: number; longitude: number } | undefined,
    public locationName?: string,
    public addressLine?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
