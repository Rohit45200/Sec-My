import React, { useState, useEffect } from 'react';
import { verifyParticipant } from '../services/api.ts';
import {
  ShieldCheck,
  ShieldAlert,
  Loader2,
  CheckCircle,
  Building,
  GraduationCap,
  Calendar,
  Search,
} from 'lucide-react';
import { COLLEGE_INFO, SYMPOSIUM_INFO } from '../constants/symposiumData.ts';

interface VerificationViewProps {
  initialId?: string;
  onViewFullCard?: (participant: any) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  initialId = '',
  onViewFullCard,
}) => {
  const [searchId, setSearchId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    checked: boolean;
    verified: boolean;
    participant?: any;
    message?: string;
  }>({
    checked: false,
    verified: false,
  });

  const runVerification = async (idToVerify: string) => {
    if (!idToVerify.trim()) return;
    try {
      setLoading(true);
      const res = await verifyParticipant(idToVerify.trim());
      setResult({
        checked: true,
        verified: !!res.verified,
        participant: res.participant,
        message: res.message,
      });
    } catch (err: any) {
      setResult({
        checked: true,
        verified: false,
        message: 'Could not connect to verification service.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      runVerification(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(searchId);
  };

  return (
    <div className="mx-auto max-w-2xl py-4">
      {/* Verification Portal Header */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Symposium Gate &amp; QR Verification
            </h2>
            <p className="text-xs text-slate-500">
              Official verification checkpoint for {SYMPOSIUM_INFO.name}
            </p>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-5 flex gap-2">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value.toUpperCase())}
            placeholder="Scan or enter Participant ID / Reg No"
            className="flex-1 font-mono uppercase rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={loading || !searchId.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span>Verify</span>
          </button>
        </form>
      </div>

      {/* Verification Result Card */}
      {result.checked && (
        <div
          className={`rounded-2xl p-6 sm:p-8 border shadow-md transition-all ${
            result.verified
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          {result.verified && result.participant ? (
            <div className="space-y-5">
              {/* Verified Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm sm:text-base uppercase tracking-wider">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <span>Verified Official Participant</span>
                </div>
                <span className="font-mono text-xs bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full font-bold">
                  ENTRY AUTHORIZED
                </span>
              </div>

              {/* Participant Profile Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-sm shrink-0 bg-white">
                  <img
                    src={result.participant.photo}
                    alt={result.participant.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1 text-center sm:text-left flex-1">
                  <span className="inline-block rounded-md bg-indigo-900 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-300">
                    {result.participant.participantId}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 uppercase">
                    {result.participant.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-600">
                    Register No: <strong>{result.participant.registerNumber}</strong>
                  </p>
                  <p className="text-xs text-slate-700 font-medium">
                    {result.participant.department} ({result.participant.year})
                  </p>
                  <p className="text-xs text-slate-600">{result.participant.college}</p>
                  <div className="pt-2">
                    <span className="inline-block rounded-full bg-indigo-100 text-indigo-800 px-2.5 py-0.5 text-[11px] font-bold">
                      {result.participant.participantType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security info bar */}
              <div className="rounded-xl bg-white/80 p-3 text-[11px] text-slate-600 flex flex-wrap justify-between gap-2 border border-emerald-200">
                <span>College: <strong>{COLLEGE_INFO.name}</strong></span>
                <span>Symposium: <strong>{SYMPOSIUM_INFO.name}</strong></span>
                <span>Dates: <strong>30 Sep &amp; 01 Oct 2026</strong></span>
              </div>

              {onViewFullCard && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => onViewFullCard(result.participant)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 text-xs font-bold transition-colors"
                  >
                    View &amp; Print Full ID Badge
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 space-y-2">
              <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold text-rose-900">
                Verification Failed: Unrecognized ID
              </h3>
              <p className="text-xs text-rose-700 max-w-sm mx-auto">
                No active registration record was found matching "{searchId}". Please check the credentials or register at the registration desk.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
