import mongoose from 'mongoose';
import { ParticipantModel, IParticipant } from './models/Participant.ts';
import { CounterModel } from './models/Counter.ts';

let isMongoConnected = false;

// Resilient in-memory fallback store
interface MemoryParticipant {
  _id: string;
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

const memoryParticipants: Map<string, MemoryParticipant> = new Map();
const memoryCounters: Map<string, number> = new Map();

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.log('ℹ️ No MONGODB_URI provided in environment. Running in resilient in-memory storage mode.');
    return false;
  }

  try {
    console.log('🔄 Attempting MongoDB Atlas connection...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully.');
    return true;
  } catch (error: any) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}. Running with resilient local memory storage.`);
    isMongoConnected = false;
    return false;
  }
}

export function isConnected(): boolean {
  return isMongoConnected && mongoose.connection.readyState === 1;
}

/**
 * Atomic sequence generator for participant ID:
 * Format: TS26-<DEPARTMENT>-<SEQ>
 * E.g., TS26-CSE-001
 */
export async function getNextParticipantId(departmentCode: string): Promise<string> {
  const counterKey = `TS26-${departmentCode.toUpperCase()}`;

  if (isConnected()) {
    try {
      const counter = await CounterModel.findOneAndUpdate(
        { _id: counterKey },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const seqStr = String(counter.seq).padStart(3, '0');
      return `${counterKey}-${seqStr}`;
    } catch (err) {
      console.warn('MongoDB counter increment error, using fallback counter:', err);
    }
  }

  // Memory counter increment (atomic in single-process event loop)
  const currentSeq = memoryCounters.get(counterKey) || 0;
  const nextSeq = currentSeq + 1;
  memoryCounters.set(counterKey, nextSeq);
  const seqStr = String(nextSeq).padStart(3, '0');
  return `${counterKey}-${seqStr}`;
}

/**
 * Check if register number is already registered
 */
export async function checkDuplicateRegisterNumber(registerNumber: string): Promise<any | null> {
  const regNoUpper = registerNumber.trim().toUpperCase();

  if (isConnected()) {
    try {
      const existing = await ParticipantModel.findOne({ registerNumber: regNoUpper });
      if (existing) return existing;
    } catch (err) {
      console.warn('Error querying MongoDB for duplicate, checking memory:', err);
    }
  }

  for (const p of memoryParticipants.values()) {
    if (p.registerNumber.toUpperCase() === regNoUpper) {
      return p;
    }
  }

  return null;
}

/**
 * Update an existing participant by register number
 */
export async function updateParticipantByRegNo(
  registerNumber: string,
  updates: Partial<IParticipant>
): Promise<any | null> {
  const regNoUpper = registerNumber.trim().toUpperCase();

  if (isConnected()) {
    try {
      const updated = await ParticipantModel.findOneAndUpdate(
        { registerNumber: regNoUpper },
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      if (updated) return updated.toObject();
    } catch (err) {
      console.warn('Error updating in MongoDB:', err);
    }
  }

  for (const p of memoryParticipants.values()) {
    if (p.registerNumber.toUpperCase() === regNoUpper) {
      if (updates.name) p.name = updates.name;
      if (updates.department) p.department = updates.department;
      if (updates.departmentCode) p.departmentCode = updates.departmentCode;
      if (updates.year) p.year = updates.year;
      if (updates.college) p.college = updates.college;
      if (updates.place) p.place = updates.place;
      if (updates.email) p.email = updates.email;
      if (updates.phone) p.phone = updates.phone;
      if (updates.photo) p.photo = updates.photo;
      if (updates.participantType) p.participantType = updates.participantType;
      p.updatedAt = new Date();
      return p;
    }
  }

  return null;
}

/**
 * Save participant
 */
export async function saveParticipant(data: Partial<IParticipant>): Promise<any> {
  if (isConnected()) {
    try {
      const doc = new ParticipantModel(data);
      const saved = await doc.save();
      return saved.toObject();
    } catch (err) {
      console.warn('Error saving to MongoDB, falling back to memory store:', err);
    }
  }

  // Fallback memory save
  const id = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const participant: MemoryParticipant = {
    _id: id,
    participantId: data.participantId!,
    name: data.name!,
    registerNumber: data.registerNumber!.toUpperCase(),
    department: data.department!,
    departmentCode: data.departmentCode!.toUpperCase(),
    year: data.year!,
    college: data.college || 'Sengunthar Engineering College',
    place: data.place || 'Tiruchengode, Namakkal',
    email: data.email!,
    phone: data.phone!,
    event: data.event || 'TechSym SaRaYu-26',
    participantType: data.participantType || 'Internal Participant (Sengunthar Student)',
    photo: data.photo!,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryParticipants.set(participant.participantId, participant);
  return participant;
}

/**
 * Find participant by ID or Register Number
 */
export async function findParticipantByIdOrRegNo(query: string): Promise<any | null> {
  const trimmed = query.trim().toUpperCase();

  if (isConnected()) {
    try {
      const participant = await ParticipantModel.findOne({
        $or: [
          { participantId: { $regex: new RegExp(`^${trimmed}$`, 'i') } },
          { registerNumber: { $regex: new RegExp(`^${trimmed}$`, 'i') } },
        ],
      });
      if (participant) return participant.toObject();
    } catch (err) {
      console.warn('Error fetching from MongoDB:', err);
    }
  }

  for (const p of memoryParticipants.values()) {
    if (
      p.participantId.toUpperCase() === trimmed ||
      p.registerNumber.toUpperCase() === trimmed
    ) {
      return p;
    }
  }

  return null;
}

/**
 * List participants with filtering, search, and pagination
 */
export async function listParticipants(options: {
  search?: string;
  department?: string;
  year?: string;
  participantType?: string;
  limit?: number;
  page?: number;
}): Promise<{ participants: any[]; total: number }> {
  const { search, department, year, participantType, limit = 50, page = 1 } = options;

  if (isConnected()) {
    try {
      const filter: Record<string, any> = {};

      if (department) {
        filter.$or = [
          { departmentCode: department.toUpperCase() },
          { department: new RegExp(department, 'i') },
        ];
      }
      if (year) {
        filter.year = year;
      }
      if (participantType) {
        filter.participantType = participantType;
      }
      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { name: regex },
          { registerNumber: regex },
          { participantId: regex },
          { email: regex },
          { place: regex },
          { college: regex },
        ];
      }

      const total = await ParticipantModel.countDocuments(filter);
      const participants = await ParticipantModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        participants: participants.map((p) => p.toObject()),
        total,
      };
    } catch (err) {
      console.warn('Error querying MongoDB participants:', err);
    }
  }

  // Memory list & filter
  let list = Array.from(memoryParticipants.values());

  if (department) {
    list = list.filter(
      (p) =>
        p.departmentCode.toUpperCase() === department.toUpperCase() ||
        p.department.toLowerCase().includes(department.toLowerCase())
    );
  }
  if (year) {
    list = list.filter((p) => p.year === year);
  }
  if (participantType) {
    list = list.filter((p) => p.participantType === participantType);
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.registerNumber.toLowerCase().includes(s) ||
        p.participantId.toLowerCase().includes(s) ||
        p.email.toLowerCase().includes(s) ||
        p.place.toLowerCase().includes(s) ||
        p.college.toLowerCase().includes(s)
    );
  }

  list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const total = list.length;
  const start = (page - 1) * limit;
  const paginated = list.slice(start, start + limit);

  return { participants: paginated, total };
}

/**
 * Delete participant
 */
export async function deleteParticipant(id: string): Promise<boolean> {
  if (isConnected()) {
    try {
      const res = await ParticipantModel.findOneAndDelete({
        $or: [{ _id: id }, { participantId: id }],
      });
      if (res) return true;
    } catch (err) {
      console.warn('Error deleting in MongoDB:', err);
    }
  }

  for (const [key, p] of memoryParticipants.entries()) {
    if (p._id === id || p.participantId === id) {
      memoryParticipants.delete(key);
      return true;
    }
  }

  return false;
}
