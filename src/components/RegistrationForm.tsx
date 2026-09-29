import React, { useState, useRef, ChangeEvent } from 'react';
import confetti from 'canvas-confetti';
import {
  DEPARTMENTS,
  YEARS,
  PARTICIPANT_TYPES,
  COLLEGE_INFO,
  SYMPOSIUM_INFO,
} from '../constants/symposiumData.ts';
import { Participant, ParticipantFormData } from '../types/participant.ts';
import { compressStudentPhoto } from '../utils/imageCompressor.ts';
import { generateDefaultAvatar } from '../utils/defaultAvatar.ts';
import { registerParticipant } from '../services/api.ts';
import { WebcamCaptureModal } from './WebcamCaptureModal.tsx';
import {
  Upload,
  Camera,
  CheckCircle,
  AlertTriangle,
  User,
  Sparkles,
  Loader2,
  Search,
  Zap,
  Image as ImageIcon,
} from 'lucide-react';

interface RegistrationFormProps {
  onSuccess: (participant: Participant) => void;
  onNavigateToSearch?: (regNo: string) => void;
  initialDepartment?: string;
  initialEvent?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onNavigateToSearch,
  initialDepartment,
  initialEvent,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const initialDeptObj =
    (initialDepartment &&
      DEPARTMENTS.find(
        (d) => d.name === initialDepartment || d.code === initialDepartment || d.wingName === initialDepartment
      )) ||
    DEPARTMENTS[0];

  const [formData, setFormData] = useState<ParticipantFormData>({
    name: '',
    registerNumber: '',
    department: initialDeptObj.name,
    year: YEARS[2], // 3rd Year default
    college: COLLEGE_INFO.name,
    place: 'Tiruchengode, Namakkal',
    email: '',
    phone: '',
    event: initialEvent || initialDeptObj.events[0] || SYMPOSIUM_INFO.name,
    participantType: PARTICIPANT_TYPES[0],
    photo: '',
  });

  // Track currently selected department details
  const currentDeptObj =
    DEPARTMENTS.find((d) => d.name === formData.department) || DEPARTMENTS[0];

