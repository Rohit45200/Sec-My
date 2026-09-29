export interface Participant {
  _id?: string;
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
  photo: string; // Base64 data URL
  createdAt?: string;
  updatedAt?: string;
}

export interface ParticipantFormData {
  name: string;
  registerNumber: string;
  department: string;
  year: string;
  college: string;
  place: string;
  email: string;
  phone: string;
  event: string;
  participantType: string;
  photo: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  total?: number;
}
