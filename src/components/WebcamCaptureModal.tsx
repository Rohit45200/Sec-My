import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface WebcamCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export const WebcamCaptureModal: React.FC<WebcamCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Start webcam
  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);
    setCapturedPhoto(null);

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsLoading(false);
    } catch (err: any) {
      console.warn('Webcam start error:', err);
      setIsLoading(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No webcam or camera device was found on this system.');
      } else {
        setCameraError(err.message || 'Could not access camera.');
      }
    }
  };

  // Stop webcam stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Capture frame to canvas
  const handleSnap = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center for portrait 4:5 ratio
    const videoRatio = video.videoWidth / video.videoHeight;
    const targetRatio = 400 / 500;

    let sx = 0;
    let sy = 0;
    let sw = video.videoWidth;
    let sh = video.videoHeight;

    if (videoRatio > targetRatio) {
      sw = video.videoHeight * targetRatio;
      sx = (video.videoWidth - sw) / 2;
    } else {
      sh = video.videoWidth / targetRatio;
      sy = (video.videoHeight - sh) / 2;
    }

    // Mirror image horizontally for intuitive selfie experience
    ctx.translate(400, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, 400, 500);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  // Confirm photo
  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <Camera className="h-5 w-5" />
            <span>Take Student Selfie / Photo</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Camera Area */}
        <div className="relative w-full aspect-4/5 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-inner">
          {capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Selfie Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-cover scale-x-[-1] ${
                  cameraError || isLoading ? 'hidden' : 'block'
                }`}
              />

              {/* Oval face guide overlay */}
              {!cameraError && !isLoading && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-64 rounded-full border-2 border-dashed border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]"></div>
                  <span className="absolute bottom-4 text-[11px] font-semibold text-white/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                    Align your face inside the frame
                  </span>
                </div>
              )}
            </>
          )}

          {isLoading && !cameraError && (
            <div className="flex flex-col items-center justify-center text-slate-300 p-4 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-400 mb-2" />
              <p className="text-xs">Starting camera...</p>
            </div>
          )}

          {cameraError && (
            <div className="flex flex-col items-center justify-center text-rose-300 p-6 text-center space-y-2">
              <AlertCircle className="h-10 w-10 text-rose-400" />
              <p className="text-xs text-rose-200">{cameraError}</p>
              <button
                type="button"
                onClick={startCamera}
                className="mt-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-3">
          {capturedPhoto ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 text-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retake Photo</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 text-xs shadow-md transition-colors cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Use This Photo</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!!cameraError || isLoading}
              onClick={handleSnap}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 text-sm shadow-md transition-all cursor-pointer"
            >
              <Camera className="h-5 w-5 text-amber-300" />
              <span>Capture Photo / Selfie</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
