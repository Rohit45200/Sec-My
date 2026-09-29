import React from 'react';
import { CollegeLogo, SymposiumLogo } from './CollegeLogo.tsx';
import { COLLEGE_INFO, SYMPOSIUM_INFO } from '../constants/symposiumData.ts';
import { IdCard, Search, ShieldCheck, Users, Calendar, MapPin, BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'register' | 'search' | 'verify' | 'admin' | 'brochure';
  setActiveTab: (tab: 'register' | 'search' | 'verify' | 'admin' | 'brochure') => void;
  dbStatus?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  dbStatus = 'Connecting...',
}) => {
  return (
    <header className="border-b border-slate-200 bg-white shadow-xs print:hidden">
      {/* Top Accreditation Bar */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-amber-300">25th ANNIVERSARY</span>
            <span className="text-slate-400">•</span>
            <span className="font-medium text-slate-200">{COLLEGE_INFO.tagline}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="rounded bg-emerald-950 text-emerald-300 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/40">
              REG FEE: ₹250
            </span>
            <span>{COLLEGE_INFO.accreditation}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-amber-300 font-mono text-[11px]">DB: {dbStatus}</span>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* College & Symposium identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <CollegeLogo size={54} className="shrink-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-amber-400 text-slate-950 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  25th ANNIVERSARY
                </span>
                <span className="rounded-md bg-indigo-100 text-indigo-900 px-2 py-0.5 text-[10px] font-bold uppercase">
                  AUTONOMOUS
                </span>
                <span className="text-xs text-slate-500 font-medium">Tiruchengode, Tamil Nadu</span>
              </div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl md:text-2xl leading-tight mt-0.5">
                {COLLEGE_INFO.name}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs sm:text-sm font-black text-indigo-700">
                  {SYMPOSIUM_INFO.name}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-medium">National-Level Students' Technical Symposium</span>
              </div>
            </div>
          </div>

          {/* Event Dates & Location Highlights */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-2xl bg-indigo-50/70 p-2.5 sm:p-3 border border-indigo-100 text-xs text-indigo-950">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <Calendar className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>30 Sep &amp; 01 Oct 2026</span>
            </div>
            <div className="hidden sm:block text-indigo-300">|</div>
            <div className="flex items-center gap-1.5 text-slate-600 text-[11px] sm:text-xs">
              <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span>Campus Auditorium, Tiruchengode</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="mt-4 flex gap-1.5 overflow-x-auto border-t border-slate-100 pt-3 no-scrollbar">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <IdCard className="h-4 w-4" />
            <span>Generate ID Card</span>
          </button>

          <button
            onClick={() => setActiveTab('brochure')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'brochure'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4 text-amber-500" />
            <span>Brochure &amp; 13 Department Wings</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'search'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Find My ID Card</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'verify'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Verify ID Card</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Organizer Portal</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
