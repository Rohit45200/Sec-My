import React, { useState, useEffect } from 'react';
import { Participant } from '../types/participant.ts';
import { IdCard } from './IdCard.tsx';
import { downloadIdCardAsImage, downloadIdCardAsPdf, printIdCard } from '../utils/idCardExporter.ts';
import { renderIdCardToPng } from '../utils/canvasCardRenderer.ts';
import {
  Download,
  Printer,
  FileText,
  Share2,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Eye,
  X,
} from 'lucide-react';

interface IdCardModalProps {
  participant: Participant;
  onClose?: () => void;
  onNewRegistration?: () => void;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({
  participant,
  onClose,
  onNewRegistration,
}) => {
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [cachedPng, setCachedPng] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const cardElementId = `techsym-card-${participant.participantId}`;
  const fileName = `TechSym_SaRaYu26_${participant.name.replace(/\s+/g, '_')}_IDCard`;

  // Pre-render pure canvas PNG in background so download is instant
  useEffect(() => {
    renderIdCardToPng(participant)
      .then((png) => setCachedPng(png))
      .catch((err) => console.warn('Pre-render canvas error:', err));
  }, [participant]);

  const handleDownloadImage = async () => {
    try {
      setDownloadingImg(true);
      setDownloadNotice(null);
      const dataUrl = await downloadIdCardAsImage(participant, fileName);
      setCachedPng(dataUrl);
      setDownloadNotice('✓ Landscape ID Card downloaded! Check your browser downloads folder.');
    } catch (err) {
      console.warn('Image download fallback:', err);
      setShowImagePreview(true);
    } finally {
      setDownloadingImg(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      setDownloadNotice(null);
      await downloadIdCardAsPdf(participant, fileName);
      setDownloadNotice('✓ Printable Landscape PDF downloaded! Check your downloads.');
    } catch (err) {
      console.warn('PDF export fallback:', err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/#verify-${participant.participantId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mx-auto max-w-4xl py-4 sm:py-6">
      {/* Top Banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-4 sm:p-6 text-white shadow-lg print:hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="rounded-full bg-white/20 p-2.5 shrink-0">
              <Sparkles className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-100">
                Official Symposium ID Card Ready
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                ID Card Generated Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-50 mt-0.5">
                Participant: <strong className="text-white">{participant.name}</strong> •{' '}
                <span className="text-emerald-100">{participant.department}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {onNewRegistration && (
              <button
                onClick={onNewRegistration}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>New Registration</span>
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-lg bg-white text-emerald-950 px-3.5 py-2 text-xs font-bold hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Horizontal ID Card Graphic */}
        <div className="w-full lg:flex-1 flex flex-col items-center">
          <div className="w-full flex justify-center bg-slate-100/90 p-3 sm:p-5 rounded-3xl border border-slate-200 shadow-inner overflow-x-auto">
            <IdCard participant={participant} elementId={cardElementId} />
          </div>
        </div>

        {/* Actions & Details Sidebar */}
        <div className="w-full lg:w-80 space-y-4 print:hidden shrink-0">
          {/* Quick Actions Card */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Download className="h-4 w-4 text-indigo-600" />
              <span>Download &amp; Print</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Horizontal landscape card ready for instant download or printing on A4/card paper.
            </p>

            {/* Download Status Notification */}
            {downloadNotice && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{downloadNotice}</span>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              {/* PRIMARY 1: DOWNLOAD PNG */}
              <button
                onClick={handleDownloadImage}
                disabled={downloadingImg}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{downloadingImg ? 'Generating Image...' : 'Download ID Card (PNG)'}</span>
              </button>

              {/* PRIMARY 2: DOWNLOAD PDF */}
              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 text-sm font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-amber-400" />
                <span>{downloadingPdf ? 'Exporting PDF...' : 'Download ID Card (PDF)'}</span>
              </button>

              {/* MOBILE FAILSAFE: DIRECT VIEW & LONG-PRESS SAVE */}
              <button
                onClick={() => setShowImagePreview(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Open image preview for direct save/long-press on mobile"
              >
                <Eye className="h-4 w-4 text-amber-700" />
                <span>View / Save Image (Mobile)</span>
              </button>

              {/* PRINT BUTTON */}
              <button
                onClick={printIdCard}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 px-4 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Printer className="h-4 w-4 text-slate-600" />
                <span>Print ID Card</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 text-slate-500" />
                    <span>Copy Verification URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Symposium Schedule
            </h4>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Paper Presentation: <strong>30 September 2026</strong>.</li>
              <li>Technical Events: <strong>01 October 2026</strong>.</li>
              <li>Carry your digital or printed ID card for campus entry.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* POPUP PREVIEW FOR DIRECT SAVE / LONG-PRESS ON MOBILE */}
      {showImagePreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  TechSym SaRaYu-26 ID Card
                </h3>
                <p className="text-xs text-slate-500">
                  Mobile par image ko 2 second press karein aur <strong>"Save Image"</strong> chunein.
                </p>
              </div>
              <button
                onClick={() => setShowImagePreview(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
              {cachedPng ? (
                <img
                  src={cachedPng}
                  alt="TechSym SaRaYu-26 ID Card"
                  className="max-h-[50vh] object-contain rounded-xl shadow-md"
                />
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  Rendering image...
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {cachedPng && (
                <a
                  href={cachedPng}
                  download={`${fileName}.png`}
                  className="w-full text-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-xs shadow-md transition-colors"
                >
                  Click Here To Save Image File (.PNG)
                </a>
              )}
              <button
                onClick={() => setShowImagePreview(false)}
                className="w-full text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 text-xs transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
