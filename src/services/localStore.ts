import { Participant, ParticipantFormData } from '../types/participant.ts';
import { DEPARTMENTS } from '../constants/symposiumData.ts';

const STORAGE_KEY = 'techsym26_participants_store';
const COUNTER_KEY = 'techsym26_counters_store';

function getStoredParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('localStorage read error:', err);
    return [];
  }
}

function saveStoredParticipants(list: Participant[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('localStorage write error:', err);
  }
}

function getStoredCounters(): Record<string, number> {
  try {
    const raw = localStorage.getItem(COUNTER_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

function saveStoredCounters(counters: Record<string, number>): void {
  try {
    localStorage.setItem(COUNTER_KEY, JSON.stringify(counters));
  } catch (err) {
    console.warn('localStorage write error:', err);
  }
}

function resolveDeptCode(deptName: string): string {
  const norm = deptName.trim().toUpperCase();
  const found = DEPARTMENTS.find(
    (d) =>
      d.name.toUpperCase() === norm ||
      d.code.toUpperCase() === norm ||
      norm.includes(d.code)
  );
  if (found) return found.code;
  const letters = norm.replace(/[^A-Z]/g, '');
  return letters.substring(0, 4) || 'GEN';
}

export function localGetNextParticipantId(department: string): string {
  const code = resolveDeptCode(department);
  const counters = getStoredCounters();
  const counterKey = `TS26-${code}`;
  const current = counters[counterKey] || 0;
  const next = current + 1;
  counters[counterKey] = next;
  saveStoredCounters(counters);

  const seqStr = String(next).padStart(3, '0');
  return `${counterKey}-${seqStr}`;
}

export function localCheckDuplicate(registerNumber: string): Participant | null {
  const norm = registerNumber.trim().toUpperCase();
  const list = getStoredParticipants();
  return list.find((p) => p.registerNumber.toUpperCase() === norm) || null;
}

export function localSaveParticipant(data: ParticipantFormData): Participant {
  const cleanRegNo = data.registerNumber.trim().toUpperCase();
  const existing = localCheckDuplicate(cleanRegNo);
  if (existing) {
    existing.name = data.name.trim();
    existing.department = data.department.trim();
    existing.year = data.year.trim();
    if (data.college) existing.college = data.college.trim();
    if (data.place) existing.place = data.place.trim();
    if (data.email) existing.email = data.email.trim().toLowerCase();
    if (data.phone) existing.phone = data.phone.trim();
    if (data.photo) existing.photo = data.photo;
    if (data.participantType) existing.participantType = data.participantType.trim();
    existing.updatedAt = new Date().toISOString();

    const list = getStoredParticipants().map((p) =>
      p.participantId === existing.participantId ? existing : p
    );
    saveStoredParticipants(list);
    return existing;
  }

  const deptCode = resolveDeptCode(data.department);
  const participantId = localGetNextParticipantId(data.department);

  const participant: Participant = {
    _id: `loc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    participantId,
    name: data.name.trim(),
    registerNumber: cleanRegNo,
    department: data.department.trim(),
    departmentCode: deptCode,
    year: data.year.trim(),
    college: data.college?.trim() || 'Sengunthar Engineering College',
    place: data.place?.trim() || 'Tiruchengode, Namakkal',
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    event: data.event?.trim() || 'TechSym SaRaYu-26',
    participantType:
      data.participantType?.trim() || 'Internal Participant (Sengunthar Student)',
    photo: data.photo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const list = getStoredParticipants();
  list.unshift(participant);
  saveStoredParticipants(list);

  return participant;
}

export function localFindParticipant(idOrRegNo: string): Participant | null {
  const norm = idOrRegNo.trim().toUpperCase();
  const list = getStoredParticipants();
  return (
    list.find(
      (p) =>
        p.participantId.toUpperCase() === norm ||
        p.registerNumber.toUpperCase() === norm
    ) || null
  );
}

export function localListParticipants(options: {
  search?: string;
  department?: string;
  year?: string;
}): Participant[] {
  let list = getStoredParticipants();

  if (options.department) {
    list = list.filter(
      (p) =>
        p.departmentCode.toUpperCase() === options.department!.toUpperCase() ||
        p.department.toLowerCase().includes(options.department!.toLowerCase())
    );
  }
  if (options.year) {
    list = list.filter((p) => p.year === options.year);
  }
  if (options.search) {
    const s = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.registerNumber.toLowerCase().includes(s) ||
        p.participantId.toLowerCase().includes(s)
    );
  }

  return list;
}

export function localDeleteParticipant(id: string): boolean {
  const list = getStoredParticipants();
  const filtered = list.filter((p) => p.participantId !== id && p._id !== id);
  if (filtered.length !== list.length) {
    saveStoredParticipants(filtered);
    return true;
  }
  return false;
}
