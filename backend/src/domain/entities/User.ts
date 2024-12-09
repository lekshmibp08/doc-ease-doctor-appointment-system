export type User = {
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    role: "user" | "doctor" | "admin";
    isBlocked: Boolean
  };
  