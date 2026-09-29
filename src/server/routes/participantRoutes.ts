import { Router, Request, Response } from 'express';
import {
  saveParticipant,
  checkDuplicateRegisterNumber,
  updateParticipantByRegNo,
  getNextParticipantId,
  findParticipantByIdOrRegNo,
  listParticipants,
  deleteParticipant,
  isConnected,
} from '../db.ts';
import { DEPARTMENTS } from '../../constants/symposiumData.ts';

export const participantRouter = Router();

// Helper to resolve department code
function resolveDepartmentCode(departmentInput: string): string {
  const normalized = departmentInput.trim().toUpperCase();

  // Direct code match
  const byCode = DEPARTMENTS.find((d) => d.code === normalized);
  if (byCode) return byCode.code;

  // Name match
  const byName = DEPARTMENTS.find(
    (d) =>
      d.name.toUpperCase() === normalized ||
      normalized.includes(d.code) ||
      d.shortName.toUpperCase() === normalized
  );
  if (byName) return byName.code;

  // Fallback: extract alphabetic acronym or first 4 chars
  const letters = normalized.replace(/[^A-Z]/g, '');
  return letters.substring(0, 4) || 'GEN';
}

/**
 * Health check & DB status
 */
participantRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: isConnected() ? 'MongoDB Atlas (Connected)' : 'Resilient In-Memory Datastore',
  });
});

/**
 * Register a new participant
 * POST /api/participants
 */
participantRouter.post('/participants', async (req: Request, res: Response) => {
  try {
    const {
      name,
      registerNumber,
      department,
      year,
      college,
      place,
      email,
      phone,
      event,
      participantType,
      photo,
    } = req.body;

    // 1. Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid student full name (at least 2 characters).',
      });
    }

    if (!registerNumber || typeof registerNumber !== 'string' || registerNumber.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid college register / roll number.',
      });
    }

    if (!department || typeof department !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please select your department / track.',
      });
    }

    if (!year || typeof year !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please select your current year of study.',
      });
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    const digitsOnly = String(phone || '').replace(/[^0-9]/g, '');
    if (!phone || digitsOnly.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit mobile phone number.',
      });
    }

    if (!photo || typeof photo !== 'string' || !photo.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        error: 'Student photo is required. Please upload a clear passport-style photo (JPEG/PNG/WebP).',
      });
    }

    // Size limit check on base64 photo (limit ~2MB base64)
    if (photo.length > 2.5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'Uploaded photo is too large. Image must be under 2MB.',
      });
    }

    const cleanRegNo = registerNumber.trim().toUpperCase();

    // 2. Existing registration check: If found, update details and return ID card seamlessly
    const existing = await checkDuplicateRegisterNumber(cleanRegNo);
    if (existing) {
      const deptCode = resolveDepartmentCode(department);
      const updated = await updateParticipantByRegNo(cleanRegNo, {
        name: name.trim(),
        department: department.trim(),
        departmentCode: deptCode,
        year: year.trim(),
        college: college ? college.trim() : undefined,
        place: place ? place.trim() : undefined,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        photo,
        participantType,
      });

      return res.status(200).json({
        success: true,
        message: `ID Card updated successfully for ${cleanRegNo}.`,
        data: updated || existing,
      });
    }

    // 3. Resolve department code and generate atomic participant ID
    const deptCode = resolveDepartmentCode(department);
    const participantId = await getNextParticipantId(deptCode);

    // 4. Construct record
    const newParticipantData = {
      participantId,
      name: name.trim(),
      registerNumber: cleanRegNo,
      department: department.trim(),
      departmentCode: deptCode,
      year: year.trim(),
      college: (college && college.trim()) || 'Sengunthar Engineering College',
      place: (place && place.trim()) || 'Tiruchengode, Namakkal',
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      event: (event && event.trim()) || 'TechSym SaRaYu-26',
      participantType: (participantType && participantType.trim()) || 'Internal Participant (Sengunthar Student)',
      photo,
    };

    // 5. Store participant
    const saved = await saveParticipant(newParticipantData);

    return res.status(201).json({
      success: true,
      message: 'Participant registered successfully.',
      data: saved,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while processing registration. Please try again.',
    });
  }
});

/**
 * Get participant by ID or Register Number
 * GET /api/participants/:id
 */
participantRouter.get('/participants/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || !id.trim()) {
      return res.status(400).json({ success: false, error: 'Identifier is required.' });
    }

    const participant = await findParticipantByIdOrRegNo(id);
    if (!participant) {
      return res.status(404).json({
        success: false,
        error: `No participant found matching "${id}". Please check the ID or Register Number.`,
      });
    }

    return res.json({
      success: true,
      data: participant,
    });
  } catch (error: any) {
    console.error('Fetch participant error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve participant data.',
    });
  }
});

/**
 * Verification endpoint for QR code scans
 * GET /api/verify/:participantId
 */
participantRouter.get('/verify/:participantId', async (req: Request, res: Response) => {
  try {
    const { participantId } = req.params;
    const participant = await findParticipantByIdOrRegNo(participantId);

    if (!participant) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'Invalid or unregistered symposium ID card.',
      });
    }

    return res.json({
      success: true,
      verified: true,
      participant: {
        participantId: participant.participantId,
        name: participant.name,
        registerNumber: participant.registerNumber,
        department: participant.department,
        departmentCode: participant.departmentCode,
        year: participant.year,
        college: participant.college,
        event: participant.event,
        participantType: participant.participantType,
        photo: participant.photo,
        registeredAt: participant.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      error: 'Verification service error.',
    });
  }
});

/**
 * Admin authentication endpoint
 * POST /api/admin/verify
 */
participantRouter.post('/admin/verify', (req: Request, res: Response) => {
  const { passcode } = req.body;
  const expectedPasscode = process.env.ADMIN_PASSCODE || 'admin123';

  if (!passcode || typeof passcode !== 'string' || passcode.trim() !== expectedPasscode.trim()) {
    return res.status(401).json({
      success: false,
      error: 'Invalid admin passcode. Access denied.',
    });
  }

  return res.json({
    success: true,
    message: 'Admin authenticated successfully.',
  });
});

/**
 * Admin: Get participants list
 * GET /api/participants
 */
participantRouter.get('/participants', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const department = req.query.department as string;
    const year = req.query.year as string;
    const participantType = req.query.participantType as string;
    const limit = parseInt((req.query.limit as string) || '50', 10);
    const page = parseInt((req.query.page as string) || '1', 10);

    const result = await listParticipants({
      search,
      department,
      year,
      participantType,
      limit,
      page,
    });

    return res.json({
      success: true,
      data: result.participants,
      total: result.total,
      page,
      limit,
    });
  } catch (error: any) {
    console.error('List participants error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch participant list.',
    });
  }
});

/**
 * Admin: Delete participant
 * DELETE /api/participants/:id
 */
participantRouter.delete('/participants/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminPasscode = req.headers['x-admin-passcode'] || req.query.passcode;
    const expectedPasscode = process.env.ADMIN_PASSCODE || 'admin123';

    if (adminPasscode !== expectedPasscode) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid admin passcode.',
      });
    }

    const deleted = await deleteParticipant(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found or already deleted.',
      });
    }

    return res.json({
      success: true,
      message: 'Participant record deleted successfully.',
    });
  } catch (error: any) {
    console.error('Delete participant error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete participant record.',
    });
  }
});
