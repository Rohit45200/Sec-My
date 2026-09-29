import mongoose, { Document, Schema } from 'mongoose';

export interface IParticipant extends Document {
  participantId: string;
  name: string;
  registerNumber: string;
  department: string;
  departmentCode: string;
  year: string;
  college: string;
  place: string;
  email: string;
  phone: string;
  event: string;
  participantType: string;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<IParticipant>(
  {
    participantId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    registerNumber: {
      type: String,
      required: [true, 'Register number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    departmentCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
      default: 'Sengunthar Engineering College',
    },
    place: {
      type: String,
      required: [true, 'Place / City is required'],
      trim: true,
      default: 'Tiruchengode, Namakkal',
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\s-]{10,15}$/, 'Please enter a valid 10-digit phone number'],
    },
    event: {
      type: String,
      required: true,
      default: 'TechSym SaRaYu-26',
      trim: true,
    },
    participantType: {
      type: String,
      required: [true, 'Participant type is required'],
      trim: true,
      default: 'Internal Participant (Sengunthar Student)',
    },
    photo: {
      type: String,
      required: [true, 'Student photo is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Search index on name, registerNumber, participantId, and place
participantSchema.index({ name: 'text', registerNumber: 'text', participantId: 'text', place: 'text' });

export const ParticipantModel =
  mongoose.models.Participant || mongoose.model<IParticipant>('Participant', participantSchema);
