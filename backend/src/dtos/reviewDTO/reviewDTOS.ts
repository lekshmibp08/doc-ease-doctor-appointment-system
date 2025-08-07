export interface ReviewsByDoctorIdDTO {
  userId: {
    _id: string,
    fullName: string
  };
  rating: number;
  comment: string;
}

export interface ReviewsByAppointmentIdDTO {
  id: string
  rating: number
  comment: string
}