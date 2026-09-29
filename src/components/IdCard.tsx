import React from 'react';
import { Participant } from '../types/participant.ts';
import { CollegeLogo } from './CollegeLogo.tsx';
import { COLLEGE_INFO, SYMPOSIUM_INFO } from '../constants/symposiumData.ts';

interface IdCardProps {
  participant: Participant;
  elementId?: string;
}

export const IdCard: React.FC<IdCardProps> = ({
  participant,
  elementId = 'techsym-id-card',
}) => {
  return (
    <div className="flex justify-center p-2 sm:p-4 w-full">
      {/* Horizontal / Landscape Card Container */}
      <div
        id={elementId}
        className="relative w-full max-w-[560px] sm:w-[560px] rounded-2xl bg-white shadow-2xl border-2 border-slate-300 overflow-hidden text-slate-800 font-sans print:shadow-none print:border-2 print:border-slate-400 print:w-[560px] print:m-auto transition-all"
        style={{ minHeight: '345px' }}
      >
        {/* Top Header Banner — Horizontal Format */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-4 sm:px-5 py-3 text-white relative border-b-2 border-amber-400">
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* College Logo (Left side of College Name, Vertically Aligned) */}
            <CollegeLogo size={48} className="shrink-0 ring-1 ring-amber-400/60 shadow-md" />

            {/* College Name & Accreditation Details */}
            <div className="min-w-0 flex-1 space-y-0.5">
              <h1 className="text-sm sm:text-base font-black tracking-tight uppercase text-amber-300 leading-tight truncate">
                {COLLEGE_INFO.name}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-200 font-bold tracking-wide">
                TECHNICAL SYMPOSIUM • AUTONOMOUS
              </p>
              <p className="text-[8.5px] sm:text-[9.5px] text-slate-300 font-medium tracking-tight truncate">
                Approved by AICTE • Affiliated to Anna University • NAAC "A" Grade
              </p>
            </div>
          </div>

          {/* Symposium Name & Dates Row */}
          <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-xs">
            <div className="text-base sm:text-lg font-black tracking-wide text-white">
              {SYMPOSIUM_INFO.name}
            </div>
            <div className="rounded-md bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 text-[10px] tracking-wider uppercase font-mono shadow-xs">
              30 SEP &amp; 01 OCT 2026
            </div>
          </div>
        </div>

        {/* Card Body: Horizontal 2-Column Layout */}
        <div className="p-4 sm:p-5 flex flex-row items-center gap-4 sm:gap-6 bg-gradient-to-br from-white via-slate-50 to-indigo-50/20">
          {/* Left Column: Student Photo */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl overflow-hidden border-2 border-indigo-600 shadow-md bg-slate-100 flex items-center justify-center">
              {participant.photo ? (
                <img
                  src={participant.photo}
                  alt={participant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400 text-xs font-medium text-center p-2">
                  No Photo
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Clean Two-Column Aligned Student Information */}
          <div className="flex-1 min-w-0">
            {/* Student Name */}
            <div className="mb-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                STUDENT NAME
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight truncate leading-tight">
                {participant.name}
              </h2>
            </div>

            {/* Consistent Two-Column Layout with Exact Alignment */}
            <div className="pt-1.5 border-t border-slate-200">
              {/* BRANCH / DEPT */}
              <div className="flex items-center text-xs py-1.5 border-b border-slate-100">
                <span className="w-28 sm:w-32 shrink-0 text-[10.5px] font-bold text-slate-500 uppercase tracking-tight">
                  BRANCH / DEPT:
                </span>
                <span className="font-bold text-indigo-950 text-xs sm:text-[13px] truncate">
                  {participant.department}
                </span>
              </div>

              {/* YEAR OF STUDY */}
              <div className="flex items-center text-xs py-1.5 border-b border-slate-100">
                <span className="w-28 sm:w-32 shrink-0 text-[10.5px] font-bold text-slate-500 uppercase tracking-tight">
                  YEAR OF STUDY:
                </span>
                <span className="font-semibold text-slate-800 text-xs sm:text-[13px]">
                  {participant.year}
                </span>
              </div>

              {/* COLLEGE NAME */}
              <div className="flex items-center text-xs py-1.5 border-b border-slate-100">
                <span className="w-28 sm:w-32 shrink-0 text-[10.5px] font-bold text-slate-500 uppercase tracking-tight">
                  COLLEGE NAME:
                </span>
                <span className="font-semibold text-slate-800 text-xs sm:text-[13px] truncate" title={participant.college}>
                  {participant.college}
                </span>
              </div>

              {/* PLACE */}
              <div className="flex items-center text-xs py-1.5">
                <span className="w-28 sm:w-32 shrink-0 text-[10.5px] font-bold text-slate-500 uppercase tracking-tight">
                  PLACE:
                </span>
                <span className="font-bold text-slate-900 text-xs sm:text-[13px] truncate">
                  {participant.place || 'Tiruchengode, Namakkal'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Bar */}
        <div className="bg-slate-900 py-2 px-4 sm:px-5 text-center text-[10px] text-slate-300 border-t border-amber-400 flex items-center justify-between">
          <span className="font-medium text-slate-300 truncate">
            Sengunthar Engineering College (Autonomous) • Tiruchengode, Tamil Nadu
          </span>
          <span className="font-mono text-amber-300 font-bold shrink-0 ml-2">
            {COLLEGE_INFO.website}
          </span>
        </div>
      </div>
    </div>
  );
};
