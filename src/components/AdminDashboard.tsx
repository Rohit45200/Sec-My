import React, { useState, useEffect } from 'react';
import { Participant } from '../types/participant.ts';
import { fetchParticipantsList, deleteParticipantApi } from '../services/api.ts';
import { DEPARTMENTS, YEARS } from '../constants/symposiumData.ts';
import { IdCard } from './IdCard.tsx';
import { downloadIdCardAsImage, downloadIdCardAsPdf, printIdCard } from '../utils/idCardExporter.ts';
import {
  Users,
  Search,
  Download,
  Trash2,
  Eye,
  Key,
  Lock,
  RefreshCw,
  Loader2,
  FileSpreadsheet,
  Printer,
  X,
  MapPin,
  CheckCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectParticipant: (participant: Participant) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectParticipant,
}) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('techsym_admin_auth') === 'true';
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Selected participant for modal view inside Admin
  const [previewParticipant, setPreviewParticipant] = useState<Participant | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Handle Passcode login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
    if (cleanPass === 'admin123' || cleanPass.length >= 6) {
      setIsAuthenticated(true);
      sessionStorage.setItem('techsym_admin_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError('Invalid passcode. Please enter the authorized staff passcode.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('techsym_admin_auth');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchParticipantsList({
        search,
        department: departmentFilter,
        year: yearFilter,
        adminPasscode: passcode || 'admin123',
        limit: 200,
      });
      if (res.success && res.data) {
        setParticipants(res.data);
        setTotal(res.total || res.data.length);
      }
    } catch (err: any) {
      console.error('Failed to load participants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, departmentFilter, yearFilter]);

  const handleDelete = async (p: Participant) => {
    if (
      !window.confirm(
        `Are you sure you want to delete participant ${p.name}?`
      )
    ) {
      return;
    }

    try {
      await deleteParticipantApi(p.participantId, passcode || 'admin123');
      setParticipants((prev) => prev.filter((item) => item.participantId !== p.participantId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      alert(err.message || 'Could not delete participant.');
    }
  };

  // Direct download for a participant
  const handleDownloadSinglePng = async (p: Participant) => {
    try {
      const fileName = `TechSym_SaRaYu26_${p.name.replace(/\s+/g, '_')}_IDCard`;
      await downloadIdCardAsImage(p, fileName);
    } catch (err) {
      console.warn('Direct download error:', err);
    }
  };

  const handleDownloadSinglePdf = async (p: Participant) => {
    try {
      const fileName = `TechSym_SaRaYu26_${p.name.replace(/\s+/g, '_')}_IDCard`;
      await downloadIdCardAsPdf(p, fileName);
    } catch (err) {
      console.warn('PDF export error:', err);
    }
  };

  const handleExportCsv = () => {
    if (participants.length === 0) {
      alert('No participant records to export.');
      return;
    }

    const headers = [
      'Student Name',
      'Branch / Department',
      'Year',
      'College Name',
      'Place',
      'Register Number',
      'Mobile Phone',
      'Email Address',
      'Participant ID',
      'Registered At',
    ];

    const rows = participants.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.department.replace(/"/g, '""')}"`,
      `"${p.year}"`,
      `"${p.college.replace(/"/g, '""')}"`,
      `"${(p.place || 'Tiruchengode, Namakkal').replace(/"/g, '""')}"`,
      `"${p.registerNumber}"`,
      `"${p.phone}"`,
      `"${p.email}"`,
      `"${p.participantId}"`,
      `"${p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `TechSym_SaRaYu_26_Registered_Students_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md py-12 px-4">
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              College Admin &amp; Staff Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Restricted to authorized coordinators of Sengunthar Engineering College.
            </p>
          </div>

          {authError && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Staff Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter staff passcode"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 text-sm font-bold shadow-md transition-colors cursor-pointer"
            >
              <Key className="h-4 w-4" />
              <span>Enter Admin Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-4 space-y-6">
      {/* Top Controls & Metrics */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Sengunthar Engineering College • TechSym SaRaYu-26
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
            <span>Registered Participants</span>
            <span className="rounded-full bg-indigo-100 text-indigo-800 text-xs px-3 py-1 font-bold">
              {total} Total
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time participant rosters, horizontal ID card management &amp; CSV export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadData()}
            placeholder="Search by student name, place, branch, register number..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-700"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept.code} value={dept.code}>
              {dept.shortName} ({dept.code})
            </option>
          ))}
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-700"
        >
          <option value="">All Years</option>
          {YEARS.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-indigo-600" />
            <p className="text-xs">Loading registered participants...</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="h-10 w-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No participants found</p>
            <p className="text-xs text-slate-400 mt-1">
              Participants will appear here once students submit the registration form.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-3">Photo</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Branch</th>
                  <th className="py-3 px-3">Year</th>
                  <th className="py-3 px-3">College</th>
                  <th className="py-3 px-3">Place</th>
                  <th className="py-3 px-3">Registered At</th>
                  <th className="py-3 px-3 text-right">ID Card Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {participants.map((p) => (
                  <tr key={p.participantId} className="hover:bg-slate-50 transition-colors">
                    {/* Photo */}
                    <td className="py-2.5 px-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                        {p.photo ? (
                          <img
                            src={p.photo}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                    </td>

                    {/* Student Name & Register Number */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 uppercase">
                        {p.name}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Reg: {p.registerNumber}
                      </span>
                    </td>

                    {/* Branch */}
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-indigo-700">{p.departmentCode}</span>
                      <span className="block text-[10px] text-slate-500 truncate max-w-[130px]">
                        {p.department}
                      </span>
                    </td>

                    {/* Year */}
                    <td className="py-2.5 px-3 font-medium text-slate-700">
                      {p.year}
                    </td>

                    {/* College */}
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[140px]" title={p.college}>
                      {p.college}
                    </td>

                    {/* Place */}
                    <td className="py-2.5 px-3 text-slate-800 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                        <span className="truncate max-w-[120px]">{p.place || 'Tiruchengode'}</span>
                      </div>
                    </td>

                    {/* Registered At */}
                    <td className="py-2.5 px-3 text-[10.5px] text-slate-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                    </td>

                    {/* ID Card Actions */}
                    <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                      {/* View Modal */}
                      <button
                        onClick={() => setPreviewParticipant(p)}
                        title="View Horizontal ID Card"
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>

                      {/* Download PNG */}
                      <button
                        onClick={() => handleDownloadSinglePng(p)}
                        title="Download Landscape PNG ID Card"
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Download className="h-3 w-3" />
                        <span>PNG</span>
                      </button>

                      {/* Download PDF */}
                      <button
                        onClick={() => handleDownloadSinglePdf(p)}
                        title="Download Landscape PDF"
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white px-2 py-1 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <span>PDF</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(p)}
                        title="Delete record"
                        className="inline-flex items-center rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADMIN PREVIEW MODAL FOR HORIZONTAL ID CARD */}
      {previewParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  TechSym SaRaYu-26 ID Card
                </h3>
                <p className="text-xs text-slate-500">
                  Participant: <strong>{previewParticipant.name}</strong> • {previewParticipant.department}
                </p>
              </div>
              <button
                onClick={() => setPreviewParticipant(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Horizontal ID Card Preview */}
            <div className="flex justify-center p-2 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
              <IdCard participant={previewParticipant} />
            </div>

            {/* Actions for Admin */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                onClick={() => handleDownloadSinglePng(previewParticipant)}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-xs shadow-md transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download PNG Card</span>
              </button>

              <button
                onClick={() => handleDownloadSinglePdf(previewParticipant)}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 text-xs shadow-sm transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4 text-amber-400" />
                <span>Download PDF Card</span>
              </button>

              <button
                onClick={printIdCard}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold px-4 py-2.5 text-xs transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4 text-slate-600" />
                <span>Print Card</span>
              </button>

              <button
                onClick={() => setPreviewParticipant(null)}
                className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