  const [photoInfo, setPhotoInfo] = useState<{
    fileName: string;
    originalSizeKb: number;
    compressedSizeKb: number;
  } | null>(null);

  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationSummary, setValidationSummary] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [duplicateRegNo, setDuplicateRegNo] = useState<string | null>(null);

  // Field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'department') {
      const match = DEPARTMENTS.find((d) => d.name === value);
      setFormData((prev) => ({
        ...prev,
        department: value,
        event: match && match.events.length > 0 ? match.events[0] : prev.event,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'registerNumber' ? value.toUpperCase() : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setValidationSummary(null);
    setServerError(null);
    setDuplicateRegNo(null);
  };

  // Photo processing
  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.photo;
        return next;
      });
      setValidationSummary(null);

      const originalSizeKb = Math.round(file.size / 1024);
      const compressedDataUrl = await compressStudentPhoto(file, 400, 500, 0.85);
      const compressedSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

      setFormData((prev) => ({ ...prev, photo: compressedDataUrl }));
      setPhotoInfo({
        fileName: file.name,
        originalSizeKb,
        compressedSizeKb,
      });
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        photo: err.message || 'Failed to process photo.',
      }));
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  // Apply default student avatar
  const handleUseDefaultAvatar = () => {
    const defaultPhoto = generateDefaultAvatar(formData.name || 'Student', 'SEC');
    setFormData((prev) => ({ ...prev, photo: defaultPhoto }));
    setPhotoInfo({
      fileName: 'Official Badge Avatar',
      originalSizeKb: 2,
      compressedSizeKb: 2,
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });
    setValidationSummary(null);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: '' }));
    setPhotoInfo(null);
  };

  const handleCameraCapture = (dataUrl: string) => {
    const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
    setFormData((prev) => ({ ...prev, photo: dataUrl }));
    setPhotoInfo({
      fileName: 'Live Webcam Photo',
      originalSizeKb: sizeKb,
      compressedSizeKb: sizeKb,
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });
    setValidationSummary(null);
  };

  // 1-Click quick fill demo data for instant testing
  const handleFillDemo = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const demoName = 'Rohit Kumar';
    const demoAvatar = generateDefaultAvatar(demoName, 'CSE');

    setFormData({
      name: demoName,
      registerNumber: `732421104${randomSuffix.toString().substring(0, 3)}`,
      department: DEPARTMENTS[0].name,
      year: '3rd Year',
      college: COLLEGE_INFO.name,
      place: 'Tiruchengode, Namakkal',
      email: `rohit.${randomSuffix}@sengunthar.edu.in`,
      phone: '9876543210',
      event: SYMPOSIUM_INFO.name,
      participantType: PARTICIPANT_TYPES[0],
      photo: demoAvatar,
    });
    setPhotoInfo({
      fileName: 'Official Demo Portrait',
      originalSizeKb: 2,
      compressedSizeKb: 2,
    });
    setErrors({});
    setValidationSummary(null);
    setServerError(null);
    setDuplicateRegNo(null);
  };

  // Frontend validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const missing: string[] = [];

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (minimum 2 characters)';
      missing.push('Full Name');
    }

    if (!formData.registerNumber.trim() || formData.registerNumber.trim().length < 3) {
      newErrors.registerNumber = 'Please enter a valid register / roll number';
      missing.push('Register Number');
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Please select your department';
      missing.push('Department');
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Please select your year of study';
      missing.push('Year of Study');
    }

    if (!formData.college.trim()) {
      newErrors.college = 'Please enter your college name';
      missing.push('College Name');
    }

    if (!formData.place || !formData.place.trim()) {
      newErrors.place = 'Please enter your place / city';
      missing.push('Place / City');
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
      missing.push('Valid Email');
    }

    const cleanDigits = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanDigits || cleanDigits.length < 10) {
      newErrors.phone = 'Please provide a valid 10-digit mobile number';
      missing.push('10-digit Mobile Number');
    }

    // If photo is missing, auto-apply default avatar so user is never blocked!
    if (!formData.photo) {
      // Auto-assign default avatar
      const defaultPhoto = generateDefaultAvatar(formData.name || 'Student', 'SEC');
      setFormData((prev) => ({ ...prev, photo: defaultPhoto }));
    }

    setErrors(newErrors);

    if (missing.length > 0) {
      setValidationSummary(`Please complete required field(s): ${missing.join(', ')}`);
      return false;
    }

    setValidationSummary(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setDuplicateRegNo(null);

    // Prepare photo if not attached yet
    let payload = { ...formData };
    if (!payload.photo) {
      payload.photo = generateDefaultAvatar(payload.name || 'Student', 'SEC');
      setFormData(payload);
    }

    if (!validate()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await registerParticipant(payload);

      if (res.success && res.data) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (_) {}

        onSuccess(res.data);
      } else {
        throw new Error(res.error || 'Registration failed');
      }
    } catch (err: any) {
      const msg = err.message || 'Something went wrong. Please try again.';
      setServerError(msg);

      if (msg.toLowerCase().includes('already registered')) {
        setDuplicateRegNo(formData.registerNumber);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-sm border border-slate-200">
        {/* Header with Quick Fill Demo Button */}
        <div className="border-b border-slate-100 pb-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Participant Registration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Generate Your TechSym SaRaYu-26 ID Card
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your details to generate your official verified symposium delegate badge.
            </p>
          </div>

          {/* Quick Demo Fill button */}
          <button
            type="button"
            onClick={handleFillDemo}
            className="self-start sm:self-center flex items-center gap-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-2 text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            title="Auto-fill sample student details to quickly test ID card generation"
          >
            <Zap className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
            <span>Fill Demo Data</span>
          </button>
        </div>

        {/* Official Brochure Highlight Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-indigo-900">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-400 text-slate-950 font-black px-2.5 py-1 text-xs uppercase tracking-wider shrink-0">
              ₹250 FEE
            </div>
            <div className="text-xs">
              <div className="font-bold text-amber-300">
                Registration Fee: ₹250 Per Participant
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Paper: <strong>30.09.2026</strong> • Tech Events: <strong>01.10.2026</strong> • Reg Ends: <strong>26.09.2026</strong>
              </p>
            </div>
          </div>
          <div className="text-[11px] text-emerald-300 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30 shrink-0">
            ✓ Food &amp; Refreshments Included
          </div>
        </div>

        {/* Validation Warning Alert */}
        {validationSummary && (
          <div className="mb-5 rounded-xl bg-amber-50 border border-amber-300 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Form Incomplete / Form Adhura Hai</p>
              <p className="mt-0.5">{validationSummary}</p>
            </div>
          </div>
        )}

        {/* Server / Duplicate Alert */}
        {serverError && (
          <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-800 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{serverError}</p>
              {duplicateRegNo && onNavigateToSearch && (
                <button
                  type="button"
                  onClick={() => onNavigateToSearch(duplicateRegNo)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Retrieve ID Card for {duplicateRegNo}</span>
                </button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PHOTO UPLOAD SECTION */}
          <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Student Photo / Passport Photo
              </label>
              <span className="text-[11px] text-slate-500">
                (Upload photo or use default badge avatar)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Upload your photo, take a selfie, or click "Use Default Avatar" if you do not have a photo file ready.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Photo Preview Box */}
              <div className="relative w-28 h-36 rounded-xl border-2 border-dashed border-slate-300 bg-white shadow-xs overflow-hidden flex items-center justify-center shrink-0">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Participant Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                    <User className="h-8 w-8 mb-1 text-slate-300" />
                    <span className="text-[10px] font-medium leading-tight">No photo uploaded</span>
                  </div>
                )}

                {isCompressing && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center text-indigo-600">
                    <Loader2 className="h-6 w-6 animate-spin mb-1" />
                    <span className="text-[10px] font-bold">Optimizing...</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 w-full space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3.5 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Upload Photo From Gallery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsWebcamOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Camera className="h-3.5 w-3.5 text-amber-300" />
                    <span>Take Selfie (Live Camera)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUseDefaultAvatar}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    title="Generate an official student avatar with your initial"
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Use Default Avatar</span>
                  </button>

                  {formData.photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {photoInfo && (
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 mt-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Photo ready: {photoInfo.fileName} ({photoInfo.compressedSizeKb} KB)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BASIC INFORMATION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. S. PRAVEEN KUMAR"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                  errors.name
                    ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Register Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Register Number / Roll No <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="registerNumber"
                value={formData.registerNumber}
                onChange={handleChange}
                placeholder="e.g. 732421104042"
                className={`w-full font-mono uppercase rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                  errors.registerNumber
                    ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
              />
              {errors.registerNumber && (
                <p className="text-xs text-rose-600 mt-1">{errors.registerNumber}</p>
              )}
            </div>
          </div>

          {/* ACADEMIC DETAILS GRID */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Department &amp; Technical Wing <span className="text-rose-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.code} value={dept.name}>
                      {dept.name} — {dept.wingName} ({dept.shortName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Year of Study <span className="text-rose-500">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                >
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department Wing & Coordinators Info Card */}
            <div className="rounded-2xl bg-indigo-50/60 border border-indigo-200/80 p-3.5 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  <span>Wing: <strong className="text-indigo-700">{currentDeptObj.wingName}</strong> ({currentDeptObj.shortName})</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Official Coordinators
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1 border-t border-indigo-100">
                <div className="bg-white/80 p-2 rounded-xl border border-indigo-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty In-Charge</span>
                  <div className="font-bold text-slate-900">{currentDeptObj.coordinator.facultyName}</div>
                  <div className="text-slate-500 text-[10px]">{currentDeptObj.coordinator.facultyDesignation}</div>
                  <a
                    href={`tel:${currentDeptObj.coordinator.facultyPhone}`}
                    className="font-mono text-indigo-600 font-bold hover:underline mt-0.5 inline-block"
                  >
                    📞 {currentDeptObj.coordinator.facultyPhone}
                  </a>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-indigo-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Coordinator</span>
                  <div className="font-bold text-slate-900">{currentDeptObj.coordinator.studentName}</div>
                  <div className="text-slate-500 text-[10px]">{currentDeptObj.coordinator.studentClass}</div>
                  <a
                    href={`tel:${currentDeptObj.coordinator.studentPhone}`}
                    className="font-mono text-indigo-600 font-bold hover:underline mt-0.5 inline-block"
                  >
                    📞 {currentDeptObj.coordinator.studentPhone}
                  </a>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 font-mono pt-1">
                Official Email: <a href={`mailto:${currentDeptObj.coordinator.email}`} className="text-indigo-600 font-bold hover:underline">{currentDeptObj.coordinator.email}</a>
              </div>
            </div>
          </div>

          {/* COLLEGE, PLACE & PARTICIPANT TYPE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* College Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                College / Institution <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. Sengunthar Engineering College"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 ${
                  errors.college
                    ? 'border-rose-300 focus:ring-rose-400'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
              />
              {errors.college && <p className="text-xs text-rose-600 mt-1">{errors.college}</p>}
            </div>

            {/* Place / City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Place / City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="e.g. Tiruchengode, Namakkal"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 ${
                  errors.place
                    ? 'border-rose-300 focus:ring-rose-400'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
              />
              {errors.place && <p className="text-xs text-rose-600 mt-1">{errors.place}</p>}
            </div>

            {/* Participant Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="participantType"
                value={formData.participantType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
              >
                {PARTICIPANT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@sengunthar.edu.in"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                  errors.email
                    ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number (e.g. 9876543210)"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
                  errors.phone
                    ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* EVENT / COMPETITION TRACK SELECT */}
          <div className="rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Choose Specific Event / Competition <span className="text-rose-500">*</span>
              </label>
              <span className="font-mono text-indigo-700 text-xs font-bold">
                Dates: 30 Sep &amp; 01 Oct 2026
              </span>
            </div>

            <select
              name="event"
              value={formData.event}
              onChange={handleChange}
              className="w-full rounded-xl border border-indigo-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
            >
              {currentDeptObj.events.map((ev) => (
                <option key={ev} value={`${ev} (${currentDeptObj.wingName})`}>
                  {ev} — {currentDeptObj.wingName} Track
                </option>
              ))}
              <option value={`All ${currentDeptObj.wingName} Events`}>
                All {currentDeptObj.wingName} Events &amp; Competitions
              </option>
            </select>
            <p className="text-[11px] text-slate-500">
              Paper Presentation: <strong>30.09.2026</strong> • Technical Events: <strong>01.10.2026</strong> • ₹250 Per Participant
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white px-6 py-3.5 text-base font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating ID Card &amp; Registering...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  <span>Generate My ID Card</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Your unique ID will be generated automatically in format{' '}
              <strong className="text-slate-600">TS26-&lt;DEPT&gt;-001</strong>.
            </p>
          </div>
        </form>
      </div>

      {/* Live Webcam Selfie Modal */}
      <WebcamCaptureModal
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};
