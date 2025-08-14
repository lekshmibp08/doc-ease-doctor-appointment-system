export interface GoogleOAuthLoginDTO {
  fullName: string;
  email: string;
  profilePicture: string;
  role: "doctor" | "user" | "admin";
}

