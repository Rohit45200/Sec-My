import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { RegistrationForm } from './components/RegistrationForm.tsx';
import { IdCardModal } from './components/IdCardModal.tsx';
import { SearchIdCard } from './components/SearchIdCard.tsx';
import { VerificationView } from './components/VerificationView.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { SymposiumBrochureView } from './components/SymposiumBrochureView.tsx';
import { Participant } from './types/participant.ts';
import { checkServerHealth } from './services/api.ts';
import { SYMPOSIUM_INFO, COLLEGE_INFO } from './constants/symposiumData.ts';
import { Sparkles, Calendar, Award, ShieldCheck, ArrowRight, IndianRupee, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'search' | 'verify' | 'admin' | 'brochure'>('register');
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [verifyInitialId, setVerifyInitialId] = useState('');
  const [dbStatus, setDbStatus] = useState<string>('Online');
  const [selectedBrochureDept, setSelectedBrochureDept] = useState<string | undefined>();
  const [selectedBrochureEvent, setSelectedBrochureEvent] = useState<string | undefined>();

  // Monitor URL hash (e.g. #verify-TS26-CSE-001) for gate QR scanner links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#verify-')) {
        const id = hash.replace('#verify-', '');
        setVerifyInitialId(id);
        setActiveTab('verify');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Check backend server & database status
  useEffect(() => {
    checkServerHealth().then((health) => {
      setDbStatus(health.database || 'Online');
    });
  }, []);

  const handleRegistrationSuccess = (participant: Participant) => {
    setCurrentParticipant(participant);
  };

  const handleNavigateToSearch = (regNo: string) => {
    setSearchInitialQuery(regNo);
    setActiveTab('search');
  };

  const handleSelectDepartmentFromBrochure = (deptName: string, eventName?: string) => {
    setSelectedBrochureDept(deptName);
    setSelectedBrochureEvent(eventName);
    setCurrentParticipant(null);
    setActiveTab('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-800 antialiased">
      {/* Header with Navigation and DB indicator */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'register' && currentParticipant) {
            // Keep card or start fresh
          }
        }}
        dbStatus={dbStatus}
      />

      {/* Hero Banner when on Registration Tab without active card */}
      {activeTab === 'register' && !currentParticipant && (
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white py-8 px-4 sm:px-6 print:hidden border-b border-indigo-900/50 shadow-inner">
          <div className="mx-auto max-w-5xl text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-400/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Celebrating 25 Years of Excellence • {COLLEGE_INFO.name}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {SYMPOSIUM_INFO.name}
            </h1>
            <p className="text-sm sm:text-base text-indigo-200 max-w-2xl mx-auto font-medium">
              National-Level Students' Technical Symposium • <span className="text-amber-300 font-bold">30th SEP &amp; 01st OCT 2026</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <IndianRupee className="h-4 w-4" />
                Registration Fee: ₹250 Per Participant
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Calendar className="h-4 w-4" />
                Reg Deadline: 26-09-2026
              </span>
              <span className="hidden sm:inline">•</span>
              <button
                onClick={() => setActiveTab('brochure')}
                className="flex items-center gap-1.5 text-indigo-300 hover:text-white underline font-semibold cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5" />
                View 13 Department Wings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {activeTab === 'brochure' && (
          <SymposiumBrochureView
            onSelectDepartment={handleSelectDepartmentFromBrochure}
          />
        )}

        {activeTab === 'register' && (
          <>
            {currentParticipant ? (
              <IdCardModal
                participant={currentParticipant}
                onNewRegistration={() => {
                  setCurrentParticipant(null);
                  setSelectedBrochureDept(undefined);
                  setSelectedBrochureEvent(undefined);
                }}
              />
            ) : (
              <RegistrationForm
                onSuccess={handleRegistrationSuccess}
                onNavigateToSearch={handleNavigateToSearch}
                initialDepartment={selectedBrochureDept}
                initialEvent={selectedBrochureEvent}
              />
            )}
          </>
        )}

        {activeTab === 'search' && (
          <>
            {currentParticipant ? (
              <IdCardModal
                participant={currentParticipant}
                onClose={() => setCurrentParticipant(null)}
                onNewRegistration={() => {
                  setCurrentParticipant(null);
                  setActiveTab('register');
                }}
              />
            ) : (
              <SearchIdCard
                onFoundParticipant={(p) => setCurrentParticipant(p)}
                initialQuery={searchInitialQuery}
              />
            )}
          </>
        )}

        {activeTab === 'verify' && (
          <VerificationView
            initialId={verifyInitialId}
            onViewFullCard={(p) => {
              setCurrentParticipant(p);
              setActiveTab('search');
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            onSelectParticipant={(p) => {
              setCurrentParticipant(p);
              setActiveTab('search');
            }}
          />
        )}
      </main>

      {/* College & Symposium Footer */}
      <Footer />
    </div>
  );
}
