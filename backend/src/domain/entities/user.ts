
export class IUser {
  constructor(
    public fullName: string,
    public email: string,
    public mobileNumber: string,
    public password: string,
    public role: "user" | "doctor" | "admin",
    public isBlocked: boolean,
    public _id?: string,
    public profilePicture?: string,
    public gender?: string,      
    public age?: string,
    public addressline?: string,
    public city?: string,
    public state?: string,
    public pincode?: string,
  ){}
}