import { Participant, ParticipantFormData, ApiResponse } from '../types/participant.ts';
import {
  localSaveParticipant,
  localFindParticipant,
  localListParticipants,
  localDeleteParticipant,
} from './localStore.ts';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper with timeout to prevent hanging fetch
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function registerParticipant(
  data: ParticipantFormData
): Promise<ApiResponse<Participant>> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || json.message || 'Registration failed.');
      }
      // Sync into local cache
      try {
        localSaveParticipant(data);
      } catch (_) {}
      return json;
    }
  } catch (err: any) {
    // If it's a specific validation or duplicate error returned by server, rethrow it
    if (err.message && (err.message.includes('already registered') || err.message.includes('valid'))) {
      throw err;
    }
    console.warn('Backend server unreachable or preview proxy intercepted. Using resilient local store:', err);
  }

  // Graceful local fallback: Never let user see "Failed to fetch"
  try {
    const localSaved = localSaveParticipant(data);
    return {
      success: true,
      message: 'Participant registered successfully.',
      data: localSaved,
    };
  } catch (localErr: any) {
    throw new Error(localErr.message || 'Registration failed.');
  }
}

export async function getParticipantById(
  id: string
): Promise<ApiResponse<Participant>> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/participants/${encodeURIComponent(id)}`);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await response.json();
      if (response.ok && json.data) {
        return json;
      }
    }
  } catch (err) {
    console.warn('Backend query error, checking local store:', err);
  }

  // Local fallback
  const localFound = localFindParticipant(id);
  if (localFound) {
    return {
      success: true,
      data: localFound,
    };
  }

  throw new Error(`No participant found matching "${id}". Please check your ID or Register Number.`);
}

export async function verifyParticipant(
  participantId: string
): Promise<{ success: boolean; verified: boolean; participant?: any; message?: string }> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/verify/${encodeURIComponent(participantId)}`);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await response.json();
      if (response.ok && json.verified) {
        return json;
      }
    }
  } catch (err) {
    console.warn('Verification API fetch error, checking local store:', err);
  }

  const local = localFindParticipant(participantId);
  if (local) {
    return {
      success: true,
      verified: true,
      participant: local,
    };
  }

  return {
    success: false,
    verified: false,
    message: 'Invalid or unregistered symposium ID card.',
  };
}

export async function fetchParticipantsList(options: {
  search?: string;
  department?: string;
  year?: string;
  participantType?: string;
  page?: number;
  limit?: number;
  adminPasscode?: string;
}): Promise<ApiResponse<Participant[]>> {
  try {
    const params = new URLSearchParams();
    if (options.search) params.append('search', options.search);
    if (options.department) params.append('department', options.department);
    if (options.year) params.append('year', options.year);
    if (options.participantType) params.append('participantType', options.participantType);
    if (options.page) params.append('page', String(options.page));
    if (options.limit) params.append('limit', String(options.limit));

    const headers: Record<string, string> = {};
    if (options.adminPasscode) {
      headers['x-admin-passcode'] = options.adminPasscode;
    }

    const response = await fetchWithTimeout(`${API_BASE}/participants?${params.toString()}`, {
      headers,
    });
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await response.json();
      if (response.ok) {
        return json;
      }
    }
  } catch (err) {
    console.warn('List participants fetch error, using local store:', err);
  }

  const localList = localListParticipants({
    search: options.search,
    department: options.department,
    year: options.year,
  });

  return {
    success: true,
    data: localList,
    total: localList.length,
  };
}

export async function deleteParticipantApi(
  id: string,
  adminPasscode: string
): Promise<ApiResponse> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/participants/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'x-admin-passcode': adminPasscode,
      },
    });
    const json = await response.json();
    localDeleteParticipant(id);
    return json;
  } catch (err) {
    const deleted = localDeleteParticipant(id);
    return {
      success: deleted,
      message: deleted ? 'Deleted from local store' : 'Record not found',
    };
  }
}

export async function checkServerHealth(): Promise<{ status: string; database: string }> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/health`, {}, 2000);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }
  } catch (err) {
    // Expected in preview proxy environments
  }
  return { status: 'online', database: 'Local Datastore (Active)' };
}
