export interface ReviewsByDoctorIdDTO {
  userId: {
    _id: string,
    fullName: string
  };
  rating: number;
  comment: string;
}