import { Doctor } from "../../../domain/entities/doctor";
import { Document } from "mongoose";

interface IDoctorDoc extends Document {
  fullName: string;
  email: string;
  password: string;
  role: string;
  isApproved: boolean;
  isBlocked: boolean;
  _id: any;
  mobileNumber?: string;
  registerNumber?: string;
  isRejected?: boolean;
  profilePicture?: string;
  specialization?: string;
  qualification?: string;
  fee?: number;
  gender?: string;
  experience?: number;
  modesOfConsultation?: string[];
  gallery?: string[];
  documents?: string[];
  addressLine?: string;
  locationCoordinates?: {
    latitude?: number;
    longitude?: number;
  };
  locationName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const mapToDoctorEntity = (doc: IDoctorDoc): Doctor => {
  return new Doctor(
    doc.fullName,
    doc.email,
    doc.password,
    doc.role as "doctor",
    doc.isApproved,
    doc.isBlocked,
    doc._id.toString(),
    doc.profilePicture,
    doc.mobileNumber,
    doc.registerNumber,
    doc.isRejected,
    doc.specialization,
    doc.qualification,
    doc.fee,
    doc.gender,
    doc.experience,
    doc.modesOfConsultation as ("Video" | "Clinic")[],
    doc.gallery,
    doc.documents,
    doc.locationCoordinates &&
    doc.locationCoordinates.latitude !== undefined &&
    doc.locationCoordinates.longitude !== undefined
      ? {
          latitude: doc.locationCoordinates.latitude!,
          longitude: doc.locationCoordinates.longitude!,
        }
      : undefined,
    doc.locationName,
    doc.addressLine,
    doc.createdAt,
    doc.updatedAt
  );
};
