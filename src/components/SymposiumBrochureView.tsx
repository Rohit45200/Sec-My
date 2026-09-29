import React from 'react';
import {
  COLLEGE_INFO,
  SYMPOSIUM_INFO,
  DEPARTMENTS,
  DepartmentOption,
} from '../constants/symposiumData.ts';
import { CollegeLogo } from './CollegeLogo.tsx';
import {
  Calendar,
  IndianRupee,
  Clock,
  Trophy,
  Utensils,
  Gamepad2,
  Sparkles,
  Phone,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface SymposiumBrochureViewProps {
  onSelectDepartment: (deptName: string, eventName?: string) => void;
}

export const SymposiumBrochureView: React.FC<SymposiumBrochureViewProps> = ({
  onSelectDepartment,
}) => {
  return (
    <div className="space-y-8 pb-10">
      {/* Hero Poster Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-2xl border-2 border-indigo-900/60">
        {/* Decorative corner glows */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Top College Header matching the official paper */}
        <div className="text-center space-y-2 pb-6 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CollegeLogo size={60} className="shrink-0" />
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase text-slate-950 tracking-wider">
                  25th ANNIVERSARY
                </span>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {COLLEGE_INFO.estd}
                </span>
                <span className="rounded-md bg-indigo-600/60 px-2 py-0.5 text-[10px] font-bold text-indigo-100">
                  AUTONOMOUS
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                {COLLEGE_INFO.name}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl mx-auto">
            {COLLEGE_INFO.tagline}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-400">
            {COLLEGE_INFO.ugcRecognition} •{' '}
            <strong className="text-amber-300">{COLLEGE_INFO.accreditation}</strong>
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            {COLLEGE_INFO.location}
          </p>
        </div>

        {/* Symposium Main Title Banner */}
        <div className="pt-8 text-center space-y-4">
          <div className="inline-block rounded-full bg-gradient-to-r from-indigo-500/20 to-blue-500/20 px-5 py-1.5 border border-indigo-400/40 text-xs font-bold uppercase tracking-widest text-indigo-200">
            ★ NATIONAL-LEVEL STUDENTS' TECHNICAL SYMPOSIUM ★
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-300">
            {SYMPOSIUM_INFO.name}
          </h1>

          {/* Quick Metrics Bar (Dates, Fee, Deadline) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-2">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-300 font-bold text-xs uppercase mb-1">
                <Calendar className="h-4 w-4" />
                <span>Event Dates</span>
              </div>
              <div className="text-lg font-black text-white">
                30th SEP &amp; 01st OCT 2026
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-900/40 backdrop-blur-md p-4 border border-emerald-400/30 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-300 font-bold text-xs uppercase mb-1">
                <IndianRupee className="h-4 w-4" />
                <span>Registration Fee</span>
              </div>
              <div className="text-lg font-black text-emerald-300">
                ₹250 PER PARTICIPANT
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-rose-300 font-bold text-xs uppercase mb-1">
                <Clock className="h-4 w-4" />
                <span>Registration Ends On</span>
              </div>
              <div className="text-lg font-black text-white">
                26-09-2026
              </div>
            </div>
          </div>
        </div>

        {/* Perks & Highlights Strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
            <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">WIN EXCITING PRIZES</div>
              <div className="text-[10px] text-slate-400">Cash awards &amp; certificates</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
            <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">FOOD &amp; REFRESHMENTS</div>
              <div className="text-[10px] text-slate-400">Delicious lunch &amp; tea included</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
            <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">FUN GAMES</div>
              <div className="text-[10px] text-slate-400">Engaging non-tech activities</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
            <div className="rounded-lg bg-sky-500/20 p-2 text-sky-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">PRE-SYMPOSIUM</div>
              <div className="text-[10px] text-slate-400">Workshops &amp; preparation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Dates Timeline Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <span>Official Schedule &amp; Deadlines</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 1</span>
            <div className="text-base font-bold text-slate-900 mt-1">Submission Deadline</div>
            <div className="text-sm font-mono font-black text-indigo-600 mt-1">19.09.2026</div>
            <p className="text-[11px] text-slate-500 mt-1">Abstract and paper submissions close</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 2</span>
            <div className="text-base font-bold text-slate-900 mt-1">Selection Intimation</div>
            <div className="text-sm font-mono font-black text-indigo-600 mt-1">22.09.2026</div>
            <p className="text-[11px] text-slate-500 mt-1">Acceptance notification to authors</p>
          </div>

          <div className="rounded-2xl bg-amber-50/60 p-4 border border-amber-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Step 3</span>
            <div className="text-base font-bold text-slate-900 mt-1">Registration Ends On</div>
            <div className="text-sm font-mono font-black text-amber-700 mt-1">23.09.2026 / 26.09.2026</div>
            <p className="text-[11px] text-amber-800 mt-1">Fee payment &amp; pass generation</p>
          </div>

          <div className="rounded-2xl bg-indigo-50/80 p-4 border border-indigo-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Event Days</span>
            <div className="text-base font-bold text-indigo-950 mt-1">Paper &amp; Tech Events</div>
            <div className="text-xs font-mono font-bold text-indigo-700 mt-1">
              <div>Paper: <strong>30.09.2026</strong></div>
              <div>Tech: <strong>01.10.2026</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* 13 Official Department Wings Grid matching the paper */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Department Competitions &amp; Tracks
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              All 13 Technical Wings &amp; Events
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Click <strong>"Register for this Wing"</strong> on any department to generate your ID Card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((dept: DepartmentOption) => (
            <div
              key={dept.code}
              className="flex flex-col justify-between rounded-3xl bg-white p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Header with Department & Wing Name */}
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {dept.shortName}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-1 tracking-tight">
                      {dept.wingName}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 text-right max-w-[130px] leading-tight">
                    {dept.name}
                  </span>
                </div>

                {/* Sub-Events List */}
                <div className="mt-3.5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Events
                  </span>
                  <ul className="space-y-1">
                    {dept.events.map((ev, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-800"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coordinators Info */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Coordinators
                  </span>
                  <div className="space-y-1">
                    {/* Faculty */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <User className="h-3 w-3 text-slate-400" />
                        {dept.coordinator.facultyName} ({dept.coordinator.facultyDesignation})
                      </span>
                      <a
                        href={`tel:${dept.coordinator.facultyPhone}`}
                        className="flex items-center gap-0.5 text-indigo-600 font-mono font-bold hover:underline"
                      >
                        <Phone className="h-2.5 w-2.5" />
                        {dept.coordinator.facultyPhone}
                      </a>
                    </div>

                    {/* Student */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <User className="h-3 w-3 text-slate-400" />
                        {dept.coordinator.studentName} ({dept.coordinator.studentClass})
                      </span>
                      <a
                        href={`tel:${dept.coordinator.studentPhone}`}
                        className="flex items-center gap-0.5 text-indigo-600 font-mono font-bold hover:underline"
                      >
                        <Phone className="h-2.5 w-2.5" />
                        {dept.coordinator.studentPhone}
                      </a>
                    </div>

                    {/* Email */}
                    <div className="pt-0.5">
                      <a
                        href={`mailto:${dept.coordinator.email}`}
                        className="flex items-center gap-1 text-[10.5px] text-slate-500 hover:text-indigo-600 font-mono truncate"
                      >
                        <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{dept.coordinator.email}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onSelectDepartment(dept.name, dept.events[0])}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2.5 text-xs transition-colors cursor-pointer group-hover:bg-indigo-600 shadow-xs"
                >
                  <span>Register for {dept.wingName}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College Official Contact Footer Card */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-lg font-bold text-white">
            {COLLEGE_INFO.name} (Autonomous)
          </h4>
          <p className="text-xs text-slate-300">
            {COLLEGE_INFO.location} • Celebrating 25 Glorious Years
          </p>
          <p className="text-xs text-amber-300 font-mono">
            Official Website: {COLLEGE_INFO.website} • Social: {COLLEGE_INFO.socialHandle}
          </p>
        </div>

        <a
          href={COLLEGE_INFO.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-white text-slate-950 font-bold px-5 py-3 text-xs hover:bg-slate-100 transition-colors shadow-sm shrink-0"
        >
          <span>Visit College Website</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};
