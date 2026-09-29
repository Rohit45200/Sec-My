import React, { useState } from 'react';
import { Participant } from '../types/participant.ts';
import { getParticipantById } from '../services/api.ts';
import { Search, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

interface SearchIdCardProps {
  onFoundParticipant: (participant: Participant) => void;
  initialQuery?: string;
}

export const SearchIdCard: React.FC<SearchIdCardProps> = ({
  onFoundParticipant,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await getParticipantById(query.trim());
      if (res.success && res.data) {
        onFoundParticipant(res.data);
      } else {
        setError('No participant found with this Register Number or ID.');
      }
    } catch (err: any) {
      setError(err.message || 'Participant not found. Please verify your Register Number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
            <Search className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Find Your Existing ID Card
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Already registered? Enter your College Register Number or Participant ID to re-download or print your digital pass.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-800 flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Register Number or Participant ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
                placeholder="e.g. 732421104042 or TS26-CSE-001"
                className="w-full font-mono uppercase rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Case-insensitive. Works with roll number or symposium ID.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 text-sm font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching Database...</span>
              </>
            ) : (
              <>
                <span>View &amp; Download ID Card</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
