import React from 'react';
import { COLLEGE_INFO, SYMPOSIUM_INFO, DEPARTMENTS } from '../constants/symposiumData.ts';
import { CollegeLogo } from './CollegeLogo.tsx';
import { Phone, Mail, MapPin, Globe, Calendar, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 print:hidden mt-12">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: College & Symposium */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <CollegeLogo size={42} />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                  {COLLEGE_INFO.name}
                </h3>
                <p className="text-[11px] text-amber-400 font-medium">
                  {COLLEGE_INFO.tagline}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Organized by the Technical Symposium Committee for{' '}
              <strong className="text-white">{SYMPOSIUM_INFO.name}</strong> on{' '}
              <strong className="text-amber-300">{SYMPOSIUM_INFO.dates}</strong>. This digital ID card system ensures swift, paperless gate entry and verified certificate validation for all registered engineering delegates.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Award className="h-4 w-4 text-amber-400" />
              <span>{COLLEGE_INFO.accreditation}</span>
            </div>
          </div>

          {/* Col 2: Participating Departments */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Department Tracks
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              {DEPARTMENTS.slice(0, 6).map((dept) => (
                <li key={dept.code} className="hover:text-amber-300 transition-colors">
                  • {dept.name} ({dept.code})
                </li>
              ))}
              <li className="text-[11px] text-indigo-400">+ 4 More Postgraduate &amp; Allied Tracks</li>
            </ul>
          </div>

          {/* Col 3: Contact & Venue */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Symposium Desk
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{COLLEGE_INFO.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-amber-300 font-semibold">{SYMPOSIUM_INFO.dates}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{COLLEGE_INFO.helpline}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{COLLEGE_INFO.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © 2026 {COLLEGE_INFO.name}. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>TechSym SaRaYu-26 National Level Symposium</span>
            <span>•</span>
            <span className="text-emerald-400">MERN Stack Application</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
